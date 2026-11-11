import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import { installMockFetch } from './helpers/mockFetch.js';
import { getCouponLifecycle, referenceResolveExpiration } from './helpers/lifecycleLoader.js';
import radarHandler from '../api/ai-radar.js';
import { LOCALES, getLocaleConfig, formatLocalPrice, CATEGORY_SLUGS } from '../src/config/locales.js';
import { LANGUAGE_PACKS } from '../src/data/i18nDictionaries.js';
import { ANNUAL_EVENTS_SCHEDULE, getActiveOrNextEvent } from '../src/data/eventsCalendar.js';
import { autoPublishAiCoupons, getCouponsForLocale } from '../src/data/couponsGenerator.js';

describe('Tier 1: Feature Coverage (F1, F2, F3, F4)', () => {
  let mockStorage;
  let restoreFetch;

  beforeEach(() => {
    mockStorage = installMockStorage();
    restoreFetch = installMockFetch();
  });

  // --------------------------------------------------------------------------
  // F1: AI Radar Parsing, Security, Deduplication & Tombstones
  // --------------------------------------------------------------------------
  describe('F1: AI Radar & Ingestion Integrity', () => {
    it('F1.1: AI Radar endpoint exports a default async request handler function', () => {
      assert.equal(typeof radarHandler, 'function');
    });

    it('F1.2: AI Radar responds with OPTIONS preflight CORS headers', async () => {
      let statusCalled = null;
      let ended = false;
      const headers = {};

      const req = { method: 'OPTIONS' };
      const res = {
        setHeader(k, v) { headers[k] = v; },
        status(code) { statusCalled = code; return this; },
        end() { ended = true; return this; }
      };

      await radarHandler(req, res);
      assert.equal(headers['Access-Control-Allow-Origin'], '*');
      assert.equal(statusCalled, 200);
      assert.equal(ended, true);
    });

    it('F1.3: AI Radar systemPrompt enforces valid category whitelist matching CATEGORY_SLUGS', async () => {
      // Execute with mock to inspect systemPrompt in fallback
      const headers = {};
      let jsonPayload = null;
      const req = { method: 'GET' };
      const res = {
        setHeader(k, v) { headers[k] = v; },
        status() { return this; },
        json(data) { jsonPayload = data; return this; }
      };

      await radarHandler(req, res);
      assert.ok(jsonPayload);
      assert.equal(jsonPayload.ok, true);
      assert.ok(jsonPayload.data?.discoveredCoupons?.length > 0);
      // Validate that fallback coupons only use recognized category slugs
      for (const coupon of jsonPayload.data.discoveredCoupons) {
        assert.ok(
          CATEGORY_SLUGS.includes(coupon.category),
          `Category ${coupon.category} must be in CATEGORY_SLUGS`
        );
      }
    });

    it('F1.4: AI Radar fallback response provides exactly 8 balanced coupons (4 AliExpress, 4 Temu)', async () => {
      const headers = {};
      let jsonPayload = null;
      const req = { method: 'GET' };
      const res = {
        setHeader(k, v) { headers[k] = v; },
        status() { return this; },
        json(data) { jsonPayload = data; return this; }
      };

      await radarHandler(req, res);
      const coupons = jsonPayload.data.discoveredCoupons;
      assert.equal(coupons.length, 8);
      const aliCount = coupons.filter((c) => c.store === 'aliexpress').length;
      const temuCount = coupons.filter((c) => c.store === 'temu').length;
      assert.equal(aliCount, 4, 'Must have 4 AliExpress coupons');
      assert.equal(temuCount, 4, 'Must have 4 Temu coupons');
    });

    it('F1.5: AI Radar fallback payload includes activeEvents for AliExpress and Temu with non-empty windows', async () => {
      let jsonPayload = null;
      const res = {
        setHeader() {},
        status() { return this; },
        json(data) { jsonPayload = data; return this; }
      };
      await radarHandler({ method: 'GET' }, res);
      const active = jsonPayload.data.activeEvents;
      assert.ok(active.aliexpress?.name && active.aliexpress?.window);
      assert.ok(active.temu?.name && active.temu?.window);
    });

    it('F1.6: autoPublishAiCoupons handles null, undefined, non-array or empty inputs gracefully without throwing', () => {
      assert.equal(autoPublishAiCoupons(null), 0);
      assert.equal(autoPublishAiCoupons(undefined), 0);
      assert.equal(autoPublishAiCoupons([]), 0);
      assert.equal(autoPublishAiCoupons('string'), 0);
      assert.equal(autoPublishAiCoupons({}), 0);
    });

    it('F1.7: autoPublishAiCoupons deduplicates identical codes case-insensitively', () => {
      const batch1 = [
        { code: 'SAVE20NOW', store: 'aliexpress', category: 'tech-gadgets', discountPct: 20, discountUsd: 10, minSpendUsd: 50, title: '20 Off' }
      ];
      const batch2 = [
        { code: 'save20now', store: 'aliexpress', category: 'tech-gadgets', discountPct: 20, discountUsd: 10, minSpendUsd: 50, title: '20 Off Lower' },
        { code: 'FREESHIP10', store: 'temu', category: 'moda-ropa', discountPct: 15, discountUsd: 5, minSpendUsd: 25, title: 'Free Ship' }
      ];

      const added1 = autoPublishAiCoupons(batch1);
      assert.equal(added1, 1, 'First batch should add 1 coupon');

      const added2 = autoPublishAiCoupons(batch2);
      assert.equal(added2, 1, 'Second batch should only add FREESHIP10, skipping duplicate save20now');

      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const list = JSON.parse(raw);
      assert.equal(list.length, 2);
    });

    it('F1.8: autoPublishAiCoupons deduplicates against base AliExpress regional tier codes', () => {
      // IFPSF035 is an official AliExpress tier code from ALIEXPRESS_REGIONAL_TIERS
      const officialCodeCoupon = [
        { code: 'IFPSF035', store: 'aliexpress', category: 'tech-gadgets', discountPct: 18, discountUsd: 8, minSpendUsd: 45, title: 'Official Ali Tier Code' }
      ];
      const added = autoPublishAiCoupons(officialCodeCoupon);
      assert.equal(added, 0, 'Official AliExpress tier codes must be detected in deduplication and not duplicated');
    });

    it('F1.9: Tombstone ledger prevents deleted coupons from resurrecting upon radar re-publication', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      lifecycle.addCouponTombstone('TOMBSTONE-CODE-99');
      assert.equal(lifecycle.isCouponTombstoned('TOMBSTONE-CODE-99'), true);
      assert.equal(lifecycle.isCouponTombstoned('tombstone-code-99'), true, 'Case-insensitive tombstone check');

      const candidate = [
        { code: 'TOMBSTONE-CODE-99', store: 'aliexpress', category: 'tech-gadgets', discountPct: 20, discountUsd: 15, minSpendUsd: 50, title: 'Tombstoned' },
        { code: 'VALID-ACTIVE-01', store: 'temu', category: 'moda-ropa', discountPct: 10, discountUsd: 5, minSpendUsd: 20, title: 'Valid' }
      ];
      const added = autoPublishAiCoupons(candidate);
      assert.equal(added, 1, 'Tombstoned coupon must be skipped during auto-publishing');
    });
  });

  // --------------------------------------------------------------------------
  // F2: Multi-Language (27) & Multi-Country (66) Consistency
  // --------------------------------------------------------------------------
  describe('F2: 66 Markets & 27 Languages Integrity', () => {
    it('F2.1: RAW_MARKETS defines exactly 66 markets spanning 62 ISO country codes and 27 unique languages', () => {
      assert.equal(LOCALES.length, 66, 'Must define exactly 66 locales');
      const uniqueIso = new Set(LOCALES.map((l) => l.iso));
      assert.equal(uniqueIso.size, 62, 'Must span 62 unique country codes');
      const uniqueLang = new Set(LOCALES.map((l) => l.lang));
      assert.equal(uniqueLang.size, 27, 'Must span exactly 27 languages');
    });

    it('F2.2: All 27 language codes exist in LANGUAGE_PACKS dictionary with category translations', () => {
      const expectedLangs = [
        'ar', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he',
        'hu', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro',
        'ru', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'
      ];
      for (const lang of expectedLangs) {
        assert.ok(LANGUAGE_PACKS[lang], `Language pack for ${lang} must exist`);
        assert.ok(LANGUAGE_PACKS[lang].categories, `Language pack for ${lang} must have categories`);
        for (const cat of CATEGORY_SLUGS) {
          assert.ok(LANGUAGE_PACKS[lang].categories[cat], `Language ${lang} must translate category ${cat}`);
        }
      }
    });

    it('F2.3: Exactly 10 specific markets are strictly configured with AliExpress-only (no Temu shipping)', () => {
      const nonTemuMarkets = LOCALES.filter((m) => !(m.stores || []).includes('temu'));
      const nonTemuCodes = nonTemuMarkets.map((m) => m.code).sort();
      const expectedNonTemu = [
        'es-ar', 'es-bo', 'es-cr', 'es-ec', 'es-gt',
        'es-hn', 'es-ni', 'es-py', 'es-sv', 'vi-vn'
      ].sort();
      assert.deepEqual(nonTemuCodes, expectedNonTemu);
      for (const m of nonTemuMarkets) {
        assert.deepEqual(m.stores, ['aliexpress'], `Market ${m.code} must only have aliexpress in stores`);
      }
    });

    it('F2.4: getCouponsForLocale in AliExpress-only countries excludes Temu coupons', () => {
      // In Nicaragua (es-ni)
      const couponsNi = getCouponsForLocale('es-ni');
      assert.ok(couponsNi.length > 0, 'es-ni must have coupons');
      for (const c of couponsNi) {
        assert.equal(c.store, 'aliexpress', `Coupon ${c.code} in es-ni must be aliexpress only`);
      }

      // In Vietnam (vi-vn)
      const couponsVn = getCouponsForLocale('vi-vn');
      assert.ok(couponsVn.length > 0, 'vi-vn must have coupons');
      for (const c of couponsVn) {
        assert.equal(c.store, 'aliexpress', `Coupon ${c.code} in vi-vn must be aliexpress only`);
      }
    });

    it('F2.5: All 66 markets have positive exchange rates and valid currency symbols', () => {
      for (const locale of LOCALES) {
        assert.ok(locale.rate > 0, `Market ${locale.code} rate must be > 0 (was ${locale.rate})`);
        assert.ok(typeof locale.currency === 'string' && locale.currency.trim().length > 0);
        assert.ok(typeof locale.currencyCode === 'string' && locale.currencyCode.length === 3);
      }
    });

    it('F2.6: formatLocalPrice converts USD amounts correctly according to market rate', () => {
      const usConfig = getLocaleConfig('en-us');
      const mxConfig = getLocaleConfig('es-mx');
      const euConfig = getLocaleConfig('es-es');

      const usdPrice = formatLocalPrice(50, usConfig);
      assert.ok(usdPrice.includes('50'), 'USD price should contain 50');

      const mxPrice = formatLocalPrice(50, mxConfig);
      // 50 * 20 = 1000 MXN
      assert.ok(mxPrice.includes('1000') || mxPrice.includes('1,000'), 'MXN price should reflect 50 * 20 = 1000');

      const euPrice = formatLocalPrice(100, euConfig);
      // 100 * 0.92 = 92 EUR
      assert.ok(euPrice.includes('92'), 'EUR price should reflect 100 * 0.92 = 92');
    });

    it('F2.7: AI-discovered coupon titles are preserved across non-EN/ES languages instead of erased', () => {
      const aiCoupon = [
        {
          code: 'TITLETEST99',
          store: 'aliexpress',
          category: 'tech-gadgets',
          discountPct: 25,
          discountUsd: 20,
          minSpendUsd: 80,
          title: 'Special AI Discovered Drone Discount'
        }
      ];
      autoPublishAiCoupons(aiCoupon);

      // Verify in French (fr-fr)
      const frCoupons = getCouponsForLocale('fr-fr');
      const frItem = frCoupons.find((c) => c.code === 'TITLETEST99');
      assert.ok(frItem, 'TITLETEST99 must exist in fr-fr catalog');
      assert.ok(
        frItem.title.includes('Special AI Discovered Drone Discount'),
        `Title in French must retain AI title, got: ${frItem.title}`
      );

      // Verify in German (de-de)
      const deCoupons = getCouponsForLocale('de-de');
      const deItem = deCoupons.find((c) => c.code === 'TITLETEST99');
      assert.ok(
        deItem.title.includes('Special AI Discovered Drone Discount'),
        `Title in German must retain AI title, got: ${deItem.title}`
      );
    });
  });

  // --------------------------------------------------------------------------
  // F3: Deterministic Expiration Policy Engine
  // --------------------------------------------------------------------------
  describe('F3: Deterministic Expiration Policy', () => {
    it('F3.1: Explicit ISO-8601 expiresAt in the past resolves to isExpired: true and timeRemainingMs: 0', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'past-exp-01',
        code: 'PASTEXP',
        expiresAt: '2026-01-01T00:00:00.000Z'
      };
      const refDate = new Date('2026-06-01T00:00:00.000Z');
      const result = lifecycle.resolveCouponExpiration(coupon, refDate);

      assert.equal(result.isExpired, true);
      assert.equal(result.timeRemainingMs, 0);
      assert.equal(result.expiresAt, '2026-01-01T00:00:00.000Z');
    });

    it('F3.2: Explicit ISO-8601 expiresAt in the future resolves to isExpired: false and timeRemainingMs > 0', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'future-exp-01',
        code: 'FUTUREEXP',
        expiresAt: '2026-12-31T23:59:59.000Z'
      };
      const refDate = new Date('2026-06-01T00:00:00.000Z');
      const result = lifecycle.resolveCouponExpiration(coupon, refDate);

      assert.equal(result.isExpired, false);
      assert.ok(result.timeRemainingMs > 0);
      assert.equal(result.expiresAt, '2026-12-31T23:59:59.000Z');
    });

    it('F3.3: 11.11 Event Window mapping resolves expiration to Nov 18, 23:59:59 of current year', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'event-1111-01',
        code: 'SINGLES11',
        eventWindowId: '11-11-singles-day'
      };
      // Active during 11.11
      const activeRef = new Date('2026-11-11T12:00:00.000Z');
      const activeRes = lifecycle.resolveCouponExpiration(coupon, activeRef);
      assert.equal(activeRes.isExpired, false);

      // Expired after 11.11 ends on Nov 18
      const expiredRef = new Date('2026-11-19T00:00:01.000Z');
      const expRes = lifecycle.resolveCouponExpiration(coupon, expiredRef);
      assert.equal(expRes.isExpired, true);
    });

    it('F3.4: Default TTL policy assigns 14-day duration for coupons lacking explicit dates', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupon = {
        id: 'default-ttl-01',
        code: 'TTLCOUPON',
        discoveredAt: '2026-05-01T00:00:00.000Z'
      };
      // Day 10: Still active
      const day10Ref = new Date('2026-05-11T00:00:00.000Z');
      const day10Res = lifecycle.resolveCouponExpiration(coupon, day10Ref);
      assert.equal(day10Res.isExpired, false);

      // Day 15: Expired (exceeds 14 days)
      const day15Ref = new Date('2026-05-16T00:00:00.000Z');
      const day15Res = lifecycle.resolveCouponExpiration(coupon, day15Ref);
      assert.equal(day15Res.isExpired, true);
    });

    it('F3.5: getActiveOrNextEvent correctly identifies active seasonal events from ANNUAL_EVENTS_SCHEDULE', () => {
      // Nov 11 should be 11-11-singles-day
      const nov11 = new Date(2026, 10, 11, 12, 0, 0);
      const evNov = getActiveOrNextEvent(nov11);
      assert.equal(evNov.id, '11-11-singles-day');
      assert.equal(evNov.status, 'LIVE');

      // Nov 25 should be black-friday-cyber-monday
      const nov25 = new Date(2026, 10, 25, 12, 0, 0);
      const evBf = getActiveOrNextEvent(nov25);
      assert.equal(evBf.id, 'black-friday-cyber-monday');
      assert.equal(evBf.status, 'LIVE');
    });
  });

  // --------------------------------------------------------------------------
  // F4: Automated Storage Purging & Catalog Filtering
  // --------------------------------------------------------------------------
  describe('F4: Purge Engine & Catalog Validity', () => {
    it('F4.1: purgeExpiredCoupons filters out expired items from an array and reports accurate purgedCount', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupons = [
        { id: 'c1', code: 'VALID1', expiresAt: '2026-12-31T00:00:00.000Z' },
        { id: 'c2', code: 'EXPIRED1', expiresAt: '2026-01-01T00:00:00.000Z' },
        { id: 'c3', code: 'VALID2', expiresAt: '2026-11-15T00:00:00.000Z' }
      ];
      const refDate = new Date('2026-06-01T00:00:00.000Z');
      const result = lifecycle.purgeExpiredCoupons(coupons, refDate);

      assert.equal(result.purgedCount, 1);
      assert.deepEqual(result.purgedIds, ['c2']);
      assert.equal(result.activeCoupons.length, 2);
      assert.equal(result.activeCoupons.some((c) => c.code === 'EXPIRED1'), false);
    });

    it('F4.2: purgeExpiredCoupons keeps 100% of unexpired coupons untouched', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const coupons = [
        { id: 'c1', code: 'ACT1', expiresAt: '2026-12-01T00:00:00.000Z' },
        { id: 'c2', code: 'ACT2', expiresAt: '2026-12-02T00:00:00.000Z' }
      ];
      const refDate = new Date('2026-06-01T00:00:00.000Z');
      const result = lifecycle.purgeExpiredCoupons(coupons, refDate);

      assert.equal(result.purgedCount, 0);
      assert.equal(result.activeCoupons.length, 2);
    });

    it('F4.3: syncAndPurgeStorage cleanses localStorage and updates persistence with active coupons only', async () => {
      const lifecycle = await getCouponLifecycle();
      assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

      const initialStorage = [
        { id: 'st1', code: 'OLDEXPIRED', expiresAt: '2025-12-31T00:00:00.000Z' },
        { id: 'st2', code: 'NEWACTIVE', expiresAt: '2026-12-31T00:00:00.000Z' }
      ];
      mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify(initialStorage));

      const refDate = new Date('2026-06-01T00:00:00.000Z');
      const syncResult = lifecycle.syncAndPurgeStorage(refDate);

      assert.equal(syncResult.purgedCount, 1);
      assert.equal(syncResult.activeCoupons.length, 1);
      assert.equal(syncResult.activeCoupons[0].code, 'NEWACTIVE');

      const storedRaw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      const stored = JSON.parse(storedRaw);
      assert.equal(stored.length, 1);
      assert.equal(stored[0].code, 'NEWACTIVE');
    });

    it('F4.4: getCouponsForLocale never leaks expired coupons into the rendered catalog', () => {
      const expiredCoupons = [
        {
          id: 'custom-expired-99',
          code: 'GHOSTCODE',
          store: 'aliexpress',
          category: 'tech-gadgets',
          expiresAt: '2025-01-01T00:00:00.000Z',
          discountPct: 50,
          discountUsd: 50,
          minSpendUsd: 100,
          productName: { en: 'Ghost Expired Coupon' }
        }
      ];
      mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify(expiredCoupons));

      const catalog = getCouponsForLocale('en-us');
      const found = catalog.find((c) => c.code === 'GHOSTCODE');
      assert.equal(found, undefined, 'Expired coupon must not be included in getCouponsForLocale catalog');
    });
  });
});
