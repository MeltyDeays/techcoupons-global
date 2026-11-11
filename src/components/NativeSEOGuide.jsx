import React from 'react';
import { formatLocalPrice } from '../config/locales.js';
import { BookOpen, Truck, HelpCircle } from 'lucide-react';

export default function NativeSEOGuide({ localeConfig }) {
  const { dict } = localeConfig;
  const hasTemu = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');
  const freeTemu = hasTemu
    ? `${localeConfig.currency}${localeConfig.freeShipTemu.toLocaleString()}`
    : 'Vía Casillero Miami (ES-US)';
  const freeAli = `${localeConfig.currency}${localeConfig.freeShipAli.toLocaleString()}`;

  return (
    <section className="mt-14 rounded-2xl border border-[#DCCFC0] bg-[#FAF6F0] p-6 md:p-8 shadow-sm text-[#2C2520]">
      <div className="mb-6 flex items-center gap-3 border-b border-[#E5DAC9] pb-4">
        <BookOpen className="h-6 w-6 text-[#A85132] shrink-0" />
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2C2520]">
          {dict.seoGuideTitle}
        </h2>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-[#5C4F44]">
        {/* Section 1 */}
        <div>
          <h3 className="mb-2.5 font-serif text-lg font-bold text-[#9E472A]">
            {dict.seoSection1Title}
          </h3>
          <p className="leading-7">
            {dict.seoSection1Body}
          </p>
        </div>

        {/* Section 2 + Shipping Table */}
        <div>
          <h3 className="mb-2.5 flex items-center gap-2 font-serif text-lg font-bold text-[#9E472A]">
            <Truck className="h-4 w-4" />
            <span>{dict.seoSection2Title}</span>
          </h3>
          <p className="mb-4 leading-7">
            {dict.seoSection2Body}
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#D8C8B4]">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#EFE6D8] text-[#5C4F44] uppercase">
                <tr>
                  {dict.tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 font-bold border-b border-[#D8C8B4]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DAC9] bg-[#FAF6F0]">
                <tr>
                  <td className="px-4 py-3 font-bold text-[#7A3B24]">AliExpress Direct / Choice</td>
                  <td className="px-4 py-3">AliExpress Standard Air / Correo Nacional & Casillero</td>
                  <td className="px-4 py-3 font-mono">6 - 14 Days</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#4F6857]">{freeAli}</td>
                </tr>
                <tr className="bg-[#F5EFE6]/70">
                  <td className="px-4 py-3 font-bold text-[#A85132]">Temu Oficial</td>
                  <td className="px-4 py-3">
                    {hasTemu ? 'Envío Aéreo Directo a Domicilio' : 'Envío Gratis a Casillero en Miami (Florida 33166)'}
                  </td>
                  <td className="px-4 py-3 font-mono">5 - 9 Days</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#4F6857]">{freeTemu}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[#5C4F44]">Express DHL / FedEx</td>
                  <td className="px-4 py-3">Prioritario para Computadoras, Mini PCs y Monitores</td>
                  <td className="px-4 py-3 font-mono">3 - 6 Days</td>
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
          <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-[#9E472A]">
            <HelpCircle className="h-4 w-4" />
            <span>Preguntas Frecuentes — {localeConfig.countryName} ({localeConfig.currencyCode})</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {dict.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#D8C8B4] bg-[#F5EFE6] p-4"
              >
                <h4 className="mb-1.5 font-serif text-base font-bold text-[#2C2520]">{faq.q}</h4>
                <p className="text-xs leading-relaxed text-[#5C4F44]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
