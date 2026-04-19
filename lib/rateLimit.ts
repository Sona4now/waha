/**
 * Simple in-memory rate limiter for API routes.
 * For production scale, replace with Vercel KV / Upstash Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof global !== "undefined") {
  const g = global as unknown as { __waahaRateCleanup?: NodeJS.Timeout };
  if (!g.__waahaRateCleanup) {
    g.__waahaRateCleanup = setInterval(
      () => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
          if (entry.resetAt < now) store.delete(key);
        }
      },
      5 * 60 * 1000
    );
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfter?: number;
}

interface Options {
  /** Max requests per window */
  limit: number;
  /** Window in milliseconds */
  windowMs: number;
}

/**
 * Check and increment the rate limit for a given identifier.
 * Returns `success: false` if the limit has been exceeded.
 */
export function rateLimit(
  identifier: string,
  options: Options
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  // No entry or window expired -> start fresh
  if (!entry || entry.resetAt < now) {
    const resetAt = now + options.windowMs;
    store.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      remaining: options.limit - 1,
      limit: options.limit,
      resetAt,
    };
  }

  // Within window and under limit
  if (entry.count < options.limit) {
    entry.count += 1;
    return {
      success: true,
      remaining: options.limit - entry.count,
      limit: options.limit,
      resetAt: entry.resetAt,
    };
  }

  // Limit exceeded
  return {
    success: false,
    remaining: 0,
    limit: options.limit,
    resetAt: entry.resetAt,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/**
 * Get the client identifier from request headers.
 * Prefers Vercel's forwarded IP. Falls back to a hash of the
 * user-agent + accept-language so different anonymous clients don't
 * share a single rate-limit bucket.
 */
export function getClientId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return `ip:${forwarded.split(",")[0].trim()}`;
  const real = req.headers.get("x-real-ip");
  if (real) return `ip:${real}`;

  // Degraded mode: derive a weak fingerprint from UA + Accept-Language.
  // Not cryptographic — just enough to stop all anonymous traffic from
  // colliding in one bucket when the IP header is missing.
  const ua = req.headers.get("user-agent") || "";
  const lang = req.headers.get("accept-language") || "";
  let hash = 0;
  const src = `${ua}|${lang}`;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) | 0;
  }
  return `fp:${Math.abs(hash).toString(36)}`;
}
