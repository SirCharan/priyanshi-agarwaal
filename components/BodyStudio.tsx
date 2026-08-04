"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  DEFAULT_FACE,
  FACE_PRESETS,
  type FaceExpression,
  type OutfitMode,
} from "@/components/BodyModel";

const BodyModel = dynamic(() => import("@/components/BodyModel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(64vh,640px)] items-center justify-center text-sm text-muted">
      Loading 3D model…
    </div>
  ),
});

const OUTFITS: { id: OutfitMode; label: string; blurb: string }[] = [
  {
    id: "none",
    label: "Full anatomy",
    blurb: "Unclothed — breasts, nipples, glutes, camel toe for fit QA.",
  },
  {
    id: "bikini",
    label: "Bikini",
    blurb: "Minimal coverage; anatomy still readable at edges.",
  },
  {
    id: "fitted",
    label: "Body-fitting",
    blurb: "Tight wrap on the same curves.",
  },
  {
    id: "loose",
    label: "Loose-fitting",
    blurb: "Ease volume — under-silhouette stays 86-64-90.",
  },
];

export default function BodyStudio() {
  const [outfit, setOutfit] = useState<OutfitMode>("none");
  const [eyes, setEyes] = useState<FaceExpression["eyes"]>("open");
  const [mouth, setMouth] = useState<FaceExpression["mouth"]>("closed");
  const [smile, setSmile] = useState<FaceExpression["smile"]>("soft");

  const face = useMemo(
    () => ({ eyes, mouth, smile }),
    [eyes, mouth, smile]
  );
  const key = `${outfit}-${eyes}-${mouth}-${smile}`;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="space-y-4 lg:col-span-4">
        <div className="rounded-sm border border-line bg-card p-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg text-ink">
            Face expression
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {FACE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setEyes(p.face.eyes);
                  setMouth(p.face.mouth);
                  setSmile(p.face.smile);
                }}
                className="rounded-full border border-line bg-bg px-2.5 py-1 text-xs text-ink-soft transition hover:border-accent hover:text-ink"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <label className="block">
              <span className="text-xs text-muted">Eyes</span>
              <select
                value={eyes}
                onChange={(e) =>
                  setEyes(e.target.value as FaceExpression["eyes"])
                }
                className="mt-1 w-full rounded-sm border border-line bg-bg px-2 py-1.5"
              >
                <option value="open">Open</option>
                <option value="half">Half</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted">Mouth</span>
              <select
                value={mouth}
                onChange={(e) =>
                  setMouth(e.target.value as FaceExpression["mouth"])
                }
                className="mt-1 w-full rounded-sm border border-line bg-bg px-2 py-1.5"
              >
                <option value="closed">Closed</option>
                <option value="soft-open">Soft open</option>
                <option value="open">Open</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted">Smile</span>
              <select
                value={smile}
                onChange={(e) =>
                  setSmile(e.target.value as FaceExpression["smile"])
                }
                className="mt-1 w-full rounded-sm border border-line bg-bg px-2 py-1.5"
              >
                <option value="none">None</option>
                <option value="soft">Soft</option>
                <option value="full">Full</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className="mt-2 text-xs text-accent underline-offset-2 hover:underline"
            onClick={() => {
              setEyes(DEFAULT_FACE.eyes);
              setMouth(DEFAULT_FACE.mouth);
              setSmile(DEFAULT_FACE.smile);
            }}
          >
            Reset face
          </button>
        </div>

        <div className="rounded-sm border border-line bg-card p-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg text-ink">
            Body / clothing
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {OUTFITS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOutfit(o.id)}
                className={`rounded-sm border px-3 py-2 text-left text-sm transition ${
                  outfit === o.id
                    ? "border-accent bg-accent-soft/40 text-ink"
                    : "border-line bg-bg text-ink-soft hover:border-ink/20"
                }`}
              >
                <span className="font-medium">{o.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{o.blurb}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            165 cm · 86-64-90 · full anatomy on base so bikini and body-fit never
            reshape the frame.
          </p>
        </div>
      </aside>

      <div className="overflow-hidden rounded-sm border border-line bg-[linear-gradient(180deg,#f6f1ea_0%,#ebe3d8_100%)] lg:col-span-8">
        <div className="h-[min(64vh,640px)] w-full">
          <BodyModel key={key} outfit={outfit} face={face} />
        </div>
        <p className="border-t border-line px-3 py-2 text-center text-xs text-muted">
          Drag to orbit · scroll to zoom · red ring = waist 64 cm
        </p>
      </div>
    </div>
  );
}
