import { LANGUAGE_PACKS, BASE_DOMAIN, CATEGORY_SLUGS } from '../data/i18nDictionaries.js';

const RAW_MARKETS = [
  // Norteamérica
  { code: 'en-us', iso: 'us', lang: 'en', countryName: 'United States', languageName: 'English (US)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇺🇸', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15, freeShipAli: 10 },
  { code: 'es-us', iso: 'us', lang: 'es', countryName: 'Estados Unidos (Casilleros Miami)', languageName: 'Español (US)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇺🇸', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15, freeShipAli: 10 },
  { code: 'en-ca', iso: 'ca', lang: 'en', countryName: 'Canada', languageName: 'English (CA)', currency: 'CA$', currencyCode: 'CAD', rate: 1.38, flag: '🇨🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'fr-ca', iso: 'ca', lang: 'fr', countryName: 'Canada (Québec)', languageName: 'Français (CA)', currency: 'CA$', currencyCode: 'CAD', rate: 1.38, flag: '🇨🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'es-mx', iso: 'mx', lang: 'es', countryName: 'México', languageName: 'Español (MX)', currency: 'MXN $', currencyCode: 'MXN', rate: 20, flag: '🇲🇽', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 199, freeShipAli: 170 },

  // Centroamérica y el Caribe
  { code: 'es-ni', iso: 'ni', lang: 'es', countryName: 'Nicaragua', languageName: 'Español (NI)', currency: 'C$ ', currencyCode: 'NIO', rate: 36.8, flag: '🇳🇮', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 370 },
  { code: 'es-cr', iso: 'cr', lang: 'es', countryName: 'Costa Rica', languageName: 'Español (CR)', currency: '₡', currencyCode: 'CRC', rate: 515, flag: '🇨🇷', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 5200 },
  { code: 'es-gt', iso: 'gt', lang: 'es', countryName: 'Guatemala', languageName: 'Español (GT)', currency: 'Q', currencyCode: 'GTQ', rate: 7.75, flag: '🇬🇹', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 80 },
  { code: 'es-sv', iso: 'sv', lang: 'es', countryName: 'El Salvador', languageName: 'Español (SV)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇸🇻', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 10 },
  { code: 'es-hn', iso: 'hn', lang: 'es', countryName: 'Honduras', languageName: 'Español (HN)', currency: 'L ', currencyCode: 'HNL', rate: 24.8, flag: '🇭🇳', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 250 },
  { code: 'es-pa', iso: 'pa', lang: 'es', countryName: 'Panamá', languageName: 'Español (PA)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇵🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15, freeShipAli: 10 },
  { code: 'es-do', iso: 'do', lang: 'es', countryName: 'República Dominicana', languageName: 'Español (DO)', currency: 'RD$', currencyCode: 'DOP', rate: 60, flag: '🇩🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 900, freeShipAli: 600 },
  { code: 'es-pr', iso: 'pr', lang: 'es', countryName: 'Puerto Rico', languageName: 'Español (PR)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇵🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15, freeShipAli: 10 },

  // Sudamérica
  { code: 'pt-br', iso: 'br', lang: 'pt', countryName: 'Brasil', languageName: 'Português (BR)', currency: 'R$', currencyCode: 'BRL', rate: 5.7, flag: '🇧🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 99, freeShipAli: 99 },
  { code: 'es-co', iso: 'co', lang: 'es', countryName: 'Colombia', languageName: 'Español (CO)', currency: 'COP $', currencyCode: 'COP', rate: 4200, flag: '🇨🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 55000, freeShipAli: 45000 },
  { code: 'es-cl', iso: 'cl', lang: 'es', countryName: 'Chile', languageName: 'Español (CL)', currency: 'CLP $', currencyCode: 'CLP', rate: 950, flag: '🇨🇱', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 12000, freeShipAli: 10000 },
  { code: 'es-pe', iso: 'pe', lang: 'es', countryName: 'Perú', languageName: 'Español (PE)', currency: 'S/', currencyCode: 'PEN', rate: 3.75, flag: '🇵🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 40 },
  { code: 'es-ar', iso: 'ar', lang: 'es', countryName: 'Argentina', languageName: 'Español (AR)', currency: 'ARS $', currencyCode: 'ARS', rate: 1050, flag: '🇦🇷', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 15000 },
  { code: 'es-ec', iso: 'ec', lang: 'es', countryName: 'Ecuador', languageName: 'Español (EC)', currency: '$', currencyCode: 'USD', rate: 1, flag: '🇪🇨', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 10 },
  { code: 'es-uy', iso: 'uy', lang: 'es', countryName: 'Uruguay', languageName: 'Español (UY)', currency: '$U ', currencyCode: 'UYU', rate: 42, flag: '🇺🇾', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 650, freeShipAli: 450 },
  { code: 'es-py', iso: 'py', lang: 'es', countryName: 'Paraguay', languageName: 'Español (PY)', currency: '₲', currencyCode: 'PYG', rate: 7800, flag: '🇵🇾', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 80000 },
  { code: 'es-bo', iso: 'bo', lang: 'es', countryName: 'Bolivia', languageName: 'Español (BO)', currency: 'Bs ', currencyCode: 'BOB', rate: 6.9, flag: '🇧🇴', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 70 },

  // Europa Occidental, Central y Este
  { code: 'es-es', iso: 'es', lang: 'es', countryName: 'España', languageName: 'Español (ES)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇪🇸', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'de-de', iso: 'de', lang: 'de', countryName: 'Deutschland', languageName: 'Deutsch (DE)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇩🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'de-at', iso: 'at', lang: 'de', countryName: 'Österreich', languageName: 'Deutsch (AT)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇦🇹', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'de-ch', iso: 'ch', lang: 'de', countryName: 'Schweiz (Suisse)', languageName: 'Deutsch (CH)', currency: 'CHF ', currencyCode: 'CHF', rate: 0.88, flag: '🇨🇭', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15, freeShipAli: 12 },
  { code: 'fr-fr', iso: 'fr', lang: 'fr', countryName: 'France', languageName: 'Français (FR)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇫🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'fr-be', iso: 'be', lang: 'fr', countryName: 'Belgique (België)', languageName: 'Français (BE)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇧🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'en-gb', iso: 'gb', lang: 'en', countryName: 'United Kingdom', languageName: 'English (UK)', currency: '£', currencyCode: 'GBP', rate: 0.78, flag: '🇬🇧', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 8 },
  { code: 'en-ie', iso: 'ie', lang: 'en', countryName: 'Ireland', languageName: 'English (IE)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇮🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'it-it', iso: 'it', lang: 'it', countryName: 'Italia', languageName: 'Italiano', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇮🇹', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'nl-nl', iso: 'nl', lang: 'nl', countryName: 'Nederland', languageName: 'Nederlands', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇳🇱', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'pl-pl', iso: 'pl', lang: 'pl', countryName: 'Polska', languageName: 'Polski', currency: 'zł', currencyCode: 'PLN', rate: 4.0, flag: '🇵🇱', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 40, freeShipAli: 40 },
  { code: 'pt-pt', iso: 'pt', lang: 'pt', countryName: 'Portugal', languageName: 'Português (PT)', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇵🇹', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'en-se', iso: 'se', lang: 'en', countryName: 'Sverige (Sweden)', languageName: 'English / Svenska', currency: 'kr ', currencyCode: 'SEK', rate: 10.6, flag: '🇸🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 120, freeShipAli: 110 },
  { code: 'en-no', iso: 'no', lang: 'en', countryName: 'Norge (Norway)', languageName: 'English / Norsk', currency: 'kr ', currencyCode: 'NOK', rate: 11.0, flag: '🇳🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 130, freeShipAli: 110 },
  { code: 'en-dk', iso: 'dk', lang: 'en', countryName: 'Danmark (Denmark)', languageName: 'English / Dansk', currency: 'kr. ', currencyCode: 'DKK', rate: 6.9, flag: '🇩🇰', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 80, freeShipAli: 75 },
  { code: 'en-fi', iso: 'fi', lang: 'en', countryName: 'Suomi (Finland)', languageName: 'English / Suomi', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇫🇮', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'en-gr', iso: 'gr', lang: 'en', countryName: 'Ελλάδα (Greece)', languageName: 'English / Ελληνικά', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇬🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'en-cz', iso: 'cz', lang: 'en', countryName: 'Česko (Czechia)', languageName: 'English / Čeština', currency: 'Kč ', currencyCode: 'CZK', rate: 23.5, flag: '🇨🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 250, freeShipAli: 240 },
  { code: 'en-ro', iso: 'ro', lang: 'en', countryName: 'România', languageName: 'English / Română', currency: 'lei ', currencyCode: 'RON', rate: 4.6, flag: '🇷🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 45 },
  { code: 'en-hu', iso: 'hu', lang: 'en', countryName: 'Magyarország (Hungary)', languageName: 'English / Magyar', currency: 'Ft ', currencyCode: 'HUF', rate: 375, flag: '🇭🇺', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 4000, freeShipAli: 3800 },
  { code: 'tr-tr', iso: 'tr', lang: 'tr', countryName: 'Türkiye', languageName: 'Türkçe', currency: '₺', currencyCode: 'TRY', rate: 34.5, flag: '🇹🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 450, freeShipAli: 350 },
  { code: 'ru-kz', iso: 'kz', lang: 'ru', countryName: 'Казахстан (Kazakhstan)', languageName: 'Русский (KZ)', currency: '₸', currencyCode: 'KZT', rate: 490, flag: '🇰🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 5500, freeShipAli: 4900 },
  { code: 'ru-ua', iso: 'ua', lang: 'ru', countryName: 'Україна (Ukraine)', languageName: 'Русский / UA', currency: '₴', currencyCode: 'UAH', rate: 41.5, flag: '🇺🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 450, freeShipAli: 400 },

  // Asia-Pacífico, Comunidad China, Medio Oriente y África
  { code: 'zh-tw', iso: 'tw', lang: 'zh', countryName: '台灣 (Taiwan)', languageName: '繁體中文 / 中文 (TW)', currency: 'NT$', currencyCode: 'TWD', rate: 32.2, flag: '🇹🇼', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 399, freeShipAli: 320 },
  { code: 'zh-hk', iso: 'hk', lang: 'zh', countryName: '香港 (Hong Kong)', languageName: '中文 (HK)', currency: 'HK$', currencyCode: 'HKD', rate: 7.78, flag: '🇭🇰', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 90, freeShipAli: 80 },
  { code: 'zh-cn', iso: 'cn', lang: 'zh', countryName: '中国 / Global Chinese', languageName: '简体中文 (CN)', currency: '¥', currencyCode: 'CNY', rate: 7.2, flag: '🇨🇳', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 79, freeShipAli: 69 },
  { code: 'zh-sg', iso: 'sg', lang: 'zh', countryName: '新加坡 (Singapore 中文)', languageName: '中文 (SG)', currency: 'S$', currencyCode: 'SGD', rate: 1.34, flag: '🇸🇬', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'en-sg', iso: 'sg', lang: 'en', countryName: 'Singapore', languageName: 'English (SG)', currency: 'S$', currencyCode: 'SGD', rate: 1.34, flag: '🇸🇬', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'ja-jp', iso: 'jp', lang: 'ja', countryName: '日本 (Japan)', languageName: '日本語', currency: '¥', currencyCode: 'JPY', rate: 152, flag: '🇯🇵', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 2100, freeShipAli: 1500 },
  { code: 'ko-kr', iso: 'kr', lang: 'ko', countryName: '대한민국 (South Korea)', languageName: '한국어', currency: '₩', currencyCode: 'KRW', rate: 1380, flag: '🇰🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15000, freeShipAli: 13000 },
  { code: 'en-my', iso: 'my', lang: 'en', countryName: 'Malaysia', languageName: 'English (MY)', currency: 'RM', currencyCode: 'MYR', rate: 4.4, flag: '🇲🇾', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'en-ph', iso: 'ph', lang: 'en', countryName: 'Philippines', languageName: 'English (PH)', currency: '₱', currencyCode: 'PHP', rate: 58, flag: '🇵🇭', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 650, freeShipAli: 550 },
  { code: 'en-th', iso: 'th', lang: 'en', countryName: 'Thailand (ประเทศไทย)', languageName: 'English (TH)', currency: '฿', currencyCode: 'THB', rate: 34.5, flag: '🇹🇭', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 390, freeShipAli: 350 },
  { code: 'en-vn', iso: 'vn', lang: 'en', countryName: 'Việt Nam (Vietnam)', languageName: 'English (VN)', currency: '₫', currencyCode: 'VND', rate: 25300, flag: '🇻🇳', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 250000 },
  { code: 'en-au', iso: 'au', lang: 'en', countryName: 'Australia', languageName: 'English (AU)', currency: 'A$', currencyCode: 'AUD', rate: 1.52, flag: '🇦🇺', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'en-nz', iso: 'nz', lang: 'en', countryName: 'New Zealand', languageName: 'English (NZ)', currency: 'NZ$', currencyCode: 'NZD', rate: 1.66, flag: '🇳🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 25, freeShipAli: 18 },
  { code: 'ar-ae', iso: 'ae', lang: 'ar', countryName: 'الإمارات العربية المتحدة (UAE)', languageName: 'العربية (الإمارات)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 40 },
  { code: 'en-ae', iso: 'ae', lang: 'en', countryName: 'United Arab Emirates', languageName: 'English (UAE)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 40 },
  { code: 'ar-sa', iso: 'sa', lang: 'ar', countryName: 'المملكة العربية السعودية (Saudi Arabia)', languageName: 'العربية (السعودية)', currency: 'SAR ', currencyCode: 'SAR', rate: 3.75, flag: '🇸🇦', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'ar-qa', iso: 'qa', lang: 'ar', countryName: 'قطر (Qatar)', languageName: 'العربية (قطر)', currency: 'QAR ', currencyCode: 'QAR', rate: 3.64, flag: '🇶🇦', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'ar-kw', iso: 'kw', lang: 'ar', countryName: 'الكويت (Kuwait)', languageName: 'العربية (الكويت)', currency: 'KWD ', currencyCode: 'KWD', rate: 0.31, flag: '🇰🇼', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 5, freeShipAli: 4 },
  { code: 'en-il', iso: 'il', lang: 'en', countryName: 'Israel (ישראל)', languageName: 'English (IL)', currency: '₪', currencyCode: 'ILS', rate: 3.75, flag: '🇮🇱', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'en-za', iso: 'za', lang: 'en', countryName: 'South Africa', languageName: 'English (ZA)', currency: 'R ', currencyCode: 'ZAR', rate: 18.2, flag: '🇿🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 250, freeShipAli: 200 },
  { code: 'fr-ma', iso: 'ma', lang: 'fr', countryName: 'Maroc (Morocco)', languageName: 'Français (MA)', currency: 'MAD ', currencyCode: 'MAD', rate: 10.0, flag: '🇲🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 150, freeShipAli: 120 }
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
    zh: 'zh-tw',
    ru: 'ru-kz',
    tr: 'tr-tr',
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
