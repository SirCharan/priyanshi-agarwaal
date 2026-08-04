"use client";

import { useMemo, useState } from "react";

export type LoraShot = {
  id: string;
  src: string;
  version: "v1" | "v2" | "v3";
  promptKey: string;
  title: string;
  note?: string;
};

/** Matched prompts across LoRA versions for A/B comparison */
export const LORA_COMPARE_SHOTS: LoraShot[] = [
  // v1 — first train (8 images, 400 steps, weight often 1.0)
  {
    id: "v1-navy",
    src: "/images/lora-compare/v1-navy-jumpsuit.png",
    version: "v1",
    promptKey: "navy",
    title: "Navy jumpsuit",
    note: "v1 · 8 imgs · 400 steps · weight ~1.0",
  },
  {
    id: "v1-gym",
    src: "/images/lora-compare/v1-gym-set.png",
    version: "v1",
    promptKey: "gym",
    title: "Gym set",
    note: "v1 · early LoRA",
  },
  {
    id: "v1-portrait",
    src: "/images/lora-compare/v1-soft-portrait.png",
    version: "v1",
    promptKey: "portrait",
    title: "Soft portrait",
    note: "v1 · soft studio",
  },
  // v2 — 20 imgs (incl multipanel then), 700 steps
  {
    id: "v2-navy",
    src: "/images/lora-compare/v2-navy-jumpsuit.png",
    version: "v2",
    promptKey: "navy",
    title: "Navy jumpsuit",
    note: "v2 · 700 steps · weight 0.65 + neg",
  },
  {
    id: "v2-gym",
    src: "/images/lora-compare/v2-gym-set.png",
    version: "v2",
    promptKey: "gym",
    title: "Gym set",
    note: "v2 · beauty defaults",
  },
  {
    id: "v2-portrait",
    src: "/images/lora-compare/v2-soft-portrait.png",
    version: "v2",
    promptKey: "portrait",
    title: "Soft portrait",
    note: "v2 · salon brow lock",
  },
  // v3 — clean 18 imgs, beauty captions, salon brows, 92-62-98
  {
    id: "v3-navy",
    src: "/images/lora-compare/v3-navy-jumpsuit.png",
    version: "v3",
    promptKey: "navy",
    title: "Navy jumpsuit",
    note: "v3 · clean set · hourglass 92-62-98",
  },
  {
    id: "v3-gym",
    src: "/images/lora-compare/v3-gym-set.png",
    version: "v3",
    promptKey: "gym",
    title: "Gym set",
    note: "v3 · beauty retrain",
  },
  {
    id: "v3-portrait",
    src: "/images/lora-compare/v3-soft-portrait.png",
    version: "v3",
    promptKey: "portrait",
    title: "Soft portrait",
    note: "v3 · salon brows · no mustache neg",
  },
];

const VERSION_META: Record<
  LoraShot["version"],
  { label: string; blurb: string; chip: string }
> = {
  v1: {
    label: "LoRA v1",
    blurb: "8 images · 400 steps · full weight — mustache / plastic risk",
    chip: "bg-muted/20 text-ink-soft ring-line",
  },
  v2: {
    label: "LoRA v2",
    blurb: "20 images · 700 steps · lower weight + negatives",
    chip: "bg-accent-soft/40 text-ink ring-accent/30",
  },
  v3: {
    label: "LoRA v3",
    blurb: "18 clean images · beauty captions · salon brows · 92-62-98",
    chip: "bg-ink text-bg ring-ink",
  },
};

export default function LoraCompare() {
  const [filter, setFilter] = useState<"all" | "v1" | "v2" | "v3" | "navy" | "portrait" | "gym">(
    "all"
  );
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<LoraShot | null>(null);

  const shots = useMemo(() => {
    return LORA_COMPARE_SHOTS.filter((s) => {
      if (missing[s.id]) return false;
      if (filter === "all") return true;
      if (filter === "v1" || filter === "v2" || filter === "v3")
        return s.version === filter;
      return s.promptKey === filter;
    });
  }, [filter, missing]);

  const byVersion = (v: LoraShot["version"]) =>
    LORA_COMPARE_SHOTS.filter((s) => s.version === v && !missing[s.id]);

  return (
    <div>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {(["v1", "v2", "v3"] as const).map((v) => {
          const m = VERSION_META[v];
          const n = byVersion(v).length;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setFilter(v)}
              className={`rounded-sm border border-line p-4 text-left transition hover:ring-1 hover:ring-ink/20 ${
                filter === v ? "ring-1 ring-ink/30 bg-card" : "bg-card/60"
              }`}
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${m.chip}`}
              >
                {m.label}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{m.blurb}</p>
              <p className="mt-2 text-[11px] text-muted">{n} on site</p>
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["navy", "Navy prompt"],
            ["portrait", "Portrait prompt"],
            ["gym", "Gym prompt"],
            ["v1", "v1 only"],
            ["v2", "v2 only"],
            ["v3", "v3 only"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              filter === id
                ? "border-accent bg-accent-soft/50 text-ink"
                : "border-line bg-card text-ink-soft hover:border-ink/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shots.length === 0 ? (
        <p className="rounded-sm border border-line bg-card px-4 py-10 text-center text-sm text-ink-soft">
          Comparison frames for this filter are still generating. Refresh after
          LoRA v3 finishes — files land in{" "}
          <code className="text-xs">public/images/lora-compare/</code>.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {shots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s)}
              className="group overflow-hidden rounded-sm bg-card text-left ring-1 ring-line transition hover:ring-ink/30"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={`${s.version} ${s.title}`}
                  className="aspect-[3/4] w-full object-cover object-top"
                  loading="lazy"
                  onError={() =>
                    setMissing((m) => ({ ...m, [s.id]: true }))
                  }
                />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${VERSION_META[s.version].chip}`}
                >
                  {s.version}
                </span>
              </div>
              <div className="border-t border-line px-3 py-2">
                <p className="font-[family-name:var(--font-playfair)] text-sm text-ink">
                  {s.title}
                </p>
                {s.note ? (
                  <p className="text-[11px] text-muted">{s.note}</p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          role="dialog"
          aria-modal
          onClick={() => setActive(null)}
        >
          <figure
            className="relative max-h-[90vh] max-w-lg overflow-hidden rounded-sm bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.title}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="border-t border-line px-4 py-3 text-sm">
              <p className="font-[family-name:var(--font-playfair)] text-ink">
                {active.version.toUpperCase()} · {active.title}
              </p>
              <p className="text-xs text-muted">{active.note}</p>
            </figcaption>
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-ink/70 px-3 py-1 text-xs text-bg"
              onClick={() => setActive(null)}
            >
              Close
            </button>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
