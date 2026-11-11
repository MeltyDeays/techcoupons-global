import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, BASE_DOMAIN, DEFAULT_LOCALE, CATEGORY_SLUGS, buildStructuredData } from '../src/config/locales.js';
import { getCouponsForLocale } from '../src/data/couponsGenerator.js';
import {
  getRouteSlugsForLang,
  getLocalizedCategoryPath,
  getSectionText,
  getLocalizedCountryName
} from '../src/data/multilingualSections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getAllRouteDescriptors() {
  const routes = [
    { type: 'home', storeFilter: null },
    { type: 'temu', storeFilter: 'temu' },
    { type: 'aliexpress', storeFilter: 'aliexpress' },
    { type: 'dynamics', storeFilter: null },
    { type: 'guides', storeFilter: null },
    { type: 'privacy', storeFilter: null },
    { type: 'terms', storeFilter: null },
    { type: 'about', storeFilter: null },
    { type: 'contact', storeFilter: null }
  ];

  CATEGORY_SLUGS.forEach((slug) => {
    routes.push({ type: 'category', storeFilter: null, slug });
    routes.push({ type: 'category', storeFilter: 'temu', slug });
    routes.push({ type: 'category', storeFilter: 'aliexpress', slug });
  });

  return routes;
}

function getRouteSuffixForLocale(route, localeConfig) {
  const slugs = getRouteSlugsForLang(localeConfig.lang);
  if (route.type === 'home') return '';
  if (route.type === 'temu') return '/temu';
  if (route.type === 'aliexpress') return '/aliexpress';
  if (route.type === 'dynamics') return `/${slugs.dynamics}`;
  if (route.type === 'guides') return `/${slugs.guides}`;
  if (route.type === 'privacy') return `/${slugs.privacy}`;
  if (route.type === 'terms') return `/${slugs.terms}`;
  if (route.type === 'about') return `/${slugs.about}`;
  if (route.type === 'contact') return `/${slugs.contact}`;
  if (route.type === 'category') {
    const fullPath = getLocalizedCategoryPath(localeConfig, route.storeFilter, route.slug);
    return fullPath.slice(`/${localeConfig.code}`.length);
  }
  return '';
}

function buildStaticBodyMarkup(localeConfig, route, coupons) {
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const slugs = getRouteSlugsForLang(localeConfig.lang);
  let heading = dict.heroTitle;
  if (route.type === 'temu') heading = `Temu — ${dict.heroTitle}`;
  if (route.type === 'aliexpress') heading = `AliExpress — ${dict.heroTitle}`;
  if (route.type === 'dynamics') heading = ui.dynamics.title(displayCountry);
  if (route.type === 'guides') heading = ui.guides.title(displayCountry);
  if (route.type === 'category') {
    const catName = dict.categories[route.slug] || route.slug;
    heading = `${catName} — ${displayCountry} (${localeConfig.currencyCode})`;
  }
  if (['privacy', 'terms', 'about', 'contact'].includes(route.type)) {
    const map = {
      privacy: dict.legal.privacyTitle,
      terms: dict.legal.termsTitle,
      about: dict.legal.aboutTitle,
      contact: dict.legal.contactTitle
    };
    heading = `${map[route.type]} — ${displayCountry}`;
  }

  const couponCardsHtml = coupons
    .map(
      (c) => `
      <article class="coupon-static-card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(dict.minSpend)}: <strong>${escapeHtml(c.localMinSpend)}</strong> (-${c.discountPct}%)</p>
        <p>${escapeHtml(ui.promoCodeLabel)} <code>${escapeHtml(c.code)}</code> (${escapeHtml(dict.verifiedBadge)})</p>
        <a href="${escapeHtml(c.affiliateLink)}" rel="noopener noreferrer sponsored">${escapeHtml(dict.btnGoStore)}</a>
      </article>`
    )
    .join('\n');

  const faqsHtml = dict.faqs
    .map(
      (f) => `
      <div class="faq-item">
        <h4>${escapeHtml(f.q)}</h4>
        <p>${escapeHtml(f.a)}</p>
      </div>`
    )
    .join('\n');

  return `
    <div class="ssg-prerendered-shell" dir="${localeConfig.rtl ? 'rtl' : 'ltr'}">
      <header>
        <nav>
          <a href="/${localeConfig.code}">${escapeHtml(ui.navAll)}</a> |
          <a href="/${localeConfig.code}/temu">${escapeHtml(ui.navTemu)}</a> |
          <a href="/${localeConfig.code}/aliexpress">${escapeHtml(ui.navAli)}</a> |
          <a href="/${localeConfig.code}/${slugs.dynamics}">${escapeHtml(ui.navDynamics)}</a> |
          <a href="/${localeConfig.code}/${slugs.guides}">${escapeHtml(ui.navGuides)}</a>
        </nav>
      </header>
      <main>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(dict.heroSubtitle)}</p>
        <section class="coupons-list">
          ${couponCardsHtml}
        </section>
        <section class="native-seo-guide">
          <h2>${escapeHtml(dict.seoGuideTitle)}</h2>
          <h3>${escapeHtml(dict.seoSection1Title)}</h3>
          <p>${escapeHtml(dict.seoSection1Body)}</p>
          <h3>${escapeHtml(dict.seoSection2Title)}</h3>
          <p>${escapeHtml(dict.seoSection2Body)}</p>
          <div class="faqs">
            ${faqsHtml}
          </div>
        </section>
      </main>
      <footer>
        <p>${escapeHtml(dict.disclosure)}</p>
        <a href="/${localeConfig.code}/${slugs.privacy}">${escapeHtml(dict.legal.privacyTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.terms}">${escapeHtml(dict.legal.termsTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.about}">${escapeHtml(dict.legal.aboutTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.contact}">${escapeHtml(dict.legal.contactTitle)}</a>
      </footer>
    </div>
  `;
}

function runPrerenderAndSitemap() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`dist directory not found at ${DIST_DIR}. Run "vite build" first.`);
  }

  const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  const routes = getAllRouteDescriptors();
  const todayIso = new Date().toISOString().split('T')[0];
  const defaultLocObj = LOCALES.find((l) => l.code === DEFAULT_LOCALE) || LOCALES[0];

  let generatedCount = 0;

  for (const localeConfig of LOCALES) {
    for (const route of routes) {
      const storeFilter = route.storeFilter || null;
      const categoryFilter = route.type === 'category' ? route.slug : null;
      const coupons = getCouponsForLocale(localeConfig.code, { storeFilter, categoryFilter });

      const routeSuffix = getRouteSuffixForLocale(route, localeConfig);
      const canonicalUrl = `${BASE_DOMAIN}/${localeConfig.code}${routeSuffix}`;

      const ui = getSectionText(localeConfig.lang);
      const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);

      let pageTitle = `${localeConfig.dict.heroTitle} | CuponesTech`;
      if (route.type === 'temu') pageTitle = `Temu — ${localeConfig.dict.heroTitle}`;
      if (route.type === 'aliexpress') pageTitle = `AliExpress — ${localeConfig.dict.heroTitle}`;
      if (route.type === 'dynamics') pageTitle = `${ui.dynamics.title(displayCountry)} | CuponesTech`;
      if (route.type === 'guides') pageTitle = `${ui.guides.title(displayCountry)} | CuponesTech`;
      if (route.type === 'category') {
        const catName = localeConfig.dict.categories[route.slug] || route.slug;
        pageTitle = `${catName} — ${displayCountry} (${localeConfig.currencyCode}) | CuponesTech`;
      }
      if (['privacy', 'terms', 'about', 'contact'].includes(route.type)) {
        const map = {
          privacy: localeConfig.dict.legal.privacyTitle,
          terms: localeConfig.dict.legal.termsTitle,
          about: localeConfig.dict.legal.aboutTitle,
          contact: localeConfig.dict.legal.contactTitle
        };
        pageTitle = `${map[route.type]} — ${displayCountry} | CuponesTech`;
      }

      const pageDesc = localeConfig.dict.heroSubtitle;

      const hreflangTags = LOCALES.map((loc) => {
        const altSuffix = getRouteSuffixForLocale(route, loc);
        return `<link rel="alternate" hreflang="${loc.code}" href="${BASE_DOMAIN}/${loc.code}${altSuffix}" />`;
      }).join('\n    ');

      const xDefaultSuffix = getRouteSuffixForLocale(route, defaultLocObj);
      const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${BASE_DOMAIN}/${DEFAULT_LOCALE}${xDefaultSuffix}" />`;
      const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

      const schemas = buildStructuredData(localeConfig, coupons, canonicalUrl);
      const schemaScripts = schemas
        .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
        .join('\n    ');

      const headInjection = [canonicalTag, hreflangTags, xDefaultTag, schemaScripts].join('\n    ');
      const staticBody = buildStaticBodyMarkup(localeConfig, route, coupons);

      const localizedHtml = templateHtml
        .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${localeConfig.code}" dir="${localeConfig.rtl ? 'rtl' : 'ltr'}">`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
        .replace(
          /<meta name="description" content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${escapeHtml(pageDesc)}" />`
        )
        .replace('<!--SEO_HEAD_INJECT-->', headInjection)
        .replace('<!--SSG_CONTENT_INJECT-->', staticBody);

      const relativeFolder = path.join(localeConfig.code, routeSuffix.replace(/^\//, ''));
      const targetFolder = path.join(DIST_DIR, relativeFolder);
      fs.mkdirSync(targetFolder, { recursive: true });
      fs.writeFileSync(path.join(targetFolder, 'index.html'), localizedHtml, 'utf-8');
      generatedCount++;
    }
  }

  // Generate Multilingual Sitemap XML with localized hreflang cross-references
  const urlEntries = [];
  for (const route of routes) {
    const xhtmlLinks = [
      ...LOCALES.map((altLoc) => {
        const altSuffix = getRouteSuffixForLocale(route, altLoc);
        return `    <xhtml:link rel="alternate" hreflang="${altLoc.code}" href="${BASE_DOMAIN}/${altLoc.code}${altSuffix}" />`;
      }),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_DOMAIN}/${DEFAULT_LOCALE}${getRouteSuffixForLocale(route, defaultLocObj)}" />`
    ].join('\n');

    for (const localeConfig of LOCALES) {
      const routeSuffix = getRouteSuffixForLocale(route, localeConfig);
      const locUrl = `${BASE_DOMAIN}/${localeConfig.code}${routeSuffix}`;
      urlEntries.push(`  <url>
    <loc>${locUrl}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${routeSuffix === '' ? '1.0' : '0.8'}</priority>
${xhtmlLinks}
  </url>`);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`;

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_DOMAIN}/sitemap.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(`[SSG + Sitemap] Generated ${generatedCount} static HTML pages across ${LOCALES.length} locales.`);
}

runPrerenderAndSitemap();
