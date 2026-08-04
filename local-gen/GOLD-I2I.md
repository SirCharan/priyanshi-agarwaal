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

## Two-pass (FIXED 2026-08-04)

> [!danger] Bug that shipped clothed golds
> Pass2 used to start **from the clothed face gold** at ~0.55 → output stayed a beige sweater portrait.
> **Never** use the clothed gold as pass2 image seed.

1. **Pass 1** strength ~**0.88** — gold seed → strip clothes / nude pose  
2. **Pass 2** strength ~**0.42** — seed = **pass1 nude draft** only (refine face/quality, keep nude)

## Stacks (live)

| Stack | Status |
|-------|--------|
| **SDXL + prynshi-v3 gold i2i** | Primary (must be fully nude) |
| **Flux Klein i2i** | Broken in CLI — do not use |

Seeds pre-resized to **768×1024**. UI labels say gold i2i (LoRA), not real Flux.

## Run

```bash
cd local-gen
./scripts/gold-i2i-nude.sh smoke   # 1 pose two-pass
./scripts/gold-i2i-nude.sh lora    # full 6 poses
```

Ship as generated (script copies into `public/`).
