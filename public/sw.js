// Waaha service worker — v2
// Strategy:
//   - HTML pages: network-first with cache fallback (so users always get
//     fresh content when online, but the last-seen version when offline)
//   - Static assets (images, fonts, _next/static/*): cache-first with
//     network fallback (long-lived, immutable, fast)
//   - API routes (/api/*) and auth-related URLs: never cache (avoids
//     stale auth state and accidentally caching personal data)

const CACHE_VERSION = "waaha-v2";
const RUNTIME_CACHE = "waaha-runtime";

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/icon.png",
];

const NEVER_CACHE_PATHS = ["/api/", "/admin", "/team-auth", "/admin-auth"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) =>
        // addAll fails atomically — if one URL is bad, none are added.
        // We use Promise.allSettled-style handling instead so a flaky
        // CDN doesn't break install.
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch(() => {
              /* one failed precache won't block install */
            }),
          ),
        ),
      ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // GET only — POST / PUT / DELETE always hit the network.
  if (req.method !== "GET") return;

  // Skip cross-origin (let the browser handle external requests directly).
  if (url.origin !== self.location.origin) return;

  // Skip auth + API.
  if (NEVER_CACHE_PATHS.some((p) => url.pathname.startsWith(p))) return;

  // Static assets → cache-first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|woff2?|css|js|ico)$/i)
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // HTML / everything else → network-first.
  event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch {
    // No cache + offline = the browser shows its default error
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    if (fresh.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    // Last resort: return the cached homepage as a generic fallback.
    return (
      (await caches.match("/")) ||
      new Response("Offline", { status: 503 })
    );
  }
}
