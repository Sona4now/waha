/**
 * Security utilities for auth endpoints.
 *
 * - `safeCompare`: constant-time string comparison to prevent timing attacks.
 *   Standard `===` on strings short-circuits on first differing byte,
 *   which leaks the length of the matching prefix over time.
 */

import { timingSafeEqual } from "crypto";

/**
 * Constant-time comparison of two strings.
 * Returns `false` immediately on length mismatch to avoid allocating
 * a padded buffer, but does NOT leak position info for same-length inputs.
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Still perform a compare against itself to keep this branch cheap
    // and avoid the shortcut being detectable by observers.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/**
 * Structured error response for auth endpoints.
 */
export function authError(
  message: string,
  status = 401,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}
