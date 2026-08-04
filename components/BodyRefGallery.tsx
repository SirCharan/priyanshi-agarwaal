"use client";

import { useMemo, useState } from "react";

export type BodyVer = "v1" | "v2" | "v3";
export type BodyPose =
  | "front"
  | "back"
  | "side"
  | "three-quarter"
  | "sit";

export type BodyRef = {
  id: string;
  src: string;
  version: BodyVer;
  pose: BodyPose;
  title: string;
  note?: string;
};

/** Photoreal full-nude body plates — same poses across LoRA trains */
export const BODY_NUDE_PLATES: BodyRef[] = [
  // v1
  {
    id: "v1-front",
    src: "/images/body-ref/v1-front-nude.png",
    version: "v1",
    pose: "front",
    title: "Front stand · nude",
    note: "v1 LoRA · early train",
  },
  {
    id: "v1-back",
    src: "/images/body-ref/v1-back-nude.png",
    version: "v1",
    pose: "back",
    title: "Back stand · nude",
    note: "v1",
  },
  {
    id: "v1-side",
    src: "/images/body-ref/v1-side-nude.png",
    version: "v1",
    pose: "side",
    title: "Side stand · nude",
    note: "v1",
  },
  {
    id: "v1-34",
    src: "/images/body-ref/v1-34-nude.png",
    version: "v1",
    pose: "three-quarter",
    title: "3/4 stand · nude",
    note: "v1",
  },
  {
    id: "v1-sit",
    src: "/images/body-ref/v1-sit-nude.png",
    version: "v1",
    pose: "sit",
    title: "Sit · nude",
    note: "v1",
  },
  // v2
  {
    id: "v2-front",
    src: "/images/body-ref/v2-front-nude.png",
    version: "v2",
    pose: "front",
    title: "Front stand · nude",
    note: "v2 · 700 steps · weight 0.65",
  },
  {
    id: "v2-back",
    src: "/images/body-ref/v2-back-nude.png",
    version: "v2",
    pose: "back",
    title: "Back stand · nude",
    note: "v2",
  },
  {
    id: "v2-side",
    src: "/images/body-ref/v2-side-nude.png",
    version: "v2",
    pose: "side",
    title: "Side stand · nude",
    note: "v2",
  },
  {
    id: "v2-34",
    src: "/images/body-ref/v2-34-nude.png",
    version: "v2",
    pose: "three-quarter",
    title: "3/4 stand · nude",
    note: "v2",
  },
  {
    id: "v2-sit",
    src: "/images/body-ref/v2-sit-nude.png",
    version: "v2",
    pose: "sit",
    title: "Sit · nude",
    note: "v2",
  },
  // v3
  {
    id: "v3-front",
    src: "/images/body-ref/v3-front-nude.png",
    version: "v3",
    pose: "front",
    title: "Front stand · nude",
    note: "v3 · salon brows · 92-62-98",
  },
  {
    id: "v3-back",
    src: "/images/body-ref/v3-back-nude.png",
    version: "v3",
    pose: "back",
    title: "Back stand · nude",
    note: "v3",
  },
  {
    id: "v3-side",
    src: "/images/body-ref/v3-side-nude.png",
    version: "v3",
    pose: "side",
    title: "Side stand · nude",
    note: "v3",
  },
  {
    id: "v3-34",
    src: "/images/body-ref/v3-34-nude.png",
    version: "v3",
    pose: "three-quarter",
    title: "3/4 stand · nude",
    note: "v3",
  },
  {
    id: "v3-sit",
    src: "/images/body-ref/v3-sit-nude.png",
    version: "v3",
    pose: "sit",
    title: "Sit · nude",
    note: "v3",
  },
];

const VER_CHIP: Record<BodyVer, string> = {
  v1: "bg-muted/30 text-ink-soft ring-line",
  v2: "bg-accent-soft/50 text-ink ring-accent/30",
  v3: "bg-ink text-bg ring-ink",
};

const VER_BLURB: Record<BodyVer, string> = {
  v1: "First train · 8 images · 400 steps",
  v2: "Expanded set · 700 steps · lower weight + neg",
  v3: "Clean set · beauty captions · hourglass body",
};

/** Hero plates — gold-i2i preferred; old t2i kept as archive */
export type HeroPlate = {
  id: string;
  src: string;
  title: string;
  note?: string;
};

/** Flux Klein two-pass img2img FROM Grok golds (face lock) */
export const FLUX_GOLD_PLATES: HeroPlate[] = [
  {
    id: "flux-gold-stand-front",
    src: "/images/body-hero/flux-gold-stand-front.png",
    title: "Stand front · gold i2i",
    note: "Flux · from Grok face gold · 2-pass",
  },
  {
    id: "flux-gold-stand-34",
    src: "/images/body-hero/flux-gold-stand-34.png",
    title: "Stand 3/4 · gold i2i",
    note: "Flux · from Grok gold",
  },
  {
    id: "flux-gold-sit",
    src: "/images/body-hero/flux-gold-sit.png",
    title: "Sit · gold i2i",
    note: "Flux · from Grok gold",
  },
  {
    id: "flux-gold-on-back",
    src: "/images/body-hero/flux-gold-on-back.png",
    title: "On back · gold i2i",
    note: "Flux · from Grok gold",
  },
  {
    id: "flux-gold-from-behind",
    src: "/images/body-hero/flux-gold-from-behind.png",
    title: "From behind · gold i2i",
    note: "Flux · body gold seed",
  },
  {
    id: "flux-gold-kneel",
    src: "/images/body-hero/flux-gold-kneel.png",
    title: "Kneel · gold i2i",
    note: "Flux · from Grok gold",
  },
  {
    id: "flux-gold-side",
    src: "/images/body-hero/flux-gold-side.png",
    title: "Side profile · gold i2i",
    note: "Grok face → local body",
  },
  {
    id: "flux-gold-arms-up",
    src: "/images/body-hero/flux-gold-arms-up.png",
    title: "Arms up · gold i2i",
    note: "Grok face → local body",
  },
  {
    id: "flux-gold-lean-forward",
    src: "/images/body-hero/flux-gold-lean-forward.png",
    title: "Lean forward · gold i2i",
    note: "Grok face → local body",
  },
  {
    id: "flux-gold-all-fours",
    src: "/images/body-hero/flux-gold-all-fours.png",
    title: "All fours · gold i2i",
    note: "Grok face → local body",
  },
  {
    id: "flux-gold-beauty-bust",
    src: "/images/body-hero/flux-gold-beauty-bust.png",
    title: "Beauty bust · gold i2i",
    note: "Waist-up · face lock",
  },
  {
    id: "flux-gold-sit-chair",
    src: "/images/body-hero/flux-gold-sit-chair.png",
    title: "Sit chair · gold i2i",
    note: "Grok face → local body",
  },
];

/** LoRA secondary — same golds, side-by-side face compare */
export const LORA_GOLD_PLATES: HeroPlate[] = [
  {
    id: "lora-gold-stand-front",
    src: "/images/body-hero-lora/lora-gold-stand-front.png",
    title: "Stand front · LoRA gold",
    note: "prynshi-v3 i2i · same gold",
  },
  {
    id: "lora-gold-stand-34",
    src: "/images/body-hero-lora/lora-gold-stand-34.png",
    title: "Stand 3/4 · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-sit",
    src: "/images/body-hero-lora/lora-gold-sit.png",
    title: "Sit · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-on-back",
    src: "/images/body-hero-lora/lora-gold-on-back.png",
    title: "On back · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-from-behind",
    src: "/images/body-hero-lora/lora-gold-from-behind.png",
    title: "From behind · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-kneel",
    src: "/images/body-hero-lora/lora-gold-kneel.png",
    title: "Kneel · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-side",
    src: "/images/body-hero-lora/lora-gold-side.png",
    title: "Side · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-arms-up",
    src: "/images/body-hero-lora/lora-gold-arms-up.png",
    title: "Arms up · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-lean-forward",
    src: "/images/body-hero-lora/lora-gold-lean-forward.png",
    title: "Lean · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-all-fours",
    src: "/images/body-hero-lora/lora-gold-all-fours.png",
    title: "All fours · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-beauty-bust",
    src: "/images/body-hero-lora/lora-gold-beauty-bust.png",
    title: "Beauty bust · LoRA gold",
    note: "prynshi-v3 i2i",
  },
  {
    id: "lora-gold-sit-chair",
    src: "/images/body-hero-lora/lora-gold-sit-chair.png",
    title: "Sit chair · LoRA gold",
    note: "prynshi-v3 i2i",
  },
];

/** Old pure-t2i Flux (invented face) — archive only */
export const FLUX_HERO_PLATES: HeroPlate[] = [
  {
    id: "flux-stand-front",
    src: "/images/body-hero/flux-stand-front-seduce.png",
    title: "Stand front · t2i archive",
    note: "Pure t2i · no gold · face invent",
  },
  {
    id: "flux-stand-34",
    src: "/images/body-hero/flux-stand-34-seduce.png",
    title: "Stand 3/4 · t2i archive",
    note: "Pure t2i archive",
  },
  {
    id: "flux-sit-spread",
    src: "/images/body-hero/flux-sit-spread.png",
    title: "Sit · t2i archive",
    note: "Pure t2i archive",
  },
  {
    id: "flux-on-back",
    src: "/images/body-hero/flux-on-back.png",
    title: "On back · t2i archive",
    note: "Pure t2i archive",
  },
  {
    id: "flux-from-behind",
    src: "/images/body-hero/flux-from-behind.png",
    title: "From behind · t2i archive",
    note: "Pure t2i archive",
  },
  {
    id: "flux-kneel",
    src: "/images/body-hero/flux-kneel.png",
    title: "Kneel · t2i archive",
    note: "Pure t2i archive",
  },
];

export default function BodyRefGallery() {
  const [filter, setFilter] = useState<"all" | BodyVer | BodyPose>("all");
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<BodyRef | null>(null);
  const [heroActive, setHeroActive] = useState<HeroPlate | null>(null);
  const [heroMissing, setHeroMissing] = useState<Record<string, boolean>>({});

  const shots = useMemo(() => {
    return BODY_NUDE_PLATES.filter((s) => {
      if (missing[s.id]) return false;
      if (filter === "all") return true;
      if (filter === "v1" || filter === "v2" || filter === "v3")
        return s.version === filter;
      return s.pose === filter;
    });
  }, [filter, missing]);

  const goldFlux = useMemo(
    () => FLUX_GOLD_PLATES.filter((h) => !heroMissing[h.id]),
    [heroMissing],
  );
  const goldLora = useMemo(
    () => LORA_GOLD_PLATES.filter((h) => !heroMissing[h.id]),
    [heroMissing],
  );
  const heroesArchive = useMemo(
    () => FLUX_HERO_PLATES.filter((h) => !heroMissing[h.id]),
    [heroMissing],
  );

  const countVer = (v: BodyVer) =>
    BODY_NUDE_PLATES.filter((s) => s.version === v && !missing[s.id]).length;

  const renderHeroGrid = (
    list: HeroPlate[],
    chip: string,
    chipClass: string,
    ringClass: string,
  ) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={() => setHeroActive(h)}
          className={`group overflow-hidden rounded-sm bg-card text-left ring-1 ${ringClass} transition hover:opacity-95`}
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={h.src}
              alt={h.title}
              className="aspect-[3/4] w-full object-cover object-top"
              loading="lazy"
              onError={() => setHeroMissing((m) => ({ ...m, [h.id]: true }))}
            />
            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${chipClass}`}
            >
              {chip}
            </span>
          </div>
          <div className="border-t border-line px-2.5 py-2">
            <p className="font-[family-name:var(--font-playfair)] text-sm text-ink">
              {h.title}
            </p>
            {h.note ? <p className="text-[10px] text-muted">{h.note}</p> : null}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {goldFlux.length > 0 ? (
        <div className="mb-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Primary · Grok gold → Flux i2i
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-xl text-ink">
                Face from Grok pixels (two-pass img2img)
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                Starts from pinned Grok face/body golds — not text invent.
                Pass1 body · Pass2 face re-lock. 1088×1472.
              </p>
            </div>
            <span className="text-[11px] text-muted">{goldFlux.length} live</span>
          </div>
          {renderHeroGrid(
            goldFlux,
            "Gold·Flux",
            "bg-accent text-bg",
            "ring-accent/40 hover:ring-accent",
          )}
        </div>
      ) : null}

      {goldLora.length > 0 ? (
        <div className="mb-12">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Compare · same gold → LoRA i2i
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg text-ink">
              LoRA secondary (same seeds)
            </h3>
          </div>
          {renderHeroGrid(
            goldLora,
            "Gold·LoRA",
            "bg-ink text-bg",
            "ring-line hover:ring-ink/30",
          )}
        </div>
      ) : null}

      {heroesArchive.length > 0 ? (
        <div className="mb-12">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Archive · pure t2i (invented face)
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg text-ink">
              Old Flux t2i (why faces looked bad)
            </h3>
          </div>
          {renderHeroGrid(
            heroesArchive,
            "t2i",
            "bg-muted text-ink-soft",
            "ring-line",
          )}
        </div>
      ) : null}

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          LoRA history · v1 / v2 / v3
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {(["v1", "v2", "v3"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setFilter(v)}
            className={`rounded-sm border border-line bg-card p-4 text-left transition hover:ring-1 hover:ring-ink/15 ${
              filter === v ? "ring-1 ring-ink/25" : ""
            }`}
          >
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ${VER_CHIP[v]}`}
            >
              {v} body
            </span>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              {VER_BLURB[v]}
            </p>
            <p className="mt-2 text-[11px] text-muted">
              {countVer(v)} plates loaded
            </p>
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["front", "Front"],
            ["three-quarter", "3/4"],
            ["side", "Side"],
            ["back", "Back"],
            ["sit", "Sit"],
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
          Full-nude body plates for this filter are still generating locally
          (Draw Things). Refresh after v3 finishes — files go to{" "}
          <code className="text-xs">public/images/body-ref/</code>.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${VER_CHIP[s.version]}`}
                >
                  {s.version}
                </span>
              </div>
              <div className="border-t border-line px-2.5 py-2">
                <p className="font-[family-name:var(--font-playfair)] text-sm text-ink">
                  {s.title}
                </p>
                {s.note ? (
                  <p className="text-[10px] text-muted">{s.note}</p>
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
              <p className="text-xs text-muted">
                Photoreal full-nude body lock · clothing-fit reference · not a
                mesh mannequin
              </p>
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

      {heroActive ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          role="dialog"
          aria-modal
          onClick={() => setHeroActive(null)}
        >
          <figure
            className="relative max-h-[90vh] max-w-xl overflow-hidden rounded-sm bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroActive.src}
              alt={heroActive.title}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="border-t border-line px-4 py-3 text-sm">
              <p className="font-[family-name:var(--font-playfair)] text-ink">
                Flux · {heroActive.title}
              </p>
              <p className="text-xs text-muted">
                Flux Klein 4B · 1088×1472 · shipped as generated
              </p>
            </figcaption>
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-ink/70 px-3 py-1 text-xs text-bg"
              onClick={() => setHeroActive(null)}
            >
              Close
            </button>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
