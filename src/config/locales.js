import { LANGUAGE_PACKS, BASE_DOMAIN, CATEGORY_SLUGS } from '../data/i18nDictionaries.js';
import {
  getSectionText,
  getLocalizedCountryName,
  getLocalizedCategoryPath,
  getRouteSlugsForLang
} from '../data/multilingualSections.js';
import ALL_DEALS from '../data/aliexpress_catalog_deals.json' with { type: 'json' };

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
  { code: 'sv-se', iso: 'se', lang: 'sv', countryName: 'Sverige', languageName: 'Svenska', currency: 'kr ', currencyCode: 'SEK', rate: 10.6, flag: '🇸🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 120, freeShipAli: 110 },
  { code: 'no-no', iso: 'no', lang: 'no', countryName: 'Norge', languageName: 'Norsk', currency: 'kr ', currencyCode: 'NOK', rate: 11.0, flag: '🇳🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 130, freeShipAli: 110 },
  { code: 'da-dk', iso: 'dk', lang: 'da', countryName: 'Danmark', languageName: 'Dansk', currency: 'kr. ', currencyCode: 'DKK', rate: 6.9, flag: '🇩🇰', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 80, freeShipAli: 75 },
  { code: 'fi-fi', iso: 'fi', lang: 'fi', countryName: 'Suomi', languageName: 'Suomi', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇫🇮', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'el-gr', iso: 'gr', lang: 'el', countryName: 'Ελλάδα', languageName: 'Ελληνικά', currency: '€', currencyCode: 'EUR', rate: 0.92, flag: '🇬🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 10, freeShipAli: 10 },
  { code: 'cs-cz', iso: 'cz', lang: 'cs', countryName: 'Česko', languageName: 'Čeština', currency: 'Kč ', currencyCode: 'CZK', rate: 23.5, flag: '🇨🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 250, freeShipAli: 240 },
  { code: 'ro-ro', iso: 'ro', lang: 'ro', countryName: 'România', languageName: 'Română', currency: 'lei ', currencyCode: 'RON', rate: 4.6, flag: '🇷🇴', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 45 },
  { code: 'hu-hu', iso: 'hu', lang: 'hu', countryName: 'Magyarország', languageName: 'Magyar', currency: 'Ft ', currencyCode: 'HUF', rate: 375, flag: '🇭🇺', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 4000, freeShipAli: 3800 },
  { code: 'tr-tr', iso: 'tr', lang: 'tr', countryName: 'Türkiye', languageName: 'Türkçe', currency: '₺', currencyCode: 'TRY', rate: 34.5, flag: '🇹🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 450, freeShipAli: 350 },
  { code: 'ru-kz', iso: 'kz', lang: 'ru', countryName: 'Казахстан', languageName: 'Русский (KZ)', currency: '₸', currencyCode: 'KZT', rate: 490, flag: '🇰🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 5500, freeShipAli: 4900 },
  { code: 'uk-ua', iso: 'ua', lang: 'uk', countryName: 'Україна', languageName: 'Українська', currency: '₴', currencyCode: 'UAH', rate: 41.5, flag: '🇺🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 450, freeShipAli: 400 },

  // Asia-Pacífico, Comunidad China, Medio Oriente y África
  { code: 'zh-tw', iso: 'tw', lang: 'zh', countryName: '台灣', languageName: '繁體中文 (TW)', currency: 'NT$', currencyCode: 'TWD', rate: 32.2, flag: '🇹🇼', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 399, freeShipAli: 320 },
  { code: 'zh-hk', iso: 'hk', lang: 'zh', countryName: '香港', languageName: '繁體中文 (HK)', currency: 'HK$', currencyCode: 'HKD', rate: 7.78, flag: '🇭🇰', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 90, freeShipAli: 80 },
  { code: 'zh-cn', iso: 'cn', lang: 'zh', countryName: '中国', languageName: '简体中文 (CN)', currency: '¥', currencyCode: 'CNY', rate: 7.2, flag: '🇨🇳', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 79, freeShipAli: 69 },
  { code: 'zh-sg', iso: 'sg', lang: 'zh', countryName: '新加坡 (中文)', languageName: '简体中文 (SG)', currency: 'S$', currencyCode: 'SGD', rate: 1.34, flag: '🇸🇬', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'en-sg', iso: 'sg', lang: 'en', countryName: 'Singapore', languageName: 'English (SG)', currency: 'S$', currencyCode: 'SGD', rate: 1.34, flag: '🇸🇬', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'ja-jp', iso: 'jp', lang: 'ja', countryName: '日本', languageName: '日本語', currency: '¥', currencyCode: 'JPY', rate: 152, flag: '🇯🇵', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 2100, freeShipAli: 1500 },
  { code: 'ko-kr', iso: 'kr', lang: 'ko', countryName: '대한민국', languageName: '한국어', currency: '₩', currencyCode: 'KRW', rate: 1380, flag: '🇰🇷', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 15000, freeShipAli: 13000 },
  { code: 'ms-my', iso: 'my', lang: 'ms', countryName: 'Malaysia', languageName: 'Bahasa Melayu', currency: 'RM', currencyCode: 'MYR', rate: 4.4, flag: '🇲🇾', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'en-ph', iso: 'ph', lang: 'en', countryName: 'Philippines', languageName: 'English (PH)', currency: '₱', currencyCode: 'PHP', rate: 58, flag: '🇵🇭', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 650, freeShipAli: 550 },
  { code: 'th-th', iso: 'th', lang: 'th', countryName: 'ประเทศไทย', languageName: 'ไทย', currency: '฿', currencyCode: 'THB', rate: 34.5, flag: '🇹🇭', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 390, freeShipAli: 350 },
  { code: 'vi-vn', iso: 'vn', lang: 'vi', countryName: 'Việt Nam', languageName: 'Tiếng Việt', currency: '₫', currencyCode: 'VND', rate: 25300, flag: '🇻🇳', rtl: false, stores: ['aliexpress'], freeShipTemu: 0, freeShipAli: 250000 },
  { code: 'en-au', iso: 'au', lang: 'en', countryName: 'Australia', languageName: 'English (AU)', currency: 'A$', currencyCode: 'AUD', rate: 1.52, flag: '🇦🇺', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 20, freeShipAli: 15 },
  { code: 'en-nz', iso: 'nz', lang: 'en', countryName: 'New Zealand', languageName: 'English (NZ)', currency: 'NZ$', currencyCode: 'NZD', rate: 1.66, flag: '🇳🇿', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 25, freeShipAli: 18 },
  { code: 'ar-ae', iso: 'ae', lang: 'ar', countryName: 'الإمارات العربية المتحدة', languageName: 'العربية (الإمارات)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 40 },
  { code: 'en-ae', iso: 'ae', lang: 'en', countryName: 'United Arab Emirates', languageName: 'English (UAE)', currency: 'AED ', currencyCode: 'AED', rate: 3.67, flag: '🇦🇪', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 50, freeShipAli: 40 },
  { code: 'ar-sa', iso: 'sa', lang: 'ar', countryName: 'المملكة العربية السعودية', languageName: 'العربية (السعودية)', currency: 'SAR ', currencyCode: 'SAR', rate: 3.75, flag: '🇸🇦', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'ar-qa', iso: 'qa', lang: 'ar', countryName: 'قطر', languageName: 'العربية (قطر)', currency: 'QAR ', currencyCode: 'QAR', rate: 3.64, flag: '🇶🇦', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'ar-kw', iso: 'kw', lang: 'ar', countryName: 'الكويت', languageName: 'العربية (الكويت)', currency: 'KWD ', currencyCode: 'KWD', rate: 0.31, flag: '🇰🇼', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 5, freeShipAli: 4 },
  { code: 'he-il', iso: 'il', lang: 'he', countryName: 'ישראל', languageName: 'עברית', currency: '₪', currencyCode: 'ILS', rate: 3.75, flag: '🇮🇱', rtl: true, stores: ['temu', 'aliexpress'], freeShipTemu: 55, freeShipAli: 45 },
  { code: 'en-za', iso: 'za', lang: 'en', countryName: 'South Africa', languageName: 'English (ZA)', currency: 'R ', currencyCode: 'ZAR', rate: 18.2, flag: '🇿🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 250, freeShipAli: 200 },
  { code: 'fr-ma', iso: 'ma', lang: 'fr', countryName: 'Maroc', languageName: 'Français (MA)', currency: 'MAD ', currencyCode: 'MAD', rate: 10.0, flag: '🇲🇦', rtl: false, stores: ['temu', 'aliexpress'], freeShipTemu: 150, freeShipAli: 120 }
];

function interpolateText(str, market) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\{country\}/g, market.countryName)
    .replace(/\{currency\}/g, `${market.currency} (${market.currencyCode})`);
}

function buildLocalizedSEOContent(pack, market) {
  const hasTemu = (market.stores || ['temu', 'aliexpress']).includes('temu');
  const hasAli = (market.stores || ['temu', 'aliexpress']).includes('aliexpress');
  const country = market.countryName;
  const currencyFormatted = `${market.currency} (${market.currencyCode})`;
  const freeTemuFormatted = `${market.currency}${market.freeShipTemu?.toLocaleString?.() || market.freeShipTemu}`;
  const freeAliFormatted = `${market.currency}${market.freeShipAli?.toLocaleString?.() || market.freeShipAli}`;

  // 1. Spanish Markets (Central America, South America, Spain, US Lockers)
  if (market.lang === 'es') {
    if (!hasTemu && hasAli) {
      // Countries with AliExpress only (no direct Temu): Nicaragua, Costa Rica, Guatemala, El Salvador, Honduras, Argentina, Ecuador, Paraguay, Bolivia
      return {
        seoGuideTitle: `Guía Completa: Cómo Aplicar Cupones de AliExpress y Compras vía Casillero en ${country} (2026)`,
        seoSection1Title: `1. Cómo Aplicar Cupones de Descuento y Ahorrar en ${country}`,
        seoSection1Body: `Los compradores en ${country} pueden maximizar su ahorro combinando cupones de vendedor con códigos promocionales globales. En AliExpress, aprovecha las campañas de Choice Day, los descuentos acumulativos de "Gasta y Ahorra" y las Monedas de la aplicación móvil antes de pagar. Ten en cuenta que Temu no realiza envíos directos a ${country}; para comprar en Temu o canjear códigos promocionales de búsqueda como credit777 o box777, debes configurar la app en región Estados Unidos y enviar a un casillero internacional en Miami (Florida ZIP 33166 o 33122) pagando en USD libres de impuestos locales.`,
        seoSection2Title: `2. Métodos de Envío a ${country}: Envío Directo vs. Casillero en Miami`,
        seoSection2Body: `Para recibir compras en ${country}, las opciones varían según la tienda: Temu no cuenta con envíos directos a ${country}, por lo que el uso de un casillero en Miami (freight forwarder en Florida) es obligatorio para compras en dicha tienda. En AliExpress, el envío directo (AliExpress Standard Shipping) se canaliza mediante el servicio postal local y demora habitualmente entre 20 y 45 días hábiles. Por esta razón, para tecnología, periféricos o artículos urgentes, la gran mayoría de compradores en ${country} prefieren enviar sus compras a un casillero en Miami, garantizando entrega aérea rápida en 5 a 10 días hábiles con rastreo confiable y mejor gestión aduanera.`,
        faqs: [
          {
            q: `¿Se puede comprar en Temu desde ${country} o usar códigos como credit777?`,
            a: `Temu no ofrece envíos directos oficiales a ${country}. Para comprar en Temu desde ${country} o activar códigos de búsqueda como credit777, wincredit o box777, debes configurar la región de la aplicación en "Estados Unidos" y registrar la dirección de un casillero internacional en Miami (Florida ZIP 33166 o 33122). Tu pedido se procesará en USD con envío gratis dentro de EE. UU. y tu casillero se encargará de importarlo a ${country}.`
          },
          {
            q: `¿Conviene enviar directo a ${country} o usar casillero en Miami?`,
            a: `Para compras en Temu el casillero en Miami es indispensable al no existir envío directo oficial. Para compras en AliExpress, en la gran mayoría de los casos conviene usar casillero en Miami: los envíos directos de AliExpress Standard Shipping pueden tardar de 3 a 8 semanas por el correo postal local y enfrentar demoras o retenciones aduaneras. Enviar a un casillero en Miami te da entrega doméstica en Florida en 3 a 5 días y flete aéreo express a ${country} en 5 a 8 días hábiles con rastreo y entrega garantizada.`
          },
          {
            q: `¿Se pueden acumular cupones de AliExpress con monedas y cupones de vendedor?`,
            a: `Sí. En AliExpress puedes combinar hasta tres descuentos simultáneos al pagar: un cupón del vendedor en la ficha del producto, el descuento automático por Monedas de la aplicación móvil y un código promocional global verificado de nuestra lista.`
          },
          {
            q: `¿Cada cuánto se actualizan estos códigos y qué moneda debo utilizar?`,
            a: `Actualizamos los cupones diariamente verificando disponibilidad. Si compras con envío directo en AliExpress puedes pagar en ${currencyFormatted} o en USD. Si compras en Temu o consolidas mediante casillero en Miami, los pagos se procesan en USD para aprovechar precios de catálogo estadounidense.`
          }
        ]
      };
    }

    if (hasTemu && hasAli) {
      return {
        seoGuideTitle: `Guía Completa: Cómo Apilar Cupones de Temu y AliExpress en ${country} (2026)`,
        seoSection1Title: `1. Cómo Aplicar Códigos Ocultos de Búsqueda y Acumular Descuentos`,
        seoSection1Body: `Los compradores en ${country} pueden maximizar su ahorro en hardware combinando códigos generales con cupones de vendedor. En Temu, escribir comandos secretos como credit777, wincredit o box777 directamente en el buscador de la aplicación desbloquea paquetes de cupones y ruletas de crédito. En AliExpress, combina siempre los códigos de Choice Day con las Monedas de la app y los descuentos automáticos de "Gasta y Ahorra" antes de pagar.`,
        seoSection2Title: `2. Métodos de Envío Locales, Tiempos de Entrega y Envío Gratis en ${country}`,
        seoSection2Body: `Los pedidos enviados directamente a ${country} cuentan con logística aérea consolidada y entrega de última milla certificada. El envío estándar demora entre 8 y 16 días hábiles y es gratis superando el umbral mínimo (${freeTemuFormatted} en Temu y ${freeAliFormatted} en AliExpress). Si utilizas un casillero en Miami (freight forwarder en Florida ZIP 33166/33122) para consolidar periféricos gaming o componentes de alto valor, puedes acceder al catálogo exclusivo de EE. UU. y optimizar costos aduaneros.`,
        faqs: [
          {
            q: `¿Cómo funcionan los códigos secretos de búsqueda en Temu como credit777?`,
            a: `A diferencia de un cupón tradicional de carrito, debes escribir la palabra clave exacta en la barra superior de búsqueda de la app de Temu para abrir la ruleta de crédito o el paquete de recompensas.`
          },
          {
            q: `¿Conviene pedir con envío directo a ${country} o usar casillero en Miami?`,
            a: `Para compras pequeñas y habituales, el envío directo a ${country} es más económico y conveniente al incluir entrega a domicilio. Si compras hardware de alta gama o artículos con catálogo exclusivo en EE. UU., un casillero en Miami te permite pagar en USD y consolidar paquetes en un solo flete aéreo.`
          },
          {
            q: `¿Se pueden acumular cupones de AliExpress con monedas y cupones de tienda?`,
            a: `Sí. El sistema de pago permite aplicar simultáneamente un código promocional global, un cupón del vendedor y el descuento automático de Monedas en la app.`
          },
          {
            q: `¿Cada cuánto se actualizan estos códigos para ${country}?`,
            a: `Nuestro equipo verifica el stock de usos de cada cupón diariamente para garantizar compatibilidad con las campañas vigentes de AliExpress Portals y Temu.`
          }
        ]
      };
    }

    if (hasTemu && !hasAli) {
      return {
        seoGuideTitle: `Guía Completa: Cómo Aplicar Cupones de Temu en ${country} (2026)`,
        seoSection1Title: `1. Cómo Aplicar Códigos Ocultos de Búsqueda en Temu`,
        seoSection1Body: `Los compradores en ${country} pueden maximizar su ahorro en Temu escribiendo comandos secretos como credit777, wincredit o box777 directamente en el buscador de la aplicación para desbloquear paquetes de cupones y ruletas de crédito.`,
        seoSection2Title: `2. Métodos de Envío y Tiempo de Entrega en ${country}`,
        seoSection2Body: `Los pedidos enviados a ${country} disponen de logística aérea directa con entrega certificada en 8 a 15 días hábiles, con envío gratis desde ${freeTemuFormatted}.`,
        faqs: [
          {
            q: `¿Cómo funcionan los códigos secretos de búsqueda en Temu como credit777?`,
            a: `Escribe la palabra clave exacta en la barra de búsqueda superior de la app de Temu para abrir el panel de recompensas y créditos.`
          },
          {
            q: `¿Cómo reclamar el ajuste de precio de 30 días en Temu?`,
            a: `Si un artículo comprado baja de precio en los siguientes 30 días, entra a "Tus Pedidos" y presiona "Solicitar ajuste de precio" para recibir la diferencia al instante.`
          }
        ]
      };
    }
  }

  // 2. English Markets
  if (market.lang === 'en') {
    if (!hasTemu && hasAli) {
      return {
        seoGuideTitle: `Complete Guide: How to Apply AliExpress Coupons & Miami Forwarder Orders in ${country} (2026)`,
        seoSection1Title: `1. How to Stack Cart Discounts & Store Vouchers in ${country}`,
        seoSection1Body: `Shoppers in ${country} can maximize savings by combining store-wide promo codes with seller vouchers on AliExpress Choice Day. Please note that Temu does not provide direct shipping to ${country}; to shop on Temu or redeem search triggers like credit777, configure your app to United States with a Miami freight forwarder address (ZIP 33166/33122) in USD.`,
        seoSection2Title: `2. Shipping Methods to ${country}: Direct Postal vs. Miami Forwarder`,
        seoSection2Body: `Direct shipping to ${country} via AliExpress Standard Shipping is delivered by local postal services (typically 20 to 45 business days). For faster and safer transit (5 to 10 days) and for shopping on Temu, most international buyers choose a Miami freight forwarder.`,
        faqs: [
          {
            q: `Can I order from Temu or use search codes like credit777 in ${country}?`,
            a: `Temu does not offer direct delivery to ${country}. To buy from Temu, set your app region to United States and ship to a freight forwarder in Miami (FL 33166/33122) in USD.`
          },
          {
            q: `Is it better to ship directly to ${country} or use a Miami freight forwarder?`,
            a: `For Temu, a Miami forwarder is mandatory. For AliExpress, while direct postal shipping exists, using a forwarder is generally faster and avoids local postal delays or unpredictable customs duties.`
          },
          {
            q: `Can I combine AliExpress promo codes with seller coupons in ${currencyFormatted}?`,
            a: `Yes. AliExpress allows stacking one platform-wide promo code, one store coupon, and Coins discounts simultaneously on the same checkout screen.`
          },
          {
            q: `How often are coupons verified for ${country}?`,
            a: `All coupon codes and thresholds are audited daily for active stock and regional validity.`
          }
        ]
      };
    }
  }

  // 3. Fallback for other languages (safeguard against false Temu claims when !hasTemu)
  let title = interpolateText(pack.seoGuideTitle, market);
  let s1Body = interpolateText(pack.seoSection1Body, market);
  let s2Body = interpolateText(pack.seoSection2Body, market);
  let faqs = (pack.faqs || []).map((f) => ({
    q: interpolateText(f.q, market),
    a: interpolateText(f.a, market)
  }));

  if (!hasTemu) {
    title = title.replace(/Temu\s*(&|y|\+|and)?\s*/gi, '').trim();
    faqs = faqs.filter((f) => !/credit777|Temu/i.test(f.q) || /AliExpress/i.test(f.q));
  } else if (!hasAli) {
    title = title.replace(/(AliExpress\s*(&|y|\+|and)?\s*)|((\s*(&|y|\+|and))?\s*AliExpress)/gi, '').trim();
    faqs = faqs.filter((f) => !/AliExpress/i.test(f.q) || /Temu/i.test(f.q));
  }

  return {
    seoGuideTitle: title,
    seoSection1Title: interpolateText(pack.seoSection1Title, market),
    seoSection1Body: s1Body,
    seoSection2Title: interpolateText(pack.seoSection2Title, market),
    seoSection2Body: s2Body,
    faqs
  };
}

function localizePack(pack, market) {
  const seoContent = buildLocalizedSEOContent(pack, market);

  return {
    ...pack,
    heroTitle: interpolateText(pack.heroTitle, market),
    heroSubtitle: interpolateText(pack.heroSubtitle, market),
    modalSteps: (pack.modalSteps || []).map((s) => interpolateText(s, market)),
    seoGuideTitle: seoContent.seoGuideTitle,
    seoSection1Title: seoContent.seoSection1Title,
    seoSection1Body: seoContent.seoSection1Body,
    seoSection2Title: seoContent.seoSection2Title,
    seoSection2Body: seoContent.seoSection2Body,
    faqs: seoContent.faqs,
    legal: {
      ...pack.legal,
      termsBody: interpolateText(pack.legal?.termsBody || '', market)
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

export const LEGACY_LOCALE_ALIASES = {
  'en-se': 'sv-se',
  'en-no': 'no-no',
  'en-dk': 'da-dk',
  'en-fi': 'fi-fi',
  'en-gr': 'el-gr',
  'en-cz': 'cs-cz',
  'en-ro': 'ro-ro',
  'en-hu': 'hu-hu',
  'ru-ua': 'uk-ua',
  'en-my': 'ms-my',
  'en-th': 'th-th',
  'en-vn': 'vi-vn',
  'en-il': 'he-il'
};

export const LOCALE_MAP = Object.fromEntries([
  ...LOCALES.map((l) => [l.code, l]),
  ...Object.entries(LEGACY_LOCALE_ALIASES).map(([oldCode, newCode]) => [
    oldCode,
    LOCALES.find((l) => l.code === newCode)
  ])
]);
export const DEFAULT_LOCALE = 'en-us';

export function getLocaleConfig(code) {
  const normalized = (code || DEFAULT_LOCALE).toLowerCase();
  const resolved = LEGACY_LOCALE_ALIASES[normalized] || normalized;
  return LOCALE_MAP[resolved] || LOCALE_MAP[DEFAULT_LOCALE];
}

export function detectBrowserLocale() {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const raw = (navigator.language || 'en-us').toLowerCase();
  if (LOCALE_MAP[raw]) return LOCALE_MAP[raw].code;
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
    sv: 'sv-se',
    no: 'no-no',
    nb: 'no-no',
    nn: 'no-no',
    da: 'da-dk',
    fi: 'fi-fi',
    el: 'el-gr',
    cs: 'cs-cz',
    ro: 'ro-ro',
    hu: 'hu-hu',
    uk: 'uk-ua',
    th: 'th-th',
    vi: 'vi-vn',
    he: 'he-il',
    iw: 'he-il',
    ms: 'ms-my',
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

const SEO_PATTERN_BY_LANG = {
  es: {
    storeAll: 'Temu y AliExpress',
    verified: 'Códigos y Cupones Verificados 2026',
    freeShip: (threshold, hasTemu, country) =>
      hasTemu ? `envío gratis desde ${threshold}` : `envío a ${country} o casillero en Miami USD`,
    catTitle: (cat, store, country, curr) => `${cat} en ${store} — Cupones ${country} (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship, hasTemu) =>
      `Cupones y códigos verificados 2026 en ${cat} para ${store} en ${country} (${curr}). Descuentos acumulables${hasTemu ? ', trucos credit777/wincredit' : ''}, Choice Day y ${ship}.`,
    storeDesc: (storeName, country, curr, ship, isTemu) =>
      `Códigos promocionales de ${storeName} en ${country} (${curr}) 2026: ${isTemu ? 'búsquedas credit777, wincredit, box777, paquetes de cupón' : 'cupones Choice Day, monedas de la app'} y ${ship}.`,
    homeDesc: (store, country, curr, ship, hasTemu) =>
      `Códigos verificados 2026 de ${store} en ${country} (${curr}). Ahorra con cupones reales${hasTemu ? ', comandos credit777 y wincredit' : ' y envíos internacionales'}, más ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Comandos secretos de búsqueda en ${country} (${curr}): credit777, claimcredit, wincredit, box777 en Temu y Centro de Monedas AliExpress 2026.`,
    faqTitle: (country, curr) => `Preguntas Frecuentes (FAQ) Temu y AliExpress — ${country} (${curr})`,
    faqDesc: (country, curr) =>
      `Respuestas oficiales sobre cupones en ${country} (${curr}), compra mínima, acumulación de descuentos, envío directo y casillero Miami.`,
    keywords: (country, curr, catName, storeName, hasTemu) => [
      catName && `${catName} ${country}`,
      catName && `cupones ${catName.toLowerCase()}`,
      `cupones ${country} 2026`,
      `codigo promocional aliexpress ${country}`,
      ...(hasTemu ? [`cupones temu ${country}`, 'credit777', 'wincredit', 'box777'] : ['casillero miami', 'envios aliexpress']),
      storeName && `ofertas ${storeName.toLowerCase()} ${country}`,
      `descuentos ${curr}`,
      'choice day aliexpress'
    ]
  },
  en: {
    storeAll: 'Temu & AliExpress',
    verified: 'Verified Promo Codes & Coupons 2026',
    freeShip: (threshold, hasTemu, country) =>
      hasTemu ? `free shipping from ${threshold}` : `direct shipping to ${country} or Miami freight forwarder`,
    catTitle: (cat, store, country, curr) => `${cat} on ${store} — ${country} Coupons (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship, hasTemu) =>
      `Verified 2026 ${cat} promo codes for ${store} in ${country} (${curr}). Stackable deals${hasTemu ? ', credit777 & wincredit triggers' : ''}, Choice Day & ${ship}.`,
    storeDesc: (storeName, country, curr, ship, isTemu) =>
      `Active ${storeName} coupons for ${country} (${curr}) 2026: ${isTemu ? 'credit777, wincredit, box777 app codes, bundle packs' : 'Choice Day codes, app Coins stacking'} and ${ship}.`,
    homeDesc: (store, country, curr, ship, hasTemu) =>
      `Verified 2026 ${store} discount codes in ${country} (${curr}). Real checkout savings${hasTemu ? ', credit777 & wincredit search tricks' : ''}, plus ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Hidden app search commands for ${country} (${curr}): credit777, claimcredit, wincredit, box777 rewards on Temu and AliExpress Coins 2026.`,
    faqTitle: (country, curr) => `FAQ: Temu & AliExpress Coupons — ${country} (${curr})`,
    faqDesc: (country, curr) =>
      `Official answers on promo codes in ${country} (${curr}), minimum spend rules, coupon stacking and shipping methods.`,
    keywords: (country, curr, catName, storeName, hasTemu) => [
      catName && `${catName} ${country}`,
      catName && `${catName.toLowerCase()} coupons`,
      `verified coupons ${country} 2026`,
      `aliexpress promo code ${country}`,
      ...(hasTemu ? [`temu coupon code ${country}`, 'credit777', 'wincredit', 'box777'] : ['miami freight forwarder', 'aliexpress shipping']),
      storeName && `${storeName.toLowerCase()} deals ${country}`,
      `discounts ${curr}`,
      'choice day promo'
    ]
  },
  pt: {
    storeAll: 'Temu e AliExpress',
    verified: 'Cupons Verificados 2026',
    freeShip: (threshold) => `frete grátis a partir de ${threshold}`,
    catTitle: (cat, store, country, curr) => `${cat} na ${store} — Cupons ${country} (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship) =>
      `Cupons verificados 2026 de ${cat} na ${store} em ${country} (${curr}). Descontos acumuláveis, Choice Day, credit777 e ${ship}.`,
    storeDesc: (storeName, country, curr, ship, isTemu) =>
      `Códigos ativos ${storeName} em ${country} (${curr}) 2026: ${isTemu ? 'credit777, wincredit, box777 e pacotes de cupom' : 'Choice Day, moedas do app'} com ${ship}.`,
    homeDesc: (store, country, curr, ship) =>
      `Cupons verificados 2026 para ${store} em ${country} (${curr}). Economia real no carrinho, comandos credit777 e ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Códigos secretos de busca no app para ${country} (${curr}): credit777, claimcredit, wincredit, box777 e Moedas AliExpress.`,
    faqTitle: (country, curr) => `Perguntas Frequentes (FAQ) — ${country} (${curr})`,
    faqDesc: (country, curr) => `Dúvidas sobre cupons Temu e AliExpress em ${country} (${curr}), valor mínimo e frete.`,
    keywords: (country, curr, catName, storeName) => [
      catName && `cupons ${catName.toLowerCase()} ${country}`,
      `cupons temu ${country} 2026`,
      `cupom aliexpress ${country}`,
      storeName && `ofertas ${storeName.toLowerCase()}`,
      'credit777', 'wincredit', 'box777', curr
    ]
  },
  fr: {
    storeAll: 'Temu et AliExpress',
    verified: 'Codes Promo Vérifiés 2026',
    freeShip: (threshold) => `livraison gratuite dès ${threshold}`,
    catTitle: (cat, store, country, curr) => `${cat} ${store} — Codes Promo ${country} (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship) =>
      `Codes promo vérifiés 2026 pour ${cat} sur ${store} en ${country} (${curr}). Remises cumulables, credit777 et ${ship}.`,
    storeDesc: (storeName, country, curr, ship) =>
      `Bons de réduction ${storeName} en ${country} (${curr}) 2026 : Choice Day, credit777, wincredit et ${ship}.`,
    homeDesc: (store, country, curr, ship) =>
      `Codes promo vérifiés 2026 pour ${store} (${country}, ${curr}). Réductions testées au panier et ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Codes secrets de recherche pour ${country} (${curr}) : credit777, claimcredit, wincredit, box777 et Pièces AliExpress.`,
    faqTitle: (country, curr) => `Questions Fréquentes (FAQ) — ${country} (${curr})`,
    faqDesc: (country, curr) => `Réponses sur les codes promo Temu et AliExpress en ${country} (${curr}), cumul et livraison.`,
    keywords: (country, curr, catName, storeName) => [
      catName && `code promo ${catName.toLowerCase()}`,
      `code promo temu ${country}`,
      `code promo aliexpress ${country}`,
      storeName && `${storeName.toLowerCase()} ${country}`,
      'credit777', 'wincredit', curr
    ]
  },
  de: {
    storeAll: 'Temu & AliExpress',
    verified: 'Geprüfte Gutscheincodes 2026',
    freeShip: (threshold) => `kostenloser Versand ab ${threshold}`,
    catTitle: (cat, store, country, curr) => `${cat} bei ${store} — Gutscheine ${country} (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship) =>
      `Geprüfte Gutscheine 2026 für ${cat} bei ${store} in ${country} (${curr}). Kombinierbare Rabatte, credit777 und ${ship}.`,
    storeDesc: (storeName, country, curr, ship) =>
      `Aktuelle ${storeName} Rabattcodes für ${country} (${curr}) 2026: Choice Day, credit777, wincredit und ${ship}.`,
    homeDesc: (store, country, curr, ship) =>
      `Verifizierte ${store} Gutscheincodes für ${country} (${curr}) 2026. Echte Warenkorb-Rabatte und ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Geheime Suchbefehle für ${country} (${curr}): credit777, claimcredit, wincredit, box777 & AliExpress Münzen 2026.`,
    faqTitle: (country, curr) => `Häufige Fragen (FAQ) — ${country} (${curr})`,
    faqDesc: (country, curr) => `Antworten zu Temu & AliExpress Gutscheinen in ${country} (${curr}), Mindestbestellwert und Versand.`,
    keywords: (country, curr, catName, storeName) => [
      catName && `${catName} gutschein`,
      `temu gutscheincode ${country}`,
      `aliexpress gutschein ${country}`,
      storeName && `${storeName.toLowerCase()} rabatt`,
      'credit777', 'wincredit', curr
    ]
  },
  it: {
    storeAll: 'Temu e AliExpress',
    verified: 'Codici Sconto Verificati 2026',
    freeShip: (threshold) => `spedizione gratuita da ${threshold}`,
    catTitle: (cat, store, country, curr) => `${cat} ${store} — Codici Sconto ${country} (${curr}) 2026`,
    catDesc: (cat, store, country, curr, ship) =>
      `Codici sconto verificati 2026 per ${cat} su ${store} in ${country} (${curr}). Offerte cumulabili, credit777 e ${ship}.`,
    storeDesc: (storeName, country, curr, ship) =>
      `Coupon attivi ${storeName} per ${country} (${curr}) 2026: Choice Day, credit777, wincredit e ${ship}.`,
    homeDesc: (store, country, curr, ship) =>
      `Codici promozionali verificati 2026 per ${store} in ${country} (${curr}) con ${ship}.`,
    dynamicsDesc: (country, curr) =>
      `Codici segreti di ricerca per ${country} (${curr}): credit777, claimcredit, wincredit, box777 e Monete AliExpress.`,
    faqTitle: (country, curr) => `Domande Frequenti (FAQ) — ${country} (${curr})`,
    faqDesc: (country, curr) => `Risposte su coupon Temu e AliExpress in ${country} (${curr}), spesa minima e spedizione.`,
    keywords: (country, curr, catName, storeName) => [
      catName && `codice sconto ${catName.toLowerCase()}`,
      `codice sconto temu ${country}`,
      `coupon aliexpress ${country}`,
      storeName && `${storeName.toLowerCase()} ${country}`,
      'credit777', 'wincredit', curr
    ]
  }
};

/**
 * Construye título, meta descripción, palabras clave long-tail y locale OG únicos por ruta, país y categoría.
 */
export function buildRouteSeoMeta(localeConfig, route = { type: 'home', storeFilter: null, slug: null }) {
  const normRoute = typeof route === 'string'
    ? { type: route || 'home', storeFilter: null, slug: null }
    : (route || { type: 'home', storeFilter: null, slug: null });

  const { type = 'home', storeFilter = null, slug = null } = normRoute;
  const { dict } = localeConfig;
  const ui = getSectionText(localeConfig.lang);
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const hasTemu = (localeConfig.stores || ['temu', 'aliexpress']).includes('temu');
  const p = SEO_PATTERN_BY_LANG[localeConfig.lang] || SEO_PATTERN_BY_LANG.en;
  const isCustomLangPack = Boolean(SEO_PATTERN_BY_LANG[localeConfig.lang]);

  const storeName = storeFilter === 'temu' ? 'Temu' : storeFilter === 'aliexpress' ? 'AliExpress' : p.storeAll;
  const minShipVal = storeFilter === 'temu'
    ? localeConfig.freeShipTemu
    : (hasTemu ? Math.min(localeConfig.freeShipTemu || localeConfig.freeShipAli, localeConfig.freeShipAli) : localeConfig.freeShipAli);
  const shipLabel = p.freeShip(`${localeConfig.currency}${Number(minShipVal || 10).toLocaleString()}`, hasTemu, displayCountry);

  const [langPart, regionPart] = String(localeConfig.code || 'en-us').split('-');
  const ogLocale = regionPart ? `${langPart}_${regionPart.toUpperCase()}` : langPart;

  const catName = slug ? (dict.categories?.[slug] || ui.catShort?.[slug] || slug) : '';
  let title = `${dict.heroTitle} (${displayCountry} • ${localeConfig.currencyCode}) | CuponesTech`;
  let description = isCustomLangPack
    ? p.homeDesc(storeName, displayCountry, localeConfig.currencyCode, shipLabel, hasTemu)
    : `${dict.heroTitle} — ${storeName} • ${displayCountry} (${localeConfig.currencyCode}). ${dict.heroSubtitle}`;

  if (type === 'temu' || type === 'aliexpress') {
    const labelStore = type === 'temu' ? 'Temu' : 'AliExpress';
    title = `${labelStore} ${displayCountry} (${localeConfig.currencyCode}) — ${p.verified} | CuponesTech`;
    description = isCustomLangPack
      ? p.storeDesc(labelStore, displayCountry, localeConfig.currencyCode, shipLabel, type === 'temu')
      : `${labelStore} — ${dict.heroTitle} (${displayCountry}, ${localeConfig.currencyCode}). ${dict.heroSubtitle}`;
  } else if (type === 'category' && slug) {
    title = isCustomLangPack
      ? `${p.catTitle(catName, storeName, displayCountry, localeConfig.currencyCode)} | CuponesTech`
      : `${catName} — ${storeName} • ${displayCountry} (${localeConfig.currencyCode}) | CuponesTech`;
    description = isCustomLangPack
      ? p.catDesc(catName, storeName, displayCountry, localeConfig.currencyCode, shipLabel, hasTemu)
      : `${catName} — ${storeName} (${displayCountry}, ${localeConfig.currencyCode}). ${dict.heroSubtitle}`;
  } else if (type === 'dynamics') {
    title = `${ui.dynamics.title(displayCountry)} — credit777, wincredit, box777 | CuponesTech`;
    description = isCustomLangPack
      ? p.dynamicsDesc(displayCountry, localeConfig.currencyCode)
      : `${ui.dynamics.title(displayCountry)}: credit777, claimcredit, wincredit, box777 — ${ui.dynamics.subtitle}`;
  } else if (type === 'guides') {
    title = `${ui.guides.title(displayCountry)} | CuponesTech`;
    description = dict.seoGuideTitle || ui.guides.title(displayCountry);
  } else if (type === 'faq') {
    title = isCustomLangPack
      ? `${p.faqTitle(displayCountry, localeConfig.currencyCode)} | CuponesTech`
      : `FAQ — ${displayCountry} (${localeConfig.currencyCode}) | CuponesTech`;
    description = isCustomLangPack
      ? p.faqDesc(displayCountry, localeConfig.currencyCode)
      : `FAQ — ${displayCountry} (${localeConfig.currencyCode}): ${dict.heroSubtitle}`;
  } else if (['privacy', 'terms', 'about', 'contact'].includes(type)) {
    const legalTitleMap = {
      privacy: dict.legal?.privacyTitle,
      terms: dict.legal?.termsTitle,
      about: dict.legal?.aboutTitle,
      contact: dict.legal?.contactTitle
    };
    const legalTitle = legalTitleMap[type] || 'Info';
    title = `${legalTitle} — ${displayCountry} | CuponesTech`;
    description = `${legalTitle} (${displayCountry}, ${localeConfig.currencyCode}) — CuponesTech.`;
  }

  const rawKeywords = p.keywords(displayCountry, localeConfig.currencyCode, catName, storeFilter ? storeName : '', hasTemu);
  if (!isCustomLangPack) {
    rawKeywords.unshift(dict.heroTitle, catName, displayCountry);
  }
  const keywords = [...new Set(rawKeywords.filter(Boolean).map((k) => String(k).trim()))].join(', ');

  return {
    title,
    description,
    keywords,
    ogLocale
  };
}

function buildAutoBreadcrumbs(localeConfig, canonicalUrl, route = {}) {
  const displayCountry = getLocalizedCountryName(localeConfig, localeConfig.lang);
  const ui = getSectionText(localeConfig.lang);
  const { type = 'home', storeFilter = null, slug = null } = typeof route === 'object' && route ? route : {};
  const homeUrl = `${BASE_DOMAIN}/`;
  const localeUrl = `${BASE_DOMAIN}/${localeConfig.code}`;

  const items = [{ name: 'CuponesTech', item: homeUrl }];
  if (canonicalUrl === homeUrl) return items;

  items.push({ name: `${displayCountry} (${localeConfig.currencyCode})`, item: localeUrl });

  if (storeFilter === 'temu' || storeFilter === 'aliexpress' || type === 'temu' || type === 'aliexpress') {
    const sKey = storeFilter || type;
    const sName = sKey === 'temu' ? 'Temu' : 'AliExpress';
    items.push({ name: sName, item: `${localeUrl}/${sKey}` });
  }

  if (type === 'category' && slug) {
    const catName = localeConfig.dict.categories?.[slug] || ui.catShort?.[slug] || slug;
    items.push({ name: catName, item: canonicalUrl });
  } else if (type === 'dynamics') {
    items.push({ name: ui.navDynamics, item: canonicalUrl });
  } else if (type === 'guides') {
    items.push({ name: ui.navGuides, item: canonicalUrl });
  } else if (type === 'faq') {
    items.push({ name: ui.navFaq || 'FAQ', item: canonicalUrl });
  } else if (['privacy', 'terms', 'about', 'contact'].includes(type)) {
    const map = {
      privacy: localeConfig.dict.legal?.privacyTitle,
      terms: localeConfig.dict.legal?.termsTitle,
      about: localeConfig.dict.legal?.aboutTitle,
      contact: localeConfig.dict.legal?.contactTitle
    };
    items.push({ name: map[type] || type, item: canonicalUrl });
  }

  return items;
}

const FAQ_ENABLED_TYPES = new Set(['home', 'temu', 'aliexpress', 'category', 'guides', 'faq']);
const CATALOG_TYPES = new Set(['', 'home', 'temu', 'aliexpress', 'category']);
const DEFAULT_PRODUCT_IMAGE = 'https://ae-pic-a1.aliexpress-media.com/kf/Sb96ac494285d4dceb922d81e5f158cbdD.jpg';
const GOOGLE_TAXONOMY_URL = 'https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt';
const GOOGLE_PRODUCT_CATEGORY_IDS = {
  'moda-ropa': '166',
  'smart-home': '536',
  'belleza-cuidado': '469',
  'tech-gadgets': '222',
  'accesorios-moviles': '264',
  'perifericos-gaming': '1270',
  'herramientas-autos': '632',
  'juguetes-hobbies': '1239',
  'deportes-outdoor': '988',
  mascotas: '1',
  'bebes-oficina': '922',
  'redes-wifi': '342'
};

export function getCatalogDealsForMarket(localeConfig, { categorySlug = null, limit = 16 } = {}) {
  const countryIso = String(localeConfig?.iso || 'us').toLowerCase();
  const countryDeals = ALL_DEALS.filter((d) => {
    const c = d.countries;
    if (!Array.isArray(c) || c.length === 0) return true;
    return c.includes(countryIso) || c.includes('global');
  });

  const sortedCountry = [...countryDeals].sort((a, b) => {
    const aReg = Array.isArray(a.countries) && a.countries.includes(countryIso) && !a.countries.includes('global') ? 2 : 0;
    const bReg = Array.isArray(b.countries) && b.countries.includes(countryIso) && !b.countries.includes('global') ? 2 : 0;
    const aCode = a['Code Name'] ? 1 : 0;
    const bCode = b['Code Name'] ? 1 : 0;
    return (bReg + bCode) - (aReg + aCode);
  });

  if (categorySlug) {
    const catMatches = sortedCountry.filter((d) => d.category === categorySlug);
    if (catMatches.length > 0) return catMatches.slice(0, limit);
  }
  return sortedCountry.slice(0, limit);
}

function mapDealToSchemaItem(deal, localeConfig) {
  const priceMatch = String(deal['Discount Price'] || deal['Origin Price'] || '').match(/[\d.]+/);
  const numericPrice = priceMatch ? parseFloat(priceMatch[0]) : 19.99;
  const fbMatch = String(deal['Positive Feedback'] || '').match(/[\d.]+/);
  const fbPct = fbMatch ? parseFloat(fbMatch[0]) : 96;
  const ratingValue = Math.min(5, Math.max(4.0, fbPct / 20)).toFixed(1);
  const salesNum = parseInt(deal.Sales180Day, 10);
  const reviewCount = Number.isFinite(salesNum) && salesNum > 0 ? Math.max(12, salesNum) : 64;
  const catLabel = localeConfig.dict?.categories?.[deal.category] || deal.category || localeConfig.dict?.heroTitle;
  const discountTag = deal.Discount ? ` (${deal.Discount} OFF)` : '';
  const codeTag = deal['Code Name'] ? ` — Promo code: ${deal['Code Name']}` : '';

  return {
    id: `deal-${deal.ProductId}`,
    store: 'aliexpress',
    title: deal['Product Desc'],
    imageUrl: deal['Image Url'] || DEFAULT_PRODUCT_IMAGE,
    appliesToText: `${deal['Product Desc']}${discountTag}${codeTag} — ${catLabel}`,
    category: deal.category || null,
    categoryLabel: catLabel,
    affiliateLink: deal['Promotion Url'] || 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    currencyCode: deal.Currency || 'USD',
    numericPrice,
    validFrom: String(deal['Code Start Time'] || '2026-01-01').slice(0, 10),
    validUntil: '2027-12-31',
    ratingValue,
    reviewCount
  };
}

export function buildStructuredData(localeConfig, coupons, canonicalUrl, pageTypeOrRoute = '', breadcrumbItems = []) {
  const isObj = typeof pageTypeOrRoute === 'object' && pageTypeOrRoute !== null;
  const pageType = isObj ? (pageTypeOrRoute.type || '') : String(pageTypeOrRoute || '');
  const cleanType = pageType.replace(/^\//, '').toLowerCase();
  const routeStore = isObj
    ? (pageTypeOrRoute.storeFilter || (cleanType === 'temu' || cleanType === 'aliexpress' ? cleanType : null))
    : (cleanType.endsWith('temu') ? 'temu' : cleanType.endsWith('aliexpress') ? 'aliexpress' : null);
  const routeSlug = isObj ? (pageTypeOrRoute.slug || null) : null;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CuponesTech',
      url: BASE_DOMAIN,
      logo: `${BASE_DOMAIN}/favicon-192x192.png`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CuponesTech',
      url: BASE_DOMAIN
    }
  ];

  const resolvedBreadcrumbs = breadcrumbItems && breadcrumbItems.length > 0
    ? breadcrumbItems
    : buildAutoBreadcrumbs(localeConfig, canonicalUrl, isObj ? pageTypeOrRoute : { type: cleanType || 'home' });

  if (resolvedBreadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: resolvedBreadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.item
      }))
    });
  }

  const isCatalogRoute =
    CATALOG_TYPES.has(cleanType) ||
    cleanType.endsWith('temu') ||
    cleanType.endsWith('aliexpress') ||
    cleanType.includes('categoria/') ||
    cleanType.includes('category/');

  if (isCatalogRoute) {
    const productItems = Array.isArray(coupons) ? [...coupons] : [];
    if (productItems.length < 6 && routeStore !== 'temu') {
      const needed = 10 - productItems.length;
      const dealItems = getCatalogDealsForMarket(localeConfig, { categorySlug: routeSlug, limit: needed })
        .map((d) => mapDealToSchemaItem(d, localeConfig));
      productItems.push(...dealItems);
    }

    if (productItems.length > 0) {
      const countryIsoUpper = String(localeConfig.iso || 'US').toUpperCase();
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: localeConfig.dict.heroTitle,
        description: localeConfig.dict.heroSubtitle,
        url: canonicalUrl,
        numberOfItems: productItems.length,
        itemListElement: productItems.slice(0, 15).map((c, idx) => {
          const itemTitle = typeof c.title === 'object' ? (c.title[localeConfig.lang] || c.title.en || c.title.es) : c.title;
          const itemDesc = c.appliesToText
            || (Array.isArray(c.requirements) && c.requirements.length > 0 ? c.requirements.join(' · ') : '')
            || localeConfig.dict.heroSubtitle;
          const catSlug = c.category || routeSlug || null;
          const gpcId = catSlug ? GOOGLE_PRODUCT_CATEGORY_IDS[catSlug] : null;
          const itemCategory = gpcId
            ? {
                '@type': 'CategoryCode',
                inCodeSet: GOOGLE_TAXONOMY_URL,
                codeValue: gpcId
              }
            : null;
          const itemCurr = c.currencyCode || c.currency || localeConfig.currencyCode || 'USD';
          const rawPrice = Number(c.numericPrice ?? c.discountValue ?? 1);
          const itemPrice = (Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 1).toFixed(2);
          const validFrom = String(c.validFrom || '2026-01-01').slice(0, 10);
          const priceValidUntil = String(c.validUntil || '2027-12-31').slice(0, 10);
          const itemImg = c.imageUrl || DEFAULT_PRODUCT_IMAGE;

          return {
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'Product',
              name: itemTitle,
              image: [itemImg, `${BASE_DOMAIN}/favicon-192x192.png`],
              description: itemDesc,
              sku: String(c.id || c.code || idx + 1),
              ...(itemCategory ? { category: itemCategory } : {}),
              brand: {
                '@type': 'Brand',
                name: c.store === 'temu' ? 'Temu' : 'AliExpress'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(c.ratingValue || '4.8'),
                reviewCount: String(c.reviewCount || '128'),
                bestRating: '5',
                worstRating: '1'
              },
              review: {
                '@type': 'Review',
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5'
                },
                author: {
                  '@type': 'Organization',
                  name: 'CuponesTech'
                },
                reviewBody: itemDesc
              },
              offers: {
                '@type': 'Offer',
                url: c.affiliateLink || c.affiliateUrl || canonicalUrl,
                priceCurrency: itemCurr,
                price: itemPrice,
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition',
                validFrom,
                priceValidUntil,
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '0',
                    currency: itemCurr
                  },
                  shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: countryIsoUpper
                  },
                  deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
                    transitTime: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 10, unitCode: 'DAY' }
                  }
                },
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: countryIsoUpper,
                  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                  merchantReturnDays: 30,
                  returnMethod: 'https://schema.org/ReturnByMail',
                  returnFees: 'https://schema.org/FreeReturn'
                }
              }
            }
          };
        })
      });
    }
  }

  const isFaqEnabled =
    FAQ_ENABLED_TYPES.has(cleanType) ||
    cleanType === '' ||
    cleanType.endsWith('faq') ||
    cleanType.endsWith('temu') ||
    cleanType.endsWith('aliexpress') ||
    cleanType.includes('categoria/') ||
    cleanType.includes('category/') ||
    cleanType.includes('guias') ||
    cleanType.includes('guides');

  if (isFaqEnabled && localeConfig.dict.faqs && localeConfig.dict.faqs.length > 0) {
    schemas.push({
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
    });
  }

  return schemas;
}

const INDEX_ROBOTS_CONTENT = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS_CONTENT = 'noindex, follow';
const PRUNED_LEGAL_TYPES = new Set(['privacy', 'terms', 'about', 'contact', 'faq']);

export function getRouteSuffixForLocale(route = { type: 'home', storeFilter: null, slug: null }, localeConfig = LOCALE_MAP[DEFAULT_LOCALE]) {
  const normRoute = typeof route === 'string'
    ? { type: route || 'home', storeFilter: null, slug: null }
    : (route || { type: 'home', storeFilter: null, slug: null });
  const slugs = getRouteSlugsForLang(localeConfig.lang);
  if (normRoute.type === 'home') return '';
  if (normRoute.type === 'temu') return '/temu';
  if (normRoute.type === 'aliexpress') return '/aliexpress';
  if (normRoute.type === 'dynamics') return `/${slugs.dynamics}`;
  if (normRoute.type === 'guides') return `/${slugs.guides}`;
  if (normRoute.type === 'privacy') return `/${slugs.privacy}`;
  if (normRoute.type === 'terms') return `/${slugs.terms}`;
  if (normRoute.type === 'about') return `/${slugs.about}`;
  if (normRoute.type === 'contact') return `/${slugs.contact}`;
  if (normRoute.type === 'faq') return `/${slugs.faq || 'faq'}`;
  if (normRoute.type === 'category' && normRoute.slug) {
    const fullPath = getLocalizedCategoryPath(localeConfig, normRoute.storeFilter, normRoute.slug);
    return fullPath.slice(`/${localeConfig.code}`.length);
  }
  return '';
}

/**
 * Resuelve de forma determinista la política SEO (robots, canonical, hreflang, sitemap)
 * compartida entre SSG (`scripts/prerender-and-sitemap.js`) y cliente (`SEOHead.jsx`).
 */
export function resolveRouteSeoPolicy(
  localeConfig,
  route = { type: 'home', storeFilter: null, slug: null },
  { coupons = [], offersCount = 0, isRoot = false, indexableLocales = null } = {}
) {
  const loc = localeConfig || LOCALE_MAP[DEFAULT_LOCALE];
  const normRoute = typeof route === 'string'
    ? { type: route || 'home', storeFilter: null, slug: null }
    : (route || { type: 'home', storeFilter: null, slug: null });
  const type = normRoute.type || 'home';
  const storeFilter = normRoute.storeFilter || null;
  const slug = normRoute.slug || null;

  const routeSuffix = isRoot ? '' : getRouteSuffixForLocale(normRoute, loc);
  const selfUrl = isRoot ? `${BASE_DOMAIN}/` : `${BASE_DOMAIN}/${loc.code}${routeSuffix}`;
  const defaultLocObj = LOCALE_MAP[DEFAULT_LOCALE] || LOCALES[0];

  const allowedSet = indexableLocales instanceof Set
    ? indexableLocales
    : Array.isArray(indexableLocales)
      ? new Set(indexableLocales)
      : null;

  // R1: Rutas duplicadas de AliExpress -> noindex, canonical hacia ruta sin filtro de tienda, sin hreflang, fuera de sitemap
  if (type === 'aliexpress' || (type === 'category' && storeFilter === 'aliexpress')) {
    const canonicalUrl = type === 'category' && slug
      ? `${BASE_DOMAIN}${getLocalizedCategoryPath(loc, null, slug)}`
      : `${BASE_DOMAIN}/${loc.code}`;
    return {
      isIndexable: false,
      robotsContent: NOINDEX_ROBOTS_CONTENT,
      canonicalUrl,
      emitHreflang: false,
      includeInSitemap: false,
      hreflangLocales: [],
      xDefaultHref: null
    };
  }

  // R2: Rutas de Temu -> indexables solo con soporte en país + inventario activo (cupones u ofertas)
  if (type === 'temu' || (type === 'category' && storeFilter === 'temu')) {
    const hasTemuInCountry = (loc.stores || []).includes('temu');
    const activeCoupons = Array.isArray(coupons) ? coupons.length : 0;
    const activeOffers = Number(offersCount) || 0;
    const hasInventory = hasTemuInCountry && (activeCoupons > 0 || activeOffers > 0);

    if (!hasInventory) {
      return {
        isIndexable: false,
        robotsContent: NOINDEX_ROBOTS_CONTENT,
        canonicalUrl: selfUrl,
        emitHreflang: false,
        includeInSitemap: false,
        hreflangLocales: [],
        xDefaultHref: null
      };
    }

    const hreflangLocales = allowedSet
      ? LOCALES.filter((l) => allowedSet.has(l.code))
      : LOCALES.filter((l) => (l.stores || []).includes('temu'));
    const hasDefaultInHreflang = hreflangLocales.some((l) => l.code === DEFAULT_LOCALE);
    const xDefaultHref = hasDefaultInHreflang
      ? `${BASE_DOMAIN}/${DEFAULT_LOCALE}${getRouteSuffixForLocale(normRoute, defaultLocObj)}`
      : null;

    return {
      isIndexable: true,
      robotsContent: INDEX_ROBOTS_CONTENT,
      canonicalUrl: selfUrl,
      emitHreflang: true,
      includeInSitemap: true,
      hreflangLocales,
      xDefaultHref
    };
  }

  // R3: Rutas legales y FAQ -> noindex, self-canonical, sin hreflang, fuera de sitemap
  if (PRUNED_LEGAL_TYPES.has(type)) {
    return {
      isIndexable: false,
      robotsContent: NOINDEX_ROBOTS_CONTENT,
      canonicalUrl: selfUrl,
      emitHreflang: false,
      includeInSitemap: false,
      hreflangLocales: [],
      xDefaultHref: null
    };
  }

  // Rutas indexables: home, category (storeFilter === null), dynamics, guides, root /
  const hreflangLocales = allowedSet
    ? LOCALES.filter((l) => allowedSet.has(l.code))
    : LOCALES;
  const hasDefaultInHreflang = hreflangLocales.some((l) => l.code === DEFAULT_LOCALE);
  const isHomeRoute = type === 'home' && !storeFilter && !slug;
  const xDefaultHref = isHomeRoute
    ? `${BASE_DOMAIN}/`
    : (hasDefaultInHreflang
        ? `${BASE_DOMAIN}/${DEFAULT_LOCALE}${getRouteSuffixForLocale(normRoute, defaultLocObj)}`
        : null);

  return {
    isIndexable: true,
    robotsContent: INDEX_ROBOTS_CONTENT,
    canonicalUrl: selfUrl,
    emitHreflang: true,
    includeInSitemap: true,
    hreflangLocales,
    xDefaultHref
  };
}

export { BASE_DOMAIN, CATEGORY_SLUGS };
