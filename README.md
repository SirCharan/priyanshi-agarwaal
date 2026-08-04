# Priyanshi Agarwaal

Portrait gallery site. Fresh project — no shared code or assets with other sites.

## Stack

- Next.js + Tailwind v4
- Deploy: Vercel (1648)

## Character consistency

- **Bible:** `docs/CHARACTER.md` v2 — face, **hair**, **numeric body** (165 cm · 86-64-90 · 52 kg), pose matrix
- **Measurements:** `local-gen/consistency/measurements.json`
- **3D mannequin:** `open local-gen/consistency/mannequin.html` — orbit proportions QA
- **Sheets:** `public/images/architecture/` (human QA) · `local-gen/consistency/plates/` (single-view train plates)
- **LoRA:** token `prynshi` · see `local-gen/README.md`
- **Rule:** gold refs / LoRA for face; pure LoRA t2i for outfit changes

## Images

1. Drop files into `public/images/` (fashion) or `public/images/architecture/`
2. Register them in `lib/photos.ts`
3. Push — Vercel rebuilds

## Dev

```bash
npm install
npm run dev
```

## Live

- https://priyanshi-agarwaal.vercel.app
- https://github.com/SirCharan/priyanshi-agarwaal
