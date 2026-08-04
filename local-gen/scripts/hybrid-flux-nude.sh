#!/usr/bin/env bash
# Hybrid: Flux Klein generates fully nude @1088x1472; Grok QC is manual/session.
# Usage:
#   ./hybrid-flux-nude.sh              # default pose batch (t2i)
#   ./hybrid-flux-nude.sh fix-front    # rewrite pass for front fail
#   ./hybrid-flux-nude.sh fix-34       # rewrite pass for 34 fail
#   ./hybrid-flux-nude.sh i2i-face     # i2i from Grok face gold → nude
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
QC="$ROOT/outputs/flux-nude-qc"
HERO="$ROOT/../public/images/body-hero"
FACE="$ROOT/../public/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg"
BODY="$ROOT/../public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg"
MODEL="${MODEL:-flux_2_klein_4b_q6p.ckpt}"
W=1088
H=1472
mkdir -p "$QC" "$HERO"

FACE_DESC='beautiful young South Asian woman, long wavy near-black hair with soft curtain bangs, warm medium-tan skin, large dark almond eyes, salon-groomed polished soft-arch eyebrows, full soft pink lips, clean smooth upper lip no mustache, cute hot feminine face'
BODY_DESC='completely naked fully nude topless bottomless, no clothes no bra no pasties no underwear, bare breasts nipples fully visible, bare smooth shaved pussy, bare ass, soft feminine slim-thick hourglass 92-62-98, full round soft breasts, tiny waist, wide hips, round firm ass, long legs, smooth hairless skin'
NEG='clothes, clothing, dressed, fabric, underwear, bra, panties, bikini, pasties, nipple covers, tape, straps, thong, mustache, beard, stubble, body hair, armpit hair, pubic bush, hairy, ugly, deformed, extra limbs, blurry, lowres, text, watermark, cartoon, 3d render, mannequin, muscular bodybuilder abs, male'

gen_t2i() {
  local name="$1" pose="$2"
  echo "=== t2i $name ==="
  draw-things-cli generate --model "$MODEL" \
    --prompt "photoreal erotic photograph of ${FACE_DESC}, ${BODY_DESC}, ${pose}, seductive expression, explicit adult nude, soft bedroom studio lighting, sharp focus, 85mm" \
    --negative-prompt "$NEG" \
    --width "$W" --height "$H" --steps 32 --cfg 3.5 \
    --output "$QC/${name}.png"
  ls -lh "$QC/${name}.png"
}

gen_i2i() {
  local name="$1" ref="$2" pose="$3" str="${4:-0.78}"
  echo "=== i2i $name str=$str ==="
  draw-things-cli generate --model "$MODEL" \
    --image "$ref" --strength "$str" \
    --prompt "exact same woman as reference, ${FACE_DESC}, ${BODY_DESC}, ${pose}, seductive, fully nude explicit topless, keep face identity" \
    --negative-prompt "$NEG" \
    --width "$W" --height "$H" --steps 32 --cfg 3.5 \
    --output "$QC/${name}.png"
  ls -lh "$QC/${name}.png"
}

promote() {
  local src="$1" dest="$2"
  cp "$src" "$HERO/$dest"
  echo "Promoted → public/images/body-hero/$dest"
}

MODE="${1:-batch}"
case "$MODE" in
  batch)
    gen_t2i flux-stand-front-seduce "full body standing facing camera, hand on hip, arched back, seductive soft smile"
    gen_t2i flux-stand-34-seduce "full body three-quarter standing, looking at camera seductive, one hand in hair"
    gen_t2i flux-sit-spread "full body sitting on bed edge legs apart seductive, fully nude explicit"
    gen_t2i flux-on-back "lying on back on sheets fully nude, seductive look at camera, arched body"
    gen_t2i flux-from-behind "standing from behind looking over shoulder, fully nude, round ass emphasized"
    gen_t2i flux-kneel "kneeling on bed fully nude, seductive pose looking up"
    gen_i2i flux-i2i-front "$BODY" "full body standing fully nude seductive, same face as reference" 0.75
    gen_i2i flux-i2i-beauty-nude "$FACE" "same face, full body fully nude seductive standing studio" 0.8
    ;;
  fix-front)
    gen_t2i flux-stand-front-seduce-t2 "full body standing facing camera hand on hip, arched back, seductive, TOPLESS bare breasts nipples visible absolutely no bra"
    gen_i2i flux-stand-front-seduce-i2i "$FACE" "full body standing nude topless bare breasts, hand on hip, bedroom" 0.82
    ;;
  fix-34)
    gen_t2i flux-stand-34-seduce-t2 "full body three-quarter, hand in hair, TOPLESS bare breasts bare nipples, no pasties no tape, soft hourglass"
    gen_i2i flux-stand-34-seduce-i2i "$FACE" "full body three-quarter nude topless, hand in hair, soft curves" 0.82
    ;;
  i2i-face)
    gen_i2i flux-i2i-beauty-nude "$FACE" "same face, pull back full body fully nude topless seductive standing studio" 0.8
    ;;
  promote)
    # Usage: ./hybrid-flux-nude.sh promote <file-in-qc> <hero-name.png>
    promote "$QC/$2" "$3"
    ;;
  *)
    echo "Unknown mode: $MODE (batch|fix-front|fix-34|i2i-face|promote)"
    exit 1
    ;;
esac
echo "Done. Grok-QC each PNG in $QC before promote to body-hero."
ls -lh "$QC"
