import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getLocaleConfig, LOCALE_MAP, DEFAULT_LOCALE, detectBrowserLocale } from './config/locales.js';
import { getCouponsForLocale } from './data/couponsGenerator.js';
import Layout from './components/Layout.jsx';
import SEOHead from './components/SEOHead.jsx';
import CouponCard from './components/CouponCard.jsx';
import NativeSEOGuide from './components/NativeSEOGuide.jsx';
import { Sparkles, Search, Filter } from 'lucide-react';

export function RootRedirect() {
  const suggested = detectBrowserLocale();
  return <Navigate to={`/${suggested}`} replace />;
}

export function MarketCatalogPage({ mode = 'all' }) {
  const { locale, slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const { dict } = localeConfig;

  const storeFilter = mode === 'temu' ? 'temu' : mode === 'aliexpress' ? 'aliexpress' : null;
  const categoryFilter = mode === 'category' ? slug : null;

  const coupons = getCouponsForLocale(localeConfig.code, { storeFilter, categoryFilter });
  const filteredCoupons = coupons.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  let routeSuffix = '';
  let customHeading = dict.heroTitle;

  if (mode === 'temu') {
    routeSuffix = '/temu';
    customHeading = `Temu — ${dict.heroTitle}`;
  } else if (mode === 'aliexpress') {
    routeSuffix = '/aliexpress';
    customHeading = `AliExpress — ${dict.heroTitle}`;
  } else if (mode === 'category' && slug) {
    routeSuffix = `/category/${slug}`;
    const catName = dict.categories[slug] || slug;
    customHeading = `${catName} — ${localeConfig.countryName} (${localeConfig.currencyCode})`;
  }

  return (
    <Layout localeConfig={localeConfig}>
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={routeSuffix}
        pageTitle={`${customHeading} | Verified Coupons 2026`}
        pageDescription={dict.heroSubtitle}
        coupons={coupons}
      />

      {/* Hero Header */}
      <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 md:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{dict.heroBadge} • {localeConfig.flag} {localeConfig.countryName}</span>
        </div>

        <h1 className="mb-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-100">
          {customHeading}
        </h1>
        <p className="max-w-3xl text-sm md:text-base text-slate-300 leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {/* Quick Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search GameSir, Wi-Fi 6, Mini PC, credit777... (${localeConfig.currencyCode})`}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            <Link
              to={`/${localeConfig.code}`}
              className={`rounded-lg px-3 py-2 border transition ${
                mode === 'all'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({getCouponsForLocale(localeConfig.code).length})
            </Link>
            <Link
              to={`/${localeConfig.code}/temu`}
              className={`rounded-lg px-3 py-2 border transition ${
                mode === 'temu'
                  ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Temu (15)
            </Link>
            <Link
              to={`/${localeConfig.code}/aliexpress`}
              className={`rounded-lg px-3 py-2 border transition ${
                mode === 'aliexpress'
                  ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              AliExpress (15)
            </Link>
          </div>
        </div>
      </section>

      {/* Coupon Grid */}
      <section aria-label="Verified Coupons">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} localeConfig={localeConfig} />
          ))}
        </div>
      </section>

      {/* Native Anti-Spam SEO Content Block (250+ Words + Shipping Table + 4 FAQs) */}
      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

export function LegalPage({ type }) {
  const { locale } = useParams();
  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }
  const localeConfig = getLocaleConfig(locale);
  const { legal } = localeConfig.dict;

  const contentMap = {
    privacy: { title: legal.privacyTitle, body: legal.privacyBody, suffix: '/privacy' },
    terms: { title: legal.termsTitle, body: legal.termsBody, suffix: '/terms' },
    about: { title: legal.aboutTitle, body: legal.aboutBody, suffix: '/about' },
    contact: { title: legal.contactTitle, body: legal.contactBody, suffix: '/contact' }
  };

  const current = contentMap[type] || contentMap.privacy;

  return (
    <Layout localeConfig={localeConfig}>
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={current.suffix}
        pageTitle={`${current.title} — ${localeConfig.countryName}`}
        pageDescription={current.body}
        coupons={[]}
      />
      <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10">
        <h1 className="mb-4 text-2xl md:text-3xl font-extrabold text-slate-100">{current.title}</h1>
        <p className="text-sm md:text-base leading-relaxed text-slate-300 mb-6">{current.body}</p>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400 space-y-2">
          <p><strong>Region:</strong> {localeConfig.flag} {localeConfig.countryName} ({localeConfig.code.toUpperCase()})</p>
          <p><strong>Currency Standard:</strong> {localeConfig.currencyCode} ({localeConfig.currency})</p>
          <p><strong>Affiliate Compliance:</strong> rel=&quot;noopener noreferrer sponsored&quot; enforced across all merchant links.</p>
        </div>
      </article>
      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}
