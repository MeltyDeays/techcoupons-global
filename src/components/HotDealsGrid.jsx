import React, { useState, useMemo, useEffect } from 'react';
import {
  Flame,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Tag,
  Layers,
  Shirt,
  Home,
  Monitor,
  Smartphone,
  Gamepad2,
  Wrench,
  Puzzle,
  Bike,
  PawPrint,
  Baby
} from 'lucide-react';
import ALL_DEALS from '../data/aliexpress_catalog_deals.json';
import { CATEGORY_SLUGS } from '../config/locales.js';
import { getSectionText } from '../data/multilingualSections.js';

const SITE_CATEGORY_ICONS = {
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
  'bebes-oficina': Baby
};

export default function HotDealsGrid({
  localeConfig,
  storeFilter = null,
  categoryFilter = null
}) {
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all');
  const [visibleCount, setVisibleCount] = useState(20);
  const [copiedCode, setCopiedCode] = useState(null);

  // Sincroniza la categoría activa con el filtro de categoría global de la URL
  useEffect(() => {
    setActiveCategory(categoryFilter || 'all');
    setVisibleCount(20);
  }, [categoryFilter]);

  // Si el usuario está en Temu, no mostrar productos de AliExpress
  if (storeFilter === 'temu') return null;

  const isEs = localeConfig.lang === 'es';
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);

  // Filtrado de productos según la categoría seleccionada
  const filteredDeals = useMemo(() => {
    if (activeCategory === 'all') return ALL_DEALS;
    return ALL_DEALS.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  const displayedDeals = filteredDeals.slice(0, visibleCount);

  // Conteo de productos por categoría canónica del sitio
  const categoryCounts = useMemo(() => {
    const counts = {};
    ALL_DEALS.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCopyCode = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 2000);
  };

  const handleCategoryClick = (catSlug) => {
    setActiveCategory(catSlug);
    setVisibleCount(20);
  };

  if (ALL_DEALS.length === 0) return null;

  return (
    <section aria-label="AliExpress Deals" className="w-full max-w-full min-w-0">
      {/* Encabezado del catálogo con selector de las mismas categorías del filtro */}
      <div className="mb-4 sm:mb-6 rounded-2xl border border-[#B85332]/30 bg-gradient-to-r from-[#FCF9F4] via-[#F8F2E8] to-[#FCF9F4] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85332] px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#FCF9F4]">
                <Flame className="h-3.5 w-3.5" />
                <span>{isEs ? 'Catálogo de Ofertas AliExpress' : 'AliExpress Deals Catalog'}</span>
              </span>
              <span className="rounded-lg border border-[#D8C8B4] bg-[#FCF9F4] px-2 py-0.5 text-[10px] font-bold text-[#6E6055]">
                {filteredDeals.length} {isEs ? 'productos' : 'products'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18]">
              {isEs
                ? 'Ofertas Oficiales Clasificadas por Categoría'
                : 'Official Deals Categorized by Department'}
            </h3>
            <p className="text-xs sm:text-sm text-[#574B40]">
              {isEs
                ? 'Navega los 381 productos organizados exactamente con las mismas categorías del filtro superior de nuestra página.'
                : 'Browse all 381 products organized with the exact same categories as our store top filter.'}
            </p>
          </div>
        </div>

        {/* Selector de las 11 Categorías Oficiales de la Página */}
        <div className="space-y-2 pt-2 border-t border-[#DED4C6]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#574B40]">
              {isEs ? 'Filtrar productos por categoría:' : 'Filter products by category:'}
            </span>
            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleCategoryClick('all')}
                className="text-[11px] font-bold text-[#B85332] hover:underline"
              >
                {isEs ? 'Ver todas las categorías' : 'View all categories'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                activeCategory === 'all'
                  ? 'bg-[#B85332] text-[#FCF9F4] border-[#B85332] shadow-xs'
                  : 'bg-[#FCF9F4] text-[#574B40] border-[#DED4C6] hover:border-[#B85332] hover:text-[#1F1B18]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isEs ? 'Todas las ofertas' : 'All Deals'}</span>
              <span className={`text-[10px] ${activeCategory === 'all' ? 'opacity-90' : 'text-[#8A7B70]'}`}>
                ({ALL_DEALS.length})
              </span>
            </button>

            {CATEGORY_SLUGS.map((slug) => {
              const Icon = SITE_CATEGORY_ICONS[slug] || Tag;
              const label = ui.catShort?.[slug] || dict.categories?.[slug] || slug;
              const count = categoryCounts[slug] || 0;
              const isActive = activeCategory === slug;

              if (count === 0 && !isActive) return null;

              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => handleCategoryClick(slug)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                    isActive
                      ? 'bg-[#B85332] text-[#FCF9F4] border-[#B85332] shadow-xs'
                      : 'bg-[#FCF9F4] text-[#574B40] border-[#DED4C6] hover:border-[#B85332] hover:text-[#1F1B18]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#FCF9F4]' : 'text-[#B85332]'}`} />
                  <span>{label}</span>
                  <span className={`text-[10px] font-extrabold ${isActive ? 'opacity-90' : 'text-[#8A7B70]'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vista vacía si la categoría no tiene productos */}
      {filteredDeals.length === 0 ? (
        <div className="rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-8 text-center">
          <p className="text-sm sm:text-base font-bold text-[#1F1B18] mb-3">
            {isEs
              ? 'No hay productos disponibles en esta categoría actualmente.'
              : 'No products available in this category right now.'}
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="rounded-xl bg-[#B85332] px-4 py-2 text-xs font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition"
          >
            {isEs ? 'Ver todas las categorías' : 'View all categories'}
          </button>
        </div>
      ) : (
        /* Grilla de productos (5 columnas en escritorio) */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
          {displayedDeals.map((deal) => {
            const pid = deal.ProductId;
            const img = deal['Image Url'];
            const desc = deal['Product Desc'];
            const originPrice = deal['Origin Price'];
            const discountPrice = deal['Discount Price'];
            const discountPct = deal['Discount'];
            const promoUrl = deal['Promotion Url'] || `https://s.click.aliexpress.com/e/_c3mBZjPN`;
            const code = deal['Code Name'];
            const codeVal = deal['Code Value'];
            const codeMin = deal['Code Minimum Spend'];
            const sales = deal['Sales180Day'];
            const feedback = deal['Positive Feedback'];
            const catSlug = deal.category;
            const CatIcon = SITE_CATEGORY_ICONS[catSlug] || Tag;
            const catLabel = ui.catShort?.[catSlug] || dict.categories?.[catSlug] || catSlug;

            const isCopied = copiedCode === code;

            return (
              <div
                key={pid}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] shadow-sm hover:border-[#B85332]/60 hover:shadow-md transition-all duration-200"
              >
                {/* Imagen del producto y badges oficiales */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#F2ECE1]">
                  <a
                    href={promoUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full h-full"
                  >
                    <img
                      src={img}
                      alt={desc}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>

                  {/* Insignia de categoría oficial del sitio */}
                  <span className="absolute top-2 left-2 rounded-lg bg-[#1F1B18]/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-[#FCF9F4] shadow-xs flex items-center gap-1 border border-white/10 max-w-[70%] truncate">
                    <CatIcon className="h-3 w-3 text-[#FFE000] shrink-0" />
                    <span className="truncate">{catLabel}</span>
                  </span>

                  {/* Porcentaje de descuento */}
                  {discountPct && discountPct !== '0%' && (
                    <span className="absolute top-2 right-2 rounded-lg bg-[#B85332] px-2 py-0.5 text-[11px] font-extrabold text-[#FCF9F4] shadow-sm">
                      -{discountPct}
                    </span>
                  )}

                  {/* Ventas y valoración */}
                  {sales && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-[#1F1B18]/75 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-[#FCF9F4]">
                      ★ {feedback || '96%'} • {sales}+ {isEs ? 'ventas' : 'sold'}
                    </span>
                  )}
                </div>

                {/* Información del producto */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5 space-y-2.5">
                  <a
                    href={promoUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block"
                    title={desc}
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-[#1F1B18] line-clamp-2 leading-snug group-hover:text-[#B85332] transition-colors">
                      {desc}
                    </h4>
                  </a>

                  {/* Bloque de precios */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-[#B85332]">
                      {discountPrice || originPrice}
                    </span>
                    {originPrice && originPrice !== discountPrice && (
                      <span className="text-[11px] text-[#8A7B70] line-through">
                        {originPrice}
                      </span>
                    )}
                  </div>

                  {/* Cupón adicional del vendedor (si aplica) */}
                  {code ? (
                    <div className="rounded-xl border border-[#3D6352]/30 bg-[#3D6352]/5 p-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#3D6352]">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{isEs ? 'Cupón tienda' : 'Store Coupon'}</span>
                        </span>
                        {codeVal && <span className="font-extrabold">-{codeVal}</span>}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(e, code)}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-mono font-bold transition ${
                          isCopied
                            ? 'bg-[#3D6352] text-[#FCF9F4]'
                            : 'bg-[#FCF9F4] text-[#1F1B18] border border-[#3D6352]/40 hover:bg-[#E8F0EC]'
                        }`}
                      >
                        <span className="truncate">{code}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] shrink-0 font-sans">
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>{isEs ? '¡Copiado!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>{isEs ? 'Copiar' : 'Copy'}</span>
                            </>
                          )}
                        </span>
                      </button>
                      {codeMin && (
                        <p className="text-[9px] text-[#6E6055] truncate">
                          {isEs ? `Mínimo: ${codeMin}` : `Min. spend: ${codeMin}`}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#DED4C6] bg-[#F6F2EA] px-2 py-1.5 text-[10px] text-[#6E6055] font-semibold text-center">
                      {isEs ? 'Descuento directo en checkout' : 'Instant checkout savings'}
                    </div>
                  )}

                  {/* Botón de acción */}
                  <a
                    href={promoUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#B85332] px-3 py-2 text-xs font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition shadow-sm"
                  >
                    <span>{isEs ? 'Ver Oferta' : 'View Deal'}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón de cargar más */}
      {visibleCount < filteredDeals.length && (
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredDeals.length))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F1B18] px-6 py-3 text-xs sm:text-sm font-extrabold text-[#FCF9F4] hover:bg-[#38312B] transition shadow-md"
          >
            <Sparkles className="h-4 w-4 text-[#FFE000]" />
            <span>
              {isEs
                ? `Cargar más productos (+${Math.min(20, filteredDeals.length - visibleCount)})`
                : `Load more products (+${Math.min(20, filteredDeals.length - visibleCount)})`}
            </span>
          </button>
          <p className="text-xs text-[#6E6055]">
            {isEs
              ? `Mostrando ${displayedDeals.length} de ${filteredDeals.length} productos en esta categoría`
              : `Showing ${displayedDeals.length} of ${filteredDeals.length} products in this category`}
          </p>
        </div>
      )}
    </section>
  );
}
