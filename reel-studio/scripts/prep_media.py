"""Prepare uploaded footage/images for a reel: trim, crop away burned-in subtitles and
watermarks, upscale (lanczos) and sharpen, encode clean 30 fps H.264, make transparent logos.

python3 scripts/prep_media.py media/meta-scale.json
Spec format: see media/meta-scale.json. Crops are fractions of the source frame (x0, y0, x1, y1).
"""
import json, os, subprocess, sys
from PIL import Image, ImageFilter

spec = json.load(open(sys.argv[1]))
src_dir, out_dir = spec["srcDir"], spec["outDir"]
os.makedirs(out_dir, exist_ok=True)


def probe(p):
    o = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                 "stream=width,height", "-of", "csv=p=0", p]).decode().strip()
    w, h = map(int, o.split(",")[:2])
    return w, h


for c in spec.get("clips", []):
    src = os.path.join(src_dir, c["src"])
    w, h = probe(src)
    x0, y0, x1, y1 = c.get("crop", [0, 0, 1, 1])
    cw, ch = int((x1 - x0) * w) // 2 * 2, int((y1 - y0) * h) // 2 * 2
    cx, cy = int(x0 * w), int(y0 * h)
    # upscale so the short side is at least 1080
    s = max(1.0, 1080 / min(cw, ch))
    ow, oh = int(cw * s) // 2 * 2, int(ch * s) // 2 * 2
    vf = (f"crop={cw}:{ch}:{cx}:{cy},scale={ow}:{oh}:flags=lanczos,"
          f"unsharp=5:5:0.7:5:5:0.0,eq=contrast=1.05:saturation=1.03,fps=30")
    out = os.path.join(out_dir, c["name"] + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(c["ss"]), "-to", str(c["to"]), "-i", src,
                    "-vf", vf, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", out], check=True)
    print("clip", c["name"], f"{ow}x{oh}", round(c["to"] - c["ss"], 2), "s")

for im in spec.get("images", []):
    img = Image.open(os.path.join(src_dir, im["src"])).convert("RGB")
    w, h = img.size
    x0, y0, x1, y1 = im.get("crop", [0, 0, 1, 1])
    img = img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    s = 1920 / max(img.size)
    if s > 1:
        img = img.resize((round(img.size[0] * s), round(img.size[1] * s)), Image.LANCZOS)
        img = img.filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
    if im.get("logo"):
        # white background -> transparent, un-premultiply colours
        rgba = img.convert("RGBA")
        px = rgba.load()
        for y in range(rgba.size[1]):
            for x in range(rgba.size[0]):
                r, g, b, _ = px[x, y]
                a = 255 - min(r, g, b)
                a = 0 if a < 12 else min(255, int(a * 1.15))
                if a:
                    f = a / 255
                    r, g, b = [max(0, min(255, int((v - (1 - f) * 255) / f))) for v in (r, g, b)]
                px[x, y] = (r, g, b, a)
        bbox = rgba.getbbox()
        rgba = rgba.crop(bbox)
        rgba.save(os.path.join(out_dir, im["name"] + ".png"))
    else:
        img.save(os.path.join(out_dir, im["name"] + ".jpg"), quality=93)
    print("image", im["name"], img.size)
