import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Tag, X, Monitor, Gamepad2, Home, Wifi, Smartphone, ShoppingCart } from 'lucide-react';

const CATEGORY_ICONS = {
  'tech-gadgets': Monitor,
  'perifericos-gaming': Gamepad2,
  'smart-home': Home,
  'redes-wifi': Wifi,
  'accesorios-moviles': Smartphone
};

export default function CouponCard({ coupon, localeConfig }) {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { dict } = localeConfig;
  const isEs = localeConfig.lang === 'es';

  const handleAction = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coupon.code);
      }
    } catch {
      // Fallback silent
    }
    setCopied(true);
    setModalOpen(true);
    window.open(coupon.affiliateLink, '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopied(false), 3500);
  };

  const isTemu = coupon.store === 'temu';
  const CategoryIcon = CATEGORY_ICONS[coupon.category] || Tag;

  return (
    <>
      <article className="group relative flex flex-col justify-between rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 shadow-[0_4px_20px_-6px_rgba(31,27,24,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B85332]/60 hover:shadow-[0_12px_26px_-8px_rgba(184,83,50,0.14)] font-sans">
        <div>
          {/* Top bar: Store badge + Clear Category Pill */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border ${
                isTemu
                  ? 'bg-[#B85332]/12 text-[#9E4224] border-[#B85332]/30'
                  : 'bg-[#7A3B24]/12 text-[#6E331D] border-[#7A3B24]/30'
              }`}
            >
              {isTemu ? 'TEMU CARRITO' : 'ALIEXPRESS CARRITO'}
            </span>

            <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0E9DF] border border-[#D8C8B4] px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#574B40] max-w-full truncate">
              <CategoryIcon className="h-3.5 w-3.5 text-[#B85332] shrink-0" />
              <span className="truncate">{coupon.categoryLabel}</span>
            </span>
          </div>

          {/* Direct Checkout Usage Tag */}
          <div className="mb-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#3D6352]/12 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#3D6352] border border-[#3D6352]/25">
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {isEs ? 'Cupón real de pago (al finalizar compra)' : 'Real Checkout Coupon (paste at payment)'}
              </span>
            </span>
          </div>

          {/* Clean Sans-Serif High-Readability Title */}
          <h3 className="mb-2.5 text-base sm:text-lg font-extrabold leading-snug text-[#1F1B18] group-hover:text-[#B85332] transition-colors">
            {coupon.title}
          </h3>

          {/* Explicit "What does this coupon cover?" */}
          {coupon.appliesToText && (
            <p className="mb-4 text-xs leading-relaxed text-[#574B40] bg-[#F3ECE2] rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 border border-[#E5DAC9]">
              {coupon.appliesToText}
            </p>
          )}

          {/* Two-Column Benefit Summary (Responsive wrap for narrow screens) */}
          <div className="mb-4 sm:mb-5 rounded-xl bg-[#F0E9DF] p-3 sm:p-3.5 border border-[#DED4C6]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED4C6] pb-2.5 mb-2.5">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#6E6055] block">
                  {isEs ? 'Descuento Directo:' : 'Direct Discount:'}
                </span>
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-0.5">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#B85332]">
                    -{coupon.discountPct}%
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-[#3D6352] bg-[#3D6352]/12 px-2 py-0.5 rounded border border-[#3D6352]/25">
                    {isEs ? `Ahorras hasta ${coupon.localDiscountAmount}` : `Save up to ${coupon.localDiscountAmount}`}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#6E6055] block">
                  {isEs ? 'Compra mínima:' : `${dict.minSpend}:`}
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#1F1B18]">
                  {coupon.localMinSpend}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] font-medium text-[#6E6055]">
              <span className="inline-flex items-center gap-1 font-bold text-[#3D6352]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                {dict.verifiedBadge}
              </span>
              <span>{dict.expiresLabel}</span>
            </div>
          </div>
        </div>

        {/* Code Box & Action Button */}
        <div className="mt-1 flex flex-col gap-2 sm:gap-2.5">
          <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-[#C7B6A2] bg-[#F6F2EA] px-3 sm:px-3.5 py-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#6E6055] shrink-0">
              {isEs ? 'CUPÓN DE PAGO:' : 'PROMO CODE:'}
            </span>
            <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#B85332] select-all truncate">
              {coupon.code}
            </code>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B85332] px-4 py-3 text-xs sm:text-sm font-bold text-[#FCF9F4] shadow-sm transition active:scale-[0.99] hover:bg-[#9E4224] focus:outline-none focus:ring-2 focus:ring-[#B85332] focus:ring-offset-2 focus:ring-offset-[#FCF9F4]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5] shrink-0" />
                <span>{dict.btnCopied}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" />
                <span>{dict.btnGetCode}</span>
              </>
            )}
          </button>

          <a
            href={coupon.affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1 text-center text-xs font-bold text-[#6E6055] hover:text-[#1F1B18] py-1 transition"
          >
            <span>{dict.btnGoStore}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </article>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1B18]/60 p-4 backdrop-blur-sm font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-6 shadow-2xl text-[#1F1B18]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#7A6B5E] hover:bg-[#ECE5D8] hover:text-[#1F1B18]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3 flex items-center gap-2 text-[#3D6352]">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="text-lg font-extrabold text-[#1F1B18]">{dict.modalTitle}</h4>
            </div>

            <p className="mb-2 text-sm font-bold text-[#1F1B18]">{coupon.title}</p>
            {coupon.appliesToText && (
              <p className="mb-4 text-xs text-[#574B40]">{coupon.appliesToText}</p>
            )}

            <div className="mb-5 flex items-center justify-between rounded-xl border-2 border-dashed border-[#B85332]/50 bg-[#F0E9DF] p-3.5">
              <code className="font-mono text-xl font-extrabold tracking-widest text-[#B85332]">
                {coupon.code}
              </code>
              <span className="rounded-lg bg-[#B85332]/15 px-3 py-1 text-xs font-bold text-[#B85332]">
                -{coupon.discountPct}% ({coupon.localDiscountAmount})
              </span>
            </div>

            <ol className="mb-6 space-y-2 text-xs leading-relaxed text-[#574B40] list-decimal list-inside">
              {dict.modalSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <a
              href={coupon.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setModalOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B85332] px-5 py-3 text-sm font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition"
            >
              <span>{dict.btnGoStore}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
