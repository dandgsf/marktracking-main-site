/**
 * MARKTRACKING — Rate Limiter
 * In-memory rate limiting for API endpoints
 * Production note: replace with Redis for multi-instance deployments
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // Max requests per window

/**
 * Check if a request from the given identifier should be rate limited.
 * Returns { allowed: true } if the request is allowed,
 * or { allowed: false, retryAfter: number } if rate limited.
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    store.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Clean up expired entries periodically (every 5 minutes)
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }
  }, 300_000);
}
