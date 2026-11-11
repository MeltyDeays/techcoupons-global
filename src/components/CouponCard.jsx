import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Sparkles, Tag, X, Monitor, Gamepad2, Home, Wifi, Smartphone } from 'lucide-react';

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
      <article className="group relative flex flex-col justify-between rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-6 shadow-[0_6px_24px_-6px_rgba(44,37,32,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B85D3B]/60 hover:shadow-[0_12px_28px_-6px_rgba(184,93,59,0.14)]">
        {/* Decorative Haibane corner accent */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C26D4A]/40 to-transparent" />

        <div>
          {/* Top bar: Store badge + Clear Category Pill */}
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest border ${
                isTemu
                  ? 'bg-[#C26D4A]/12 text-[#A04E2D] border-[#C26D4A]/35'
                  : 'bg-[#8C4A32]/12 text-[#7A3B24] border-[#8C4A32]/35'
              }`}
            >
              {isTemu ? 'TEMU CUPÓN' : 'ALIEXPRESS CUPÓN'}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE6D8] border border-[#D8C8B4] px-3 py-1 text-[11px] font-semibold text-[#5C4F44]">
              <CategoryIcon className="h-3.5 w-3.5 text-[#9E583B]" />
              <span>{coupon.categoryLabel}</span>
            </span>
          </div>

          {coupon.isSecretSearch && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#D4A359]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#7A541D] border border-[#D4A359]/45">
                <Sparkles className="h-3 w-3 text-[#9E6B24]" />
                {dict.secretSearchTag}
              </span>
            </div>
          )}

          {/* Clear Category-Focused Title */}
          <h3 className="mb-2 font-serif text-xl font-bold leading-snug text-[#2C2520] group-hover:text-[#9E472A] transition-colors">
            {coupon.title}
          </h3>

          {/* Explicit "What is this coupon for?" explanation */}
          {coupon.appliesToText && (
            <p className="mb-4 text-xs leading-relaxed text-[#6E6055] bg-[#F2EBE1]/80 rounded-lg px-3 py-2 border border-[#E5DAC9]">
              {coupon.appliesToText}
            </p>
          )}

          {/* Crystal-Clear Coupon Value Box (No confusing fake product prices!) */}
          <div className="mb-5 rounded-xl bg-[#F0E7DA] p-3.5 border border-[#D8C8B4]">
            <div className="flex items-center justify-between gap-2 border-b border-[#DFD2C0] pb-2.5 mb-2.5">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7A6B5E] block">
                  {localeConfig.lang === 'es' ? 'Te descuentan / Ahorras:' : 'Discount Value:'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif text-2xl font-extrabold text-[#9E472A]">
                    -{coupon.discountPct}%
                  </span>
                  <span className="font-mono text-xs font-bold text-[#4F6857] bg-[#4F6857]/12 px-2 py-0.5 rounded border border-[#4F6857]/25">
                    {localeConfig.lang === 'es' ? `Hasta ${coupon.localDiscountAmount}` : `Up to ${coupon.localDiscountAmount}`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#7A6B5E] block">
                  {localeConfig.lang === 'es' ? 'En compras desde:' : `${dict.minSpend}:`}
                </span>
                <span className="font-mono text-sm font-bold text-[#2C2520]">
                  {coupon.localMinSpend}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6E6055]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#4F6857]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {dict.verifiedBadge}
              </span>
              <span>{dict.expiresLabel}</span>
            </div>
          </div>
        </div>

        {/* Code Ticket & CTA Button */}
        <div className="mt-1 flex flex-col gap-2.5">
          <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-[#C7B6A2] bg-[#F5EFE6] px-3.5 py-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6B5E]">
              {localeConfig.lang === 'es' ? 'CÓDIGO:' : 'CODE:'}
            </span>
            <code className="font-mono text-base font-extrabold tracking-wider text-[#9E472A] select-all">
              {coupon.code}
            </code>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A85132] px-4 py-3 text-sm font-bold text-[#FAF6F0] shadow-sm transition hover:bg-[#8E4125] focus:outline-none focus:ring-2 focus:ring-[#A85132] focus:ring-offset-2 focus:ring-offset-[#FAF6F0]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>{dict.btnCopied}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{dict.btnGetCode}</span>
              </>
            )}
          </button>

          <a
            href={coupon.affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1 text-center text-xs font-semibold text-[#6E6055] hover:text-[#2C2520] py-1 transition"
          >
            <span>{dict.btnGoStore}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </article>

      {/* Modal with localized instructions in Haibane Parchment Style */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2520]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#D8C8B4] bg-[#FAF6F0] p-6 shadow-2xl text-[#2C2520]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#7A6B5E] hover:bg-[#EFE6D8] hover:text-[#2C2520]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3 flex items-center gap-2 text-[#4F6857]">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="font-serif text-xl font-bold text-[#2C2520]">{dict.modalTitle}</h4>
            </div>

            <p className="mb-2 text-sm font-bold text-[#2C2520]">{coupon.title}</p>
            {coupon.appliesToText && (
              <p className="mb-4 text-xs text-[#6E6055]">{coupon.appliesToText}</p>
            )}

            <div className="mb-5 flex items-center justify-between rounded-xl border-2 border-dashed border-[#A85132]/50 bg-[#F0E7DA] p-3.5">
              <code className="font-mono text-xl font-extrabold tracking-widest text-[#9E472A]">
                {coupon.code}
              </code>
              <span className="rounded-full bg-[#A85132]/15 px-3 py-1 text-xs font-bold text-[#9E472A]">
                -{coupon.discountPct}% ({coupon.localDiscountAmount})
              </span>
            </div>

            <ol className="mb-6 space-y-2 text-xs leading-relaxed text-[#5C4F44] list-decimal list-inside">
              {dict.modalSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <a
              href={coupon.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setModalOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A85132] px-5 py-3 text-sm font-bold text-[#FAF6F0] hover:bg-[#8E4125] transition"
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
