import React from 'react';
import { formatLocalPrice } from '../config/locales.js';
import { getSectionText, getLocalizedCountryName } from '../data/multilingualSections.js';
import { BookOpen, Truck, HelpCircle } from 'lucide-react';

export default function NativeSEOGuide({ localeConfig }) {
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const st = ui.shippingTable;
  const localizedCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const hasTemu = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');
  const freeTemu = hasTemu
    ? `${localeConfig.currency}${localeConfig.freeShipTemu.toLocaleString()}`
    : st.temuFreeLockerLabel;
  const freeAli = `${localeConfig.currency}${localeConfig.freeShipAli.toLocaleString()}`;

  return (
    <section className="mt-8 sm:mt-14 w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-4 sm:p-6 md:p-8 shadow-sm text-[#1F1B18] font-sans">
      <div className="mb-5 sm:mb-6 flex items-center gap-3 border-b border-[#E5DAC9] pb-4 min-w-0">
        <BookOpen className="h-6 w-6 text-[#B85332] shrink-0" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1F1B18] break-words">
          {dict.seoGuideTitle}
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8 text-xs sm:text-sm leading-relaxed text-[#574B40] min-w-0">
        {/* Section 1 */}
        <div className="min-w-0">
          <h3 className="mb-2 text-sm sm:text-base font-extrabold text-[#B85332] break-words">
            {dict.seoSection1Title}
          </h3>
          <p className="leading-6 sm:leading-7 break-words">
            {dict.seoSection1Body}
          </p>
        </div>

        {/* Section 2 + Shipping Table */}
        <div className="min-w-0">
          <h3 className="mb-2 flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#B85332]">
            <Truck className="h-4 w-4 shrink-0" />
            <span className="break-words">{dict.seoSection2Title}</span>
          </h3>
          <p className="mb-4 leading-6 sm:leading-7 break-words">
            {dict.seoSection2Body}
          </p>

          <div className="w-full max-w-full overflow-x-auto rounded-xl border border-[#D8C8B4]">
            <table className="w-full text-left text-[11px] sm:text-xs md:text-sm">
              <thead className="bg-[#F0E9DF] text-[#574B40] uppercase">
                <tr>
                  {dict.tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-extrabold border-b border-[#D8C8B4]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DAC9] bg-[#FCF9F4]">
                <tr>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold text-[#7A3B24]">{st.aliStore}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3">{st.aliMethod}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono">{st.aliDays}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono font-bold text-[#3D6352]">{freeAli}</td>
                </tr>
                <tr className="bg-[#F6F2EA]/70">
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold text-[#B85332]">{st.temuStore}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3">
                    {hasTemu ? st.temuMethodDirect : st.temuMethodLocker}
                  </td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono">{st.temuDays}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono font-bold text-[#3D6352]">{freeTemu}</td>
                </tr>
                <tr>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold text-[#574B40]">{st.expressStore}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3">{st.expressMethod}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono">{st.expressDays}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-[#7A6B5E]">
                    {formatLocalPrice(65, localeConfig)}+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: FAQs */}
        <div className="min-w-0">
          <h3 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#B85332]">
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className="break-words">FAQ — {localizedCountry} ({localeConfig.currencyCode})</span>
          </h3>
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
            {dict.faqs.map((faq, index) => (
              <div
                key={index}
                className="min-w-0 rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] p-3.5 sm:p-4"
              >
                <h4 className="mb-1.5 text-xs sm:text-sm font-extrabold text-[#1F1B18] break-words">{faq.q}</h4>
                <p className="text-xs leading-relaxed text-[#574B40] break-words">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
