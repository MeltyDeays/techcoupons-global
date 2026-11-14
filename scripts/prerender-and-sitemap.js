import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, BASE_DOMAIN, DEFAULT_LOCALE, CATEGORY_SLUGS, buildStructuredData, buildRouteSeoMeta } from '../src/config/locales.js';
import { INDEXNOW_KEY } from '../src/utils/indexnow.js';
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
    { type: 'contact', storeFilter: null },
    { type: 'faq', storeFilter: null }
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
  if (route.type === 'faq') return `/${slugs.faq || 'faq'}`;
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
  if (['privacy', 'terms', 'about', 'contact', 'faq'].includes(route.type)) {
    const map = {
      privacy: dict.legal.privacyTitle,
      terms: dict.legal.termsTitle,
      about: dict.legal.aboutTitle,
      contact: dict.legal.contactTitle,
      faq: `Preguntas Frecuentes (FAQ)`
    };
    heading = `${map[route.type]} — ${displayCountry}`;
  }

  const couponCardsHtml = coupons
    .map(
      (c) => `
      <article class="coupon-static-card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.discountLabel)} — ${escapeHtml(dict.minSpend)}: <strong>${escapeHtml(c.minSpendLabel)}</strong></p>
        <ul>${c.requirements.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        <p>${escapeHtml(ui.promoCodeLabel)} <code>${escapeHtml(c.code)}</code> (${escapeHtml(c.verifiedLabel)})</p>
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

  const guideBlock = `
        <section class="coupon-stacking-guide">
          <h2>${escapeHtml(dict.seoGuideTitle)}</h2>
          <h3>${escapeHtml(dict.seoSection1Title)}</h3>
          <p>${escapeHtml(dict.seoSection1Body)}</p>
          <h3>${escapeHtml(dict.seoSection2Title)}</h3>
          <p>${escapeHtml(dict.seoSection2Body)}</p>
        </section>`;

  const faqBlock = `
        <section class="country-faq">
          <h2>FAQ — ${escapeHtml(displayCountry)}</h2>
          <div class="faqs">
            ${faqsHtml}
          </div>
        </section>`;

  let sectionContent = '';
  if (['home', 'temu', 'aliexpress', 'category', 'guides', 'faq'].includes(route.type)) {
    sectionContent = `${guideBlock}\n${faqBlock}`;
  }

  const categoriesNavHtml = CATEGORY_SLUGS.map((catSlug) => {
    const catPath = getLocalizedCategoryPath(localeConfig, route.storeFilter || 'all', catSlug);
    const catLabel = dict.categories?.[catSlug] || catSlug;
    return `<a href="${escapeHtml(catPath)}">${escapeHtml(catLabel)}</a>`;
  }).join(' |\n          ');

  const regionsLinksHtml = LOCALES.map(
    (loc) => `<a href="/${loc.code}">${escapeHtml(getLocalizedCountryName(loc, localeConfig.lang))} (${loc.currencyCode})</a>`
  ).join(' |\n          ');

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
        <nav class="categories-nav">
          ${categoriesNavHtml}
        </nav>
      </header>
      <main>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(dict.heroSubtitle)}</p>
        <section class="coupons-list">
          ${couponCardsHtml}
        </section>
        ${sectionContent}
        <section class="regions-directory">
          <h2>${escapeHtml(ui.regionsCountLabel ? ui.regionsCountLabel(LOCALES.length) : `${LOCALES.length} regions`)}</h2>
          <nav>
            ${regionsLinksHtml}
          </nav>
        </section>
      </main>
      <footer>
        <p>${escapeHtml(dict.disclosure)}</p>
        <a href="/${localeConfig.code}/${slugs.faq || 'faq'}">${escapeHtml(ui.navFaq || 'FAQ')}</a> |
        <a href="/${localeConfig.code}/${slugs.privacy}">${escapeHtml(dict.legal.privacyTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.terms}">${escapeHtml(dict.legal.termsTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.about}">${escapeHtml(dict.legal.aboutTitle)}</a> |
        <a href="/${localeConfig.code}/${slugs.contact}">${escapeHtml(dict.legal.contactTitle)}</a>
      </footer>
    </div>
  `;
}

function getRouteSeoMeta(routeType) {
  if (routeType === 'home') return { rank: 1, priority: '1.0', changefreq: 'daily' };
  if (routeType === 'temu' || routeType === 'aliexpress') return { rank: 2, priority: '0.9', changefreq: 'daily' };
  if (routeType === 'category') return { rank: 3, priority: '0.8', changefreq: 'daily' };
  if (['dynamics', 'guides', 'faq'].includes(routeType)) return { rank: 4, priority: '0.7', changefreq: 'weekly' };
  return { rank: 5, priority: '0.3', changefreq: 'monthly' };
}

function buildLocalizedHtml(templateHtml, localeConfig, route, coupons, canonicalUrl, defaultLocObj) {
  const seoMeta = buildRouteSeoMeta(localeConfig, route);
  const pageTitle = seoMeta.title;
  const pageDesc = seoMeta.description;

  const hreflangTags = LOCALES.map((loc) => {
    const altSuffix = getRouteSuffixForLocale(route, loc);
    return `<link rel="alternate" hreflang="${loc.code}" href="${BASE_DOMAIN}/${loc.code}${altSuffix}" data-dynamic-hreflang="true" />`;
  }).join('\n    ');

  const xDefaultSuffix = getRouteSuffixForLocale(route, defaultLocObj);
  const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${BASE_DOMAIN}/${DEFAULT_LOCALE}${xDefaultSuffix}" data-dynamic-hreflang="true" />`;
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  const keywordsTag = `<meta name="keywords" content="${escapeHtml(seoMeta.keywords)}" data-dynamic-meta="true" />`;
  const robotsTag = `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  const ogTags = [
    `<meta property="og:type" content="website" data-dynamic-og="true" />`,
    `<meta property="og:site_name" content="CuponesTech" data-dynamic-og="true" />`,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" data-dynamic-og="true" />`,
    `<meta property="og:description" content="${escapeHtml(pageDesc)}" data-dynamic-og="true" />`,
    `<meta property="og:url" content="${canonicalUrl}" data-dynamic-og="true" />`,
    `<meta property="og:image" content="${BASE_DOMAIN}/favicon-192x192.png" data-dynamic-og="true" />`,
    `<meta property="og:locale" content="${escapeHtml(seoMeta.ogLocale)}" data-dynamic-og="true" />`,
    `<meta name="twitter:card" content="summary" data-dynamic-og="true" />`,
    `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" data-dynamic-og="true" />`,
    `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" data-dynamic-og="true" />`
  ].join('\n    ');

  const schemas = buildStructuredData(localeConfig, coupons, canonicalUrl, route);
  const schemaScripts = schemas
    .map((s) => `<script type="application/ld+json" data-dynamic-schema="true">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  const headInjection = [canonicalTag, robotsTag, keywordsTag, ogTags, hreflangTags, xDefaultTag, schemaScripts].join('\n    ');
  const staticBody = buildStaticBodyMarkup(localeConfig, route, coupons);

  return templateHtml
    .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${localeConfig.code}" dir="${localeConfig.rtl ? 'rtl' : 'ltr'}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(pageDesc)}" />`
    )
    .replace('<!--SEO_HEAD_INJECT-->', headInjection)
    .replace('<!--SSG_CONTENT_INJECT-->', staticBody);
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
      const localizedHtml = buildLocalizedHtml(templateHtml, localeConfig, route, coupons, canonicalUrl, defaultLocObj);

      const relativeFolder = path.join(localeConfig.code, routeSuffix.replace(/^\//, ''));
      const targetFolder = path.join(DIST_DIR, relativeFolder);
      fs.mkdirSync(targetFolder, { recursive: true });
      fs.writeFileSync(path.join(targetFolder, 'index.html'), localizedHtml, 'utf-8');
      generatedCount++;
    }
  }

  // Prerender root index.html so https://cuponestech.tech/ serves full static SEO links & schema
  const rootCoupons = getCouponsForLocale(defaultLocObj.code, { storeFilter: null, categoryFilter: null });
  const rootHtml = buildLocalizedHtml(
    templateHtml,
    defaultLocObj,
    { type: 'home', storeFilter: null },
    rootCoupons,
    `${BASE_DOMAIN}/`,
    defaultLocObj
  );
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), rootHtml, 'utf-8');
  generatedCount++;

  // Generate compact, priority-ordered Sitemap XML (hreflang links live in HTML <head>)
  const sitemapRecords = [
    {
      loc: `${BASE_DOMAIN}/`,
      rank: 0,
      priority: '1.0',
      changefreq: 'daily'
    }
  ];

  for (const route of routes) {
    const seoMeta = getRouteSeoMeta(route.type);
    for (const localeConfig of LOCALES) {
      const routeSuffix = getRouteSuffixForLocale(route, localeConfig);
      sitemapRecords.push({
        loc: `${BASE_DOMAIN}/${localeConfig.code}${routeSuffix}`,
        ...seoMeta
      });
    }
  }

  sitemapRecords.sort((a, b) => a.rank - b.rank);

  const urlEntries = sitemapRecords.map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  );

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`;

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), sitemapXml, 'utf-8');

  const robotsTxt = [
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: Yandex',
    'Allow: /',
    '',
    'User-agent: bingbot',
    'Allow: /',
    '',
    'User-agent: DuckDuckBot',
    'Allow: /',
    '',
    'User-agent: Slurp',
    'Allow: /',
    '',
    'User-agent: Baiduspider',
    'Allow: /',
    '',
    'User-agent: Applebot',
    'Allow: /',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${BASE_DOMAIN}/sitemap.xml`,
    `Sitemap: ${BASE_DOMAIN}/sitemap-index.xml`,
    ''
  ].join('\n');

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');

  fs.writeFileSync(path.join(PUBLIC_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');

  console.log(`[SSG + Sitemap] Generated ${generatedCount} static HTML pages across ${LOCALES.length} locales (${sitemapRecords.length} URLs in sitemap.xml + IndexNow key).`);
}

runPrerenderAndSitemap();
