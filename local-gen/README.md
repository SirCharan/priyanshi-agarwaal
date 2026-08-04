# Local image gen — Priyanshi (MacBook Air M5, 16 GB)

## Installed

| Component | How |
|-----------|-----|
| **Draw Things.app** | `/Applications/Draw Things.app` |
| **draw-things-cli** | `brew` → `/opt/homebrew/bin/draw-things-cli` |
| **Working now** | `sd_xl_base_1.0_q6p_q8p.ckpt` — SDXL Base 8-bit + CLIP + VAE ✅ **smoke-tested** |
| **Also on disk** | `flux_2_klein_4b_q6p.ckpt` (2.9 GB) — needs `qwen_3_4b_q8p` text encoder to finish |
| **Models dir** | `~/Library/Containers/com.liuliu.draw-things/Data/Documents/Models` |

**Use SDXL now** (best fit for 16 GB + LoRA). Flux Klein is optional upgrade once its text encoder finishes.

Scripts default to SDXL. Smoke test: ~78 s for 768×1024 on M5 Air.
## Quick generate

```bash
# Text-only (no face lock — generic)
./scripts/gen.sh "fashion photo of a young woman in a red dress, studio"

# Image-to-image from a gold ref (better identity)
./scripts/gen-img2img.sh \
  ../public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg \
  "same woman, full body gym workout long sleeve athletic set, modest"
```

Outputs go to `./outputs/`.

## After LoRA (best multi-image consistency)

1. Confirm base model is downloaded (`draw-things-cli models list --downloaded-only`).
2. Train (memory-saver for 16 GB):

```bash
draw-things-cli train lora \
  --model flux_2_klein_4b_q6p.ckpt \
  --dataset ./dataset \
  --steps 400 \
  --memory-saver balanced
```

3. Generate with the LoRA token **`prynshi`** in the prompt (see captions in `dataset/*.txt`).

## GUI

Open **Draw Things** from Applications → pick **FLUX.2 [klein] 4B (6-bit)** → paste prompts / drop reference images.

## vs Grok Imagine

| | Local Flux Klein | Grok Imagine |
|--|------------------|--------------|
| Volume | Unlimited free | Metered |
| Face lock out of the box | Needs img2img / LoRA | Strong with refs |
| After LoRA on her | Often best for bulk | Still good for heroes |

## Disk

Models live outside the git repo (Draw Things container). Dataset + scripts are in this folder.
