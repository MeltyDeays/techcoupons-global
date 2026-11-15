import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import syncHandler from '../api/sync-coupons.js';
import {
  signAliExpressRequest,
  classifyAliExpressCategory,
  parseAliExpressPromoCodeInfo,
  normalizeAliExpressApiProduct,
  buildFeedCountrySchedule
} from '../src/data/affiliateClients.js';
import { parseAndValidateFeed } from '../scripts/ingest-coupons.js';
import { mergeCatalogDeals } from '../scripts/sync-aliexpress-api.js';

describe('Radar Oficial Sincronizador (api/sync-coupons.js)', () => {
  it('SYNC-01: Responde en standby ordenado cuando no hay API keys configuradas', async () => {
    let statusCode = 0;
    let jsonBody = null;

    const req = { headers: {} };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      }
    };

    await syncHandler(req, res);

    assert.equal(statusCode, 200);
    assert.equal(jsonBody.ok, true);
    assert.equal(jsonBody.results.admitad.status, 'STANDBY');
    assert.equal(jsonBody.results.aliexpress.status, 'STANDBY');
    assert.match(jsonBody.message, /Radar en standby/i);
  });

  it('SYNC-02: Rechaza llamada no autorizada si existe CRON_SECRET', async () => {
    process.env.CRON_SECRET = 'secret_test_token_123';
    let statusCode = 0;
    let jsonBody = null;

    const req = { headers: { authorization: 'Bearer wrong_token' } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      }
    };

    await syncHandler(req, res);

    assert.equal(statusCode, 401);
    assert.equal(jsonBody.ok, false);
    assert.equal(jsonBody.error, 'Unauthorized cron trigger');

    delete process.env.CRON_SECRET;
  });

  it('SYNC-03: Firma requests de AliExpress correctamente con HMAC-SHA256 en mayúsculas', () => {
    const apiName = '/aliexpress/affiliate/featuredpromo/get';
    const params = {
      app_key: '12345678',
      format: 'json',
      timestamp: '1700000000000',
      v: '2.0'
    };
    const secret = 'my_test_secret_key';

    const signature = signAliExpressRequest(apiName, params, secret, 'sha256');

    assert.equal(typeof signature, 'string');
    assert.equal(signature, signature.toUpperCase(), 'La firma debe ser estrictamente en mayúsculas');
    assert.equal(signature.length, 64, 'SHA-256 en hex debe tener 64 caracteres');
  });

  it('SYNC-04: Advierte si falta ALI_APP_SECRET cuando solo se provee ALI_APP_KEY', async () => {
    process.env.ALI_APP_KEY = 'test_app_key';
    delete process.env.ALI_APP_SECRET;

    let statusCode = 0;
    let jsonBody = null;

    const req = { headers: {} };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      }
    };

    await syncHandler(req, res);

    assert.equal(statusCode, 200);
    assert.equal(jsonBody.results.aliexpress.status, 'MISSING_SECRET');

    delete process.env.ALI_APP_KEY;
  });

  it('SYNC-05: Normaliza productos y códigos promo de AliExpress API multi-país y global', () => {
    const sampleApiProduct = {
      product_id: 999888,
      product_title: 'SmallRig RGB Video Light',
      product_main_image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/test.jpg',
      promotion_link: 'https://s.click.aliexpress.com/e/test123',
      target_original_price: '100.00',
      target_sale_price: '45.00',
      target_sale_price_currency: 'USD',
      discount: '55%',
      first_level_category_name: 'Consumer Electronics',
      second_level_category_name: 'Camera & Photo',
      promo_code_info: {
        promo_code: 'TESTCODE1',
        code_value: 'On order over USD 12.0 , get USD 1.00 off',
        code_mini_spend: '12.0',
        code_quantity: '500',
        code_availabletime_start: '2026-10-31 00:00:00',
        code_availabletime_end: '2026-12-30 23:59:59'
      }
    };

    const parsedCode = parseAliExpressPromoCodeInfo(sampleApiProduct.promo_code_info);
    assert.equal(parsedCode.code, 'TESTCODE1');
    assert.equal(parsedCode.numericValue, 1);
    assert.equal(parsedCode.codeValueText, 'USD 1.00');
    assert.equal(parsedCode.minSpendText, 'USD 12.00');

    const normalized = normalizeAliExpressApiProduct(sampleApiProduct, { countries: ['mx'] });
    assert.equal(normalized.category, 'tech-gadgets');
    assert.deepEqual(normalized.countries, ['mx']);
    assert.equal(normalized['Code Name'], 'TESTCODE1');

    assert.equal(classifyAliExpressCategory({ first_level_category_name: 'Home & Garden', second_level_category_name: 'Pet Products' }), 'mascotas');
    assert.equal(classifyAliExpressCategory({ first_level_category_name: 'Consumer Electronics', second_level_category_name: 'Games & Accessories' }), 'perifericos-gaming');

    const schedule = buildFeedCountrySchedule();
    assert.ok(schedule.some((s) => s.countries.includes('global')));
    assert.ok(schedule.some((s) => s.countries.includes('mx')));

    const { valid } = parseAndValidateFeed([{
      ...sampleApiProduct.promo_code_info,
      product_id: sampleApiProduct.product_id,
      product_title: sampleApiProduct.product_title,
      code_promotionurl: sampleApiProduct.promotion_link,
      countries: ['global'],
      category: 'tech-gadgets'
    }], 'aliexpress');
    assert.equal(valid.length, 1);
    assert.equal(valid[0].discountValue, 1);
    assert.equal(valid[0].minSpend, 12);
    assert.match(valid[0].notes.es, /SmallRig RGB Video Light/);
  });

  it('SYNC-06: mergeCatalogDeals preserva catálogo base global y combina países sin duplicar', () => {
    const existing = [{ ProductId: '100', 'Code Name': 'BASE1', dealType: 'featured' }];
    const fresh = [
      { ProductId: '100', 'Code Name': 'NEW1', countries: ['mx'], dealType: 'api-regional' },
      { ProductId: '200', 'Code Name': '', countries: ['br'], dealType: 'api-regional' }
    ];
    const merged = mergeCatalogDeals(existing, fresh);
    assert.equal(merged.length, 2);
    assert.equal(merged[0]['Code Name'], 'BASE1');
    assert.deepEqual(merged[0].countries, ['global']);
    assert.deepEqual(merged[1].countries, ['br']);
  });
});
