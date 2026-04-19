import { NextResponse } from "next/server";

/**
 * Tile proxy — bypasses CSP/CORS/network restrictions by serving map tiles
 * from our own origin. Leaflet requests /api/tiles/{style}/{z}/{x}/{y}
 * and we fetch the upstream tile server-side.
 *
 * Benefits:
 *  - No img-src CSP entries needed for external hosts
 *  - Works in sandboxed preview environments
 *  - Can swap tile providers without changing client code
 *  - Adds caching + rate-limit protection
 */

const UPSTREAM: Record<string, (z: string, x: string, y: string) => string> = {
  // CARTO Voyager — fast CDN, nice modern look
  streets: (z, x, y) =>
    `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`,
  // Esri World Imagery — high-res satellite
  satellite: (z, x, y) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  // OpenTopoMap — hill-shaded terrain
  terrain: (z, x, y) => `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`,
  // CARTO Dark Matter — for dark mode / evening feel
  dark: (z, x, y) =>
    `https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`,
};

// Sanitize path params so we only forward digits.
// At zoom 18 the max coordinate is 2^18 = 262144 → 6 digits. Allow up to 7.
const SAFE = /^\d{1,7}$/;
// Max zoom we proxy. Higher levels rarely work on OSM tile servers anyway.
const MAX_ZOOM = 19;

type TileParams = { style: string; z: string; x: string; y: string };

export async function GET(
  _request: Request,
  context: { params: Promise<TileParams> },
) {
  const { style, z, x, y } = await context.params;

  // Strip any extension (Leaflet appends `.png` sometimes via URL template)
  const cleanY = y.replace(/\.(png|jpe?g|webp)$/i, "");

  const resolver = UPSTREAM[style];
  if (!resolver || !SAFE.test(z) || !SAFE.test(x) || !SAFE.test(cleanY)) {
    return new NextResponse("Invalid tile request", { status: 400 });
  }
  // Cap zoom to prevent abuse / upstream rejections
  const zNum = Number(z);
  if (zNum < 0 || zNum > MAX_ZOOM) {
    return new NextResponse("Zoom out of range", { status: 400 });
  }

  const upstream = resolver(z, x, cleanY);

  try {
    const res = await fetch(upstream, {
      // 14-day edge cache: tiles rarely change
      next: { revalidate: 60 * 60 * 24 * 14 },
      headers: {
        // Some providers require a UA to serve tiles
        "User-Agent": "WahaEgMapProxy/1.0 (+https://wahaeg.com)",
        Accept: "image/png,image/webp,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream ${res.status}`, { status: res.status });
    }

    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/png";

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Long client + CDN cache — tiles are immutable at (z,x,y)
        "Cache-Control": "public, max-age=86400, s-maxage=1209600, immutable",
        "X-Tile-Source": style,
      },
    });
  } catch (err) {
    console.error("[tile-proxy]", err);
    return new NextResponse("Tile fetch failed", { status: 502 });
  }
}
