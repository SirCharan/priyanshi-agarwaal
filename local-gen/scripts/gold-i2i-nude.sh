#!/usr/bin/env bash
# Fully nude gold-i2i — FIXED again after Grok QC.
#
# Failures:
# 1) Pass2 from clothed face gold → sweater portraits
# 2) Pass1 from FACE closeup gold even at 0.88 → still clothes (composition lock)
#
# Fix:
# - Full-body nudes seed from: (a) existing LoRA nude body-ref, or (b) full-body gold, NEVER face closeup
# - Face closeup gold only for beauty-bust + very high strength
# - Pass2 always from nude draft
# - Optional pure LoRA t2i fallback if draft still looks clothed (manual)
#
# Usage: FORCE=1 ./gold-i2i-nude.sh all
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
QC="$ROOT/outputs/gold-i2i-qc"
DRAFT="$QC/drafts"
HERO="$REPO/public/images/body-hero"
HERO_LORA="$REPO/public/images/body-hero-lora"
BREF="$REPO/public/images/body-ref"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
SEEDS="$QC/seeds"
mkdir -p "$QC" "$DRAFT" "$HERO" "$HERO_LORA" "$SEEDS"

FACE_RAW="${FACE:-$REPO/public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg}"
FACE2_RAW="${FACE2:-$REPO/public/images/gen-07-beauty-beige.jpg}"
BODY_RAW="${BODY:-$REPO/public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg}"

SDXL_MODEL="${SDXL_MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
LORA_FILE="${LORA_FILE:-prynshi-sdxl-v3_600_lora_f32.ckpt}"
LORA_WEIGHT="${LORA_WEIGHT:-0.62}"

# High for body-gold; medium when seed is already nude body-ref
PASS1_STR_NUDE_SEED="${PASS1_STR_NUDE_SEED:-0.72}"
PASS1_STR_BODY_GOLD="${PASS1_STR_BODY_GOLD:-0.92}"
PASS1_STR_FACE="${PASS1_STR_FACE:-0.95}"
PASS2_STR="${PASS2_STR:-0.40}"

LORA_W=768
LORA_H=1024
STEPS_LORA="${STEPS_LORA:-30}"
CFG_LORA="${CFG_LORA:-7.5}"

FACE_LOCK='beautiful young Indian South Asian woman, warm medium-tan brown skin, large dark brown almond eyes, salon-groomed soft-arch eyebrows, full soft pink lips, clean smooth upper lip no mustache, long wavy near-black hair soft curtain bangs, cute hot feminine face, NOT east asian, NOT chinese, NOT japanese, NOT korean'
BODY_NUDE='completely naked fully nude, topless bottomless, zero clothing, no shirt no sweater no top no fabric on body, bare breasts nipples visible, bare pussy, bare ass, soft slim-thick hourglass, full round bare breasts, tiny waist, wide hips, round firm ass, long legs, only nude skin'
NEG='clothes, clothing, dressed, fabric, sweater, top, shirt, dress, off-shoulder, blouse, bra, panties, bikini, pasties, underwear, straps, covered breasts, clothed, lingerie, swimsuit, mustache, beard, stubble, ugly, deformed, extra limbs, blurry, watermark, mannequin, male, east asian, chinese face, japanese face, korean face, pale white skin'

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

# Prefer already-nude body-ref plates (proven nude) resized to gen size
prep_nude_seed() {
  local src="$1" name="$2"
  local out="$SEEDS/nudesource-${name}.png"
  if [[ -f "$src" ]]; then
    sips -z "$LORA_H" "$LORA_W" "$src" --out "$out" >/dev/null
    echo "$out"
  else
    echo ""
  fi
}

NUDE_FRONT=$(prep_nude_seed "$BREF/v3-front-nude.png" front)
NUDE_34=$(prep_nude_seed "$BREF/v3-34-nude.png" 34)
NUDE_SIT=$(prep_nude_seed "$BREF/v3-sit-nude.png" sit)
NUDE_BACK=$(prep_nude_seed "$BREF/v3-back-nude.png" back)
NUDE_SIDE=$(prep_nude_seed "$BREF/v3-side-nude.png" side)

echo "Seeds ready. Nude body-ref: front=${NUDE_FRONT:+yes} 34=${NUDE_34:+yes}"
echo "PASS1 nude-seed=$PASS1_STR_NUDE_SEED body-gold=$PASS1_STR_BODY_GOLD face=$PASS1_STR_FACE PASS2=$PASS2_STR"

pose_prompt() {
  case "$1" in
    stand-front)  echo "full body standing facing camera, hand on hip, arched back, seductive soft smile, bedroom soft light" ;;
    stand-34)     echo "full body three-quarter standing, looking at camera, one hand in hair, seductive" ;;
    sit)          echo "full body sitting on bed edge legs slightly apart, fully nude explicit" ;;
    on-back)      echo "lying on back on white sheets fully nude, look at camera, arched body" ;;
    from-behind)  echo "standing from behind looking over shoulder, fully nude, ass emphasized" ;;
    kneel)        echo "kneeling on bed fully nude, looking up seductive" ;;
    side)         echo "full body side profile standing fully nude, hourglass silhouette" ;;
    arms-up)      echo "full body standing arms raised behind head, fully nude, arched back" ;;
    lean-forward) echo "full body leaning forward toward camera fully nude, bare breasts clear" ;;
    all-fours)    echo "on all fours on bed, fully nude, looking at camera" ;;
    beauty-bust)  echo "waist-up fully nude topless bare breasts nipples visible, beauty light" ;;
    sit-chair)    echo "full body sitting on chair fully nude, elegant seductive" ;;
    *) echo "full body standing fully nude seductive studio" ;;
  esac
}

# Returns: path|strength  (seed and which pass1 strength to use)
seed_and_str() {
  local id="$1"
  case "$id" in
    stand-front)
      if [[ -n "$NUDE_FRONT" ]]; then echo "${NUDE_FRONT}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    stand-34|lean-forward|arms-up)
      if [[ -n "$NUDE_34" ]]; then echo "${NUDE_34}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    sit|sit-chair)
      if [[ -n "$NUDE_SIT" ]]; then echo "${NUDE_SIT}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    from-behind|all-fours)
      if [[ -n "$NUDE_BACK" ]]; then echo "${NUDE_BACK}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    side)
      if [[ -n "$NUDE_SIDE" ]]; then echo "${NUDE_SIDE}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    on-back|kneel)
      if [[ -n "$NUDE_FRONT" ]]; then echo "${NUDE_FRONT}|${PASS1_STR_NUDE_SEED}"
      else echo "${BODY}|${PASS1_STR_BODY_GOLD}"; fi
      ;;
    beauty-bust)
      echo "${FACE}|${PASS1_STR_FACE}"
      ;;
    *)
      echo "${BODY}|${PASS1_STR_BODY_GOLD}"
      ;;
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

# Pure t2i nude (no image) — strong for body; use if we need guaranteed nude base
gen_lora_t2i() {
  local out="$1" prompt="$2"
  echo "=== t2i nude → $(basename "$out") ==="
  draw-things-cli generate --model "$SDXL_MODEL" \
    --prompt "photo of prynshi woman, $prompt" \
    --negative-prompt "$NEG" \
    --width "$LORA_W" --height "$LORA_H" \
    --steps "$STEPS_LORA" --cfg "$CFG_LORA" \
    --output "$out" \
    --config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}"
  ls -lh "$out"
}

two_pass_lora() {
  local id="$1"
  local pose seed_str seed p1str prompt draft final
  pose=$(pose_prompt "$id")
  seed_str=$(seed_and_str "$id")
  seed="${seed_str%%|*}"
  p1str="${seed_str##*|}"
  prompt="${FACE_LOCK}, ${BODY_NUDE}, ${pose}, explicit adult nude photograph, no clothing anywhere on body, sharp focus"
  draft="$DRAFT/lora-${id}-pass1.png"
  final="$QC/lora-gold-${id}.png"

  echo "--- $id seed=$(basename "$seed") pass1_str=$p1str ---"
  gen_lora_i2i "$draft" "$seed" "$prompt" "$p1str"

  # Pass2: only refine draft (keep nude)
  gen_lora_i2i "$final" "$draft" \
    "${FACE_LOCK}, ${BODY_NUDE}, ${pose}, still fully nude no clothes no fabric, keep nude body, refine face toward South Asian beauty, sharp" \
    "$PASS2_STR"

  cp -f "$final" "$HERO_LORA/lora-gold-${id}.png"
  cp -f "$final" "$HERO/flux-gold-${id}.png"
  echo "SHIPPED: flux-gold-${id}.png"
}

# Pure t2i full set then light i2i from draft — alternate mode for stubborn clothes
t2i_then_refine() {
  local id="$1"
  local pose prompt draft final
  pose=$(pose_prompt "$id")
  prompt="${FACE_LOCK}, ${BODY_NUDE}, ${pose}, explicit adult nude, no clothing, studio soft light"
  draft="$DRAFT/lora-${id}-t2i.png"
  final="$QC/lora-gold-${id}.png"
  gen_lora_t2i "$draft" "$prompt"
  gen_lora_i2i "$final" "$draft" \
    "${FACE_LOCK}, ${BODY_NUDE}, ${pose}, fully nude, refine face, sharp" \
    0.35
  cp -f "$final" "$HERO_LORA/lora-gold-${id}.png"
  cp -f "$final" "$HERO/flux-gold-${id}.png"
  echo "SHIPPED t2i-path: flux-gold-${id}.png"
}

POSES=(stand-front stand-34 sit on-back from-behind kneel)
MORE=(side arms-up lean-forward all-fours beauty-bust sit-chair)
MODE="${1:-all}"
ONLY="${2:-}"
FORCE="${FORCE:-0}"

run_list() {
  local id fn
  for id in "$@"; do
    [[ -n "$ONLY" && "$id" != "$ONLY" ]] && continue
    if [[ -f "$HERO/flux-gold-${id}.png" && "$FORCE" != "1" && -z "$ONLY" ]]; then
      echo "SKIP: flux-gold-${id}.png"
      continue
    fi
    if [[ "$MODE" == "t2i" ]]; then
      t2i_then_refine "$id"
    else
      two_pass_lora "$id"
    fi
  done
}

case "$MODE" in
  smoke|lora-one)
    FORCE=1
    two_pass_lora "${ONLY:-stand-front}"
    ;;
  t2i-smoke)
    FORCE=1
    t2i_then_refine "${ONLY:-stand-front}"
    ;;
  lora) run_list "${POSES[@]}" ;;
  more) run_list "${MORE[@]}" ;;
  all)  run_list "${POSES[@]}" "${MORE[@]}" ;;
  t2i)  MODE=t2i; run_list "${POSES[@]}" "${MORE[@]}" ;;
  *)
    echo "Usage: FORCE=1 $0 smoke|lora|more|all|t2i|t2i-smoke|lora-one [pose]"
    exit 1
    ;;
esac

echo "=== gold-i2i done ==="
ls -lah "$HERO"/flux-gold-*.png 2>/dev/null || true
