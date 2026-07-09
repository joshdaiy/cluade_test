# Pico Oscilloscope

A dead-simple single-channel oscilloscope built from a **Raspberry Pi Pico**
and a laptop. The Pico samples its ADC and streams frames over USB; a small
Python program on the host plots them live.

```
  signal ──► GPIO26 (ADC0) ──► Pico ──USB──► host: scope.py ──► live plot
```

## What you need

- Raspberry Pi Pico (or Pico W / Pico 2) running **MicroPython**
- A USB cable
- Python 3.8+ on the host
- A signal to look at (0–3.3 V). A function generator, another Pico's PWM
  output, or a potentiometer wiper all work.

> ⚠️ **Input range: 0 V to 3.3 V only.** The Pico's ADC has no input
> protection. Negative voltages or anything above ~3.3 V can damage the chip.
> For larger or bipolar signals, add a resistor divider and/or a biasing/clamp
> circuit first.

## Wiring

| Signal            | Pico pin        |
|-------------------|-----------------|
| Signal in         | GPIO26 / ADC0 (pin 31) |
| Signal ground     | any GND (e.g. pin 33)  |

To get a test waveform with nothing but a second Pico or the same one, you can
drive a PWM pin through an RC low-pass filter into GPIO26.

## 1. Flash the firmware

1. Install MicroPython on the Pico (hold BOOTSEL, plug in USB, drop the
   MicroPython `.uf2` onto the `RPI-RP2` drive). See
   <https://micropython.org/download/RPI_PICO/>.
2. Copy `firmware/main.py` to the Pico as `main.py` (so it runs on boot). Use
   [Thonny](https://thonny.org/), `mpremote`, or `rshell`:

   ```bash
   mpremote connect auto fs cp firmware/main.py :main.py
   mpremote connect auto reset
   ```

## 2. Run the viewer

```bash
cd host
pip install -r requirements.txt
python scope.py                 # auto-detects the port, 10 kHz, 512 samples
```

Common options:

```bash
python scope.py --port /dev/ttyACM0 --rate 50000
python scope.py --trigger 1.65             # rising-edge trigger at 1.65 V
python scope.py --trigger 1.65 --falling   # falling-edge trigger
python scope.py --csv capture.csv          # save one frame to CSV, no GUI
```

- `--port` — serial port. Omit to auto-detect (`/dev/ttyACM0`, `COM5`,
  `/dev/tty.usbmodem…`). On Linux you may need to be in the `dialout` group.
- `--rate` — target sample rate in Hz (100–500000). Timing is software-based,
  so the *actual* rate is measured per frame and shown in the plot title.
- `--frame` — samples per captured frame (16–4096).
- `--trigger VOLTS` — draw only after the signal crosses this level, so a
  repetitive waveform stands still instead of scrolling.

## How it works

The firmware reads `ADC0` in a busy-wait loop timed with `ticks_us`, packs each
batch of samples into a binary frame, and writes it to USB serial. The host
runs a background thread that resynchronises on a 2-byte magic marker, decodes
each frame, and hands the latest one to a matplotlib animation.

**Protocol** — host sends newline-terminated ASCII commands
(`START`, `STOP`, `RATE <hz>`, `FRAME <n>`, `TRIG <u16|off>`, `EDGE
<rising|falling>`, `PING`); the Pico replies with binary frames:

```
 b'\xA5\x5A'  |  frame_size (u16 LE)  |  actual_rate (u32 LE)  |  samples (u16 LE × frame_size)
```

## Limitations

This is a learning-grade scope, not a bench instrument:

- **Sample rate** is limited by MicroPython's per-sample overhead — expect a
  reliable ceiling around tens of kHz, not the ADC's hardware maximum. For
  higher rates you'd move to the C/C++ SDK with the ADC's free-running mode and
  DMA (a natural next step from this code).
- Software timing has jitter; the measured rate is reported per frame.
- Single channel, ~12-bit resolution, ~0–3.3 V, no analog front-end.

## Layout

```
pico-oscilloscope/
├── firmware/
│   └── main.py          # MicroPython firmware for the Pico
├── host/
│   ├── scope.py         # live viewer / CSV capture
│   └── requirements.txt
└── README.md
```
