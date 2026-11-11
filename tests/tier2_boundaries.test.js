import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import { installMockFetch } from './helpers/mockFetch.js';
import { getCouponLifecycle, referenceResolveExpiration } from './helpers/lifecycleLoader.js';
import radarHandler from '../api/ai-radar.js';
import { getLocaleConfig, DEFAULT_LOCALE } from '../src/config/locales.js';
import { autoPublishAiCoupons, getCouponsForLocale } from '../src/data/couponsGenerator.js';

describe('Tier 2: Boundary & Corner Cases', () => {
  let mockStorage;
  let restoreFetch;

  beforeEach(() => {
    mockStorage = installMockStorage();
    restoreFetch = installMockFetch();
  });

  // --------------------------------------------------------------------------
  // B1-B8: Date & Millisecond Boundaries
  // --------------------------------------------------------------------------
  describe('Date & Timestamp Boundaries', () => {
    it('B1: Malformed date string (garbage text "not-a-date") triggers fallback TTL or safe rejection', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'bad-date-01',
        code: 'BADDATE',
        expiresAt: 'NOT_A_REAL_DATE_VALUE',
        discoveredAt: '2026-06-01T00:00:00.000Z'
      };
      const ref = new Date('2026-06-05T00:00:00.000Z');
      const res = lifecycle.resolveCouponExpiration(coupon, ref);
      assert.ok(res.expiresAt);
      assert.ok(!isNaN(new Date(res.expiresAt).getTime()), 'Resolved expiresAt must be a valid ISO date');
    });

    it('B2: Null/undefined expiresAt field falls back safely to deterministic TTL', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'null-date-01',
        code: 'NULLDATE',
        expiresAt: null,
        discoveredAt: '2026-03-01T00:00:00.000Z'
      };
      const ref = new Date('2026-03-10T00:00:00.000Z');
      const res = lifecycle.resolveCouponExpiration(coupon, ref);
      assert.equal(res.isExpired, false);
      assert.ok(res.expiresAt);
    });

    it('B3: Epoch timestamp 0 ("1970-01-01T00:00:00.000Z") is deterministically identified as expired', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'epoch-0',
        code: 'EPOCHZERO',
        expiresAt: '1970-01-01T00:00:00.000Z'
      };
      const res = lifecycle.resolveCouponExpiration(coupon, new Date('2026-01-01T00:00:00.000Z'));
      assert.equal(res.isExpired, true);
      assert.equal(res.timeRemainingMs, 0);
    });

    it('B4: Distant future date ("9999-12-31T23:59:59.999Z") is deterministically active and does not overflow', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'future-9999',
        code: 'FOREVER',
        expiresAt: '9999-12-31T23:59:59.999Z'
      };
      const res = lifecycle.resolveCouponExpiration(coupon, new Date('2026-01-01T00:00:00.000Z'));
      assert.equal(res.isExpired, false);
      assert.ok(res.timeRemainingMs > 1000000000);
    });

    it('B5: Negative epoch date ("1969-12-31T23:59:59.999Z") is deterministically marked as expired', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'pre-epoch',
        code: 'PREEPOCH',
        expiresAt: '1969-12-31T23:59:59.999Z'
      };
      const res = lifecycle.resolveCouponExpiration(coupon, new Date('2026-01-01T00:00:00.000Z'));
      assert.equal(res.isExpired, true);
    });

    it('B6: Exact millisecond boundary: referenceDate === expiresAt resolves to isExpired: true', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const expIso = '2026-11-18T23:59:59.000Z';
      const coupon = { id: 'exact-ms', code: 'EXACTMS', expiresAt: expIso };
      const refExact = new Date(expIso);

      const res = lifecycle.resolveCouponExpiration(coupon, refExact);
      assert.equal(res.isExpired, true, 'At exact expiration millisecond, coupon must be expired');
      assert.equal(res.timeRemainingMs, 0);
    });

    it('B7: 1ms before expiration: referenceDate === expiresAt - 1ms resolves to isExpired: false and timeRemainingMs === 1', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const expMs = new Date('2026-11-18T23:59:59.000Z').getTime();
      const coupon = { id: 'just-before', code: 'JUSTBEFORE', expiresAt: new Date(expMs).toISOString() };
      const refBefore = new Date(expMs - 1);

      const res = lifecycle.resolveCouponExpiration(coupon, refBefore);
      assert.equal(res.isExpired, false);
      assert.equal(res.timeRemainingMs, 1);
    });

    it('B8: 1ms after expiration: referenceDate === expiresAt + 1ms resolves to isExpired: true and timeRemainingMs === 0', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const expMs = new Date('2026-11-18T23:59:59.000Z').getTime();
      const coupon = { id: 'just-after', code: 'JUSTAFTER', expiresAt: new Date(expMs).toISOString() };
      const refAfter = new Date(expMs + 1);

      const res = lifecycle.resolveCouponExpiration(coupon, refAfter);
      assert.equal(res.isExpired, true);
      assert.equal(res.timeRemainingMs, 0);
    });
  });

  // --------------------------------------------------------------------------
  // B9-B13: Leap Years & Timezone Offsets
  // --------------------------------------------------------------------------
  describe('Leap Years & Timezones', () => {
    it('B9: Leap year expiration: Feb 29 on leap year 2028 is correctly validated and parsed', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'leap-2028',
        code: 'LEAP2028',
        expiresAt: '2028-02-29T23:59:59.000Z'
      };
      const refActive = new Date('2028-02-29T12:00:00.000Z');
      const resActive = lifecycle.resolveCouponExpiration(coupon, refActive);
      assert.equal(resActive.isExpired, false);

      const refExpired = new Date('2028-03-01T00:00:01.000Z');
      const resExpired = lifecycle.resolveCouponExpiration(coupon, refExpired);
      assert.equal(resExpired.isExpired, true);
    });

    it('B10: Non-leap year: Feb 28 on 2027 transitions cleanly to March 1 without NaN errors', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'non-leap-2027',
        code: 'NONLEAP',
        expiresAt: '2027-02-28T23:59:59.000Z'
      };
      const refMarch = new Date('2027-03-01T00:00:00.000Z');
      const res = lifecycle.resolveCouponExpiration(coupon, refMarch);
      assert.equal(res.isExpired, true);
    });

    it('B11: Timezone offset UTC+9 (Japan ISO "2026-11-18T23:59:59+09:00") parses to exact UTC epoch', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const jstString = '2026-11-18T23:59:59+09:00';
      const coupon = { id: 'jst-coupon', code: 'JSTCOUPON', expiresAt: jstString };
      // 23:59:59 JST is 14:59:59 UTC
      const refUtcBefore = new Date('2026-11-18T14:59:58.000Z');
      const resBefore = lifecycle.resolveCouponExpiration(coupon, refUtcBefore);
      assert.equal(resBefore.isExpired, false);

      const refUtcAfter = new Date('2026-11-18T15:00:00.000Z');
      const resAfter = lifecycle.resolveCouponExpiration(coupon, refUtcAfter);
      assert.equal(resAfter.isExpired, true);
    });

    it('B12: Timezone offset UTC-5 (New York ISO "2026-11-18T23:59:59-05:00") parses to exact UTC epoch', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const estString = '2026-11-18T23:59:59-05:00';
      const coupon = { id: 'est-coupon', code: 'ESTCOUPON', expiresAt: estString };
      // 23:59:59 EST is 04:59:59 UTC on next day (Nov 19)
      const refUtcBefore = new Date('2026-11-19T04:59:58.000Z');
      const resBefore = lifecycle.resolveCouponExpiration(coupon, refUtcBefore);
      assert.equal(resBefore.isExpired, false);

      const refUtcAfter = new Date('2026-11-19T05:00:00.000Z');
      const resAfter = lifecycle.resolveCouponExpiration(coupon, refUtcAfter);
      assert.equal(resAfter.isExpired, true);
    });

    it('B13: Daylight saving time transition boundary preserves continuous epoch math', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      // March 2026 DST transition in US (March 8, 2026)
      const dstCoupon = {
        id: 'dst-coupon',
        code: 'DSTCOUPON',
        discoveredAt: '2026-03-01T00:00:00.000Z',
        ttlDays: 14 // Crosses DST boundary
      };
      const res = lifecycle.resolveCouponExpiration(dstCoupon, new Date('2026-03-01T00:00:00.000Z'));
      const diffMs = new Date(res.expiresAt).getTime() - new Date('2026-03-01T00:00:00.000Z').getTime();
      assert.equal(diffMs, 14 * 24 * 60 * 60 * 1000, 'TTL must be exact 14 physical days in ms');
    });
  });

  // --------------------------------------------------------------------------
  // B14-B17: Corrupt Storage & Quota Errors
  // --------------------------------------------------------------------------
  describe('Storage Corruption & Quota Resilience', () => {
    it('B14: Corrupted localStorage JSON syntax ("{ broken json ...") handled without throwing', async () => {
      mockStorage.loadRaw('ecosistema_b_custom_coupons_v1', '{ broken invalid json string');

      // autoPublishAiCoupons should not throw and should safely overwrite or append
      assert.doesNotThrow(() => {
        const added = autoPublishAiCoupons([
          { code: 'RECOVER1', store: 'aliexpress', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'Recover' }
        ]);
        assert.equal(added, 1);
      });

      // getCouponsForLocale should not throw
      assert.doesNotThrow(() => {
        const list = getCouponsForLocale('en-us');
        assert.ok(Array.isArray(list));
      });
    });

    it('B15: Corrupted localStorage with primitive string value ("just-a-string") handled safely', () => {
      mockStorage.loadRaw('ecosistema_b_custom_coupons_v1', '"just-a-string"');

      assert.doesNotThrow(() => {
        const list = getCouponsForLocale('en-us');
        assert.ok(Array.isArray(list));
      });
    });

    it('B16: Corrupted localStorage with JSON object instead of array handled safely', () => {
      mockStorage.loadRaw('ecosistema_b_custom_coupons_v1', '{"not": "an array"}');

      assert.doesNotThrow(() => {
        const list = getCouponsForLocale('en-us');
        assert.ok(Array.isArray(list));
      });
    });

    it('B17: LocalStorage QuotaExceededError during setItem does not crash autoPublish or purge', () => {
      mockStorage.shouldThrowQuota = true;

      assert.doesNotThrow(() => {
        const added = autoPublishAiCoupons([
          { code: 'QUOTATEST', store: 'aliexpress', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'Quota' }
        ]);
        assert.equal(added, 0, 'Should return 0 added on quota failure without uncaught exception');
      });
    });
  });

  // --------------------------------------------------------------------------
  // B18-B24: Missing Fields, Quota 429 & Fallbacks
  // --------------------------------------------------------------------------
  describe('Missing Fields, Quota 429 & Fallback Handling', () => {
    it('B18: Coupon object with missing code field is rejected by autoPublishAiCoupons', () => {
      const invalidCoupons = [
        { store: 'aliexpress', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'No Code' },
        { code: '', store: 'aliexpress', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'Empty Code' },
        { code: 'VALIDCODE', store: 'aliexpress', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'Valid' }
      ];
      const added = autoPublishAiCoupons(invalidCoupons);
      assert.equal(added, 1, 'Only the coupon with a valid non-empty code should be added');
    });

    it('B19: Coupon object with missing store field defaults safely to "aliexpress"', () => {
      const coupons = [
        { code: 'NOSTORE', category: 'tech-gadgets', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'No Store' }
      ];
      autoPublishAiCoupons(coupons);
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const list = JSON.parse(raw);
      assert.equal(list[0].store, 'aliexpress');
    });

    it('B20: Coupon object with string or NaN discount numbers parsed safely to numeric values', () => {
      const coupons = [
        { code: 'STRINGNUMS', store: 'aliexpress', category: 'tech-gadgets', discountPct: '30%', discountUsd: '15.50', minSpendUsd: 'invalid-spend', title: 'String Nums' }
      ];
      autoPublishAiCoupons(coupons);
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const list = JSON.parse(raw);
      assert.equal(typeof list[0].discountPct, 'number');
      assert.equal(typeof list[0].discountUsd, 'number');
      assert.equal(typeof list[0].minSpendUsd, 'number');
      assert.ok(!isNaN(list[0].minSpendUsd));
    });

    it('B21: 429 Rate Limit / Quota Exhaustion simulation on AI Radar returns deterministic fallback', async () => {
      let jsonPayload = null;
      const res = {
        setHeader() {},
        status(code) {
          assert.equal(code, 200, 'Endpoint should catch network/quota failure and return 200 with fallback');
          return this;
        },
        json(data) { jsonPayload = data; return this; }
      };

      // In Node testing without mock gateway, fetch will fail or fallback
      await radarHandler({ method: 'GET' }, res);
      assert.ok(jsonPayload);
      assert.equal(jsonPayload.ok, true);
      assert.ok(jsonPayload.modelUsed);
      assert.ok(jsonPayload.data?.discoveredCoupons?.length >= 8);
    });

    it('B22: Empty arrays: autoPublishAiCoupons with [] returns 0 and does not mutate storage', () => {
      mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify([{ id: 'exist', code: 'EXIST' }]));
      const added = autoPublishAiCoupons([]);
      assert.equal(added, 0);
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      assert.equal(JSON.parse(raw).length, 1);
    });

    it('B23: Empty arrays: purgeExpiredCoupons with [] returns empty activeCoupons and zero purged', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const res = lifecycle.purgeExpiredCoupons([], new Date());
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
      assert.deepEqual(res.purgedIds, []);
    });

    it('B24: Unknown locale code passed to getLocaleConfig defaults safely to DEFAULT_LOCALE ("en-us")', () => {
      const config1 = getLocaleConfig('unknown-locale-xyz');
      assert.equal(config1.code, DEFAULT_LOCALE);

      const config2 = getLocaleConfig(null);
      assert.equal(config2.code, DEFAULT_LOCALE);

      const config3 = getLocaleConfig(undefined);
      assert.equal(config3.code, DEFAULT_LOCALE);
    });
  });
});
