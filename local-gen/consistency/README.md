# Consistency kit — face / body / hair / proportions

## Canon

| File | Role |
|------|------|
| `../docs/CHARACTER.md` (repo) | Full bible v2 |
| `measurements.json` | Numeric lock (165 cm, 86-64-90, hair, face) |
| `mannequin.html` | Local 3D proportion mannequin (Three.js) |
| `plates/` | Single-view face + body gens for LoRA / QA |

## Open mannequin

```bash
open local-gen/consistency/mannequin.html
```

Drag to orbit. Generated images must match this silhouette (long legs, waist 64, hips 90, mid-back hair).

## Generate plates

After LoRA train:

```bash
./scripts/gen-consistency-plates.sh
```

Writes face multi-view (front, 3/4, profiles, hair-back) and body poses (stand, sit, walk, gym, yoga, stretch, over-shoulder). **One person per image** — no multi-panel grids for training.

## Train rule

1. Dataset images = single pose, caption includes `prynshi` + `165cm` + `86-64-90` + hair lock.  
2. Do **not** train primarily on architecture multi-grids.  
3. Prefer pure LoRA t2i for outfit changes.
