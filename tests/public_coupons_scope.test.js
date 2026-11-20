import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildActiveCouponsQuery } from '../src/data/dbClient.js';
import { getCouponsForLocale } from '../src/data/couponsGenerator.js';

const now = new Date('2026-11-19T12:00:00Z');
const base = {
  store: 'aliexpress',
  countries: ['us'],
  userType: 'all',
  currency: 'USD',
  discountType: 'fixed',
  discountValue: 5,
  minSpend: 39,
  validFrom: '2026-11-18T00:00:00Z',
  validUntil: '2026-11-25T23:59:59Z',
  channel: 'both',
  sourceUrl: 'https://portals.aliexpress.com',
  lastVerifiedAt: '2026-11-19T00:00:00Z',
  category: null,
  title: { es: 'Descuento', en: 'Discount' }
};

describe('Filtro público de coupon_scope', () => {
  it('buildActiveCouponsQuery incluye coupon_scope = \'cart\' en el WHERE', () => {
    const { sql, values } = buildActiveCouponsQuery({ country: 'us' });
    assert.match(sql, /coupon_scope\s*=\s*'cart'/);
    assert.match(sql, /valid_until\s*>\s*NOW\(\)/);
    assert.deepEqual(values, ['us', 50]);
  });

  it('getCouponsForLocale excluye filas con couponScope = campaign', () => {
    const cartRow = { ...base, id: 'ali-demo-1', code: 'DEMO5', couponScope: 'cart' };
    const campaignRow = { ...base, id: 'ali-campaign-2', code: '', couponScope: 'campaign' };
    const result = getCouponsForLocale('es-us', {}, { coupons: [cartRow, campaignRow], now });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'ali-demo-1');
  });
});
