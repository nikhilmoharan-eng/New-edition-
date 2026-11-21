"""Generate the voiceover + word-level timeline for a reel script.

Usage:
  python3 scripts/gen_vo.py script/whatsapp.json --name whatsapp \
      --kokoro path/to/kokoro.onnx --voices path/to/voices.npz \
      --whisper path/to/faster-whisper-model-dir

Writes public/<name>/vo.wav and src/timelines/<name>.json.

To use an ElevenLabs voice instead, render each line with ElevenLabs, save them as
public/<name>/lines/<id>.wav, and pass --from-wavs: the same alignment + timeline step runs.
"""
import argparse, json, os, re, difflib, wave
import numpy as np

SR = 24000
ap = argparse.ArgumentParser()
ap.add_argument("script")
ap.add_argument("--kokoro")
ap.add_argument("--voices")
ap.add_argument("--whisper", required=True)
ap.add_argument("--from-wavs", action="store_true")
ap.add_argument("--name", required=True, help="reel name: writes public/<name>/ and src/timelines/<name>.json")
ap.add_argument("--out", default=".")
a = ap.parse_args()

spec = json.load(open(a.script))
root = a.out
os.makedirs(f"{root}/public/{a.name}/lines", exist_ok=True)
os.makedirs(f"{root}/src/timelines", exist_ok=True)


def read_wav(p):
    import soundfile as sf
    y, sr = sf.read(p, dtype="float32")
    if y.ndim > 1:
        y = y.mean(1)
    if sr != SR:
        import librosa
        y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    return y


clips = []
if a.from_wavs:
    for ln in spec["lines"]:
        clips.append(read_wav(f"{root}/public/{a.name}/lines/{ln['id']}.wav"))
else:
    from kokoro_onnx import Kokoro
    import soundfile as sf
    k = Kokoro(a.kokoro, a.voices)
    for ln in spec["lines"]:
        y, sr = k.create(ln["say"], voice=spec["voice"], speed=spec["speed"], lang="en-us")
        assert sr == SR
        # trim leading/trailing silence so pauses are controlled by the script
        nz = np.where(np.abs(y) > 0.01)[0]
        y = y[max(0, nz[0] - 600): nz[-1] + 1200]
        sf.write(f"{root}/public/{a.name}/lines/{ln['id']}.wav", y, SR)
        clips.append(y.astype(np.float32))

from faster_whisper import WhisperModel
wm = WhisperModel(a.whisper, device="cpu", compute_type="int8")


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


lead = 0.35  # silence before first word
t = lead
audio = [np.zeros(int(lead * SR), np.float32)]
timeline = []
for ln, y in zip(spec["lines"], clips):
    dur = len(y) / SR
    # --- whisper word times inside this line
    import librosa
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    segs, _ = wm.transcribe(y16, language="en", word_timestamps=True)
    ww = [w for s in segs for w in s.words]
    # per-character time track from whisper words
    chars, ctimes = [], []
    for w in ww:
        n = norm(w.word)
        for i, c in enumerate(n):
            chars.append(c)
            ctimes.append(w.start + (w.end - w.start) * (i + 0.5) / max(1, len(n)))
    # spoken words, aligned to whisper chars
    say_words = ln["say"].split()
    s_chars, owner = [], []
    for wi, w in enumerate(say_words):
        for c in norm(w):
            s_chars.append(c)
            owner.append(wi)
    sm = difflib.SequenceMatcher(None, "".join(s_chars), "".join(chars), autojunk=False)
    st = [None] * len(s_chars)
    for blk in sm.get_matching_blocks():
        for j in range(blk.size):
            st[blk.a + j] = ctimes[blk.b + j]
    # interpolate unmatched chars linearly over the line; pin the ends to the speech edges
    if ww and st and st[0] is None:
        st[0] = ww[0].start + 0.02
    if ww and st and st[-1] is None:
        st[-1] = ww[-1].end - 0.02
    known = [(i, v) for i, v in enumerate(st) if v is not None]
    if not known:
        known = [(0, 0.05), (len(st) - 1, dur - 0.05)]
    xi, xv = zip(*known)
    st = list(np.interp(range(len(st)), xi, xv))
    say_t = []
    for wi in range(len(say_words)):
        ts = [st[i] for i in range(len(st)) if owner[i] == wi]
        say_t.append((min(ts), max(ts)))
    # map display tokens onto spoken words: identical words anchor, and display tokens in
    # between (numbers like "$19" = "nineteen ... dollars") take the spoken words in that gap
    show = ln["show"].split()
    span = [None] * len(show)
    wm_ = difflib.SequenceMatcher(None, [norm(x) for x in show], [norm(x) for x in say_words], autojunk=False)
    for op, i0, i1, j0, j1 in wm_.get_opcodes():
        if op == "equal":
            for k_ in range(i1 - i0):
                span[i0 + k_] = (j0 + k_, j0 + k_)
        elif i1 > i0:
            jj0, jj1 = (j0, j1 - 1) if j1 > j0 else (max(0, j0 - 1), max(0, j0 - 1))
            n_ = i1 - i0
            for k_ in range(n_):  # split the gap between the display tokens in it
                a0_ = jj0 + (jj1 - jj0 + 1) * k_ // n_
                a1_ = max(a0_, jj0 + (jj1 - jj0 + 1) * (k_ + 1) // n_ - 1)
                span[i0 + k_] = (a0_, a1_)
    words = []
    for tok, (a0_, a1_) in zip(show, span):
        s0 = say_t[a0_][0] - 0.06
        words.append({"text": tok, "start": round(t + max(0, s0), 3), "end": round(t + say_t[a1_][1] + 0.08, 3)})
    timeline.append({"id": ln["id"], "show": ln["show"], "start": round(t, 3), "end": round(t + dur, 3), "words": words})
    audio.append(y)
    pause = ln.get("pauseAfter", 0.25)
    audio.append(np.zeros(int(pause * SR), np.float32))
    t += dur + pause

full = np.concatenate(audio)
peak = np.abs(full).max()
full = full / peak * 0.89
with wave.open(f"{root}/public/{a.name}/vo.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((full * 32767).astype(np.int16).tobytes())
json.dump({"title": spec["title"], "duration": round(t, 3), "lines": timeline}, open(f"{root}/src/timelines/{a.name}.json", "w"), indent=1)
print("duration", round(t, 2), "s")
for l in timeline:
    print(f"{l['start']:6.2f} {l['id']:8s} " + " ".join(f"{w['text']}@{w['start']:.2f}" for w in l["words"]))
