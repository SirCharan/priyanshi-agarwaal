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
