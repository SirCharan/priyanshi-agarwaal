#!/usr/bin/env bash
# Local-only nude body reference plates (Draw Things — not cloud Imagine).
# Stand + sit, multiple expressions. Requires trained prynshi SDXL LoRA.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
OUT_LOC="$ROOT/outputs/body-ref"
OUT_PUB="$REPO/public/images/body-ref"
mkdir -p "$OUT_LOC" "$OUT_PUB"

MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
LORA_FILE="${LORA_FILE:-}"
if [[ -z "$LORA_FILE" ]]; then
  for cand in prynshi-sdxl-v2_700_lora_f32.ckpt prynshi-sdxl-v2_600_lora_f32.ckpt prynshi-sdxl-v2_500_lora_f32.ckpt prynshi-sdxl_400_lora_f32.ckpt; do
    if [[ -f "$MODELS/$cand" ]]; then LORA_FILE=$cand; break; fi
  done
fi
[[ -n "$LORA_FILE" ]] || { echo "No prynshi LoRA found"; exit 1; }
echo "Using LoRA: $LORA_FILE"
LORA_JSON="{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":1.0,\"version\":\"sdxl_base_v0.9\"}]}"
ID='photo of prynshi woman, young South Asian woman, 165cm 52kg slim-athletic 86-64-90 bust-waist-hip, long wavy near-black hair soft curtain bangs center-left S-waves mid-back, warm medium-tan skin, large dark almond eyes, full lips, oval face'
STYLE='completely nude bare natural body, professional photography studio soft even light, plain grey seamless backdrop, photoreal, sharp focus, single subject, no jewelry no text no watermark'

gen() {
  local name="$1" prompt="$2"
  local dest="$OUT_LOC/${name}.png"
  echo "=== $name ==="
  draw-things-cli generate \
    --model sd_xl_base_1.0_q6p_q8p.ckpt \
    --prompt "${ID}, ${prompt}, ${STYLE}" \
    --width 768 --height 1024 \
    --config-json "$LORA_JSON" \
    --output "$dest"
  cp -f "$dest" "$OUT_PUB/${name}.png"
}

gen stand-front-smile "full body front standing, weight on one hip, soft closed-mouth smile, arms relaxed, bare feet"
gen stand-front-neutral "full body front standing straight, neutral expression closed mouth, arms at sides, bare feet"
gen stand-front-laugh "full body front standing, open mouth laugh smile, happy eyes, bare feet"
gen stand-front-serene "full body front standing, eyes closed serene soft smile, relaxed, bare feet"
gen stand-back "full body rear view standing, mid-back hair, bare feet"
gen stand-side "full body true side profile standing, bare feet"
gen stand-34-smile "full body three-quarter standing, soft smile, bare feet"
gen stand-contrapposto "full body standing contrapposto, hand on hip, soft smile, bare feet"
gen stand-arms-up "full body standing arms raised overhead stretch, soft smile, bare feet"
gen sit-chair-front "full body sitting on simple studio stool, upright, soft smile, front view"
gen sit-chair-34 "full body sitting on stool three-quarter view, soft smile"
gen sit-chair-laugh "full body sitting on stool, open laugh smile"
gen sit-floor-knees "full body sitting on floor knees bent to side, soft smile"
gen sit-floor-cross "full body sitting on floor cross-legged, neutral soft expression"
gen sit-overshoulder "full body seated looking back over shoulder toward camera, soft smile"

echo "Wrote $(ls "$OUT_PUB"/*.png 2>/dev/null | wc -l) plates to $OUT_PUB"
