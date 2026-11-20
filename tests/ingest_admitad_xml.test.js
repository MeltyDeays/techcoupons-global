import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseAdmitadXml } from '../scripts/ingest-admitad-xml.js';

const now = Date.now();
const startIso = new Date(now - 24 * 60 * 60 * 1000).toISOString();
const endIso = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();

function makeXml(id, promocode) {
  return `
    <coupons>
      <coupon id="${id}">
        <promocode>${promocode}</promocode>
        <name>Promo $5 off $39</name>
        <description>Valid for US orders</description>
        <date_start>${startIso}</date_start>
        <date_end>${endIso}</date_end>
        <discount>$5</discount>
        <regions><region>US</region></regions>
      </coupon>
    </coupons>
  `;
}

describe('parseAdmitadXml — asignación de coupon_scope, source_origin y source_url', () => {
  it('1. Código alfanumérico válido (5-12 chars) -> couponScope = cart, sourceOrigin = admitad', () => {
    const res = parseAdmitadXml(makeXml('900001', 'DEMO5OFF'));
    assert.equal(res.valid.length, 1);
    assert.equal(res.invalid.length, 0);
    assert.equal(res.valid[0].couponScope, 'cart');
    assert.equal(res.valid[0].sourceOrigin, 'admitad');
    assert.ok(res.valid[0].sourceUrl);
    assert.ok(res.valid[0].lastVerifiedAt);
  });

  it('2. Código NOT REQUIRED -> couponScope = campaign, sourceOrigin = admitad', () => {
    const res = parseAdmitadXml(makeXml('900002', 'NOT REQUIRED'));
    assert.equal(res.valid.length, 1);
    assert.equal(res.valid[0].couponScope, 'campaign');
    assert.equal(res.valid[0].sourceOrigin, 'admitad');
  });

  it('3. Código vacío -> couponScope = campaign, sourceOrigin = admitad', () => {
    const res = parseAdmitadXml(makeXml('900003', ''));
    assert.equal(res.valid.length, 1);
    assert.equal(res.valid[0].couponScope, 'campaign');
    assert.equal(res.valid[0].sourceOrigin, 'admitad');
  });

  it('4. Sin source_url -> fila omitida (invalid) y registrada en log', () => {
    const warnings = [];
    const origWarn = console.warn;
    console.warn = (msg) => warnings.push(String(msg));
    try {
      const res = parseAdmitadXml(makeXml('900004', 'DEMO5OFF'), { sourceUrl: '' });
      assert.equal(res.valid.length, 0);
      assert.equal(res.invalid.length, 1);
      assert.ok(res.invalid[0].errors.includes('sourceUrl'));
      assert.ok(warnings.some((w) => w.includes('falta source_url')));
    } finally {
      console.warn = origWarn;
    }
  });
});
