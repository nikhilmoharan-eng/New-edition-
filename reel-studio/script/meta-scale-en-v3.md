# "The $14B Hire": English voiceover with emotions (ElevenLabs v3)

Same words as the English reel already on screen, now with v3 emotion tags.
Paste the whole block in one generation (v3 is steadiest with longer text), keep the line breaks, and set Stability to **Natural**. Don't press "Enhance": the tags are already in.

"Alexander" is spelled that way so the voice says it right; the caption keeps "Alexandr".

```
[excited] In June 2025, Meta paid fourteen billion dollars.
[dramatic] Not for a company... [whispers] for one twenty-eight-year-old.
[curious] His name is Alexander Wang.
At nineteen, he dropped out of MIT... and started Scale AI.
[thoughtful] Scale doesn't build AI. [pause] It feeds it.
Its workers label the data that trains AI for Google, OpenAI... [surprised] and even the US military.
[impressed] It made him the world's youngest self-made billionaire.
[curious] So why did Meta pay so much?
Because its newest model, Llama 4, [sighs] landed with a shrug... and Zuckerberg was falling behind in the AI race.
[serious] So Meta bought forty-nine percent of Scale... and hired Wang to run its new superintelligence lab.
[excited] And here's the crazy part.
Scale's biggest customer was Google. [pause] About two hundred million dollars that year.
[serious] The day after the deal, reports said Google planned to walk away.
[sighs] A month later, Scale cut fourteen percent of its staff.
[slowly] Meta didn't buy a company. [pause] It bought a person. [sad] And the company paid the price.
[curious] So was it the smartest hire in AI history?
[mischievously] Or the most expensive one ever?
```

**Voice:** Brian (`nPczCjzI2devNBz1zQrb`), the deep, confident US narrator that suits business reels. Alternatives: Adam (`pNInz6obpgDQGcFmaJgB`) for a heavier documentary voice, or Liam (`TX3LPaxmHKxFdv7VOQHj`) for more energy. Check the preview in your account before using one.

When you upload the take, the English reel is re-timed to it automatically:

```
python3 scripts/align_vo.py script/meta-scale.json <take.mp3> --name meta-scale --lang en --whisper <model dir>
```
