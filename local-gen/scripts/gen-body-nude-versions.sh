#!/usr/bin/env bash
# Full-nude photoreal body plates for LoRA v1 / v2 / v3 (local only)
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
OUT="$REPO/public/images/body-ref"
TMP="$ROOT/outputs/body-ref"
mkdir -p "$OUT" "$TMP"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"

NEG='mustache, moustache, beard, stubble, facial hair, bushy eyebrows, unibrow, sparse uneven brows, male face, flat chest, boyish hips, ugly, deformed, blurry, text, watermark, logo, clothes, clothing, fabric, dress, underwear'

ID_BASE='photo of prynshi woman, beautiful hot cute young South Asian woman, salon-groomed polished eyebrows soft clean arch, smooth clear skin, clean smooth upper lip no mustache, large dark almond eyes, full soft pink lips, long wavy near-black hair soft curtain bangs, warm medium-tan skin'
BODY='completely nude bare natural body, full nude body reference plate, professional studio soft even light, plain grey seamless backdrop, photoreal sharp focus, single subject, bare feet'

lora_for() {
  case "$1" in
    v1) echo prynshi-sdxl_400_lora_f32.ckpt ;;
    v2) echo prynshi-sdxl-v2_700_lora_f32.ckpt ;;
    v3)
      if [[ -f "$MODELS/prynshi-sdxl-v3_600_lora_f32.ckpt" ]]; then
        echo prynshi-sdxl-v3_600_lora_f32.ckpt
      elif [[ -f "$MODELS/prynshi-sdxl-v3_450_lora_f32.ckpt" ]]; then
        echo prynshi-sdxl-v3_450_lora_f32.ckpt
      else
        echo prynshi-sdxl-v3_300_lora_f32.ckpt
      fi
      ;;
  esac
}

weight_for() {
  case "$1" in
    v1) echo 0.85 ;;
    *) echo 0.65 ;;
  esac
}

gen() {
  local ver="$1" pose="$2" prompt="$3"
  local lora weight dest tmp
  lora=$(lora_for "$ver")
  weight=$(weight_for "$ver")
  dest="$OUT/${ver}-${pose}-nude.png"
  tmp="$TMP/${ver}-${pose}-nude.png"
  if [[ ! -f "$MODELS/$lora" ]]; then
    echo "SKIP $ver $pose — missing $lora"
    return 0
  fi
  if [[ -f "$dest" ]]; then
    echo "exists $dest"
    return 0
  fi
  echo "=== $ver $pose (lora=$lora w=$weight) $(date +%H:%M:%S) ==="
  draw-things-cli generate \
    --model sd_xl_base_1.0_q6p_q8p.ckpt \
    --prompt "${ID_BASE}, ${prompt}, ${BODY}" \
    --negative-prompt "$NEG" \
    --steps 28 --cfg 6.5 \
    --width 768 --height 1024 \
    --config-json "{\"loras\":[{\"file\":\"$lora\",\"weight\":$weight,\"version\":\"sdxl_base_v0.9\"}]}" \
    --output "$tmp"
  cp -f "$tmp" "$dest"
  ls -lh "$dest"
}

for ver in v1 v2 v3; do
  gen "$ver" front "full body front standing, weight on one hip, soft closed-mouth smile, arms relaxed, hourglass 92-62-98 full breasts round hips"
  gen "$ver" back "full body rear view standing, mid-back hair, round firm glutes, hourglass hips"
  gen "$ver" side "full body true side profile standing, breast and hip silhouette, hourglass"
  gen "$ver" 34 "full body three-quarter standing, soft smile, full breasts wide hips"
  gen "$ver" sit "full body sitting on simple studio stool, upright torso soft smile, nude hourglass figure"
done

echo "DONE $(ls "$OUT"/*-nude.png 2>/dev/null | wc -l | tr -d ' ') body plates"
ls -lh "$OUT"
