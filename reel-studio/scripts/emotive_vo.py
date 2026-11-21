"""Emotive voiceover with the local Kokoro voice, driven by ElevenLabs-v3-style tags.

  python3 scripts/emotive_vo.py script/meta-scale-en-emotion.json out.wav \
      --kokoro kokoro.onnx --voices voices.npz

Kokoro can't act, so each tag maps to a delivery preset: speaking speed, pitch, loudness,
plus a breathy treatment for [whispers], a soft exhale for [sighs] and silence for [pause].
"..." in the text becomes a short dramatic pause. Feed the result to align_vo.py.
"""
import argparse, json, re
import numpy as np
import librosa
import soundfile as sf
from kokoro_onnx import Kokoro

SR = 24000
PRESET = {
    #               speed  semitones  gain dB
    "neutral":      (1.07, 0.0, 0.0),
    "excited":      (1.15, 1.0, 2.0),
    "dramatic":     (0.97, -0.5, 0.5),
    "whispers":     (0.98, 0.0, -6.0),
    "curious":      (1.04, 0.6, 0.0),
    "thoughtful":   (0.97, -0.4, -1.0),
    "surprised":    (1.12, 1.3, 2.5),
    "impressed":    (1.03, 0.5, 1.0),
    "sighs":        (0.97, -0.7, -1.0),
    "serious":      (1.0, -0.9, 0.5),
    "slowly":       (0.88, -0.6, 0.0),
    "sad":          (0.9, -1.3, -2.0),
    "mischievously": (1.06, 0.8, 0.5),
}

ap = argparse.ArgumentParser()
ap.add_argument("spec")
ap.add_argument("out")
ap.add_argument("--kokoro", required=True)
ap.add_argument("--voices", required=True)
a = ap.parse_args()
spec = json.load(open(a.spec))
k = Kokoro(a.kokoro, a.voices)
rng = np.random.default_rng(3)


def trim(y):
    nz = np.where(np.abs(y) > 0.01)[0]
    return y[max(0, nz[0] - 480): nz[-1] + 960] if len(nz) else y


def silence(sec):
    return np.zeros(int(sec * SR), np.float32)


def whisperize(y):
    """Breathy: drop the low body, add envelope-following noise, soften."""
    hp = librosa.effects.preemphasis(y, coef=0.97)
    env = np.convolve(np.abs(y), np.ones(400) / 400, mode="same")
    noise = rng.standard_normal(len(y)).astype(np.float32)
    noise = librosa.effects.preemphasis(noise, coef=0.9) * env * 1.6
    return (0.55 * hp + 0.45 * noise).astype(np.float32)


def sigh():
    """A soft exhale before the line."""
    n = int(0.65 * SR)
    t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n).astype(np.float32)
    b = np.convolve(noise, np.hanning(60) / 30, mode="same")  # soft low-pass
    env = np.sin(np.pi * t) ** 1.5 * np.exp(-t * 1.2)
    return (b * env * 0.06).astype(np.float32)


def speak(text, tag):
    speed, semi, gain = PRESET.get(tag, PRESET["neutral"])
    parts = []
    # "..." -> separate phrases with a dramatic pause
    phrases = [p.strip() for p in re.split(r"\.\.\.", text) if p.strip()]
    for i, ph in enumerate(phrases):
        y, sr = k.create(ph, voice=spec["voice"], speed=speed, lang="en-us")
        y = trim(y.astype(np.float32))
        if semi:
            y = librosa.effects.pitch_shift(y, sr=SR, n_steps=semi)
        if tag == "whispers":
            y = whisperize(y)
        y = y * (10 ** (gain / 20))
        parts.append(y)
        if i < len(phrases) - 1:
            parts.append(silence(0.32 if tag in ("dramatic", "slowly", "sad") else 0.22))
    out = np.concatenate(parts)
    if tag == "sighs":
        out = np.concatenate([sigh(), silence(0.08), out])
    return out


audio = [silence(0.3)]
for ln in spec["lines"]:
    # split "[tag] text [tag] text" into tagged segments
    segs = re.findall(r"(?:\[(\w+)\])?\s*([^\[]+)", ln["v3"])
    tag = "neutral"
    for t, txt in segs:
        if t:
            tag = t
        txt = txt.strip()
        if tag == "pause" and not txt:
            audio.append(silence(0.45))
            continue
        if tag == "pause":
            audio.append(silence(0.45))
            tag = "neutral"
        if txt:
            audio.append(speak(txt, tag))
            audio.append(silence(0.12))
    audio.append(silence(ln.get("pauseAfter", 0.35)))
    print("ok", ln["id"])

full = np.concatenate(audio)
full = full / (np.abs(full).max() + 1e-9) * 0.9
sf.write(a.out, full, SR)
print("duration", round(len(full) / SR, 2))
