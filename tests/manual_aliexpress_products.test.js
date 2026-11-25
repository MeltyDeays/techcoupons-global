import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeProtocolUrl,
  parseTrackingLinkInput,
  parseSiteStripeImageInput
} from '../src/utils/sitestripeParser.js';
import {
  slugifyCategory,
  normalizeManualProductPayload,
  mapDbProductToCatalogDeal,
  mergeCatalogDeals,
  collectCatalogCategories
} from '../src/utils/manualCatalog.js';
import { CATEGORY_SLUGS } from '../src/data/i18nDictionaries.js';
import {
  isAllowedAliExpressUrl,
  isPrivateOrReservedIp,
  extractMetadataFromHtml,
  resolveAliExpressMetadata,
  createAliExpressMetadataHandler
} from '../api/aliexpress-metadata.js';
import { copyTextSafe } from '../src/utils/clipboard.js';
import {
  ensureProductsSchema,
  getActiveProductsFromDB,
  upsertProductToDB,
  deleteProductFromDB,
  getCustomCategoriesFromDB,
  upsertCategoryToDB
} from '../src/data/dbClient.js';
import { createProductsHandler, isAuthorizedAdminRequest } from '../api/products.js';
import { resolveAllowedCorsOrigin } from '../api/_adminAuth.js';

const GAMESIR_TRACKING = 'https://s.click.aliexpress.com/e/_c441YyEz';
const GAMESIR_HTML = '<a href="https://s.click.aliexpress.com/e/_c441YyEz target="_blank"><img src="//ae-pic-a1.aliexpress-media.com/kf/S268264e6901247e5a71a957f68c67f74O.png_350x350.png" /></a>';
const GAMESIR_IMAGE_EXPECTED = 'https://ae-pic-a1.aliexpress-media.com/kf/S268264e6901247e5a71a957f68c67f74O.png_350x350.png';

function createMockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: null,
    ended: false,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    }
  };
}

describe('R1: SiteStripe Parser (src/utils/sitestripeParser.js)', () => {
  it('normalizeProtocolUrl convierte // a https:// y rechaza esquemas inseguros o rutas relativas', () => {
    assert.equal(
      normalizeProtocolUrl('  //ae-pic-a1.aliexpress-media.com/kf/img.png  '),
      'https://ae-pic-a1.aliexpress-media.com/kf/img.png'
    );
    assert.equal(normalizeProtocolUrl('https://s.click.aliexpress.com/e/_c441YyEz'), GAMESIR_TRACKING);
    assert.equal(normalizeProtocolUrl('http://example.com/a&amp;b=1'), 'http://example.com/a&b=1');
    assert.equal(normalizeProtocolUrl('javascript:alert(1)'), null);
    assert.equal(normalizeProtocolUrl('data:text/html,<script>'), null);
    assert.equal(normalizeProtocolUrl('vbscript:msgbox(1)'), null);
    assert.equal(normalizeProtocolUrl('/relative/path.png'), null);
    assert.equal(normalizeProtocolUrl(''), null);
  });

  it('parseTrackingLinkInput valida tracking link limpio o con comillas accidentales', () => {
    const clean = parseTrackingLinkInput(`  "${GAMESIR_TRACKING}"  `);
    assert.equal(clean.isValid, true);
    assert.equal(clean.trackingUrl, GAMESIR_TRACKING);

    const invalid = parseTrackingLinkInput('javascript:void(0)');
    assert.equal(invalid.isValid, false);
    assert.equal(invalid.trackingUrl, null);
  });

  it('parseSiteStripeImageInput extrae imagen y tracking de GameSir X5 Lite aun con href sin comilla de cierre', () => {
    const parsed = parseSiteStripeImageInput(GAMESIR_HTML);
    assert.equal(parsed.isValid, true);
    assert.equal(parsed.sourceType, 'html');
    assert.equal(parsed.imageUrl, GAMESIR_IMAGE_EXPECTED);
    assert.equal(parsed.extractedTrackingUrl, GAMESIR_TRACKING);
  });

  it('parseSiteStripeImageInput soporta URL directa, comillas simples, src sin comillas, data-src separado y rechaza javascript:', () => {
    const direct = parseSiteStripeImageInput('//ae-pic-a1.aliexpress-media.com/kf/test.png');
    assert.equal(direct.isValid, true);
    assert.equal(direct.sourceType, 'url');
    assert.equal(direct.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/test.png');

    const singleQuoted = parseSiteStripeImageInput("<img data-src='https://bad.test/x.png' src='//cdn.aliexpress.com/ok.png?a=1&amp;b=2' />");
    assert.equal(singleQuoted.isValid, true);
    assert.equal(singleQuoted.imageUrl, 'https://cdn.aliexpress.com/ok.png?a=1&b=2');

    const unquoted = parseSiteStripeImageInput('<img src=https://ae01.alicdn.com/kf/demo.jpg>');
    assert.equal(unquoted.isValid, true);
    assert.equal(unquoted.imageUrl, 'https://ae01.alicdn.com/kf/demo.jpg');

    const unsafe = parseSiteStripeImageInput('<img src="javascript:alert(1)" />');
    assert.equal(unsafe.isValid, false);
    assert.equal(unsafe.imageUrl, null);
  });

  it('parseSiteStripeImageInput resuelve src= dentro de alt, src sin comilla de cierre antes de alt y src sin comillas antes de />', () => {
    const srcInAlt = parseSiteStripeImageInput(
      '<img alt="model src=fake" src="https://ae-pic-a1.aliexpress-media.com/kf/real.png" />'
    );
    assert.equal(srcInAlt.isValid, true);
    assert.equal(srcInAlt.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/real.png');

    const unclosedSrc = parseSiteStripeImageInput(
      '<img src="https://ae-pic-a1.aliexpress-media.com/kf/real.png alt="GameSir" />'
    );
    assert.equal(unclosedSrc.isValid, true);
    assert.equal(unclosedSrc.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/real.png');

    const unquotedSelfClose = parseSiteStripeImageInput(
      '<img src=//ae-pic-a1.aliexpress-media.com/kf/unquoted.png/>'
    );
    assert.equal(unquotedSelfClose.isValid, true);
    assert.equal(unquotedSelfClose.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/unquoted.png');
  });

  it('parseSiteStripeImageInput y parseTrackingLinkInput respetan > literal dentro de atributos con comillas', () => {
    const imgWithGt = parseSiteStripeImageInput(
      '<img alt="1 > 0" src="https://ae-pic-a1.aliexpress-media.com/kf/real.png" />'
    );
    assert.equal(imgWithGt.isValid, true);
    assert.equal(imgWithGt.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/real.png');

    const anchorAndImgWithGt = parseSiteStripeImageInput(
      '<a title="1 > 0" href="https://s.click.aliexpress.com/e/_c441YyEz"><img src="//ae-pic-a1.aliexpress-media.com/kf/real.png" /></a>'
    );
    assert.equal(anchorAndImgWithGt.isValid, true);
    assert.equal(anchorAndImgWithGt.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/real.png');
    assert.equal(anchorAndImgWithGt.extractedTrackingUrl, GAMESIR_TRACKING);

    const trackingWithGt = parseTrackingLinkInput(
      '<a title="1 > 0" href="https://s.click.aliexpress.com/e/_c441YyEz">Buy</a>'
    );
    assert.equal(trackingWithGt.isValid, true);
    assert.equal(trackingWithGt.trackingUrl, GAMESIR_TRACKING);
  });
});

describe('R2: Metadata Extraction & SSRF Guard (api/aliexpress-metadata.js)', () => {
  it('Valida allowlist de dominios AliExpress e IPs privadas/reservadas', () => {
    assert.equal(isAllowedAliExpressUrl('https://s.click.aliexpress.com/e/_c441YyEz'), true);
    assert.equal(isAllowedAliExpressUrl('https://es.aliexpress.com/item/1005008899.html'), true);
    assert.equal(isAllowedAliExpressUrl('https://evil.com/item/123.html'), false);
    assert.equal(isAllowedAliExpressUrl('http://127.0.0.1/admin'), false);
    assert.equal(isAllowedAliExpressUrl('https://localhost:3000/test'), false);
    assert.equal(isAllowedAliExpressUrl('file:///etc/passwd'), false);

    assert.equal(isPrivateOrReservedIp('127.0.0.1'), true);
    assert.equal(isPrivateOrReservedIp('10.0.0.5'), true);
    assert.equal(isPrivateOrReservedIp('172.16.4.2'), true);
    assert.equal(isPrivateOrReservedIp('192.168.1.10'), true);
    assert.equal(isPrivateOrReservedIp('169.254.169.254'), true);
    assert.equal(isPrivateOrReservedIp('::1'), true);
    assert.equal(isPrivateOrReservedIp('fe80::1'), true);
    assert.equal(isPrivateOrReservedIp('fc00::1'), true);
    assert.equal(isPrivateOrReservedIp('::ffff:127.0.0.1'), true);
    assert.equal(isPrivateOrReservedIp('1.1.1.1'), false);
    assert.equal(isPrivateOrReservedIp('8.8.8.8'), false);

    // IPv6 no canónico, embebido IPv4, NAT64 y rangos reservados adicionales
    for (const trickyIp of [
      '0:0:0:0:0:0:0:1',
      '0000:0000:0000:0000:0000:0000:0000:0001',
      '0:0:0:0:0:0:0:0',
      '0:0:0:0:0:ffff:127.0.0.1',
      '0:0:0:0:0:ffff:169.254.169.254',
      '::127.0.0.1',
      '64:ff9b::127.0.0.1',
      '64:ff9b:1::1',
      '100::1',
      '2001:db8::1',
      '2002:7f00:0001::',
      '2002:a9fe:a9fe::',
      '::ffff:0:127.0.0.1'
    ]) {
      assert.equal(isPrivateOrReservedIp(trickyIp), true, `Debe bloquear IPv6 reservada: ${trickyIp}`);
    }
    assert.equal(isPrivateOrReservedIp('2606:4700:4700::1111'), false);
  });

  it('extractMetadataFromHtml extrae OG, JSON-LD y runParams, y detecta muros antibot', () => {
    const ogHtml = `
      <html><head>
        <title>GameSir X5 Lite Mobile Controller - AliExpress</title>
        <meta property="og:title" content="GameSir X5 Lite Type-C Mobile Gaming Controller" />
        <meta property="og:image" content="//ae-pic-a1.aliexpress-media.com/kf/demo.png" />
        <meta property="product:price:amount" content="19.99" />
        <meta property="product:price:currency" content="USD" />
      </head></html>`;
    const ogRes = extractMetadataFromHtml(ogHtml, 'https://www.aliexpress.com/item/1005009123456.html');
    assert.equal(ogRes.blocked, false);
    assert.equal(ogRes.metadata.title, 'GameSir X5 Lite Type-C Mobile Gaming Controller');
    assert.equal(ogRes.metadata.imageUrl, 'https://ae-pic-a1.aliexpress-media.com/kf/demo.png');
    assert.equal(ogRes.metadata.discountPrice, '19.99');
    assert.equal(ogRes.metadata.productId, '1005009123456');

    const jsonLdHtml = `
      <html><head>
        <script type="application/ld+json">
          {"@type":"Product","name":"GameSir X5 Lite Pro","image":"https://ae01.alicdn.com/x.jpg","offers":{"price":"24.50","highPrice":"49.00","priceCurrency":"USD"}}
        </script>
      </head></html>`;
    const ldRes = extractMetadataFromHtml(jsonLdHtml, 'https://es.aliexpress.com/item/100500777777.html');
    assert.equal(ldRes.metadata.title, 'GameSir X5 Lite Pro');
    assert.equal(ldRes.metadata.discountPrice, '24.50');
    assert.equal(ldRes.metadata.originPrice, '49.00');
    assert.equal(ldRes.metadata.discount, '50%');

    const runParamsHtml = `
      <script>
        window.runParams = { data: {
          "subject": "GameSir X5 Lite Hall Effect",
          "formatedActivityPrice": "USD 21.00",
          "formatedPrice": "USD 42.00",
          "discount": "50",
          "currencyCode": "USD"
        }};
      </script>`;
    const rpRes = extractMetadataFromHtml(runParamsHtml, 'https://www.aliexpress.com/item/100500888888.html');
    assert.equal(rpRes.metadata.title, 'GameSir X5 Lite Hall Effect');
    assert.equal(rpRes.metadata.discountPrice, 'USD 21.00');
    assert.equal(rpRes.metadata.discount, '50%');

    const captchaRes = extractMetadataFromHtml('<html><title>Security Check</title><script src="x5sec"></script></html>', 'https://www.aliexpress.com/punish?x5secdata=abc');
    assert.equal(captchaRes.blocked, true);

    const captchaWithOgRes = extractMetadataFromHtml(
      '<html><head><title>Security Check</title><meta property="og:title" content="AliExpress Security Check" /><script src="x5sec"></script></head></html>',
      'https://www.aliexpress.com/punish?x5secdata=abc'
    );
    assert.equal(captchaWithOgRes.blocked, true);
    assert.equal(captchaWithOgRes.metadata.title, '');

    const apostropheOgRes = extractMetadataFromHtml(
      '<html><head><meta property="og:title" content="Men\'s Pro Gaming Controller 10\' Cable" /></head></html>',
      'https://www.aliexpress.com/item/100500999888.html'
    );
    assert.equal(apostropheOgRes.metadata.title, "Men's Pro Gaming Controller 10' Cable");

    const gtMetaRes = extractMetadataFromHtml(
      '<html><head><meta itemprop="1 > 0" property="og:title" content="Real Product" /></head></html>',
      'https://www.aliexpress.com/item/100500999889.html'
    );
    assert.equal(gtMetaRes.metadata.title, 'Real Product');
  });

  it('resolveAliExpressMetadata sigue redirecciones y retorna 200 no bloqueante ante 403 antibot', async () => {
    const publicLookup = async () => [{ address: '104.18.10.10', family: 4 }];
    let callCount = 0;
    const mockFetch = async (url) => {
      callCount++;
      if (callCount === 1) {
        assert.equal(url, GAMESIR_TRACKING);
        return {
          status: 302,
          headers: new Map([['location', 'https://www.aliexpress.com/item/100500555666.html']])
        };
      }
      return { status: 403, ok: false, text: async () => 'Forbidden' };
    };

    const res = await resolveAliExpressMetadata(GAMESIR_TRACKING, {
      fetchImpl: mockFetch,
      lookupImpl: publicLookup,
      env: {}
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.blocked, true);
    assert.equal(res.body.partial, true);
    assert.equal(res.body.metadata.productId, '100500555666');
    assert.equal(res.body.metadata.resolvedUrl, 'https://www.aliexpress.com/item/100500555666.html');

    const ssrfBlocked = await resolveAliExpressMetadata('http://169.254.169.254/latest/meta-data/', {
      fetchImpl: mockFetch,
      lookupImpl: publicLookup
    });
    assert.equal(ssrfBlocked.status, 400);
    assert.equal(ssrfBlocked.body.ok, false);
  });

  it('resolveAliExpressMetadata limita lectura de stream a MAX_HTML_BYTES (2MB)', async () => {
    const publicLookup = async () => [{ address: '104.18.10.10', family: 4 }];
    let cancelled = false;
    let reads = 0;
    const chunk = new TextEncoder().encode('<html><meta property="og:title" content="Stream OK" />' + 'x'.repeat(1024 * 1024));
    const streamMockFetch = async () => ({
      status: 200,
      ok: true,
      body: {
        getReader() {
          return {
            async read() {
              reads++;
              if (reads > 5) return { done: true, value: undefined };
              return { done: false, value: chunk };
            },
            async cancel() {
              cancelled = true;
            },
            releaseLock() {}
          };
        }
      }
    });

    const res = await resolveAliExpressMetadata('https://www.aliexpress.com/item/100500112233.html', {
      fetchImpl: streamMockFetch,
      lookupImpl: publicLookup,
      env: {}
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.metadata.title, 'Stream OK');
    assert.equal(cancelled, true);
    assert.ok(reads <= 3);

    // Chunks exactos de 64KB (divisor exacto de 2MB): debe cancelar el reader al alcanzar exactamente 2MB
    let exactCancelled = false;
    let exactReads = 0;
    const headerChunk = new TextEncoder().encode('<html><meta property="og:title" content="Exact 64KB OK" />');
    const pad64k = new Uint8Array(64 * 1024);
    pad64k.fill(0x78); // 'x'
    pad64k.set(headerChunk, 0);
    const filler64k = new Uint8Array(64 * 1024).fill(0x78);
    const exactStreamMockFetch = async () => ({
      status: 200,
      ok: true,
      body: {
        getReader() {
          return {
            async read() {
              exactReads++;
              if (exactReads > 160) return { done: true, value: undefined };
              return { done: false, value: exactReads === 1 ? pad64k : filler64k };
            },
            async cancel() {
              exactCancelled = true;
            },
            releaseLock() {}
          };
        }
      }
    });

    const exactRes = await resolveAliExpressMetadata('https://www.aliexpress.com/item/100500112244.html', {
      fetchImpl: exactStreamMockFetch,
      lookupImpl: publicLookup,
      env: {}
    });
    assert.equal(exactRes.status, 200);
    assert.equal(exactRes.body.metadata.title, 'Exact 64KB OK');
    assert.equal(exactCancelled, true);
    assert.equal(exactReads, 32);

    // Stream menor a 2MB que termina naturalmente con done: true NO debe invocar cancel()
    let shortCancelled = false;
    let shortReads = 0;
    const shortStreamFetch = async () => ({
      status: 200,
      ok: true,
      body: {
        getReader() {
          return {
            async read() {
              shortReads++;
              if (shortReads === 1) {
                return { done: false, value: new TextEncoder().encode('<html><meta property="og:title" content="Short OK" /></html>') };
              }
              return { done: true, value: undefined };
            },
            async cancel() {
              shortCancelled = true;
            },
            releaseLock() {}
          };
        }
      }
    });
    const shortRes = await resolveAliExpressMetadata('https://www.aliexpress.com/item/100500112255.html', {
      fetchImpl: shortStreamFetch,
      lookupImpl: publicLookup,
      env: {}
    });
    assert.equal(shortRes.status, 200);
    assert.equal(shortRes.body.metadata.title, 'Short OK');
    assert.equal(shortCancelled, false);
  });
});

describe('R3: Categorías, Catálogo, DB Client y API /api/products', () => {
  it('slugifyCategory y collectCatalogCategories preservan las 11 CATEGORY_SLUGS sin mutarlas', () => {
    const originalSnapshot = [...CATEGORY_SLUGS];
    assert.equal(slugifyCategory('Controles Gaming PRO!'), 'controles-gaming-pro');
    assert.equal(slugifyCategory('Periféricos & Audio'), 'perifericos-audio');

    const manualDeal = mapDbProductToCatalogDeal({
      id: 'manual-gamesir-x5',
      product_id: '100500555666',
      title: 'GameSir X5 Lite Control USB-C',
      tracking_url: GAMESIR_TRACKING,
      image_url: GAMESIR_IMAGE_EXPECTED,
      origin_price: 'USD 39.99',
      discount_price: 'USD 19.99',
      discount: '50%',
      currency: 'USD',
      category: 'controles-gaming',
      category_label: 'Controles Gaming',
      countries: ['global']
    });

    assert.equal(manualDeal['Promotion Url'], GAMESIR_TRACKING);
    assert.equal(manualDeal['Image Url'], GAMESIR_IMAGE_EXPECTED);
    assert.equal(manualDeal.dealType, 'manual-sitestripe');

    const merged = mergeCatalogDeals([manualDeal], [
      { ProductId: '100500555666', 'Product Desc': 'Duplicado estático', category: 'perifericos-gaming' },
      { ProductId: '999', 'Product Desc': 'Estático', category: 'tech-gadgets' }
    ]);
    assert.equal(merged.length, 2);
    assert.equal(merged[0]['Product Desc'], 'GameSir X5 Lite Control USB-C');

    const cats = collectCatalogCategories(merged, [{ slug: 'controles-gaming', label: 'Controles Gaming' }]);
    assert.deepEqual(CATEGORY_SLUGS, originalSnapshot, 'CATEGORY_SLUGS no debe mutarse');
    assert.equal(cats.filter((c) => !c.isCustom).length, 11);
    const customCat = cats.find((c) => c.slug === 'controles-gaming');
    assert.ok(customCat);
    assert.equal(customCat.isCustom, true);
    assert.equal(customCat.label, 'Controles Gaming');
    assert.equal(customCat.count, 1);
  });

  it('normalizeManualProductPayload valida y normaliza el ejemplo GameSir X5 Lite con categoría nueva', () => {
    const normalized = normalizeManualProductPayload({
      trackingUrl: GAMESIR_TRACKING,
      imageInput: GAMESIR_HTML,
      title: 'GameSir X5 Lite Control Móvil USB-C',
      originPrice: '39.99',
      discountPrice: '19.99',
      currency: 'USD',
      newCategoryName: 'Controles Móviles',
      countries: 'global, mx'
    });

    assert.equal(normalized.ok, true);
    assert.equal(normalized.product.trackingUrl, GAMESIR_TRACKING);
    assert.equal(normalized.product.imageUrl, GAMESIR_IMAGE_EXPECTED);
    assert.equal(normalized.product.originPrice, 'USD 39.99');
    assert.equal(normalized.product.discountPrice, 'USD 19.99');
    assert.equal(normalized.product.discount, '50%');
    assert.equal(normalized.product.category, 'controles-moviles');
    assert.equal(normalized.category.isCustom, true);
    assert.deepEqual(normalized.product.countries, ['global', 'mx']);
  });

  it('dbClient ejecuta consultas seguras con mock pool para productos y categorías', async () => {
    const queries = [];
    const mockPool = {
      async query(sql, values) {
        queries.push({ sql, values });
        if (sql.includes('CREATE TABLE IF NOT EXISTS')) return { rows: [] };
        if (sql.includes('INSERT INTO public.cuponestech_categories')) {
          return { rows: [{ slug: values[0], label_es: values[1], label_en: values[2] }] };
        }
        if (sql.includes('INSERT INTO public.cuponestech_products')) {
          return {
            rows: [{
              id: values[0],
              product_id: values[1],
              title: values[3],
              tracking_url: values[4],
              image_url: values[5],
              origin_price: values[6],
              discount_price: values[7],
              discount: values[8],
              currency: values[9],
              category: values[10],
              category_label: values[11],
              countries: values[12]
            }]
          };
        }
        if (sql.includes('SELECT * FROM public.cuponestech_products')) {
          return {
            rows: [{
              id: 'manual-ss-_c441YyEz',
              product_id: 'ss-_c441YyEz',
              title: 'GameSir X5 Lite',
              tracking_url: GAMESIR_TRACKING,
              image_url: GAMESIR_IMAGE_EXPECTED,
              category: 'perifericos-gaming',
              category_label: 'Videojuegos',
              countries: ['global']
            }]
          };
        }
        if (sql.includes('SELECT slug, label_es')) {
          return { rows: [{ slug: 'controles-gaming', label_es: 'Controles Gaming', label_en: 'Controles Gaming' }] };
        }
        if (sql.includes('UPDATE public.cuponestech_products')) {
          return { rows: [{ id: values[0] }] };
        }
        return { rows: [] };
      }
    };

    await ensureProductsSchema(mockPool);
    const cat = await upsertCategoryToDB({ slug: 'controles-gaming', labelEs: 'Controles Gaming' }, mockPool);
    assert.equal(cat.slug, 'controles-gaming');

    const saved = await upsertProductToDB({
      id: 'manual-ss-_c441YyEz',
      productId: 'ss-_c441YyEz',
      title: 'GameSir X5 Lite',
      trackingUrl: GAMESIR_TRACKING,
      imageUrl: GAMESIR_IMAGE_EXPECTED,
      category: 'controles-gaming',
      categoryLabel: 'Controles Gaming',
      countries: ['global']
    }, mockPool);
    assert.equal(saved['Promotion Url'], GAMESIR_TRACKING);

    const list = await getActiveProductsFromDB({ category: 'perifericos-gaming', country: 'mx' }, mockPool);
    assert.equal(list.length, 1);
    assert.equal(list[0]['Image Url'], GAMESIR_IMAGE_EXPECTED);

    const cats = await getCustomCategoriesFromDB(mockPool);
    assert.equal(cats[0].label, 'Controles Gaming');

    const deleted = await deleteProductFromDB('manual-ss-_c441YyEz', mockPool);
    assert.equal(deleted.id, 'manual-ss-_c441YyEz');
  });

  it('api/products.js maneja GET, POST autenticado, 503 sin DATABASE_URL y DELETE', async () => {
    const savedStore = [];
    const savedCats = [];

    const handler = createProductsHandler({
      isDbConfigured: () => true,
      getActiveProductsFromDB: async () => [...savedStore],
      getCustomCategoriesFromDB: async () => [...savedCats],
      upsertCategoryToDB: async (cat) => {
        const entry = { slug: cat.slug, label: cat.labelEs };
        savedCats.push(entry);
        return entry;
      },
      upsertProductToDB: async (prod) => {
        const deal = mapDbProductToCatalogDeal({
          ...prod,
          product_id: prod.productId,
          tracking_url: prod.trackingUrl,
          image_url: prod.imageUrl,
          origin_price: prod.originPrice,
          discount_price: prod.discountPrice,
          category_label: prod.categoryLabel
        });
        savedStore.push(deal);
        return deal;
      },
      deleteProductFromDB: async (id) => ({ id })
    });

    process.env.ADMIN_SECRET = 'super_secret_test';
    try {
      // POST sin token -> 401
      const unauthRes = createMockRes();
      await handler({ method: 'POST', headers: {}, body: {} }, unauthRes);
      assert.equal(unauthRes.statusCode, 401);
      assert.equal(isAuthorizedAdminRequest({ headers: { 'x-admin-secret': 'super_secret_test' } }), true);

      // POST con token válido y GameSir X5 Lite -> 201
      const postRes = createMockRes();
      await handler({
        method: 'POST',
        headers: { authorization: 'Bearer super_secret_test' },
        body: {
          trackingUrl: GAMESIR_TRACKING,
          imageInput: GAMESIR_HTML,
          title: 'GameSir X5 Lite USB-C',
          originPrice: '39.99',
          discountPrice: '19.99',
          currency: 'USD',
          newCategoryName: 'Controles Portátiles',
          countries: 'global'
        }
      }, postRes);
      assert.equal(postRes.statusCode, 201);
      assert.equal(postRes.body.ok, true);
      assert.equal(postRes.body.product['Promotion Url'], GAMESIR_TRACKING);
      assert.equal(postRes.body.product['Image Url'], GAMESIR_IMAGE_EXPECTED);
      assert.equal(postRes.body.category.slug, 'controles-portatiles');

      // GET -> 200 con producto y categoría
      const getRes = createMockRes();
      await handler({ method: 'GET', headers: {}, query: {} }, getRes);
      assert.equal(getRes.statusCode, 200);
      assert.equal(getRes.body.products.length, 1);
      assert.equal(getRes.body.categories.length, 1);

      // DELETE -> 200
      const delRes = createMockRes();
      await handler({
        method: 'DELETE',
        headers: { 'x-admin-secret': 'super_secret_test' },
        query: { id: postRes.body.product.id }
      }, delRes);
      assert.equal(delRes.statusCode, 200);
      assert.equal(delRes.body.ok, true);
    } finally {
      delete process.env.ADMIN_SECRET;
    }

    // POST sin DATABASE_URL -> 503
    const noDbHandler = createProductsHandler({ isDbConfigured: () => false });
    const noDbRes = createMockRes();
    await noDbHandler({ method: 'POST', headers: {}, body: {} }, noDbRes);
    assert.equal(noDbRes.statusCode, 503);
  });

  it('manualCatalog acota longitudes VARCHAR, calcula descuento con comas de miles, evita guion final en slug y genera IDs únicos en deep_link.htm', () => {
    assert.equal(slugifyCategory('a'.repeat(71) + ' b').endsWith('-'), false);

    const bounded = normalizeManualProductPayload({
      trackingUrl: 'https://s.click.aliexpress.com/e/' + 'x'.repeat(90),
      imageInput: GAMESIR_IMAGE_EXPECTED,
      title: 'Producto Prueba',
      originPrice: 'USD ' + '9'.repeat(50),
      discountPrice: 'USD ' + '5'.repeat(50),
      discount: '50' + '0'.repeat(30),
      newCategoryName: 'Categoria '.repeat(20)
    });
    assert.equal(bounded.ok, true);
    assert.ok(bounded.product.productId.length <= 80);
    assert.ok(bounded.product.categoryLabel.length <= 120);
    assert.ok(bounded.category.label.length <= 120);
    assert.ok(bounded.product.originPrice.length <= 40);
    assert.ok(bounded.product.discountPrice.length <= 40);
    assert.ok(bounded.product.discount.length <= 20);
    assert.ok(bounded.product.currency.length <= 10);

    const thousands = normalizeManualProductPayload({
      trackingUrl: GAMESIR_TRACKING,
      imageInput: GAMESIR_IMAGE_EXPECTED,
      title: 'Monitor 4K',
      originPrice: '1,299.99',
      discountPrice: '999.99',
      currency: 'USD',
      category: 'tech-gadgets'
    });
    assert.equal(thousands.ok, true);
    assert.equal(thousands.product.discount, '23%');
    assert.equal(thousands.product.originPrice, 'USD 1299.99');

    const decimalComma = normalizeManualProductPayload({
      trackingUrl: GAMESIR_TRACKING,
      imageInput: GAMESIR_IMAGE_EXPECTED,
      title: 'Cable USB-C',
      originPrice: '39,99',
      discountPrice: '19,99',
      currency: 'USD',
      category: 'tech-gadgets'
    });
    assert.equal(decimalComma.ok, true);
    assert.equal(decimalComma.product.originPrice, 'USD 39.99');
    assert.equal(decimalComma.product.discount, '50%');

    const dl1 = normalizeManualProductPayload({
      trackingUrl: 'https://s.click.aliexpress.com/deep_link.htm?aff_short_key=abc&dl_target_url=1',
      imageInput: GAMESIR_IMAGE_EXPECTED,
      title: 'Producto DeepLink 1',
      category: 'tech-gadgets'
    });
    const dl2 = normalizeManualProductPayload({
      trackingUrl: 'https://s.click.aliexpress.com/deep_link.htm?aff_short_key=xyz&dl_target_url=2',
      imageInput: GAMESIR_IMAGE_EXPECTED,
      title: 'Producto DeepLink 2',
      category: 'tech-gadgets'
    });
    assert.notEqual(dl1.product.id, dl2.product.id);
    assert.notEqual(dl1.product.productId, dl2.product.productId);
  });

  it('Auth fail-closed en producción sin ADMIN_SECRET, timingSafeEqual y CORS sin wildcard en rutas admin/metadata', async () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevVercelEnv = process.env.VERCEL_ENV;
    const prevSecret = process.env.ADMIN_SECRET;

    const prodHandler = createProductsHandler({
      isDbConfigured: () => true,
      getActiveProductsFromDB: async () => [],
      getCustomCategoriesFromDB: async () => []
    });
    const metaHandler = createAliExpressMetadataHandler({});

    try {
      delete process.env.ADMIN_SECRET;
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_ENV = 'production';

      // GET /api/products sigue público
      const pubGet = createMockRes();
      await prodHandler({ method: 'GET', headers: { origin: 'https://cuponestech.tech' }, query: {} }, pubGet);
      assert.equal(pubGet.statusCode, 200);
      assert.equal(pubGet.headers['Access-Control-Allow-Origin'], 'https://cuponestech.tech');

      // Origin no permitido no recibe wildcard *
      const badOriginGet = createMockRes();
      await prodHandler({ method: 'GET', headers: { origin: 'https://evil.example' }, query: {} }, badOriginGet);
      assert.equal(badOriginGet.headers['Access-Control-Allow-Origin'], undefined);

      // POST / DELETE /api/products y GET/POST /api/aliexpress-metadata devuelven 503 sin ADMIN_SECRET en producción
      const postNoSecret = createMockRes();
      await prodHandler({ method: 'POST', headers: { origin: 'http://localhost:5173' }, body: {} }, postNoSecret);
      assert.equal(postNoSecret.statusCode, 503);
      assert.equal(postNoSecret.headers['Access-Control-Allow-Origin'], 'http://localhost:5173');

      const delNoSecret = createMockRes();
      await prodHandler({ method: 'DELETE', headers: {}, query: { id: 'x' } }, delNoSecret);
      assert.equal(delNoSecret.statusCode, 503);

      const metaNoSecret = createMockRes();
      await metaHandler({ method: 'POST', headers: { origin: 'https://evil.example' }, body: { url: GAMESIR_TRACKING } }, metaNoSecret);
      assert.equal(metaNoSecret.statusCode, 503);
      assert.equal(metaNoSecret.headers['Access-Control-Allow-Origin'], undefined);

      // Con ADMIN_SECRET configurado, valida timing-safe
      process.env.ADMIN_SECRET = 'prod_secret_123';
      assert.equal(isAuthorizedAdminRequest({ headers: { 'x-admin-secret': 'wrong_len' } }), false);
      assert.equal(isAuthorizedAdminRequest({ headers: { 'x-admin-secret': 'prod_secret_123' } }), true);

      // CORS: exige https:// para same-host (no localhost) y prioriza host sobre x-forwarded-host
      assert.equal(
        resolveAllowedCorsOrigin({ headers: { origin: 'http://cuponestech.tech', host: 'cuponestech.tech' } }),
        null
      );
      assert.equal(
        resolveAllowedCorsOrigin({
          headers: { origin: 'https://evil.com', host: 'cuponestech.tech', 'x-forwarded-host': 'evil.com' }
        }),
        null
      );
      assert.equal(
        resolveAllowedCorsOrigin({
          headers: {
            origin: 'https://preview.vercel.app',
            'x-forwarded-host': 'preview.vercel.app, internal.vercel.app'
          }
        }),
        'https://preview.vercel.app'
      );
      assert.equal(
        resolveAllowedCorsOrigin({ headers: { origin: 'https://cuponestech.tech', host: 'cuponestech.tech' } }),
        'https://cuponestech.tech'
      );
    } finally {
      if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = prevNodeEnv;
      if (prevVercelEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = prevVercelEnv;
      if (prevSecret === undefined) delete process.env.ADMIN_SECRET;
      else process.env.ADMIN_SECRET = prevSecret;
    }
  });

  it('copyTextSafe nunca lanza excepciones y devuelve false cuando el portapapeles no está disponible', async () => {
    const noClipOk = await copyTextSafe('https://s.click.aliexpress.com/e/_c441YyEz');
    assert.equal(noClipOk, false);
    const emptyOk = await copyTextSafe('');
    assert.equal(emptyOk, false);
  });
});
