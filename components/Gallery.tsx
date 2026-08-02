"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  architecture,
  fashionPhotos,
  workoutPhotos,
  type Photo,
} from "@/lib/photos";

type FilterId = "all" | "fashion" | "architecture" | "workout";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion" },
  { id: "workout", label: "Workout" },
  { id: "architecture", label: "Architecture" },
];

export default function Gallery({
  mode = "fashion",
}: {
  mode?: "fashion" | "architecture" | "workout" | "all";
}) {
  const baseList = useMemo(() => {
    if (mode === "architecture") return architecture;
    if (mode === "workout") return workoutPhotos;
    if (mode === "all")
      return [...fashionPhotos, ...workoutPhotos, ...architecture];
    return fashionPhotos;
  }, [mode]);

  const showFilters = mode === "all";
  const [filter, setFilter] = useState<FilterId>("all");
  const [active, setActive] = useState<Photo | null>(null);

  const list = useMemo(() => {
    if (!showFilters || filter === "all") return baseList;
    return baseList.filter((p) => p.tag === filter);
  }, [baseList, filter, showFilters]);

  const open = useCallback((photo: Photo) => setActive(photo), []);
  const close = useCallback(() => setActive(null), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!active || list.length === 0) return;
      const i = list.findIndex((p) => p.id === active.id);
      if (i < 0) return;
      setActive(list[(i + dir + list.length) % list.length]);
    },
    [active, list],
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  if (list.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-card px-6 py-20 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-2xl text-ink">
          Gallery coming soon
        </p>
      </div>
    );
  }

  return (
    <>
      {showFilters ? (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm tracking-wide transition-colors duration-200 ${
                  on
                    ? "border-ink bg-ink text-bg"
                    : "border-line bg-card text-ink-soft hover:border-ink/40"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto text-sm text-muted tabular-nums">
            {list.length} frames
          </span>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-end">
          <span className="text-sm text-muted tabular-nums">
            {list.length} frame{list.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      <div className="masonry">
        {list.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => open(photo)}
            className="masonry-item group relative w-full cursor-pointer overflow-hidden rounded-sm bg-card text-left shadow-[0_1px_0_rgba(26,22,20,0.04)] ring-1 ring-line/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(26,22,20,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            style={{
              animation: "fade-up 0.55s ease both",
              animationDelay: `${Math.min(i, 10) * 40}ms`,
            }}
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.title}
                width={photo.tag === "architecture" ? 1280 : 900}
                height={photo.tag === "architecture" ? 720 : 1200}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-[family-name:var(--font-playfair)] text-lg text-white">
                  {photo.title}
                </p>
                {photo.place ? (
                  <p className="text-xs tracking-wide text-white/75">
                    {photo.place}
                  </p>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink/88 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-50 cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Close
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-2 top-1/2 z-50 hidden -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white transition hover:bg-white/20 sm:block"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-2 top-1/2 z-50 hidden -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white transition hover:bg-white/20 sm:block"
          >
            →
          </button>

          <figure
            className="relative max-h-[90vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto max-h-[78vh] overflow-hidden rounded-sm bg-black/40">
              <Image
                src={active.src}
                alt={active.title}
                width={active.tag === "architecture" ? 1600 : 1200}
                height={active.tag === "architecture" ? 900 : 1600}
                priority
                className="mx-auto max-h-[78vh] w-auto object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-white">
              <p className="font-[family-name:var(--font-playfair)] text-2xl">
                {active.title}
              </p>
              {active.place ? (
                <p className="mt-1 text-sm tracking-wide text-white/65">
                  {active.place}
                </p>
              ) : null}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
