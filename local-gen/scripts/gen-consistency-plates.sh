#!/usr/bin/env bash
# Generate single-view face + body consistency plates for LoRA / QA.
# Requires trained SDXL LoRA. Prefer v2 weights when present.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
OUT="$ROOT/consistency/plates"
mkdir -p "$OUT"
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
if [[ -z "${LORA_FILE:-}" ]]; then
  if [[ -f "$MODELS/prynshi-sdxl-v2_700_lora_f32.ckpt" ]]; then
    LORA_FILE=prynshi-sdxl-v2_700_lora_f32.ckpt
  elif [[ -f "$MODELS/prynshi-sdxl-v2_600_lora_f32.ckpt" ]]; then
    LORA_FILE=prynshi-sdxl-v2_600_lora_f32.ckpt
  else
    LORA_FILE=prynshi-sdxl_400_lora_f32.ckpt
  fi
fi
LORA_JSON="{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":1.0,\"version\":\"sdxl_base_v0.9\"}]}"

FACE_REF="${FACE_REF:-$REPO/public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg}"
BODY_REF="${BODY_REF:-$REPO/public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg}"

ID='photo of prynshi woman, young South Asian woman, 165cm tall 52kg slim-athletic 86-64-90 bust-waist-hip, long wavy near-black hair soft curtain bangs center-left part S-waves mid-back, warm medium-tan skin, large dark almond eyes, full lips, oval face'
HAIR='same hair near-black long S-waves soft curtain bangs center-left part mid-back crown volume never stick-straight'
STYLE='high-fashion editorial photograph, single subject, natural color, sharp face, clean studio or simple backdrop, no text no logo'

gen_t2i() {
  local name="$1" prompt="$2" w="${3:-768}" h="${4:-1024}"
  local out="$OUT/${name}.png"
  echo "=== t2i $name ==="
  draw-things-cli generate \
    --model "$MODEL" \
    --prompt "${ID}, ${HAIR}, ${prompt}, ${STYLE}" \
    --width "$w" --height "$h" \
    --config-json "$LORA_JSON" \
    --output "$out" 2>&1 | tail -3
  ls -lh "$out"
}

gen_i2i() {
  local name="$1" ref="$2" prompt="$3" strength="${4:-0.4}" w="${5:-768}" h="${6:-1024}"
  local out="$OUT/${name}.png"
  echo "=== i2i $name strength=$strength ==="
  draw-things-cli generate \
    --model "$MODEL" \
    --image "$ref" \
    --strength "$strength" \
    --prompt "${ID}, ${HAIR}, ${prompt}, ${STYLE}" \
    --width "$w" --height "$h" \
    --config-json "$LORA_JSON" \
    --output "$out" 2>&1 | tail -3
  ls -lh "$out"
}

echo "Using LoRA: $LORA_FILE"

# --- Face multi-view (tight crop) — lock from beauty gold ---
gen_i2i "face-front"      "$FACE_REF" "head and shoulders portrait, face front view eye-level, soft smile, studio soft fill" 0.38 768 768
gen_i2i "face-34-left"    "$FACE_REF" "head and shoulders, three-quarter view face turned left of camera, soft smile, studio" 0.42 768 768
gen_i2i "face-34-right"   "$FACE_REF" "head and shoulders, three-quarter view face turned right of camera, soft smile, studio" 0.42 768 768
gen_i2i "face-profile-l"  "$FACE_REF" "true left side profile portrait, ear and nose silhouette clear, neutral, studio" 0.45 768 768
gen_i2i "face-profile-r"  "$FACE_REF" "true right side profile portrait, ear and nose silhouette clear, neutral, studio" 0.45 768 768
gen_i2i "face-slight-up"  "$FACE_REF" "portrait slight low angle looking gently up, soft smile, studio" 0.4 768 768
gen_i2i "face-hair-back"  "$FACE_REF" "back of head and shoulders, hair from behind showing S-wave mid-back length, studio" 0.48 768 768

# --- Body poses (full body) — t2i so outfit/pose free; measurements in prompt ---
gen_t2i "body-stand-front"   "full body standing front view, simple grey tank and black trousers, studio grey, weight on one hip"
gen_t2i "body-stand-back"    "full body standing back view, same simple grey tank black trousers, studio, hair mid-back visible"
gen_t2i "body-stand-34"      "full body standing three-quarter view, grey tank black trousers, studio"
gen_t2i "body-sit-chair"     "full body sitting on simple chair, upright torso, grey tank black trousers, studio, same 86-64-90 proportions"
gen_t2i "body-sit-floor"     "full body sitting on floor knees soft, grey lounge set, studio, same hip width"
gen_t2i "body-walk"          "full body walking stride side-three-quarter, casual jeans white tee, outdoor soft light"
gen_t2i "body-squat-gym"     "full body gym squat stance, modest black long-sleeve athletic set, gym interior"
gen_t2i "body-yoga"          "full body yoga warrior pose, modest sage athletic set, clean studio"
gen_t2i "body-stretch"       "full body standing overhead stretch, modest hoodie and leggings, soft gym light"
gen_t2i "body-overshoulder"  "full body back three-quarter looking over shoulder toward camera, navy dress, soft light"

echo "Plates written to $OUT"
ls -1 "$OUT" | wc -l
