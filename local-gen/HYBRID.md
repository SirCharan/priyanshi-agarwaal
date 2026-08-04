# Hybrid pipeline: Grok advisor + Flux generator + LoRA history

Locked 2026-08-04 (interview):

| Role | Tool | Job |
|------|------|-----|
| **Advisor / end-checker** | **Grok** (vision) | Grade every plate; rewrite fail prompts; never ship without a pass (or “looks OK fully nude” bar) |
| **Nude generator** | **Flux Klein 4B** local (Draw Things) | Fully nude / explicit plates @ 1088×1472 |
| **Identity bulk (history)** | **SDXL LoRA** (`prynshi` v1–v3) | Fashion + body-ref archive only; not hero quality |
| **Beauty seeds (optional)** | **Grok Imagine** | Clothed / beauty face+pose heroes when allowed; **do not** rely on Grok for nudes (moderation blocks) |

## Why not “Grok generates nudes”?

Grok Imagine is better-trained on beauty, but **explicit nudes are often blocked** on generate/edit. So Grok is **not** the nude renderer. Grok **is** the taste model for:

1. Seed briefs (pose, lighting, face description)
2. Vision QC on local outputs
3. Prompt rewrite after fail (max 3 tries)

## Loop (full hybrid)

```
┌─────────────────┐
│ 1. SEED         │  Grok golds (clothed beauty) OR pose brief
│    face / pose  │  Existing: public/images/*.jpg golds
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. GENERATE     │  Flux Klein t2i or i2i @ 1088×1472
│    fully nude   │  Local only — uncensored stack
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. GROK QC      │  Vision: fully nude? face OK? deform?
│    + rewrite    │  Fail → rewrite prompt → back to 2 (max 3)
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. SHIP         │  public/images/body-hero/ → Vercel
│    “looks OK”   │  Fully nude + no deform (bar: any solid plate)
└─────────────────┘
```

LoRA stays on `#body` as **train history**. Flux heroes go to `#body` hero row / `body-hero/`.

## QC rubric (Grok end-checker)

| Check | Pass | Fail |
|-------|------|------|
| **Clothes** | Zero fabric: no bra, pasties, thong, tape, straps | Any garment / pastie |
| **Nude explicit** | Bare breasts + nipples, bare crotch or bare ass (pose-dependent) | Soft-censored blur, implied clothes |
| **Face** | Adult South Asian woman, roughly gold-adjacent | Wrong ethnicity, male, childlike, heavy deform |
| **Mustache** | Clean smooth upper lip | Stubble / mustache shadow |
| **Body** | Soft hourglass, not bodybuilder abs / excessive body hair unless asked | Extra limbs, broken anatomy |
| **Res** | ≥1088×1472 | Soft 768 upscale-only |

**Ship bar (user lock):** any **fully nude** local plate that **looks OK** — not only strict A face-match.

## Prompt rewrite rules (after fail)

- Bra / pasties left on → add: `topless, bare breasts, nipples visible, no bra, no pasties, no tape, no fabric on chest` + NEG: `bra, pasties, nipple covers, tape, straps, clothing`
- Too hairy → `smooth shaved skin, hairless body, bare smooth pussy` + NEG: `body hair, armpit hair, pubic hair bush`
- Too muscular → `soft feminine slim-thick hourglass, soft belly, full round breasts, tiny waist, wide hips`
- Face drift → switch to **i2i from Grok face gold** at strength 0.72–0.85 with nude body prompt

## First Grok QC (2026-08-04)

| File | Grade | Why | Rewrite focus |
|------|-------|-----|----------------|
| `flux-stand-front-seduce.png` | **F** | Black bra still on; not fully nude | Strip top; bare breasts |
| `flux-stand-34-seduce.png` | **F** | Black pasties; heavy body hair; athletic not soft hourglass | No pasties; smooth skin; softer curves |

## Other models (uncensored / freer NSFW)

Local (Draw Things / Comfy) — **no cloud censor**:

| Model | Notes |
|-------|--------|
| **Flux Klein 4B** (current) | On disk; good fidelity; freer than SDXL for explicit |
| **Flux Dev / Schnell** | Higher quality if VRAM allows |
| **Pony Diffusion V6 XL** | Explicit-friendly SDXL; anime bias unless photoreal LoRAs |
| **Illustrious / NoobAI** | Strong prompt adherence; more anime; can do NSFW |
| **RealVisXL / Juggernaut / CyberRealistic** | Photoreal people; NSFW varies by checkpoint variant |
| **SDXL + your LoRA** | Identity bulk only — beauty ceiling below Flux/Grok |

Cloud / remote (less censored than Grok/OpenAI/Midjourney):

| Path | Notes |
|------|--------|
| **Self-host** (RunPod / Vast / local Mac) | Full control; same models as above |
| **Civitai on-site gen** | Mixed policy; many NSFW checkpoints |
| **NovelAI** | Uncensored anime-leaning; not photoreal Priyanshi |
| **Fal / Replicate / OpenAI / Midjourney** | Often **censor** nudes — avoid for this job |
| **Grok Imagine** | Best beauty; **nudes blocked often** — advisor + clothed seeds only |

**Recommendation:** stay **Flux Klein local** for nudes; Grok for QC + clothed seeds; if Klein keeps soft-censoring (bra/pasties), try a **Pony/RealVis NSFW checkpoint** or raise explicit prompt weight / steps, or i2i from a fully-nude reference plate once one passes.

## Scripts

- `scripts/hybrid-flux-nude.sh` — generate batch at 1088×1472 into `outputs/flux-nude-qc/`
- Grok QC is session-side (vision on each PNG) → write notes in `outputs/flux-nude-qc/QC.md` → re-run fails
- Promote: `cp` A/OK plates → `public/images/body-hero/`
