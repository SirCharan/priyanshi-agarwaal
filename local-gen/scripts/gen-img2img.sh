#!/usr/bin/env bash
# Img2img from gold — strength low for face lock; use pure t2i for outfit changes
set -euo pipefail
REF="${1:-}"
PROMPT="${2:-}"
STRENGTH="${3:-0.4}"
if [[ -z "$REF" || -z "$PROMPT" ]]; then
  echo "Usage: LORA=1 $0 <ref.jpg> \"prompt\" [strength 0.3-0.55]"
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/i2i-$STAMP.png"
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
MODELS="$HOME/Library/Containers/com.liuliu.draw-things/Data/Documents/Models"
if [[ -z "${LORA_FILE:-}" ]]; then
  for cand in prynshi-sdxl-v3_600_lora_f32.ckpt prynshi-sdxl-v2_700_lora_f32.ckpt prynshi-sdxl-v2_600_lora_f32.ckpt prynshi-sdxl_400_lora_f32.ckpt; do
    [[ -f "$MODELS/$cand" ]] && LORA_FILE=$cand && break
  done
  LORA_FILE="${LORA_FILE:-prynshi-sdxl_400_lora_f32.ckpt}"
fi
LORA_WEIGHT="${LORA_WEIGHT:-0.7}"
STEPS="${STEPS:-28}"
CFG="${CFG:-6.5}"

LOCK='Exact same beautiful young South Asian woman as reference: soft feminine face, salon-groomed polished eyebrows clean soft arch, smooth clear skin, clean smooth upper lip no mustache no stubble, large dark almond eyes, full soft lips, long wavy near-black hair curtain bangs, warm medium-tan skin, hot hourglass 165cm 92-62-98. '
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  LOCK="photo of prynshi woman, ${LOCK}"
fi

NEG="${NEG:-bushy eyebrows, thick unibrow, sparse uneven brows, mustache, moustache, beard, stubble, facial hair, male face, flat chest, boyish hips, ugly, deformed, blurry, text, watermark}"

ARGS=(generate --model "$MODEL" --image "$REF" --strength "$STRENGTH"
  --prompt "${LOCK}${PROMPT}"
  --negative-prompt "$NEG"
  --steps "$STEPS" --cfg "$CFG"
  --width 768 --height 1024 --output "$OUT")
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  ARGS+=(--config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}")
fi
draw-things-cli "${ARGS[@]}"
echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
