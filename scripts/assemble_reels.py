"""Join Wan I2V clips into 1080x1920 reels with punch-word captions.

uv run --with pillow python scripts/assemble_reels.py CLIPS_DIR OUT_DIR
Clips named <reel>-<n>.mp4 (d2-1, d2-2 ...). Caption k goes on clip k.
"""

import json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from render_previews import text_png  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
reels = {
    r["id"].split("-")[0]: r
    for r in json.loads((ROOT / "content/week-01/reels.json").read_text())
}
clips_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory() as t:
    t = Path(t)
    for rid, reel in reels.items():
        clips = sorted(clips_dir.glob(f"{rid}-*.mp4"))
        if not clips:
            print("skip", rid)
            continue
        overlays = reel["overlays"]
        cmd, chain, start = ["ffmpeg", "-y", "-loglevel", "error"], [], 0.0
        for k, c in enumerate(clips):
            dur = float(
                subprocess.check_output(
                    [
                        "ffprobe",
                        "-v",
                        "error",
                        "-show_entries",
                        "format=duration",
                        "-of",
                        "csv=p=0",
                        str(c),
                    ]
                )
            )
            png = t / f"{rid}-{k}.png"
            text_png(overlays[min(k, len(overlays) - 1)]["text"], png, y=1450)
            cmd += ["-i", str(c), "-i", str(png)]
            chain.append(
                f"[{2 * k}:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1[s{k}];"
                f"[s{k}][{2 * k + 1}:v]overlay=0:0:enable='gte(t,0.4)'[c{k}]"
            )
            start += dur
        chain.append(
            "".join(f"[c{k}]" for k in range(len(clips)))
            + f"concat=n={len(clips)}:v=1:a=0[v]"
        )
        out = out_dir / f"{rid}-reel.mp4"
        subprocess.run(
            cmd
            + [
                "-filter_complex",
                ";".join(chain),
                "-map",
                "[v]",
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "slow",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                str(out),
            ],
            check=True,
        )
        print(out, f"{start:.1f}s")
