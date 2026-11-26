# The three reference reels, re-analysed with the Viral Documentary Style Guide

Reels: **Porsche × MHP** (`dc3ebb43…mp4`), **Nvidia × Hugging Face** (`0d12002d…mp4`), **Nvidia × Megaspeed** (`96ea7861…mp4`).
Measured with ffmpeg (scene cuts, EBU R128 loudness) and Whisper (word timings). "Visual changes" counts every hard cut and every full-frame text change, so it reads a little higher than a pure shot count.

## Headline finding

The style guide describes **vertical founder documentaries** (BlackRock / Palantir / FOUNDED). Your three references are a different format: **16:9 deal-explainer reels**. They share the guide's audio and caption rules, but they run on a different story arc and a much faster cut rate. Treat the references as the house style, and use the guide only where the two agree.

## 1. Measured numbers vs the guide

| | Porsche × MHP | Nvidia × Hugging Face | Nvidia × Megaspeed | Guide target | Match? |
|---|---|---|---|---|---|
| Format | 1916×1078, **60 fps** | 1916×1078, 30 fps | 1916×1078, 30 fps | 1080×1920 9:16, 30 fps | ❌ all 16:9 |
| Runtime | 58.7 s | 74.4 s | 87.4 s | 60–75 s | ✅ / ✅ / ⚠️ long |
| Words | 149 | 195 | 219 | 160–210 | ✅ |
| Pace | 153 WPM | 158 WPM | 155 WPM | 155–175 WPM | ✅ |
| Loudness | −14.1 LUFS | −14.1 LUFS | −14.2 LUFS | −14 LUFS | ✅ |
| Loudness range | 2.4 LU | 3.4 LU | 3.8 LU | (heavily compressed) | ✅ |
| Visual changes | 73 | 92 | 138 | — | — |
| Avg / median per visual | 1.41 / 1.00 s | 1.02 / 0.83 s | 0.82 / 0.60 s | 0.9–2.2 s | ✅ (faster than the guide) |
| Pace over the 4 quarters (s per visual) | 0.46 → 0.81 → 1.82 → 0.97 | 0.80 → 0.84 → 0.74 → 0.84 | 0.45 → 0.54 → 0.73 → 0.92 | "escalate at the climax" | ❌ they start fastest and slow down |
| Longest hold | 6.8 s (€1.25B cheque) | 3.4 s | 3.8 s | ≤ 8–10 s | ✅ |
| Pauses over 120 ms | 18 | 39 | 34 | none | ⚠️ they keep short dramatic pauses |

**What the numbers say:**
- The hook is cut at **about 0.5 s per visual**, which is twice as fast as the guide's fastest setting.
- The reels slow down toward the end, so the closing line can land.
- Breath pauses stay in: the voice pauses on "…" for drama. The guide's "no pauses over 120 ms" rule is stricter than what the references actually do.

## 2. Story arc: the references' 8 beats vs the guide's 8 beats

The guide's arc is founder-led (Meet → Origin → Struggle). The references are **deal-led**: there is no origin story, and the "crazy part" pivot does the job of the guide's pattern interrupt.

| Guide beat | Porsche × MHP | Nvidia × Hugging Face | Nvidia × Megaspeed |
|---|---|---|---|
| 1 Shock hook (0–4 s) | 0.0 "Porsche makes some of the fastest cars… but it just **sold the company that makes them smart**." | 0.0 "Nvidia is paying **86 times revenue** for a company that doesn't even make chips." | 0.0 "Nvidia spends billions on cybersecurity. And their biggest security risk?…" |
| 2 Scale proof (4–8 s) | 5.7 "For 30 years… 4,500 people, €742 million" | 5.0 "$12.9 billion for a website called Hugging Face" | (folded into the hook) |
| 3 "Meet X" (8–11 s) | — (company, no person) | 9.0 "Started in 2016… like GitHub, but for AI" | **9.9 "Her name is Alice Huang."** ✅ on time |
| 4 Origin (11–26 s) | — | 15.2 "Two million models…" | 11.5 "She wasn't just his mistress…" |
| 5 Mechanism (26–42 s) | 16.6 "They build the AI, the factory software…" | 18.6–32.8 the rejection history ($4.5B → $7B → "no") | 15.1–43 the chip route (Malaysia, $4.8B, boxes) |
| **Pivot line** | 27.5 "**And here's the crazy part.**" | 16.9 "**And here's why this deal is insane.**" | 43.4 "**But here's why this matters now.**" |
| 6 Power inflection | 21.6 sold to TCS for €320M | 32.8 "Nvidia is back… almost double" | 45.5 lobbying → "Trump said yes" → the story drops |
| 7 Financial climax | 28.6 "€1.25 billion… back to TCS" | 59.1 "$12.9 billion… entire open-source ecosystem" | 72.4 "**$600 billion wiped out** in days" |
| 8 Ironic closer | 41.1 "sold their brain for €320M and **rented it back for €1.25B**" → 50.9 "the badge is still German… intelligence increasingly Indian" | 54.0 "It's not an acquisition. **It's insurance.**" → question → joke postscript | 80.6 "So was it a honey trap? Or was it Washington taking back control?" |

**The reference formula:**
**Contrast hook → number proof → what it is → "here's the crazy part" → the deal or twist → the money payoff → why it matters → a reframe line plus an open question.**
Your reels 1–4 already follow it ("Aur ab aati hai sabse paagalpan waali baat").

## 3. Visual style DNA: which guide mode each reel matches

| Element | Porsche × MHP | Nvidia × Hugging Face | Nvidia × Megaspeed | Closest guide mode |
|---|---|---|---|---|
| Captions | word-by-word **italic serif**, white, **dead centre**, soft glow | same, slightly larger | same; big words get small caps ("BILLIONS") | Mode B position, but serif only, not mixed |
| Flash / text cards | **black** cards with glowing serif ("And rented it back", "€1.25B.") | **white** cards, dark serif ("In 2023", "Why would they do", "Right now,", "for $12.9") | **cream** cards (#F6F1E4-ish), dark serif ("So how do they", "The suspicion", "But here's why this matters NOW") | Mode C white flash, recoloured per reel |
| Number moments | glowing serif "€1.25B." on black; AI-staged cheque "€1,250,000,000" with **yellow highlight** | acquisition-offer document "$12,90,00,00,000" with a **VERIFIED** stamp; clipboard proposals with yellow highlights | stock-chart crash with an odometer "−$600,000,000,000" | Mode B odometer + Mode A documents |
| Press inserts | The Verge-style headline, **yellow** highlight on "€742 million" | The Verge headline, blue highlight on "$4.5 billion" | Reuters headline; Jensen's letter with **yellow** highlights | Mode B press highlight, in **yellow**, not red |
| Signature props | AI-staged legal documents on a desk (share purchase agreement, transfer of ownership) | **logo-head people** (Nvidia and Hugging Face logos for faces), investment-proposal clipboards | gold-outline **map** (Singapore route), bar chart, boxes footage, military B&W | Mode A tactile documents |
| Satire beats | logo-head businessmen with China-flag heads, a VW-head figure kneeling | Jim Carrey typing meme, a cartoon meme closer | — | not in the guide |
| B-roll grade | dark, desaturated, luxury car macro | clean and bright, white studio and skyline | warm amber + B&W war footage | Mode B teal/amber (Megaspeed) |
| Camera | constant slow push on every still | same | same | ✅ "no static frames" |
| Letterbox 2.39:1 | no | no | no | ❌ not used |
| Z-depth cut-out hook | no | no | no | ❌ not used |
| Red full-screen cards | no | no | no | ❌ not used (the pivot is a cream, black or white card) |

**In short:** the references use Mode B **caption placement and pacing**, Mode C **flash cards** (recoloured per reel), and Mode A **document props**, plus two moves the guide doesn't list: **logo-head characters** and **meme punchlines**. They skip the guide's red interrupt cards, letterbox and Z-depth cut-outs.

## 4. Filled template: the references as one reusable "house" storyboard

| Time | Beat | VO pattern | Visual | On-screen text | Motion | Audio |
|---|---|---|---|---|---|---|
| 0:00–0:05 | Hook | "[Giant] does [normal thing]… but it just [paradox]." | 5–10 visuals at about 0.5 s, each matching a noun (logo, product macro, HQ) | word-by-word italic serif, centred, glow | hard cuts, slow push | low drone, soft whoosh |
| 0:05–0:10 | Proof | "[$X] for [plain description]." | staged document or cheque, number in a yellow highlight | number as a glowing serif card | push-in on the paper | cash or paper sound |
| 0:10–0:17 | What it is / who | "Her name is…" / "Started in 2016, it's just…" | portrait or UI screen recording | name card (serif) | 1.08→1.00 settle | soft hit |
| 0:17 | Pivot | "And here's the crazy part." | **flash card** (black, white or cream, one per reel), text only | 3–6 words, serif | 0-frame cut | music dips |
| 0:18–0:40 | The deal / twist | facts with dates and numbers | press headline with highlight → logo-head figures → map or chart | numbers in serif | 0.7–0.9 s cuts | ticks on numbers |
| 0:40–0:55 | Payoff | "[sold for X]… [paid back Y]" | the biggest number on a glowing card, or an odometer over a chart | "€1.25B." | longest hold in the reel (3–7 s) | boom |
| 0:55–1:10 | Why it matters | "Why? Because…" | logo-head satire, or archive footage | — | slower, about 1 s | — |
| last 6 s | Reframe + question | "It's not X. It's Y." → "So was it… or…?" | slow push on a hero shot or meme | final line held | slowest cuts | music out |

## 5. What this means for your reels (1–4)

| Rule from the references | Your reels now | Change |
|---|---|---|
| Hook at about 0.5 s per visual | about 2.5 s | add 6–8 quick noun shots in the first 5 s |
| Captions dead centre | low or top | centre them (Y ≈ 50%) with a softer glow |
| One flash-card colour per reel | cream number cards | keep cream for numbers; give the pivot line its own text-only card |
| Yellow highlight on press and documents | none | add a yellow `highlight` to card and press shots |
| Logo-head people | handshake busts (close) | already supported (`Bust logo=`); use more |
| Maps and charts for money routes | radar, race, term sheet | ✅ |
| Biggest number gets the longest hold | yes (cream cards) | ✅ |
| Loudness −14 LUFS, 150–160 WPM | −14.2 LUFS, 144 WPM (Hindi) | trim long "…" pauses a little |
| 16:9 | 16:9 | ✅ the same as the references, so no need to switch to the guide's 9:16 |

> Fact-check note: the Megaspeed reel presents an affair, a "honey trap" and a CEO resignation as fact. Copy its editing, not its claims; every claim about a named person needs a source.
