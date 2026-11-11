// Adversarial Empirical Test Suite - Milestone 2
// Coupon Expiration, Temporal Precision, Storage Corruption Recovery, Performance & Tombstones
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import {
  resolveCouponExpiration,
  purgeExpiredCoupons,
  syncAndPurgeStorage,
  isCouponTombstoned,
  addCouponTombstone,
  STORAGE_KEY_CUSTOM_COUPONS,
  STORAGE_KEY_TOMBSTONES
} from '../src/data/couponLifecycle.js';
import { getCouponsForLocale, autoPublishAiCoupons } from '../src/data/couponsGenerator.js';

describe('Adversarial Empirical Verification: Milestone 2', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = installMockStorage();
  });

  // ==========================================================================
  // SUITE 1: PRECISE TEMPORAL BOUNDARIES
  // ==========================================================================
  describe('Suite 1: Precise Temporal Boundaries', () => {
    it('BOUND-01: Tier 1 Explicit Expiration - exact ms, 1ms before, and 1ms after', () => {
      const expIso = '2026-11-11T12:00:00.000Z';
      const expMs = new Date(expIso).getTime();
      const coupon = { id: 'c-exp', code: 'EXP1', expiresAt: expIso };

      // 1ms before expiration: MUST be active
      const before = resolveCouponExpiration(coupon, new Date(expMs - 1));
      assert.equal(before.isExpired, false, 'Coupon must NOT be expired 1ms before expiration');
      assert.equal(before.timeRemainingMs, 1, 'timeRemainingMs must be exactly 1ms');

      // Exact millisecond of expiration: MUST be expired
      const exact = resolveCouponExpiration(coupon, new Date(expMs));
      assert.equal(exact.isExpired, true, 'Coupon MUST be expired at exact expiration millisecond');
      assert.equal(exact.timeRemainingMs, 0, 'timeRemainingMs must be 0 at exact millisecond');

      // 1ms after expiration: MUST be expired
      const after = resolveCouponExpiration(coupon, new Date(expMs + 1));
      assert.equal(after.isExpired, true, 'Coupon MUST be expired 1ms after expiration');
      assert.equal(after.timeRemainingMs, 0, 'timeRemainingMs must be 0 after expiration');
    });

    it('BOUND-02: Tier 0 Evergreen Coupons - permanent validity across millennia', () => {
      const evergreen = { id: 'c-ever', code: 'PERMANENT', isEvergreen: true };

      const year2026 = resolveCouponExpiration(evergreen, new Date('2026-11-11T00:00:00.000Z'));
      assert.equal(year2026.isExpired, false);
      assert.equal(year2026.timeRemainingMs, Infinity);

      const year9999 = resolveCouponExpiration(evergreen, new Date('9999-12-31T23:59:58.000Z'));
      assert.equal(year9999.isExpired, false);
      assert.equal(year9999.timeRemainingMs, Infinity);

      const year15000 = resolveCouponExpiration(evergreen, new Date('15000-01-01T00:00:00.000Z'));
      assert.equal(year15000.isExpired, false);
      assert.equal(year15000.timeRemainingMs, Infinity);
    });

    it('BOUND-03: Tier 2 Commercial Event Window - exact boundary at 23:59:59.000Z', () => {
      // 11.11 Singles Day ends Nov 18 23:59:59.000Z
      const coupon11 = { id: 'c-1111', code: 'SINGLES11', eventWindowId: '11-11-singles-day' };
      const expMs = new Date('2026-11-18T23:59:59.000Z').getTime();

      const before = resolveCouponExpiration(coupon11, new Date(expMs - 1));
      assert.equal(before.isExpired, false, '11.11 coupon must be active 1ms before 23:59:59.000Z');
      assert.equal(before.timeRemainingMs, 1);

      const exact = resolveCouponExpiration(coupon11, new Date(expMs));
      assert.equal(exact.isExpired, true, '11.11 coupon must be expired at exact 23:59:59.000Z');
      assert.equal(exact.timeRemainingMs, 0);

      const after = resolveCouponExpiration(coupon11, new Date(expMs + 1));
      assert.equal(after.isExpired, true, '11.11 coupon must be expired 1ms after 23:59:59.000Z');
      assert.equal(after.timeRemainingMs, 0);
    });

    it('BOUND-04: Tier 3 Default TTL (14 Days) - exact millisecond boundary', () => {
      const discoveredIso = '2026-11-01T00:00:00.000Z';
      const discoveredMs = new Date(discoveredIso).getTime();
      const expMs = discoveredMs + (14 * 24 * 60 * 60 * 1000); // 14 days later
      const couponTtl = { id: 'c-ttl', code: 'TTL14', discoveredAt: discoveredIso, ttlDays: 14 };

      const before = resolveCouponExpiration(couponTtl, new Date(expMs - 1));
      assert.equal(before.isExpired, false, 'Coupon must be active 1ms before TTL expiration');
      assert.equal(before.timeRemainingMs, 1);

      const exact = resolveCouponExpiration(couponTtl, new Date(expMs));
      assert.equal(exact.isExpired, true, 'Coupon must be expired at exact TTL boundary');
      assert.equal(exact.timeRemainingMs, 0);

      const after = resolveCouponExpiration(couponTtl, new Date(expMs + 1));
      assert.equal(after.isExpired, true, 'Coupon must be expired 1ms after TTL boundary');
      assert.equal(after.timeRemainingMs, 0);
    });
  });

  // ==========================================================================
  // SUITE 2: STORAGE CORRUPTION RECOVERY
  // ==========================================================================
  describe('Suite 2: Storage Corruption Recovery', () => {
    it('CORRUPT-01: Raw non-JSON string in localStorage returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, 'NOT_VALID_JSON_STRING{{{');
      const res = syncAndPurgeStorage();
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
    });

    it('CORRUPT-02: Numeric literal in localStorage returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, '123456');
      const res = syncAndPurgeStorage();
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
    });

    it('CORRUPT-03: Boolean literal in localStorage returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, 'true');
      const res = syncAndPurgeStorage();
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
    });

    it('CORRUPT-04: Null literal in localStorage returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, 'null');
      const res = syncAndPurgeStorage();
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
    });

    it('CORRUPT-05: Truncated JSON in localStorage returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, '[{"id":"c1","code":"TRUNC"');
      const res = syncAndPurgeStorage();
      assert.deepEqual(res.activeCoupons, []);
      assert.equal(res.purgedCount, 0);
    });

    it('CORRUPT-06: Empty string or missing key returns empty and does not throw', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, '');
      const res1 = syncAndPurgeStorage();
      assert.deepEqual(res1.activeCoupons, []);
      assert.equal(res1.purgedCount, 0);

      mockStorage.removeItem(STORAGE_KEY_CUSTOM_COUPONS);
      const res2 = syncAndPurgeStorage();
      assert.deepEqual(res2.activeCoupons, []);
      assert.equal(res2.purgedCount, 0);
    });

    it('CORRUPT-07: Array of non-object primitives [123, "string", true] handled safely', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify([123, 'corrupt', true]));
      const res = syncAndPurgeStorage();
      assert.ok(Array.isArray(res.activeCoupons));
      assert.equal(res.activeCoupons.length, 0);
    });

    it('CORRUPT-08: Array containing null or undefined elements must not crash purgeExpiredCoupons', () => {
      // Direct call to purgeExpiredCoupons with null/undefined items
      assert.doesNotThrow(() => {
        const res = purgeExpiredCoupons([null, undefined, { id: 'valid1', expiresAt: '2099-01-01T00:00:00Z' }]);
        assert.ok(res, 'purgeExpiredCoupons must return a result');
        assert.equal(res.activeCoupons.length, 1, 'Valid coupon must survive');
        assert.equal(res.purgedCount, 2, 'Null/undefined entries must be purged');
      }, 'purgeExpiredCoupons must not throw Cannot read properties of null (reading id)');
    });

    it('CORRUPT-09: Array containing null must not corrupt syncAndPurgeStorage or hide valid coupons', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify([
        null,
        { id: 'valid_survivor', code: 'SURVIVE', expiresAt: '2099-01-01T00:00:00Z' }
      ]));

      const res = syncAndPurgeStorage();
      assert.equal(res.activeCoupons.length, 1, 'Valid coupon must be returned as active despite null sibling');
      assert.equal(res.activeCoupons[0].id, 'valid_survivor');
      assert.equal(res.purgedCount, 1, 'Null entry must be counted as purged');
    });

    it('CORRUPT-10: QuotaExceededError simulation during setItem does not crash syncAndPurgeStorage', () => {
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify([
        { id: 'exp1', expiresAt: '2020-01-01T00:00:00Z' }
      ]));
      mockStorage.shouldThrowQuota = true;

      assert.doesNotThrow(() => {
        const res = syncAndPurgeStorage();
        assert.ok(res);
      }, 'Storage quota exceeded must be gracefully caught');
    });
  });

  // ==========================================================================
  // SUITE 3: LARGE PAYLOAD PURGE PERFORMANCE BENCHMARK
  // ==========================================================================
  describe('Suite 3: Large Payload Purge Performance Benchmark', () => {
    it('PERF-01: Purging 1,000 mixed coupons completes in < 50ms with exact counts', () => {
      const now = Date.now();
      const payload = [];
      const expectedActiveIds = new Set();
      const expectedPurgedIds = new Set();

      for (let i = 0; i < 1000; i++) {
        if (i % 2 === 0) {
          const id = `active-${i}`;
          expectedActiveIds.add(id);
          payload.push({
            id,
            code: `ACT${i}`,
            expiresAt: new Date(now + 86400000).toISOString()
          });
        } else {
          const id = `expired-${i}`;
          expectedPurgedIds.add(id);
          payload.push({
            id,
            code: `EXP${i}`,
            expiresAt: new Date(now - 86400000).toISOString()
          });
        }
      }

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(payload));

      const startTime = performance.now();
      const res = syncAndPurgeStorage(new Date(now));
      const durationMs = performance.now() - startTime;

      assert.equal(res.purgedCount, 500, 'Must purge exactly 500 expired coupons');
      assert.equal(res.activeCoupons.length, 500, 'Must retain exactly 500 active coupons');
      assert.ok(durationMs < 50, `Purging 1,000 coupons took ${durationMs.toFixed(2)}ms, must be < 50ms`);

      // Verify surviving coupons in storage
      const stored = JSON.parse(mockStorage.getItem(STORAGE_KEY_CUSTOM_COUPONS));
      assert.equal(stored.length, 500, 'Storage must persist exactly the 500 active coupons');
      assert.ok(stored.every((c) => expectedActiveIds.has(c.id)), 'Every stored coupon must be an active coupon');
    });

    it('PERF-02: Purging 1,000 all-expired coupons clears storage cleanly', () => {
      const now = Date.now();
      const payload = Array.from({ length: 1000 }, (_, i) => ({
        id: `expired-${i}`,
        code: `ALL_EXP_${i}`,
        expiresAt: new Date(now - 3600000).toISOString()
      }));

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(payload));

      const t0 = performance.now();
      const res = syncAndPurgeStorage(new Date(now));
      const elapsed = performance.now() - t0;

      assert.equal(res.purgedCount, 1000);
      assert.equal(res.activeCoupons.length, 0);
      assert.ok(elapsed < 50, `Elapsed ${elapsed.toFixed(2)}ms`);

      const stored = JSON.parse(mockStorage.getItem(STORAGE_KEY_CUSTOM_COUPONS));
      assert.deepEqual(stored, []);
    });

    it('PERF-03: Purging 1,000 all-active coupons makes 0 purges and does not rewrite storage needlessly', () => {
      const now = Date.now();
      const payload = Array.from({ length: 1000 }, (_, i) => ({
        id: `active-${i}`,
        code: `ALL_ACT_${i}`,
        expiresAt: new Date(now + 86400000).toISOString()
      }));

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(payload));

      const t0 = performance.now();
      const res = syncAndPurgeStorage(new Date(now));
      const elapsed = performance.now() - t0;

      assert.equal(res.purgedCount, 0);
      assert.equal(res.activeCoupons.length, 1000);
      assert.ok(elapsed < 50, `Elapsed ${elapsed.toFixed(2)}ms`);
    });
  });

  // ==========================================================================
  // SUITE 4: TOMBSTONE REJECTION & ACTIVE FILTERING
  // ==========================================================================
  describe('Suite 4: Tombstone Rejection & Active Filtering', () => {
    it('TOMB-01: String code tombstone is recognized case-insensitively and with whitespace', () => {
      addCouponTombstone('  DISCARD_2026  ');

      assert.equal(isCouponTombstoned('DISCARD_2026'), true);
      assert.equal(isCouponTombstoned('discard_2026'), true);
      assert.equal(isCouponTombstoned('  discard_2026  '), true);
      assert.equal(isCouponTombstoned('ACTIVE_CODE'), false);
    });

    it('TOMB-02: Object parameter to addCouponTombstone must register coupon code/id, not [object Object]', () => {
      addCouponTombstone({ id: 'c-tomb-obj', code: 'OBJ_TOMB_CODE', backupCode: 'OBJ_BACKUP' });

      assert.equal(
        isCouponTombstoned('OBJ_TOMB_CODE'),
        true,
        'addCouponTombstone must extract code from coupon object'
      );
      assert.equal(
        isCouponTombstoned('OBJ_BACKUP'),
        true,
        'addCouponTombstone must extract backupCode from coupon object'
      );
      assert.equal(
        isCouponTombstoned('c-tomb-obj'),
        true,
        'addCouponTombstone must extract id from coupon object'
      );
      assert.equal(
        isCouponTombstoned('[object Object]'),
        false,
        'Must NOT register literal [object Object] string'
      );
    });

    it('TOMB-03: Tombstoned coupons in storage MUST NOT be returned as active by syncAndPurgeStorage', () => {
      addCouponTombstone('TOMB_ACTIVE_CHECK');

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify([
        {
          id: 'c-tomb-1',
          code: 'TOMB_ACTIVE_CHECK',
          store: 'aliexpress',
          category: 'tech-gadgets',
          expiresAt: '2099-01-01T00:00:00.000Z'
        },
        {
          id: 'c-valid-1',
          code: 'LEGIT_ACTIVE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          expiresAt: '2099-01-01T00:00:00.000Z'
        }
      ]));

      const res = syncAndPurgeStorage();
      const returnedCodes = res.activeCoupons.map((c) => c.code);

      assert.ok(
        !returnedCodes.includes('TOMB_ACTIVE_CHECK'),
        `Tombstoned coupon TOMB_ACTIVE_CHECK must NOT be returned in activeCoupons, got: ${returnedCodes.join(', ')}`
      );
      assert.ok(
        returnedCodes.includes('LEGIT_ACTIVE'),
        'Legitimate active coupon must be preserved'
      );
    });

    it('TOMB-04: Tombstoned coupons MUST NOT be returned as active in getCouponsForLocale catalog', () => {
      addCouponTombstone('CATALOG_TOMB_CODE');

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify([
        {
          id: 'c-cat-tomb',
          code: 'CATALOG_TOMB_CODE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          expiresAt: '2099-01-01T00:00:00.000Z'
        },
        {
          id: 'c-cat-legit',
          code: 'CATALOG_LEGIT_CODE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          expiresAt: '2099-01-01T00:00:00.000Z'
        }
      ]));

      const catalogCoupons = getCouponsForLocale('es-es');
      const foundTomb = catalogCoupons.find((c) => c.code === 'CATALOG_TOMB_CODE');
      assert.equal(
        Boolean(foundTomb),
        false,
        'Tombstoned coupon CATALOG_TOMB_CODE must NEVER appear in active catalog for es-es'
      );
    });

    it('TOMB-05: autoPublishAiCoupons strictly skips tombstoned coupons', () => {
      addCouponTombstone('RADAR_TOMB_CODE');

      const discovered = [
        {
          code: 'RADAR_TOMB_CODE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          discountUsd: 15
        },
        {
          code: 'RADAR_FRESH_CODE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          discountUsd: 20
        }
      ];

      const added = autoPublishAiCoupons(discovered);
      assert.equal(added, 1, 'Only the non-tombstoned coupon should be added');

      const stored = JSON.parse(mockStorage.getItem(STORAGE_KEY_CUSTOM_COUPONS) || '[]');
      const storedCodes = stored.map((c) => c.code);
      assert.ok(!storedCodes.includes('RADAR_TOMB_CODE'));
      assert.ok(storedCodes.includes('RADAR_FRESH_CODE'));
    });
  });
});
