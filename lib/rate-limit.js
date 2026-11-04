import 'server-only';

/**
 * Fixed-window rate limiter kept in process memory.
 *
 * Good enough to blunt card-testing bots hitting one server instance. On
 * serverless hosting each instance keeps its own counts, so pair this with the
 * velocity filters in the NMI dashboard (or move the store to Redis) for a
 * hard, global limit.
 */
const buckets = new Map();
const MAX_KEYS = 10000;

/**
 * Counts one hit against `key`. Returns { allowed, retryAfter } where
 * retryAfter is in seconds.
 */
export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) sweep(now);
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Reads the current state for `key` without counting a hit. */
export function isLimited(key, { limit }) {
  const bucket = buckets.get(key);
  return Boolean(bucket && bucket.resetAt > Date.now() && bucket.count >= limit);
}

function sweep(now) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Still full of live keys — drop the oldest rather than grow without bound.
  if (buckets.size >= MAX_KEYS) {
    const overflow = buckets.size - MAX_KEYS + 1;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++removed >= overflow) break;
    }
  }
}
