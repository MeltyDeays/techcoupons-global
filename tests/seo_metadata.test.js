import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getLocaleConfig, buildRouteSeoMeta, buildStructuredData } from '../src/config/locales.js';
import { INDEXNOW_KEY, submitIndexNow } from '../src/utils/indexnow.js';

describe('SEO Metadata, BreadcrumbList & IndexNow (locales.js / indexnow.js)', () => {
  it('Genera metadatos únicos por ruta, país y categoría sin descripciones duplicadas', () => {
    const mx = getLocaleConfig('es-mx');
    const us = getLocaleConfig('en-us');
    const ni = getLocaleConfig('es-ni');

    const mxHome = buildRouteSeoMeta(mx, { type: 'home', storeFilter: null, slug: null });
    const mxTemu = buildRouteSeoMeta(mx, { type: 'temu', storeFilter: 'temu', slug: null });
    const mxCat = buildRouteSeoMeta(mx, { type: 'category', storeFilter: 'aliexpress', slug: 'tech-gadgets' });
    const usHome = buildRouteSeoMeta(us, { type: 'home', storeFilter: null, slug: null });
    const niHome = buildRouteSeoMeta(ni, { type: 'home', storeFilter: null, slug: null });

    assert.notEqual(mxHome.description, mxTemu.description);
    assert.notEqual(mxHome.description, mxCat.description);
    assert.match(mxTemu.description, /credit777/i);
    assert.match(usHome.ogLocale, /^en_US$/);
    assert.match(mxHome.ogLocale, /^es_MX$/);
    assert.doesNotMatch(niHome.description, /credit777/i);
    assert.ok(mxCat.keywords.includes('MXN'));
  });

  it('Emite BreadcrumbList y FAQPage en rutas de catálogo y guías', () => {
    const mx = getLocaleConfig('es-mx');
    const schemas = buildStructuredData(mx, [], 'https://cuponestech.tech/es-mx/temu/categoria/tech-gadgets', {
      type: 'category',
      storeFilter: 'temu',
      slug: 'tech-gadgets'
    });

    const breadcrumb = schemas.find((s) => s['@type'] === 'BreadcrumbList');
    const faq = schemas.find((s) => s['@type'] === 'FAQPage');

    assert.ok(breadcrumb, 'Debe incluir BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 4);
    assert.ok(faq, 'Debe incluir FAQPage para rutas de catálogo');
  });

  it('Filtra URLs ajenas al host en submitIndexNow sin lanzar error', async () => {
    assert.equal(INDEXNOW_KEY.length, 32);
    const res = await submitIndexNow(['https://otro-dominio.com/foo']);
    assert.equal(res.ok, true);
    assert.equal(res.skipped, true);
    assert.equal(res.submitted, 0);
  });
});
