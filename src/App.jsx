import React, { useState } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import {
  getLocaleConfig,
  LOCALE_MAP,
  DEFAULT_LOCALE,
  detectBrowserLocale,
  formatLocalPrice,
  CATEGORY_SLUGS
} from './config/locales.js';
import { getCouponsForLocale } from './data/couponsGenerator.js';
import {
  getSectionText,
  getLocalizedPath,
  getLocalizedCategoryPath,
  resolveCanonicalCategory,
  getRouteSlugsForLang,
  getLocalizedCountryName
} from './data/multilingualSections.js';
import { AFFILIATE_CONFIG } from './config/affiliateConfig.js';
import Layout from './components/Layout.jsx';
import SEOHead from './components/SEOHead.jsx';
import CouponCard from './components/CouponCard.jsx';
import NativeSEOGuide from './components/NativeSEOGuide.jsx';
import EventCountdownBanner from './components/EventCountdownBanner.jsx';
import {
  Search,
  Info,
  Copy,
  Check,
  Gamepad2,
  BadgeDollarSign,
  Layers,
  Truck,
  LayoutGrid,
  Monitor,
  Home,
  Wifi,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  X,
  Shirt,
  Sparkles,
  Wrench,
  Puzzle,
  Bike,
  PawPrint,
  Baby
} from 'lucide-react';

const CATEGORY_ICONS = {
  'moda-ropa': Shirt,
  'smart-home': Home,
  'belleza-cuidado': Sparkles,
  'tech-gadgets': Monitor,
  'accesorios-moviles': Smartphone,
  'perifericos-gaming': Gamepad2,
  'herramientas-autos': Wrench,
  'juguetes-hobbies': Puzzle,
  'deportes-outdoor': Bike,
  'mascotas': PawPrint,
  'bebes-oficina': Baby,
  'redes-wifi': Wifi
};

export function RootRedirect() {
  const suggested = detectBrowserLocale();
  return <Navigate to={`/${suggested}`} replace />;
}

export function MarketCatalogPage({ storeFilter = null }) {
  const { locale, slug } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyEvent1111, setOnlyEvent1111] = useState(false);

  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const categoryFilter = slug ? resolveCanonicalCategory(slug) : null;

  const getCategoryPath = (catSlug) => {
    if (!catSlug) {
      if (storeFilter === 'temu') return `/${localeConfig.code}/temu`;
      if (storeFilter === 'aliexpress') return `/${localeConfig.code}/aliexpress`;
      return `/${localeConfig.code}`;
    }
    return getLocalizedCategoryPath(localeConfig, storeFilter, catSlug);
  };

  const canonicalCatalogPath = getCategoryPath(categoryFilter);
  if (location.pathname.toLowerCase() !== canonicalCatalogPath.toLowerCase()) {
    return <Navigate to={canonicalCatalogPath} replace />;
  }

  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const hasTemuInCountry = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');

  const coupons = getCouponsForLocale(localeConfig.code, {
    storeFilter,
    categoryFilter,
    onlyEvent1111
  });

  const filteredCoupons = coupons.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.appliesToText && c.appliesToText.toLowerCase().includes(q))
    );
  });

  const routeSuffix = canonicalCatalogPath.slice(`/${localeConfig.code}`.length);
  let customHeading = dict.heroTitle;

  if (storeFilter === 'temu' && categoryFilter) {
    customHeading = `Temu • ${ui.catShort[categoryFilter] || dict.categories[categoryFilter]} (${displayCountry})`;
  } else if (storeFilter === 'aliexpress' && categoryFilter) {
    customHeading = `AliExpress • ${ui.catShort[categoryFilter] || dict.categories[categoryFilter]} (${displayCountry})`;
  } else if (storeFilter === 'temu') {
    customHeading = `Temu — ${dict.heroTitle}`;
  } else if (storeFilter === 'aliexpress') {
    customHeading = `AliExpress — ${dict.heroTitle}`;
  } else if (categoryFilter) {
    const catName = ui.catShort[categoryFilter] || dict.categories[categoryFilter];
    customHeading = `${catName} — ${displayCountry} (${localeConfig.currencyCode})`;
  }

  return (
    <Layout localeConfig={localeConfig} activeStore={storeFilter} activeCategory={categoryFilter} activeSection="coupons">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={routeSuffix}
        pageTitle={`${customHeading} | CuponesTech`}
        pageDescription={dict.heroSubtitle}
        coupons={coupons}
      />

      {/* Automatic Event Calendar & 11.11 Live Countdown Banner */}
      <EventCountdownBanner
        localeConfig={localeConfig}
        onlyEvent1111={onlyEvent1111}
        onToggleEvent1111={() => setOnlyEvent1111((prev) => !prev)}
      />

      {/* Compact, Breathable Hero Section */}
      <section className="mb-4 sm:mb-6 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 shadow-sm">
        <h1 className="mb-1.5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F1B18] leading-snug">
          {customHeading}
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-[#574B40] leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {!hasTemuInCountry && (
          <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[#D4A359]/60 bg-[#F6F2EA] p-3 text-xs text-[#574B40]">
            <div className="flex items-start sm:items-center gap-2">
              <Info className="h-4 w-4 text-[#B85332] shrink-0 mt-0.5 sm:mt-0" />
              <span>{ui.miamiNotice(displayCountry, localeConfig.currencyCode)}</span>
            </div>
            <Link
              to={ui.usLockerTarget || '/en-us/temu'}
              className="w-full sm:w-auto text-center shrink-0 rounded-lg bg-[#B85332] px-3 py-1.5 font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition"
            >
              {ui.miamiBtn}
            </Link>
          </div>
        )}

        {/* Integrated Clean Search Bar */}
        <div className="mt-4 relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6B5E]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ui.searchPlaceholder(localeConfig.currencyCode)}
            className="w-full rounded-xl border border-[#C7B6A2] bg-[#F6F2EA] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1F1B18] placeholder-[#8C7D70] focus:border-[#B85332] focus:outline-none"
          />
        </div>
      </section>

      {/* Modern Visual Category Selector (Preserves active store: All, Temu, or AliExpress) */}
      <section aria-label="Categories" className="mb-5 sm:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <Link
            to={getCategoryPath(null)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
              !categoryFilter
                ? 'border-[#B85332] bg-[#B85332] text-[#FCF9F4] shadow-sm'
                : 'border-[#DED4C6] bg-[#FCF9F4] text-[#574B40] hover:border-[#B85332] hover:text-[#1F1B18]'
            }`}
          >
            <LayoutGrid className={`h-4 w-4 shrink-0 ${!categoryFilter ? 'text-[#FCF9F4]' : 'text-[#B85332]'}`} />
            <span className="truncate">{ui.allCategoriesChip}</span>
          </Link>

          {CATEGORY_SLUGS.map((catSlug) => {
            const Icon = CATEGORY_ICONS[catSlug] || LayoutGrid;
            const isActive = categoryFilter === catSlug;
            const label = ui.catShort[catSlug] || dict.categories[catSlug];
            return (
              <Link
                key={catSlug}
                to={getCategoryPath(catSlug)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? 'border-[#B85332] bg-[#B85332] text-[#FCF9F4] shadow-sm'
                    : 'border-[#DED4C6] bg-[#FCF9F4] text-[#574B40] hover:border-[#B85332] hover:text-[#1F1B18]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FCF9F4]' : 'text-[#B85332]'}`} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Coupon Grid */}
      <section aria-label="Verified Checkout Coupons">
        {filteredCoupons.length === 0 ? (
          <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg font-extrabold text-[#1F1B18] mb-2">
              {ui.miamiNotice(displayCountry, localeConfig.currencyCode)}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                to={`/${localeConfig.code}/aliexpress`}
                className="rounded-xl bg-[#7A3B24] px-4 py-2 text-xs font-bold text-[#FCF9F4]"
              >
                AliExpress ({displayCountry})
              </Link>
              <Link
                to={ui.usLockerTarget || '/en-us/temu'}
                className="rounded-xl border border-[#B85332] px-4 py-2 text-xs font-bold text-[#B85332]"
              >
                {ui.miamiBtn}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            {filteredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} localeConfig={localeConfig} />
            ))}
          </div>
        )}
      </section>

      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

/**
 * APARTADO EXTRA 1: DINÁMICAS, ACTIVIDADES Y MINIJUEGOS (Disponible en los 66 países y 14 idiomas)
 */
export function DynamicsPage() {
  const { locale } = useParams();
  const location = useLocation();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedDynamic, setSelectedDynamic] = useState(null);

  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const canonicalPath = getLocalizedPath(localeConfig, 'dynamics');
  if (location.pathname.toLowerCase() !== canonicalPath.toLowerCase()) {
    return <Navigate to={canonicalPath} replace />;
  }

  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const dyn = ui.dynamics;
  const routeSlugs = getRouteSlugsForLang(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);

  const temuUrl = AFFILIATE_CONFIG.temuBaseTrackingUrl || 'https://www.temu.com';
  const aliUrl = AFFILIATE_CONFIG.aliexpressBaseTrackingUrl || 'https://www.aliexpress.com';

  // Step 1: Copy command & open instruction modal FIRST (no immediate redirect)
  const handleCopyDynamic = async (item) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(item.code);
    } catch {
      // ignore
    }
    setCopiedId(item.id);
    setSelectedDynamic(item);
    setTimeout(() => setCopiedId(null), 4000);
  };

  return (
    <Layout localeConfig={localeConfig} activeSection="dynamics">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={`/${routeSlugs.dynamics}`}
        pageTitle={`${dyn.title(displayCountry)} | CuponesTech`}
        pageDescription={dyn.subtitle}
        coupons={[]}
      />

      <section className="mb-6 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#8F5B1D]/15 border border-[#8F5B1D]/30 px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#7A4D16]">
          <Gamepad2 className="h-3.5 w-3.5" />
          <span>{dyn.badge}</span>
        </div>

        <h1 className="mb-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1F1B18]">
          {dyn.title(displayCountry)}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#574B40] leading-relaxed">
          {dyn.subtitle}
        </p>
      </section>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
        {dyn.items.map((item) => {
          const isCopied = copiedId === item.id;
          const isAli = item.storeKey === 'aliexpress';
          return (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 shadow-sm"
            >
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold border ${
                      isAli
                        ? 'bg-[#7A3B24]/15 border-[#7A3B24]/30 text-[#7A3B24]'
                        : 'bg-[#8F5B1D]/15 border-[#8F5B1D]/30 text-[#7A4D16]'
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#6E6055] uppercase">
                    {item.store}
                  </span>
                </div>

                <h2 className="mb-2 text-base sm:text-lg font-extrabold text-[#1F1B18]">
                  {item.title}
                </h2>

                <p className="mb-4 rounded-xl border border-[#E5DAC9] bg-[#F3ECE2] p-3 text-xs leading-relaxed text-[#574B40]">
                  {item.howItWorks}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-xl border-2 border-dashed border-[#C7B6A2] bg-[#F6F2EA] px-3 py-2">
                  <span className="text-[10px] font-extrabold uppercase text-[#6E6055]">
                    {dyn.typeInSearch}
                  </span>
                  <code className="font-mono text-xs sm:text-sm md:text-base font-extrabold text-[#8F5B1D] select-all break-all">
                    {item.code}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyDynamic(item)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#FCF9F4] transition ${
                    isAli ? 'bg-[#7A3B24] hover:bg-[#5E2C1A]' : 'bg-[#8F5B1D] hover:bg-[#734815]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{dyn.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{dyn.copyBtn(item.store)}</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedDynamic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1B18]/60 p-4 backdrop-blur-sm font-sans"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedDynamic(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-5 sm:p-6 shadow-2xl text-[#1F1B18]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedDynamic(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#7A6B5E] hover:bg-[#ECE5D8] hover:text-[#1F1B18]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3 flex items-center gap-2 text-[#3D6352]">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <h4 className="text-base sm:text-lg font-extrabold text-[#1F1B18] pr-6">
                {dyn.copiedBtn}
              </h4>
            </div>

            <p className="mb-1.5 text-sm font-bold text-[#1F1B18]">{selectedDynamic.title}</p>
            <p className="mb-4 text-xs leading-relaxed text-[#574B40]">
              {selectedDynamic.howItWorks}
            </p>

            <div className="mb-5 flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-[#8F5B1D]/60 bg-[#F0E9DF] p-3.5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6055]">
                  {dyn.typeInSearch}
                </span>
                <code className="font-mono text-lg sm:text-xl font-extrabold tracking-wider text-[#8F5B1D] select-all">
                  {selectedDynamic.code}
                </code>
              </div>
              <span className="rounded-lg bg-[#3D6352]/15 px-2.5 py-1 text-xs font-bold text-[#3D6352]">
                {ui.copiedShort} ✓
              </span>
            </div>

            <a
              href={selectedDynamic.storeKey === 'aliexpress' ? aliUrl : temuUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setSelectedDynamic(null)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D6352] px-5 py-3.5 text-sm font-extrabold text-[#FCF9F4] shadow-md hover:bg-[#2E4D3F] transition"
            >
              <span>{dict.btnGoStore}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

/**
 * APARTADO EXTRA 2: GUÍAS DE COMPRA Y AJUSTE DE PRECIO 30 DÍAS (Disponible en los 66 países y 14 idiomas)
 */
export function GuidesPage() {
  const { locale } = useParams();
  const location = useLocation();
  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const canonicalPath = getLocalizedPath(localeConfig, 'guides');
  if (location.pathname.toLowerCase() !== canonicalPath.toLowerCase()) {
    return <Navigate to={canonicalPath} replace />;
  }

  const ui = getSectionText(localeConfig.lang);
  const g = ui.guides;
  const routeSlugs = getRouteSlugsForLang(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);

  const ex20 = formatLocalPrice(20, localeConfig);
  const ex15 = formatLocalPrice(15, localeConfig);
  const ex5 = formatLocalPrice(5, localeConfig);
  const steps = g.steps(ex20, ex15, ex5);

  return (
    <Layout localeConfig={localeConfig} activeSection="guides">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={`/${routeSlugs.guides}`}
        pageTitle={`${g.title(displayCountry)} | CuponesTech`}
        pageDescription={g.subtitle(ex20, ex15, ex5)}
        coupons={[]}
      />

      <section className="mb-6 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#3D6352]/15 border border-[#3D6352]/30 px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#3D6352]">
          <BadgeDollarSign className="h-3.5 w-3.5" />
          <span>{g.badge}</span>
        </div>

        <h1 className="mb-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1F1B18]">
          {g.title(displayCountry)}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#574B40] leading-relaxed">
          {g.subtitle(ex20, ex15, ex5)}
        </p>
      </section>

      <div className="space-y-5">
        {/* Guide 1: Price Adjustment */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#3D6352] text-[#FCF9F4] shrink-0">
              <BadgeDollarSign className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {g.g1Title}
              </h2>
              <p className="text-xs font-semibold text-[#3D6352]">{g.g1Sub}</p>
            </div>
          </div>

          <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[#574B40]">
            {g.g1Desc(localeConfig.currencyCode)}
          </p>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {steps.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-[#E5DAC9] bg-[#F6F2EA] p-3.5 sm:p-4">
                <span className="font-mono text-xs font-extrabold text-[#B85332]">{s.step}</span>
                <h3 className="mt-1 font-extrabold text-sm text-[#1F1B18]">{s.title}</h3>
                <p className="mt-1 text-xs text-[#574B40] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Guide 2: How to Stack 3 Discounts on AliExpress */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#B85332] text-[#FCF9F4] shrink-0">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {g.g2Title}
              </h2>
              <p className="text-xs font-semibold text-[#B85332]">
                {g.g2Sub(displayCountry)}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-[#574B40]">{g.g2Desc}</p>
          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#1F1B18] list-disc list-inside">
            {g.g2Bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </article>

        {/* Guide 3: Direct Shipping vs Miami Locker */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#7A3B24] text-[#FCF9F4] shrink-0">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {g.g3Title}
              </h2>
              <p className="text-xs font-semibold text-[#7A3B24]">{g.g3Sub}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-[#574B40]">
            {g.g3Desc(displayCountry)}
          </p>
        </article>
      </div>

      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

export function LegalPage({ type }) {
  const { locale } = useParams();
  const location = useLocation();
  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }
  const localeConfig = getLocaleConfig(locale);
  const canonicalPath = getLocalizedPath(localeConfig, type);
  if (location.pathname.toLowerCase() !== canonicalPath.toLowerCase()) {
    return <Navigate to={canonicalPath} replace />;
  }

  const { legal } = localeConfig.dict;
  const ui = getSectionText(localeConfig.lang);
  const routeSlugs = getRouteSlugsForLang(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);

  const contentMap = {
    privacy: { title: legal.privacyTitle, body: legal.privacyBody, suffix: `/${routeSlugs.privacy}` },
    terms: { title: legal.termsTitle, body: legal.termsBody, suffix: `/${routeSlugs.terms}` },
    about: { title: legal.aboutTitle, body: legal.aboutBody, suffix: `/${routeSlugs.about}` },
    contact: { title: legal.contactTitle, body: legal.contactBody, suffix: `/${routeSlugs.contact}` }
  };

  const current = contentMap[type] || contentMap.privacy;

  return (
    <Layout localeConfig={localeConfig} activeSection="legal">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={current.suffix}
        pageTitle={`${current.title} — ${displayCountry}`}
        pageDescription={current.body}
        coupons={[]}
      />
      <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-10 shadow-sm text-[#1F1B18] font-sans">
        <h1 className="mb-4 text-2xl md:text-3xl font-extrabold text-[#1F1B18]">{current.title}</h1>
        <p className="text-sm md:text-base leading-relaxed text-[#574B40] mb-6">{current.body}</p>
        <div className="rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] p-4 text-xs text-[#574B40] space-y-2">
          <p><strong>{ui.regionLabel}</strong> {displayCountry} ({localeConfig.code.toUpperCase()})</p>
          <p><strong>{ui.currencyLabel}</strong> {localeConfig.currencyCode} ({localeConfig.currency})</p>
          <p><strong>{ui.cpaComplianceLabel}</strong> {ui.cpaComplianceText}</p>
        </div>
      </article>
      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}
