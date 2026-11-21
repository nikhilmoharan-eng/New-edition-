# Business-story reel playbook

This guide is based on the three reference reels (the Nvidia/Megaspeed one, the Porsche/MHP/TCS one, and the Nvidia/Hugging Face one). The fourth upload (`ContentandDistributionservices…mp4`) was only 6 KB with no video data, because the upload was cut off, so it is not covered here.

The reference build that follows this guide is in `reel-studio/` (Remotion), and the rendered videos are in `reel-studio/out/`.

---

## 1. What the reference reels have in common

| | Nvidia × Megaspeed | Porsche × MHP | Nvidia × Hugging Face |
|---|---|---|---|
| Length | 87 s | 59 s | 74 s |
| Words / pace | 220 words · 154 wpm | 149 words · 153 wpm | 195 words · 158 wpm |
| Visual change every | ~0.7 s | ~0.9 s | ~0.9 s |
| Frame | 1916×1078 (16:9) | 16:9 | 16:9 |
| Music bed under voice | about 6 dB below | about 11 dB below | about 8 dB below |

### The script formula (all three use it)

1. **Hook (0–5 s).** A contradiction or an absurd number, in one breath:
   - "Nvidia spends **billions** on cybersecurity, and their biggest security risk? Their CEO…"
   - "Porsche makes some of the fastest cars on the planet, but it just **sold the company that makes them smart**."
   - "Nvidia is paying **86 times revenue** for a company that doesn't even make chips."
2. **Name the thing plus one proof number (5–15 s).** "Her name is…", "an IT giant called MHP, 4,500 people, €742M revenue", "$12.9B for a website called Hugging Face. Started in 2016."
3. **Mechanism (15–40 s).** How it works, told as a short chain of facts with dates: "In 2023 it was worth…", "Then last year…", "On August 24th…".
4. **The pivot line.** Each one says it word for word: "**And here's the crazy part.**" / "**But here's why this matters now.**" / "**And here's why this deal is insane.**"
5. **Reframe (40–60 s).** The real meaning: "It's not an acquisition, it's insurance.", "they sold their brain for €320M and rented it back for €1.25B."
6. **Open-loop outro.** A question that sends viewers back to the hook: "So was it a honey trap? Or was it Washington taking back control?" / "Will Hugging Face say no again?"

Sentence rules: 4–12 words per sentence. One number per sentence. Dates as on-screen anchors ("In 2016.", "On August 24th,"). No filler and no "in this video".

### The visual grammar (what to copy)

- **Word-by-word captions** in the centre, in a condensed **italic serif** (Instrument Serif Italic is a near match). Each phrase is laid out with gaps, and every word fades in as it is spoken. Words are white with a soft shadow on footage and near-black on cream.
- **Three background modes** that alternate:
  1. Real footage or B-roll: keynote clips, drone shots of buildings, product close-ups, news footage.
  2. **Cream paper** (#F6F1E4) screens with only a caption or a giant serif number (`2016.`, `€1.25B.`, `billion.`). The big type streaks in with horizontal motion blur and has thin scan lines over it.
  3. **Black** screens with a glowing caption for the pivot line ("And here's the crazy part.").
- **Fake-real documents.** An acquisition offer, a cheque, an investment proposal, a term sheet, each with a **yellow highlighter** sweep on the amount and a "VERIFIED" stamp.
- **News article screenshots** (Reuters, The Verge) with the headline in focus and the rest blurred.
- **Logos as faces.** A figure in a suit with a company-logo disc where the head would be, used for handshakes and "said no".
- **Maps** with glowing coastlines and routes (Singapore → Malaysia).
- Black-and-white footage with a **red ink splash** for danger or crime beats.
- Film grain, vignette, a fast push-in on every cut, and a whoosh on every cut.

---

## 2. Which ElevenLabs voice to use

The narrator's measured pitch is about 170–190 Hz at about 155 wpm, delivered in a fast, confident "explainer" style. That pitch sits where a high, energetic male voice and a low female voice overlap, so **listen and confirm which one you hear**, then pick from the matching list below. Voice IDs are the ElevenLabs premade voices; check them in your Voice Library before use.

**Best match for this style (male, US):**

| Rank | Voice | voice_id | Why |
|---|---|---|---|
| 1 | **Brian** (deep, resonant, US) | `nPczCjzI2devNBz1zQrb` | The most-used voice for business and finance reels. Authoritative without sounding like an ad. |
| 2 | **Adam** (deep, US narrator) | `pNInz6obpgDQGcFmaJgB` | The classic documentary narrator. Slightly heavier. |
| 3 | **Liam** (young, energetic, US) | `TX3LPaxmHKxFdv7VOQHj` | Closest to the references' speed and brightness. |
| alt | **Daniel** (British news anchor) | `onwK4e9ZLuTAKqWW03F9` | Gives a "Bloomberg / FT" feel. |

**If you hear a female narrator:** Jessica `cgSgspJ2msm6clMCkdW9` (bright US) or Alice `Xb7hH8MSUJpSbSDYk0k2` (British, newsy).

**Settings that give the reference delivery:**
- Model: `eleven_multilingual_v2` (most stable). `eleven_v3` gives more drama if you add tags such as `[pause]`.
- Stability **0.35–0.45**: lower gives more punch, too low wobbles.
- Similarity **0.80**. Style **0.25–0.35**. Speaker boost **on**. Speed **1.05–1.10**.
- Generate **one line per request** and pass the previous and next line as context (`scripts/eleven_lines.py` does this). Then re-time the captions with `gen_vo.py --from-wavs`.
- Spell numbers the way they should be spoken: "twenty fourteen", not "2014".

---

## 3. Assets to collect for every video

These are the minimum assets for a 60 s reel at the references' pace (about 60–80 visual changes). Real footage is what makes the references feel premium, so collect it first.

| # | Asset | How many | Where from |
|---|---|---|---|
| 1 | **Main character footage**: CEO keynote, interview or stage clip | 4–8 clips × 2–4 s | Official company YouTube channel, press-kit B-roll, conference streams |
| 2 | **Company HQ or building**: drone or exterior | 2–3 clips | Press kit, stock (Pexels, Storyblocks, Artgrid) |
| 3 | **Product close-ups**: chip, car, app UI, website scroll | 3–6 clips | Company press kit, your own screen recording |
| 4 | **Logos** (SVG/PNG, transparent) of every company named | 1 each | Company brand or press page |
| 5 | **News headline screenshots** that back each big claim | 2–4 | Reuters, Bloomberg, The Verge, FT. **These double as your fact check.** |
| 6 | **Document mock-ups** for the money moment (offer, cheque, term sheet) | 1–2 | Built in code (see `SOffer` in `scenes.tsx`), with the real numbers |
| 7 | **Giant number / date cards** (`2016.`, `$12.9B`) | 3–6 | Built in code (`BigType`) |
| 8 | **Map or diagram** if there is geography or a flow | 0–1 | Built in code, or Remotion Maps |
| 9 | **Mood B-roll**: city at night, server rooms, crowds, trading floor | 4–6 clips | Stock |
| 10 | **AI stills** for things no footage exists of ("handshake in a glass office", "logo-head figures") | 2–4 | An image generator with a consistent prompt style; paste the logo-head on afterwards |
| 11 | **Music**: dark, pulsing, 90–110 bpm, no vocals | 1 track | Epidemic Sound, Artlist, or the generated bed in `scripts/gen_sfx.py` |
| 12 | **SFX**: whoosh (every cut), impact (big numbers), stamp, typing, riser before the pivot line | ~6 | Included in `public/sfx/` (synthesized) |

**Shot list rule:** one visual per caption phrase. Write the script first, split it into 2–4-word phrases, and give every phrase its own visual. That is how the references reach a change every 0.7–0.9 s.

---

## 4. Script template (fill in the blanks)

```
HOOK      [Company] [did something huge / paid X] ... but [contradiction].
NAME      It's called / His name is [X]. [One proof number]. [Year it started].
CONTEXT   In [year], it was worth [X]. [Who invested / what happened].
TURN      Then [last year / on <date>], [the event].
PIVOT     And here's the crazy part.
REFRAME   [What it really means, as a one-liner: "It's not X, it's Y."]
STAKES    [Why it matters to the viewer / the industry].
OUTRO     So [question A]? Or [question B, which loops back to the hook]?
```

The reference reel in `reel-studio/script/whatsapp.json` follows this template:

> In 2009, Facebook rejected this guy for a job. Five years later, they paid $19 billion for his company. His name is Brian Acton. Twitter turned him down too. So he teamed up with his friend Jan Koum, and built an app with one rule. No ads. No games. No gimmicks. They called it WhatsApp. By 2014, 450 million people used it every month. And the whole company ran on just 55 employees. Then Facebook came back. $19 billion. That's about $345 million per employee. **And here's the crazy part.** Acton didn't stay. In 2017, he walked away, leaving $850 million on the table. Then in 2018, he posted three words. It is time. #deletefacebook. So who really won? The company that paid $19 billion, or the guy they once said no to?

Every fact is public record (the 2009 posts, the Feb 2014 $19B deal with 55 staff and 450M monthly users, the 2017 exit with about $850M of unvested stock, and the March 2018 #deletefacebook post). Even so, check each claim against a news source before publishing a reel on any topic.

> **A note on the Nvidia/Megaspeed reference:** it presents an affair, a "honey trap" and a CEO resignation as fact. Before you make anything in that style about real people, make sure every claim is sourced. Unverified claims about named people are a defamation risk and get reels taken down.

---

## 5. How to make the next video with this project

```bash
cd reel-studio
# 1. write script/<topic>.json  (id, say = how it's spoken, show = caption text, pauseAfter)
# 2. voice + word timings (local Kokoro voice, or ElevenLabs lines first: scripts/eleven_lines.py)
python3 scripts/gen_vo.py script/<topic>.json --kokoro kokoro.onnx --voices voices.npz --whisper <whisper-model-dir>
python3 scripts/gen_sfx.py 70          # music bed length in seconds
# 3. add/replace scenes in src/reel/scenes.tsx (one component per line id) and the LOOK table
npx remotion studio                    # preview
npx remotion render Reel16x9 out/reel-16x9.mp4
npx remotion render Reel9x16 out/reel-9x16.mp4
```

To use real footage, drop clips in `public/footage/` and use `<Video src={staticFile("footage/x.mp4")} muted />` from `@remotion/media` inside a scene. Everything else (captions, grain, push-ins, whooshes) stays the same.
