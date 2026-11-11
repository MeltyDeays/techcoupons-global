import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getLocaleConfig, LOCALE_MAP, DEFAULT_LOCALE, detectBrowserLocale } from './config/locales.js';
import { getCouponsForLocale } from './data/couponsGenerator.js';
import Layout, { FlagImg } from './components/Layout.jsx';
import SEOHead from './components/SEOHead.jsx';
import CouponCard from './components/CouponCard.jsx';
import NativeSEOGuide from './components/NativeSEOGuide.jsx';
import { Feather, Search, Filter, Info } from 'lucide-react';

export function RootRedirect() {
  const suggested = detectBrowserLocale();
  return <Navigate to={`/${suggested}`} replace />;
}

export function MarketCatalogPage({ storeFilter = null }) {
  const { locale, slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const { dict } = localeConfig;
  const hasTemuInCountry = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');

  const categoryFilter = slug || null;
  const coupons = getCouponsForLocale(localeConfig.code, { storeFilter, categoryFilter });

  const filteredCoupons = coupons.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.appliesToText && c.appliesToText.toLowerCase().includes(q))
    );
  });

  // Count totals preserving current category filter so user sees exact numbers
  const totalAllCount = getCouponsForLocale(localeConfig.code, { storeFilter: null, categoryFilter }).length;
  const totalTemuCount = getCouponsForLocale(localeConfig.code, { storeFilter: 'temu', categoryFilter }).length;
  const totalAliCount = getCouponsForLocale(localeConfig.code, { storeFilter: 'aliexpress', categoryFilter }).length;

  let routeSuffix = '';
  let customHeading = dict.heroTitle;

  if (storeFilter === 'temu' && categoryFilter) {
    routeSuffix = `/temu/category/${categoryFilter}`;
    customHeading = `Temu • ${dict.categories[categoryFilter] || categoryFilter} (${localeConfig.countryName})`;
  } else if (storeFilter === 'aliexpress' && categoryFilter) {
    routeSuffix = `/aliexpress/category/${categoryFilter}`;
    customHeading = `AliExpress • ${dict.categories[categoryFilter] || categoryFilter} (${localeConfig.countryName})`;
  } else if (storeFilter === 'temu') {
    routeSuffix = '/temu';
    customHeading = `Temu — ${dict.heroTitle}`;
  } else if (storeFilter === 'aliexpress') {
    routeSuffix = '/aliexpress';
    customHeading = `AliExpress — ${dict.heroTitle}`;
  } else if (categoryFilter) {
    routeSuffix = `/category/${categoryFilter}`;
    const catName = dict.categories[categoryFilter] || categoryFilter;
    customHeading = `${catName} — ${localeConfig.countryName} (${localeConfig.currencyCode})`;
  }

  return (
    <Layout localeConfig={localeConfig} activeStore={storeFilter} activeCategory={categoryFilter}>
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={routeSuffix}
        pageTitle={`${customHeading} | Old Home Cupones`}
        pageDescription={dict.heroSubtitle}
        coupons={coupons}
      />

      {/* Haibane Renmei Warm Parchment Hero Banner */}
      <section className="mb-8 rounded-3xl border border-[#DCCFC0] bg-gradient-to-br from-[#FAF6F0] via-[#F5EFE6] to-[#EAE0D2] p-6 md:p-9 shadow-[0_8px_30px_-8px_rgba(44,37,32,0.08)]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4A359]/50 bg-[#EFE6D8] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8C4328]">
          <Feather className="h-3.5 w-3.5 text-[#A85132]" />
          <FlagImg iso={localeConfig.iso} className="h-3.5 w-5" />
          <span>{localeConfig.countryName} • {localeConfig.currencyCode}</span>
        </div>

        <h1 className="mb-3 font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2C2520]">
          {customHeading}
        </h1>
        <p className="max-w-3xl text-sm md:text-base text-[#5C4F44] leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {/* Notice for countries where AliExpress ships directly and Temu requires Miami Locker */}
        {!hasTemuInCountry && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D4A359]/60 bg-[#FAF6F0] p-3.5 text-xs text-[#5C4F44]">
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-[#A85132] shrink-0" />
              <span>
                En <strong>{localeConfig.countryName}</strong>, <strong>AliExpress</strong> realiza envíos directos en {localeConfig.currencyCode}. Si deseas comprar en <strong>Temu</strong> usando un casillero en Miami, cambia a la región <strong>Estados Unidos (Casilleros Miami)</strong>.
              </span>
            </div>
            <Link
              to="/es-us/temu"
              className="shrink-0 rounded-lg bg-[#A85132] px-3 py-1.5 font-bold text-[#FAF6F0] hover:bg-[#8E4125] transition"
            >
              Ver Cupones Temu (Casillero Miami)
            </Link>
          </div>
        )}

        {/* Quick Filter & Search Bar (Preserves Category when switching Store!) */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-[#DFD2C0]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6B5E]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar cupón por categoría: Controles, Computadoras, Hogar, Wi-Fi... (${localeConfig.currencyCode})`}
              className="w-full rounded-xl border border-[#C7B6A2] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs md:text-sm text-[#2C2520] placeholder-[#8C7D70] focus:border-[#A85132] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <Filter className="h-4 w-4 text-[#7A6B5E] hidden sm:block" />
            <Link
              to={categoryFilter ? `/${localeConfig.code}/category/${categoryFilter}` : `/${localeConfig.code}`}
              className={`rounded-xl px-3.5 py-2 border transition ${
                !storeFilter
                  ? 'border-[#2C2520] bg-[#2C2520] text-[#FAF6F0]'
                  : 'border-[#C7B6A2] bg-[#FAF6F0] text-[#5C4F44] hover:text-[#2C2520]'
              }`}
            >
              Todas ({totalAllCount})
            </Link>

            {hasTemuInCountry && (
              <Link
                to={categoryFilter ? `/${localeConfig.code}/temu/category/${categoryFilter}` : `/${localeConfig.code}/temu`}
                className={`rounded-xl px-3.5 py-2 border transition ${
                  storeFilter === 'temu'
                    ? 'border-[#A85132] bg-[#A85132] text-[#FAF6F0]'
                    : 'border-[#C7B6A2] bg-[#FAF6F0] text-[#8C4328] hover:bg-[#EFE6D8]'
                }`}
              >
                Solo Temu ({totalTemuCount})
              </Link>
            )}

            <Link
              to={categoryFilter ? `/${localeConfig.code}/aliexpress/category/${categoryFilter}` : `/${localeConfig.code}/aliexpress`}
              className={`rounded-xl px-3.5 py-2 border transition ${
                storeFilter === 'aliexpress'
                  ? 'border-[#7A3B24] bg-[#7A3B24] text-[#FAF6F0]'
                  : 'border-[#C7B6A2] bg-[#FAF6F0] text-[#7A3B24] hover:bg-[#EFE6D8]'
              }`}
            >
              Solo AliExpress ({totalAliCount})
            </Link>
          </div>
        </div>
      </section>

      {/* Coupon Grid */}
      <section aria-label="Verified Coupons">
        {filteredCoupons.length === 0 ? (
          <div className="rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-8 text-center">
            <p className="font-serif text-xl font-bold text-[#2C2520] mb-2">
              No hay cupones de {storeFilter === 'temu' ? 'Temu' : 'esta selección'} directos en {localeConfig.countryName}
            </p>
            <p className="text-xs text-[#5C4F44] mb-4">
              Puedes ver los cupones de AliExpress disponibles en {localeConfig.countryName} o cambiar a Estados Unidos (Casilleros Miami) para usar Temu.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to={`/${localeConfig.code}/aliexpress`}
                className="rounded-xl bg-[#7A3B24] px-4 py-2 text-xs font-bold text-[#FAF6F0]"
              >
                Ver Cupones AliExpress en {localeConfig.countryName}
              </Link>
              <Link
                to="/es-us/temu"
                className="rounded-xl border border-[#A85132] px-4 py-2 text-xs font-bold text-[#A85132]"
              >
                Ir a Temu (Casillero Miami)
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} localeConfig={localeConfig} />
            ))}
          </div>
        )}
      </section>

      {/* Native Anti-Spam SEO Content Block */}
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
      <article className="rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-6 md:p-10 shadow-sm text-[#2C2520]">
        <h1 className="mb-4 font-serif text-3xl font-bold text-[#2C2520]">{current.title}</h1>
        <p className="text-sm md:text-base leading-relaxed text-[#5C4F44] mb-6">{current.body}</p>
        <div className="rounded-xl border border-[#D8C8B4] bg-[#F5EFE6] p-4 text-xs text-[#5C4F44] space-y-2">
          <p><strong>Región:</strong> {localeConfig.countryName} ({localeConfig.code.toUpperCase()})</p>
          <p><strong>Moneda Local:</strong> {localeConfig.currencyCode} ({localeConfig.currency})</p>
          <p><strong>Cumplimiento CPA:</strong> Atributo rel=&quot;noopener noreferrer sponsored&quot; activo en todos los enlaces salientes.</p>
        </div>
      </article>
      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}
