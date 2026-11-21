"""Voice every script line with ElevenLabs, then re-run gen_vo.py --from-wavs.

  export ELEVENLABS_API_KEY=...            # never commit this
  python3 scripts/eleven_lines.py script/whatsapp.json --voice nPczCjzI2devNBz1zQrb
  python3 scripts/gen_vo.py script/whatsapp.json --from-wavs --whisper <model dir>

Each line is sent with the previous/next line as context so the delivery flows like one take.
"""
import argparse, json, os, wave, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("script")
ap.add_argument("--voice", required=True, help="ElevenLabs voice_id")
ap.add_argument("--model", default="eleven_multilingual_v2")
ap.add_argument("--stability", type=float, default=0.40)
ap.add_argument("--similarity", type=float, default=0.80)
ap.add_argument("--style", type=float, default=0.30)
ap.add_argument("--speed", type=float, default=1.06)
a = ap.parse_args()

key = os.environ["ELEVENLABS_API_KEY"]
lines = json.load(open(a.script))["lines"]
os.makedirs("public/lines", exist_ok=True)
for i, ln in enumerate(lines):
    body = {
        "text": ln["say"],
        "model_id": a.model,
        "previous_text": lines[i - 1]["say"] if i else None,
        "next_text": lines[i + 1]["say"] if i + 1 < len(lines) else None,
        "voice_settings": {
            "stability": a.stability,
            "similarity_boost": a.similarity,
            "style": a.style,
            "use_speaker_boost": True,
            "speed": a.speed,
        },
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}?output_format=pcm_24000",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    pcm = urllib.request.urlopen(req).read()
    with wave.open(f"public/lines/{ln['id']}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    print("ok", ln["id"])
