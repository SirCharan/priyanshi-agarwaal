import { clips } from "@/lib/videos";

export default function VideoStrip() {
  if (clips.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-card px-6 py-16 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-2xl text-ink">
          Motion coming soon
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap gap-8">
      {clips.map((clip) => (
        <li key={clip.id} className="w-full max-w-[20rem]">
          <figure className="overflow-hidden rounded-sm bg-card ring-1 ring-line">
            <video
              className="block aspect-[9/16] h-auto w-full bg-ink object-cover"
              controls
              playsInline
              preload="metadata"
              poster={clip.poster}
              src={clip.src}
            />
            <figcaption className="border-t border-line px-4 py-3">
              <p className="font-[family-name:var(--font-playfair)] text-lg text-ink">
                {clip.title}
              </p>
              <p className="mt-0.5 text-xs tracking-wide text-muted">{clip.note}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
