# Gold-first face lock (img2img only)

## Rule

**Never pure text-to-image for ship plates.** Grok already painted her face — local gen **starts from those pixels**.

| Bad (old) | Good (now) |
|-----------|------------|
| t2i “South Asian woman…” | i2i from pinned Grok gold |
| Invented generic face | Geometry of eyes/nose/lips from gold |

## Pinned seeds (2–3 only)

| Role | File |
|------|------|
| Face primary | `public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg` |
| Face alt (open eyes) | `public/images/gen-07-beauty-beige.jpg` |
| Full-body structure | `public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg` |

## Two-pass

1. **Pass 1** strength ~**0.82** — body/pose/nude transform from pose seed  
2. **Pass 2** strength ~**0.58** — re-lock from **face primary** gold with same nude+pose prompt  

## Stacks (live)

| Stack | Status |
|-------|--------|
| **SDXL + prynshi-v3 gold i2i** | **Works** — primary face-lock path |
| **Flux Klein i2i** | **Broken** in draw-things-cli (`ccv_cnnp_concat` dim assert). Pure Flux t2i still works but invents face. |

Until Flux i2i is fixed: gold plates ship from LoRA two-pass into both `body-hero/flux-gold-*.png` (UI primary row) and `body-hero-lora/`.

Seeds are pre-resized to **768×1024** before i2i.

## Run

```bash
cd local-gen
./scripts/gold-i2i-nude.sh smoke   # 1 pose two-pass
./scripts/gold-i2i-nude.sh lora    # full 6 poses
```

Ship as generated (script copies into `public/`).
