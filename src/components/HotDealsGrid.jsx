import React, { useState, useMemo } from 'react';
import { Flame, ExternalLink, Copy, Check, Sparkles, Tag } from 'lucide-react';
import ALL_DEALS from '../data/aliexpress_catalog_deals.json';

const CATEGORY_KEYWORDS = {
  tech: ['controller', 'gamepad', 'console', 'anbernic', 'gamesir', 'bluetooth', 'earbuds', 'headphone', 'charger', 'cable', 'led', 'battery', 'dewalt', 'esp32', 'meshtastic', 'lens', 'phone', 'ipod', 'type-c', 'obd2', 'radio', 'gps', 'tf card', 'inverter', 'printer', 'suction', 'webcam', 'vacuum'],
  fashion: ['shirt', 't-shirt', 'dress', 'skirt', 'shorts', 'pants', 'jacket', 'hoodie', 'vest', 'cap', 'hat', 'beret', 'sweater', 'coat', 'corset', 'clothing', 'robe', 'underwear', 'thong', 'lingerie', 'goth', 'vintage', 'outfit', 'sweatshirt'],
  home: ['light', 'lamp', 'blender', 'mixer', 'tape', 'sticker', 'pillow', 'shower', 'faucet', 'decor', 'embroidery', 'flag', 'banner', 'screwdriver', 'tools', 'glue', 'wall', 'curtain', 'cutting dies'],
  beauty: ['moissanite', 'diamond', 'ring', 'necklace', 'bracelet', 'earrings', 'jewelry', 'silver', 'lash', 'lashes', 'cream', 'skin', 'teeth', 'whitening', 'nail', 'wig', 'hair', 'braiding', 'derma', 'retinol'],
  sports: ['cycling', 'bike', 'running', 'shoes', 'sneakers', 'yoga', 'sports', 'gym', 'dive', 'diving', 'watch', 'paddle', 'pickleball', 'tactical', 'holster', 'shorts', 'speedometer', 'pedometer', 'lining', 'li-ning', 'xtep', 'rockbros', 'north edge', 'paganidesign', 'pagani', 'addiesdive'],
  toys: ['pop mart', 'blind box', 'plush', 'doll', 'action figure', 'figure', 'toy', 'toys', 'anime', 'jujutsu', 'gojo', 'sukuna', 'dragon ball', 'naruto', 'one piece', 'goku', 'pokemon', 'titan13', 'dummy13', 'blyth', 'building blocks', 'card game', 'tcg', 'hirono', 'skullpanda', 'labubu', 'sonny']
};

export default function HotDealsGrid({
  localeConfig,
  storeFilter = null,
  categoryFilter = null
}) {
  const [visibleCount, setVisibleCount] = useState(16);
  const [copiedCode, setCopiedCode] = useState(null);

  // If user is specifically on Temu, don't show AliExpress products
  if (storeFilter === 'temu') return null;

  const isEs = localeConfig.lang === 'es';

  // Filter deals based on active category
  const filteredDeals = useMemo(() => {
    if (!categoryFilter) return ALL_DEALS;
    const keywords = CATEGORY_KEYWORDS[categoryFilter] || [];
    if (keywords.length === 0) return ALL_DEALS;

    return ALL_DEALS.filter((d) => {
      const desc = (d['Product Desc'] || '').toLowerCase();
      return keywords.some((kw) => desc.includes(kw));
    });
  }, [categoryFilter]);

  const displayedDeals = filteredDeals.slice(0, visibleCount);

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

  if (filteredDeals.length === 0) return null;

  return (
    <section aria-label="AliExpress Hot Deals" className="mt-8 sm:mt-10 w-full max-w-full min-w-0">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6 rounded-2xl border border-[#B85332]/30 bg-gradient-to-r from-[#FCF9F4] via-[#F8F2E8] to-[#FCF9F4] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85332] px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#FCF9F4]">
                <Flame className="h-3.5 w-3.5" />
                <span>{isEs ? 'Super Ofertas y Productos Destacados' : 'Super Deals & Featured Products'}</span>
              </span>
              <span className="rounded-lg border border-[#D8C8B4] bg-[#FCF9F4] px-2 py-0.5 text-[10px] font-bold text-[#6E6055]">
                {filteredDeals.length} {isEs ? 'artículos' : 'items'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18]">
              {isEs
                ? 'Ofertas Oficiales con Descuento Directo y Cupones de Tienda'
                : 'Official AliExpress Deals with Instant Discounts & Promo Codes'}
            </h3>
            <p className="text-xs sm:text-sm text-[#574B40]">
              {isEs
                ? 'Precios rebajados y cupones exclusivos probados para envíos a EE. UU. (Casilleros Miami) y cobertura global.'
                : 'Discounted prices and exclusive coupons verified for United States (Miami Lockers) & global delivery.'}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
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

          const isCopied = copiedCode === code;

          return (
            <div
              key={pid}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] shadow-sm hover:border-[#B85332]/60 hover:shadow-md transition-all duration-200"
            >
              {/* Product Image & Badges */}
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

                {/* Discount Percentage Badge */}
                {discountPct && discountPct !== '0%' && (
                  <span className="absolute top-2 right-2 rounded-lg bg-[#B85332] px-2 py-0.5 text-[11px] font-extrabold text-[#FCF9F4] shadow-sm">
                    -{discountPct}
                  </span>
                )}

                {/* Rating / Sales badge */}
                {sales && (
                  <span className="absolute bottom-2 left-2 rounded-md bg-[#1F1B18]/75 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-[#FCF9F4]">
                    ★ {feedback || '96%'} • {sales}+ {isEs ? 'ventas' : 'sold'}
                  </span>
                )}
              </div>

              {/* Product Info */}
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

                {/* Pricing Block */}
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

                {/* Product Promo Code Pill (if present) */}
                {code ? (
                  <div className="rounded-xl border border-[#3D6352]/30 bg-[#3D6352]/5 p-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#3D6352]">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{isEs ? 'Cupón adicional' : 'Extra Coupon'}</span>
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

                {/* Action CTA Button */}
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

      {/* Load More Button */}
      {visibleCount < filteredDeals.length && (
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredDeals.length))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F1B18] px-6 py-3 text-xs sm:text-sm font-extrabold text-[#FCF9F4] hover:bg-[#38312B] transition shadow-md"
          >
            <Sparkles className="h-4 w-4 text-[#FFE000]" />
            <span>
              {isEs
                ? `Cargar más productos (+${Math.min(24, filteredDeals.length - visibleCount)})`
                : `Load more products (+${Math.min(24, filteredDeals.length - visibleCount)})`}
            </span>
          </button>
          <p className="text-xs text-[#6E6055]">
            {isEs
              ? `Mostrando ${displayedDeals.length} de ${filteredDeals.length} ofertas destacadas`
              : `Showing ${displayedDeals.length} of ${filteredDeals.length} featured deals`}
          </p>
        </div>
      )}
    </section>
  );
}
