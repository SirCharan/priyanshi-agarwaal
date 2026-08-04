#!/usr/bin/env bash
# Text-to-image with FLUX.2 Klein 4B (6-bit) — best fit for 16 GB M5 Air
set -euo pipefail
PROMPT="${1:-}"
if [[ -z "$PROMPT" ]]; then
  echo "Usage: $0 \"your prompt\""
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/gen-$STAMP.png"

# Default: SDXL 8-bit (fully working on 16 GB Air). Override with MODEL=...
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"

draw-things-cli generate \
  --model "$MODEL" \
  --prompt "$PROMPT" \
  --width 768 \
  --height 1024 \
  --output "$OUT"

echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
