import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getLocaleConfig, LOCALE_MAP, DEFAULT_LOCALE, detectBrowserLocale, formatLocalPrice } from './config/locales.js';
import { getCouponsForLocale, SEARCH_DYNAMIC_CODES } from './data/couponsGenerator.js';
import { AFFILIATE_CONFIG } from './config/affiliateConfig.js';
import Layout, { FlagImg } from './components/Layout.jsx';
import SEOHead from './components/SEOHead.jsx';
import CouponCard from './components/CouponCard.jsx';
import NativeSEOGuide from './components/NativeSEOGuide.jsx';
import { Search, Filter, Info, Copy, Check, ExternalLink, Gamepad2, BadgeDollarSign, Layers, Truck, ShieldCheck } from 'lucide-react';

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
  const isEs = localeConfig.lang === 'es';
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
    <Layout localeConfig={localeConfig} activeStore={storeFilter} activeCategory={categoryFilter} activeSection="coupons">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={routeSuffix}
        pageTitle={`${customHeading} | CuponesTech`}
        pageDescription={dict.heroSubtitle}
        coupons={coupons}
      />

      {/* Hero Section */}
      <section className="mb-6 sm:mb-8 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-2.5 sm:mb-3 inline-flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-lg border border-[#D8C8B4] bg-[#F0E9DF] px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#8C3D22]">
          <FlagImg iso={localeConfig.iso} className="h-3.5 w-5" />
          <span className="truncate">{localeConfig.countryName} • {localeConfig.currencyCode}</span>
        </div>

        <h1 className="mb-2 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F1B18] leading-tight">
          {customHeading}
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm md:text-base text-[#574B40] leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {!hasTemuInCountry && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#D4A359]/60 bg-[#F6F2EA] p-3.5 text-xs text-[#574B40]">
            <div className="flex items-start sm:items-center gap-2.5">
              <Info className="h-4 w-4 text-[#B85332] shrink-0 mt-0.5 sm:mt-0" />
              <span>
                En <strong>{localeConfig.countryName}</strong>, <strong>AliExpress</strong> realiza envíos directos en {localeConfig.currencyCode}. Para comprar en <strong>Temu</strong> mediante casillero en Miami, selecciona <strong>Estados Unidos (Casilleros Miami)</strong>.
              </span>
            </div>
            <Link
              to="/es-us/temu"
              className="w-full sm:w-auto text-center shrink-0 rounded-lg bg-[#B85332] px-3 py-2 sm:py-1.5 font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition"
            >
              Ver Cupones Temu (Casillero Miami)
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="mt-5 sm:mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-4 sm:pt-5 border-t border-[#E5DAC9]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6B5E]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEs
                  ? `Filtrar cupones: Computadoras, Controles, Hogar, Wi-Fi... (${localeConfig.currencyCode})`
                  : `Filter coupons: Computers, Controllers, Smart Home, Wi-Fi... (${localeConfig.currencyCode})`
              }
              className="w-full rounded-xl border border-[#C7B6A2] bg-[#F6F2EA] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1F1B18] placeholder-[#8C7D70] focus:border-[#B85332] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold">
            <Filter className="h-4 w-4 text-[#7A6B5E] hidden md:block" />
            <Link
              to={categoryFilter ? `/${localeConfig.code}/category/${categoryFilter}` : `/${localeConfig.code}`}
              className={`text-center rounded-xl px-2.5 sm:px-3.5 py-2 border transition whitespace-nowrap ${
                !storeFilter
                  ? 'border-[#1F1B18] bg-[#1F1B18] text-[#FCF9F4]'
                  : 'border-[#C7B6A2] bg-[#F6F2EA] text-[#574B40] hover:text-[#1F1B18]'
              }`}
            >
              {isEs ? 'Todas' : 'All'} ({totalAllCount})
            </Link>

            {hasTemuInCountry && (
              <Link
                to={categoryFilter ? `/${localeConfig.code}/temu/category/${categoryFilter}` : `/${localeConfig.code}/temu`}
                className={`text-center rounded-xl px-2.5 sm:px-3.5 py-2 border transition whitespace-nowrap ${
                  storeFilter === 'temu'
                    ? 'border-[#B85332] bg-[#B85332] text-[#FCF9F4]'
                    : 'border-[#C7B6A2] bg-[#F6F2EA] text-[#8C3D22] hover:bg-[#ECE5D8]'
                }`}
              >
                Temu ({totalTemuCount})
              </Link>
            )}

            <Link
              to={categoryFilter ? `/${localeConfig.code}/aliexpress/category/${categoryFilter}` : `/${localeConfig.code}/aliexpress`}
              className={`text-center rounded-xl px-2.5 sm:px-3.5 py-2 border transition whitespace-nowrap ${
                storeFilter === 'aliexpress'
                  ? 'border-[#7A3B24] bg-[#7A3B24] text-[#FCF9F4]'
                  : 'border-[#C7B6A2] bg-[#F6F2EA] text-[#7A3B24] hover:bg-[#ECE5D8]'
              }`}
            >
              AliExpress ({totalAliCount})
            </Link>
          </div>
        </div>
      </section>

      {/* Coupon Grid */}
      <section aria-label="Verified Checkout Coupons">
        {filteredCoupons.length === 0 ? (
          <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-8 text-center">
            <p className="text-lg font-extrabold text-[#1F1B18] mb-2">
              No hay cupones directos de {storeFilter === 'temu' ? 'Temu' : 'esta selección'} en {localeConfig.countryName}
            </p>
            <p className="text-xs text-[#574B40] mb-4">
              Puedes usar los cupones directos de AliExpress en {localeConfig.countryName} o cambiar a Estados Unidos (Casilleros Miami) para pedir en Temu.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to={`/${localeConfig.code}/aliexpress`}
                className="rounded-xl bg-[#7A3B24] px-4 py-2 text-xs font-bold text-[#FCF9F4]"
              >
                Ver Cupones AliExpress en {localeConfig.countryName}
              </Link>
              <Link
                to="/es-us/temu"
                className="rounded-xl border border-[#B85332] px-4 py-2 text-xs font-bold text-[#B85332]"
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

      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

/**
 * APARTADO EXTRA 1: DINÁMICAS, ACTIVIDADES Y MINIJUEGOS EN BUSCADOR (credit777, wincredit, box777)
 */
export function DynamicsPage() {
  const { locale } = useParams();
  const [copiedId, setCopiedId] = useState(null);

  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const isEs = localeConfig.lang === 'es';
  const temuUrl = AFFILIATE_CONFIG.temuBaseTrackingUrl || 'https://www.temu.com';

  const handleCopyDynamic = async (code, id) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
    setCopiedId(id);
    window.open(temuUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopiedId(null), 3500);
  };

  return (
    <Layout localeConfig={localeConfig} activeSection="dynamics">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix="/dinamicas"
        pageTitle={
          isEs
            ? `Códigos de Dinámicas, Minijuegos y Actividades en el Buscador de Temu (${localeConfig.countryName})`
            : `Temu Search Bar Mini-Games & Credit Activities (${localeConfig.countryName})`
        }
        pageDescription={
          isEs
            ? 'Lista explicada de comandos de buscador como credit777, wincredit, box777 y claimcredit: qué abren realmente y cómo reclamar el saldo diario.'
            : 'Explained list of Temu search bar commands like credit777, wincredit, box777 and claimcredit.'
        }
        coupons={[]}
      />

      <section className="mb-8 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#8F5B1D]/15 border border-[#8F5B1D]/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#7A4D16]">
          <Gamepad2 className="h-4 w-4" />
          <span>{isEs ? 'APARTADO ESPECIAL: NO SON CUPONES DE CARRITO' : 'SPECIAL SECTION: SEARCH BAR MINI-GAMES'}</span>
        </div>

        <h1 className="mb-3 text-2xl md:text-3xl font-extrabold text-[#1F1B18]">
          {isEs
            ? 'Códigos de Dinámicas, Actividades y Minijuegos en el Buscador de Temu'
            : 'Temu Search Bar Activities, Credit Wheels & Mini-Game Codes'}
        </h1>

        <p className="text-sm md:text-base text-[#574B40] leading-relaxed">
          {isEs
            ? 'A diferencia de los cupones normales de la pestaña principal, estos textos NO se pegan al momento de pagar. Son palabras clave que debes escribir directamente en la lupa de búsqueda de la aplicación de Temu para abrir actividades, ruletas de saldo o reclamar recompensas pendientes.'
            : 'Unlike standard checkout promo codes, these keywords are NOT pasted at payment. Type them directly into the top search bar of the Temu app to open reward wheels, chest events, or claim daily credit.'}
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {SEARCH_DYNAMIC_CODES.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 shadow-sm"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-[#8F5B1D]/15 border border-[#8F5B1D]/30 px-2.5 py-1 text-[11px] font-extrabold text-[#7A4D16]">
                    {isEs ? item.badge.es : item.badge.en}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#6E6055]">TEMU APP</span>
                </div>

                <h2 className="mb-2.5 text-lg font-extrabold text-[#1F1B18]">
                  {isEs ? item.title.es : item.title.en}
                </h2>

                <p className="mb-5 rounded-xl border border-[#E5DAC9] bg-[#F3ECE2] p-3.5 text-xs leading-relaxed text-[#574B40]">
                  {isEs ? item.howItWorks.es : item.howItWorks.en}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-[#C7B6A2] bg-[#F6F2EA] px-3.5 py-2">
                  <span className="text-[11px] font-extrabold uppercase text-[#6E6055]">
                    {isEs ? 'ESCRIBIR EN EL BUSCADOR:' : 'TYPE IN SEARCH BAR:'}
                  </span>
                  <code className="font-mono text-base font-extrabold text-[#8F5B1D] select-all">
                    {item.code}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyDynamic(item.code, item.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8F5B1D] px-4 py-3 text-sm font-bold text-[#FCF9F4] hover:bg-[#734815] transition"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{isEs ? '¡Palabra Copiada!' : 'Keyword Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{isEs ? 'Copiar Palabra e Ir a Temu' : 'Copy Keyword & Open Temu'}</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}

/**
 * APARTADO EXTRA 2: GUÍAS DE COMPRA Y REEMBOLSO POR AJUSTE DE PRECIO (PRICE ADJUSTMENT 30 DÍAS)
 */
export function GuidesPage() {
  const { locale } = useParams();
  if (!LOCALE_MAP[(locale || '').toLowerCase()]) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  const localeConfig = getLocaleConfig(locale);
  const isEs = localeConfig.lang === 'es';
  const ex20 = formatLocalPrice(20, localeConfig);
  const ex15 = formatLocalPrice(15, localeConfig);
  const ex5 = formatLocalPrice(5, localeConfig);

  return (
    <Layout localeConfig={localeConfig} activeSection="guides">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix="/guias"
        pageTitle={
          isEs
            ? `Guía de Ajuste de Precio en Temu y AliExpress: Reclama si un producto baja de precio (${localeConfig.countryName})`
            : `Temu & AliExpress 30-Day Price Adjustment Guide (${localeConfig.countryName})`
        }
        pageDescription={
          isEs
            ? `Aprende cómo pedir el reembolso automático en ${localeConfig.currencyCode} si compraste un producto y bajó de precio dentro de los 30 días posteriores.`
            : `Learn how to claim an instant refund in ${localeConfig.currencyCode} if an item drops in price within 30 days of purchase.`
        }
        coupons={[]}
      />

      <section className="mb-8 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#3D6352]/15 border border-[#3D6352]/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#3D6352]">
          <BadgeDollarSign className="h-4 w-4" />
          <span>{isEs ? 'GUÍA OFICIAL DE COMPRA INTELIGENTE' : 'OFFICIAL SMART SHOPPER GUIDE'}</span>
        </div>

        <h1 className="mb-3 text-2xl md:text-3xl font-extrabold text-[#1F1B18]">
          {isEs
            ? `Cómo Recuperar tu Dinero con el Ajuste de Precio y Comprar Seguro desde ${localeConfig.countryName}`
            : `How to Claim 30-Day Price Adjustments & Stack Discounts in ${localeConfig.countryName}`}
        </h1>

        <p className="text-sm md:text-base text-[#574B40] leading-relaxed">
          {isEs
            ? `Muchos compradores no saben que si compras un producto hoy a ${ex20} y mañana o la próxima semana el vendedor lo baja a ${ex15}, Temu te devuelve esos ${ex5} de diferencia automáticamente sin tener que devolver el producto.`
            : `Most shoppers don’t know that if you buy an item today for ${ex20} and the seller lowers the price to ${ex15} within 30 days, you can claim the ${ex5} difference back in one click without returning the product.`}
        </p>
      </section>

      <div className="space-y-6">
        {/* Guide 1: Price Adjustment */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D6352] text-[#FCF9F4]">
              <BadgeDollarSign className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {isEs
                  ? `1. El Truco del "Ajuste de Precio" (Price Adjustment de 30 Días)`
                  : `1. The 30-Day "Price Adjustment" Refund Trick`}
              </h2>
              <p className="text-xs font-semibold text-[#3D6352]">
                {isEs ? 'Recupera dinero en compras que ya hiciste' : 'Get money back on orders you already placed'}
              </p>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-[#574B40]">
            {isEs
              ? `Cuando compras en Temu, todos tus artículos tienen una garantía de precio durante 30 días completos después del pago. Si el mismo vendedor reduce el precio en ${localeConfig.currencyCode}, tienes derecho a que te reembolsen la diferencia exacta.`
              : `Every order on Temu includes a 30-day price match guarantee. If the listing price drops in ${localeConfig.currencyCode} within 30 days of payment, you can claim the exact difference back.`}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#E5DAC9] bg-[#F6F2EA] p-4">
              <span className="font-mono text-xs font-extrabold text-[#B85332]">PASO 1</span>
              <h3 className="mt-1 font-extrabold text-sm text-[#1F1B18]">
                {isEs ? 'Entra a "Tus Pedidos"' : 'Open "Your Orders"'}
              </h3>
              <p className="mt-1 text-xs text-[#574B40] leading-relaxed">
                {isEs
                  ? 'En la app o web de Temu, entra a la sección "Tú" -> "Tus Pedidos" y selecciona cualquier pedido realizado en los últimos 30 días.'
                  : 'In the Temu app or website, go to "You" -> "Your Orders" and click on any order placed in the last 30 days.'}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5DAC9] bg-[#F6F2EA] p-4">
              <span className="font-mono text-xs font-extrabold text-[#B85332]">PASO 2</span>
              <h3 className="mt-1 font-extrabold text-sm text-[#1F1B18]">
                {isEs ? 'Toca "Solicitar ajuste de precio"' : 'Click "Request Price Adjustment"'}
              </h3>
              <p className="mt-1 text-xs text-[#574B40] leading-relaxed">
                {isEs
                  ? `Si algún artículo del pedido bajó de precio (por ejemplo de ${ex20} a ${ex15}), aparecerá habilitado el botón "Solicitar ajuste de precio".`
                  : `If any item in your order dropped in price (e.g. from ${ex20} to ${ex15}), the "Request price adjustment" button will appear.`}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5DAC9] bg-[#F6F2EA] p-4">
              <span className="font-mono text-xs font-extrabold text-[#3D6352]">PASO 3</span>
              <h3 className="mt-1 font-extrabold text-sm text-[#1F1B18]">
                {isEs ? `Recibe tus ${ex5} al instante` : `Receive ${ex5} Instantly`}
              </h3>
              <p className="mt-1 text-xs text-[#574B40] leading-relaxed">
                {isEs
                  ? 'Elige recibir la diferencia como Crédito de Temu (se acredita en 1 segundo) o de vuelta a tu método de pago original. ¡Repítelo cada 4 días!'
                  : 'Choose Temu Credit (instant in 1 second) or refund to your original payment method. Check your orders every few days!'}
              </p>
            </div>
          </div>
        </article>

        {/* Guide 2: How to Stack 3 Discounts on AliExpress */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B85332] text-[#FCF9F4]">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {isEs
                  ? '2. Cómo Acumular 3 Descuentos al Mismo Tiempo en AliExpress'
                  : '2. How to Stack 3 Discounts Simultaneously on AliExpress'}
              </h2>
              <p className="text-xs font-semibold text-[#B85332]">
                {isEs ? 'Válido en los 63 países (incluyendo Nicaragua y toda Latinoamérica)' : 'Valid across all 63 countries'}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#574B40]">
            {isEs
              ? 'En AliExpress nunca pagues el precio normal. Antes de pagar, haz siempre esta combinación triple que el sistema permite juntar en una sola compra:'
              : 'On AliExpress, always combine these three layers on the same checkout screen:'}
          </p>
          <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#1F1B18] list-disc list-inside">
            <li>
              <strong>{isEs ? 'Capa 1 — Cupón del Vendedor:' : 'Layer 1 — Store Coupon:'}</strong>{' '}
              {isEs ? 'Reclámalo gratis dentro de la página del producto antes de agregarlo al carrito.' : 'Claim it on the product page before adding to cart.'}
            </li>
            <li>
              <strong>{isEs ? 'Capa 2 — Monedas de la App:' : 'Layer 2 — App Coins:'}</strong>{' '}
              {isEs ? 'Se descuentan automáticamente (del 2% al 15% extra) si compras desde la app móvil.' : 'Applied automatically (2% to 15% off) in the mobile app.'}
            </li>
            <li>
              <strong>{isEs ? 'Capa 3 — Código Promocional de Pago (CuponesTech):' : 'Layer 3 — Checkout Promo Code:'}</strong>{' '}
              {isEs ? 'Pega uno de nuestros códigos verificados (como CHOICE30 o ALIGAME15) en la casilla final de pago.' : 'Paste one of our verified checkout codes in the Promo Code box.'}
            </li>
          </ul>
        </article>

        {/* Guide 3: Direct Shipping vs Miami Locker */}
        <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3B24] text-[#FCF9F4]">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#1F1B18]">
                {isEs
                  ? '3. Cuándo pedir con Envío Directo y cuándo usar Casillero en Miami'
                  : '3. Direct International Shipping vs. US Freight Forwarder (Miami Locker)'}
              </h2>
              <p className="text-xs font-semibold text-[#7A3B24]">
                {isEs ? 'Especial para Centroamérica, Sudamérica y el Caribe' : 'International Logistics Guide'}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#574B40]">
            {isEs
              ? 'En países como Nicaragua, Costa Rica, Guatemala, Honduras o El Salvador, AliExpress envía paquetes directamente a tu país, pero Temu requiere dirección de Estados Unidos. Si configuras tu cuenta de Temu o AliExpress con la dirección en Miami de tu agencia de envíos (código postal 33166 / 33122 en Florida) y usas nuestra región "Estados Unidos (Casilleros Miami)", obtienes envío gratis hasta Miami en 4 días y pagas solo por el peso real al recibir en tu ciudad.'
              : 'For shoppers in Central and South America, combining a Miami freight forwarder address (ZIP 33166) with our ES-US / EN-US region unlocks free US domestic shipping in 4-6 days and access to all US-exclusive Temu bundles.'}
          </p>
        </article>
      </div>

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
    <Layout localeConfig={localeConfig} activeSection="legal">
      <SEOHead
        localeConfig={localeConfig}
        routeSuffix={current.suffix}
        pageTitle={`${current.title} — ${localeConfig.countryName}`}
        pageDescription={current.body}
        coupons={[]}
      />
      <article className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-10 shadow-sm text-[#1F1B18] font-sans">
        <h1 className="mb-4 text-2xl md:text-3xl font-extrabold text-[#1F1B18]">{current.title}</h1>
        <p className="text-sm md:text-base leading-relaxed text-[#574B40] mb-6">{current.body}</p>
        <div className="rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] p-4 text-xs text-[#574B40] space-y-2">
          <p><strong>Región:</strong> {localeConfig.countryName} ({localeConfig.code.toUpperCase()})</p>
          <p><strong>Moneda Local:</strong> {localeConfig.currencyCode} ({localeConfig.currency})</p>
          <p><strong>Cumplimiento CPA:</strong> Atributo rel=&quot;noopener noreferrer sponsored&quot; activo en todos los enlaces salientes.</p>
        </div>
      </article>
      <NativeSEOGuide localeConfig={localeConfig} />
    </Layout>
  );
}
