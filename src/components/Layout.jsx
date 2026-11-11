import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOCALES, getLocaleConfig, formatLocalPrice } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import {
  getSectionText,
  getLocalizedPath,
  getLocalizedCategoryPath,
  translatePathToLocale,
  getLocalizedCountryName
} from '../data/multilingualSections.js';
import {
  ShieldAlert,
  TicketPercent,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Check,
  Search,
  Gamepad2,
  BookOpen,
  HelpCircle,
  ArrowUp,
  ChevronRight
} from 'lucide-react';

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

export default function Layout({
  localeConfig,
  activeStore = null,
  activeCategory = null,
  activeSection = 'coupons',
  children
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const activeCountryDisplay = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const hasTemuInCountry = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');

  // Auto-scroll to top on every route change so footer/sidebar links never leave the user stuck at the bottom
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRegionModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTopClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleLocaleSelect = (newLocaleCode) => {
    setRegionModalOpen(false);
    setCountrySearch('');
    const targetConfig = getLocaleConfig(newLocaleCode);
    const nextPath = translatePathToLocale(location.pathname, targetConfig);
    navigate(nextPath);
    handleScrollTopClick();
  };

  const filteredLocales = LOCALES.filter((loc) => {
    if (!countrySearch.trim()) return true;
    const q = countrySearch.toLowerCase();
    const localizedName = getLocalizedCountryName(loc, localeConfig.lang).toLowerCase();
    return (
      localizedName.includes(q) ||
      loc.countryName.toLowerCase().includes(q) ||
      loc.languageName.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q) ||
      loc.currencyCode.toLowerCase().includes(q)
    );
  });

  const ex20 = formatLocalPrice(20, localeConfig);
  const ex15 = formatLocalPrice(15, localeConfig);
  const ex5 = formatLocalPrice(5, localeConfig);

  const dynamicsUrl = getLocalizedPath(localeConfig, 'dynamics');
  const guidesUrl = getLocalizedPath(localeConfig, 'guides');
  const privacyUrl = getLocalizedPath(localeConfig, 'privacy');
  const termsUrl = getLocalizedPath(localeConfig, 'terms');
  const aboutUrl = getLocalizedPath(localeConfig, 'about');
  const contactUrl = getLocalizedPath(localeConfig, 'contact');
  const faqUrl = getLocalizedPath(localeConfig, 'faq');

  return (
    <div dir={localeConfig.rtl ? 'rtl' : 'ltr'} className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#F6F2EA] text-[#1F1B18] font-sans">
      {/* Ultra-Clean Minimalist Header */}
      <header className="sticky top-0 z-40 border-b border-[#DED4C6] bg-[#FCF9F4]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          {/* Row 1: Logo + Country Selector */}
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
            <Link
              to={`/${localeConfig.code}`}
              onClick={handleScrollTopClick}
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#1F1B18] shrink-0 focus:outline-none"
            >
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#B85332] text-[#FCF9F4] shadow-sm">
                <TicketPercent className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="font-display text-base sm:text-xl font-bold tracking-tight text-[#1F1B18]">
                Cupones<span className="text-[#B85332]">Tech</span>
              </span>
            </Link>

            {/* Desktop Inline Navigation (lg and up) */}
            <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-[#E5DAC9] bg-[#F3ECE2] p-1 text-xs font-bold">
              <Link
                to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'all', activeCategory) : `/${localeConfig.code}`}
                onClick={handleScrollTopClick}
                className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap focus:outline-none ${
                  activeSection === 'coupons' && !activeStore
                    ? 'bg-[#1F1B18] text-[#FCF9F4] shadow-sm'
                    : 'text-[#574B40] hover:text-[#1F1B18]'
                }`}
              >
                {ui.navAll}
              </Link>

              {hasTemuInCountry && (
                <Link
                  to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'temu', activeCategory) : `/${localeConfig.code}/temu`}
                  onClick={handleScrollTopClick}
                  className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap focus:outline-none ${
                    activeSection === 'coupons' && activeStore === 'temu'
                      ? 'bg-[#B85332] text-[#FCF9F4] shadow-sm'
                      : 'text-[#8C3D22] hover:bg-[#B85332]/10'
                  }`}
                >
                  {ui.navTemu}
                </Link>
              )}

              <Link
                to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'aliexpress', activeCategory) : `/${localeConfig.code}/aliexpress`}
                onClick={handleScrollTopClick}
                className={`rounded-lg px-3 py-1.5 transition whitespace-nowrap focus:outline-none ${
                  activeSection === 'coupons' && activeStore === 'aliexpress'
                    ? 'bg-[#7A3B24] text-[#FCF9F4] shadow-sm'
                    : 'text-[#6E3520] hover:bg-[#7A3B24]/10'
                }`}
              >
                {ui.navAli}
              </Link>

              <span className="h-4 w-[1px] bg-[#D8C8B4] mx-0.5" />

              <Link
                to={dynamicsUrl}
                onClick={handleScrollTopClick}
                className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap focus:outline-none ${
                  activeSection === 'dynamics'
                    ? 'bg-[#8F5B1D] text-[#FCF9F4] shadow-sm'
                    : 'text-[#7A4D16] hover:bg-[#8F5B1D]/10'
                }`}
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>{ui.navDynamics}</span>
              </Link>

              <Link
                to={guidesUrl}
                onClick={handleScrollTopClick}
                className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap focus:outline-none ${
                  activeSection === 'guides'
                    ? 'bg-[#3D6352] text-[#FCF9F4] shadow-sm'
                    : 'text-[#3D6352] hover:bg-[#3D6352]/10'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{ui.navGuides}</span>
              </Link>
            </nav>

            {/* Compact Country & Currency Selector */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRegionModalOpen(!regionModalOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] px-2.5 py-1.5 text-xs font-bold text-[#1F1B18] hover:border-[#B85332] transition focus:outline-none"
              >
                <FlagImg iso={localeConfig.iso} className="h-3.5 w-5" />
                <span className="max-w-[95px] sm:max-w-[165px] truncate">{activeCountryDisplay}</span>
                <span className="rounded bg-[#E6DDD0] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#574B40]">
                  {localeConfig.currencyCode}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7A6B5E]" />
              </button>

              {regionModalOpen && (
                <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl border border-[#C7B6A2] bg-[#FCF9F4] p-3 shadow-2xl z-50">
                  <div className="mb-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7A6B5E]" />
                      <input
                        type="search"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={`${activeCountryDisplay}, ${localeConfig.currencyCode}...`}
                        className="w-full rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] pl-8 pr-3 py-2 text-xs text-[#1F1B18] placeholder-[#8C7D70] focus:border-[#B85332] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto grid grid-cols-1 gap-1 pr-1">
                    {filteredLocales.map((loc) => {
                      const isSelected = loc.code === localeConfig.code;
                      const onlyAli = !loc.stores?.includes('temu');
                      const displayLocName = getLocalizedCountryName(loc, localeConfig.lang);
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
                              <span className="block truncate font-semibold">{displayLocName}</span>
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

          {/* Row 2 on Mobile/Tablet: Horizontally scrollable / deslizable pill bar */}
          <nav
            aria-label="Navegación principal móvil"
            className="flex lg:hidden items-center gap-2 border-t border-[#ECE5D8] py-2 text-xs font-bold overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth touch-pan-x overscroll-x-contain"
          >
            <Link
              to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'all', activeCategory) : `/${localeConfig.code}`}
              onClick={handleScrollTopClick}
              className={`shrink-0 rounded-full px-3 py-1.5 transition whitespace-nowrap focus:outline-none active:scale-95 ${
                activeSection === 'coupons' && !activeStore
                  ? 'bg-[#1F1B18] text-[#FCF9F4] shadow-sm'
                  : 'bg-[#F0E9DF] text-[#574B40] hover:bg-[#E5DAC9]'
              }`}
            >
              {ui.navAll}
            </Link>

            {hasTemuInCountry && (
              <Link
                to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'temu', activeCategory) : `/${localeConfig.code}/temu`}
                onClick={handleScrollTopClick}
                className={`shrink-0 rounded-full px-3 py-1.5 transition whitespace-nowrap focus:outline-none active:scale-95 ${
                  activeSection === 'coupons' && activeStore === 'temu'
                    ? 'bg-[#B85332] text-[#FCF9F4] shadow-sm'
                    : 'bg-[#F0E9DF] text-[#8C3D22] hover:bg-[#E5DAC9]'
                }`}
              >
                {ui.navTemu}
              </Link>
            )}

            <Link
              to={activeCategory ? getLocalizedCategoryPath(localeConfig, 'aliexpress', activeCategory) : `/${localeConfig.code}/aliexpress`}
              onClick={handleScrollTopClick}
              className={`shrink-0 rounded-full px-3 py-1.5 transition whitespace-nowrap focus:outline-none active:scale-95 ${
                activeSection === 'coupons' && activeStore === 'aliexpress'
                  ? 'bg-[#7A3B24] text-[#FCF9F4] shadow-sm'
                  : 'bg-[#F0E9DF] text-[#6E3520] hover:bg-[#E5DAC9]'
              }`}
            >
              {ui.navAli}
            </Link>

            <Link
              to={dynamicsUrl}
              onClick={handleScrollTopClick}
              className={`shrink-0 rounded-full px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap focus:outline-none active:scale-95 ${
                activeSection === 'dynamics'
                  ? 'bg-[#8F5B1D] text-[#FCF9F4] shadow-sm'
                  : 'bg-[#F0E9DF] text-[#7A4D16] hover:bg-[#E5DAC9]'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
              <span>{ui.navDynamics}</span>
            </Link>

            <Link
              to={guidesUrl}
              onClick={handleScrollTopClick}
              className={`shrink-0 rounded-full px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap focus:outline-none active:scale-95 ${
                activeSection === 'guides'
                  ? 'bg-[#3D6352] text-[#FCF9F4] shadow-sm'
                  : 'bg-[#F0E9DF] text-[#3D6352] hover:bg-[#E5DAC9]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span>{ui.navGuides}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content + Sidebar */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8 px-3 sm:px-4 py-4 sm:py-7 overflow-hidden">
        <main className="w-full max-w-full flex-1 min-w-0 overflow-hidden">{children}</main>

        <aside className="w-full max-w-full lg:w-80 shrink-0 min-w-0 space-y-5">
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
            /* Localized 30-Day Price Adjustment Quick Widget */
            <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E5DAC9] pb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D6352]">
                  {ui.navGuides}
                </span>
                <span className="rounded bg-[#3D6352]/15 px-2 py-0.5 text-[10px] font-bold text-[#3D6352]">
                  {ui.days30Badge}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-[#574B40]">
                {ui.guides.subtitle(ex20, ex15, ex5)}
              </p>

              <Link
                to={guidesUrl}
                onClick={handleScrollTopClick}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#3D6352] px-3.5 py-2.5 text-xs font-bold text-[#FCF9F4] hover:bg-[#2F4E40] transition focus:outline-none"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{ui.navGuides}</span>
              </Link>
            </div>
          )}

          {/* Global Regions Directory */}
          <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#574B40]">
              {activeCountryDisplay} • {ui.regionsCountLabel(LOCALES.length)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 text-xs max-h-72 overflow-y-auto pr-1">
              {LOCALES.map((loc) => (
                <Link
                  key={loc.code}
                  to={translatePathToLocale(location.pathname, loc)}
                  onClick={handleScrollTopClick}
                  className={`flex items-center gap-2 truncate rounded-lg px-2 py-1.5 transition border focus:outline-none ${
                    loc.code === localeConfig.code
                      ? 'bg-[#B85332]/15 border-[#B85332]/40 font-bold text-[#9E472A]'
                      : 'border-transparent text-[#574B40] hover:bg-[#ECE5D8] hover:text-[#1F1B18]'
                  }`}
                >
                  <FlagImg iso={loc.iso} className="h-3.5 w-5" />
                  <span className="truncate">{getLocalizedCountryName(loc, localeConfig.lang)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Redesigned Structured Footer (Auto-scrolls to top & uses localized URLs per language) */}
      <footer className="mt-12 border-t border-[#D8C8B4] bg-[#ECE5D8] px-3 sm:px-4 py-8 sm:py-10 text-xs text-[#574B40]">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Structured 3-Column Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Col 1: Brand, Active Region & Back to Top */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Link
                    to={`/${localeConfig.code}`}
                    onClick={handleScrollTopClick}
                    className="flex items-center gap-2 font-display text-base font-bold text-[#1F1B18] focus:outline-none"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B85332] text-[#FCF9F4]">
                      <TicketPercent className="h-4 w-4" />
                    </span>
                    <span>
                      Cupones<span className="text-[#B85332]">Tech</span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleScrollTopClick}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B4] bg-[#F6F2EA] hover:border-[#B85332] px-2.5 py-1 text-[11px] font-bold text-[#1F1B18] transition focus:outline-none"
                  >
                    <ArrowUp className="h-3 w-3 text-[#B85332]" />
                    <span>{ui.topBtn}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#F3ECE2] px-3 py-2 border border-[#E5DAC9] mb-3">
                  <FlagImg iso={localeConfig.iso} className="h-4 w-6" />
                  <span className="font-bold text-[#1F1B18] truncate">
                    {activeCountryDisplay} ({localeConfig.currencyCode})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-[#F6F2EA] p-2.5 border border-[#E5DAC9] text-[11px] leading-relaxed text-[#6E6055]">
                <ShieldAlert className="h-4 w-4 text-[#B85332] shrink-0 mt-0.5" />
                <span>{ui.disclosureShort}</span>
              </div>
            </div>

            {/* Col 2: Quick Navigation & Guides */}
            <div className="rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm">
              <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#B85332]">
                {ui.navAll} & {ui.navGuides}
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                <Link
                  to={`/${localeConfig.code}`}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#1F1B18] bg-[#F6F2EA] hover:bg-[#ECE5D8] transition focus:outline-none"
                >
                  <span>{ui.navAll}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#7A6B5E]" />
                </Link>

                {hasTemuInCountry && (
                  <Link
                    to={`/${localeConfig.code}/temu`}
                    onClick={handleScrollTopClick}
                    className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#8C3D22] bg-[#F6F2EA] hover:bg-[#ECE5D8] transition focus:outline-none"
                  >
                    <span>{ui.navTemu}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#7A6B5E]" />
                  </Link>
                )}

                <Link
                  to={`/${localeConfig.code}/aliexpress`}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#7A3B24] bg-[#F6F2EA] hover:bg-[#ECE5D8] transition focus:outline-none"
                >
                  <span>{ui.navAli}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={dynamicsUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#7A4D16] bg-[#F6F2EA] hover:bg-[#ECE5D8] transition focus:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <Gamepad2 className="h-3.5 w-3.5 text-[#8F5B1D]" />
                    {ui.navDynamics}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={guidesUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#3D6352] bg-[#F6F2EA] hover:bg-[#ECE5D8] transition focus:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#3D6352]" />
                    {ui.navGuides}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#7A6B5E]" />
                </Link>
              </div>
            </div>

            {/* Col 3: Legal, Privacy & Contact */}
            <div className="rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-4 sm:p-5 shadow-sm">
              <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#3D6352]">
                {ui.legalHeader}
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                <Link
                  to={faqUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-bold text-[#B85332] bg-[#F6F2EA] hover:bg-[#ECE5D8] hover:text-[#9E4224] transition focus:outline-none"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <HelpCircle className="h-3.5 w-3.5 shrink-0 text-[#B85332]" />
                    {ui.navFaq || 'Preguntas Frecuentes (FAQ)'}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={privacyUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-[#574B40] bg-[#F6F2EA] hover:bg-[#ECE5D8] hover:text-[#1F1B18] transition focus:outline-none"
                >
                  <span className="truncate">{dict.legal.privacyTitle}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={termsUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-[#574B40] bg-[#F6F2EA] hover:bg-[#ECE5D8] hover:text-[#1F1B18] transition focus:outline-none"
                >
                  <span className="truncate">{dict.legal.termsTitle}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={aboutUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-[#574B40] bg-[#F6F2EA] hover:bg-[#ECE5D8] hover:text-[#1F1B18] transition focus:outline-none"
                >
                  <span className="truncate">{dict.legal.aboutTitle}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#7A6B5E]" />
                </Link>

                <Link
                  to={contactUrl}
                  onClick={handleScrollTopClick}
                  className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-[#574B40] bg-[#F6F2EA] hover:bg-[#ECE5D8] hover:text-[#1F1B18] transition focus:outline-none"
                >
                  <span className="truncate">{dict.legal.contactTitle}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#7A6B5E]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
