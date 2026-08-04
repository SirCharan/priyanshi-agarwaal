#!/usr/bin/env bash
# Download recommended models for 16 GB MacBook Air
set -euo pipefail
echo "Ensuring FLUX.2 Klein 4B (6-bit) + dependencies..."
draw-things-cli models ensure --model flux_2_klein_4b_q6p.ckpt
echo "Ensuring SDXL Base 8-bit (optional LoRA-friendly backup)..."
draw-things-cli models ensure --model sd_xl_base_1.0_q6p_q8p.ckpt || true
echo "Downloaded models:"
draw-things-cli models list --downloaded-only
