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

export function buildStructuredData(localeConfig, coupons, canonicalUrl, pageType = '') {
  const schemas = [];

  if (coupons && coupons.length > 0) {
    schemas.push({
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
    });
  }

  // Only inject FAQPage schema on the dedicated FAQ page where FAQs are actually displayed
  const isFaqPage =
    (pageType || '').toLowerCase() === 'faq' ||
    (pageType || '').toLowerCase().endsWith('/faq') ||
    (pageType || '').toLowerCase() === 'faq/';

  if (isFaqPage && localeConfig.dict.faqs && localeConfig.dict.faqs.length > 0) {
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

export { BASE_DOMAIN, CATEGORY_SLUGS };
