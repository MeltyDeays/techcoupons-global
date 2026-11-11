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
    <section className="mt-14 rounded-2xl border border-[#DED4C6] bg-[#FCF9F4] p-6 md:p-8 shadow-sm text-[#1F1B18] font-sans">
      <div className="mb-6 flex items-center gap-3 border-b border-[#E5DAC9] pb-4">
        <BookOpen className="h-6 w-6 text-[#B85332] shrink-0" />
        <h2 className="text-xl md:text-2xl font-extrabold text-[#1F1B18]">
          {dict.seoGuideTitle}
        </h2>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-[#574B40]">
        {/* Section 1 */}
        <div>
          <h3 className="mb-2 text-base font-extrabold text-[#B85332]">
            {dict.seoSection1Title}
          </h3>
          <p className="leading-7">
            {dict.seoSection1Body}
          </p>
        </div>

        {/* Section 2 + Shipping Table */}
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold text-[#B85332]">
            <Truck className="h-4 w-4" />
            <span>{dict.seoSection2Title}</span>
          </h3>
          <p className="mb-4 leading-7">
            {dict.seoSection2Body}
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#D8C8B4]">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#F0E9DF] text-[#574B40] uppercase">
                <tr>
                  {dict.tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 font-extrabold border-b border-[#D8C8B4]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DAC9] bg-[#FCF9F4]">
                <tr>
                  <td className="px-4 py-3 font-bold text-[#7A3B24]">{st.aliStore}</td>
                  <td className="px-4 py-3">{st.aliMethod}</td>
                  <td className="px-4 py-3 font-mono">{st.aliDays}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#3D6352]">{freeAli}</td>
                </tr>
                <tr className="bg-[#F6F2EA]/70">
                  <td className="px-4 py-3 font-bold text-[#B85332]">{st.temuStore}</td>
                  <td className="px-4 py-3">
                    {hasTemu ? st.temuMethodDirect : st.temuMethodLocker}
                  </td>
                  <td className="px-4 py-3 font-mono">{st.temuDays}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#3D6352]">{freeTemu}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[#574B40]">{st.expressStore}</td>
                  <td className="px-4 py-3">{st.expressMethod}</td>
                  <td className="px-4 py-3 font-mono">{st.expressDays}</td>
                  <td className="px-4 py-3 font-mono text-[#7A6B5E]">
                    {formatLocalPrice(65, localeConfig)}+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: FAQs */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#B85332]">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ — {localizedCountry} ({localeConfig.currencyCode})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {dict.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#D8C8B4] bg-[#F6F2EA] p-4"
              >
                <h4 className="mb-1.5 text-sm font-extrabold text-[#1F1B18]">{faq.q}</h4>
                <p className="text-xs leading-relaxed text-[#574B40]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
