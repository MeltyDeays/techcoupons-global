// Centralized Coupon Lifecycle, Expiration Policy & Storage Purge Engine
import { ANNUAL_EVENTS_SCHEDULE } from './eventsCalendar.js';

export const DEFAULT_DISCOVERED_TTL_DAYS = 14;
export const STORAGE_KEY_CUSTOM_COUPONS = 'ecosistema_b_custom_coupons_v1';
export const STORAGE_KEY_TOMBSTONES = 'ecosistema_b_coupon_tombstones_v1';
export const STORAGE_KEY_SYNC = 'cuponestech_ai_radar_sync_v1';

// In-memory fallback set for non-browser/SSR runtimes without mock storage
const MEMORY_TOMBSTONES = new Set();

/**
 * Resolves deterministic coupon expiration based on 3-tier policy:
 * Tier 0: Evergreen coupons never expire.
 * Tier 1: Explicit ISO-8601 expiresAt.
 * Tier 2: Commercial Event Window mapping via ANNUAL_EVENTS_SCHEDULE.
 * Tier 3: Default TTL policy (14 days from discoveredAt / createdAt / publishedAt).
 */
export function resolveCouponExpiration(coupon, referenceDate = new Date()) {
  const ref = (referenceDate instanceof Date && !isNaN(referenceDate.getTime()))
    ? referenceDate
    : (() => {
        const d = new Date(referenceDate);
        return !isNaN(d.getTime()) ? d : new Date();
      })();
  const nowMs = ref.getTime();

  if (!coupon || typeof coupon !== 'object' || Array.isArray(coupon)) {
    return {
      expiresAt: new Date(0).toISOString(),
      isExpired: true,
      timeRemainingMs: 0,
      reason: 'INVALID_COUPON'
    };
  }

  // Tier 0: Evergreen permanent coupons or infinite TTL
  if (coupon.isEvergreen === true || coupon.ttlDays === Infinity) {
    return {
      expiresAt: '9999-12-31T23:59:59.999Z',
      isExpired: false,
      timeRemainingMs: Infinity,
      reason: 'EVERGREEN_COUPON'
    };
  }

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
  const eventId = coupon.eventWindowId || coupon.eventId || (coupon.isEvent1111 ? '11-11-singles-day' : null);
  if (eventId) {
    const ev = ANNUAL_EVENTS_SCHEDULE.find((e) => e.id === eventId);
    if (ev) {
      const year = ref.getUTCFullYear();
      const monthIdx = ref.getUTCMonth();
      const rawEnd = ev.getEndDate(year, monthIdx);
      // Construct exact UTC end timestamp at 23:59:59.000Z
      const expDate = new Date(Date.UTC(rawEnd.getFullYear(), rawEnd.getMonth(), rawEnd.getDate(), 23, 59, 59, 0));
      const expMs = expDate.getTime();
      const isExpired = nowMs >= expMs;
      return {
        expiresAt: expDate.toISOString(),
        isExpired,
        timeRemainingMs: Math.max(0, expMs - nowMs),
        reason: `EVENT_WINDOW_${ev.id}`
      };
    }
  }

  // Tier 3: Default TTL policy (14 days from discoveredAt / createdAt, or referenceDate)
  const baseTime = coupon.discoveredAt || coupon.createdAt || coupon.publishedAt;
  let startDate = ref;
  if (baseTime) {
    const parsed = new Date(baseTime);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    }
  }

  let ttlDays = DEFAULT_DISCOVERED_TTL_DAYS;
  if (typeof coupon.ttlDays === 'number' && Number.isFinite(coupon.ttlDays)) {
    if (coupon.ttlDays >= 0) {
      ttlDays = coupon.ttlDays;
    }
  }
  const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
  const expDate = new Date(startDate.getTime() + ttlMs);
  const expMs = expDate.getTime();
  const isExpired = nowMs >= expMs;

  return {
    expiresAt: expDate.toISOString(),
    isExpired,
    timeRemainingMs: Math.max(0, expMs - nowMs),
    reason: `DEFAULT_TTL_${ttlDays}D`
  };
}

/**
 * Filters an array of coupons, discarding expired items and tombstoned items.
 */
export function purgeExpiredCoupons(couponsArray, referenceDate = new Date()) {
  if (!Array.isArray(couponsArray) || !couponsArray.length) {
    return {
      activeCoupons: [],
      purgedCount: 0,
      purgedIds: []
    };
  }

  const activeCoupons = [];
  const purgedIds = [];

  for (const c of couponsArray) {
    if (!c || typeof c !== 'object' || Array.isArray(c)) {
      purgedIds.push(c ? String(c) : 'null');
      continue;
    }

    if (isCouponTombstoned(c)) {
      purgedIds.push(c.id || c.code || 'tombstoned');
      continue;
    }

    const { isExpired } = resolveCouponExpiration(c, referenceDate);
    if (isExpired) {
      purgedIds.push(c.id || c.code || 'unknown');
    } else {
      activeCoupons.push(c);
    }
  }

  return {
    activeCoupons,
    purgedCount: purgedIds.length,
    purgedIds
  };
}

/**
 * Reads custom coupons from localStorage, purges expired items,
 * and updates storage with active coupons only.
 */
export function syncAndPurgeStorage(referenceDate = new Date()) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { activeCoupons: [], purgedCount: 0 };
  }

  try {
    if (referenceDate) {
      try {
        const d = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
        if (!isNaN(d.getTime())) {
          window.localStorage.setItem('ecosistema_b_last_ref_date_v1', d.toISOString());
        }
      } catch {}
    }

    const raw = window.localStorage.getItem(STORAGE_KEY_CUSTOM_COUPONS);
    if (!raw) return { activeCoupons: [], purgedCount: 0 };

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { activeCoupons: [], purgedCount: 0 };
    }

    if (!Array.isArray(parsed)) {
      return { activeCoupons: [], purgedCount: 0 };
    }

    const { activeCoupons, purgedCount } = purgeExpiredCoupons(parsed, referenceDate);

    if (purgedCount > 0) {
      try {
        window.localStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(activeCoupons));
      } catch {}
    }

    return { activeCoupons, purgedCount };
  } catch {
    return { activeCoupons: [], purgedCount: 0 };
  }
}

/**
 * Checks if a coupon code, backupCode, id, or tierKey is tombstoned.
 */
export function isCouponTombstoned(couponIdOrCode) {
  if (!couponIdOrCode) return false;

  const targets = [];
  if (typeof couponIdOrCode === 'object') {
    if (couponIdOrCode.code) targets.push(String(couponIdOrCode.code).toLowerCase().trim());
    if (couponIdOrCode.backupCode) targets.push(String(couponIdOrCode.backupCode).toLowerCase().trim());
    if (couponIdOrCode.id) targets.push(String(couponIdOrCode.id).toLowerCase().trim());
    if (couponIdOrCode.tierKey) targets.push(String(couponIdOrCode.tierKey).toLowerCase().trim());
  } else {
    targets.push(String(couponIdOrCode).toLowerCase().trim());
  }

  // 1. Check in-memory fallback
  for (const t of targets) {
    if (t && MEMORY_TOMBSTONES.has(t)) return true;
  }

  // 2. Check localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_TOMBSTONES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const tombSet = new Set(parsed.map((item) => String(item).toLowerCase().trim()));
          for (const t of targets) {
            if (t && tombSet.has(t)) return true;
          }
        }
      }
    } catch {}
  }

  return false;
}

/**
 * Appends a coupon code, id, or tierKey to the tombstone ledger.
 */
export function addCouponTombstone(couponIdOrCode) {
  if (!couponIdOrCode) return;

  const items = Array.isArray(couponIdOrCode) ? couponIdOrCode : [couponIdOrCode];
  const toAdd = [];

  for (const item of items) {
    if (!item) continue;
    if (typeof item === 'object') {
      if (item.code) toAdd.push(String(item.code).trim());
      if (item.backupCode) toAdd.push(String(item.backupCode).trim());
      if (item.id) toAdd.push(String(item.id).trim());
      if (item.tierKey) toAdd.push(String(item.tierKey).trim());
    } else {
      const s = String(item).trim();
      if (s && s !== '[object Object]') {
        toAdd.push(s);
      }
    }
  }

  const cleaned = toAdd.filter((s) => s && s !== '[object Object]');
  if (!cleaned.length) return;

  // Record in memory
  for (const item of cleaned) {
    MEMORY_TOMBSTONES.add(item.toLowerCase());
  }

  // Record in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      let current = [];
      const raw = window.localStorage.getItem(STORAGE_KEY_TOMBSTONES);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) current = parsed;
        } catch {}
      }

      const existingNorm = new Set(current.map((item) => String(item).toLowerCase().trim()));
      let changed = false;

      for (const item of cleaned) {
        const norm = item.toLowerCase().trim();
        if (norm && !existingNorm.has(norm)) {
          current.push(item);
          existingNorm.add(norm);
          changed = true;
        }
      }

      if (changed) {
        window.localStorage.setItem(STORAGE_KEY_TOMBSTONES, JSON.stringify(current));
      }
    } catch {}
  }
}
