import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import syncHandler from '../api/sync-coupons.js';
import { signAliExpressRequest } from '../src/data/affiliateClients.js';

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
});
