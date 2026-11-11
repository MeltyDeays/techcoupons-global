import React from 'react';
import { formatLocalPrice } from '../config/locales.js';
import { BookOpen, Truck, HelpCircle } from 'lucide-react';

export default function NativeSEOGuide({ localeConfig }) {
  const { dict } = localeConfig;
  const freeTemu = formatLocalPrice(localeConfig.freeShipTemu / localeConfig.rate, localeConfig);
  const freeAli = formatLocalPrice(localeConfig.freeShipAli / localeConfig.rate, localeConfig);

  return (
    <section className="mt-14 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
        <BookOpen className="h-6 w-6 text-emerald-400 shrink-0" />
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-100">
          {dict.seoGuideTitle}
        </h2>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        {/* Section 1 */}
        <div>
          <h3 className="mb-2.5 text-base font-bold text-emerald-300">
            {dict.seoSection1Title}
          </h3>
          <p className="text-slate-300 leading-7">
            {dict.seoSection1Body}
          </p>
        </div>

        {/* Section 2 + Shipping Table */}
        <div>
          <h3 className="mb-2.5 flex items-center gap-2 text-base font-bold text-emerald-300">
            <Truck className="h-4 w-4" />
            <span>{dict.seoSection2Title}</span>
          </h3>
          <p className="mb-4 text-slate-300 leading-7">
            {dict.seoSection2Body}
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-950 text-slate-300 uppercase">
                <tr>
                  {dict.tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 font-semibold border-b border-slate-800">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/70">
                <tr>
                  <td className="px-4 py-3 font-bold text-orange-400">Temu Direct</td>
                  <td className="px-4 py-3">Standard Air Logistics / Local Courier</td>
                  <td className="px-4 py-3 font-mono">5 - 8 Days</td>
                  <td className="px-4 py-3 font-mono text-emerald-400">{localeConfig.currency}{localeConfig.freeShipTemu.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="px-4 py-3 font-bold text-rose-400">AliExpress Choice</td>
                  <td className="px-4 py-3">Choice Priority Consolidated Air</td>
                  <td className="px-4 py-3 font-mono">6 - 10 Days</td>
                  <td className="px-4 py-3 font-mono text-emerald-400">{localeConfig.currency}{localeConfig.freeShipAli.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-sky-400">Express Hardware</td>
                  <td className="px-4 py-3">DHL / FedEx Priority Hardware Line</td>
                  <td className="px-4 py-3 font-mono">3 - 5 Days</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{freeTemu}+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: FAQs */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-emerald-300">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ — {localeConfig.countryName} ({localeConfig.currencyCode})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {dict.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
              >
                <h4 className="mb-1.5 font-bold text-slate-100">{faq.q}</h4>
                <p className="text-xs leading-relaxed text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
