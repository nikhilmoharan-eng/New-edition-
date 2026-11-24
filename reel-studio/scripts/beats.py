"""Find the beats in a music bed so a reel's cuts can land on them.

  python3 scripts/beats.py public/microsoft-openai-hi/music.wav
  python3 scripts/beats.py song.mp3 --out public/my-reel/beats.json --plot beats.png

Writes <music folder>/beats.json: {"bpm", "beats": [sec...], "downbeats": [sec...], "onsets": [sec...]}.
A reel reads it through `beats` in makeMetaReel; each cut then moves to the nearest beat if one is
within `beatSnap` seconds (default 0.1 s = 3 frames), so cuts hit the music but stay on the words.
Uses librosa (pip install librosa).
"""
import argparse, json, os
import numpy as np
import librosa

ap = argparse.ArgumentParser()
ap.add_argument("music")
ap.add_argument("--out", help="default: beats.json next to the music file")
ap.add_argument("--plot", help="optional PNG of the waveform with beats marked")
a = ap.parse_args()

y, sr = librosa.load(a.music, sr=22050, mono=True)
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
tempo, frames = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, units="frames")
beats = librosa.frames_to_time(frames, sr=sr)
bpm = float(np.atleast_1d(tempo)[0])

# downbeats: of the 4 possible bar phases, the one whose beats are loudest
strength = onset_env[frames] if len(frames) else np.array([])
phase = int(np.argmax([strength[p::4].mean() if len(strength[p::4]) else 0 for p in range(4)])) if len(strength) else 0
downbeats = beats[phase::4]
onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, units="time")

out = a.out or os.path.join(os.path.dirname(a.music), "beats.json")
r3 = lambda xs: [round(float(x), 3) for x in xs]
json.dump({"bpm": round(bpm, 2), "beats": r3(beats), "downbeats": r3(downbeats), "onsets": r3(onsets)}, open(out, "w"), indent=1)
print(f"{bpm:.1f} bpm, {len(beats)} beats, {len(downbeats)} downbeats, {len(onsets)} onsets -> {out}")

if a.plot:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    t = np.arange(len(y)) / sr
    plt.figure(figsize=(16, 3))
    plt.plot(t, y, lw=0.3, color="#888")
    plt.vlines(beats, -1, 1, color="#3a7", lw=0.6)
    plt.vlines(downbeats, -1, 1, color="#d33", lw=1.2)
    plt.xlim(0, t[-1]); plt.tight_layout(); plt.savefig(a.plot, dpi=120)
    print("plot", a.plot)
