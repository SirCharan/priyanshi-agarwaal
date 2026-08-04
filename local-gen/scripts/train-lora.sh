#!/usr/bin/env bash
# Train prynshi LoRA — SDXL default (16 GB Air). Flux via BASE=flux.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STEPS="${STEPS:-700}"
BASE="${BASE:-sdxl}" # sdxl | flux
if [[ "$BASE" == "flux" ]]; then
  MODEL=flux_2_klein_4b_q6p.ckpt
  OUT=prynshi-flux
  NAME=prynshi-flux
else
  MODEL=sd_xl_base_1.0_q6p_q8p.ckpt
  OUT=prynshi-sdxl-v2
  NAME=prynshi
fi
echo "Training $NAME on $MODEL · $STEPS steps · dataset=$ROOT/dataset"
draw-things-cli train lora \
  --model "$MODEL" \
  --dataset "$ROOT/dataset" \
  --steps "$STEPS" \
  --memory-saver balanced \
  --output "$OUT" \
  --name "$NAME" \
  --save-every 100 \
  "$@"
echo "Done. Check ~/Library/Containers/com.liuliu.draw-things/Data/Documents/Models/${OUT}_*_lora_f32.ckpt"
