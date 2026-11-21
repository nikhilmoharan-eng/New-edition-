"""Synthesize the music bed and SFX used by the reel (no samples, no licensing issues).

python3 scripts/gen_sfx.py [duration_seconds] [music_out]
Writes public/sfx/*.wav and the music bed (default public/music.wav)
"""
import sys, os, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
os.makedirs("public/sfx", exist_ok=True)


def save(path, y):
    y = np.asarray(y, np.float32)
    y = y / (np.abs(y).max() + 1e-9) * 0.9
    if y.ndim == 1:
        y = np.stack([y, y], 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def t(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, a):  # one-pole low-pass, a in (0,1)
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s += a * (v - s); y[i] = s
    return y


def env(n, att, rel):
    e = np.ones(n)
    a = int(att * SR); r = int(rel * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r) ** 2
    return e


def sweep_noise(sec, f0, f1):
    """Band-limited noise whose brightness sweeps f0->f1 (a whoosh)."""
    n = int(sec * SR)
    x = rng.standard_normal(n)
    cut = np.geomspace(f0, f1, n)
    a = 1 - np.exp(-2 * np.pi * cut / SR)
    y = np.empty(n); s = 0.0
    for i in range(n):
        s += a[i] * (x[i] - s); y[i] = s
    return y


# whoosh: rise then fall in brightness and level
n = int(0.55 * SR)
w = sweep_noise(0.55, 300, 6000) * np.sin(np.linspace(0, np.pi, n)) ** 2
save("public/sfx/whoosh.wav", w)

# impact: sub boom + noisy transient
tt = t(1.4)
boom = np.sin(2 * np.pi * (48 * tt + 30 * (1 - np.exp(-tt * 18)) / 18)) * np.exp(-tt * 3.2)
click = lp(rng.standard_normal(len(tt)), 0.35) * np.exp(-tt * 40)
save("public/sfx/impact.wav", boom * 1.0 + click * 0.6)

# stamp: short thud + paper slap
tt = t(0.45)
stamp = np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 22) + lp(rng.standard_normal(len(tt)), 0.5) * np.exp(-tt * 35) * 0.8
save("public/sfx/stamp.wav", stamp)

# tick (UI pop)
tt = t(0.08)
save("public/sfx/tick.wav", np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 70))

# key (typing click)
tt = t(0.05)
save("public/sfx/key.wav", lp(rng.standard_normal(len(tt)), 0.6) * np.exp(-tt * 120))

# riser: noise + rising tone, 1.6s
tt = t(1.6)
rise = sweep_noise(1.6, 200, 9000) * (tt / 1.6) ** 2 + 0.3 * np.sin(2 * np.pi * (200 * tt + 260 * tt ** 2)) * (tt / 1.6) ** 3
save("public/sfx/riser.wav", rise)

# cash register-ish ding for big numbers
tt = t(1.2)
ding = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(1318, 3), (1976, 4), (2637, 6)])
save("public/sfx/ding.wav", ding * env(len(tt), 0.002, 0.3))

# ---- music bed: dark minor pulse, 96 bpm
dur = float(sys.argv[1]) if len(sys.argv) > 1 else 60
N = int(dur * SR)
tt = np.arange(N) / SR
bpm = 96; beat = 60 / bpm
mus = np.zeros(N)
# drone (D minor-ish), slow filter movement
for f, g in [(73.42, 1.0), (110.0, 0.45), (146.83, 0.3), (174.61, 0.18)]:
    mus += g * np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.07 * tt))
mus *= 0.18
# kick on every beat + soft hat on off-beats
kt = t(0.4)
kick = np.sin(2 * np.pi * (52 * kt + 80 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)
ht = t(0.06)
hat = lp(rng.standard_normal(len(ht)), 0.9) * np.exp(-ht * 90)
hat = hat - lp(hat, 0.2)
# pluck arpeggio
notes = [293.66, 349.23, 440.0, 349.23, 261.63, 329.63, 392.0, 329.63]
pt = t(beat * 0.9)
k = 0
for i in range(int(dur / beat)):
    s = int(i * beat * SR)
    if s + len(kick) < N:
        mus[s:s + len(kick)] += kick * 0.55
    h = s + int(beat / 2 * SR)
    if h + len(hat) < N:
        mus[h:h + len(hat)] += hat * 0.12
    if i % 2 == 0 and s + len(pt) < N:
        f = notes[k % len(notes)]; k += 1
        pl = (np.sin(2 * np.pi * f * pt) + 0.3 * np.sin(4 * np.pi * f * pt)) * np.exp(-pt * 5)
        mus[s:s + len(pt)] += pl * 0.12
# fade in/out
mus *= np.clip(tt / 1.5, 0, 1) * np.clip((dur - tt) / 2.0, 0, 1)
stereo = np.stack([mus, np.roll(mus, 300)], 1)
save(sys.argv[2] if len(sys.argv) > 2 else "public/music.wav", stereo)
print("ok", dur)
