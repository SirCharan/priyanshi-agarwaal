"""Render animatic previews of week reels from reels.json using placeholder stills.

uv run --with pillow python scripts/render_previews.py content/week-01 OUT_DIR
ponytail: placeholder stills map by scene group; swap PLACEHOLDER for real
generated stills (content/week-01/stills/Sxx.jpg) once gen is unblocked.
"""

import json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "public/images"
W, H, FPS = 1080, 1920, 30
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
PLACEHOLDER = {  # still id -> existing image (same character, different scene)
    "S01": "gen-02-cream-blazer.jpg",
    "S02": "gen-13-laugh.jpg",
    "S03": "gen-35-window-lean.jpg",
    "S04": "gen-33-walk.jpg",
    "S05": "gen-08-blazer-bluehour.jpg",
    "S06": "gen-14-serene.jpg",
    "S07": "gen-15-34-look.jpg",
    "S08": "workout/wo-08-post-workout.jpg",
    "S09": "workout/wo-07-stretch-hoodie.jpg",
    "S10": "workout/wo-04-yoga-warrior.jpg",
    "S11": "workout/wo-02-gym-squat.jpg",
    "S12": "workout/wo-09-cycling.jpg",
    "S13": "gen-10-plum-night.jpg",
    "S14": "gen-19-sequin.jpg",
    "S15": "gen-32-blue-hour.jpg",
    "S18": "gen-12-coral-coord.jpg",
    "S19": "gen-41-yellow-34.jpg",
    "S20": "gen-31-noon-squint.jpg",
    "S21": "gen-40-overcast.jpg",
    "S22": "gen-37-lookback-coat.jpg",
    "S23": "gen-26-look-up.jpg",
    "S24": "gen-39-tungsten-sit.jpg",
    "S25": "gen-36-hands-hair.jpg",
}


def text_png(text: str, out: Path, size=64, y=1180, tag=False) -> None:
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FONT, size)
    if tag:
        d.text(
            (40, 60),
            text,
            font=ImageFont.truetype(FONT, 30),
            fill=(255, 255, 255, 200),
            stroke_width=2,
            stroke_fill=(0, 0, 0, 200),
        )
        im.save(out)
        return
    words, lines, cur = text.split(), [], []
    for w in words:  # wrap at 920px
        if cur and d.textlength(" ".join(cur + [w]).replace("*", ""), font=f) > 920:
            lines.append(cur)
            cur = []
        cur.append(w)
    lines.append(cur)
    for i, line in enumerate(lines):
        x = (W - d.textlength(" ".join(line).replace("*", ""), font=f)) / 2
        for w in line:
            punch = w.startswith("*") or w.rstrip(".,!?").endswith("*")
            clean = w.replace("*", "")
            d.text(
                (x, y + i * (size + 18)),
                clean,
                font=f,
                fill="#FFD60A" if punch else "white",
                stroke_width=5,
                stroke_fill="black",
            )
            x += d.textlength(clean + " ", font=f)
    im.save(out)


def render(reel: dict, out: Path, tmp: Path) -> None:
    segs = []
    for n, s in enumerate(reel["shots"]):
        src = IMG / PLACEHOLDER.get(s["still"], "gen-07-beauty-beige.jpg")
        frames, seg = int(s["dur"] * FPS), tmp / f"{reel['id']}-{n}.mp4"
        vf = (
            f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,crop={W * 2}:{H * 2},"
            f"zoompan=z='min(zoom+0.0007,1.15)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={frames}:s={W}x{H}:fps={FPS}"
        )
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-loop",
                "1",
                "-i",
                str(src),
                "-vf",
                vf,
                "-frames:v",
                str(frames),
                "-pix_fmt",
                "yuv420p",
                str(seg),
            ],
            check=True,
        )
        segs.append(seg)
    lst = tmp / f"{reel['id']}.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in segs))
    base = tmp / f"{reel['id']}-base.mp4"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c",
            "copy",
            str(base),
        ],
        check=True,
    )
    pngs = [(tmp / f"{reel['id']}-tag.png", None)]
    text_png(
        f"PREVIEW · {reel['id']} · placeholder stills · music: {reel.get('music', '')}"[
            :70
        ],
        pngs[0][0],
        tag=True,
    )
    for k, o in enumerate(reel["overlays"]):
        p = tmp / f"{reel['id']}-o{k}.png"
        text_png(o["text"], p)
        pngs.append((p, o))
    inputs, chain, last = ["-i", str(base)], [], "0:v"
    for k, (p, o) in enumerate(pngs, 1):
        inputs += ["-i", str(p)]
        en = "" if o is None else f":enable='between(t,{o['t']},{o['t'] + o['dur']})'"
        chain.append(f"[{last}][{k}:v]overlay=0:0{en}[v{k}]")
        last = f"v{k}"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            *inputs,
            "-filter_complex",
            ";".join(chain),
            "-map",
            f"[{last}]",
            "-c:v",
            "libx264",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(out),
        ],
        check=True,
    )


if __name__ == "__main__":
    week, outdir = Path(sys.argv[1]), Path(sys.argv[2])
    outdir.mkdir(parents=True, exist_ok=True)
    reels = json.loads((week / "reels.json").read_text())
    with tempfile.TemporaryDirectory() as t:
        for r in reels:
            out = outdir / f"{r['id']}-format{r['format']}-PREVIEW.mp4"
            render(r, out, Path(t))
            print(out)
