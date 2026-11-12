import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateCoupon, VERIFIED_COUPONS } from '../src/data/verifiedCoupons.js';
import { getCouponsForLocale } from '../src/data/couponsGenerator.js';
import { parseAndValidateFeed } from '../scripts/ingest-coupons.js';

const NOW = new Date('2026-11-12T12:00:00Z');
const base = {
  id: 'ali-us-test',
  store: 'aliexpress',
  code: 'TEST5',
  countries: ['us'],
  userType: 'all',
  currency: 'USD',
  discountType: 'fixed',
  discountValue: 5,
  minSpend: 39,
  validFrom: '2026-11-10T00:00:00Z',
  validUntil: '2026-11-17T23:59:59Z',
  channel: 'both',
  sourceUrl: 'https://www.aliexpress.us/p/promo-codes',
  lastVerifiedAt: '2026-11-11T20:00:00Z',
  category: null,
  title: { es: 'US$5 en compras de US$39', en: '$5 off $39' }
};
const list = (over = {}) => ({ coupons: [{ ...base, ...over }], now: NOW });

describe('Cupones verificados', () => {
  it('V1: catálogo real arranca sin códigos inventados', () => {
    for (const c of VERIFIED_COUPONS) assert.deepEqual(validateCoupon(c, NOW).filter((e) => e !== 'expired'), []);
  });

  it('V2: cupón completo y vigente es publicable', () => {
    assert.deepEqual(validateCoupon(base, NOW), []);
  });

  it('V3: falta de campos obligatorios bloquea publicación', () => {
    for (const k of ['code', 'countries', 'userType', 'currency', 'sourceUrl', 'validUntil', 'lastVerifiedAt']) {
      assert.ok(validateCoupon({ ...base, [k]: undefined }, NOW).includes(k), k);
    }
  });

  it('V4: vencido, no iniciado o verificación vieja se ocultan', () => {
    assert.ok(validateCoupon({ ...base, validUntil: '2026-11-11T00:00:00Z' }, NOW).includes('expired'));
    assert.ok(validateCoupon({ ...base, validFrom: '2026-11-13T00:00:00Z' }, NOW).includes('not started'));
    assert.ok(validateCoupon({ ...base, lastVerifiedAt: '2026-10-01T00:00:00Z' }, NOW).includes('verification stale'));
  });

  it('V5: solo aparece en el país de la cuenta', () => {
    assert.equal(getCouponsForLocale('en-us', {}, list()).length, 1);
    assert.equal(getCouponsForLocale('es-us', {}, list()).length, 1);
    assert.equal(getCouponsForLocale('es-mx', {}, list()).length, 0);
  });

  it('V6: requisitos visibles en moneda real sin conversión', () => {
    const [c] = getCouponsForLocale('es-us', {}, list({ userType: 'new', channel: 'app' }));
    const txt = c.requirements.join(' | ');
    assert.match(txt, /Solo cuentas nuevas/);
    assert.match(txt, /Solo en la app/);
    assert.match(txt, /39/);
    assert.match(txt, /sin envío/);
    assert.equal(c.expiresAt, base.validUntil);
  });

  it('V7: enlace sin parámetros falsos; cupón de carrito aparece en cualquier categoría', () => {
    const [c] = getCouponsForLocale('en-us', { categoryFilter: 'mascotas' }, list());
    assert.ok(!/[?&](region|code)=/.test(c.affiliateLink));
    assert.equal(getCouponsForLocale('en-us', { categoryFilter: 'mascotas' }, list({ category: 'tech-gadgets' })).length, 0);
  });

  it('V8: Temu se oculta en países sin Temu', () => {
    assert.equal(getCouponsForLocale('es-ni', {}, list({ store: 'temu', countries: ['ni'] })).length, 0);
  });

  it('V9: Cupones con countries: [global] o [*] se publican en todos los países soportados', () => {
    const globalAli = list({ countries: ['global'] });
    assert.equal(getCouponsForLocale('en-us', {}, globalAli).length, 1);
    assert.equal(getCouponsForLocale('es-es', {}, globalAli).length, 1);
    assert.equal(getCouponsForLocale('es-mx', {}, globalAli).length, 1);
    assert.equal(getCouponsForLocale('ja-jp', {}, globalAli).length, 1);

    const [c] = getCouponsForLocale('es-es', {}, globalAli);
    assert.match(c.requirements.join(' '), /Global/i);
  });

  it('V10: Ingestión automática normaliza feeds de Admitad y AliExpress con países globales y regionales', () => {
    const admitadFeed = [
      {
        id: 101,
        promocode: 'ADMITAD_GLOBAL',
        advcampaign_name: 'AliExpress WW',
        regions: ['WW'],
        discount: 10,
        discount_type: 'fixed',
        min_spend: 50,
        date_start: '2026-11-01T00:00:00Z',
        date_end: '2026-11-30T23:59:59Z',
        gotolink: 'https://ad.admitad.com/g/12345/'
      },
      {
        id: 102,
        promocode: 'ADMITAD_ES',
        advcampaign_name: 'AliExpress ES',
        regions: ['ES'],
        discount: 5,
        discount_type: 'fixed',
        min_spend: 25,
        date_start: '2026-11-01T00:00:00Z',
        date_end: '2026-11-30T23:59:59Z',
        gotolink: 'https://ad.admitad.com/g/67890/'
      }
    ];

    const { valid } = parseAndValidateFeed(admitadFeed, 'admitad');
    assert.equal(valid.length, 2);
    assert.deepEqual(valid[0].countries, ['global']);
    assert.deepEqual(valid[1].countries, ['es']);
  });
});
