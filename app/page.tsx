import ArchiveGrid from "@/components/ArchiveGrid";
import BodyRefGallery from "@/components/BodyRefGallery";
import Gallery from "@/components/Gallery";
import VideoStrip from "@/components/VideoStrip";
import { fashionPhotos } from "@/lib/photos";
import { clips } from "@/lib/videos";

export default function Home() {
  const hasPhotos = fashionPhotos.length > 0;
  const hero = hasPhotos ? fashionPhotos[0] : null;

  return (
    <main className="relative flex-1">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          href="#top"
          className="font-[family-name:var(--font-playfair)] text-xl tracking-tight text-ink"
        >
          Priyanshi Agarwaal
        </a>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-ink-soft sm:gap-x-5">
          <a href="#gallery" className="transition hover:text-ink">
            Gallery
          </a>
          <a href="#workout" className="transition hover:text-ink">
            Workout
          </a>
          <a href="#architecture" className="transition hover:text-ink">
            Architecture
          </a>
          <a href="#body" className="transition hover:text-ink">
            Nude body
          </a>
          <a href="#video" className="transition hover:text-ink">
            Video
          </a>
          <a href="#archive" className="transition hover:text-ink">
            Archive
          </a>
        </nav>
      </header>

      <section
        id="top"
        className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-8"
      >
        <div className={`fade-up ${hero ? "lg:col-span-5" : "lg:col-span-8"}`}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Portrait gallery · single page
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.95] tracking-tight text-ink">
            Priyanshi
            <span className="mt-2 block font-normal italic text-ink-soft">
              Agarwaal
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Fashion, workout, architecture sheets, photoreal nude body-reference
            plates (her identity, no fake mesh mannequin), motion clips, and
            full image archive. Face and body locked at 165&nbsp;cm ·
            86-64-90.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#gallery"
              className="inline-flex cursor-pointer items-center rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-bg transition hover:bg-accent"
            >
              Browse the set
            </a>
            <a
              href="#body"
              className="inline-flex cursor-pointer items-center rounded-full border border-line px-6 py-3 text-sm tracking-wide text-ink transition hover:border-ink/30"
            >
              Body reference
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

      <section
        id="workout"
        className="border-t border-line/80 bg-bg-deep/40 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Fitness
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Workout
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Identity-locked training frames — same face and body, modest
              athletic wear.
            </p>
          </div>
          <Gallery mode="workout" />
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
              Written bible in{" "}
              <code className="rounded bg-bg-deep px-1.5 py-0.5 text-xs text-ink">
                docs/CHARACTER.md
              </code>
              .
            </p>
          </div>
          <Gallery mode="architecture" />
        </div>
      </section>

      <section
        id="body"
        className="border-t border-line/80 bg-bg-deep/40 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Character lock · full nude body
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Full nude body · gold i2i
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Heroes start from <strong>Grok face pixels</strong> (img2img
              two-pass), not text invent. Not a 3D mesh.
            </p>
          </div>
          <BodyRefGallery />
        </div>
      </section>

      <section
        id="video"
        className="border-t border-line py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Still to motion
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Video
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Image-to-video from gold stills. Pose is already in the frame;
              the model only adds motion. {clips.length} clip
              {clips.length === 1 ? "" : "s"} so far.
            </p>
          </div>
          <VideoStrip />
        </div>
      </section>

      <section id="archive" className="border-t border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Permanent storage
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-ink sm:text-4xl">
              Image archive
            </h2>
          </div>
          <ArchiveGrid />
        </div>
      </section>

      <footer className="mt-auto border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-[family-name:var(--font-playfair)] text-ink">
            Priyanshi Agarwaal
          </p>
          <p>Single-page gallery · identity-locked set · body · video</p>
        </div>
      </footer>
    </main>
  );
}
