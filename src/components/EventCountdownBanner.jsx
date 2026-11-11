import React, { useState, useEffect } from 'react';
import { getActiveOrNextEvent, getEventBannerText, getEventDateLabel } from '../data/eventsCalendar.js';
import { Flame, Clock, Sparkles, Calendar } from 'lucide-react';

function computeTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function EventCountdownBanner({
  localeConfig,
  storeFilter = null,
  onlyEvent1111 = false,
  onToggleEvent1111
}) {
  const [eventInfo, setEventInfo] = useState(() => getActiveOrNextEvent(new Date()));
  const [timeLeft, setTimeLeft] = useState(() =>
    computeTimeLeft(getActiveOrNextEvent(new Date()).targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const currentEv = getActiveOrNextEvent(new Date());
      setEventInfo(currentEv);
      setTimeLeft(computeTimeLeft(currentEv.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hasTemuInCountry = localeConfig?.stores?.includes('temu') ?? true;
  const txt = getEventBannerText(localeConfig.lang, eventInfo.id, hasTemuInCountry, storeFilter);
  const isLive = eventInfo.status === 'LIVE';
  const pad = (n) => String(n).padStart(2, '0');
  const dateLabel = getEventDateLabel(eventInfo, localeConfig.lang);

  const displayTag = storeFilter && eventInfo.codeTagByStore?.[storeFilter]
    ? eventInfo.codeTagByStore[storeFilter]
    : eventInfo.codeTag;

  return (
    <div className="mb-4 sm:mb-6 w-full max-w-full min-w-0 overflow-hidden rounded-2xl border-2 border-[#B85332]/40 bg-gradient-to-r from-[#FCF9F4] via-[#F6EFE4] to-[#FCF9F4] p-3.5 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 min-w-0">
        {/* Left: Event Badge + Title + Description */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85332] px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#FCF9F4] shadow-sm">
              <Flame className="h-3.5 w-3.5 shrink-0" />
              <span>{displayTag} • {isLive ? txt.liveBadge : txt.upcomingBadge}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8B4] bg-[#FCF9F4] px-2.5 py-1 text-[10px] sm:text-xs font-bold text-[#574B40] shadow-sm">
              <Calendar className="h-3 w-3 text-[#B85332] shrink-0" />
              <span>{dateLabel}</span>
            </span>
          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#1F1B18] leading-snug break-words">
            {txt.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#574B40] leading-relaxed break-words">
            {txt.desc}
          </p>
        </div>

        {/* Right: Live Automatic Countdown + 11.11 Filter Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-2.5 shrink-0 min-w-0">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 rounded-xl border border-[#D8C8B4] bg-[#FCF9F4] px-3 py-2 shadow-sm">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-[#6E6055] uppercase">
              <Clock className="h-3.5 w-3.5 text-[#B85332] shrink-0" />
              <span>{isLive ? txt.endsIn : txt.startsIn}</span>
            </span>

            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-extrabold text-[#1F1B18]">
              <span className="rounded bg-[#F0E9DF] border border-[#DED4C6] px-1.5 py-0.5 text-[#B85332]">
                {pad(timeLeft.days)}{txt.days}
              </span>
              <span>:</span>
              <span className="rounded bg-[#F0E9DF] border border-[#DED4C6] px-1.5 py-0.5 text-[#1F1B18]">
                {pad(timeLeft.hours)}{txt.hours}
              </span>
              <span>:</span>
              <span className="rounded bg-[#F0E9DF] border border-[#DED4C6] px-1.5 py-0.5 text-[#1F1B18]">
                {pad(timeLeft.minutes)}{txt.minutes}
              </span>
              <span>:</span>
              <span className="rounded bg-[#F0E9DF] border border-[#DED4C6] px-1.5 py-0.5 text-[#B85332]">
                {pad(timeLeft.seconds)}{txt.seconds}
              </span>
            </div>
          </div>

          {onToggleEvent1111 && (
            <button
              type="button"
              onClick={onToggleEvent1111}
              className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition shadow-sm ${
                onlyEvent1111
                  ? 'bg-[#1F1B18] text-[#FCF9F4]'
                  : 'bg-[#B85332] text-[#FCF9F4] hover:bg-[#9E4224]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{onlyEvent1111 ? txt.showing1111Btn : txt.filter1111Btn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
