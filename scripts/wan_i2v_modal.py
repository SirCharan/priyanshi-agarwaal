"""Wan 2.2 image-to-video on Modal (H100).

modal run scripts/wan_i2v_modal.py --jobs content/week-01/i2v_jobs.json --out OUT_DIR
jobs: [{"id": "d1", "image": "public/images/x.jpg", "prompt": "...", "seed": 1}]
"""

import json
from pathlib import Path

import modal

MODEL = "Wan-AI/Wan2.2-TI2V-5B-Diffusers"
W, H, FRAMES, FPS = 704, 1280, 121, 24  # 5s @ 24fps, native 720p
NEG = (
    "static, frozen, still image, blurry, low quality, jpeg artifacts, deformed face, distorted hands, "
    "extra fingers, extra limbs, plastic skin, cartoon, CGI, oversaturated, flicker, morphing, text, watermark"
)

app = modal.App("priyanshi-wan-i2v")
cache = modal.Volume.from_name("hf-cache")
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")
    .pip_install(
        "torch==2.5.1",
        "diffusers>=0.35.0",
        "transformers>=4.49",
        "accelerate",
        "ftfy",
        "sentencepiece",
        "imageio",
        "imageio-ffmpeg",
        "pillow",
    )
    .env({"HF_HOME": "/hf"})
)


@app.function(
    image=image, gpu="L40S", volumes={"/hf": cache}, timeout=1800, max_containers=4
)
def i2v(img_bytes: bytes, prompt: str, seed: int = 1) -> bytes:
    import io, tempfile, torch
    from PIL import Image
    from diffusers import WanImageToVideoPipeline
    from diffusers.utils import export_to_video

    pipe = WanImageToVideoPipeline.from_pretrained(
        MODEL, torch_dtype=torch.bfloat16
    ).to("cuda")
    cache.commit()
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    # centre-crop to 9:16 then resize
    w, h = im.size
    tw = int(h * 9 / 16)
    if tw < w:
        im = im.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))
    else:
        th = int(w * 16 / 9)
        im = im.crop((0, (h - th) // 2, w, (h - th) // 2 + th))
    im = im.resize((W, H), Image.LANCZOS)
    frames = pipe(
        image=im,
        prompt=prompt,
        negative_prompt=NEG,
        height=H,
        width=W,
        num_frames=FRAMES,
        guidance_scale=5.0,
        num_inference_steps=50,
        generator=torch.Generator("cuda").manual_seed(seed),
    ).frames[0]
    out = tempfile.mktemp(suffix=".mp4")
    export_to_video(frames, out, fps=FPS)
    return Path(out).read_bytes()


@app.local_entrypoint()
def main(jobs: str, out: str):
    js = json.loads(Path(jobs).read_text())
    Path(out).mkdir(parents=True, exist_ok=True)
    args = [(Path(j["image"]).read_bytes(), j["prompt"], j.get("seed", 1)) for j in js]
    for j, mp4 in zip(js, i2v.starmap(args, return_exceptions=True)):
        if isinstance(mp4, Exception):
            print("FAIL", j["id"], repr(mp4)[:300])
            continue
        p = Path(out) / f"{j['id']}.mp4"
        p.write_bytes(mp4)
        print("OK", p)
