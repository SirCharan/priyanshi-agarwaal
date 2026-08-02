# Priyanshi Agarwaal — Character Architecture

Canonical identity bible for reproducible image generation.  
Use this + the architecture sheets in `public/images/architecture/` before every new shoot.

---

## Identity lock (paste first in every prompt)

```
Exact same young South Asian woman as the reference images: long wavy near-black hair with soft curtain bangs that skim the eyebrows, warm medium-tan skin with even undertone, large dark almond eyes, full naturally arched brows, straight nose with a soft rounded tip, full lips with defined cupid's bow, oval face with soft jaw and short chin, slim-athletic build with narrow shoulders and balanced hips. Keep her face, facial features, hair color, skin tone, and body proportions completely identical and unchanged.
```

---

## Face landmarks

| Region | Spec |
|--------|------|
| **Face shape** | Oval; forehead medium height; jaw soft, not square; chin short and rounded |
| **Hairline** | Natural rounded; no hard widow’s peak |
| **Bangs** | Soft curtain bangs, slightly parted center-left, length to brows; airy, not blunt |
| **Hair** | Near-black / very dark brown; long wavy (shoulder to mid-back); loose S-waves; volume at crown; flyaways OK in wind |
| **Brows** | Full, naturally arched, dark; not over-plucked; slight lift at outer third |
| **Eyes** | Large almond; dark brown iris; long lashes; mild upper lid fold; warm catchlights |
| **Nose** | Straight bridge, soft tip, small refined nostrils; no sharp ridge |
| **Lips** | Full upper + lower; soft pink-nude; defined cupid’s bow; natural line |
| **Cheeks** | Soft high cheekbones; gentle apple when smiling |
| **Ears** | Small; often half-hidden by waves |
| **Makeup baseline** | Natural fashion: soft glow skin, light blush, subtle liner, natural lip — never heavy contour or dramatic glam unless shot asks |

### Expression defaults

- **Neutral soft:** closed mouth, relaxed eyes, slight lifelike asymmetry  
- **Soft smile:** closed lips, cheek lift, eyes warm  
- **Laugh:** open teeth smile, eyes squint, head tilt OK (see `142c2511` gold)  
- **Serene:** eyes closed, chin slightly up (see `6b204030` gold)

---

## Body proportions

| Region | Spec |
|--------|------|
| **Build** | Slim-athletic; fashion height look; long limbs relative to torso |
| **Shoulders** | Narrow-medium, soft slope |
| **Torso** | Medium length; defined waist |
| **Hips** | Balanced to shoulders; gentle curve (not extreme) |
| **Legs** | Long; calf/ankle slim |
| **Posture** | Upright fashion stance; weight often on one hip; neck long and relaxed |
| **Hands** | Slim fingers; natural pose (no clawing) |
| **Feet** | Slim; often strappy heels or barefoot in garden shots |

**Do not** thicken arms, widen jaw, lighten skin, straighten hair to stick-straight, or age her up/down.

---

## Gold reference map (local files)

| Role | File | Use for |
|------|------|---------|
| Full body front | `public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg` | Body proportions, front face, standing |
| 3/4 playful | `public/images/142c2511-9d2c-4469-a540-524ff39d818c.jpg` | Laugh, 3/4 body, casual energy |
| Side profile | `public/images/de4e3f32-a973-4dad-b1d7-1a6efe06141e.jpg` | True profile, nose/chin silhouette |
| Seated over-shoulder | `public/images/fdcb4672-faef-4448-bbf3-d366dfd03679.jpg` | Over-shoulder, seated hips |
| Beauty close-up | `public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg` | Face lock, skin, bangs, eyes closed |

### Architecture sheets (generated)

| Sheet | File |
|-------|------|
| Face multi-angle | `public/images/architecture/arch-face-orthographic.jpg` |
| Body turnaround | `public/images/architecture/arch-body-turnaround.jpg` |
| Expressions | `public/images/architecture/arch-expression-sheet.jpg` |
| Lighting study | `public/images/architecture/arch-lighting-study.jpg` |

---

## Master prompt blocks

### Style lock (fashion site)

```
High-fashion editorial photograph for a fashion website. Sharp focus on the face, natural color grade, clean composition, professional photography, tasteful clothing, no text overlays, no logos.
```

### Angle helpers

- **Full front:** “full-body front view, camera at chest height, subject facing camera”
- **3/4:** “three-quarter view, body slightly turned, face toward camera”
- **True profile:** “true side profile, ear and nose silhouette clear, looking to frame edge”
- **Over-shoulder:** “back three-quarter, head turned looking over shoulder toward camera”
- **Beauty close:** “tight portrait head-and-shoulders, shallow depth of field”

### Lighting helpers

- Golden hour · Overcast soft · Hard midday · Blue hour rim · Beauty soft fill · Night string lights · Clean studio softbox

---

## Generation procedure (for future sessions)

1. Load **face close-up** + **full body** as `image_edit` references (never text-only `image_gen` for her face).  
2. Paste **Identity lock** first.  
3. Add one angle + one pose + one outfit + one lighting + **Style lock**.  
4. QA: face shape, bangs, skin tone, body proportions. Regen once if drifted.  
5. Register file in `lib/photos.ts`.

### Tool rule

- **Recurring likeness:** always `image_edit` with existing gold refs.  
- **Never** invent her from a text prompt alone.

---

## Do / Don’t

**Do**

- Keep bangs + wave pattern  
- Keep warm medium skin  
- Keep slim-athletic proportions  
- Vary outfit / light / pose freely once identity is locked  

**Don’t**

- Change ethnicity, age, or beauty “upgrade” that rewrites her face  
- Extreme body morphs  
- Heavy glam makeup by default  
- Text, watermarks, or extra people unless requested  

---

## Version

- **v1** — derived from 7 Grok Imagine gold frames + architecture sheets (session expansion).  
- Update this file when a new gold angle permanently beats an old one.
