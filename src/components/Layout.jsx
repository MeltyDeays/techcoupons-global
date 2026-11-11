import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOCALES, CATEGORY_SLUGS } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { ShieldAlert, TicketPercent, ExternalLink, Sparkles, ChevronDown, Check, Search, CheckCircle2, Gamepad2, BookOpen } from 'lucide-react';

export function FlagImg({ iso, className = 'h-4 w-5' }) {
  if (!iso) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`}
      alt={iso.toUpperCase()}
      loading="lazy"
      className={`inline-block rounded-[3px] object-cover shadow-sm border border-[#C7B6A2]/60 shrink-0 ${className}`}
    />
  );
}

export default function Layout({ localeConfig, activeStore = null, activeCategory = null, activeSection = 'coupons', children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);
  const { dict } = localeConfig;
  const hasTemuInCountry = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRegionModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleSelect = (newLocaleCode) => {
    setRegionModalOpen(false);
    setCountrySearch('');
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      parts[0] = newLocaleCode;
      navigate('/' + parts.join('/'));
    } else {
      navigate('/' + newLocaleCode);
    }
  };

  const getCategoryPath = (slug) => {
    if (activeStore === 'temu') return `/${localeConfig.code}/temu/category/${slug}`;
    if (activeStore === 'aliexpress') return `/${localeConfig.code}/aliexpress/category/${slug}`;
    return `/${localeConfig.code}/category/${slug}`;
  };

  const getStoreResetPath = () => {
    if (activeStore === 'temu') return `/${localeConfig.code}/temu`;
    if (activeStore === 'aliexpress') return `/${localeConfig.code}/aliexpress`;
    return `/${localeConfig.code}`;
  };

  const filteredLocales = LOCALES.filter((loc) => {
    if (!countrySearch.trim()) return true;
    const q = countrySearch.toLowerCase();
    return (
      loc.countryName.toLowerCase().includes(q) ||
      loc.languageName.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q) ||
      loc.currencyCode.toLowerCase().includes(q)
    );
  });

  const isEs = localeConfig.lang === 'es';

  return (
    <div dir={localeConfig.rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-[#F6F2EA] text-[#1F1B18] font-sans">
      {/* Top Affiliate Disclosure Bar */}
      <div className="border-b border-[#DED4C6] bg-[#ECE5D8] px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] text-[#574B40]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-start sm:items-center gap-1.5 sm:gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-[#B85332] shrink-0 mt-0.5 sm:mt-0" />
            <span className="line-clamp-2 sm:line-clamp-none leading-tight sm:leading-normal">{dict.disclosure}</span>
          </div>
          <span className="hidden lg:inline-block font-mono text-[11px] font-semibold text-[#3D6352] shrink-0">
            VERIFIED CHECKOUT CODES • {LOCALES.length} COUNTRIES
          </span>
        </div>
      </div>

      {/* Responsive Mobile-First & Desktop Header */}
      <header className="sticky top-0 z-40 border-b border-[#DED4C6] bg-[#FCF9F4]/95 backdrop-blur-md shadow-[0_2px_16px_-6px_rgba(31,27,24,0.07)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2.5 sm:py-3">
          {/* Top row on mobile: Brand Logo + Country Selector (on desktop, nav sits in the middle) */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Clean Brand Logo: CuponesTech */}
            <Link
              to={`/${localeConfig.code}`}
              className="flex items-center gap-2 sm:gap-2.5 text-lg font-extrabold tracking-tight text-[#1F1B18] shrink-0"
            >
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#B85332] text-[#FCF9F4] shadow-sm">
                <TicketPercent className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="leading-none">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1F1B18]">
                  Cupones<span className="text-[#B85332]">Tech</span>
                </span>
                <span className="block text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-[#6E6055] mt-0.5">
                  cuponestech.tech
                </span>
              </div>
            </Link>

            {/* Desktop Main Navigation Pills (Hidden on small mobile, shown inline on xl) */}
            <nav className="hidden xl:flex items-center gap-1 rounded-xl border border-[#DED4C6] bg-[#F0E9DF] p-1 text-xs font-bold">
              <Link
                to={activeCategory ? `/${localeConfig.code}/category/${activeCategory}` : `/${localeConfig.code}`}
                className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap ${
                  activeSection === 'coupons' && !activeStore
                    ? 'bg-[#1F1B18] text-[#FCF9F4] shadow-sm'
                    : 'text-[#574B40] hover:text-[#1F1B18]'
                }`}
              >
                {dict.navHome}
              </Link>

              <Link
                to={activeCategory ? `/${localeConfig.code}/temu/category/${activeCategory}` : `/${localeConfig.code}/temu`}
                className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                  activeSection === 'coupons' && activeStore === 'temu'
                    ? 'bg-[#B85332] text-[#FCF9F4] shadow-sm'
                    : 'text-[#8C3D22] hover:bg-[#B85332]/10'
                }`}
              >
                <span>{dict.navTemu}</span>
              </Link>

              <Link
                to={activeCategory ? `/${localeConfig.code}/aliexpress/category/${activeCategory}` : `/${localeConfig.code}/aliexpress`}
                className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap ${
                  activeSection === 'coupons' && activeStore === 'aliexpress'
                    ? 'bg-[#7A3B24] text-[#FCF9F4] shadow-sm'
                    : 'text-[#6E3520] hover:bg-[#7A3B24]/10'
                }`}
              >
                {dict.navAli}
              </Link>

              <Link
                to={`/${localeConfig.code}/dinamicas`}
                className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                  activeSection === 'dynamics'
                    ? 'bg-[#8F5B1D] text-[#FCF9F4] shadow-sm'
                    : 'text-[#7A4D16] hover:bg-[#8F5B1D]/10'
                }`}
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>{isEs ? 'Dinámicas y Minijuegos' : 'App Mini-Games'}</span>
              </Link>

              <Link
                to={`/${localeConfig.code}/guias`}
                className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                  activeSection === 'guides'
                    ? 'bg-[#3D6352] text-[#FCF9F4] shadow-sm'
                    : 'text-[#3D6352] hover:bg-[#3D6352]/10'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{isEs ? 'Guías y Ajuste de Precio' : 'Price Adjustment Guides'}</span>
              </Link>
            </nav>

            {/* Single Clean Country & Language Selector with Real Flag */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRegionModalOpen(!regionModalOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#C7B6A2] bg-[#FCF9F4] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-[#1F1B18] shadow-sm hover:border-[#B85332] transition"
              >
                <FlagImg iso={localeConfig.iso} className="h-3.5 w-5 sm:h-4 sm:w-6" />
                <span className="max-w-[95px] sm:max-w-[140px] truncate">{localeConfig.countryName}</span>
                <span className="rounded bg-[#ECE5D8] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#574B40]">
                  {localeConfig.currencyCode}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7A6B5E]" />
              </button>

              {regionModalOpen && (
                <div className="fixed inset-x-3 top-28 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl border border-[#C7B6A2] bg-[#FCF9F4] p-3 shadow-2xl z-50">
                  <div className="mb-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7A6B5E]" />
                      <input
                        type="search"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={isEs ? 'Buscar país, idioma o moneda...' : 'Search country, language or currency...'}
                        className="w-full rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] pl-8 pr-3 py-2 text-xs text-[#1F1B18] placeholder-[#8C7D70] focus:border-[#B85332] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto grid grid-cols-1 gap-1 pr-1">
                    {filteredLocales.map((loc) => {
                      const isSelected = loc.code === localeConfig.code;
                      const onlyAli = !loc.stores?.includes('temu');
                      return (
                        <button
                          key={loc.code}
                          type="button"
                          onClick={() => handleLocaleSelect(loc.code)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition ${
                            isSelected
                              ? 'bg-[#B85332]/15 font-bold text-[#9E472A] border border-[#B85332]/30'
                              : 'hover:bg-[#ECE5D8] text-[#1F1B18]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FlagImg iso={loc.iso} className="h-4 w-6" />
                            <div className="truncate">
                              <span className="block truncate font-semibold">{loc.countryName}</span>
                              <span className="text-[10px] text-[#7A6B5E]">{loc.languageName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {onlyAli && (
                              <span className="rounded bg-[#E5DAC9] px-1.5 py-0.5 text-[9px] font-semibold text-[#574B40]">
                                AliExpress
                              </span>
                            )}
                            <span className="font-mono text-[11px] font-bold text-[#574B40]">
                              {loc.currencyCode}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#B85332]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile & Tablet Horizontal Scrollable Navigation Row (Shown below xl) */}
          <nav className="mt-2.5 flex xl:hidden items-center gap-1.5 overflow-x-auto no-scrollbar rounded-xl border border-[#DED4C6] bg-[#F0E9DF] p-1 text-xs font-bold">
            <Link
              to={activeCategory ? `/${localeConfig.code}/category/${activeCategory}` : `/${localeConfig.code}`}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition whitespace-nowrap ${
                activeSection === 'coupons' && !activeStore
                  ? 'bg-[#1F1B18] text-[#FCF9F4] shadow-sm'
                  : 'text-[#574B40]'
              }`}
            >
              {dict.navHome}
            </Link>

            <Link
              to={activeCategory ? `/${localeConfig.code}/temu/category/${activeCategory}` : `/${localeConfig.code}/temu`}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                activeSection === 'coupons' && activeStore === 'temu'
                  ? 'bg-[#B85332] text-[#FCF9F4] shadow-sm'
                  : 'text-[#8C3D22]'
              }`}
            >
              <span>{dict.navTemu}</span>
            </Link>

            <Link
              to={activeCategory ? `/${localeConfig.code}/aliexpress/category/${activeCategory}` : `/${localeConfig.code}/aliexpress`}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition whitespace-nowrap ${
                activeSection === 'coupons' && activeStore === 'aliexpress'
                  ? 'bg-[#7A3B24] text-[#FCF9F4] shadow-sm'
                  : 'text-[#6E3520]'
              }`}
            >
              {dict.navAli}
            </Link>

            <Link
              to={`/${localeConfig.code}/dinamicas`}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                activeSection === 'dynamics'
                  ? 'bg-[#8F5B1D] text-[#FCF9F4] shadow-sm'
                  : 'text-[#7A4D16]'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>{isEs ? 'Dinámicas App' : 'Mini-Games'}</span>
            </Link>

            <Link
              to={`/${localeConfig.code}/guias`}
              className={`shrink-0 rounded-lg px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap ${
                activeSection === 'guides'
                  ? 'bg-[#3D6352] text-[#FCF9F4] shadow-sm'
                  : 'text-[#3D6352]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{isEs ? 'Guías Reembolso' : 'Price Adjust'}</span>
            </Link>
          </nav>
        </div>

        {/* Category Sub-bar (Shown when browsing Coupons, strictly preserves active store!) */}
        {activeSection === 'coupons' && (
          <div className="border-t border-[#E5DAC9] bg-[#F0E9DF]/90 px-4 py-2">
            <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="font-bold text-[#574B40] shrink-0 mr-1">
                {activeStore === 'temu'
                  ? isEs ? 'Categorías solo de Temu:' : 'Temu Categories:'
                  : activeStore === 'aliexpress'
                  ? isEs ? 'Categorías solo de AliExpress:' : 'AliExpress Categories:'
                  : `${dict.navCategories}:`}
              </span>

              <Link
                to={getStoreResetPath()}
                className={`shrink-0 rounded-lg border px-3 py-1 font-bold transition ${
                  !activeCategory
                    ? 'border-[#B85332] bg-[#B85332] text-[#FCF9F4]'
                    : 'border-[#D8C8B4] bg-[#FCF9F4] text-[#574B40] hover:border-[#B85332]'
                }`}
              >
                {isEs ? 'Todas las Categorías' : 'All Categories'}
              </Link>

              {CATEGORY_SLUGS.map((slug) => {
                const isCatActive = activeCategory === slug;
                return (
                  <Link
                    key={slug}
                    to={getCategoryPath(slug)}
                    className={`shrink-0 rounded-lg border px-3 py-1 font-semibold transition ${
                      isCatActive
                        ? 'border-[#B85332] bg-[#B85332] text-[#FCF9F4] shadow-sm'
                        : 'border-[#D8C8B4] bg-[#FCF9F4] text-[#574B40] hover:border-[#B85332] hover:text-[#1F1B18]'
                    }`}
                  >
                    {dict.categories[slug]}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content + Useful Sidebar */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row gap-6 lg:gap-8 px-3 sm:px-4 py-5 sm:py-8">
        <main className="flex-1 min-w-0">{children}</main>

        {/* Sidebar (<aside>): Shows banners if active, or Useful Savings Checklist if empty */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {AFFILIATE_CONFIG.sidebarBanners.active ? (
            <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#B85332]">
                  {dict.sidebarTitle}
                </span>
                <span className="rounded bg-[#ECE5D8] px-2 py-0.5 text-[10px] font-semibold text-[#6E6055]">
                  {dict.sidebarSponsor}
                </span>
              </div>

              <div className="space-y-4">
                {AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl && (
                  <div className="rounded-xl border border-[#B85332]/40 bg-[#F6F2EA] p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#B85332]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>TEMU {localeConfig.countryName.toUpperCase()}</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#B85332] px-3 py-2 text-xs font-bold text-[#FCF9F4] hover:bg-[#9E4325] transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl && (
                  <div className="rounded-xl border border-[#7A3B24]/40 bg-[#F6F2EA] p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#7A3B24]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>ALIEXPRESS</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#7A3B24] px-3 py-2 text-xs font-bold text-[#FCF9F4] hover:bg-[#5E2C1A] transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Useful Price Adjustment & Checkout Checklist Widget */
            <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DAC9] pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D6352]">
                  {isEs ? 'Truco: Reembolso de Diferencia' : 'Tip: 30-Day Price Adjustment'}
                </span>
                <span className="rounded bg-[#3D6352]/15 px-2 py-0.5 text-[10px] font-bold text-[#3D6352]">
                  100% LEGAL
                </span>
              </div>

              <p className="text-xs leading-relaxed text-[#574B40]">
                {isEs
                  ? '¿Compraste un producto a $20 y días después el vendedor lo bajó a $15? Tanto en Temu como en AliExpress puedes reclamar los $5 de diferencia sin devolver el artículo.'
                  : 'Bought an item for $20 and the seller dropped it to $15 a few days later? Claim the $5 price difference instantly within 30 days without returning the item.'}
              </p>

              <ul className="space-y-2 text-xs text-[#1F1B18]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3D6352] shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? '1. Entra a "Tus Pedidos" dentro de los primeros 30 días.'
                      : '1. Go to "Your Orders" within 30 days of purchase.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3D6352] shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? '2. Toca el botón "Solicitar ajuste de precio" (Price Adjustment).'
                      : '2. Tap "Request Price Adjustment" on the order.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3D6352] shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? '3. Recibes la diferencia al instante en tu saldo o tarjeta.'
                      : '3. Receive the difference back instantly.'}
                  </span>
                </li>
              </ul>

              <Link
                to={`/${localeConfig.code}/guias`}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#3D6352] px-3.5 py-2.5 text-xs font-bold text-[#FCF9F4] hover:bg-[#2F4E40] transition"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{isEs ? 'Ver Guía Completa de Reembolsos' : 'Read Full Price Adjustment Guide'}</span>
              </Link>
            </div>
          )}

          {/* Global Regions Directory with Real Flag Images */}
          <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-extrabold text-[#1F1B18]">
              {isEs ? `Países e Idiomas (${LOCALES.length} Regiones)` : `Supported Countries (${LOCALES.length})`}
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 text-xs max-h-80 sm:max-h-96 overflow-y-auto pr-1">
              {LOCALES.map((loc) => (
                <Link
                  key={loc.code}
                  to={activeStore ? `/${loc.code}/${activeStore}` : `/${loc.code}`}
                  className={`flex items-center gap-2 truncate rounded-lg px-2 py-1.5 transition border ${
                    loc.code === localeConfig.code
                      ? 'bg-[#B85332]/15 border-[#B85332]/40 font-bold text-[#9E472A]'
                      : 'border-transparent text-[#574B40] hover:bg-[#ECE5D8] hover:text-[#1F1B18]'
                  }`}
                >
                  <FlagImg iso={loc.iso} className="h-3.5 w-5" />
                  <span className="truncate">{loc.countryName}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer (100% Free of Admin Button!) */}
      <footer className="mt-12 border-t border-[#DED4C6] bg-[#ECE5D8] px-4 py-8 text-xs text-[#574B40]">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FlagImg iso={localeConfig.iso} className="h-5 w-7" />
            <div>
              <p className="font-display text-sm font-bold text-[#1F1B18]">
                CuponesTech (cuponestech.tech) — {localeConfig.countryName} ({localeConfig.currencyCode})
              </p>
              <p className="mt-0.5 text-[#6E6055]">{dict.disclosure}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-semibold text-[#574B40]">
            <Link to={`/${localeConfig.code}/guias`} className="hover:text-[#B85332]">
              {isEs ? 'Guías de Compra' : 'Shopping Guides'}
            </Link>
            <Link to={`/${localeConfig.code}/dinamicas`} className="hover:text-[#B85332]">
              {isEs ? 'Dinámicas App' : 'App Activities'}
            </Link>
            <Link to={`/${localeConfig.code}/privacy`} className="hover:text-[#B85332]">
              {dict.legal.privacyTitle}
            </Link>
            <Link to={`/${localeConfig.code}/terms`} className="hover:text-[#B85332]">
              {dict.legal.termsTitle}
            </Link>
            <Link to={`/${localeConfig.code}/about`} className="hover:text-[#B85332]">
              {dict.legal.aboutTitle}
            </Link>
            <Link to={`/${localeConfig.code}/contact`} className="hover:text-[#B85332]">
              {dict.legal.contactTitle}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
