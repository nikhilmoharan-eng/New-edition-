# reel-studio

A Remotion project for business-story reels in the style of the reference videos: word-by-word italic serif captions, cream and black typography screens, giant motion-blurred numbers, highlighted deal documents, logo-head silhouettes, grain and a whoosh on every cut.

See `../PLAYBOOK.md` for the script formula, voice choice and the asset checklist.

| Path | What it is |
|---|---|
| `script/<name>.json` | One script per reel (`whatsapp`, `meta-scale`). Each line has `say` (spoken text), `show` (caption text) and `pauseAfter` |
| `scripts/gen_vo.py` | Voices each line (local Kokoro, or ElevenLabs lines via `--from-wavs`), joins the lines and aligns every caption word with Whisper → `public/<name>/vo.wav` + `src/timelines/<name>.json` |
| `scripts/eleven_lines.py` | Voices each line with ElevenLabs (needs `ELEVENLABS_API_KEY`) |
| `scripts/gen_sfx.py` | Synthesizes the music bed and SFX into `public/` |
| `scripts/stills.mjs` | Renders check frames |
| `src/reel/kit.tsx` | Shared look: fonts, grain, camera push, `BigType`, `Stamp`, `PostCard`, `Bust` |
| `src/reel/scenes.tsx` | One scene per script line, plus the `LOOK` table (caption colour and position, hidden tokens) |
| `src/reel/Reel.tsx` | Scene timeline, captions, voice, music and SFX cues |

```bash
npm i
npx remotion studio                                 # preview
npx remotion render Reel16x9 out/reel-16x9.mp4      # same frame as the references
npx remotion render Reel9x16 out/reel-9x16.mp4      # vertical
```

In a container without internet access to remotion.media, add `--browser-executable=<path to chrome-headless-shell>`.
