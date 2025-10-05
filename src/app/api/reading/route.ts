import { parseParams } from "@/lib/params";
import { getTheme } from "@/lib/themes";
import { fetchImageDataUri } from "@/lib/fetcher";
import { buildReadingCardSVG } from "@/lib/svg-builder";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const p = parseParams(searchParams);

  const theme = getTheme(p.theme);
  const cover = p.img ? await fetchImageDataUri(p.img) : null;
  const svg = buildReadingCardSVG({
    theme,
    title: p.title,
    author: p.author,
    coverDataUri: cover && cover.ok ? cover.dataUri : null,
    progress: p.progress,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
