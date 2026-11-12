import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANNUAL_EVENTS_SCHEDULE,
  getActiveOrNextEvent,
  getEventBannerText
} from '../src/data/eventsCalendar.js';

describe('Differentiated Temu vs AliExpress Seasonal Calendar & Event Codes', () => {
  it('E1: Nov 1–18 event schedule provides store-specific tags for AliExpress (11.11) and Temu (Black Friday)', () => {
    const nov11 = new Date(2026, 10, 11, 12, 0, 0);
    const ev = getActiveOrNextEvent(nov11);

    assert.equal(ev.id, '11-11-singles-day');
    assert.equal(ev.codeTag, '11.11 & BLACK FRIDAY');
    assert.equal(ev.codeTagByStore.aliexpress, 'ALIEXPRESS 11.11');
    assert.equal(ev.codeTagByStore.temu, 'TEMU BLACK FRIDAY');
  });

  it('E2: Temu storeFilter displays Black Friday Anticipado messaging & dynamic button', () => {
    const txtEs = getEventBannerText('es', '11-11-singles-day', true, 'temu');
    assert.match(txtEs.title, /Temu Black Friday Anticipado/i);
    assert.match(txtEs.desc, /Black Friday en Temu/i);
    assert.match(txtEs.filter1111Btn, /Ver Cupones Black Friday Temu/i);

    const txtEn = getEventBannerText('en', '11-11-singles-day', true, 'temu');
    assert.match(txtEn.title, /Temu Early Black Friday/i);
    assert.match(txtEn.filter1111Btn, /Filter Temu Black Friday/i);
  });

  it('E3: AliExpress storeFilter displays pure 11.11 Singles Day branding without Temu leaks', () => {
    const txt = getEventBannerText('es', '11-11-singles-day', true, 'aliexpress');
    assert.match(txt.title, /11.11 AliExpress/i);
    assert.ok(!txt.title.toLowerCase().includes('temu'));
    assert.match(txt.filter1111Btn, /Cupones 11.11 AliExpress/i);
  });

  it('E4: Joint store view (storeFilter = null) displays combined 11.11 AliExpress & Black Friday Temu branding', () => {
    const txt = getEventBannerText('es', '11-11-singles-day', true, null);
    assert.match(txt.title, /11.11 AliExpress & Black Friday Temu/i);
    assert.match(txt.filter1111Btn, /Cupones 11.11 y Black Friday/i);
  });

  it('E5: Non-Temu market strips Temu branding even when storeFilter is null', () => {
    const txt = getEventBannerText('es', '11-11-singles-day', false, null);
    assert.ok(!txt.title.toLowerCase().includes('temu'));
    assert.ok(!txt.desc.toLowerCase().includes('temu'));
  });

  it('E6: All major annual seasons distinguish AliExpress and Temu names and tags', () => {
    for (const ev of ANNUAL_EVENTS_SCHEDULE) {
      assert.ok(ev.codeTagByStore.aliexpress, `Missing aliexpress tag for ${ev.id}`);
      assert.ok(ev.codeTagByStore.temu, `Missing temu tag for ${ev.id}`);
    }

    // March: Anniversary vs Spring Sale
    const anniversary = ANNUAL_EVENTS_SCHEDULE.find((e) => e.id === 'anniversary-sale');
    assert.equal(anniversary.codeTagByStore.aliexpress, 'ANIVERSARIO ALIEXPRESS');
    assert.equal(anniversary.codeTagByStore.temu, 'TEMU SPRING SALE');

    // June: 618 vs Summer Mega Sale
    const june618 = ANNUAL_EVENTS_SCHEDULE.find((e) => e.id === '618-mid-year-sale');
    assert.equal(june618.codeTagByStore.aliexpress, 'ALIEXPRESS 618');
    assert.equal(june618.codeTagByStore.temu, 'TEMU SUMMER MEGA SALE');

    // Choice Day vs Super Ahorro
    const choiceDay = ANNUAL_EVENTS_SCHEDULE.find((e) => e.id === 'choice-day-monthly');
    assert.equal(choiceDay.codeTagByStore.aliexpress, 'CHOICE DAY');
    assert.equal(choiceDay.codeTagByStore.temu, 'TEMU SUPER AHORRO');
  });
});
