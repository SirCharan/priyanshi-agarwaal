import fs from "fs";
import path from "path";
import Link from "next/link";

export const dynamic = "force-static";

function listImages(dir: string, prefix = ""): string[] {
  const abs = path.join(process.cwd(), "public", "images", dir);
  if (!fs.existsSync(abs)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(abs)) {
    const full = path.join(abs, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (fs.statSync(full).isDirectory()) {
      out.push(...listImages(path.join(dir, name), rel));
    } else if (/\.(jpe?g|png|webp)$/i.test(name)) {
      out.push(`/images/${rel}`);
    }
  }
  return out.sort();
}

export default function ArchivePage() {
  const images = listImages(".");

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Permanent storage
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-ink sm:text-4xl">
            Image archive
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Every generated frame on this deploy — {images.length} files under{" "}
            <code className="text-xs">public/images/</code>. Safe on GitHub +
            Vercel.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          ← Gallery
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((src) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-sm bg-card ring-1 ring-line transition hover:ring-ink/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={src}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <p className="truncate px-2 py-1.5 text-[10px] text-muted">
              {src.replace("/images/", "")}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
