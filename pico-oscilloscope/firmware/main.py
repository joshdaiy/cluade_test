# Simple oscilloscope firmware for the Raspberry Pi Pico (MicroPython).
#
# Samples one ADC channel and streams frames of samples over USB serial to a
# host program. Supports a target sample rate, a configurable frame size, and a
# simple edge trigger. Line-based text commands come in on stdin; sample frames
# go out on stdout as raw binary.
#
# Wiring: feed the signal into GPIO26 (ADC0). Keep it between 0 V and 3.3 V --
# the Pico ADC has NO input protection, so use a divider/clamp for anything
# outside that range.
#
# Protocol
# --------
# Host -> Pico, one ASCII command per line (\n terminated):
#   START               begin streaming frames
#   STOP                stop streaming
#   RATE <hz>           set target sample rate in Hz (100 .. 500000)
#   FRAME <n>           samples per frame (16 .. 4096)
#   TRIG <level|off>    edge trigger level as u16 (0..65535), or "off"
#   EDGE <rising|falling>
#   PING                reply with "PONG" (used for auto-detection)
#
# Pico -> Host, each frame is:
#   b'\xA5\x5A'         2-byte magic
#   frame_size          uint16, little-endian
#   actual_rate         uint32, little-endian (measured samples/sec)
#   samples             frame_size * uint16, little-endian (0..65535)

import sys
import select
import time
from machine import ADC, Pin

ADC_GPIO = 26            # GPIO26 == ADC0
MAGIC = b"\xA5\x5A"

# --- runtime state -----------------------------------------------------------
running = False
sample_rate = 10000      # target Hz
frame_size = 512         # samples per frame
trig_enabled = False
trig_level = 32768       # u16 midscale
trig_rising = True

adc = ADC(ADC_GPIO)

# Onboard LED as a "streaming" indicator. On the Pico W the LED lives on the
# WiFi chip; "LED" resolves it on both boards in current MicroPython builds.
try:
    led = Pin("LED", Pin.OUT)
except Exception:
    led = None

# Non-blocking line reader on stdin (USB CDC).
_poll = select.poll()
_poll.register(sys.stdin, select.POLLIN)
_rxbuf = ""


def _set_led(on):
    if led is not None:
        led.value(1 if on else 0)


def read_command():
    """Return one complete line from stdin, or None if none is ready."""
    global _rxbuf
    if _poll.poll(0):
        _rxbuf += sys.stdin.read(1)
        if _rxbuf.endswith("\n"):
            line = _rxbuf.strip()
            _rxbuf = ""
            return line
    return None


def handle_command(line):
    global running, sample_rate, frame_size
    global trig_enabled, trig_level, trig_rising

    parts = line.split()
    if not parts:
        return
    cmd = parts[0].upper()

    if cmd == "START":
        running = True
        _set_led(True)
    elif cmd == "STOP":
        running = False
        _set_led(False)
    elif cmd == "RATE" and len(parts) > 1:
        try:
            sample_rate = max(100, min(500000, int(parts[1])))
        except ValueError:
            pass
    elif cmd == "FRAME" and len(parts) > 1:
        try:
            frame_size = max(16, min(4096, int(parts[1])))
        except ValueError:
            pass
    elif cmd == "TRIG" and len(parts) > 1:
        if parts[1].lower() == "off":
            trig_enabled = False
        else:
            try:
                trig_level = max(0, min(65535, int(parts[1])))
                trig_enabled = True
            except ValueError:
                pass
    elif cmd == "EDGE" and len(parts) > 1:
        trig_rising = parts[1].lower().startswith("r")
    elif cmd == "PING":
        print("PONG")


def wait_for_trigger(timeout_us=200000):
    """Block until an edge crosses trig_level, or until timeout. Returns True
    if a real edge was seen, False on timeout (so we still draw something)."""
    deadline = time.ticks_add(time.ticks_us(), timeout_us)
    prev = adc.read_u16()
    while time.ticks_diff(deadline, time.ticks_us()) > 0:
        cur = adc.read_u16()
        if trig_rising:
            if prev < trig_level <= cur:
                return True
        else:
            if prev > trig_level >= cur:
                return True
        prev = cur
    return False


def capture_frame(buf):
    """Fill buf with frame_size samples at (approximately) sample_rate.
    Returns the measured rate in Hz."""
    n = len(buf)
    period_us = 1000000 // sample_rate
    start = time.ticks_us()
    next_t = start
    for i in range(n):
        # Busy-wait to the next sample instant. For high rates period_us may be
        # 0/1 and we simply sample as fast as we can.
        while time.ticks_diff(next_t, time.ticks_us()) > 0:
            pass
        buf[i] = adc.read_u16()
        next_t = time.ticks_add(next_t, period_us)
    elapsed = time.ticks_diff(time.ticks_us(), start)
    if elapsed <= 0:
        elapsed = 1
    return (n * 1000000) // elapsed


def send_frame(buf, actual_rate):
    n = len(buf)
    header = MAGIC + bytes(
        (
            n & 0xFF,
            (n >> 8) & 0xFF,
            actual_rate & 0xFF,
            (actual_rate >> 8) & 0xFF,
            (actual_rate >> 16) & 0xFF,
            (actual_rate >> 24) & 0xFF,
        )
    )
    out = sys.stdout.buffer
    out.write(header)
    # uint16 little-endian payload
    payload = bytearray(n * 2)
    for i in range(n):
        v = buf[i]
        payload[2 * i] = v & 0xFF
        payload[2 * i + 1] = (v >> 8) & 0xFF
    out.write(payload)


def main():
    from array import array

    buf = array("H", [0] * frame_size)
    cur_frame_size = frame_size

    while True:
        line = read_command()
        if line is not None:
            handle_command(line)
            # Frame size may have changed; resize the capture buffer lazily.
            if frame_size != cur_frame_size:
                buf = array("H", [0] * frame_size)
                cur_frame_size = frame_size

        if not running:
            time.sleep_ms(5)
            continue

        if trig_enabled:
            wait_for_trigger()

        rate = capture_frame(buf)
        send_frame(buf, rate)


main()
