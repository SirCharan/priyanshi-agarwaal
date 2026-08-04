#!/usr/bin/env bash
# Image-to-image from a gold Priyanshi ref (stronger identity than text-only)
set -euo pipefail
REF="${1:-}"
PROMPT="${2:-}"
STRENGTH="${3:-0.45}"
if [[ -z "$REF" || -z "$PROMPT" ]]; then
  echo "Usage: $0 <reference.jpg> \"prompt\" [strength 0.25-0.65]"
  echo "  lower strength = closer to reference face"
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/i2i-$STAMP.png"

# Identity lock prefix
LOCK='Exact same young South Asian woman as the reference photo: long wavy dark hair with soft curtain bangs, warm medium skin, identical face and slim-athletic body. '

# Default: SDXL 8-bit (fully working). For Flux Klein once qwen encoder is complete:
#   MODEL=flux_2_klein_4b_q6p.ckpt ./gen-img2img.sh ...
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"

draw-things-cli generate \
  --model "$MODEL" \
  --image "$REF" \
  --strength "$STRENGTH" \
  --prompt "${LOCK}${PROMPT}" \
  --width 768 \
  --height 1024 \
  --output "$OUT"

echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
