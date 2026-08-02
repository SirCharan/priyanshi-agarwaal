import Gallery from "@/components/Gallery";
import { photos } from "@/lib/photos";

export default function Home() {
  const hasPhotos = photos.length > 0;
  const hero = hasPhotos ? photos[0] : null;

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
            {hasPhotos
              ? "A curated portrait collection."
              : "Gallery shell is live. Photos will land here next."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#gallery"
              className="inline-flex cursor-pointer items-center rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-bg transition hover:bg-accent"
            >
              {hasPhotos ? "Browse the set" : "View gallery"}
            </a>
            <p className="text-sm text-muted">
              {hasPhotos
                ? `${photos.length} photograph${photos.length === 1 ? "" : "s"}`
                : "Awaiting images"}
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
        ) : (
          <div className="fade-up fade-up-delay-2 lg:col-span-4">
            <div className="flex aspect-[3/4] items-center justify-center rounded-sm border border-dashed border-line bg-card text-center">
              <div className="px-6">
                <p className="font-[family-name:var(--font-playfair)] text-xl text-ink">
                  No frames yet
                </p>
                <p className="mt-2 text-sm text-muted">Images drop in next</p>
              </div>
            </div>
          </div>
        )}
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
              The gallery
            </h2>
          </div>
          <Gallery />
        </div>
      </section>

      <footer className="mt-auto border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-[family-name:var(--font-playfair)] text-ink">
            Priyanshi Agarwaal
          </p>
          <p>Portrait gallery</p>
        </div>
      </footer>
    </main>
  );
}
