import { LANGUAGE_PACKS, BASE_DOMAIN, CATEGORY_SLUGS } from '../data/i18nDictionaries.js';

const RAW_MARKETS = [
  // Norteamérica
  { code: 'en-us', lang: 'en', countryName: 'United States', languageName: 'English (US)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇺🇸', rtl: false, freeShipTemu: 15, freeShipAli: 10 },
  { code: 'es-us', lang: 'es', countryName: 'Estados Unidos (Miami / Casilleros)', languageName: 'Español (US)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇺🇸', rtl: false, freeShipTemu: 15, freeShipAli: 10 },
  { code: 'en-ca', lang: 'en', countryName: 'Canada', languageName: 'English (CA)', currency: 'CA$', currencyCode: 'CAD', rate: 1.38, flag: '🇨🇦', rtl: false, freeShipTemu: 20, freeShipAli: 15 },
  { code: 'fr-ca', lang: 'fr', countryName: 'Canada (Québec)', languageName: 'Français (CA)', currency: 'CA$', currencyCode: 'CAD', rate: 1.38, flag: '🇨🇦', rtl: false, freeShipTemu: 20, freeShipAli: 15 },
  { code: 'es-mx', lang: 'es', countryName: 'México', languageName: 'Español (MX)', currency: 'MXN $', currencyCode: 'MXN', rate: 20, flag: '🇲🇽', rtl: false, freeShipTemu: 199, freeShipAli: 170 },

  // Europa Occidental (Alto CPA)
  { code: 'de-de', lang: 'de', countryName: 'Deutschland', languageName: 'Deutsch', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇩🇪', rtl: false, freeShipTemu: 10, freeShipAli: 10 },
  { code: 'fr-fr', lang: 'fr', countryName: 'France', languageName: 'Français', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇫🇷', rtl: false, freeShipTemu: 10, freeShipAli: 10 },
  { code: 'en-gb', lang: 'en', countryName: 'United Kingdom', languageName: 'English (UK)', currency: '£', currencyCode: 'GBP', rate: 0.78, flag: '🇬🇧', rtl: false, freeShipTemu: 10, freeShipAli: 8 },
  { code: 'es-es', lang: 'es', countryName: 'España', languageName: 'Español (ES)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇪🇸', rtl: false, freeShipTemu: 10, freeShipAli: 10 },
  { code: 'it-it', lang: 'it', countryName: 'Italia', languageName: 'Italiano', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇮🇹', rtl: false, freeShipTemu: 10, freeShipAli: 10 },
  { code: 'nl-nl', lang: 'nl', countryName: 'Nederland', languageName: 'Nederlands', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇳🇱', rtl: false, freeShipTemu: 10, freeShipAli: 10 },
  { code: 'pl-pl', lang: 'pl', countryName: 'Polska', languageName: 'Polski', currency: 'zł', currencyCode: 'PLN', rate: 4.0, flag: '🇵🇱', rtl: false, freeShipTemu: 40, freeShipAli: 40 },
  { code: 'pt-pt', lang: 'pt', countryName: 'Portugal', languageName: 'Português (PT)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇵🇹', rtl: false, freeShipTemu: 10, freeShipAli: 10 },

  // Latinoamérica
  { code: 'pt-br', lang: 'pt', countryName: 'Brasil', languageName: 'Português (BR)', currency: 'R$', currencyCode: 'BRL', rate: 5.7, flag: '🇧🇷', rtl: false, freeShipTemu: 99, freeShipAli: 99 },
  { code: 'es-co', lang: 'es', countryName: 'Colombia', languageName: 'Español (CO)', currency: 'COP $', currencyCode: 'COP', rate: 4200, flag: '🇨🇴', rtl: false, freeShipTemu: 55000, freeShipAli: 45000 },
  { code: 'es-cl', lang: 'es', countryName: 'Chile', languageName: 'Español (CL)', currency: 'CLP $', currencyCode: 'CLP', rate: 950, flag: '🇨🇱', rtl: false, freeShipTemu: 12000, freeShipAli: 10000 },
  { code: 'es-pa', lang: 'es', countryName: 'Panamá', languageName: 'Español (PA)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇵🇦', rtl: false, freeShipTemu: 15, freeShipAli: 10 },
  { code: 'es-pe', lang: 'es', countryName: 'Perú', languageName: 'Español (PE)', currency: 'S/', currencyCode: 'PEN', rate: 3.75, flag: '🇵🇪', rtl: false, freeShipTemu: 55, freeShipAli: 40 },

  // Asia-Pacífico y Medio Oriente (Alto Ticket)
  { code: 'ja-jp', lang: 'ja', countryName: '日本 (Japan)', languageName: '日本語', currency: '¥', currencyCode: 'JPY', rate: 152, flag: '🇯🇵', rtl: false, freeShipTemu: 2100, freeShipAli: 1500 },
  { code: 'ko-kr', lang: 'ko', countryName: '대한민국 (South Korea)', languageName: '한국어', currency: '₩', currencyCode: 'KRW', rate: 1380, flag: '🇰🇷', rtl: false, freeShipTemu: 15000, freeShipAli: 13000 },
  { code: 'en-au', lang: 'en', countryName: 'Australia', languageName: 'English (AU)', currency: 'A$', currencyCode: 'AUD', rate: 1.52, flag: '🇦🇺', rtl: false, freeShipTemu: 20, freeShipAli: 15 },
  { code: 'en-nz', lang: 'en', countryName: 'New Zealand', languageName: 'English (NZ)', currency: 'NZ$', currencyCode: 'NZD', rate: 1.66, flag: '🇳🇿', rtl: false, freeShipTemu: 25, freeShipAli: 18 },
  { code: 'ar-ae', lang: 'ar', countryName: 'الإمارات العربية المتحدة (UAE)', languageName: 'العربية (الإمارات)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: true, freeShipTemu: 50, freeShipAli: 40 },
  { code: 'en-ae', lang: 'en', countryName: 'United Arab Emirates', languageName: 'English (UAE)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: false, freeShipTemu: 50, freeShipAli: 40 }
];

function interpolateText(str, market) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\{country\}/g, market.countryName)
    .replace(/\{currency\}/g, `${market.currency} (${market.currencyCode})`);
}

function localizePack(pack, market) {
  return {
    ...pack,
    heroTitle: interpolateText(pack.heroTitle, market),
    heroSubtitle: interpolateText(pack.heroSubtitle, market),
    modalSteps: pack.modalSteps.map((s) => interpolateText(s, market)),
    seoGuideTitle: interpolateText(pack.seoGuideTitle, market),
    seoSection1Body: interpolateText(pack.seoSection1Body, market),
    seoSection2Title: interpolateText(pack.seoSection2Title, market),
    seoSection2Body: interpolateText(pack.seoSection2Body, market),
    faqs: pack.faqs.map((f) => ({
      q: interpolateText(f.q, market),
      a: interpolateText(f.a, market)
    })),
    legal: {
      ...pack.legal,
      termsBody: interpolateText(pack.legal.termsBody, market)
    }
  };
}

export const LOCALES = RAW_MARKETS.map((market) => {
  const basePack = LANGUAGE_PACKS[market.lang] || LANGUAGE_PACKS.en;
  return {
    ...market,
    dict: localizePack(basePack, market)
  };
});

export const LOCALE_MAP = Object.fromEntries(LOCALES.map((l) => [l.code, l]));
export const DEFAULT_LOCALE = 'en-us';

export function getLocaleConfig(code) {
  const normalized = (code || DEFAULT_LOCALE).toLowerCase();
  return LOCALE_MAP[normalized] || LOCALE_MAP[DEFAULT_LOCALE];
}

export function detectBrowserLocale() {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const raw = (navigator.language || 'en-us').toLowerCase();
  if (LOCALE_MAP[raw]) return raw;
  const prefix = raw.split('-')[0];
  const fallbackByPrefix = {
    es: 'es-mx',
    de: 'de-de',
    fr: 'fr-fr',
    pt: 'pt-br',
    it: 'it-it',
    nl: 'nl-nl',
    pl: 'pl-pl',
    ja: 'ja-jp',
    ko: 'ko-kr',
    ar: 'ar-ae',
    en: 'en-us'
  };
  return fallbackByPrefix[prefix] || DEFAULT_LOCALE;
}

export function formatLocalPrice(usdAmount, localeConfig) {
  const rawVal = usdAmount * localeConfig.rate;
  let rounded;
  if (localeConfig.rate >= 500) {
    rounded = Math.round(rawVal / 500) * 500;
  } else if (localeConfig.rate >= 50) {
    rounded = Math.round(rawVal / 10) * 10;
  } else {
    rounded = Math.round(rawVal);
  }
  return `${localeConfig.currency}${rounded.toLocaleString()}`;
}

export function buildStructuredData(localeConfig, coupons, canonicalUrl) {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: localeConfig.dict.heroTitle,
    description: localeConfig.dict.heroSubtitle,
    url: canonicalUrl,
    numberOfItems: coupons.length,
    itemListElement: coupons.slice(0, 15).map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: c.title,
        category: c.categoryLabel,
        brand: {
          '@type': 'Brand',
          name: c.store === 'temu' ? 'Temu' : 'AliExpress'
        },
        offers: {
          '@type': 'Offer',
          url: c.affiliateLink,
          priceCurrency: c.currencyCode,
          price: String(c.numericPrice),
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2026-12-31'
        }
      }
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localeConfig.dict.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  };

  return [itemListSchema, faqSchema];
}

export { BASE_DOMAIN, CATEGORY_SLUGS };
