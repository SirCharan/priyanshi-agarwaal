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

## Loop (full hybrid) — **gold i2i mandatory**

```
┌─────────────────┐
│ 1. SEED         │  Pinned Grok golds ONLY (2–3 images)
│    face / body  │  See GOLD-I2I.md — never pure t2i for ship
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. TWO-PASS i2i │  Pass1 ~0.82 body/pose · Pass2 ~0.58 face re-lock
│    Flux + LoRA  │  Flux primary @1088×1472 · LoRA secondary compare
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. SHIP         │  As generated → body-hero / body-hero-lora → Vercel
│    (fast bar)   │  Optional later: Grok vision QC + rewrite
└─────────────────┘
```

**Why faces were bad:** t2i invents a generic South Asian face. Golds carry *her* pixels.

Script: `scripts/gold-i2i-nude.sh`. LoRA v1–v3 history stays; **gold-i2i** is the hero face path.

Details: **[GOLD-I2I.md](./GOLD-I2I.md)**

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
