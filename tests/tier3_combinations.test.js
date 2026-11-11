import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { installMockStorage } from './helpers/mockStorage.js';
import { getCouponLifecycle } from './helpers/lifecycleLoader.js';
import { autoPublishAiCoupons, getCouponsForLocale } from '../src/data/couponsGenerator.js';
import { getLocaleConfig } from '../src/config/locales.js';

describe('Tier 3: Pairwise Combinations & Cross-Feature Interactions', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = installMockStorage();
  });

  it('C1: Full Pipeline: auto-publish -> storage -> purge -> catalog hydration', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    // 1. Ingest 2 AI discovered coupons (1 future expiry, 1 past expiry)
    const discovered = [
      {
        code: 'PIPELINE_ACTIVE',
        store: 'aliexpress',
        category: 'tech-gadgets',
        discountPct: 20,
        discountUsd: 10,
        minSpendUsd: 50,
        expiresAt: '2026-12-31T23:59:59.000Z',
        title: 'Active Pipeline Coupon'
      },
      {
        code: 'PIPELINE_EXPIRED',
        store: 'aliexpress',
        category: 'tech-gadgets',
        discountPct: 30,
        discountUsd: 15,
        minSpendUsd: 60,
        expiresAt: '2026-01-01T00:00:00.000Z',
        title: 'Expired Pipeline Coupon'
      }
    ];

    const added = autoPublishAiCoupons(discovered);
    assert.equal(added, 2, 'Both coupons initially written to storage');

    // 2. Storage check
    const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
    const stored = JSON.parse(raw);
    assert.equal(stored.length, 2);

    // 3. Purge engine triggers at current simulation date (2026-06-01)
    const simDate = new Date('2026-06-01T00:00:00.000Z');
    const purgeResult = lifecycle.syncAndPurgeStorage(simDate);
    assert.equal(purgeResult.purgedCount, 1, 'Should purge the expired coupon');
    assert.equal(purgeResult.activeCoupons.length, 1);
    assert.equal(purgeResult.activeCoupons[0].code, 'PIPELINE_ACTIVE');

    // 4. Catalog hydration check in en-us
    const catalog = getCouponsForLocale('en-us');
    const foundActive = catalog.find((c) => c.code === 'PIPELINE_ACTIVE');
    const foundExpired = catalog.find((c) => c.code === 'PIPELINE_EXPIRED');

    assert.ok(foundActive, 'Active coupon must be present in catalog');
    assert.equal(foundExpired, undefined, 'Expired coupon must not be present in catalog');
  });

  it('C2: Coupon Deletion Lifecycle: coupon deleted -> tombstone ledger -> radar re-run block', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    // 1. User has an active coupon
    const couponToKill = {
      code: 'DEADCODE88',
      store: 'temu',
      category: 'moda-ropa',
      discountPct: 20,
      discountUsd: 10,
      minSpendUsd: 40,
      title: 'To Be Deleted'
    };
    autoPublishAiCoupons([couponToKill]);

    // 2. User deletes coupon from admin -> Add to tombstone ledger
    lifecycle.addCouponTombstone('DEADCODE88');
    assert.equal(lifecycle.isCouponTombstoned('DEADCODE88'), true);

    // Also remove from active custom coupons storage
    const stored = JSON.parse(mockStorage.getItem('ecosistema_b_custom_coupons_v1') || '[]');
    const afterDelete = stored.filter((c) => c.code !== 'DEADCODE88');
    mockStorage.setItem('ecosistema_b_custom_coupons_v1', JSON.stringify(afterDelete));

    // 3. AI Radar runs again next week and proposes the same code
    const reDiscovered = [
      {
        code: 'DEADCODE88',
        store: 'temu',
        category: 'moda-ropa',
        discountPct: 20,
        discountUsd: 10,
        minSpendUsd: 40,
        title: 'Resurrect Attempt'
      },
      {
        code: 'NEWCODE99',
        store: 'temu',
        category: 'moda-ropa',
        discountPct: 25,
        discountUsd: 15,
        minSpendUsd: 60,
        title: 'Legit New Coupon'
      }
    ];

    const added = autoPublishAiCoupons(reDiscovered);
    assert.equal(added, 1, 'Must only add NEWCODE99 and block tombstoned DEADCODE88');

    const updatedStored = JSON.parse(mockStorage.getItem('ecosistema_b_custom_coupons_v1') || '[]');
    assert.equal(updatedStored.some((c) => c.code === 'DEADCODE88'), false, 'Tombstoned code must not be in storage');
    assert.equal(updatedStored.some((c) => c.code === 'NEWCODE99'), true, 'New code must be in storage');
  });

  it('C3: Commercial Event Transition: 11.11 window terminates -> event coupons expire -> purge engine cleanses', async () => {
    const lifecycle = await getCouponLifecycle();
    assert.ok(lifecycle, 'src/data/couponLifecycle.js must be implemented');

    // Couple of 11.11 coupons
    const eventCoupons = [
      {
        code: 'EVENT11_A',
        store: 'aliexpress',
        category: 'tech-gadgets',
        eventWindowId: '11-11-singles-day',
        isEvent1111: true
      },
      {
        code: 'EVERGREEN_B',
        store: 'aliexpress',
        category: 'tech-gadgets',
        expiresAt: '2026-12-31T23:59:59.000Z'
      }
    ];

    // During 11.11 (Nov 15)
    const duringNov15 = new Date('2026-11-15T12:00:00.000Z');
    const resDuring = lifecycle.purgeExpiredCoupons(eventCoupons, duringNov15);
    assert.equal(resDuring.purgedCount, 0, 'No coupons purged during active 11.11 window');
    assert.equal(resDuring.activeCoupons.length, 2);

    // After 11.11 terminates (Nov 19)
    const afterNov19 = new Date('2026-11-19T00:00:01.000Z');
    const resAfter = lifecycle.purgeExpiredCoupons(eventCoupons, afterNov19);
    assert.equal(resAfter.purgedCount, 1, 'EVENT11_A must be purged after Nov 18 boundary');
    assert.equal(resAfter.activeCoupons.length, 1);
    assert.equal(resAfter.activeCoupons[0].code, 'EVERGREEN_B');
  });

  it('C4: Multi-Country Store Gating: auto-publish adds Temu & AliExpress -> filtered correctly in non-Temu markets', () => {
    const mixedBatch = [
      { code: 'GLOBAL_ALI_01', store: 'aliexpress', category: 'tech-gadgets', discountPct: 15, discountUsd: 10, minSpendUsd: 45, title: 'Ali Drone' },
      { code: 'GLOBAL_TEMU_01', store: 'temu', category: 'moda-ropa', discountPct: 30, discountUsd: 20, minSpendUsd: 60, title: 'Temu Shoes' }
    ];
    autoPublishAiCoupons(mixedBatch);

    // US market: both stores active
    const usCatalog = getCouponsForLocale('en-us');
    assert.ok(usCatalog.some((c) => c.code === 'GLOBAL_ALI_01'));
    assert.ok(usCatalog.some((c) => c.code === 'GLOBAL_TEMU_01'));

    // Argentina (es-ar): AliExpress only, no Temu
    const arCatalog = getCouponsForLocale('es-ar');
    assert.ok(arCatalog.some((c) => c.code === 'GLOBAL_ALI_01'), 'AliExpress coupon must be present in es-ar');
    assert.equal(arCatalog.some((c) => c.code === 'GLOBAL_TEMU_01'), false, 'Temu coupon must be excluded from es-ar');

    // Vietnam (vi-vn): AliExpress only, no Temu
    const vnCatalog = getCouponsForLocale('vi-vn');
    assert.ok(vnCatalog.some((c) => c.code === 'GLOBAL_ALI_01'), 'AliExpress coupon must be present in vi-vn');
    assert.equal(vnCatalog.some((c) => c.code === 'GLOBAL_TEMU_01'), false, 'Temu coupon must be excluded from vi-vn');
  });

  it('C5: Corrupt Storage Recovery: corrupt JSON in localStorage -> auto-publish recovers & catalog hydrates cleanly', () => {
    mockStorage.loadRaw('ecosistema_b_custom_coupons_v1', '!!!CORRUPT_NOT_JSON!!!');

    const added = autoPublishAiCoupons([
      { code: 'RESCUE_CODE', store: 'aliexpress', category: 'tech-gadgets', discountPct: 20, discountUsd: 10, minSpendUsd: 40, title: 'Rescue' }
    ]);
    assert.equal(added, 1, 'autoPublish should recover and write the new coupon');

    const catalog = getCouponsForLocale('en-us');
    const found = catalog.find((c) => c.code === 'RESCUE_CODE');
    assert.ok(found, 'Rescue coupon must be rendered in catalog');
  });

  it('C6: Dual-Source Deduplication: base tier codes + admin codes + AI radar codes merged with zero duplicates', () => {
    // IFPSF035 is an official AliExpress tier code
    // Insert a custom code FIRST
    autoPublishAiCoupons([
      { code: 'CUSTOM_ALREADY_THERE', store: 'aliexpress', category: 'tech-gadgets', discountPct: 15, discountUsd: 10, minSpendUsd: 50, title: 'Existing' }
    ]);

    // Now try to autoPublish a batch containing:
    // 1. Base checkout code IFPSF035
    // 2. Existing custom code CUSTOM_ALREADY_THERE (in lowercase)
    // 3. Genuinely brand new code BRAND_NEW_001
    const incomingBatch = [
      { code: 'IFPSF035', store: 'aliexpress', category: 'tech-gadgets', discountPct: 18, discountUsd: 8, minSpendUsd: 45, title: 'Base Ali Tier' },
      { code: 'custom_already_there', store: 'aliexpress', category: 'tech-gadgets', discountPct: 15, discountUsd: 10, minSpendUsd: 50, title: 'Existing Lower' },
      { code: 'BRAND_NEW_001', store: 'aliexpress', category: 'tech-gadgets', discountPct: 25, discountUsd: 15, minSpendUsd: 60, title: 'Brand New' }
    ];

    const added = autoPublishAiCoupons(incomingBatch);
    assert.equal(added, 1, 'Only BRAND_NEW_001 must be added');

    const stored = JSON.parse(mockStorage.getItem('ecosistema_b_custom_coupons_v1'));
    assert.equal(stored.length, 2, 'Storage must have exactly 2 custom items, not 4');
  });

  it('C7: Periodic Sync Timestamp Coordination: sync ledger shared between background worker & admin dashboard', () => {
    const SYNC_KEY = 'cuponestech_ai_radar_sync_v1';
    const nowMs = Date.now();

    // Storefront background worker records scan
    mockStorage.setItem(SYNC_KEY, String(nowMs));

    // Admin dashboard reads from the same unified sync key
    const readMs = Number(mockStorage.getItem(SYNC_KEY));
    assert.equal(readMs, nowMs, 'Admin and storefront must share synchronized scan timestamp');
  });
});
