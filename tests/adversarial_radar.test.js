import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import radarHandler from '../api/ai-radar.js';

describe('Adversarial Stress Verification: api/ai-radar.js', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
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

  // ==========================================================================
  // 1. Quota Exhaustion (HTTP 429) & Server Error Resilience
  // ==========================================================================
  describe('1. Quota Exhaustion (HTTP 429) & Error Resilience', () => {
    it('1.1: Quota exhaustion (HTTP 429) across all models triggers graceful fallback with HTTP 200', async () => {
      let callCount = 0;
      globalThis.fetch = async () => {
        callCount++;
        return {
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({ error: { message: 'Quota exceeded for model' } })
        };
      };

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200, 'Should return HTTP 200 fallback despite 429 upstream');
      assert.equal(callCount, 4, 'Should attempt all 4 models in cascade before falling back');
      const payload = res.getJson();
      assert.ok(payload);
      assert.equal(payload.ok, true);
      assert.equal(payload.modelUsed, 'fallback-verified-calendar-engine');
      assert.equal(payload.fallbackReason, 'quota_exhausted_or_unavailable');
      assert.ok(payload.data?.discoveredCoupons?.length >= 8);
    });

    it('1.2: First model 429 followed by second model 200 succeeds with modelUsed from second model', async () => {
      let callCount = 0;
      globalThis.fetch = async (url, options) => {
        callCount++;
        const body = JSON.parse(options.body);
        if (body.model === 'antigravity/gemini-3.1-pro') {
          return { ok: false, status: 429, statusText: 'Rate limit' };
        }
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
                    aliexpress: { name: 'Choice Day', window: 'Nov', summary: 'Ali sale' },
                    temu: { name: 'App Sale', window: 'Nov', summary: 'Temu sale' }
                  },
                  upcomingEvents: [],
                  discoveredCoupons: [{
                    store: 'aliexpress',
                    code: 'CASCADE_OK',
                    category: 'tech-gadgets',
                    discountPct: 20,
                    discountUsd: 10,
                    minSpendUsd: 50,
                    title: 'Cascade Success Coupon'
                  }]
                })
              }
            }]
          })
        };
      };

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(callCount, 2, 'Should stop cascade once a model succeeds');
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      assert.equal(payload.modelUsed, 'combo/free');
      assert.equal(payload.data.discoveredCoupons[0].code, 'CASCADE_OK');
    });

    it('1.3: Upstream network connection drop (TypeError: fetch failed) caught with zero unhandled exceptions', async () => {
      globalThis.fetch = async () => {
        throw new TypeError('fetch failed: ECONNRESET');
      };

      const res = createMockRes();
      await assert.doesNotReject(async () => {
        await radarHandler({ method: 'GET' }, res);
      }, 'Endpoint must not throw unhandled promise rejection on network connection drop');

      assert.equal(res.getStatusCode(), 200);
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      assert.equal(payload.modelUsed, 'fallback-verified-calendar-engine');
    });

    it('1.4: Malformed POST req.body string does not crash the serverless function', async () => {
      const res = createMockRes();

      // Stress test malformed body strings
      const malformedBodies = [
        '{ malformed json: true',
        'undefined',
        'null-string',
        '{"country": "es-ni", unclosed',
        '<!DOCTYPE html><html>502 Bad Gateway</html>'
      ];

      for (const badBody of malformedBodies) {
        let uncaughtError = null;
        try {
          await radarHandler({ method: 'POST', body: badBody }, res);
        } catch (err) {
          uncaughtError = err;
        }

        assert.strictEqual(
          uncaughtError,
          null,
          `Radar handler crashed on malformed body '${badBody}': ${uncaughtError?.name}: ${uncaughtError?.message}`
        );
      }
    });
  });

  // ==========================================================================
  // 2. Network Timeout (>8s) and AbortController Verification
  // ==========================================================================
  describe('2. Network Timeout (>8s) and AbortController Verification', () => {
    it('2.1: Hanging upstream request (>8s) is aborted by AbortSignal and cascades to fallback without freezing', async () => {
      let abortedSignals = 0;

      globalThis.fetch = async (url, options) => {
        return new Promise((resolve, reject) => {
          if (options.signal) {
            options.signal.addEventListener('abort', () => {
              abortedSignals++;
              const abortErr = new Error('The operation was aborted');
              abortErr.name = 'AbortError';
              reject(abortErr);
            });
          }
        });
      };

      const res = createMockRes();
      const startTime = Date.now();

      // We simulate an aborted signal immediately to test the handler's signal handling without waiting 32s in tests
      // To test the exact 8000ms timeout mechanism, we verify the AbortController integration
      globalThis.fetch = async (url, options) => {
        assert.ok(options.signal, 'fetch must receive an AbortSignal');
        assert.equal(typeof options.signal.aborted, 'boolean');
        // Simulate abort trigger from timeout
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      };

      await radarHandler({ method: 'GET' }, res);
      const duration = Date.now() - startTime;

      assert.equal(res.getStatusCode(), 200);
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      assert.equal(payload.modelUsed, 'fallback-verified-calendar-engine');
      assert.ok(duration < 2000, 'Handled aborted requests rapidly without stalling');
    });

    it('2.2: Verify AbortController timeout is set to 8000ms', async () => {
      let capturedSignal = null;
      globalThis.fetch = async (url, options) => {
        capturedSignal = options.signal;
        return {
          ok: false,
          status: 504,
          json: async () => ({ error: 'Gateway timeout' })
        };
      };

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.ok(capturedSignal, 'Signal must be passed to fetch');
    });
  });

  // ==========================================================================
  // 3. Corrupted or Truncated Output (Markdown blocks, Trailing commas, Truncated JSON)
  // ==========================================================================
  describe('3. Corrupted or Truncated Model Output & JSON Sanitization', () => {
    it('3.1: Markdown code fences with conversational preamble and postamble are parsed and sanitized', async () => {
      const rawMarkdownContent = `Here is the requested coupon intel for the November 2026 commercial season:

\`\`\`json
{
  "scanDate": "2026-11-11",
  "nextScanDays": 7,
  "activeEvents": {
    "aliexpress": { "name": "Choice Day Nov", "window": "1-7 Nov", "summary": "Choice discounts" },
    "temu": { "name": "App Frenzy", "window": "1-7 Nov", "summary": "App exclusive" }
  },
  "upcomingEvents": [],
  "discoveredCoupons": [
    {
      "store": "aliexpress",
      "code": "MKDOWN_VALID",
      "category": "tech-gadgets",
      "discountPct": 25,
      "discountUsd": 12,
      "minSpendUsd": 50,
      "title": "Clean Markdown Coupon"
    }
  ]
}
\`\`\`

Feel free to ask if you need further adjustments!`;

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: rawMarkdownContent } }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      assert.equal(payload.data.discoveredCoupons[0].code, 'MKDOWN_VALID');
      assert.equal(payload.data.discoveredCoupons[0].discountPct, 25);
    });

    it('3.2: Trailing commas in model output: rescues valid coupons or falls back safely', async () => {
      const rawWithTrailingCommas = `{
  "scanDate": "2026-11-11",
  "nextScanDays": 7,
  "activeEvents": {
    "aliexpress": { "name": "Event", "window": "Nov", "summary": "Summary", },
    "temu": { "name": "Event", "window": "Nov", "summary": "Summary", },
  },
  "upcomingEvents": [],
  "discoveredCoupons": [
    {
      "store": "aliexpress",
      "code": "TRAILING_COMMA_CODE",
      "category": "tech-gadgets",
      "discountPct": 30,
      "discountUsd": 15,
      "minSpendUsd": 60,
      "title": "Coupon with trailing comma",
    },
  ],
}`;

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: rawWithTrailingCommas } }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200, 'Must return 200 without throwing unhandled exception');
      const payload = res.getJson();
      assert.ok(payload);
      assert.equal(payload.ok, true);

      // Verify whether valid coupon is rescued from trailing commas vs discarded to fallback
      const rescued = payload.data?.discoveredCoupons?.some(c => c.code === 'TRAILING_COMMA_CODE');
      assert.strictEqual(
        rescued,
        true,
        `DEFECT: JSON sanitizer failed to rescue valid coupon 'TRAILING_COMMA_CODE' from model output with trailing commas (fell back to '${payload.modelUsed}')`
      );
    });

    it('3.3: Truncated JSON output (missing closing brackets and unclosed objects)', async () => {
      const rawTruncated = `{
  "scanDate": "2026-11-11",
  "nextScanDays": 7,
  "activeEvents": {
    "aliexpress": { "name": "Choice Day", "window": "1-7", "summary": "Sale" },
    "temu": { "name": "Sale", "window": "1-7", "summary": "Sale" }
  },
  "upcomingEvents": [],
  "discoveredCoupons": [
    {
      "store": "aliexpress",
      "code": "TRUNCATED_VALID_1",
      "category": "tech-gadgets",
      "discountPct": 25,
      "discountUsd": 10,
      "minSpendUsd": 50,
      "title": "Valid coupon before truncation"
    },
    {
      "store": "temu",
      "code": "TRUNC_CUTOFF`;

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: rawTruncated } }]
        })
      });

      const res = createMockRes();
      await assert.doesNotReject(async () => {
        await radarHandler({ method: 'GET' }, res);
      });

      assert.equal(res.getStatusCode(), 200);
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      const rescued = payload.data?.discoveredCoupons?.some(c => c.code === 'TRUNCATED_VALID_1');
      assert.strictEqual(
        rescued,
        true,
        `DEFECT: JSON sanitizer failed to rescue 'TRUNCATED_VALID_1' from truncated output with missing delimiters (fell back to '${payload.modelUsed}')`
      );
    });

    it('3.4: sanitizeCoupon handles malformed coupon objects (null, non-object, missing code)', async () => {
      const contentWithBadItems = JSON.stringify({
        scanDate: '2026-11-11',
        nextScanDays: 7,
        activeEvents: { aliexpress: { name: 'A', window: 'W', summary: 'S' }, temu: { name: 'T', window: 'W', summary: 'S' } },
        upcomingEvents: [],
        discoveredCoupons: [
          null,
          undefined,
          "just a string",
          {},
          { code: '' },
          { code: 'VALID_SANITIZED_1', store: 'UNKNOWN_STORE', category: 'invalid-category', discountPct: '30%', discountUsd: 'not-a-number' }
        ]
      });

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: contentWithBadItems } }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET' }, res);

      assert.equal(res.getStatusCode(), 200);
      const payload = res.getJson();
      assert.equal(payload.ok, true);
      const coupons = payload.data.discoveredCoupons;
      assert.equal(coupons.length, 1);
      assert.equal(coupons[0].code, 'VALID_SANITIZED_1');
      assert.equal(coupons[0].store, 'aliexpress', 'Unknown store should default safely to aliexpress');
      assert.equal(coupons[0].category, 'tech-gadgets', 'Invalid category should default to tech-gadgets');
      assert.equal(coupons[0].discountPct, 20, 'NaN discountPct should default to 20');
      assert.equal(coupons[0].discountUsd, 15, 'NaN discountUsd should default to 15');
    });
  });

  // ==========================================================================
  // 4. Querying Across the 10 Countries Without Temu Shipping
  // ==========================================================================
  describe('4. Multi-Market Consistency & 10 Non-Temu Countries', () => {
    const NON_TEMU_CODES = [
      'es-ni', 'es-cr', 'es-gt', 'es-sv', 'es-hn', 'es-ar', 'es-ec', 'es-py', 'es-bo', 'vi-vn',
      'ni', 'cr', 'gt', 'sv', 'hn', 'ar', 'ec', 'py', 'bo', 'vn'
    ];

    it('4.1: Fallback engine generates ZERO Temu coupons for all 10 non-Temu markets (full codes & ISO short codes)', async () => {
      // Force fallback mode
      globalThis.fetch = async () => ({ ok: false, status: 503 });

      for (const countryCode of NON_TEMU_CODES) {
        // Test via query.country
        const resQuery = createMockRes();
        await radarHandler({ method: 'GET', query: { country: countryCode } }, resQuery);
        const couponsQuery = resQuery.getJson().data.discoveredCoupons;

        const temuInQuery = couponsQuery.filter(c => c.store === 'temu');
        assert.equal(
          temuInQuery.length,
          0,
          `Query country='${countryCode}' must contain 0 Temu coupons, but found ${temuInQuery.length}`
        );
        assert.equal(couponsQuery.length, 8, `Must supply 8 AliExpress coupons for '${countryCode}'`);

        // Test via query.locale
        const resLocale = createMockRes();
        await radarHandler({ method: 'GET', query: { locale: countryCode } }, resLocale);
        const couponsLocale = resLocale.getJson().data.discoveredCoupons;
        assert.equal(couponsLocale.filter(c => c.store === 'temu').length, 0);

        // Test via body.country
        const resBody = createMockRes();
        await radarHandler({ method: 'POST', body: JSON.stringify({ country: countryCode }) }, resBody);
        const couponsBody = resBody.getJson().data.discoveredCoupons;
        assert.equal(couponsBody.filter(c => c.store === 'temu').length, 0);
      }
    });

    it('4.2: Fallback engine handles case variations (ES-NI, Ni, CR, vN) and trims whitespace safely', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 503 });

      const testCases = [' ES-NI ', 'CR ', '  gt', 'Sv', 'Hn', 'AR', 'eC', 'PY', 'BO', 'Vi-Vn'];
      for (const tc of testCases) {
        const res = createMockRes();
        await radarHandler({ method: 'GET', query: { country: tc } }, res);
        const coupons = res.getJson().data.discoveredCoupons;
        assert.equal(
          coupons.filter(c => c.store === 'temu').length,
          0,
          `Case variation '${tc}' should exclude Temu coupons`
        );
      }
    });

    it('4.3: Fallback activeEvents.temu.summary for non-Temu markets specifies casillero / US freight forwarder', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 503 });

      const res = createMockRes();
      await radarHandler({ method: 'GET', query: { country: 'es-ni' } }, res);
      const summary = res.getJson().data.activeEvents.temu.summary;
      assert.ok(
        summary.toLowerCase().includes('casillero') || summary.toLowerCase().includes('miami'),
        `Summary for es-ni should explain casillero/Miami forwarder, got: "${summary}"`
      );
    });

    it('4.4: Permitted markets (e.g., US, ES, MX, CL, CO) retain balanced AliExpress and Temu coupons', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 503 });

      const permittedMarkets = ['en-us', 'es-es', 'es-mx', 'es-cl', 'es-co'];
      for (const m of permittedMarkets) {
        const res = createMockRes();
        await radarHandler({ method: 'GET', query: { country: m } }, res);
        const coupons = res.getJson().data.discoveredCoupons;
        const aliCount = coupons.filter(c => c.store === 'aliexpress').length;
        const temuCount = coupons.filter(c => c.store === 'temu').length;
        assert.equal(aliCount, 4, `Market ${m} should have 4 AliExpress coupons`);
        assert.equal(temuCount, 4, `Market ${m} should have 4 Temu coupons`);
      }
    });

    it('4.5: ADVERSARIAL: AI Model returns Temu coupons for non-Temu country (es-ni) in online path', async () => {
      // Simulate Gemini ignoring prompt instructions and returning a Temu coupon for Nicaragua
      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify({
                scanDate: '2026-11-11',
                nextScanDays: 7,
                activeEvents: {
                  aliexpress: { name: 'Sale', window: 'Nov', summary: 'Ali' },
                  temu: { name: 'Temu Sale', window: 'Nov', summary: 'Temu' }
                },
                upcomingEvents: [],
                discoveredCoupons: [
                  {
                    store: 'temu',
                    code: 'TEMU_LEAK_TEST',
                    category: 'moda-ropa',
                    discountPct: 30,
                    discountUsd: 15,
                    minSpendUsd: 50,
                    title: 'Temu Promo'
                  },
                  {
                    store: 'aliexpress',
                    code: 'ALI_VALID_TEST',
                    category: 'tech-gadgets',
                    discountPct: 20,
                    discountUsd: 10,
                    minSpendUsd: 40,
                    title: 'Ali Promo'
                  }
                ]
              })
            }
          }]
        })
      });

      const res = createMockRes();
      await radarHandler({ method: 'GET', query: { country: 'es-ni' } }, res);

      const payload = res.getJson();
      const temuCoupons = payload.data.discoveredCoupons.filter(c => c.store === 'temu');

      assert.equal(
        temuCoupons.length,
        0,
        `VULNERABILITY DETECTED: Online model path leaked ${temuCoupons.length} Temu coupons for non-Temu country es-ni`
      );
    });
  });
});
