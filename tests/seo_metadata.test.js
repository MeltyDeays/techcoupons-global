import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getLocaleConfig, buildRouteSeoMeta, buildStructuredData, CATEGORY_SLUGS } from '../src/config/locales.js';
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

  it('Emite BreadcrumbList, FAQPage y Product schema completo en rutas de catálogo', () => {
    const mx = getLocaleConfig('es-mx');
    const sampleCoupon = {
      id: 'ali-mx-test',
      store: 'aliexpress',
      code: 'MXTEST',
      title: 'Descuento test MX',
      appliesToText: 'Válido en todo el carrito MX',
      categoryLabel: 'Tecnología',
      affiliateLink: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
      currencyCode: 'MXN',
      numericPrice: 100,
      validFrom: '2026-11-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z'
    };
    const schemas = buildStructuredData(mx, [sampleCoupon], 'https://cuponestech.tech/es-mx/temu/categoria/tech-gadgets', {
      type: 'category',
      storeFilter: 'temu',
      slug: 'tech-gadgets'
    });

    const breadcrumb = schemas.find((s) => s['@type'] === 'BreadcrumbList');
    const faq = schemas.find((s) => s['@type'] === 'FAQPage');
    const itemList = schemas.find((s) => s['@type'] === 'ItemList');

    assert.ok(breadcrumb, 'Debe incluir BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 4);
    assert.ok(faq, 'Debe incluir FAQPage para rutas de catálogo');
    assert.ok(itemList, 'Debe incluir ItemList en rutas de catálogo');

    const product = itemList.itemListElement[0].item;
    assert.equal(product['@type'], 'Product');
    assert.ok(Array.isArray(product.image) && product.image.length > 0, 'Product debe tener image');
    assert.ok(product.description, 'Product debe tener description');
    assert.ok(product.aggregateRating?.ratingValue, 'Product debe tener aggregateRating');
    assert.ok(product.review?.reviewRating, 'Product debe tener review');
    assert.ok(product.offers?.validFrom, 'Offer debe tener validFrom');
    assert.ok(product.offers?.shippingDetails, 'Offer debe tener shippingDetails');
    assert.ok(product.offers?.hasMerchantReturnPolicy, 'Offer debe tener hasMerchantReturnPolicy');
    assert.deepEqual(product.category, {
      '@type': 'CategoryCode',
      inCodeSet: 'https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt',
      codeValue: '222'
    });
  });

  it('Omite category en cupones sin categoría y emite CategoryCode oficial en deals y categorías', () => {
    const us = getLocaleConfig('en-us');
    const cartCoupon = {
      id: 'ali-us-cart',
      store: 'aliexpress',
      code: 'CART10',
      title: '$10 off cart',
      appliesToText: 'Valid sitewide',
      category: null,
      categoryLabel: null,
      affiliateLink: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
      currencyCode: 'USD',
      numericPrice: 10,
      validFrom: '2026-11-01',
      validUntil: '2026-12-31'
    };

    const homeSchemas = buildStructuredData(us, [cartCoupon], 'https://cuponestech.tech/en-us', { type: 'home' });
    const homeList = homeSchemas.find((s) => s['@type'] === 'ItemList');
    assert.ok(homeList, 'Home debe emitir ItemList');

    const firstProduct = homeList.itemListElement[0].item;
    assert.equal('category' in firstProduct, false, 'Cupón sin categoría debe omitir Product.category');

    const dealProducts = homeList.itemListElement.slice(1).map((el) => el.item);
    assert.ok(dealProducts.length > 0, 'Home debe incluir deals de respaldo');
    for (const dealProduct of dealProducts) {
      assert.equal(dealProduct.category?.['@type'], 'CategoryCode');
      assert.equal(
        dealProduct.category?.inCodeSet,
        'https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt'
      );
      assert.match(String(dealProduct.category?.codeValue || ''), /^\d+$/);
    }

    for (const slug of CATEGORY_SLUGS) {
      const catSchemas = buildStructuredData(
        us,
        [],
        `https://cuponestech.tech/en-us/aliexpress/category/${slug}`,
        { type: 'category', storeFilter: 'aliexpress', slug }
      );
      const catList = catSchemas.find((s) => s['@type'] === 'ItemList');
      assert.ok(catList?.itemListElement?.length > 0, `Categoría ${slug} debe emitir productos`);
      for (const el of catList.itemListElement) {
        assert.equal(el.item.category?.['@type'], 'CategoryCode', `Categoría ${slug} debe emitir CategoryCode`);
        assert.match(String(el.item.category?.codeValue || ''), /^\d+$/);
      }
    }
  });

  it('No emite ItemList de productos en rutas informativas/legales', () => {
    const ko = getLocaleConfig('ko-kr');
    for (const type of ['guides', 'dynamics', 'faq', 'privacy', 'terms', 'about', 'contact']) {
      const schemas = buildStructuredData(ko, [], `https://cuponestech.tech/ko-kr/${type}`, { type });
      const itemList = schemas.find((s) => s['@type'] === 'ItemList');
      assert.equal(itemList, undefined, `Ruta ${type} no debe emitir ItemList`);
    }
  });

  it('Filtra URLs ajenas al host en submitIndexNow sin lanzar error', async () => {
    assert.equal(INDEXNOW_KEY.length, 32);
    const res = await submitIndexNow(['https://otro-dominio.com/foo']);
    assert.equal(res.ok, true);
    assert.equal(res.skipped, true);
    assert.equal(res.submitted, 0);
  });
});
