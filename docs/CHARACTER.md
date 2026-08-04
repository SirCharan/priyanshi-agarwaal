# Priyanshi Agarwaal — Character Architecture

Canonical identity bible for reproducible image generation and LoRA training.  
Use this + golds in `public/images/` + sheets in `public/images/architecture/` + single-view plates in `local-gen/consistency/`.

**Version:** v3 — hotter hourglass lock (brows / bust / hips) + clean upper lip (2026-08-04)

---

## Identity lock (paste first in every prompt)

```
photo of prynshi woman, beautiful hot cute young South Asian woman, soft feminine face, perfectly groomed salon eyebrows — clean shape, soft natural arch, polished and even as if just done at a salon (not thick bushy, not sparse pencil-thin, not unibrow), large dark almond eyes long lashes, smooth clear skin, clean smooth upper lip no facial hair no mustache no stubble, full soft pink lips, long wavy near-black hair soft curtain bangs center-left. Hot slim-thick hourglass body 165cm: full round breasts 92cm bust, tiny waist 62cm, wide hips and round firm ass 98cm hips, soft feminine curves, long legs. Keep this face and body identical in every pose.
```

**LoRA token:** always include `prynshi` when the adapter is loaded.

---

## Canonical body measurements (lock these) — v3 hotter

Slim-thick / soft hourglass (not skinny runway). Source of truth for captions + LoRA.

| Metric | Value | Notes |
|--------|-------|--------|
| **Height** | **165 cm** (5′5″) | |
| **Weight** | **54 kg** | Soft curves, not bulk |
| **Bust (full)** | **92 cm** | Full round chest; ~34C–D look |
| **Underbust** | **74 cm** | |
| **Band / cup guide** | ~34C–D | Clothing prompts |
| **Waist** | **62 cm** | Small, defined |
| **Hips** | **98 cm** | Wide hip, round glutes |
| **Hip:waist** | ~1.58 | Clear hourglass |
| **Glutes** | Full, round, lifted | Visible in fitted / rear views |
| **Shoulder width** | **37 cm** | Soft slope |
| **Thigh (mid)** | **52 cm** | Soft athletic, not skinny |
| **Inseam** | **78 cm** | Long legs |
| **Neck** | **31 cm** | Elegant |

### Measurement / hotness prompt snippet

```
165cm, 92-62-98 bust-waist-hip, full round breasts, tiny waist, wide hips round firm ass, salon-groomed polished eyebrows soft arch, cute hot feminine
```

**Do not** give bushy thick brows, sparse/uneven brows, flat chest, boyish hips, mustache/stubble, masculine jaw, or stick-straight hair.

---

## Face landmarks (must hold at every angle)

| Region | Spec |
|--------|------|
| **Face shape** | Oval; soft jaw; short rounded chin; cute not hard |
| **Hairline** | Natural rounded; no hard widow’s peak |
| **Bangs** | Soft curtain bangs, center-left part, skim brows; airy not blunt |
| **Hair** | Near-black; mid-back; loose S-waves; crown volume |
| **Brows** | **Salon-finished:** clean, polished, even shape; soft refined arch; professional grooming — as if just left a salon. Not bushy/thick, not sparse/pencil, not unibrow, not overplucked gaps |
| **Eyes** | Large almond; dark brown; long lashes; warm catchlights |
| **Nose** | Straight soft tip, refined |
| **Lips** | Full soft pink; defined cupid’s bow |
| **Upper lip** | **Smooth, hairless** — never stubble/mustache |
| **Cheeks** | Soft high cheekbones; apple when smiling |
| **Makeup** | Soft glam glow, subtle liner, natural flush — pretty/hot editorial |

### Face multi-view checklist (generate as **separate** images, not one grid)

| ID | View | Camera |
|----|------|--------|
| F0 | Front | Eye-level, face square to camera |
| F45L / F45R | 3/4 left / right | Body optional crop |
| F90L / F90R | True profile L/R | Ear + nose silhouette |
| F-up | Slight low angle | Chin line soft, not under-jaw monster |
| F-down | Slight high angle | Bangs readable |
| F-back | Occipital / hair back | Wave pattern + part from behind |

### Expression defaults

- **Neutral soft** · **Soft smile** · **Laugh** (teeth OK) · **Serene eyes closed**

---

## Body + pose consistency (same skeleton every shot)

Same 86-64-90, same limb lengths, whether standing, sitting, or training.

| Pose family | Spec |
|-------------|------|
| **Stand front** | Weight often one hip; long neck; arms relaxed |
| **Stand back** | Same hip width; hair mid-back; spine straight |
| **Stand 3/4** | Shoulder–hip ratio holds |
| **Sit chair** | Hips 90 cm readable; torso not shortened; knees together or soft cross |
| **Sit floor / ground** | Same waist–hip; no mass gain in thighs |
| **Walk / stride** | Long inseam; natural arm swing |
| **Squat / gym** | Athletic but not bodybuilder; modest athletic wear |
| **Yoga / stretch** | Limb length stable; no rubber arms |
| **Over-shoulder** | Head turn only; body proportions unchanged |
| **Beauty crop** | Head-shoulders only; neck length consistent |

### Hair lock (all poses)

```
same hair: near-black long S-waves, soft curtain bangs center-left part, mid-back length, crown volume, never stick-straight, never blonde or light brown, never short bob
```

---

## Gold reference map

| Role | File | Use for |
|------|------|---------|
| Full body front | `public/images/3cf63eb8-….jpg` | Body, front face, stand |
| 3/4 laugh | `public/images/142c2511-….jpg` | Smile, casual |
| Side profile | `public/images/de4e3f32-….jpg` | Nose/chin silhouette |
| Seated | `public/images/fdcb4672-….jpg` | Sit hips |
| Beauty close | `public/images/6b204030-….jpg` | Face lock, bangs |
| Face multi-angle sheet | `public/images/architecture/arch-face-orthographic.jpg` | QA only (not LoRA grid) |
| Body turnaround sheet | `public/images/architecture/arch-body-turnaround.jpg` | QA only |
| Single-view plates | `local-gen/consistency/plates/` | LoRA dataset preferred |

> **Training rule:** Prefer **one person, one pose per image**. Multi-panel architecture sheets are for human QA / 3D mannequin check — not primary LoRA crops (grids confuse the model).

---

## Master prompt blocks

### Style lock

```
High-fashion editorial photograph. Sharp focus on the face, natural color grade, clean composition, professional photography, tasteful modest-friendly clothing, no text, no logos, single subject.
```

### Local Draw Things (with LoRA)

```bash
LORA=1 ./scripts/gen.sh "photo of prynshi woman, 165cm 86-64-90 slim-athletic, [pose], [outfit], [light], same hair S-waves curtain bangs"
```

### Generation procedure

1. Identity lock + measurements snippet + hair lock.  
2. One angle + one pose + one outfit + light + style.  
3. For face: use beauty gold as img2img ref strength 0.35–0.5.  
4. For outfit change: **pure LoRA t2i** (img2img ≤0.7 on strong golds locks the old outfit).  
5. QA against this bible + mannequin ratios.  
6. Register keepers in `lib/photos.ts`.

---

## Local 3D body + face (live on site)

**Production (single page):** https://priyanshi-agarwaal.vercel.app/#body

Everything lives on **one page** (`/`) — gallery, workout, architecture, **photoreal body-ref plates**, archive.

- **Body reference:** `public/images/body-ref/` — multi-angle **nude photoreal** plates of her (front / 3/4 / side / back), same LoRA identity as gallery. Used as clothing-fit lock. No mesh mannequin.
- **Hair / face:** locked to golds + `prynshi` LoRA; regenerate body-ref if face drifts.

```bash
# Regenerate local nude body plates (Draw Things + LoRA)
# see local-gen/scripts or session notes
```

If a generated outfit image changes hips, legs, or face vs body-ref plates, discard.

---

## Do / Don’t

**Do:** bangs + S-wave · warm medium skin · 86-64-90 · long legs · single subject  

**Don’t:** ethnicity/age rewrite · extreme morphs · heavy glam by default · multi-person · watermarks · train on multi-face grids

---

## Changelog

- **v1** — golds + arch sheets, qualitative proportions  
- **v2** — numeric measurements, hair lock, pose matrix, mannequin, single-view plate pipeline  
