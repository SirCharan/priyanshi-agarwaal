#!/usr/bin/env bash
# Text-to-image — SDXL + prynshi LoRA (beauty-tuned defaults)
set -euo pipefail
PROMPT="${1:-}"
if [[ -z "$PROMPT" ]]; then
  echo "Usage: LORA=1 $0 \"photo of prynshi woman, ...\""
  echo "  LORA_WEIGHT=0.7 STEPS=30 $0 \"...\""
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/gen-$STAMP.png"
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
if [[ -z "${LORA_FILE:-}" ]]; then
  for cand in prynshi-sdxl-v3_600_lora_f32.ckpt prynshi-sdxl-v2_700_lora_f32.ckpt prynshi-sdxl-v2_600_lora_f32.ckpt prynshi-sdxl_400_lora_f32.ckpt; do
    [[ -f "$MODELS/$cand" ]] && LORA_FILE=$cand && break
  done
  LORA_FILE="${LORA_FILE:-prynshi-sdxl_400_lora_f32.ckpt}"
fi
# Full 1.0 weight overfits and causes artifacts (mustache, plastic face)
LORA_WEIGHT="${LORA_WEIGHT:-0.7}"
STEPS="${STEPS:-28}"
CFG="${CFG:-6.5}"

# Always front-load beauty lock when using LoRA
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  if [[ "$PROMPT" != *prynshi* ]]; then
    PROMPT="photo of prynshi woman, ${PROMPT}"
  fi
  PROMPT="beautiful hot cute feminine ${PROMPT}, salon-groomed polished eyebrows soft clean arch, smooth clear skin, clean smooth upper lip, soft glam makeup, pretty eyes, 92-62-98 hourglass"
fi

NEG="${NEG:-bushy eyebrows, thick unibrow, sparse uneven brows, overplucked brows, mustache, moustache, beard, stubble, goatee, facial hair, male face, masculine jaw, flat chest, boyish hips, ugly, deformed, blurry, low quality, text, watermark, logo}"

ARGS=(generate --model "$MODEL" --prompt "$PROMPT"
  --negative-prompt "$NEG"
  --steps "$STEPS" --cfg "$CFG"
  --width "${WIDTH:-768}" --height "${HEIGHT:-1024}"
  --output "$OUT")
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  echo "LoRA=$LORA_FILE weight=$LORA_WEIGHT steps=$STEPS cfg=$CFG"
  ARGS+=(--config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}")
fi

draw-things-cli "${ARGS[@]}"
echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
