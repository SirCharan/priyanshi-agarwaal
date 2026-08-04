#!/usr/bin/env bash
# Gold-first FULLY NUDE plates.
# FIXED two-pass:
#   Pass1: high strength from gold → nude body/pose (must strip clothes)
#   Pass2: refine FROM PASS1 DRAFT (not from clothed face gold!) low strength
# Starting pass2 from the face gold was shipping clothed Grok portraits.
#
# Usage:
#   ./gold-i2i-nude.sh smoke
#   FORCE=1 ./gold-i2i-nude.sh all
#   ./gold-i2i-nude.sh lora-one stand-front
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
QC="$ROOT/outputs/gold-i2i-qc"
DRAFT="$QC/drafts"
HERO="$REPO/public/images/body-hero"
HERO_LORA="$REPO/public/images/body-hero-lora"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
mkdir -p "$QC" "$DRAFT" "$HERO" "$HERO_LORA" "$QC/seeds"

FACE_RAW="${FACE:-$REPO/public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg}"
FACE2_RAW="${FACE2:-$REPO/public/images/gen-07-beauty-beige.jpg}"
BODY_RAW="${BODY:-$REPO/public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg}"
SEEDS="$QC/seeds"

SDXL_MODEL="${SDXL_MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
LORA_FILE="${LORA_FILE:-prynshi-sdxl-v3_600_lora_f32.ckpt}"
LORA_WEIGHT="${LORA_WEIGHT:-0.6}"

# High enough to leave clothes behind; pass2 only refines nude draft
PASS1_STR="${PASS1_STR:-0.88}"
PASS2_STR="${PASS2_STR:-0.42}"

LORA_W=768
LORA_H=1024
STEPS_LORA="${STEPS_LORA:-30}"
CFG_LORA="${CFG_LORA:-7.0}"

FACE_LOCK='exact same woman as reference, keep her face identity, soft feminine South Asian face, salon-groomed polished soft-arch eyebrows, clean smooth upper lip no mustache, large dark almond eyes, full soft pink lips, long wavy near-black hair curtain bangs, warm medium-tan skin'
BODY_NUDE='completely naked fully nude, topless bottomless, zero clothing, no shirt no sweater no dress, bare breasts with nipples visible, bare pussy, bare ass, soft feminine slim-thick hourglass 92-62-98, full round bare breasts, tiny waist, wide hips, round firm ass, long legs, nude skin only'
NEG='clothes, clothing, dressed, fabric, sweater, top, shirt, dress, off-shoulder, blouse, bra, panties, bikini, pasties, underwear, straps, covered breasts, clothed, mustache, beard, stubble, ugly, deformed, extra limbs, blurry, watermark, mannequin, male'

for g in "$FACE_RAW" "$FACE2_RAW" "$BODY_RAW"; do
  [[ -f "$g" ]] || { echo "Missing gold: $g"; exit 1; }
done
[[ -f "$MODELS/$LORA_FILE" ]] || { echo "FATAL: LoRA missing $LORA_FILE"; exit 1; }

FACE="$SEEDS/face-768x1024.png"
FACE2="$SEEDS/face2-768x1024.png"
BODY="$SEEDS/body-768x1024.png"
sips -z "$LORA_H" "$LORA_W" "$FACE_RAW" --out "$FACE" >/dev/null
sips -z "$LORA_H" "$LORA_W" "$FACE2_RAW" --out "$FACE2" >/dev/null
sips -z "$LORA_H" "$LORA_W" "$BODY_RAW" --out "$BODY" >/dev/null
echo "Seeds ready @ ${LORA_W}x${LORA_H}  PASS1=$PASS1_STR PASS2=$PASS2_STR (pass2 from draft)"

pose_prompt() {
  case "$1" in
    stand-front)  echo "full body standing facing camera, hand on hip, arched back, seductive, bedroom" ;;
    stand-34)     echo "full body three-quarter standing, looking at camera, one hand in hair, seductive" ;;
    sit)          echo "full body sitting on bed edge legs apart, fully nude explicit" ;;
    on-back)      echo "lying on back on white sheets fully nude, look at camera, arched body" ;;
    from-behind)  echo "standing from behind looking over shoulder, fully nude, ass emphasized" ;;
    kneel)        echo "kneeling on bed fully nude, looking up seductive" ;;
    side)         echo "full body side profile standing fully nude, hourglass silhouette" ;;
    arms-up)      echo "full body standing arms raised behind head, fully nude, arched back" ;;
    lean-forward) echo "full body leaning forward toward camera fully nude, bare breasts clear" ;;
    all-fours)    echo "on all fours on bed, fully nude, looking at camera" ;;
    beauty-bust)  echo "waist-up fully nude topless bare breasts nipples, beauty light, same face" ;;
    sit-chair)    echo "full body sitting on chair fully nude, elegant seductive" ;;
    *) echo "full body standing fully nude seductive studio" ;;
  esac
}

seed_for_pose() {
  case "$1" in
    from-behind|all-fours) echo "$BODY" ;;
    on-back|sit|sit-chair) echo "$FACE2" ;;
    *) echo "$FACE" ;;
  esac
}

gen_lora_i2i() {
  local out="$1" ref="$2" prompt="$3" str="$4"
  echo "=== i2i str=$str ref=$(basename "$ref") → $(basename "$out") ==="
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

# FIXED: pass2 refines the NUDE draft, not the clothed gold
two_pass_lora() {
  local id="$1"
  local pose seed prompt draft final
  pose=$(pose_prompt "$id")
  seed=$(seed_for_pose "$id")
  prompt="${FACE_LOCK}, ${BODY_NUDE}, ${pose}, explicit adult nude photograph, no clothing anywhere, sharp focus"
  draft="$DRAFT/lora-${id}-pass1.png"
  final="$QC/lora-gold-${id}.png"

  # Pass1: leave clothes — high strength from gold
  gen_lora_i2i "$draft" "$seed" "$prompt" "$PASS1_STR"

  # Pass2: keep nude composition; slight refine identity/quality FROM DRAFT
  # Optional face hint in prompt only — image seed is the nude pass1
  gen_lora_i2i "$final" "$draft" \
    "${FACE_LOCK}, ${BODY_NUDE}, ${pose}, still fully nude no clothes, keep nude body, refine face, sharp" \
    "$PASS2_STR"

  cp -f "$final" "$HERO_LORA/lora-gold-${id}.png"
  cp -f "$final" "$HERO/flux-gold-${id}.png"
  echo "SHIPPED nude plate: flux-gold-${id}.png"
}

POSES=(stand-front stand-34 sit on-back from-behind kneel)
MORE=(side arms-up lean-forward all-fours beauty-bust sit-chair)
MODE="${1:-all}"
ONLY="${2:-}"
FORCE="${FORCE:-0}"

run_list() {
  local id
  for id in "$@"; do
    [[ -n "$ONLY" && "$id" != "$ONLY" ]] && continue
    if [[ -f "$HERO/flux-gold-${id}.png" && "$FORCE" != "1" && -z "$ONLY" ]]; then
      echo "SKIP (set FORCE=1 to redo): flux-gold-${id}.png"
      continue
    fi
    two_pass_lora "$id"
  done
}

case "$MODE" in
  smoke|lora-one)
    FORCE=1
    two_pass_lora "${ONLY:-stand-front}"
    ;;
  lora)
    run_list "${POSES[@]}"
    ;;
  more)
    run_list "${MORE[@]}"
    ;;
  all)
    run_list "${POSES[@]}" "${MORE[@]}"
    ;;
  *)
    echo "Usage: FORCE=1 $0 smoke|lora|more|all|lora-one [pose]"
    exit 1
    ;;
esac

echo "=== gold-i2i done (fixed pass2-from-draft) ==="
ls -lah "$HERO"/flux-gold-*.png 2>/dev/null || true
