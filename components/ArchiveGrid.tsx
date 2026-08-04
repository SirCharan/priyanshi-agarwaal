import fs from "fs";
import path from "path";

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

export default function ArchiveGrid() {
  const images = listImages(".");

  return (
    <div>
      <p className="mb-6 text-sm text-ink-soft">
        {images.length} files under <code className="text-xs">public/images/</code>{" "}
        — permanent on this deploy.
      </p>
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
    </div>
  );
}
