# Local image gen — Priyanshi (MacBook Air M5, 16 GB)

## Installed

| Component | How |
|-----------|-----|
| **Draw Things.app** | `/Applications/Draw Things.app` |
| **draw-things-cli** | `brew` → `/opt/homebrew/bin/draw-things-cli` |
| **SDXL Base 8-bit** | `sd_xl_base_1.0_q6p_q8p.ckpt` — default for scripts + LoRA |
| **FLUX.2 Klein 4B** | `flux_2_klein_4b_q6p.ckpt` + `qwen_3_4b_q8p.ckpt` text encoder (complete) |
| **Models dir** | `~/Library/Containers/com.liuliu.draw-things/Data/Documents/Models` |

Scripts default to **SDXL**. Flux is available via `MODEL=flux_2_klein_4b_q6p.ckpt`.

Rough timing on M5 Air 16 GB (768×1024): SDXL smoke ~78 s · Flux t2i ~59 s · Flux i2i ~23 s.

## Quick generate

```bash
# Text-only (no face lock — generic)
./scripts/gen.sh "fashion photo of a young woman in a red dress, studio"

# Image-to-image from a full-body gold ref (better identity)
./scripts/gen-img2img.sh \
  ../public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg \
  "same woman, navy jumpsuit, studio soft light, full body" \
  0.5

# Flux Klein (optional)
MODEL=flux_2_klein_4b_q6p.ckpt ./scripts/gen.sh "portrait, studio soft light"
```

Outputs go to `./outputs/`. Close-up refs lock framing as portrait — use a **full-body gold** for fashion/gym.

## LoRA (token `prynshi`)

Dataset: `./dataset/` — 8 image+caption pairs, token **`prynshi`** in every caption.

Train on **SDXL** (16 GB–safe):

```bash
draw-things-cli train lora \
  --model sd_xl_base_1.0_q6p_q8p.ckpt \
  --dataset ./dataset \
  --steps 400 \
  --memory-saver balanced \
  --output prynshi-sdxl \
  --name prynshi \
  --save-every 100
```

LoRA files (outside git, Draw Things Models dir):

- `prynshi-sdxl_400_lora_f32.ckpt` — final (use this)
- checkpoints at 100 / 200 / 300 steps also saved

Generate with token **`prynshi`** + LoRA attached:

```bash
# Text-to-image with LoRA
LORA=1 ./scripts/gen.sh "photo of prynshi woman, fashion portrait, studio soft light"

# Img2img + LoRA (best identity)
LORA=1 ./scripts/gen-img2img.sh \
  ../public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg \
  "same woman, navy jumpsuit, studio soft light, full body" \
  0.5
```

CLI equivalent:

```bash
draw-things-cli generate \
  --model sd_xl_base_1.0_q6p_q8p.ckpt \
  --prompt "photo of prynshi woman, ..." \
  --config-json '{"loras":[{"file":"prynshi-sdxl_400_lora_f32.ckpt","weight":1.0,"version":"sdxl_base_v0.9"}]}' \
  --width 768 --height 1024 --output out.png
```

Prefer full-body golds for outfit/pose changes.

## GUI

Open **Draw Things** → model **SDXL Base v1.0 (8-bit)** or **FLUX.2 [klein] 4B (6-bit)** → drop a reference image for img2img.

## vs Grok Imagine

| | Local (SDXL / Flux) | Grok Imagine |
|--|---------------------|--------------|
| Volume | Unlimited free | Metered |
| Face lock out of the box | Needs img2img / LoRA | Strong with refs |
| After LoRA on her | Best for bulk | Still good for heroes |

## Disk

Models live outside the git repo (Draw Things container). Dataset + scripts are in this folder. `outputs/` is gitignored; curated PNGs for the site live under `public/images/local-gen/`.
