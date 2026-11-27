import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LOCALES,
  BASE_DOMAIN,
  DEFAULT_LOCALE,
  CATEGORY_SLUGS,
  getLocaleConfig,
  resolveRouteSeoPolicy,
  getRouteSuffixForLocale
} from '../src/config/locales.js';
import {
  SECTION_I18N,
  getSectionText,
  getLocalizedCategoryPath,
  getLocalizedCountryName,
  getRouteSlugsForLang
} from '../src/data/multilingualSections.js';
import {
  getAllRouteDescriptors,
  buildStaticBodyMarkup,
  buildLocalizedHtml,
  buildSitemapXml,
  buildSitemapIndexXml,
  buildRobotsTxt,
  evaluateRoutesWithPolicies
} from '../scripts/prerender-and-sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TEMPLATE_HTML = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <title>CuponesTech</title>
    <meta name="description" content="Base" />
    <!--SEO_HEAD_INJECT-->
  </head>
  <body>
    <div id="root"><!--SSG_CONTENT_INJECT--></div>
  </body>
</html>`;

describe('SEO Pruning Policy, SSG, Sitemaps & i18n Banner (R1–R6)', () => {
  it('R1: Marca todas las rutas AliExpress (root y categorías × 66 locales) con noindex, canonical sin tienda y sin hreflang', () => {
    const aliRoutes = [
      { type: 'aliexpress', storeFilter: 'aliexpress', slug: null },
      ...CATEGORY_SLUGS.map((slug) => ({ type: 'category', storeFilter: 'aliexpress', slug }))
    ];

    assert.equal(LOCALES.length * aliRoutes.length, 792);

    for (const loc of LOCALES) {
      for (const route of aliRoutes) {
        const policy = resolveRouteSeoPolicy(loc, route, { coupons: [], offersCount: 16 });
        const expectedCanonical = route.type === 'aliexpress'
          ? `${BASE_DOMAIN}/${loc.code}`
          : `${BASE_DOMAIN}${getLocalizedCategoryPath(loc, null, route.slug)}`;

        assert.equal(policy.isIndexable, false, `${loc.code} ${route.type} ${route.slug || ''} debe ser noindex`);
        assert.equal(policy.robotsContent, 'noindex, follow');
        assert.equal(policy.emitHreflang, false);
        assert.equal(policy.includeInSitemap, false);
        assert.equal(policy.canonicalUrl, expectedCanonical);
        assert.deepEqual(policy.hreflangLocales, []);
        assert.equal(policy.xDefaultHref, null);
      }
    }

    const mx = getLocaleConfig('es-mx');
    const html = buildLocalizedHtml(
      TEMPLATE_HTML,
      mx,
      { type: 'category', storeFilter: 'aliexpress', slug: 'tech-gadgets' },
      []
    );
    assert.match(html, /<meta name="robots" content="noindex, follow" \/>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/cuponestech\.tech\/es-mx\/categoria\/tech-gadgets" \/>/);
    assert.doesNotMatch(html, /rel="alternate" hreflang=/);
  });

  it('R2: Poda rutas Temu sin inventario (incluidos países sin Temu) y restringe hreflang cuando hay inventario parcial', () => {
    const temuRoutes = [
      { type: 'temu', storeFilter: 'temu', slug: null },
      ...CATEGORY_SLUGS.map((slug) => ({ type: 'category', storeFilter: 'temu', slug }))
    ];
    const nonTemuLocales = LOCALES.filter((l) => !(l.stores || []).includes('temu'));
    assert.ok(nonTemuLocales.length >= 10, 'Deben existir países sin Temu en stores');

    // Con 0 cupones y 0 ofertas, todas las rutas Temu son noindex
    for (const loc of LOCALES) {
      for (const route of temuRoutes) {
        const policy = resolveRouteSeoPolicy(loc, route, { coupons: [], offersCount: 0 });
        assert.equal(policy.isIndexable, false);
        assert.equal(policy.robotsContent, 'noindex, follow');
        assert.equal(policy.emitHreflang, false);
        assert.equal(policy.includeInSitemap, false);
      }
    }

    // Incluso simulando cupones/ofertas, países sin Temu siguen noindex
    for (const loc of nonTemuLocales) {
      const policy = resolveRouteSeoPolicy(
        loc,
        { type: 'temu', storeFilter: 'temu', slug: null },
        { coupons: [{ id: 't1', store: 'temu' }], offersCount: 3 }
      );
      assert.equal(policy.isIndexable, false, `${loc.code} sin Temu no debe indexarse`);
      assert.equal(policy.emitHreflang, false);
      assert.equal(policy.includeInSitemap, false);
    }

    // Simulación de inventario activo solo en un subconjunto de países (sin DEFAULT_LOCALE)
    const nowIso = new Date().toISOString();
    const nowMinus = new Date(Date.now() - 3600_000).toISOString();
    const nowPlus = new Date(Date.now() + 86400_000).toISOString();
    const partialCoupons = [
      {
        id: 'temu-mx-1',
        store: 'temu',
        couponScope: 'cart',
        code: 'TEMUMX',
        userType: 'new',
        currency: 'MXN',
        discountType: 'fixed',
        discountValue: 100,
        minSpend: 500,
        channel: 'app',
        sourceUrl: 'https://www.temu.com/mx',
        title: { es: 'Temu MX', en: 'Temu MX' },
        countries: ['mx'],
        validFrom: nowMinus,
        validUntil: nowPlus,
        lastVerifiedAt: nowIso
      },
      {
        id: 'temu-fr-1',
        store: 'temu',
        couponScope: 'cart',
        code: 'TEMUFR',
        userType: 'new',
        currency: 'EUR',
        discountType: 'fixed',
        discountValue: 10,
        minSpend: 50,
        channel: 'app',
        sourceUrl: 'https://www.temu.com/fr',
        title: { es: 'Temu FR', en: 'Temu FR' },
        countries: ['fr'],
        validFrom: nowMinus,
        validUntil: nowPlus,
        lastVerifiedAt: nowIso
      }
    ];

    const evaluated = evaluateRoutesWithPolicies(
      [{ type: 'temu', storeFilter: 'temu' }],
      { dbCoupons: partialCoupons }
    );
    const temuEval = evaluated[0];
    assert.deepEqual(temuEval.indexableLocales, ['es-mx', 'fr-fr']);

    const mxEntry = temuEval.entries.find((e) => e.localeConfig.code === 'es-mx');
    const usEntry = temuEval.entries.find((e) => e.localeConfig.code === 'en-us');
    assert.equal(mxEntry.policy.isIndexable, true);
    assert.equal(mxEntry.policy.emitHreflang, true);
    assert.equal(mxEntry.policy.includeInSitemap, true);
    assert.deepEqual(mxEntry.policy.hreflangLocales.map((l) => l.code), ['es-mx', 'fr-fr']);
    assert.equal(mxEntry.policy.xDefaultHref, null, 'No debe emitir x-default si en-us es noindex');

    assert.equal(usEntry.policy.isIndexable, false);
    assert.equal(usEntry.policy.emitHreflang, false);

    const mxTemuHtml = buildLocalizedHtml(TEMPLATE_HTML, mxEntry.localeConfig, temuEval.route, mxEntry.coupons, mxEntry.policy);
    assert.match(mxTemuHtml, /<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" \/>/);
    assert.match(mxTemuHtml, /hreflang="es-mx"/);
    assert.match(mxTemuHtml, /hreflang="fr-fr"/);
    assert.doesNotMatch(mxTemuHtml, /hreflang="en-us"/);
    assert.doesNotMatch(mxTemuHtml, /hreflang="x-default"/);
    assert.match(mxTemuHtml, /"indexableLocales":\["es-mx","fr-fr"\]/);

    // Si DEFAULT_LOCALE sí es indexable, x-default debe apuntar a /en-us/temu
    const policyWithUs = resolveRouteSeoPolicy(
      getLocaleConfig('es-mx'),
      { type: 'temu', storeFilter: 'temu', slug: null },
      { coupons: [partialCoupons[0]], indexableLocales: ['en-us', 'es-mx'] }
    );
    assert.equal(policyWithUs.xDefaultHref, `${BASE_DOMAIN}/${DEFAULT_LOCALE}/temu`);
  });

  it('R3: Marca las 330 páginas legales y FAQ (5 tipos × 66 locales) con noindex y sin hreflang', () => {
    const legalTypes = ['privacy', 'terms', 'about', 'contact', 'faq'];
    assert.equal(legalTypes.length * LOCALES.length, 330);

    for (const loc of LOCALES) {
      for (const type of legalTypes) {
        const route = { type, storeFilter: null, slug: null };
        const policy = resolveRouteSeoPolicy(loc, route);
        const suffix = getRouteSuffixForLocale(route, loc);

        assert.equal(policy.isIndexable, false);
        assert.equal(policy.robotsContent, 'noindex, follow');
        assert.equal(policy.emitHreflang, false);
        assert.equal(policy.includeInSitemap, false);
        assert.equal(policy.canonicalUrl, `${BASE_DOMAIN}/${loc.code}${suffix}`);

        const html = buildLocalizedHtml(TEMPLATE_HTML, loc, route, [], policy);
        assert.match(html, /<meta name="robots" content="noindex, follow" \/>/);
        assert.doesNotMatch(html, /rel="alternate" hreflang=/);
      }
    }
  });

  it('R4: Mantiene index, self-canonical y 66 hreflang + x-default en rutas indexables y alinea SEOHead.jsx', () => {
    const indexableRoutes = [
      { type: 'home', storeFilter: null, slug: null },
      { type: 'category', storeFilter: null, slug: 'tech-gadgets' },
      { type: 'dynamics', storeFilter: null, slug: null },
      { type: 'guides', storeFilter: null, slug: null }
    ];

    for (const loc of LOCALES) {
      for (const route of indexableRoutes) {
        const policy = resolveRouteSeoPolicy(loc, route);
        assert.equal(policy.isIndexable, true);
        assert.equal(policy.robotsContent, 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        assert.equal(policy.emitHreflang, true);
        assert.equal(policy.includeInSitemap, true);
        assert.equal(policy.hreflangLocales.length, LOCALES.length);
        assert.ok(policy.xDefaultHref?.startsWith(BASE_DOMAIN));
      }
    }

    const rootPolicy = resolveRouteSeoPolicy(getLocaleConfig(DEFAULT_LOCALE), { type: 'home', storeFilter: null }, { isRoot: true });
    assert.equal(rootPolicy.canonicalUrl, `${BASE_DOMAIN}/`);
    assert.equal(rootPolicy.xDefaultHref, `${BASE_DOMAIN}/`);
    assert.equal(rootPolicy.isIndexable, true);

    const seoHeadSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'SEOHead.jsx'), 'utf-8');
    assert.match(seoHeadSource, /resolveRouteSeoPolicy/);
    assert.match(seoHeadSource, /window\.__SSR_COUPONS__/);
    assert.match(seoHeadSource, /policy\.robotsContent/);
    assert.match(seoHeadSource, /policy\.canonicalUrl/);
    assert.match(seoHeadSource, /if\s*\(\s*policy\.emitHreflang\s*\)/);
    assert.match(seoHeadSource, /link\[rel="alternate"\]\[hreflang\]/);

    const appSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'App.jsx'), 'utf-8');
    assert.match(appSource, /indexableLocales=\{/);
    assert.match(appSource, /ui\.noActiveCartCoupons/);
    assert.match(appSource, /ui\.exploreProductDeals/);
    assert.match(appSource, /ui\.viewProductDealsBtn/);
    assert.doesNotMatch(appSource, /No sitewide cart coupons currently active/);
  });

  it('R5: Traduce el banner de ausencia de cupones en los 27 idiomas y elimina texto inglés en locales no-en', () => {
    const langs = [...new Set(LOCALES.map((l) => l.lang))];
    assert.equal(langs.length, 27);

    const englishBanner = 'There are no active cart coupons for this country at this moment.';
    const englishBtn = 'View available product deals';

    for (const lang of langs) {
      const pack = SECTION_I18N[lang];
      const ui = getSectionText(lang);
      assert.ok(pack, `Falta pack SECTION_I18N para ${lang}`);
      assert.equal(typeof ui.noActiveCartCoupons, 'string');
      assert.ok(ui.noActiveCartCoupons.trim().length > 5, `noActiveCartCoupons vacío en ${lang}`);
      assert.equal(typeof ui.exploreProductDeals, 'function');
      assert.ok(ui.exploreProductDeals('TestCountry').includes('TestCountry'));
      assert.equal(typeof ui.viewProductDealsBtn, 'string');
      assert.ok(ui.viewProductDealsBtn.trim().length > 3, `viewProductDealsBtn vacío en ${lang}`);

      if (lang === 'en') {
        assert.equal(ui.noActiveCartCoupons, englishBanner);
        assert.equal(ui.viewProductDealsBtn, englishBtn);
      } else {
        assert.notEqual(ui.noActiveCartCoupons, englishBanner, `${lang} no debe usar fallback inglés`);
        assert.notEqual(ui.viewProductDealsBtn, englishBtn, `${lang} botón no debe usar fallback inglés`);
      }
    }

    const esc = (s) => String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    for (const loc of LOCALES) {
      const markup = buildStaticBodyMarkup(loc, { type: 'home', storeFilter: null }, []);
      const ui = getSectionText(loc.lang);
      const displayCountry = getLocalizedCountryName(loc, loc.lang);
      assert.ok(markup.includes(esc(ui.noActiveCartCoupons)));
      assert.ok(markup.includes(esc(ui.exploreProductDeals(displayCountry))));
      assert.ok(markup.includes(esc(ui.viewProductDealsBtn)));
      if (loc.lang !== 'en') {
        assert.equal(markup.includes(englishBanner), false, `${loc.code} contiene banner inglés`);
      }
    }
  });

  it('R6: Genera sitemap.xml únicamente con URLs indexables, sitemap-index.xml como <sitemapindex> válido y robots.txt alineado', () => {
    const routes = getAllRouteDescriptors();
    const evaluated = evaluateRoutesWithPolicies(routes, { dbCoupons: [] });
    const records = [{ loc: `${BASE_DOMAIN}/`, rank: 0, priority: '1.0', changefreq: 'daily' }];
    for (const { route, entries } of evaluated) {
      for (const { policy } of entries) {
        if (policy.includeInSitemap) {
          records.push({ loc: policy.canonicalUrl, rank: route.type === 'home' ? 1 : 3, priority: '0.8', changefreq: 'daily' });
        }
      }
    }

    // 1 root + 66 home + 66*11 categories + 66 dynamics + 66 guides = 925
    assert.equal(records.length, 925);

    const sitemapXml = buildSitemapXml(records, '2026-11-27');
    assert.match(sitemapXml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
    assert.doesNotMatch(sitemapXml, /\/aliexpress(\/|<)/);
    assert.doesNotMatch(sitemapXml, /\/temu(\/|<)/);

    const allLegalSlugs = new Set();
    for (const loc of LOCALES) {
      const s = getRouteSlugsForLang(loc.lang);
      for (const key of ['privacy', 'terms', 'about', 'contact', 'faq']) {
        allLegalSlugs.add(s[key] || 'faq');
      }
    }
    for (const slug of allLegalSlugs) {
      const legalRe = new RegExp(`/${slug}</loc>`);
      assert.equal(legalRe.test(sitemapXml), false, `Sitemap no debe incluir ruta legal/faq /${slug}`);
    }

    const sitemapIndexXml = buildSitemapIndexXml('2026-11-27');
    assert.match(sitemapIndexXml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
    assert.match(sitemapIndexXml, /<loc>https:\/\/cuponestech\.tech\/sitemap\.xml<\/loc>/);
    assert.doesNotMatch(sitemapIndexXml, /<urlset/);

    const robotsTxt = buildRobotsTxt();
    assert.match(robotsTxt, /^Sitemap: https:\/\/cuponestech\.tech\/sitemap-index\.xml$/m);
    assert.doesNotMatch(robotsTxt, /^Sitemap: https:\/\/cuponestech\.tech\/sitemap\.xml$/m);
  });
});
