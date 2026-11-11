// Module loader & contract verifier for src/data/couponLifecycle.js
import { ANNUAL_EVENTS_SCHEDULE } from '../../src/data/eventsCalendar.js';

let cachedModule = null;

export async function getCouponLifecycle() {
  if (cachedModule) return cachedModule;
  try {
    const mod = await import('../../src/data/couponLifecycle.js');
    cachedModule = mod;
    return mod;
  } catch {
    return null;
  }
}

// Reference Program / Specification Oracle for Expected Expiration Behavior
// Derived strictly from PROJECT.md, SCOPE.md, and ANNUAL_EVENTS_SCHEDULE
export function referenceResolveExpiration(coupon, referenceDate = new Date()) {
  const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const nowMs = ref.getTime();

  // Tier 1: Explicit ISO-8601 expiresAt
  if (coupon.expiresAt) {
    const expDate = new Date(coupon.expiresAt);
    if (!isNaN(expDate.getTime())) {
      const expMs = expDate.getTime();
      const isExpired = nowMs >= expMs;
      return {
        expiresAt: expDate.toISOString(),
        isExpired,
        timeRemainingMs: Math.max(0, expMs - nowMs),
        reason: 'EXPLICIT_EXPIRY'
      };
    }
  }

  // Tier 2: Commercial Event Window mapping
  const eventId = coupon.eventWindowId || (coupon.isEvent1111 ? '11-11-singles-day' : null);
  if (eventId) {
    const ev = ANNUAL_EVENTS_SCHEDULE.find((e) => e.id === eventId);
    if (ev) {
      const year = ref.getFullYear();
      const monthIdx = ref.getMonth();
      const endDate = ev.getEndDate(year, monthIdx);
      const endMs = endDate.getTime();
      return {
        expiresAt: endDate.toISOString(),
        isExpired: nowMs >= endMs,
        timeRemainingMs: Math.max(0, endMs - nowMs),
        reason: `EVENT_WINDOW_${ev.id}`
      };
    }
  }

  // Tier 3: Default TTL (14 days from discoveredAt / createdAt, or referenceDate)
  const baseTime = coupon.discoveredAt || coupon.createdAt || coupon.publishedAt;
  const startDate = baseTime ? new Date(baseTime) : ref;
  const ttlDays = coupon.ttlDays || 14;
  const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
  const expDate = new Date(startDate.getTime() + ttlMs);
  const expMs = expDate.getTime();

  return {
    expiresAt: expDate.toISOString(),
    isExpired: nowMs >= expMs,
    timeRemainingMs: Math.max(0, expMs - nowMs),
    reason: 'DEFAULT_TTL_14D'
  };
}
