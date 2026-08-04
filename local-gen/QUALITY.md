# Why local LoRA looked worse than Grok (and how we fix it)

## Diagnosis (navy jumpsuit sample vs Grok laugh gold)

| Issue | Cause |
|-------|--------|
| **“Mustache”** | SDXL + dark hair often paints **upper-lip shadow** as stubble. Worse at **LoRA weight 1.0**. No negative prompt. Captions never said “clean upper lip”. |
| **Less hot / cute** | Base is **SDXL 8-bit**, not Grok Imagine. Grok is a larger beauty-tuned model. Local gens used dry prompts + no beauty keywords. |
| **Face drift** | Dataset included **multi-panel 1280×720 sheets** (`02_face_angles`, `03_body_turnaround`) — multiple faces/bodies in one image confuses LoRA. |
| **Caption bloat** | Heavy `165cm 52kg 86-64-90` tokens diluted face/beauty signal during train. |
| **Overfit** | Weight **1.0** + 400–700 steps on 8–20 images → plastic / artifacted face. |

## Fixes applied

1. **Excluded multipanel sheets** → `dataset/_excluded_multipanel/`  
2. **Beauty captions**: smooth upper lip (no mustache); **salon-groomed brows** (polished arch, not bushy/thick, not sparse); hourglass **92-62-98**  
3. **Gen defaults**: `LORA_WEIGHT=0.7`, `--steps 28`, `--cfg 6.5`, negatives include mustache + bushy/sparse brows  
4. **v3 retrain** on clean set when GPU free — `prynshi-sdxl-v3`  

### Brows (user lock)

Want **salon finish** — clean, even, soft arch, just-left-the-salon polish. **Not** thicker/fuller/bushy brows.

## How to generate (good results)

```bash
cd local-gen
LORA=1 LORA_WEIGHT=0.65 ./scripts/gen.sh \
  "full body fashion, navy jumpsuit, studio soft light, soft smile, cute pretty"

# Face lock outfit change: gold + low strength
LORA=1 LORA_WEIGHT=0.7 ./scripts/gen-img2img.sh \
  ../public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg \
  "same woman, soft smile, studio beauty" 0.35
```

If mustache returns: drop weight to **0.55–0.65**, keep negative, or use **img2img from beauty gold**.

## Realistic ceiling

Local SDXL+LoRA will not match Grok Imagine on raw photoreal beauty. It **can** match **identity** for unlimited free bulk. Use Grok for hero frames; LoRA for volume after v3.

## Why LoRA looked so bad vs Grok (2026-08-04)

1. **Wrong job for the tool** — Grok Imagine is a large beauty-tuned model. Our LoRA sat on **SDXL 8-bit**, a much weaker base, trained on ~8–20 images.
2. **Training poison** — multi-panel sheets + measurement-heavy captions; weight **1.0** → artifacts (mustache from upper-lip shadow).
3. **Not actually nude** — SDXL + “nude” often keeps implied clothing / soft censorship in the base; Flux Klein local is freer and sharper for explicit.
4. **Resolution** — 768×1024 looks soft next to Grok heroes.

### Decision (user interview)
- Priority: **quality over LoRA identity**
- Stack: **Flux Klein 4B, no LoRA first**
- Content: **fully nude, more explicit/seductive**
- Ship only after **QC** at **~1080p** (1088×1472)
- Keep LoRA v1–v3 as **history**; add **hero** Flux row on site

### Hybrid Grok + Flux + LoRA (locked)
See **[HYBRID.md](./HYBRID.md)** for full loop.

| Role | Tool |
|------|------|
| Advisor + vision QC + prompt rewrite | **Grok** |
| Fully nude @1088×1472 | **Flux Klein** local |
| Identity bulk / history | **SDXL LoRA** |
| Clothed beauty seeds | **Grok Imagine** (nudes often blocked) |

Ship bar: **fully nude + looks OK**. Loop max 3 tries on fail.

### Other models (prefer local uncensored)
| Model | Why |
|-------|-----|
| **Flux Klein** (now) | On disk; better fidelity; local freer NSFW |
| **Flux Dev / Schnell** (if VRAM) | Higher quality than Klein if it fits |
| **Pony / RealVis / Juggernaut** | Explicit or photoreal checkpoints if Klein soft-censors (bra/pasties) |
| **Grok Imagine** | Best beauty — **QC + clothed seeds only** |
| Avoid for nudes | Midjourney, OpenAI, many hosted APIs (censor) |
