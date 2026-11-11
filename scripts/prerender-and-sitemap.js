import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, BASE_DOMAIN, DEFAULT_LOCALE, CATEGORY_SLUGS, buildStructuredData } from '../src/config/locales.js';
import { getCouponsForLocale } from '../src/data/couponsGenerator.js';

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
    { suffix: '', type: 'home', storeFilter: null },
    { suffix: '/temu', type: 'temu', storeFilter: 'temu' },
    { suffix: '/aliexpress', type: 'aliexpress', storeFilter: 'aliexpress' },
    { suffix: '/privacy', type: 'privacy', storeFilter: null },
    { suffix: '/terms', type: 'terms', storeFilter: null },
    { suffix: '/about', type: 'about', storeFilter: null },
    { suffix: '/contact', type: 'contact', storeFilter: null }
  ];

  CATEGORY_SLUGS.forEach((slug) => {
    routes.push({ suffix: `/category/${slug}`, type: 'category', storeFilter: null, slug });
    routes.push({ suffix: `/temu/category/${slug}`, type: 'category', storeFilter: 'temu', slug });
    routes.push({ suffix: `/aliexpress/category/${slug}`, type: 'category', storeFilter: 'aliexpress', slug });
  });

  return routes;
}

function buildStaticBodyMarkup(localeConfig, route, coupons) {
  const { dict } = localeConfig;
  let heading = dict.heroTitle;
  if (route.type === 'temu') heading = `Temu — ${dict.heroTitle}`;
  if (route.type === 'aliexpress') heading = `AliExpress — ${dict.heroTitle}`;
  if (route.type === 'category') {
    const catName = dict.categories[route.slug] || route.slug;
    heading = `${catName} — ${localeConfig.countryName} (${localeConfig.currencyCode})`;
  }
  if (['privacy', 'terms', 'about', 'contact'].includes(route.type)) {
    const map = {
      privacy: dict.legal.privacyTitle,
      terms: dict.legal.termsTitle,
      about: dict.legal.aboutTitle,
      contact: dict.legal.contactTitle
    };
    heading = `${map[route.type]} — ${localeConfig.countryName}`;
  }

  const couponCardsHtml = coupons
    .map(
      (c) => `
      <article class="coupon-static-card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(dict.minSpend)}: <strong>${escapeHtml(c.localMinSpend)}</strong> | Price: <strong>${escapeHtml(c.localPrice)}</strong> (-${c.discountPct}%)</p>
        <p>Promo Code: <code>${escapeHtml(c.code)}</code> (${escapeHtml(dict.verifiedBadge)})</p>
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
        <p>${escapeHtml(dict.disclosure)}</p>
        <nav>
          <a href="/${localeConfig.code}">${escapeHtml(dict.navHome)}</a> |
          <a href="/${localeConfig.code}/temu">${escapeHtml(dict.navTemu)}</a> |
          <a href="/${localeConfig.code}/aliexpress">${escapeHtml(dict.navAli)}</a>
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
        <a href="/${localeConfig.code}/privacy">${escapeHtml(dict.legal.privacyTitle)}</a> |
        <a href="/${localeConfig.code}/terms">${escapeHtml(dict.legal.termsTitle)}</a> |
        <a href="/${localeConfig.code}/about">${escapeHtml(dict.legal.aboutTitle)}</a> |
        <a href="/${localeConfig.code}/contact">${escapeHtml(dict.legal.contactTitle)}</a>
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

  let generatedCount = 0;

  for (const localeConfig of LOCALES) {
    for (const route of routes) {
      const storeFilter = route.storeFilter || null;
      const categoryFilter = route.type === 'category' ? route.slug : null;
      const coupons = getCouponsForLocale(localeConfig.code, { storeFilter, categoryFilter });

      const canonicalUrl = `${BASE_DOMAIN}/${localeConfig.code}${route.suffix}`;
      let pageTitle = `${localeConfig.dict.heroTitle} | Temu & AliExpress`;
      if (route.type === 'temu') pageTitle = `Temu — ${localeConfig.dict.heroTitle}`;
      if (route.type === 'aliexpress') pageTitle = `AliExpress — ${localeConfig.dict.heroTitle}`;
      if (route.type === 'category') {
        const catName = localeConfig.dict.categories[route.slug] || route.slug;
        pageTitle = `${catName} — ${localeConfig.countryName} (${localeConfig.currencyCode})`;
      }

      const pageDesc = localeConfig.dict.heroSubtitle;

      // Hreflang matrix tags
      const hreflangTags = LOCALES.map(
        (loc) => `<link rel="alternate" hreflang="${loc.code}" href="${BASE_DOMAIN}/${loc.code}${route.suffix}" />`
      ).join('\n    ');
      const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${BASE_DOMAIN}/${DEFAULT_LOCALE}${route.suffix}" />`;
      const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

      // JSON-LD Schemas
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

      const relativeFolder = path.join(localeConfig.code, route.suffix.replace(/^\//, ''));
      const targetFolder = path.join(DIST_DIR, relativeFolder);
      fs.mkdirSync(targetFolder, { recursive: true });
      fs.writeFileSync(path.join(targetFolder, 'index.html'), localizedHtml, 'utf-8');
      generatedCount++;
    }
  }

  // Generate Multilingual Sitemap XML with xhtml:link cross-references
  const urlEntries = [];
  for (const route of routes) {
    const xhtmlLinks = [
      ...LOCALES.map(
        (altLoc) =>
          `    <xhtml:link rel="alternate" hreflang="${altLoc.code}" href="${BASE_DOMAIN}/${altLoc.code}${route.suffix}" />`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_DOMAIN}/${DEFAULT_LOCALE}${route.suffix}" />`
    ].join('\n');

    for (const localeConfig of LOCALES) {
      const locUrl = `${BASE_DOMAIN}/${localeConfig.code}${route.suffix}`;
      urlEntries.push(`  <url>
    <loc>${locUrl}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route.suffix === '' ? '1.0' : '0.8'}</priority>
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
