#!/usr/bin/env bash
# Text-to-image — default SDXL 8-bit on 16 GB Air
set -euo pipefail
PROMPT="${1:-}"
if [[ -z "$PROMPT" ]]; then
  echo "Usage: $0 \"your prompt\""
  echo "  MODEL=flux_2_klein_4b_q6p.ckpt $0 \"...\""
  echo "  LORA=1 $0 \"photo of prynshi woman, ...\"   # attach prynshi-sdxl_400"
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/outputs"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$OUT_DIR/gen-$STAMP.png"
MODEL="${MODEL:-sd_xl_base_1.0_q6p_q8p.ckpt}"
LORA_FILE="${LORA_FILE:-prynshi-sdxl_400_lora_f32.ckpt}"
LORA_WEIGHT="${LORA_WEIGHT:-1.0}"

ARGS=(generate --model "$MODEL" --prompt "$PROMPT" --width 768 --height 1024 --output "$OUT")
if [[ "${LORA:-0}" == "1" || "${LORA:-}" == "true" ]]; then
  ARGS+=(--config-json "{\"loras\":[{\"file\":\"$LORA_FILE\",\"weight\":$LORA_WEIGHT,\"version\":\"sdxl_base_v0.9\"}]}")
fi

draw-things-cli "${ARGS[@]}"
echo "Wrote $OUT"
open "$OUT" 2>/dev/null || true
