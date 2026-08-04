#!/usr/bin/env bash
# Image-to-image from a gold Priyanshi ref (stronger identity than text-only)
set -euo pipefail
REF="${1:-}"
PROMPT="${2:-}"
STRENGTH="${3:-0.45}"
if [[ -z "$REF" || -z "$PROMPT" ]]; then
  echo "Usage: $0 <reference.jpg> \"prompt\" [strength 0.25-0.65]"
  echo "  LORA=1 $0 ref.jpg \"same woman, navy jumpsuit, full body\" 0.5"
  echo "  lower strength = closer to reference face"
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/i2i-$STAMP.png"

LOCK='Exact same young South Asian woman as the reference photo: long wavy dark hair with soft curtain bangs, warm medium skin, identical face and slim-athletic body. '
# Prefer prynshi token when LoRA is on
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  LOCK="photo of prynshi woman, ${LOCK}"
fi

MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
LORA_FILE="${LORA_FILE:-prynshi-sdxl_400_lora_f32.ckpt}"
LORA_WEIGHT="${LORA_WEIGHT:-1.0}"

ARGS=(generate --model "$MODEL" --image "$REF" --strength "$STRENGTH" \
  --prompt "${LOCK}${PROMPT}" --width 768 --height 1024 --output "$OUT")
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  ARGS+=(--config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}")
fi

draw-things-cli "${ARGS[@]}"
echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
