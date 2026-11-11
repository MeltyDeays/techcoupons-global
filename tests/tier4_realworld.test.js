import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import { installMockFetch } from './helpers/mockFetch.js';
import { getCouponLifecycle } from './helpers/lifecycleLoader.js';
import radarHandler from '../api/ai-radar.js';
import { autoPublishAiCoupons, getCouponsForLocale } from '../src/data/couponsGenerator.js';
import { getLocaleConfig, formatLocalPrice } from '../src/config/locales.js';
import { getActiveOrNextEvent } from '../src/data/eventsCalendar.js';

describe('Tier 4: Real-World End-to-End Scenarios', () => {
  let mockStorage;
  let restoreFetch;

  beforeEach(() => {
    mockStorage = installMockStorage();
    restoreFetch = installMockFetch();
  });

  // --------------------------------------------------------------------------
  // RW1: Multi-Country Shopping Flow across EU, LATAM, US
  // --------------------------------------------------------------------------
  it('RW1: Multi-Country Shopping Flow across EU, LATAM, and North America', () => {
    // 1. Ingest mixed coupon batch
    const incoming = [
      {
        code: 'MULTI_ALI_01',
        store: 'aliexpress',
        category: 'tech-gadgets',
        discountPct: 20,
        discountUsd: 10,
        minSpendUsd: 50,
        title: 'Tech Gadgets 20% Off'
      },
      {
        code: 'MULTI_TEMU_01',
        store: 'temu',
        category: 'moda-ropa',
        discountPct: 30,
        discountUsd: 15,
        minSpendUsd: 45,
        title: 'Temu Fashion 30% Off'
      }
    ];
    autoPublishAiCoupons(incoming);

    // Test markets:
    // 1. US (en-us): USD, rate: 1, stores: both
    const usCatalog = getCouponsForLocale('en-us');
    assert.ok(usCatalog.length > 0);
    const usAli = usCatalog.find((c) => c.code === 'MULTI_ALI_01');
    const usTemu = usCatalog.find((c) => c.code === 'MULTI_TEMU_01');
    assert.ok(usAli, 'AliExpress coupon must be present in US');
    assert.ok(usTemu, 'Temu coupon must be present in US');

    // 2. Spain (es-es): EUR, rate: 0.92, stores: both
    const esCatalog = getCouponsForLocale('es-es');
    assert.ok(esCatalog.length > 0);
    const esAli = esCatalog.find((c) => c.code === 'MULTI_ALI_01');
    assert.ok(esAli, 'AliExpress coupon must be present in Spain');

    // 3. Mexico (es-mx): MXN, rate: 20, stores: both
    const mxCatalog = getCouponsForLocale('es-mx');
    const mxAli = mxCatalog.find((c) => c.code === 'MULTI_ALI_01');
    assert.ok(mxAli, 'AliExpress coupon must be present in Mexico');

    // 4. Argentina (es-ar): ARS, rate: 1050, stores: ONLY aliexpress
    const arCatalog = getCouponsForLocale('es-ar');
    const arAli = arCatalog.find((c) => c.code === 'MULTI_ALI_01');
    const arTemu = arCatalog.find((c) => c.code === 'MULTI_TEMU_01');
    assert.ok(arAli, 'AliExpress coupon must be present in Argentina');
    assert.equal(arTemu, undefined, 'Temu coupon must be completely omitted in Argentina due to shipping policy');

    // 5. Canada (en-ca): CAD, rate: 1.38, stores: both
    const caCatalog = getCouponsForLocale('en-ca');
    const caAli = caCatalog.find((c) => c.code === 'MULTI_ALI_01');
    assert.ok(caAli, 'AliExpress coupon must be present in Canada');
  });

  // --------------------------------------------------------------------------
  // RW2: Black Friday / 11.11 Commercial Sales Calendar Transition
  // --------------------------------------------------------------------------
  it('RW2: Black Friday / 11.11 Seasonal Window Transition & Expiration Flow', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    const coupon11 = {
      id: 'c-1111',
      code: 'SINGLES_DAY_11',
      store: 'aliexpress',
      category: 'tech-gadgets',
      eventWindowId: '11-11-singles-day',
      isEvent1111: true
    };

    const couponBf = {
      id: 'c-bf',
      code: 'BLACK_FRIDAY_26',
      store: 'aliexpress',
      category: 'tech-gadgets',
      eventWindowId: 'black-friday-cyber-monday'
    };

    // Stage 1: Nov 15, 2026 (Peak 11.11)
    const nov15 = new Date('2026-11-15T12:00:00.000Z');
    const evNov15 = getActiveOrNextEvent(nov15);
    assert.equal(evNov15.id, '11-11-singles-day');

    const exp11During = lifecycle.resolveCouponExpiration(coupon11, nov15);
    assert.equal(exp11During.isExpired, false, '11.11 coupon must be active on Nov 15');

    // Stage 2: Nov 19, 2026 (11.11 has ended, Black Friday begins)
    const nov19 = new Date('2026-11-19T00:00:01.000Z');
    const evNov19 = getActiveOrNextEvent(nov19);
    assert.equal(evNov19.id, 'black-friday-cyber-monday');

    const exp11After = lifecycle.resolveCouponExpiration(coupon11, nov19);
    assert.equal(exp11After.isExpired, true, '11.11 coupon must be expired on Nov 19');

    const expBfDuring = lifecycle.resolveCouponExpiration(couponBf, nov19);
    assert.equal(expBfDuring.isExpired, false, 'Black Friday coupon must be active on Nov 19');

    // Stage 3: Dec 4, 2026 (Black Friday has ended)
    const dec4 = new Date('2026-12-04T00:00:01.000Z');
    const expBfAfter = lifecycle.resolveCouponExpiration(couponBf, dec4);
    assert.equal(expBfAfter.isExpired, true, 'Black Friday coupon must be expired on Dec 4');
  });

  // --------------------------------------------------------------------------
  // RW3: 30-Day Coupon Lifecycle Simulation
  // --------------------------------------------------------------------------
  it('RW3: 30-Day Lifecycle Simulation (Ingestion, Renewal, Expiration, Purge)', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    // Day 0: 2026-06-01. AI Radar discovers 3 coupons with 14-day TTL
    const day0 = new Date('2026-06-01T00:00:00.000Z');
    const batchDay0 = [
      { code: 'COUPON_RENEWED', store: 'aliexpress', category: 'tech-gadgets', discoveredAt: day0.toISOString(), ttlDays: 14, title: 'To Renew' },
      { code: 'COUPON_LET_DIE', store: 'temu', category: 'moda-ropa', discoveredAt: day0.toISOString(), ttlDays: 14, title: 'To Expire' },
      { code: 'COUPON_LONG_TTL', store: 'aliexpress', category: 'smart-home', expiresAt: '2026-07-01T00:00:00.000Z', title: 'Evergreen 30d' }
    ];
    autoPublishAiCoupons(batchDay0);

    let stored = JSON.parse(mockStorage.getItem('ecosistema_b_custom_coupons_v1'));
    assert.equal(stored.length, 3);

    // Day 7: 2026-06-08. Radar runs weekly scan and renews COUPON_RENEWED with fresh discoveredAt
    const day7 = new Date('2026-06-08T00:00:00.000Z');
    // Ingest renewal batch
    const renewalBatch = [
      { code: 'COUPON_RENEWED', store: 'aliexpress', category: 'tech-gadgets', discoveredAt: day7.toISOString(), ttlDays: 14, title: 'Renewed' },
      { code: 'COUPON_DAY7_FRESH', store: 'temu', category: 'belleza-cuidado', discoveredAt: day7.toISOString(), ttlDays: 14, title: 'Fresh Day 7' }
    ];
    autoPublishAiCoupons(renewalBatch);

    // Day 16: 2026-06-17. (16 days after Day 0)
    // COUPON_LET_DIE was discovered on Day 0 with 14-day TTL => strictly expired.
    // COUPON_RENEWED was refreshed on Day 7 with 14-day TTL (expires Day 21) => still active.
    // COUPON_LONG_TTL expires on July 1 => still active.
    // COUPON_DAY7_FRESH expires on Day 21 => still active.
    const day16 = new Date('2026-06-17T00:00:00.000Z');
    const purgeDay16 = lifecycle.syncAndPurgeStorage(day16);
    assert.equal(purgeDay16.purgedCount, 1, 'COUPON_LET_DIE must be purged');

    const catalogDay16 = getCouponsForLocale('en-us');
    assert.equal(catalogDay16.some((c) => c.code === 'COUPON_LET_DIE'), false, 'Expired coupon purged from catalog');
    assert.ok(catalogDay16.some((c) => c.code === 'COUPON_LONG_TTL'), 'Evergreen coupon remains active');
  });

  // --------------------------------------------------------------------------
  // RW4: Rapid Consecutive Scans & Tombstone Resilience
  // --------------------------------------------------------------------------
  it('RW4: Rapid Consecutive Scans with Tombstoned Codes Preserve Storage Integrity', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    // Mark 2 codes as permanently deleted/tombstoned
    lifecycle.addCouponTombstone('BANNED_CODE_1');
    lifecycle.addCouponTombstone('BANNED_CODE_2');

    // Simulate 5 rapid consecutive radar sync triggers (e.g. multi-tab or button hammering)
    const candidateList = [
      { code: 'BANNED_CODE_1', store: 'aliexpress', category: 'tech-gadgets', discountPct: 20, discountUsd: 10, minSpendUsd: 40, title: 'Banned 1' },
      { code: 'BANNED_CODE_2', store: 'temu', category: 'moda-ropa', discountPct: 20, discountUsd: 10, minSpendUsd: 40, title: 'Banned 2' },
      { code: 'RAPID_CLEAN_1', store: 'aliexpress', category: 'tech-gadgets', discountPct: 15, discountUsd: 5, minSpendUsd: 25, title: 'Clean 1' },
      { code: 'RAPID_CLEAN_2', store: 'temu', category: 'smart-home', discountPct: 25, discountUsd: 15, minSpendUsd: 50, title: 'Clean 2' }
    ];

    for (let i = 0; i < 5; i++) {
      autoPublishAiCoupons(candidateList);
    }

    const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
    const stored = JSON.parse(raw);

    // Banned codes must NEVER be in storage
    assert.equal(stored.some((c) => c.code === 'BANNED_CODE_1'), false);
    assert.equal(stored.some((c) => c.code === 'BANNED_CODE_2'), false);

    // Clean codes must appear exactly ONCE (zero duplicate spamming)
    const clean1Count = stored.filter((c) => c.code === 'RAPID_CLEAN_1').length;
    const clean2Count = stored.filter((c) => c.code === 'RAPID_CLEAN_2').length;
    assert.equal(clean1Count, 1, 'RAPID_CLEAN_1 must appear exactly once');
    assert.equal(clean2Count, 1, 'RAPID_CLEAN_2 must appear exactly once');
  });

  // --------------------------------------------------------------------------
  // RW5: AI Radar Quota Exhaustion & Fallback Ingestion Flow
  // --------------------------------------------------------------------------
  it('RW5: AI Radar Quota Exhaustion & Fallback Flow Guarantees Catalog Continuity', async () => {
    let capturedResponse = null;
    const res = {
      setHeader() {},
      status() { return this; },
      json(data) { capturedResponse = data; return this; }
    };

    // When the external gateway is offline or 429 rate limited, radarHandler falls back gracefully
    await radarHandler({ method: 'GET' }, res);
    assert.ok(capturedResponse);
    assert.equal(capturedResponse.ok, true);

    const discovered = capturedResponse.data?.discoveredCoupons || [];
    assert.ok(discovered.length >= 8, 'Fallback must supply at least 8 verified coupons');

    // Auto-publish fallback batch into storefront
    const added = autoPublishAiCoupons(discovered);
    assert.ok(added > 0, 'Fallback coupons must be auto-published into catalog');

    // Verify catalog hydrates with fallback coupons
    const catalog = getCouponsForLocale('en-us');
    assert.ok(catalog.length >= discovered.length);
  });

  // --------------------------------------------------------------------------
  // RW6: 27-Language Sample Catalog Rendering Verification
  // --------------------------------------------------------------------------
  it('RW6: Multi-Regional Catalog Rendering across representative languages (AR, JA, ZH, RU, PT)', () => {
    const sampleLocales = ['ar-ae', 'ja-jp', 'zh-tw', 'ru-kz', 'pt-br', 'de-de'];

    for (const loc of sampleLocales) {
      const catalog = getCouponsForLocale(loc);
      assert.ok(catalog.length > 0, `Catalog for ${loc} must contain coupons`);

      for (const coupon of catalog) {
        // Assert every coupon has a non-empty title string
        assert.ok(
          typeof coupon.title === 'string' && coupon.title.trim().length > 0,
          `Coupon ${coupon.code} in locale ${loc} must have a valid title string`
        );
        // Assert every coupon has an appliesTo string
        assert.ok(
          typeof coupon.appliesTo === 'string' && coupon.appliesTo.trim().length > 0,
          `Coupon ${coupon.code} in locale ${loc} must have valid appliesTo string`
        );
      }
    }
  });
});
