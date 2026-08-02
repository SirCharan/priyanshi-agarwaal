import Gallery from "@/components/Gallery";
import { fashionPhotos } from "@/lib/photos";

export default function Home() {
  const hasPhotos = fashionPhotos.length > 0;
  const hero = hasPhotos ? fashionPhotos[0] : null;

  return (
    <main className="relative flex-1">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          href="/"
          className="font-[family-name:var(--font-playfair)] text-xl tracking-tight text-ink"
        >
          Priyanshi Agarwaal
        </a>
        <nav className="flex items-center gap-6 text-sm text-ink-soft">
          <a href="#gallery" className="transition hover:text-ink">
            Gallery
          </a>
          <a href="#architecture" className="transition hover:text-ink">
            Architecture
          </a>
          <a href="/archive" className="transition hover:text-ink">
            Archive
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-8">
        <div className={`fade-up ${hero ? "lg:col-span-5" : "lg:col-span-8"}`}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Portrait gallery
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.95] tracking-tight text-ink">
            Priyanshi
            <span className="mt-2 block font-normal italic text-ink-soft">
              Agarwaal
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Fashion frames across angles, light, and outfits — face and body
            locked for consistency. Architecture sheets below for later
            reproduction.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#gallery"
              className="inline-flex cursor-pointer items-center rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-bg transition hover:bg-accent"
            >
              Browse the set
            </a>
            <p className="text-sm text-muted">
              {fashionPhotos.length} fashion frames
            </p>
          </div>
        </div>

        {hero ? (
          <div className="fade-up fade-up-delay-2 relative lg:col-span-7">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_65%)]" />
            <figure className="relative overflow-hidden rounded-sm bg-card shadow-[0_30px_80px_-40px_rgba(26,22,20,0.55)] ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.src}
                alt={hero.title}
                className="h-auto w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-16 text-white">
                <div>
                  <p className="font-[family-name:var(--font-playfair)] text-xl">
                    {hero.title}
                  </p>
                  {hero.place ? (
                    <p className="text-xs tracking-wide text-white/70">
                      {hero.place}
                    </p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          </div>
        ) : null}
      </section>

      <section
        id="gallery"
        className="border-t border-line/80 bg-bg-deep/40 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Collection
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Fashion gallery
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Varied poses, outfits, and lighting with locked face and body
              identity.
            </p>
          </div>
          <Gallery mode="fashion" />
        </div>
      </section>

      <section id="architecture" className="border-t border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Reproducible
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Face &amp; body architecture
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Turnaround sheets for face angles, body, expressions, and lighting.
              Written bible with prompt locks lives in{" "}
              <code className="rounded bg-bg-deep px-1.5 py-0.5 text-xs text-ink">
                docs/CHARACTER.md
              </code>
              .
            </p>
          </div>
          <Gallery mode="architecture" />
        </div>
      </section>

      <footer className="mt-auto border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-[family-name:var(--font-playfair)] text-ink">
            Priyanshi Agarwaal
          </p>
          <p>Portrait gallery · identity-locked set</p>
        </div>
      </footer>
    </main>
  );
}
