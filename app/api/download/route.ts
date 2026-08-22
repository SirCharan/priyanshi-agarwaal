import { readFile } from "fs/promises";
import path from "path";
import { sundressPhotos } from "@/lib/photos";

export const runtime = "nodejs";

function fileName(title: string) {
  const slug = title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `Priyanshi-Agarwaal-${slug}-FHD.jpg`;
}

async function loadOriginal(rel: string, request: Request): Promise<Buffer> {
  const file = path.join(process.cwd(), "public", rel);
  try {
    return await readFile(file);
  } catch {
    const origin = new URL(request.url).origin;
    const res = await fetch(`${origin}/${rel}`);
    if (!res.ok) {
      throw new Error(`missing ${rel}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
}

async function toFullHd(input: Buffer): Promise<Buffer> {
  try {
    const sharp = (await import("sharp")).default;
    return await sharp(input)
      .resize({ height: 1920, withoutEnlargement: false })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();
  } catch {
    return input;
  }
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const photo = sundressPhotos.find((p) => p.id === id);
  if (!photo) {
    return new Response("Not found", { status: 404 });
  }

  const rel = photo.src.replace(/^\//, "");
  if (rel.includes("..") || !rel.startsWith("images/")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const original = await loadOriginal(rel, request);
    const out = await toFullHd(original);
    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${fileName(photo.title)}"`,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
