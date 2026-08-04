#!/usr/bin/env bash
# Gold-first nudes: ALWAYS img2img from pinned Grok seeds — never pure t2i for ship plates.
# Two-pass: high strength body/pose → mid strength face re-lock from face gold.
#
# Usage:
#   ./gold-i2i-nude.sh smoke          # 1 pose Flux + LoRA
#   ./gold-i2i-nude.sh both           # full pose set Flux then LoRA
#   ./gold-i2i-nude.sh flux           # Flux only full set
#   ./gold-i2i-nude.sh lora           # LoRA only full set
#   ./gold-i2i-nude.sh flux-one stand-front
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
QC="$ROOT/outputs/gold-i2i-qc"
DRAFT="$QC/drafts"
HERO_FLUX="$REPO/public/images/body-hero"
HERO_LORA="$REPO/public/images/body-hero-lora"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
mkdir -p "$QC" "$DRAFT" "$HERO_FLUX" "$HERO_LORA"

# --- Pinned Grok golds (2–3 only) ---
FACE_RAW="${FACE:-$REPO/public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg}"
FACE2_RAW="${FACE2:-$REPO/public/images/gen-07-beauty-beige.jpg}"
BODY_RAW="${BODY:-$REPO/public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg}"
SEEDS="$QC/seeds"
mkdir -p "$SEEDS"

SDXL_MODEL="${SDXL_MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
LORA_FILE="${LORA_FILE:-prynshi-sdxl-v3_600_lora_f32.ckpt}"
LORA_WEIGHT="${LORA_WEIGHT:-0.65}"

# Two-pass strengths (SDXL i2i — Flux Klein i2i crashes in draw-things-cli)
PASS1_STR="${PASS1_STR:-0.78}"
PASS2_STR="${PASS2_STR:-0.55}"

LORA_W=768
LORA_H=1024
STEPS_LORA="${STEPS_LORA:-28}"
CFG_LORA="${CFG_LORA:-6.5}"

FACE_LOCK='exact same woman as reference image, keep her face identity, soft feminine South Asian face, salon-groomed polished soft-arch eyebrows, clean smooth upper lip no mustache, large dark almond eyes, full soft pink lips, long wavy near-black hair curtain bangs, warm medium-tan skin'
BODY_NUDE='completely naked fully nude topless bottomless, no clothes no bra no pasties no underwear no fabric, bare breasts nipples fully visible, bare smooth shaved pussy, bare ass, soft feminine slim-thick hourglass 92-62-98, full round soft breasts, tiny waist, wide hips, round firm ass, long legs, smooth hairless skin'
NEG='clothes, clothing, dressed, fabric, underwear, bra, panties, bikini, pasties, nipple covers, tape, straps, thong, mustache, beard, stubble, body hair, armpit hair, pubic bush, hairy, ugly, deformed, extra limbs, blurry, lowres, text, watermark, cartoon, 3d render, mannequin, muscular bodybuilder abs, male, different person, wrong face'

for g in "$FACE_RAW" "$FACE2_RAW" "$BODY_RAW"; do
  [[ -f "$g" ]] || { echo "Missing gold: $g"; exit 1; }
done
[[ -f "$MODELS/$LORA_FILE" ]] || { echo "FATAL: LoRA missing $LORA_FILE"; exit 1; }

# Pre-resize golds so i2i dims match (avoids soft crops; Flux i2i still broken)
FACE="$SEEDS/face-768x1024.png"
FACE2="$SEEDS/face2-768x1024.png"
BODY="$SEEDS/body-768x1024.png"
sips -z "$LORA_H" "$LORA_W" "$FACE_RAW" --out "$FACE" >/dev/null
sips -z "$LORA_H" "$LORA_W" "$FACE2_RAW" --out "$FACE2" >/dev/null
sips -z "$LORA_H" "$LORA_W" "$BODY_RAW" --out "$BODY" >/dev/null
echo "Seeds ready @ ${LORA_W}x${LORA_H}"

pose_prompt() {
  case "$1" in
    stand-front) echo "full body standing facing camera, hand on hip, arched back, seductive soft smile, bedroom soft light" ;;
    stand-34)    echo "full body three-quarter standing, looking at camera seductive, one hand in hair" ;;
    sit)         echo "full body sitting on bed edge legs slightly apart seductive, fully nude explicit" ;;
    on-back)     echo "lying on back on sheets fully nude, seductive look at camera, arched body" ;;
    from-behind) echo "standing from behind looking over shoulder, fully nude, round ass emphasized" ;;
    kneel)       echo "kneeling on bed fully nude, seductive pose looking up" ;;
    *) echo "full body standing fully nude seductive studio"; ;;
  esac
}

seed_for_pose() {
  case "$1" in
    from-behind) echo "$BODY" ;;
    on-back|sit) echo "$FACE2" ;;
    *) echo "$FACE" ;;
  esac
}

gen_lora_i2i() {
  local out="$1" ref="$2" prompt="$3" str="$4"
  echo "=== LORA gold-i2i str=$str → $(basename "$out") ==="
  draw-things-cli generate --model "$SDXL_MODEL" \
    --image "$ref" --strength "$str" \
    --prompt "photo of prynshi woman, $prompt" \
    --negative-prompt "$NEG" \
    --width "$LORA_W" --height "$LORA_H" \
    --steps "$STEPS_LORA" --cfg "$CFG_LORA" \
    --output "$out" \
    --config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}"
  ls -lh "$out"
}

# Two-pass: pass1 high str from pose seed; pass2 mid str from FACE gold
two_pass_lora() {
  local id="$1"
  local pose seed prompt draft final
  pose=$(pose_prompt "$id")
  seed=$(seed_for_pose "$id")
  prompt="${FACE_LOCK}, ${BODY_NUDE}, ${pose}, seductive expression, explicit adult nude, sharp focus"
  draft="$DRAFT/lora-${id}-pass1.png"
  final="$QC/lora-gold-${id}.png"
  gen_lora_i2i "$draft" "$seed" "$prompt" "$PASS1_STR"
  gen_lora_i2i "$final" "$FACE" "$prompt" "$PASS2_STR"
  # Primary ship path (Flux Klein i2i broken in CLI — ship LoRA gold as hero too)
  cp -f "$final" "$HERO_LORA/lora-gold-${id}.png"
  cp -f "$final" "$HERO_FLUX/flux-gold-${id}.png"
  echo "SHIPPED lora-gold-${id}.png (+ flux-gold slot for UI)"
}

POSES=(stand-front stand-34 sit on-back from-behind kneel)
MODE="${1:-lora}"
ONLY="${2:-}"

case "$MODE" in
  smoke|lora-one)
    two_pass_lora "${ONLY:-stand-front}"
    ;;
  lora|both|flux)
    # flux/both collapse to lora until Draw Things Flux i2i is fixed
    if [[ "$MODE" == "flux" || "$MODE" == "both" ]]; then
      echo "NOTE: Flux Klein img2img aborts (ccv concat dim). Using SDXL+LoRA gold-i2i only."
    fi
    for id in "${POSES[@]}"; do
      [[ -n "$ONLY" && "$id" != "$ONLY" ]] && continue
      two_pass_lora "$id"
    done
    ;;
  *)
    echo "Usage: $0 smoke|lora|lora-one [pose]  (flux/both → lora until Flux i2i fixed)"
    exit 1
    ;;
esac

echo "=== gold-i2i done ==="
ls -lah "$QC"/*.png 2>/dev/null || true
ls -lah "$HERO_FLUX"/flux-gold-*.png 2>/dev/null || true
ls -lah "$HERO_LORA"/lora-gold-*.png 2>/dev/null || true
