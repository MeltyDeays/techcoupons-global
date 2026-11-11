import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import radarHandler from '../api/ai-radar.js';
import { LOCALES, getLocaleConfig } from '../src/config/locales.js';
import { autoPublishAiCoupons, getCouponsForLocale, getBaseCouponCodes } from '../src/data/couponsGenerator.js';
import { ANNUAL_EVENTS_SCHEDULE, getActiveOrNextEvent } from '../src/data/eventsCalendar.js';
import { resolveCouponExpiration, purgeExpiredCoupons } from '../src/data/couponLifecycle.js';
import { installMockStorage } from './helpers/mockStorage.js';

describe('Challenger 2: Adversarial Audit Suite (M3 Phase 2)', () => {
  let originalFetch;
  let mockStorage;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    mockStorage = installMockStorage();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function createMockRes() {
    const headers = {};
    let statusCode = 200;
    let jsonBody = null;
    let ended = false;

    return {
      headers,
      getStatusCode: () => statusCode,
      getJson: () => jsonBody,
      isEnded: () => ended,
      setHeader(k, v) { headers[k] = v; },
      status(code) { statusCode = code; return this; },
      json(data) { jsonBody = data; return this; },
      end() { ended = true; return this; }
    };
  }

  // ============================================================================
  // SECTION 1: GEMINI AI RADAR ENDPOINT ADVERSARIAL RESILIENCE
  // ============================================================================
  describe('1. Gemini AI Radar Endpoint Adversarial Resilience', () => {
    it('1.1: Quota 429 exhaustion across all 4 cascaded models falls back to calendar engine', async () => {
      let attempts = 0;
      globalThis.fetch = async () => {
        attempts++;
        return {
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({ error: { message: 'Resource has been exhausted (e.g. check quota)' } })
        };
      };

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200, 'Must return 200 fallback on quota exhaustion');
      assert.equal(attempts, 4, 'Must attempt all 4 cascade models before falling back');
      const data = res.getJson();
      assert.equal(data.ok, true);
      assert.equal(data.modelUsed, 'fallback-verified-calendar-engine');
      assert.equal(data.fallbackReason, 'quota_exhausted_or_unavailable');
      assert.ok(data.data.discoveredCoupons.length >= 8, 'Fallback must supply at least 8 verified coupons');
    });

    it('1.2: Cascaded recovery when first 2 models fail (500, 429) and 3rd model succeeds', async () => {
      let callCount = 0;
      globalThis.fetch = async (url, options) => {
        callCount++;
        const body = JSON.parse(options.body);
        if (body.model === 'antigravity/gemini-3.1-pro') {
          return { ok: false, status: 500, statusText: 'Internal Server Error' };
        }
        if (body.model === 'combo/free') {
          return { ok: false, status: 429, statusText: 'Rate Limited' };
        }
        if (body.model === 'qwen/qwen3.8-27b') {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{
                message: {
                  content: JSON.stringify({
                    scanDate: '2026-11-11',
                    nextScanDays: 7,
                    activeEvents: {
                      aliexpress: { name: '11.11', window: 'Nov', summary: 'Ali' },
                      temu: { name: '11.11', window: 'Nov', summary: 'Temu' }
                    },
                    upcomingEvents: [],
                    discoveredCoupons: [
                      {
                        store: 'aliexpress',
                        code: 'QWEN_RESCUE_01',
                        category: 'tech-gadgets',
                        discountPct: 20,
                        discountUsd: 15,
                        minSpendUsd: 60,
                        title: 'Third Model Rescue Coupon'
                      }
                    ]
                  })
                }
              }]
            })
          };
        }
        return { ok: false, status: 503 };
      };

      const res = createMockRes();
      await radarHandler({ method: 'POST' }, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(callCount, 3, 'Must stop cascade at the 3rd model');
      const data = res.getJson();
      assert.equal(data.ok, true);
      assert.equal(data.modelUsed, 'qwen/qwen3.8-27b');
      assert.equal(data.data.discoveredCoupons[0].code, 'QWEN_RESCUE_01');
    });

    it('1.3: AbortController 8s timeout triggers fallback without hanging or crashing', async () => {
      globalThis.fetch = async (url, options) => {
        assert.ok(options.signal, 'options.signal must be provided');
        const abortErr = new Error('The operation was aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
      };

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      const data = res.getJson();
      assert.equal(data.ok, true);
      assert.equal(data.modelUsed, 'fallback-verified-calendar-engine');
    });

    it('1.4: Network drop (TypeError: fetch failed) caught with zero unhandled rejections', async () => {
      globalThis.fetch = async () => {
        throw new TypeError('fetch failed: ECONNREFUSED');
      };

      const res = createMockRes();
      await assert.doesNotReject(async () => {
        await radarHandler({ method: 'GET' }, res);
      });

      assert.equal(res.getStatusCode(), 200);
      const data = res.getJson();
      assert.equal(data.ok, true);
      assert.equal(data.modelUsed, 'fallback-verified-calendar-engine');
    });

    it('1.5: Deeply nested trailing commas rescued successfully', async () => {
      const payloadWithTrailingCommas = `{
        "scanDate": "2026-11-11",
        "nextScanDays": 7,
        "activeEvents": {
          "aliexpress": { "name": "Event", "window": "W", "summary": "S", },
          "temu": { "name": "Event", "window": "W", "summary": "S", },
        },
        "upcomingEvents": [
          { "name": "BF", "dates": "Nov", "stores": "Ali", },
        ],
        "discoveredCoupons": [
          {
            "store": "aliexpress",
            "code": "TRAILING_COMMA_NESTED",
            "category": "moda-ropa",
            "discountPct": 30,
            "discountUsd": 20,
            "minSpendUsd": 80,
            "title": "Nested trailing comma coupon",
          },
        ],
      }`;

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: payloadWithTrailingCommas } }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      const data = res.getJson();
      assert.equal(data.ok, true);
      const coupon = data.data.discoveredCoupons.find(c => c.code === 'TRAILING_COMMA_NESTED');
      assert.ok(coupon, 'Must successfully rescue coupon despite trailing commas in objects and arrays');
      assert.equal(coupon.discountPct, 30);
    });

    it('1.6: Truncated JSON stream rescue salvages valid coupons before the cutoff point', async () => {
      const truncatedStream = `{
        "scanDate": "2026-11-11",
        "nextScanDays": 7,
        "activeEvents": {
          "aliexpress": { "name": "11.11", "window": "Nov", "summary": "Sale" },
          "temu": { "name": "11.11", "window": "Nov", "summary": "Sale" }
        },
        "upcomingEvents": [],
        "discoveredCoupons": [
          {
            "store": "aliexpress",
            "code": "TRUNC_SALVAGE_1",
            "category": "tech-gadgets",
            "discountPct": 25,
            "discountUsd": 15,
            "minSpendUsd": 60,
            "title": "Complete coupon before stream cutoff"
          },
          {
            "store": "temu",
            "code": "UNFINISHED_CUTOFF_CO`;

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: truncatedStream } }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      const data = res.getJson();
      assert.equal(data.ok, true);
      const coupon = data.data.discoveredCoupons.find(c => c.code === 'TRUNC_SALVAGE_1');
      assert.ok(coupon, 'Must salvage TRUNC_SALVAGE_1 before stream cutoff');
    });

    it('1.7: Unsalvageable corrupted stream falls back safely to calendar engine', async () => {
      const garbageResponses = [
        'Rate limit reached. Please contact support.',
        '<html><body>502 Bad Gateway</body></html>',
        '{"discoveredCoupons": "this is not an array"}',
        '{"discoveredCoupons": []}',
        ''
      ];

      for (const garbage of garbageResponses) {
        globalThis.fetch = async () => ({
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: garbage } }]
          })
        });

        const res = createMockRes();
        await radarHandler({ method: 'GET' }, res);

        assert.equal(res.getStatusCode(), 200);
        const data = res.getJson();
        assert.equal(data.ok, true);
        assert.equal(data.modelUsed, 'fallback-verified-calendar-engine');
      }
    });

    it('1.8: CORS and HTTP OPTIONS preflight handling', async () => {
      const res = createMockRes();
      await radarHandler({ method: 'OPTIONS' }, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(res.isEnded(), true);
      assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
      assert.ok(res.headers['Access-Control-Allow-Methods'].includes('OPTIONS'));
    });
  });

  // ============================================================================
  // SECTION 2: 10 NON-TEMU MARKETS CONSISTENCY & LEAK PREVENTION
  // ============================================================================
  describe('2. Multi-Market Consistency & 10 Non-Temu Countries Leak Prevention', () => {
    const NON_TEMU_CODES = [
      'es-ni', 'es-cr', 'es-gt', 'es-sv', 'es-hn', 'es-ar', 'es-ec', 'es-py', 'es-bo', 'vi-vn'
    ];
    const NON_TEMU_SHORT_CODES = [
      'ni', 'cr', 'gt', 'sv', 'hn', 'ar', 'ec', 'py', 'bo', 'vn'
    ];

    it('2.1: Exactly 10 markets in LOCALES configuration have stores: [aliexpress] only', () => {
      const noTemuLocales = LOCALES.filter(l => !l.stores.includes('temu'));
      assert.equal(noTemuLocales.length, 10, 'Must have exactly 10 non-Temu markets');

      const foundCodes = noTemuLocales.map(l => l.code).sort();
      const expectedCodes = [...NON_TEMU_CODES].sort();
      assert.deepEqual(foundCodes, expectedCodes, 'The 10 non-Temu markets must match exact list');

      // Verify all other 56 markets support both temu and aliexpress
      const temuLocales = LOCALES.filter(l => l.stores.includes('temu'));
      assert.equal(temuLocales.length, 56, 'Remaining 56 markets must support Temu');
      for (const loc of temuLocales) {
        assert.ok(loc.stores.includes('aliexpress'), `Market ${loc.code} must support aliexpress`);
      }
    });

    it('2.2: Online model path strips Temu coupons for all 10 non-Temu markets', async () => {
      // Model ignores instructions and returns Temu coupons
      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify({
                scanDate: '2026-11-11',
                nextScanDays: 7,
                activeEvents: { aliexpress: { name: 'A', window: 'W', summary: 'S' }, temu: { name: 'T', window: 'W', summary: 'S' } },
                upcomingEvents: [],
                discoveredCoupons: [
                  { store: 'temu', code: 'TEMU_LEAK_01', category: 'moda-ropa', discountPct: 30, discountUsd: 15, minSpendUsd: 50, title: 'Temu Leak' },
                  { store: 'aliexpress', code: 'ALI_CLEAN_01', category: 'tech-gadgets', discountPct: 20, discountUsd: 10, minSpendUsd: 40, title: 'Ali Clean' }
                ]
              })
            }
          }]
        })
      });

      for (const country of [...NON_TEMU_CODES, ...NON_TEMU_SHORT_CODES]) {
        const res = createMockRes();
        await radarHandler({ method: 'GET', query: { country } }, res);

        const data = res.getJson();
        assert.equal(data.ok, true);
        const temuCoupons = data.data.discoveredCoupons.filter(c => c.store === 'temu');
        assert.equal(
          temuCoupons.length,
          0,
          `Online path leaked Temu coupon for non-Temu country: ${country}`
        );
        const aliCoupons = data.data.discoveredCoupons.filter(c => c.store === 'aliexpress');
        assert.ok(aliCoupons.length > 0, `AliExpress coupons must remain intact for ${country}`);
      }
    });

    it('2.3: Fallback engine returns 8 AliExpress coupons and 0 Temu coupons for all 10 non-Temu markets', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 503 });

      for (const country of [...NON_TEMU_CODES, ...NON_TEMU_SHORT_CODES]) {
        const res = createMockRes();
        await radarHandler({ method: 'GET', query: { country } }, res);

        const data = res.getJson();
        const coupons = data.data.discoveredCoupons;
        const temuCount = coupons.filter(c => c.store === 'temu').length;
        const aliCount = coupons.filter(c => c.store === 'aliexpress').length;

        assert.equal(temuCount, 0, `Fallback leaked Temu coupon for ${country}`);
        assert.equal(aliCount, 8, `Fallback must provide 8 AliExpress coupons for ${country}`);
      }
    });

    it('2.4: getCouponsForLocale guarantees 0 Temu coupons across all 10 non-shipping markets even with injected custom coupons', () => {
      // Ingest mixed coupons
      autoPublishAiCoupons([
        { store: 'temu', code: 'INJECTED_TEMU_1', title: 'Injected Temu Deal 1' },
        { store: 'temu', code: 'INJECTED_TEMU_2', title: 'Injected Temu Deal 2' },
        { store: 'aliexpress', code: 'INJECTED_ALI_1', title: 'Injected Ali Deal 1' }
      ]);

      for (const mCode of NON_TEMU_CODES) {
        const catalog = getCouponsForLocale(mCode);
        const temuCoupons = catalog.filter(c => c.store === 'temu');
        assert.equal(
          temuCoupons.length,
          0,
          `Catalog in ${mCode} must not contain any Temu coupon, found: ${temuCoupons.map(c => c.code)}`
        );
      }
    });

    it('2.5: SEO Guide Title and FAQ copy for non-Temu markets contain no false Temu claims', () => {
      for (const mCode of NON_TEMU_CODES) {
        const config = getLocaleConfig(mCode);
        const seoTitle = config.dict.seoGuideTitle;
        assert.ok(
          !seoTitle.includes('Temu &') && !seoTitle.includes('Temu y') && !seoTitle.includes('Temu +'),
          `SEO title in non-Temu market ${mCode} should not claim Temu partnership: "${seoTitle}"`
        );

        // FAQs mentioning Temu in non-Temu markets must clarify that Temu has no direct shipping or requires casillero
        const misleadingTemuFaqs = (config.dict.faqs || []).filter((f) => {
          const mentionsTemu = f.q.toLowerCase().includes('temu') || f.a.toLowerCase().includes('temu');
          if (!mentionsTemu) return false;
          const clarifiesNoShippingOrCasillero =
            f.a.toLowerCase().includes('casillero') ||
            f.a.toLowerCase().includes('no ofrece envíos directos') ||
            f.a.toLowerCase().includes('no realiza envíos directos') ||
            f.a.toLowerCase().includes('miami');
          return !clarifiesNoShippingOrCasillero;
        });
        assert.equal(
          misleadingTemuFaqs.length,
          0,
          `Market ${mCode} should not have misleading Temu FAQs: ${misleadingTemuFaqs.map(f => f.q)}`
        );
      }
    });
  });

  // ============================================================================
  // SECTION 3: 27-LANGUAGE AND 66-MARKET TITLE PRESERVATION
  // ============================================================================
  describe('3. 27-Language and 66-Market Title Preservation', () => {
    it('3.1: Plain string AI title is 100% preserved in every one of the 66 locales', () => {
      const discoveredTitle = '🌟 NextGen Smart Watch Ultra Pro Series 9 - 2026 Edition';
      autoPublishAiCoupons([{
        store: 'aliexpress',
        code: 'WATCH_TITLE_TEST',
        title: discoveredTitle,
        discountPct: 35,
        discountUsd: 25,
        minSpendUsd: 80
      }]);

      for (const loc of LOCALES) {
        const catalog = getCouponsForLocale(loc.code);
        const coupon = catalog.find(c => c.code === 'WATCH_TITLE_TEST');
        assert.ok(coupon, `Coupon must be present in locale ${loc.code}`);
        assert.equal(
          coupon.title,
          discoveredTitle,
          `Title in locale ${loc.code} (lang: ${loc.lang}) must match discovered title exactly`
        );
      }
    });

    it('3.2: Multilingual object title serves explicit languages and falls back gracefully for the rest', () => {
      const multilingualItem = {
        store: 'aliexpress',
        code: 'MULTI_TEST_02',
        title: {
          en: 'Super Ergonomic Gaming Chair',
          es: 'Silla Gamer Ergonómica Premium',
          fr: 'Fauteuil Gamer Ergonomique Pro',
          de: 'Ergonomischer Premium-Gaming-Stuhl'
        }
      };

      autoPublishAiCoupons([multilingualItem]);

      // Direct matches
      assert.equal(getCouponsForLocale('en-us').find(c => c.code === 'MULTI_TEST_02')?.title, 'Super Ergonomic Gaming Chair');
      assert.equal(getCouponsForLocale('es-es').find(c => c.code === 'MULTI_TEST_02')?.title, 'Silla Gamer Ergonómica Premium');
      assert.equal(getCouponsForLocale('fr-fr').find(c => c.code === 'MULTI_TEST_02')?.title, 'Fauteuil Gamer Ergonomique Pro');
      assert.equal(getCouponsForLocale('de-de').find(c => c.code === 'MULTI_TEST_02')?.title, 'Ergonomischer Premium-Gaming-Stuhl');

      // Fallback languages (should get en or es or raw)
      const jaCoupon = getCouponsForLocale('ja-jp').find(c => c.code === 'MULTI_TEST_02');
      assert.ok(jaCoupon);
      assert.ok(
        jaCoupon.title === 'Super Ergonomic Gaming Chair' || jaCoupon.title === 'Silla Gamer Ergonómica Premium',
        `Japanese locale should fall back cleanly, got: ${jaCoupon.title}`
      );
    });

    it('3.3: Title preservation survives coupon storage cycle (serialize -> deserialize)', () => {
      const originalTitle = '⚡ Drone 4K GPS Dual Camera Brushless Motor';
      autoPublishAiCoupons([{
        store: 'aliexpress',
        code: 'DRONE_CYCLE_01',
        title: originalTitle
      }]);

      // Read raw localStorage
      const raw = mockStorage.getItem('ecosistema_b_custom_coupons_v1');
      assert.ok(raw);
      const parsed = JSON.parse(raw);
      const item = parsed.find(c => c.code === 'DRONE_CYCLE_01');
      assert.ok(item);
      assert.ok(item.productName, 'Serialized coupon must have productName mapping');
      assert.equal(item.productName._raw, originalTitle);

      // Hydrate via getCouponsForLocale in Arabic (RTL) and Japanese
      const arCoupon = getCouponsForLocale('ar-ae').find(c => c.code === 'DRONE_CYCLE_01');
      assert.equal(arCoupon?.title, originalTitle);

      const jaCoupon = getCouponsForLocale('ja-jp').find(c => c.code === 'DRONE_CYCLE_01');
      assert.equal(jaCoupon?.title, originalTitle);
    });
  });

  // ============================================================================
  // SECTION 4: UTC SEASONAL CALENDAR DETERMINISM & BOUNDARIES
  // ============================================================================
  describe('4. UTC Seasonal Calendar Transitions & Expiration Determinism', () => {
    it('4.1: Deterministic transitions across all 7 annual events in UTC', () => {
      const testCases = [
        // 11.11 Singles Day
        { date: '2026-11-01T00:00:00Z', expectedId: '11-11-singles-day', expectedStatus: 'LIVE' },
        { date: '2026-11-18T23:59:59Z', expectedId: '11-11-singles-day', expectedStatus: 'LIVE' },

        // Black Friday & Cyber Monday
        { date: '2026-11-19T00:00:00Z', expectedId: 'black-friday-cyber-monday', expectedStatus: 'LIVE' },
        { date: '2026-12-03T23:59:59Z', expectedId: 'black-friday-cyber-monday', expectedStatus: 'LIVE' },

        // Choice Day December (Dec 4 to 7)
        { date: '2026-12-04T00:00:00Z', expectedId: 'choice-day-monthly', expectedStatus: 'LIVE' },
        { date: '2026-12-07T23:59:59Z', expectedId: 'choice-day-monthly', expectedStatus: 'LIVE' },

        // 12.12 Year End Sale
        { date: '2026-12-08T00:00:00Z', expectedId: '12-12-year-end-sale', expectedStatus: 'LIVE' },
        { date: '2026-12-15T23:59:59Z', expectedId: '12-12-year-end-sale', expectedStatus: 'LIVE' },

        // Gap after 12.12 -> Upcoming Choice Day Jan 1
        { date: '2026-12-16T00:00:00Z', expectedId: 'choice-day-monthly', expectedStatus: 'UPCOMING' },

        // Choice Day January
        { date: '2027-01-01T00:00:00Z', expectedId: 'choice-day-monthly', expectedStatus: 'LIVE' },
        { date: '2027-01-07T23:59:59Z', expectedId: 'choice-day-monthly', expectedStatus: 'LIVE' },

        // Anniversary Sale (Mar 18 to 28)
        { date: '2027-03-18T00:00:00Z', expectedId: 'anniversary-sale', expectedStatus: 'LIVE' },
        { date: '2027-03-28T23:59:59Z', expectedId: 'anniversary-sale', expectedStatus: 'LIVE' },

        // 618 Mid-Year Mega Sale (Jun 12 to 25)
        { date: '2027-06-12T00:00:00Z', expectedId: '618-mid-year-sale', expectedStatus: 'LIVE' },
        { date: '2027-06-25T23:59:59Z', expectedId: '618-mid-year-sale', expectedStatus: 'LIVE' },

        // Back to School (Aug 18 to 28)
        { date: '2027-08-18T00:00:00Z', expectedId: 'back-to-school', expectedStatus: 'LIVE' },
        { date: '2027-08-28T23:59:59Z', expectedId: 'back-to-school', expectedStatus: 'LIVE' }
      ];

      for (const tc of testCases) {
        const ev = getActiveOrNextEvent(new Date(tc.date));
        assert.equal(
          ev.id,
          tc.expectedId,
          `At ${tc.date}, expected event '${tc.expectedId}' but got '${ev.id}'`
        );
        assert.equal(
          ev.status,
          tc.expectedStatus,
          `At ${tc.date}, expected status '${tc.expectedStatus}' but got '${ev.status}'`
        );
      }
    });

    it('4.2: Expiration resolution at exact millisecond boundaries for commercial events', () => {
      const coupon1111 = { id: 'c1111', eventWindowId: '11-11-singles-day' };

      // 1 ms before boundary
      const beforeExp = resolveCouponExpiration(coupon1111, new Date('2026-11-18T23:59:58.999Z'));
      assert.equal(beforeExp.isExpired, false, 'Coupon must NOT be expired 1ms before boundary');
      assert.equal(beforeExp.timeRemainingMs, 1);

      // Exactly at boundary
      const atExp = resolveCouponExpiration(coupon1111, new Date('2026-11-18T23:59:59.000Z'));
      assert.equal(atExp.isExpired, true, 'Coupon MUST be expired at 23:59:59.000Z');
      assert.equal(atExp.timeRemainingMs, 0);

      // 1 ms after boundary
      const afterExp = resolveCouponExpiration(coupon1111, new Date('2026-11-18T23:59:59.001Z'));
      assert.equal(afterExp.isExpired, true);
      assert.equal(afterExp.timeRemainingMs, 0);
    });

    it('4.3: Purge engine cleanses expired event coupons when transitioning across event boundaries', () => {
      const activeCoupons = [
        { id: 'c-1111', eventWindowId: '11-11-singles-day', code: 'CODE_1111' },
        { id: 'c-evergreen', isEvergreen: true, code: 'CODE_EVERGREEN' },
        { id: 'c-bf', eventWindowId: 'black-friday-cyber-monday', code: 'CODE_BF' }
      ];

      // On Nov 18, 11.11 is active
      const resNov18 = purgeExpiredCoupons(activeCoupons, new Date('2026-11-18T12:00:00Z'));
      assert.equal(resNov18.activeCoupons.length, 3, 'All 3 coupons active on Nov 18');
      assert.equal(resNov18.purgedCount, 0);

      // On Nov 19, 11.11 has expired
      const resNov19 = purgeExpiredCoupons(activeCoupons, new Date('2026-11-19T00:00:00Z'));
      assert.equal(resNov19.activeCoupons.length, 2, 'Only evergreen and Black Friday active on Nov 19');
      assert.equal(resNov19.purgedCount, 1);
      assert.equal(resNov19.purgedIds[0], 'c-1111');
    });
  });
});
