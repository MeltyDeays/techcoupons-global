import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { installMockStorage } from './helpers/mockStorage.js';
import { LOCALES, getLocaleConfig } from '../src/config/locales.js';
import {
  getCouponsForLocale,
  autoPublishAiCoupons
} from '../src/data/couponsGenerator.js';
import {
  resolveCouponExpiration,
  purgeExpiredCoupons,
  syncAndPurgeStorage,
  DEFAULT_DISCOVERED_TTL_DAYS,
  STORAGE_KEY_CUSTOM_COUPONS
} from '../src/data/couponLifecycle.js';

describe('Tier 5 Adversarial: Milestone 2 — Catalog Leak Prevention & UI Rendering Harness', () => {
  let mockStorage;
  let viteServer;
  let CouponCard;

  before(async () => {
    const { createServer } = await import('vite');
    viteServer = await createServer({ server: { middlewareMode: true } });
    const mod = await viteServer.ssrLoadModule('./src/components/CouponCard.jsx');
    CouponCard = mod.default;
  });

  after(async () => {
    if (viteServer) {
      await viteServer.close();
    }
  });

  beforeEach(() => {
    mockStorage = installMockStorage();
  });

  // ==========================================================================
  // Section 1: Zero-Leak Catalog Guarantee
  // ==========================================================================
  describe('1. Zero-Leak Catalog Guarantee across 66 Markets & 27 Languages', () => {
    it('ZL-01: Past explicit ISO-8601 expiresAt coupons NEVER leak into getCouponsForLocale across all 66 markets', () => {
      const expiredCoupons = [
        { code: 'EXP_EXPLICIT_01', expiresAt: '2025-01-01T00:00:00.000Z', store: 'aliexpress' },
        { code: 'EXP_EXPLICIT_02', expiresAt: '2026-11-01T00:00:00.000Z', store: 'temu' },
        { code: 'EXP_EXPLICIT_03', expiresAt: '1970-01-01T00:00:00.000Z', store: 'aliexpress' },
        { code: 'EXP_EXPLICIT_04', expiresAt: '1969-12-31T23:59:59.000Z', store: 'temu' }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(expiredCoupons));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-11T00:00:00.000Z');

      assert.equal(LOCALES.length, 66, 'Must verify all 66 markets');

      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        for (const expired of expiredCoupons) {
          const leaked = catalog.some((c) => c.code === expired.code);
          assert.equal(
            leaked,
            false,
            `Coupon ${expired.code} leaked into catalog for market ${loc.code}`
          );
        }
      }
    });

    it('ZL-02: Past commercial event coupons (11.11 Singles Day) NEVER leak after event termination', () => {
      const eventCoupons = [
        { code: 'EXP_EVENT_1111_01', eventWindowId: '11-11-singles-day', store: 'aliexpress' },
        { code: 'EXP_EVENT_1111_02', isEvent1111: true, store: 'temu' }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(eventCoupons));
      // 11.11 ends Nov 18 23:59:59 UTC. Simulate reference date at Nov 19 00:00:01 UTC
      const postEventDate = '2026-11-19T00:00:01.000Z';
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', postEventDate);

      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        for (const ec of eventCoupons) {
          const leaked = catalog.some((c) => c.code === ec.code);
          assert.equal(
            leaked,
            false,
            `Terminated commercial event coupon ${ec.code} leaked in market ${loc.code}`
          );
        }
      }
    });

    it('ZL-03: Past default TTL (>14 days) coupons NEVER leak across all 66 markets', () => {
      const ttlCoupons = [
        {
          code: 'EXP_TTL_OLD_01',
          discoveredAt: '2026-10-01T00:00:00.000Z',
          store: 'aliexpress'
        },
        {
          code: 'EXP_TTL_OLD_02',
          createdAt: '2026-10-15T00:00:00.000Z',
          store: 'temu'
        }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(ttlCoupons));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-11T00:00:00.000Z');

      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        for (const tc of ttlCoupons) {
          const leaked = catalog.some((c) => c.code === tc.code);
          assert.equal(leaked, false, `TTL expired coupon ${tc.code} leaked in ${loc.code}`);
        }
      }
    });

    it('ZL-04: Custom TTL coupons (e.g. ttlDays: 3, 4 days old) NEVER leak across all 66 markets', () => {
      const customTtl = [
        {
          code: 'EXP_CUSTOM_TTL_01',
          discoveredAt: '2026-11-01T00:00:00.000Z',
          ttlDays: 3,
          store: 'aliexpress'
        }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(customTtl));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-05T00:00:00.000Z');

      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        const leaked = catalog.some((c) => c.code === 'EXP_CUSTOM_TTL_01');
        assert.equal(leaked, false, `Custom TTL coupon leaked in market ${loc.code}`);
      }
    });

    it('ZL-05: Sub-second expiration boundary (+/- 1ms) strictly distinguishes expired vs active coupons', () => {
      const refDate = new Date('2026-11-11T12:00:00.000Z');
      const refIso = refDate.toISOString();
      const past1ms = new Date(refDate.getTime() - 1).toISOString();
      const future1ms = new Date(refDate.getTime() + 1).toISOString();

      const boundaryCoupons = [
        { code: 'EXP_SUB_MS_PAST', expiresAt: past1ms, store: 'aliexpress' },
        { code: 'ACT_SUB_MS_FUTURE', expiresAt: future1ms, store: 'aliexpress' }
      ];

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(boundaryCoupons));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', refIso);

      const catalog = getCouponsForLocale('es-es');
      const hasPast = catalog.some((c) => c.code === 'EXP_SUB_MS_PAST');
      const hasFuture = catalog.some((c) => c.code === 'ACT_SUB_MS_FUTURE');

      assert.equal(hasPast, false, 'Coupon expiring 1ms in the past must NOT leak');
      assert.equal(hasFuture, true, 'Coupon expiring 1ms in the future must remain active');
    });

    it('ZL-06: Malformed or missing date objects do not throw and are handled safely without leaks', () => {
      const malformedCoupons = [
        { code: 'MAL_01', expiresAt: 'not-a-valid-date-string', store: 'aliexpress' },
        { code: 'MAL_02', expiresAt: '', store: 'aliexpress' },
        { code: 'MAL_03', store: 'aliexpress' }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(malformedCoupons));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-11T00:00:00.000Z');

      // None of the 66 markets should throw on catalog generation
      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        assert.ok(Array.isArray(catalog), `Catalog must be an array for ${loc.code}`);
      }
    });

    it('ZL-07: In-memory and localStorage dual purge cleanses expired storage on catalog read', () => {
      const mixedCoupons = [
        { code: 'LEAK_CHECK_EXP_1', expiresAt: '2024-01-01T00:00:00.000Z', store: 'aliexpress' },
        { code: 'LEAK_CHECK_EXP_2', expiresAt: '2025-05-01T00:00:00.000Z', store: 'temu' },
        { code: 'LEAK_CHECK_ACT_1', expiresAt: '2027-01-01T00:00:00.000Z', store: 'aliexpress' },
        { code: 'LEAK_CHECK_EVER', isEvergreen: true, store: 'aliexpress' }
      ];
      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(mixedCoupons));
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-11T00:00:00.000Z');

      // Trigger catalog read
      const catalog = getCouponsForLocale('en-us');
      const catalogCodes = catalog.map((c) => c.code);

      assert.equal(catalogCodes.includes('LEAK_CHECK_EXP_1'), false);
      assert.equal(catalogCodes.includes('LEAK_CHECK_EXP_2'), false);
      assert.equal(catalogCodes.includes('LEAK_CHECK_ACT_1'), true);
      assert.equal(catalogCodes.includes('LEAK_CHECK_EVER'), true);

      // Verify that localStorage was also cleansed
      const rawStored = mockStorage.getItem(STORAGE_KEY_CUSTOM_COUPONS);
      const remainingStored = JSON.parse(rawStored);
      const remainingCodes = remainingStored.map((c) => c.code);

      assert.equal(remainingCodes.includes('LEAK_CHECK_EXP_1'), false);
      assert.equal(remainingCodes.includes('LEAK_CHECK_EXP_2'), false);
      assert.equal(remainingCodes.includes('LEAK_CHECK_ACT_1'), true);
      assert.equal(remainingCodes.includes('LEAK_CHECK_EVER'), true);
    });

    it('ZL-08: All 27 unique languages preserve active promotions while maintaining 0% expired leak', () => {
      const activeCoupon = {
        code: 'MULTI_LANG_ACTIVE_01',
        expiresAt: '2027-06-01T00:00:00.000Z',
        store: 'aliexpress',
        category: 'tech-gadgets'
      };
      const expiredCoupon = {
        code: 'MULTI_LANG_EXPIRED_01',
        expiresAt: '2025-06-01T00:00:00.000Z',
        store: 'aliexpress',
        category: 'tech-gadgets'
      };
      mockStorage.setItem(
        STORAGE_KEY_CUSTOM_COUPONS,
        JSON.stringify([activeCoupon, expiredCoupon])
      );
      mockStorage.setItem('ecosistema_b_last_ref_date_v1', '2026-11-11T00:00:00.000Z');

      const uniqueLangs = [...new Set(LOCALES.map((l) => l.lang))];
      assert.equal(uniqueLangs.length, 27, 'Must test all 27 distinct languages');

      for (const lang of uniqueLangs) {
        const repLocale = LOCALES.find((l) => l.lang === lang);
        const catalog = getCouponsForLocale(repLocale.code);

        const hasActive = catalog.some((c) => c.code === activeCoupon.code);
        const hasExpired = catalog.some((c) => c.code === expiredCoupon.code);

        assert.equal(hasActive, true, `Active coupon missing for lang ${lang} (${repLocale.code})`);
        assert.equal(hasExpired, false, `Expired coupon leaked for lang ${lang} (${repLocale.code})`);
      }
    });
  });

  // ==========================================================================
  // Section 2: Dynamic Card Rendering (CouponCard.jsx)
  // ==========================================================================
  describe('2. Dynamic Card Rendering (CouponCard.jsx)', () => {
    const locEs = getLocaleConfig('es-es');
    const locEn = getLocaleConfig('en-us');

    const baseCoupon = {
      code: 'CARD_PROMO',
      backupCode: 'CARD_BACKUP',
      store: 'aliexpress',
      category: 'tech-gadgets',
      title: 'Descuento Especial en Electrónica',
      discountPct: 25,
      discountUsd: 20,
      minSpendUsd: 80,
      localMinSpend: '80 €',
      localDiscountAmount: '20 €',
      affiliateLink: 'https://aliexpress.com?test=1',
      categoryLabel: 'Tecnología'
    };

    it('DC-01: Evergreen voucher renders "Cupón Permanente" (es) and "Evergreen Voucher" (en)', () => {
      const coupon = { ...baseCoupon, isEvergreen: true };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Cupón Permanente'), 'ES must display Cupón Permanente');
      assert.ok(htmlEn.includes('Evergreen Voucher'), 'EN must display Evergreen Voucher');
      assert.equal(htmlEs.includes('NaN'), false, 'ES must not contain NaN');
      assert.equal(htmlEn.includes('NaN'), false, 'EN must not contain NaN');
    });

    it('DC-02: Expired coupon renders "Expirado" (es) and "Expired" (en)', () => {
      const coupon = { ...baseCoupon, expiresAt: '2020-01-01T00:00:00.000Z' };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Expirado'), 'ES must display Expirado');
      assert.ok(htmlEn.includes('Expired'), 'EN must display Expired');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-03: Imminent expiry <24h with hours > 0 renders "Expira hoy (Xh)" / "Expires today (Xh)"', () => {
      const fiveHoursAhead = new Date(Date.now() + 5 * 3600 * 1000 + 30000).toISOString();
      const coupon = { ...baseCoupon, expiresAt: fiveHoursAhead };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Expira hoy (5h)'), 'ES must format Expira hoy (5h)');
      assert.ok(htmlEn.includes('Expires today (5h)'), 'EN must format Expires today (5h)');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-04: Imminent expiry <1h (hours === 0) renders "Expira hoy" / "Expires today"', () => {
      const thirtyMinsAhead = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const coupon = { ...baseCoupon, expiresAt: thirtyMinsAhead };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Expira hoy'), 'ES must display Expira hoy');
      assert.ok(htmlEn.includes('Expires today'), 'EN must display Expires today');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-05: Multi-day discount (1 day, tomorrow) renders "Expira mañana" / "Expires tomorrow"', () => {
      const tomorrow = new Date(Date.now() + 25 * 3600 * 1000).toISOString();
      const coupon = { ...baseCoupon, expiresAt: tomorrow };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Expira mañana'), 'ES must display Expira mañana');
      assert.ok(htmlEn.includes('Expires tomorrow'), 'EN must display Expires tomorrow');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-06: Multi-day discount (2-14 days) renders "Expira en N días" / "Expires in N days"', () => {
      const sixDaysAhead = new Date(Date.now() + 6 * 86400 * 1000 + 30000).toISOString();
      const coupon = { ...baseCoupon, expiresAt: sixDaysAhead };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Expira en 6 días'), 'ES must format Expira en 6 días');
      assert.ok(htmlEn.includes('Expires in 6 days'), 'EN must format Expires in 6 days');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-07: Long-term campaign (>14 days) renders "Hasta [date]" / "Thru [date]"', () => {
      const twentyDaysAhead = new Date(Date.now() + 20 * 86400 * 1000).toISOString();
      const coupon = { ...baseCoupon, expiresAt: twentyDaysAhead };

      const htmlEs = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEs }));
      const htmlEn = renderToString(React.createElement(CouponCard, { coupon, localeConfig: locEn }));

      assert.ok(htmlEs.includes('Hasta '), 'ES must prefix with Hasta');
      assert.ok(htmlEn.includes('Thru '), 'EN must prefix with Thru');
      assert.equal(htmlEs.includes('NaN'), false);
      assert.equal(htmlEn.includes('NaN'), false);
    });

    it('DC-08: Stress & Fuzz: rendering with missing, empty, or negative fields never throws or emits NaN', () => {
      const fuzzCoupons = [
        { code: 'FUZZ_01' },
        { code: 'FUZZ_02', category: 'non-existent-category' },
        { code: 'FUZZ_03', discountPct: null, minSpendUsd: undefined },
        { code: 'FUZZ_04', discountPct: -50, minSpendUsd: -100 },
        { code: 'FUZZ_05', expiresAt: 'invalid-date-string' },
        { code: 'FUZZ_06', expiresAt: null, timeRemainingMs: NaN },
        { code: 'FUZZ_07', title: '', appliesToText: null, regionalNote: undefined }
      ];

      for (const fc of fuzzCoupons) {
        assert.doesNotThrow(() => {
          const html = renderToString(
            React.createElement(CouponCard, { coupon: fc, localeConfig: locEs })
          );
          assert.equal(html.includes('NaN'), false, `Fuzz ${fc.code} must not contain NaN`);
          assert.ok(html.length > 500, `Fuzz ${fc.code} must render non-trivial HTML`);
        });
      }
    });

    it('DC-09: Multi-locale rendering audit: renders cleanly across all 27 supported languages', () => {
      const uniqueLangs = [...new Set(LOCALES.map((l) => l.lang))];
      assert.equal(uniqueLangs.length, 27);

      for (const lang of uniqueLangs) {
        const locale = LOCALES.find((l) => l.lang === lang);
        assert.doesNotThrow(() => {
          const html = renderToString(
            React.createElement(CouponCard, { coupon: baseCoupon, localeConfig: locale })
          );
          assert.ok(html.length > 1000, `Card HTML must be valid for language ${lang}`);
          assert.equal(html.includes('NaN'), false);
        });
      }
    });
  });

  // ==========================================================================
  // Section 3: Multi-Day Lifecycle Simulation (30-Day Advancement)
  // ==========================================================================
  describe('3. Multi-Day Lifecycle Simulation across 30 Days', () => {
    it('LS-01: Chronological 30-day advancement transitions coupons from active -> expiring -> expired -> purged', () => {
      const baseDate = new Date('2026-11-01T00:00:00.000Z');

      const lifecycleCohort = [
        {
          code: 'SIM_1D_IMM',
          expiresAt: '2026-11-02T00:00:00.000Z',
          store: 'aliexpress',
          title: 'Expires in 1 day'
        },
        {
          code: 'SIM_3D_SHORT',
          expiresAt: '2026-11-04T00:00:00.000Z',
          store: 'aliexpress',
          title: 'Expires in 3 days'
        },
        {
          code: 'SIM_TTL_14D',
          discoveredAt: '2026-11-01T00:00:00.000Z',
          store: 'aliexpress',
          title: 'Discovered Day 0 (TTL 14D)'
        },
        {
          code: 'SIM_EVENT_1111',
          eventWindowId: '11-11-singles-day',
          store: 'aliexpress',
          title: 'Singles Day 11.11 Event Coupon'
        },
        {
          code: 'SIM_LONG_25D',
          expiresAt: '2026-11-26T00:00:00.000Z',
          store: 'aliexpress',
          title: 'Long campaign expires Day 25'
        },
        {
          code: 'SIM_EVERGREEN',
          isEvergreen: true,
          store: 'aliexpress',
          title: 'Permanent Evergreen Voucher'
        }
      ];

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(lifecycleCohort));

      // Day 0: All 6 active
      const d0 = new Date(baseDate.getTime() + 1000);
      const res0 = syncAndPurgeStorage(d0);
      assert.equal(res0.activeCoupons.length, 6, 'Day 0: All 6 coupons active');
      assert.equal(res0.purgedCount, 0, 'Day 0: 0 purged');

      // Check imminent expiry badge (<24h) for SIM_1D_IMM on Day 0
      const expInfoImm = resolveCouponExpiration(lifecycleCohort[0], d0);
      assert.equal(expInfoImm.isExpired, false);
      assert.ok(expInfoImm.timeRemainingMs < 24 * 3600 * 1000, 'SIM_1D_IMM has <24h remaining on Day 0');

      // Day 1 (24h 1s): SIM_1D_IMM expires
      const d1 = new Date(baseDate.getTime() + 1 * 86400 * 1000 + 1000);
      const res1 = syncAndPurgeStorage(d1);
      assert.equal(res1.purgedCount, 1, 'Day 1: 1 purged');
      assert.equal(res1.activeCoupons.length, 5, 'Day 1: 5 active remaining');
      const cat1 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat1.includes('SIM_1D_IMM'), false, 'SIM_1D_IMM purged from catalog');

      // Day 3 (72h 1s): SIM_3D_SHORT expires
      const d3 = new Date(baseDate.getTime() + 3 * 86400 * 1000 + 1000);
      const res3 = syncAndPurgeStorage(d3);
      assert.equal(res3.purgedCount, 1, 'Day 3: 1 purged');
      assert.equal(res3.activeCoupons.length, 4, 'Day 3: 4 active remaining');
      const cat3 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat3.includes('SIM_3D_SHORT'), false);

      // Day 14: SIM_TTL_14D expires (14 days from Day 0)
      const d14 = new Date(baseDate.getTime() + 14 * 86400 * 1000 + 1000);
      const res14 = syncAndPurgeStorage(d14);
      assert.equal(res14.purgedCount, 1, 'Day 14: 1 purged');
      assert.equal(res14.activeCoupons.length, 3, 'Day 14: 3 active remaining');
      const cat14 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat14.includes('SIM_TTL_14D'), false);

      // Day 18 (Nov 19 00:00:01): SIM_EVENT_1111 expires (ends Nov 18 23:59:59 UTC)
      const d18 = new Date(baseDate.getTime() + 18 * 86400 * 1000 + 1000);
      const res18 = syncAndPurgeStorage(d18);
      assert.equal(res18.purgedCount, 1, 'Day 18: 1 purged');
      assert.equal(res18.activeCoupons.length, 2, 'Day 18: 2 active remaining');
      const cat18 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat18.includes('SIM_EVENT_1111'), false);

      // Day 25 (Nov 26 00:00:01): SIM_LONG_25D expires
      const d25 = new Date(baseDate.getTime() + 25 * 86400 * 1000 + 1000);
      const res25 = syncAndPurgeStorage(d25);
      assert.equal(res25.purgedCount, 1, 'Day 25: 1 purged');
      assert.equal(res25.activeCoupons.length, 1, 'Day 25: 1 active remaining');
      const cat25 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat25.includes('SIM_LONG_25D'), false);

      // Day 30: SIM_EVERGREEN survives indefinitely
      const d30 = new Date(baseDate.getTime() + 30 * 86400 * 1000 + 1000);
      const res30 = syncAndPurgeStorage(d30);
      assert.equal(res30.purgedCount, 0, 'Day 30: 0 purged');
      assert.equal(res30.activeCoupons.length, 1, 'Day 30: 1 active (Evergreen)');
      assert.equal(res30.activeCoupons[0].code, 'SIM_EVERGREEN');
      const cat30 = getCouponsForLocale('es-es').map((c) => c.code);
      assert.equal(cat30.includes('SIM_EVERGREEN'), true, 'Evergreen voucher active at Day 30');
    });

    it('LS-02: Daily step progression (all 31 checkpoints) maintains strict catalog & storage parity', () => {
      const baseDate = new Date('2026-11-01T00:00:00.000Z');

      const initialBatch = [
        { code: 'STEP_1D', expiresAt: '2026-11-02T00:00:00.000Z', store: 'aliexpress' },
        { code: 'STEP_5D', expiresAt: '2026-11-06T00:00:00.000Z', store: 'aliexpress' },
        { code: 'STEP_10D', expiresAt: '2026-11-11T00:00:00.000Z', store: 'aliexpress' },
        { code: 'STEP_20D', expiresAt: '2026-11-21T00:00:00.000Z', store: 'aliexpress' },
        { code: 'STEP_EVER', isEvergreen: true, store: 'aliexpress' }
      ];

      mockStorage.setItem(STORAGE_KEY_CUSTOM_COUPONS, JSON.stringify(initialBatch));

      let lastActiveCount = initialBatch.length;

      for (let day = 0; day <= 30; day++) {
        const currentDate = new Date(baseDate.getTime() + day * 86400 * 1000 + 1000);
        const { activeCoupons } = syncAndPurgeStorage(currentDate);

        // Active coupon count must be monotonically non-increasing
        assert.ok(
          activeCoupons.length <= lastActiveCount,
          `Active count on Day ${day} (${activeCoupons.length}) must be <= previous (${lastActiveCount})`
        );
        lastActiveCount = activeCoupons.length;

        // Catalog count for custom coupons must strictly match storage count
        const catalog = getCouponsForLocale('en-us');
        const customInCatalog = catalog.filter((c) =>
          initialBatch.some((init) => init.code === c.code)
        );

        assert.equal(
          customInCatalog.length,
          activeCoupons.length,
          `Parity mismatch on Day ${day}: storage has ${activeCoupons.length}, catalog has ${customInCatalog.length}`
        );

        // Evergreen must always be present
        const hasEvergreen = customInCatalog.some((c) => c.code === 'STEP_EVER');
        assert.equal(hasEvergreen, true, `Evergreen missing on Day ${day}`);
      }

      assert.equal(lastActiveCount, 1, 'At Day 30 only evergreen coupon remains');
    });
  });
});
