# Priyanshi Agarwaal

Portrait gallery site. Fresh project — no shared code or assets with other sites.

## Stack

- Next.js + Tailwind v4
- Deploy: Vercel (1648)

## Character consistency

- **Bible:** `docs/CHARACTER.md` — face/body landmarks + pasteable identity lock
- **Sheets:** `public/images/architecture/` — face multi-angle, body turnaround, expressions, lighting
- **Rule:** always `image_edit` with gold refs; never text-only face gen

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
