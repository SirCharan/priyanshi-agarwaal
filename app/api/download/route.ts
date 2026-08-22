import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { sundressPhotos } from "@/lib/photos";

export const runtime = "nodejs";

function fileName(title: string) {
  const slug = title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `Priyanshi-Agarwaal-${slug}-FHD.jpg`;
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const photo = sundressPhotos.find((p) => p.id === id);
  if (!photo) {
    return new Response("Not found", { status: 404 });
  }

  const rel = photo.src.replace(/^\//, "");
  if (rel.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "public", rel);
  const input = await readFile(file);
  const out = await sharp(input)
    .resize({ height: 1920, withoutEnlargement: false })
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(out), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": `attachment; filename="${fileName(photo.title)}"`,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
