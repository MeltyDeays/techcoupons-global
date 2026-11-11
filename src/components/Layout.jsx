import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOCALES, CATEGORY_SLUGS } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { ShieldAlert, Feather, ExternalLink, Sparkles, ChevronDown, Check } from 'lucide-react';

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

export default function Layout({ localeConfig, activeStore = null, activeCategory = null, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const { dict } = localeConfig;
  const hasTemuInCountry = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');

  const handleLocaleSelect = (newLocaleCode) => {
    setRegionModalOpen(false);
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      parts[0] = newLocaleCode;
      navigate('/' + parts.join('/'));
    } else {
      navigate('/' + newLocaleCode);
    }
  };

  // Build category URL preserving active store!
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

  return (
    <div dir={localeConfig.rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-[#F5EFE6] text-[#2C2520] font-sans">
      {/* Top Affiliate Disclosure Bar (Warm Old Home Parchment Header) */}
      <div className="border-b border-[#DCCFC0] bg-[#EAE0D2] px-4 py-2 text-xs text-[#5C4F44]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-[#A85132] shrink-0" />
            <span>{dict.disclosure}</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#4F6857] shrink-0">
            <FlagImg iso={localeConfig.iso} className="h-3.5 w-5" />
            <span>{localeConfig.countryName.toUpperCase()} • {localeConfig.currencyCode}</span>
          </span>
        </div>
      </div>

      {/* Main Haibane Renmei Inspired Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCCFC0] bg-[#FAF6F0]/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(44,37,32,0.08)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          {/* Brand Logo with Feather & Halo Motif */}
          <Link
            to={`/${localeConfig.code}`}
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#2C2520]"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE6D8] border-2 border-[#D4A359] text-[#A85132] shadow-inner">
              <Feather className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wide text-[#2C2520]">
                OLD HOME <span className="text-[#A85132] italic">Cupones</span>
              </span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#EFE6D8] border border-[#D8C8B4] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#5C4F44]">
                <FlagImg iso={localeConfig.iso} className="h-3 w-4" />
                {localeConfig.code.toUpperCase()}
              </span>
            </div>
          </Link>

          {/* Store Filter Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#D8C8B4] bg-[#EFE6D8]/80 p-1 text-xs md:text-sm font-semibold">
            <Link
              to={activeCategory ? `/${localeConfig.code}/category/${activeCategory}` : `/${localeConfig.code}`}
              className={`rounded-full px-3.5 py-1.5 transition ${
                !activeStore
                  ? 'bg-[#2C2520] text-[#FAF6F0] shadow-sm'
                  : 'text-[#5C4F44] hover:text-[#2C2520]'
              }`}
            >
              {dict.navHome}
            </Link>

            <Link
              to={activeCategory ? `/${localeConfig.code}/temu/category/${activeCategory}` : `/${localeConfig.code}/temu`}
              className={`rounded-full px-3.5 py-1.5 transition flex items-center gap-1.5 ${
                activeStore === 'temu'
                  ? 'bg-[#A85132] text-[#FAF6F0] shadow-sm'
                  : 'text-[#8C4328] hover:bg-[#A85132]/10'
              }`}
            >
              <span>{dict.navTemu}</span>
              {!hasTemuInCountry && (
                <span className="rounded bg-[#D4A359]/30 px-1.5 py-0.2 text-[9px] text-[#6E4715]">
                  Casillero
                </span>
              )}
            </Link>

            <Link
              to={activeCategory ? `/${localeConfig.code}/aliexpress/category/${activeCategory}` : `/${localeConfig.code}/aliexpress`}
              className={`rounded-full px-3.5 py-1.5 transition ${
                activeStore === 'aliexpress'
                  ? 'bg-[#7A3B24] text-[#FAF6F0] shadow-sm'
                  : 'text-[#6E3520] hover:bg-[#7A3B24]/10'
              }`}
            >
              {dict.navAli}
            </Link>
          </nav>

          {/* Visual Country & Language Selector Button with Flag */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRegionModalOpen(!regionModalOpen)}
              className="flex items-center gap-2.5 rounded-xl border border-[#C7B6A2] bg-[#FAF6F0] px-3.5 py-2 text-xs font-bold text-[#2C2520] shadow-sm hover:border-[#A85132] transition"
            >
              <FlagImg iso={localeConfig.iso} className="h-4 w-6" />
              <span className="max-w-[150px] truncate">{localeConfig.countryName}</span>
              <span className="rounded bg-[#EFE6D8] px-1.5 py-0.5 font-mono text-[10px] text-[#6E6055]">
                {localeConfig.currencyCode}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#7A6B5E]" />
            </button>

            {/* Dropdown Matrix of 30 Countries with Real Flags */}
            {regionModalOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto rounded-2xl border border-[#C7B6A2] bg-[#FAF6F0] p-3 shadow-2xl z-50">
                <div className="mb-2 flex items-center justify-between border-b border-[#E5DAC9] pb-2 px-1">
                  <span className="font-serif text-sm font-bold text-[#2C2520]">
                    Selecciona tu País e Idioma ({LOCALES.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegionModalOpen(false)}
                    className="text-xs font-semibold text-[#A85132]"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {LOCALES.map((loc) => {
                    const isSelected = loc.code === localeConfig.code;
                    const onlyAli = !loc.stores?.includes('temu');
                    return (
                      <button
                        key={loc.code}
                        type="button"
                        onClick={() => handleLocaleSelect(loc.code)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition ${
                          isSelected
                            ? 'bg-[#A85132]/15 font-bold text-[#9E472A] border border-[#A85132]/30'
                            : 'hover:bg-[#EFE6D8] text-[#2C2520]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FlagImg iso={loc.iso} className="h-4 w-6" />
                          <div className="truncate">
                            <span className="block truncate">{loc.countryName}</span>
                            <span className="text-[10px] text-[#7A6B5E]">{loc.languageName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onlyAli && (
                            <span className="rounded bg-[#E5DAC9] px-1.5 py-0.5 text-[9px] font-semibold text-[#5C4F44]">
                              AliExpress Directo
                            </span>
                          )}
                          <span className="font-mono text-[11px] font-bold text-[#5C4F44]">
                            {loc.currencyCode}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#A85132]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Sub-bar (Strictly Preserves Active Store Context!) */}
        <div className="border-t border-[#E5DAC9] bg-[#F0E7DA]/80 px-4 py-2.5">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="font-serif text-sm font-bold italic text-[#6E6055] shrink-0 mr-1">
              {activeStore === 'temu'
                ? 'Categorías de Temu:'
                : activeStore === 'aliexpress'
                ? 'Categorías de AliExpress:'
                : `${dict.navCategories}:`}
            </span>

            <Link
              to={getStoreResetPath()}
              className={`shrink-0 rounded-full border px-3 py-1 font-semibold transition ${
                !activeCategory
                  ? 'border-[#A85132] bg-[#A85132] text-[#FAF6F0]'
                  : 'border-[#D8C8B4] bg-[#FAF6F0] text-[#5C4F44] hover:border-[#A85132]'
              }`}
            >
              {localeConfig.lang === 'es' ? 'Todas las Categorías' : 'All Categories'}
            </Link>

            {CATEGORY_SLUGS.map((slug) => {
              const isCatActive = activeCategory === slug;
              return (
                <Link
                  key={slug}
                  to={getCategoryPath(slug)}
                  className={`shrink-0 rounded-full border px-3.5 py-1 font-semibold transition ${
                    isCatActive
                      ? 'border-[#A85132] bg-[#A85132] text-[#FAF6F0] shadow-sm'
                      : 'border-[#D8C8B4] bg-[#FAF6F0] text-[#5C4F44] hover:border-[#A85132] hover:text-[#2C2520]'
                  }`}
                >
                  {dict.categories[slug]}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content + Clean Static Sidebar (<aside>) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row gap-8 px-4 py-8">
        <main className="flex-1 min-w-0">{children}</main>

        {/* Clean Monetization Sidebar (<aside>) */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {AFFILIATE_CONFIG.sidebarBanners.active ? (
            <div className="rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-[#9E472A]">
                  {dict.sidebarTitle}
                </span>
                <span className="rounded bg-[#EFE6D8] px-2 py-0.5 text-[10px] text-[#6E6055]">
                  {dict.sidebarSponsor}
                </span>
              </div>

              <div className="space-y-4">
                {AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl && (
                  <div className="rounded-xl border border-[#C26D4A]/40 bg-[#F5EFE6] p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#A85132]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>TEMU {localeConfig.countryName.toUpperCase()}</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#A85132] px-3 py-2 text-xs font-bold text-[#FAF6F0] hover:bg-[#8E4125] transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl && (
                  <div className="rounded-xl border border-[#8C4A32]/40 bg-[#F5EFE6] p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#7A3B24]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>ALIEXPRESS</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#7A3B24] px-3 py-2 text-xs font-bold text-[#FAF6F0] hover:bg-[#5E2C1A] transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#C7B6A2] bg-[#FAF6F0]/60 p-5 text-center">
              <span className="block font-serif text-sm font-bold text-[#6E6055]">
                {dict.sidebarTitle}
              </span>
              <p className="mt-1 text-[11px] text-[#7A6B5E]">
                Espacio limpio reservado para cuando actives tus enlaces de Admitad / AliExpress Portals.
              </p>
            </div>
          )}

          {/* Regional Coverage Directory with Real Flag Images */}
          <div className="rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-5 shadow-sm">
            <h3 className="mb-3 font-serif text-base font-bold text-[#2C2520]">
              Países e Idiomas ({LOCALES.length} Mercados)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs max-h-96 overflow-y-auto pr-1">
              {LOCALES.map((loc) => (
                <Link
                  key={loc.code}
                  to={activeStore ? `/${loc.code}/${activeStore}` : `/${loc.code}`}
                  className={`flex items-center gap-2 truncate rounded-lg px-2.5 py-1.5 transition border ${
                    loc.code === localeConfig.code
                      ? 'bg-[#A85132]/15 border-[#A85132]/40 font-bold text-[#9E472A]'
                      : 'border-transparent text-[#5C4F44] hover:bg-[#EFE6D8] hover:text-[#2C2520]'
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

      {/* Footer */}
      <footer className="mt-12 border-t border-[#DCCFC0] bg-[#EAE0D2] px-4 py-8 text-xs text-[#5C4F44]">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FlagImg iso={localeConfig.iso} className="h-5 w-7" />
            <div>
              <p className="font-serif text-base font-bold text-[#2C2520]">
                OLD HOME CUPONES — {localeConfig.countryName} ({localeConfig.currencyCode})
              </p>
              <p className="mt-0.5 text-[#6E6055]">{dict.disclosure}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-semibold text-[#5C4F44]">
            <Link to={`/${localeConfig.code}/privacy`} className="hover:text-[#A85132]">
              {dict.legal.privacyTitle}
            </Link>
            <Link to={`/${localeConfig.code}/terms`} className="hover:text-[#A85132]">
              {dict.legal.termsTitle}
            </Link>
            <Link to={`/${localeConfig.code}/about`} className="hover:text-[#A85132]">
              {dict.legal.aboutTitle}
            </Link>
            <Link to={`/${localeConfig.code}/contact`} className="hover:text-[#A85132]">
              {dict.legal.contactTitle}
            </Link>
            <Link to="/admin" className="rounded-lg border border-[#C7B6A2] bg-[#FAF6F0] px-2.5 py-1 text-[#A85132] hover:bg-[#EFE6D8] font-mono">
              Admin Panel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
