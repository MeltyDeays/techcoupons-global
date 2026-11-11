import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Sparkles, Tag, X } from 'lucide-react';

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

  return (
    <>
      <article className="group relative flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg transition-all duration-200 hover:border-emerald-500/50 hover:bg-slate-900">
        <div>
          {/* Top bar: Store badge + Discount */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                isTemu
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isTemu ? 'TEMU OFFICIAL' : 'ALIEXPRESS PORTALS'}
            </span>

            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300">
              -{coupon.discountPct}% OFF
            </span>
          </div>

          {/* Tag type */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Tag className="h-3 w-3 text-slate-500" />
              {coupon.categoryLabel}
            </span>
            {coupon.isSecretSearch && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                {dict.secretSearchTag}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-3 text-base font-bold leading-snug text-slate-100 group-hover:text-emerald-300 transition-colors">
            {coupon.title}
          </h3>

          {/* Price & Min Spend Box */}
          <div className="mb-4 flex items-baseline justify-between rounded-lg bg-slate-950/80 px-3.5 py-2.5 border border-slate-800/80">
            <div>
              <span className="text-xs text-slate-400 block">{dict.minSpend}: {coupon.localMinSpend}</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-lg font-extrabold text-emerald-400">{coupon.localPrice}</span>
                <span className="font-mono text-xs text-slate-500 line-through">{coupon.localOriginalPrice}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                {dict.verifiedBadge}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">{dict.expiresLabel}</span>
            </div>
          </div>
        </div>

        {/* Code & CTA Button */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">CODE:</span>
            <code className="font-mono text-sm font-bold tracking-wider text-amber-300 select-all">
              {coupon.code}
            </code>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
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
            className="inline-flex items-center justify-center gap-1 text-center text-xs font-medium text-slate-400 hover:text-slate-200 py-1"
          >
            <span>{dict.btnGoStore}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </article>

      {/* Modal with localized instructions */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="text-lg font-bold text-slate-100">{dict.modalTitle}</h4>
            </div>

            <p className="mb-3 text-sm font-medium text-slate-300">{coupon.title}</p>

            <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-slate-950 p-3.5">
              <code className="font-mono text-lg font-extrabold tracking-widest text-emerald-400">
                {coupon.code}
              </code>
              <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                -{coupon.discountPct}%
              </span>
            </div>

            <ol className="mb-6 space-y-2 text-xs leading-relaxed text-slate-300 list-decimal list-inside">
              {dict.modalSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <a
              href={coupon.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setModalOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition"
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
