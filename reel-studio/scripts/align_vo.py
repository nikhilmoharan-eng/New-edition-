"""Time a finished voiceover (e.g. from ElevenLabs v3) against a reel script.

  python3 scripts/align_vo.py script/meta-scale-hi.json path/to/voiceover.mp3 \
      --name meta-scale-hi --lang hi --whisper <faster-whisper model dir>

Writes public/<name>/vo.wav and src/timelines/<name>.json (same format as gen_vo.py), so the
reel's cuts and word-by-word captions follow the real voice. Works for any language Whisper
knows; the script's `say` text is aligned character-by-character to Whisper's transcript, so
small differences between the script and the take are fine.
"""
import argparse, difflib, json, os, re, subprocess, unicodedata
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("script")
ap.add_argument("audio")
ap.add_argument("--name", required=True)
ap.add_argument("--lang", default="en")
ap.add_argument("--whisper", required=True)
a = ap.parse_args()

spec = json.load(open(a.script))
os.makedirs(f"public/{a.name}", exist_ok=True)
os.makedirs("src/timelines", exist_ok=True)
wav = f"public/{a.name}/vo.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.audio, "-ac", "1", "-ar", "24000", wav], check=True)
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]))


def norm(s: str) -> str:
    """Letters and digits only; drops vowel signs, nukta and punctuation so spelling variants still match."""
    s = unicodedata.normalize("NFC", s.lower())
    return "".join(ch for ch in s if ch.isalnum())


# ---- whisper words with times
import librosa
from faster_whisper import WhisperModel

y, _ = librosa.load(wav, sr=16000)
wm = WhisperModel(a.whisper, device="cpu", compute_type="int8", cpu_threads=4)

# Transcribe in short pieces cut at pauses: on long takes Whisper otherwise skips whole sections.
_sd = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
_mids = [(float(x) + float(z)) / 2 for x, z in zip(re.findall(r"silence_start: ([0-9.]+)", _sd), re.findall(r"silence_end: ([0-9.]+)", _sd))]
cuts, last = [0.0], 0.0
for m_ in _mids:
    if m_ - last >= 8.0:
        cuts.append(m_)
        last = m_
cuts.append(len(y) / 16000)


class _W:  # word with absolute times
    def __init__(self, word, start, end):
        self.word, self.start, self.end = word, start, end


ww = []
for c0, c1 in zip(cuts, cuts[1:]):
    piece = y[int(c0 * 16000): int(c1 * 16000)]
    segs, _ = wm.transcribe(piece, language=a.lang, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    ww += [_W(w.word, w.start + c0, w.end + c0) for s in segs for w in s.words]
print("transcribed", len(ww), "words in", len(cuts) - 1, "pieces")
chars, ctimes = [], []
for w in ww:
    n = norm(w.word)
    for i, c in enumerate(n):
        chars.append(c)
        ctimes.append(w.start + (w.end - w.start) * (i + 0.5) / max(1, len(n)))

# ---- script words (all lines, in order)
words = []  # (line_idx, word)
for li, ln in enumerate(spec["lines"]):
    for wtok in ln["say"].split():
        words.append((li, wtok))
s_chars, owner = [], []
for wi, (_, wtok) in enumerate(words):
    for c in norm(wtok):
        s_chars.append(c)
        owner.append(wi)

sm = difflib.SequenceMatcher(None, "".join(s_chars), "".join(chars), autojunk=False)
st = [None] * len(s_chars)
for blk in sm.get_matching_blocks():
    for j in range(blk.size):
        st[blk.a + j] = ctimes[blk.b + j]
if st and st[0] is None:
    st[0] = ww[0].start
if st and st[-1] is None:
    st[-1] = ww[-1].end
known = [(i, v) for i, v in enumerate(st) if v is not None]
xi, xv = zip(*known)
st = list(np.interp(range(len(st)), xi, xv))
wt = []
for wi in range(len(words)):
    ts = [st[i] for i in range(len(st)) if owner[i] == wi] or [wt[-1][1] if wt else 0.0]
    wt.append((min(ts), max(ts)))
print(f"matched {sum(b.size for b in sm.get_matching_blocks())}/{len(s_chars)} script characters")

# ---- pauses in the take: a line never starts inside one (short words like "and" drift otherwise)
sd = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
                    capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", sd)]
ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", sd)]
silences = list(zip(starts, ends))


def snap(t: float) -> float:
    """If t is inside a pause, or a pause ends shortly after it, move t to where speech resumes."""
    for s0, s1 in silences:
        if s0 - 0.25 <= t < s1 or (t < s1 <= t + 1.0 and s0 <= t + 0.6):
            return s1 - 0.03
    return t


# ---- per line: spoken-word times -> caption (show) word times
timeline = []
gi = 0
for li, ln in enumerate(spec["lines"]):
    say = ln["say"].split()
    say_t = wt[gi: gi + len(say)]
    gi += len(say)
    if li > 0:
        s_new = snap(say_t[0][0])
        if s_new > say_t[0][0]:
            say_t = [(max(s, s_new + 0.12 * k), max(e, s_new + 0.12 * k + 0.1)) for k, (s, e) in enumerate(say_t)]
            # keep the shifted words in order
            for k in range(1, len(say_t)):
                if say_t[k][0] < say_t[k - 1][0]:
                    say_t[k] = (say_t[k - 1][0] + 0.05, max(say_t[k][1], say_t[k - 1][0] + 0.15))
    # `showAlign` (optional) is a caption in the spoken script, used only for timing; `show` is what's
    # displayed (e.g. Hinglish in Latin letters) and must have the same number of words.
    show = ln.get("showAlign", ln["show"]).split()
    shown = ln["show"].split()
    assert len(shown) == len(show), f"{ln['id']}: show and showAlign need the same word count"
    span = [None] * len(show)
    ops = difflib.SequenceMatcher(None, [norm(x) for x in show], [norm(x) for x in say], autojunk=False).get_opcodes()
    for op, i0, i1, j0, j1 in ops:
        if op == "equal":
            for k in range(i1 - i0):
                span[i0 + k] = (j0 + k, j0 + k)
        elif i1 > i0:
            jj0, jj1 = (j0, j1 - 1) if j1 > j0 else (max(0, j0 - 1), max(0, j0 - 1))
            n = i1 - i0
            for k in range(n):
                a0 = jj0 + (jj1 - jj0 + 1) * k // n
                a1 = max(a0, jj0 + (jj1 - jj0 + 1) * (k + 1) // n - 1)
                span[i0 + k] = (a0, a1)
    cap = [{"text": tok, "start": round(max(0, say_t[a0][0] - 0.06), 3), "end": round(say_t[a1][1] + 0.08, 3)} for tok, (a0, a1) in zip(shown, span)]
    start = round(max(0.0, say_t[0][0] - 0.12), 3)
    end = round(say_t[-1][1] + 0.1, 3)
    timeline.append({"id": ln["id"], "show": ln["show"], "start": start, "end": end, "words": cap})

json.dump({"title": spec["title"], "duration": round(dur, 3), "lines": timeline}, open(f"src/timelines/{a.name}.json", "w"), indent=1, ensure_ascii=False)
print("duration", round(dur, 2))
for l in timeline:
    print(f"{l['start']:6.2f} {l['id']:11s} " + " ".join(f"{i}:{w['text']}@{w['start']:.2f}" for i, w in enumerate(l["words"])))
