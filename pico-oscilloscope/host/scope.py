#!/usr/bin/env python3
"""Host-side viewer for the Raspberry Pi Pico oscilloscope.

Reads sample frames streamed over USB serial from the Pico firmware
(firmware/main.py) and plots them live with matplotlib.

Examples
--------
    # Auto-detect the port, default 10 kHz, 512-sample frames:
    python scope.py

    # Explicit port, 50 kHz, rising-edge trigger at 1.65 V (mid-scale):
    python scope.py --port /dev/ttyACM0 --rate 50000 --trigger 1.65

    # Dump one frame to CSV instead of plotting (no GUI needed):
    python scope.py --csv one_frame.csv
"""

import argparse
import struct
import sys
import threading
import time

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    sys.exit("pyserial is required:  pip install -r requirements.txt")

import numpy as np

MAGIC = b"\xA5\x5A"
VREF = 3.3            # Pico ADC reference voltage
ADC_FULL_SCALE = 65535   # read_u16() range


def volts(u16):
    return (np.asarray(u16, dtype=np.float64) / ADC_FULL_SCALE) * VREF


def volts_to_u16(v):
    return int(round(max(0.0, min(VREF, v)) / VREF * ADC_FULL_SCALE))


def find_port():
    """Best-effort auto-detect of a Pico USB CDC port."""
    for p in serial.tools.list_ports.comports():
        desc = f"{p.description} {p.manufacturer or ''} {p.product or ''}".lower()
        # Pico enumerates with the Raspberry Pi VID (0x2E8A).
        if (p.vid == 0x2E8A) or ("pico" in desc) or ("micropython" in desc) \
                or ("board in fs mode" in desc):
            return p.device
    # Fall back to the first ACM/usbmodem-style port if there's exactly one.
    candidates = [
        p.device for p in serial.tools.list_ports.comports()
        if "ACM" in p.device or "usbmodem" in p.device or "usbserial" in p.device
    ]
    if len(candidates) == 1:
        return candidates[0]
    return None


class ScopeReader(threading.Thread):
    """Background thread: parses frames off the serial port and keeps the most
    recent one available for the UI."""

    def __init__(self, ser):
        super().__init__(daemon=True)
        self.ser = ser
        self._lock = threading.Lock()
        self._frame = None          # (samples np.array, actual_rate)
        self._running = True

    def stop(self):
        self._running = False

    def latest(self):
        with self._lock:
            return self._frame

    def _read_exact(self, n):
        buf = bytearray()
        while len(buf) < n and self._running:
            chunk = self.ser.read(n - len(buf))
            if chunk:
                buf.extend(chunk)
        return bytes(buf)

    def _sync_to_magic(self):
        """Advance the stream until the 2-byte frame magic is found."""
        window = bytearray()
        while self._running:
            b = self.ser.read(1)
            if not b:
                continue
            window.extend(b)
            if len(window) > 2:
                del window[0]
            if bytes(window) == MAGIC:
                return True
        return False

    def run(self):
        while self._running:
            if not self._sync_to_magic():
                break
            header = self._read_exact(6)   # frame_size(u16) + rate(u32)
            if len(header) < 6:
                break
            frame_size, rate = struct.unpack("<HI", header)
            if frame_size == 0 or frame_size > 8192:
                # Bogus length -- desync; resync on the next magic.
                continue
            payload = self._read_exact(frame_size * 2)
            if len(payload) < frame_size * 2:
                break
            samples = np.frombuffer(payload, dtype="<u2").copy()
            with self._lock:
                self._frame = (samples, rate)


def open_serial(port, timeout=1.0):
    ser = serial.Serial(port, baudrate=115200, timeout=timeout)
    # USB CDC ignores baud rate, but toggling DTR resets some setups; give the
    # firmware a moment to settle after the port opens.
    time.sleep(0.3)
    ser.reset_input_buffer()
    return ser


def send(ser, line):
    ser.write((line + "\n").encode())
    ser.flush()


def configure(ser, args):
    send(ser, f"RATE {args.rate}")
    send(ser, f"FRAME {args.frame}")
    if args.trigger is not None:
        send(ser, f"EDGE {'falling' if args.falling else 'rising'}")
        send(ser, f"TRIG {volts_to_u16(args.trigger)}")
    else:
        send(ser, "TRIG off")


def run_csv(reader, ser, path):
    print("Waiting for a frame...", file=sys.stderr)
    frame = None
    deadline = time.time() + 5
    while time.time() < deadline:
        frame = reader.latest()
        if frame is not None:
            break
        time.sleep(0.05)
    if frame is None:
        sys.exit("No frame received. Check wiring, port, and that firmware is running.")
    samples, rate = frame
    dt = 1.0 / rate
    with open(path, "w") as f:
        f.write("time_s,volts,raw_u16\n")
        for i, s in enumerate(samples):
            f.write(f"{i * dt:.9f},{volts(s):.5f},{int(s)}\n")
    print(f"Wrote {len(samples)} samples to {path} (rate {rate} Hz).")


def run_gui(reader, args):
    import matplotlib.pyplot as plt
    from matplotlib.animation import FuncAnimation

    fig, ax = plt.subplots(figsize=(10, 5))
    (line,) = ax.plot([], [], lw=1.2, color="#00c853")
    ax.set_facecolor("#0d1b0d")
    ax.set_ylim(-0.1, VREF + 0.1)
    ax.set_ylabel("Volts")
    ax.set_xlabel("Time (ms)")
    ax.grid(True, color="#1f3b1f")
    title = ax.set_title("Pico Scope — waiting for data…")

    if args.trigger is not None:
        ax.axhline(args.trigger, color="#ff6d00", lw=0.8, ls="--")

    def update(_):
        frame = reader.latest()
        if frame is None:
            return line, title
        samples, rate = frame
        t_ms = np.arange(len(samples)) * (1000.0 / rate)
        v = volts(samples)
        line.set_data(t_ms, v)
        ax.set_xlim(0, t_ms[-1] if len(t_ms) else 1)
        vpp = v.max() - v.min()
        title.set_text(
            f"Pico Scope — {rate/1000:.1f} kHz  |  {len(samples)} pts  |  "
            f"Vpp {vpp:.2f} V  mean {v.mean():.2f} V"
        )
        return line, title

    FuncAnimation(fig, update, interval=40, blit=False, cache_frame_data=False)
    plt.tight_layout()
    plt.show()


def main():
    ap = argparse.ArgumentParser(description="Raspberry Pi Pico oscilloscope viewer")
    ap.add_argument("--port", help="serial port (auto-detected if omitted)")
    ap.add_argument("--rate", type=int, default=10000, help="target sample rate in Hz")
    ap.add_argument("--frame", type=int, default=512, help="samples per frame")
    ap.add_argument("--trigger", type=float, metavar="VOLTS",
                    help="enable edge trigger at this voltage level")
    ap.add_argument("--falling", action="store_true",
                    help="trigger on the falling edge instead of rising")
    ap.add_argument("--csv", metavar="FILE",
                    help="capture a single frame to CSV and exit (no GUI)")
    args = ap.parse_args()

    port = args.port or find_port()
    if not port:
        sys.exit("Could not auto-detect the Pico. Pass --port explicitly "
                 "(e.g. --port /dev/ttyACM0 or --port COM5).")
    print(f"Using serial port {port}", file=sys.stderr)

    ser = open_serial(port)
    reader = ScopeReader(ser)
    reader.start()

    configure(ser, args)
    send(ser, "START")

    try:
        if args.csv:
            run_csv(reader, ser, args.csv)
        else:
            run_gui(reader, args)
    finally:
        try:
            send(ser, "STOP")
        except Exception:
            pass
        reader.stop()
        ser.close()


if __name__ == "__main__":
    main()
