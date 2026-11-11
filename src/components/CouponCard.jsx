import React, { useState } from 'react';
import { getSectionText } from '../data/multilingualSections.js';
import { resolveCouponExpiration } from '../data/couponLifecycle.js';
import {
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Tag,
  X,
  Monitor,
  Gamepad2,
  Home,
  Wifi,
  Smartphone,
  ShoppingCart,
  Eye,
  Shirt,
  Sparkles,
  Wrench,
  Puzzle,
  Bike,
  PawPrint,
  Baby
} from 'lucide-react';

const CATEGORY_ICONS = {
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
  'bebes-oficina': Baby,
  'redes-wifi': Wifi
};

function formatExpirationLabel(info, localeConfig, dict) {
  if (!info) return dict?.expiresLabel || '';
  if (info.isExpired) {
    return localeConfig?.lang === 'es' ? 'Expirado' : 'Expired';
  }
  if (!isFinite(info.timeRemainingMs)) {
    return localeConfig?.lang === 'es' ? 'Cupón Permanente' : 'Evergreen Voucher';
  }

  const days = Math.floor(info.timeRemainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((info.timeRemainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 14) {
    try {
      const expDate = new Date(info.expiresAt);
      const formatted = expDate.toLocaleDateString(localeConfig?.code || 'en-US', { month: 'short', day: 'numeric' });
      return localeConfig?.lang === 'es' ? `Hasta ${formatted}` : `Thru ${formatted}`;
    } catch {
      return dict?.expiresLabel || '';
    }
  }
  if (days > 1) {
    return localeConfig?.lang === 'es' ? `Expira en ${days} días` : `Expires in ${days} days`;
  }
  if (days === 1) {
    return localeConfig?.lang === 'es' ? 'Expira mañana' : 'Expires tomorrow';
  }
  if (hours > 0) {
    return localeConfig?.lang === 'es' ? `Expira hoy (${hours}h)` : `Expires today (${hours}h)`;
  }
  return localeConfig?.lang === 'es' ? 'Expira hoy' : 'Expires today';
}

export default function CouponCard({ coupon, localeConfig }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const expirationInfo = resolveCouponExpiration(coupon);
  const expirationBadge = formatExpirationLabel(expirationInfo, localeConfig, dict);

  // Step 1: Copy code, reveal it on card, and open the instruction modal FIRST (no immediate redirect!)
  const handleRevealAndCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coupon.code);
      }
    } catch {
      // Fallback silent
    }
    setRevealed(true);
    setCopied(true);
    setModalOpen(true);
    setTimeout(() => setCopied(false), 4000);
  };

  const handleCopyPrimaryAgain = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coupon.code);
      }
    } catch {
      // Fallback silent
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyBackup = async (e) => {
    e.stopPropagation();
    if (!coupon.backupCode) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coupon.backupCode);
      }
    } catch {
      // Fallback silent
    }
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 3000);
  };

  const isTemu = coupon.store === 'temu';
  const CategoryIcon = CATEGORY_ICONS[coupon.category] || Tag;
  const shortCatLabel = ui.catShort?.[coupon.category] || coupon.categoryLabel;
  const maskedCode =
    coupon.code.length > 4 ? `${coupon.code.slice(0, 4)}••••` : `${coupon.code.slice(0, 2)}•••`;

  return (
    <>
      <article className="group relative flex w-full max-w-full min-w-0 overflow-hidden flex-col justify-between rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-5 shadow-[0_4px_20px_-6px_rgba(31,27,24,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B85332]/60 hover:shadow-[0_12px_26px_-8px_rgba(184,83,50,0.14)] font-sans">
        <div className="min-w-0">
          {/* Top bar: Localized Store Badge + Clean Category Pill */}
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border ${
                isTemu
                  ? 'bg-[#B85332]/12 text-[#9E4224] border-[#B85332]/30'
                  : 'bg-[#7A3B24]/12 text-[#6E331D] border-[#7A3B24]/30'
              }`}
            >
              {isTemu ? ui.storeBadgeTemu : ui.storeBadgeAli}
            </span>

            <span className="inline-flex min-w-0 max-w-full sm:max-w-[60%] items-center gap-1.5 rounded-lg bg-[#F0E9DF] border border-[#D8C8B4] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#574B40] truncate">
              <CategoryIcon className="h-3.5 w-3.5 text-[#B85332] shrink-0" />
              <span className="truncate">{shortCatLabel}</span>
            </span>
          </div>

          {/* Direct Checkout Usage Tag + Eligibility Badge */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#3D6352]/12 px-2 py-0.5 text-[10px] font-bold text-[#3D6352] border border-[#3D6352]/25">
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span className="break-words">{ui.checkoutBadge}</span>
            </span>
            {coupon.eligibilityText && (
              <span className="inline-flex items-center rounded-md bg-[#B85332]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#9E4224] border border-[#B85332]/25 break-words">
                {coupon.eligibilityText}
              </span>
            )}
          </div>

          {/* High-Readability Title */}
          <h3 className="mb-2 text-base sm:text-lg font-extrabold leading-snug text-[#1F1B18] group-hover:text-[#B85332] transition-colors break-words">
            {coupon.title}
          </h3>

          {/* Explicit Coverage + Regional Note */}
          {(coupon.appliesToText || coupon.regionalNote) && (
            <div className="mb-3.5 space-y-1.5 rounded-xl bg-[#F3ECE2] px-3 py-2 border border-[#E5DAC9]">
              {coupon.appliesToText && (
                <p className="text-xs leading-relaxed text-[#574B40] break-words">{coupon.appliesToText}</p>
              )}
              {coupon.regionalNote && (
                <p className="text-[11px] font-semibold leading-snug text-[#3D6352] break-words">
                  • {coupon.regionalNote}
                </p>
              )}
            </div>
          )}

          {/* Benefit Summary Box */}
          <div className="mb-4 rounded-xl bg-[#F0E9DF] p-3 border border-[#DED4C6]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED4C6] pb-2 mb-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#6E6055] block">
                  {ui.directDiscount}
                </span>
                <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#B85332]">
                    -{coupon.discountPct}%
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#3D6352] bg-[#3D6352]/12 px-2 py-0.5 rounded border border-[#3D6352]/25">
                    {ui.saveUpTo(coupon.localDiscountAmount)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#6E6055] block">
                  {ui.minSpendLabel}:
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#1F1B18]">
                  {coupon.localMinSpend}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-medium text-[#6E6055]">
              <span className="inline-flex items-center gap-1 font-bold text-[#3D6352]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                {dict.verifiedBadge}
              </span>
              <span>{expirationBadge}</span>
            </div>
          </div>
        </div>

        {/* Code Box & Action Button */}
        <div className="mt-1 flex flex-col gap-2 min-w-0">
          <div
            onClick={handleRevealAndCopy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleRevealAndCopy()}
            className="flex flex-wrap cursor-pointer items-center justify-between gap-1.5 rounded-xl border-2 border-dashed border-[#C7B6A2] bg-[#F6F2EA] hover:border-[#B85332] px-3 py-2 transition min-w-0"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6055] shrink-0">
              {ui.promoCodeLabel}
            </span>
            <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#B85332] select-all break-all">
              {revealed ? coupon.code : maskedCode}
            </code>
          </div>

          {revealed && coupon.backupCode && (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E5DAC9] bg-[#F3ECE2] px-2.5 py-1.5 text-[11px]">
              <span className="text-[#6E6055] font-semibold truncate">
                {ui.backupCodeLabel}{' '}
                <code className="font-mono font-bold text-[#1F1B18] select-all">{coupon.backupCode}</code>
              </span>
              <button
                type="button"
                onClick={handleCopyBackup}
                className="inline-flex items-center gap-1 rounded bg-[#E6DDD0] hover:bg-[#D8C8B4] px-2 py-0.5 text-[10px] font-bold text-[#1F1B18] transition shrink-0"
              >
                {copiedBackup ? (
                  <>
                    <Check className="h-3 w-3 text-[#3D6352]" />
                    <span>{ui.copiedShort}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>{ui.copyShort}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleRevealAndCopy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B85332] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#FCF9F4] shadow-sm transition active:scale-[0.99] hover:bg-[#9E4224]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5] shrink-0" />
                <span>{dict.btnCopied}</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 shrink-0" />
                <span>{dict.btnGetCode}</span>
              </>
            )}
          </button>

          <a
            href={coupon.affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1 text-center text-xs font-bold text-[#6E6055] hover:text-[#1F1B18] py-0.5 transition"
          >
            <span>{dict.btnGoStore}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </article>

      {/* Step 2 Modal: Shown FIRST so user sees the code, instructions, and clicks "Go to Official Store" when ready */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1B18]/60 p-4 backdrop-blur-sm font-sans"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#D8C8B4] bg-[#FCF9F4] p-5 sm:p-6 shadow-2xl text-[#1F1B18]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#7A6B5E] hover:bg-[#ECE5D8] hover:text-[#1F1B18]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3 flex items-center gap-2 text-[#3D6352]">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <h4 className="text-base sm:text-lg font-extrabold text-[#1F1B18] pr-6">{dict.modalTitle}</h4>
            </div>

            <p className="mb-1.5 text-sm font-bold text-[#1F1B18]">{coupon.title}</p>
            {coupon.appliesToText && (
              <p className="mb-3.5 text-xs leading-relaxed text-[#574B40]">{coupon.appliesToText}</p>
            )}

            {/* Primary Revealed Code + Copy Button */}
            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-[#B85332]/60 bg-[#F0E9DF] p-3.5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6055]">
                  {ui.promoCodeLabel}
                </span>
                <code className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-[#B85332] select-all">
                  {coupon.code}
                </code>
              </div>

              <button
                type="button"
                onClick={handleCopyPrimaryAgain}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85332] px-3 py-2 text-xs font-bold text-[#FCF9F4] hover:bg-[#9E4224] transition shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? ui.copiedShort : ui.copyShort}</span>
              </button>
            </div>

            {/* Backup Code Inside Modal */}
            {coupon.backupCode && (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-[#DED4C6] bg-[#F6F2EA] px-3.5 py-2.5 text-xs">
                <div>
                  <span className="text-[#6E6055] font-semibold">{ui.backupCodeLabel} </span>
                  <code className="font-mono font-extrabold text-[#1F1B18] select-all">
                    {coupon.backupCode}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#C7B6A2] bg-[#FCF9F4] hover:bg-[#ECE5D8] px-2.5 py-1 text-[11px] font-bold text-[#1F1B18] transition shrink-0"
                >
                  {copiedBackup ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#3D6352]" />
                      <span>{ui.copiedShort}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{ui.copyShort}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <ol className="mb-5 space-y-1.5 text-xs leading-relaxed text-[#574B40] list-decimal list-inside bg-[#F6F2EA] rounded-xl p-3 border border-[#E5DAC9]">
              {dict.modalSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            {/* Step 2 CTA: Redirects ONLY when the user clicks here */}
            <a
              href={coupon.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setModalOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D6352] px-5 py-3.5 text-sm font-extrabold text-[#FCF9F4] shadow-md hover:bg-[#2E4D3F] transition"
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
