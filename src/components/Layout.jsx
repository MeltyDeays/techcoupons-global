import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOCALES, CATEGORY_SLUGS } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { Globe, ShieldAlert, Cpu, ExternalLink, Sparkles } from 'lucide-react';

export default function Layout({ localeConfig, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dict } = localeConfig;

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      parts[0] = newLocale;
      navigate('/' + parts.join('/'));
    } else {
      navigate('/' + newLocale);
    }
  };

  return (
    <div dir={localeConfig.rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Affiliate Disclosure Bar (Required for Admitad & AliExpress Portals Audit) */}
      <div className="border-b border-slate-800/80 bg-slate-900/90 px-4 py-2 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{dict.disclosure}</span>
          </div>
          <span className="hidden md:inline-block font-mono text-[11px] text-emerald-400 shrink-0">
            SAFESEARCH VERIFIED • {localeConfig.currencyCode}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          <Link
            to={`/${localeConfig.code}`}
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </span>
            <div>
              <span className="text-emerald-400">TECH</span>COUPONS
              <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-slate-300">
                {localeConfig.flag} {localeConfig.code.toUpperCase()}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-1 md:gap-2 text-sm font-medium">
            <Link
              to={`/${localeConfig.code}`}
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-emerald-400 transition"
            >
              {dict.navHome}
            </Link>
            <Link
              to={`/${localeConfig.code}/temu`}
              className="rounded-lg px-3 py-1.5 text-orange-400 hover:bg-orange-500/10 transition font-semibold"
            >
              {dict.navTemu}
            </Link>
            <Link
              to={`/${localeConfig.code}/aliexpress`}
              className="rounded-lg px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition font-semibold"
            >
              {dict.navAli}
            </Link>
          </nav>

          {/* Market / Language Switcher */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <select
              aria-label="Select Country and Language"
              value={localeConfig.code}
              onChange={handleLocaleChange}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              {LOCALES.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.flag} {loc.countryName} — {loc.languageName} ({loc.currencyCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Sub-bar */}
        <div className="border-t border-slate-900 bg-slate-950/60 px-4 py-2">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-500 shrink-0">
              {dict.navCategories}:
            </span>
            {CATEGORY_SLUGS.map((slug) => (
              <Link
                key={slug}
                to={`/${localeConfig.code}/category/${slug}`}
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition"
              >
                {dict.categories[slug]}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content + Clean Static Sidebar (<aside>) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row gap-8 px-4 py-8">
        <main className="flex-1 min-w-0">{children}</main>

        {/* Clean Monetization Sidebar (<aside>) without invasive scripts */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {AFFILIATE_CONFIG.sidebarBanners.active ? (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {dict.sidebarTitle}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  {dict.sidebarSponsor}
                </span>
              </div>

              <div className="space-y-4">
                {AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl && (
                  <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-orange-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>TEMU {localeConfig.countryName.toUpperCase()}</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.temuBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-orange-400 transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl && (
                  <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>ALIEXPRESS</span>
                    </div>
                    <a
                      href={AFFILIATE_CONFIG.sidebarBanners.aliexpressBannerUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-rose-400 transition"
                    >
                      <span>{dict.btnGoStore}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-5 text-center">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {dict.sidebarTitle}
              </span>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Espacio publicitario reservado (`affiliateConfig.js` sin configurar).
              </p>
            </div>
          )}

          {/* All Regional Hreflang Quick Links for Crawlers & Users */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Global Regions (24 Markets)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {LOCALES.map((loc) => (
                <Link
                  key={loc.code}
                  to={`/${loc.code}`}
                  className={`truncate rounded px-2 py-1 transition ${
                    loc.code === localeConfig.code
                      ? 'bg-emerald-500/20 font-bold text-emerald-300'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {loc.flag} {loc.code.toUpperCase()} ({loc.currencyCode})
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer with CPA Audit Legal Links */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-900/60 px-4 py-8 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-200">
              TECHCOUPONS GLOBAL — {localeConfig.countryName} ({localeConfig.currencyCode})
            </p>
            <p className="mt-1 text-slate-500">{dict.disclosure}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-medium text-slate-300">
            <Link to={`/${localeConfig.code}/privacy`} className="hover:text-emerald-400">
              {dict.legal.privacyTitle}
            </Link>
            <Link to={`/${localeConfig.code}/terms`} className="hover:text-emerald-400">
              {dict.legal.termsTitle}
            </Link>
            <Link to={`/${localeConfig.code}/about`} className="hover:text-emerald-400">
              {dict.legal.aboutTitle}
            </Link>
            <Link to={`/${localeConfig.code}/contact`} className="hover:text-emerald-400">
              {dict.legal.contactTitle}
            </Link>
            <Link to="/admin" className="rounded bg-slate-800 px-2 py-1 text-emerald-400 hover:bg-slate-700 font-mono">
              Admin Panel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
