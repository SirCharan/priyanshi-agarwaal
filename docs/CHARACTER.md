# Priyanshi Agarwaal — Character Architecture

Canonical identity bible for reproducible image generation and LoRA training.  
Use this + golds in `public/images/` + sheets in `public/images/architecture/` + single-view plates in `local-gen/consistency/`.

**Version:** v2 — measurements + multi-view face/body/hair lock (2026-08-04)

---

## Identity lock (paste first in every prompt)

```
Exact same young South Asian woman named prynshi: long wavy near-black hair with soft curtain bangs that skim the eyebrows (center-left part, S-wave mid-length past shoulders), warm medium-tan skin with even golden undertone, large dark almond eyes, full naturally arched brows, straight nose with soft rounded tip, full lips with defined cupid's bow, oval face soft jaw short chin. Slim-athletic build 165 cm: bust 86 cm, underbust 72 cm, waist 64 cm, hips 90 cm, long legs, narrow-medium sloped shoulders. Keep face, hair color and wave pattern, skin tone, and these body proportions identical and unchanged in every pose.
```

**LoRA token:** always include `prynshi` when the adapter is loaded.

---

## Canonical body measurements (lock these)

Fashion-editorial slim-athletic. Numbers are the **source of truth** for prompts, LoRA captions, and the local 3D proportion mannequin (`local-gen/consistency/mannequin.html`).

| Metric | Value | Notes |
|--------|-------|--------|
| **Height** | **165 cm** (5′5″) | Fashion camera often reads slightly taller |
| **Weight** | **52 kg** | Lean; not skinny-fragile, not muscular bulk |
| **BMI band** | ~19.1 | Slim-athletic |
| **Bust (full)** | **86 cm** | Soft natural chest; not exaggerated |
| **Underbust** | **72 cm** | |
| **Band / cup guide** | ~32B–C | For clothing prompts only |
| **Waist** | **64 cm** | Defined, natural (no extreme hourglass) |
| **Hips** | **90 cm** | Gentle curve; hip:waist ≈ 1.41 |
| **Shoulder width** | **38 cm** | Biacromial, soft slope |
| **Arm length (shoulder→wrist)** | **58 cm** | Slim arms, no bulk |
| **Inseam** | **78 cm** | Long-legged vs torso |
| **Outseam** | **98 cm** | |
| **Thigh (mid)** | **48 cm** | Athletic, not thick |
| **Calf** | **33 cm** | Slim |
| **Ankle** | **20 cm** | |
| **Neck** | **31 cm** | Long, elegant |
| **Torso (CS7–hip)** | ~42 cm | Medium torso, longer legs |
| **Shoe** | EU 38 / US 7.5 | Slim foot |
| **Hand** | Slim fingers, modest nails | No claw poses |

### Measurement prompt snippet

```
165cm tall, 52kg, slim-athletic, 86-64-90 bust-waist-hip, long legs, narrow soft shoulders
```

**Do not** thicken arms, widen jaw, lighten skin, straighten hair stick-straight, age her, or inflate bust/hips past the table.

---

## Face landmarks (must hold at every angle)

| Region | Spec |
|--------|------|
| **Face shape** | Oval; medium forehead; soft jaw; short rounded chin |
| **Hairline** | Natural rounded; no hard widow’s peak |
| **Bangs** | Soft curtain bangs, center-left part, skim brows; airy not blunt |
| **Hair** | Near-black / very dark brown; mid-back length; loose S-waves; crown volume; flyaways OK in wind; **same part + wave pattern from front, 3/4, profile, back** |
| **Brows** | Full natural arch, dark; slight lift outer third |
| **Eyes** | Large almond; dark brown; long lashes; mild lid fold; warm catchlights |
| **Nose** | Straight bridge, soft tip, small refined nostrils |
| **Lips** | Full; soft pink-nude; defined cupid’s bow |
| **Cheeks** | Soft high cheekbones; apple when smiling |
| **Ears** | Small; often half-hidden by waves |
| **Makeup** | Natural fashion glow; no heavy contour unless shot asks |

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

Everything lives on **one page** (`/`) — gallery, workout, architecture, 3D studio, archive. No separate routes.

- **Base body:** full anatomy for clothing QA — lathed 86-64-90 curves, breasts + nipples, glutes, mons/camel-toe ridge.
- **Outfit layers:** full anatomy · bikini · fitted · loose (same skeleton).
- **Face expressions:** eyes open / half / closed · mouth closed / soft-open / open · smile none / soft / full.
- **Hair:** mid-back S-wave + curtain bangs locked on every expression.

Local offline mannequin:

```bash
open local-gen/consistency/mannequin.html
```

If a generated image reads wider hips, shorter legs, or a different face under a new expression, discard or retrain.

---

## Do / Don’t

**Do:** bangs + S-wave · warm medium skin · 86-64-90 · long legs · single subject  

**Don’t:** ethnicity/age rewrite · extreme morphs · heavy glam by default · multi-person · watermarks · train on multi-face grids

---

## Changelog

- **v1** — golds + arch sheets, qualitative proportions  
- **v2** — numeric measurements, hair lock, pose matrix, mannequin, single-view plate pipeline  
