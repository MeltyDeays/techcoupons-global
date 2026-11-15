/**
 * CLIENTES OFICIALES DE APIS DE AFILIADOS (Admitad & AliExpress Portals)
 * ---------------------------------------------------------------------
 * Implementación de bajo nivel para conectarse directamente a las APIs
 * oficiales en cuanto se disponga de las credenciales, sin librerías externas.
 */
import crypto from 'crypto';

/**
 * ADMITAD API CLIENT
 * Soporta tanto token directo (Bearer) como flujo OAuth2 automático
 * (client_id + client_secret -> https://api.admitad.com/token/)
 */
export async function getAdmitadAccessToken({
  clientId,
  clientSecret,
  scope = 'coupons coupons_for_website advcampaigns advcampaigns_for_website'
}) {
  if (!clientId || !clientSecret) return null;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    scope
  });

  const res = await fetch('https://api.admitad.com/token/', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Admitad OAuth2 error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function fetchAdmitadActiveCoupons({ token, clientId, clientSecret, websiteId, limit = 100 }) {
  let activeToken = token;
  if (!activeToken && clientId && clientSecret) {
    activeToken = await getAdmitadAccessToken({ clientId, clientSecret });
  }

  if (!activeToken) {
    throw new Error('Falta ADMITAD_API_TOKEN o (ADMITAD_CLIENT_ID + ADMITAD_CLIENT_SECRET)');
  }

  const endpoint = websiteId
    ? `https://api.admitad.com/coupons/website/${websiteId}/?limit=${limit}&status=active`
    : `https://api.admitad.com/coupons/?limit=${limit}&status=active`;

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${activeToken}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Admitad API error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  return json.results || [];
}

/**
 * ALIEXPRESS PORTALS (OPEN PLATFORM) API CLIENT
 * Firma HMAC-SHA256 estándar del protocolo TOP / IOP de AliExpress.
 * Gateway oficial: https://api-sg.aliexpress.com/sync
 */
export function signAliExpressRequest(arg1, arg2, arg3, arg4 = 'sha256') {
  let apiName = '';
  let params = {};
  let appSecret = '';
  let signMethod = 'sha256';

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    apiName = arg1;
    params = arg2;
    appSecret = arg3;
    signMethod = arg4 || 'sha256';
  } else if (typeof arg1 === 'object') {
    params = arg1;
    appSecret = arg2;
    signMethod = arg3 || 'sha256';
  }

  const allParams = { ...params };
  if (apiName && !allParams.method) {
    allParams.method = apiName.replace(/^\//, '').replace(/\//g, '.');
  }

  const sortedKeys = Object.keys(allParams).sort();
  let baseString = '';
  for (const k of sortedKeys) {
    baseString += `${k}${allParams[k]}`;
  }

  return crypto
    .createHmac(signMethod, appSecret)
    .update(baseString, 'utf-8')
    .digest('hex')
    .toUpperCase();
}

export async function callAliExpressOpenPlatform(apiName, businessParams, { appKey, appSecret, trackingId }) {
  if (!appKey || !appSecret) {
    throw new Error('Falta ALI_APP_KEY o ALI_APP_SECRET');
  }

  const gatewayUrl = 'https://api-sg.aliexpress.com/sync';
  const timestamp = Date.now();
  const signMethod = 'sha256';
  const normalizedMethod = apiName.replace(/^\//, '').replace(/\//g, '.');

  const allParams = {
    method: normalizedMethod,
    app_key: String(appKey),
    timestamp: String(timestamp),
    sign_method: signMethod,
    format: 'json',
    v: '2.0',
    ...(trackingId ? { tracking_id: String(trackingId) } : {}),
    ...businessParams
  };

  const signature = signAliExpressRequest(allParams, appSecret, signMethod);
  allParams.sign = signature;

  const formBody = new URLSearchParams(allParams).toString();

  const res = await fetch(gatewayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: formBody
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AliExpress Gateway error (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Consulta de promociones destacadas en AliExpress Portals
 */
export async function fetchAliExpressPromos({ appKey, appSecret, trackingId }) {
  const apiName = 'aliexpress.affiliate.featuredpromo.get';
  const data = await callAliExpressOpenPlatform(apiName, {}, { appKey, appSecret, trackingId });

  const promos = data?.aliexpress_affiliate_featuredpromo_get_response?.resp_result?.result?.promos?.promo || [];
  return Array.isArray(promos) ? promos : [promos].filter(Boolean);
}

/**
 * Convierte una URL estándar en enlace de afiliado oficial (s.click.aliexpress.com)
 */
export async function generateAliExpressTrackingLink({ targetUrl = 'https://www.aliexpress.com', appKey, appSecret, trackingId = 'default' }) {
  const data = await callAliExpressOpenPlatform('aliexpress.affiliate.link.generate', {
    promotion_link_type: '0',
    source_values: targetUrl,
    tracking_id: trackingId
  }, { appKey, appSecret, trackingId });

  const link = data?.aliexpress_affiliate_link_generate_response?.resp_result?.result?.promotion_links?.promotion_link?.[0]?.promotion_link;
  return link || targetUrl;
}

/**
 * Campañas globales de AliExpress aplicables a todos los países soportados.
 */
export const GLOBAL_PROMO_FEEDS = [
  '1101-1118 11.11 Sale - Bestsellers',
  '1101-1118 11.11 Sale - Big Save',
  '1101-1118 11.11 Sale - Top Brands',
  'DS_ConsumerElectronics_bestsellers',
  'DS_Home&Kitchen_bestsellers',
  'DS_Beauty_bestsellers',
  'DS_Sports&Outdoors_bestsellers',
  'DS_Automobile&Accessories_bestsellers',
  'DS_Fashions&Cosmetics 20$+',
  'DS_Mother&Kids 10$+'
];

const US_AND_LOCKER_ISOS = [
  'us', 'pr', 'ni', 'cr', 'gt', 'sv', 'hn', 'pa', 'do', 'co', 'ec', 'uy', 'py', 'bo', 'ar'
];
const US_PROMO_FEEDS = [
  'US 3PL-Warehouse 20240202',
  'USA_beauty&health_topsellers',
  'AEB_US_Home&Garden_TopSellers',
  'AEB_US_LocalStock_Choice_20240830'
];
const DE_PROMO_FEEDS = ['AEB_DE_LocalStock_PlatformOperation_20241023', 'FebProductsForDE'];
const SA_GULF_PROMO_FEEDS = [
  'AEB_SA_Clothing&Accessories&LightweightMachine_VATIncluded_5~50USD',
  'SA_Clothing&Shoes'
];
const EU_CHOICE_PROMO_FEEDS = ['AEB_EE&FI&LV&LT_CHOICE_Bestsellers_$150', 'AEB_CETagItems_20241017'];

/**
 * Mapeo de países ISO2 (locales.js) a sus campañas regionales activas en AliExpress Portals.
 * Países sin feed regional dedicado reciben automáticamente GLOBAL_PROMO_FEEDS.
 */
export const COUNTRY_PROMO_FEEDS = {
  ...Object.fromEntries(US_AND_LOCKER_ISOS.map((iso) => [iso, US_PROMO_FEEDS])),
  mx: ['AEB_MX_ShipFromMX_20241119', 'AEB_Mexico_SelectedItems_20241014'],
  br: ['AEB_BR_ShipFromBR_20241114', 'AEB_BR_DropiSelectedItems_20241106'],
  pe: ['0203-Knasta-202602-PE'],
  es: ['AEB_ES_LocalStock_PlatformOperation_20240926', 'ES_CSS_Gen'],
  de: DE_PROMO_FEEDS,
  at: DE_PROMO_FEEDS,
  ch: DE_PROMO_FEEDS,
  fr: ['AEB_FR_LocalStock_PlatformOperation_20240926'],
  be: ['AEB_FR_LocalStock_PlatformOperation_20240926'],
  gb: ['AEB_UK_LocalStock_PlatformOperation_20240926', 'MostSearchedProductsForUK'],
  ie: ['AEB_UK_LocalStock_PlatformOperation_20240926', 'MostSearchedProductsForUK'],
  it: ['ConnexityIT'],
  pl: ['AEB_Poland_LocalStock_PlatformOperation_20241028'],
  tr: ['AEB_TR_Melis_TopSellers_20241203'],
  au: ['AEB_AU_HomeImprovement&Furniture&Lights&Tools&Luggage'],
  nz: ['AEB_AU_HomeImprovement&Furniture&Lights&Tools&Luggage'],
  sa: SA_GULF_PROMO_FEEDS,
  ae: SA_GULF_PROMO_FEEDS,
  qa: SA_GULF_PROMO_FEEDS,
  kw: SA_GULF_PROMO_FEEDS,
  za: [
    'consumer electronics_ZA topsellers_ 20240423',
    'home_ZA topsellers_ 20240423',
    'Sports_ZA topsellers_ 20240423'
  ],
  ...Object.fromEntries(
    ['fi', 'se', 'no', 'dk', 'nl', 'pt', 'gr', 'cz', 'ro', 'hu', 'ua'].map((iso) => [iso, EU_CHOICE_PROMO_FEEDS])
  )
};

/**
 * Consulta productos de una campaña promocional específica en AliExpress Open Service.
 */
export async function fetchAliExpressPromoProducts({
  promotionName,
  pageNo = 1,
  pageSize = 50,
  targetCurrency = 'USD',
  targetLanguage = 'EN',
  country,
  appKey,
  appSecret,
  trackingId = 'default'
}) {
  const params = {
    promotion_name: promotionName,
    page_no: String(pageNo),
    page_size: String(pageSize),
    target_currency: targetCurrency,
    target_language: targetLanguage,
    ...(country ? { country: String(country).toUpperCase() } : {})
  };

  const data = await callAliExpressOpenPlatform(
    'aliexpress.affiliate.featuredpromo.products.get',
    params,
    { appKey, appSecret, trackingId }
  );

  const products = data?.aliexpress_affiliate_featuredpromo_products_get_response?.resp_result?.result?.products?.product || [];
  return Array.isArray(products) ? products : [products].filter(Boolean);
}

/**
 * Clasifica un producto de AliExpress API dentro de las 11 categorías canónicas del sitio.
 */
export function classifyAliExpressCategory(product) {
  const first = String(product?.first_level_category_name || '').toLowerCase();
  const second = String(product?.second_level_category_name || '').toLowerCase();
  const title = String(product?.product_title || '').toLowerCase();
  const combined = `${first} ${second} ${title}`;

  if (/\b(pet|pets|dog|cat|aquarium|pet products|kennel|leash)\b/.test(`${second} ${title}`)) {
    return 'mascotas';
  }
  if (second.includes('games & accessories') || /\b(gaming|gamepad|joystick|ps5|ps4|xbox|nintendo switch|anbernic|steam deck)\b/.test(combined)) {
    return 'perifericos-gaming';
  }
  if (first.includes('phones & telecommunications') || second.includes('mobile phone')) {
    return 'accesorios-moviles';
  }
  if (first.includes('automobiles') || first.includes('motorcycle') || first.includes('tools') || second.includes('car ') || second.includes('measurement & analysis')) {
    return 'herramientas-autos';
  }
  if (first.includes('mother & kids') || second.includes('baby') || second.includes('stationery') || first.includes('office & school')) {
    return 'bebes-oficina';
  }
  if (first.includes('toys & hobbies') || /\b(rc drone|action figure|lego|building blocks)\b/.test(combined)) {
    return 'juguetes-hobbies';
  }
  if (first.includes('sports & entertainment') || second.includes('camping') || second.includes('cycling') || second.includes('fishing') || second.includes('fitness')) {
    return 'deportes-outdoor';
  }
  if (first.includes('beauty & health') || second.includes('skin care') || second.includes('makeup') || second.includes('hair care')) {
    return 'belleza-cuidado';
  }
  if (
    first.includes('clothing') ||
    first.includes('apparel') ||
    first.includes('shoes') ||
    first.includes('jewelry') ||
    first.includes('watches') ||
    first.includes('luggage & bags') ||
    first.includes('novelty') ||
    first.includes('underwear') ||
    first.includes('sports shoes,clothing')
  ) {
    return 'moda-ropa';
  }
  if (
    first.includes('consumer electronics') ||
    first.includes('computer & office') ||
    first.includes('electronic components') ||
    first.includes('security & protection')
  ) {
    return 'tech-gadgets';
  }
  if (
    first.includes('home & garden') ||
    first.includes('home appliances') ||
    first.includes('home improvement') ||
    first.includes('lights & lighting') ||
    first.includes('furniture')
  ) {
    return 'smart-home';
  }

  return 'tech-gadgets';
}

export function parseAliExpressPromoCodeInfo(promoInfo, defaultCurrency = 'USD') {
  if (!promoInfo || !promoInfo.promo_code) return null;
  const rawVal = String(promoInfo.code_value || '').trim();
  const matchGetOff = rawVal.match(/get\s+([A-Z]{3})\s*([\d.]+)\s+off/i) || rawVal.match(/([A-Z]{3})\s*([\d.]+)\s+off/i);
  const currency = matchGetOff ? matchGetOff[1].toUpperCase() : defaultCurrency;
  const numericValue = matchGetOff ? Number(matchGetOff[2]) : Number(rawVal.replace(/[^\d.]/g, '')) || 0;
  const codeValueText = matchGetOff
    ? `${currency} ${Number(matchGetOff[2]).toFixed(2)}`
    : rawVal;

  const minRaw = promoInfo.code_mini_spend != null ? Number(promoInfo.code_mini_spend) : 0;
  const minSpendText = minRaw > 0 ? `${currency} ${minRaw.toFixed(2)}` : '';

  return {
    code: String(promoInfo.promo_code).trim(),
    startTime: promoInfo.code_availabletime_start || '',
    endTime: promoInfo.code_availabletime_end || '',
    codeValueText,
    numericValue,
    currency,
    quantity: promoInfo.code_quantity != null ? String(promoInfo.code_quantity) : '',
    minSpendText,
    numericMinSpend: minRaw
  };
}

/**
 * Normaliza un producto de la API oficial al esquema de src/data/aliexpress_catalog_deals.json
 */
export function normalizeAliExpressApiProduct(product, { countries = ['global'], dealType = 'api-sync' } = {}) {
  const currency = product?.target_sale_price_currency || product?.sale_price_currency || 'USD';
  const orig = product?.target_original_price || product?.original_price || product?.sale_price || '';
  const discPrice = product?.target_sale_price || product?.sale_price || orig;
  const rawDiscount = String(product?.discount || '').trim();
  const discount = rawDiscount && !rawDiscount.endsWith('%') ? `${rawDiscount}%` : rawDiscount;
  const parsedCode = parseAliExpressPromoCodeInfo(product?.promo_code_info, currency);

  const normalizedCountries = Array.isArray(countries) && countries.length
    ? [...new Set(countries.map((c) => String(c).toLowerCase().trim()).filter(Boolean))]
    : ['global'];

  return {
    ProductId: String(product.product_id),
    'Image Url': product.product_main_image_url || '',
    'Video Url': product.product_video_url || '',
    'Product Desc': String(product.product_title || '').trim(),
    'Origin Price': orig ? `${currency} ${orig}` : '',
    'Discount Price': discPrice ? `${currency} ${discPrice}` : '',
    Discount: discount,
    Currency: currency,
    'Direct linking commission rate (%)': String(product.commission_rate || '').replace('%', '').trim(),
    Sales180Day: product.lastest_volume != null ? String(product.lastest_volume) : '',
    'Positive Feedback': product.evaluate_rate || '',
    'Promotion Url': product.promotion_link || product.product_detail_url || '',
    'Code Name': parsedCode?.code || '',
    'Code Start Time': parsedCode?.startTime || '',
    'Code End Time': parsedCode?.endTime || '',
    'Code Value': parsedCode?.codeValueText || '',
    'Code Quantity': parsedCode?.quantity || '',
    'Code Minimum Spend': parsedCode?.minSpendText || '',
    dealType,
    category: classifyAliExpressCategory(product),
    countries: normalizedCountries
  };
}

/**
 * Agrupa feeds por nombre único para consultar cada campaña una sola vez y etiquetar todos los países destino.
 */
export function buildFeedCountrySchedule() {
  const schedule = new Map();

  for (const [iso, feeds] of Object.entries(COUNTRY_PROMO_FEEDS)) {
    for (const feedName of feeds) {
      if (!schedule.has(feedName)) schedule.set(feedName, new Set());
      schedule.get(feedName).add(iso);
    }
  }

  for (const feedName of GLOBAL_PROMO_FEEDS) {
    schedule.set(feedName, new Set(['global']));
  }

  return [...schedule.entries()].map(([promotionName, isoSet]) => ({
    promotionName,
    countries: isoSet.has('global') ? ['global'] : [...isoSet]
  }));
}

function scoreApiProduct(p) {
  const hasCode = p?.promo_code_info?.promo_code ? 100000 : 0;
  const sales = Number(p?.lastest_volume || 0);
  const disc = Number(String(p?.discount || '').replace('%', '')) || 0;
  return hasCode + sales + disc * 10;
}

/**
 * Sincroniza ofertas multi-país y globales desde AliExpress Open Service.
 * Devuelve tanto productos normalizados para el catálogo como ítems con promo_code_info para validación de cupones.
 */
export async function fetchAliExpressMultiCountryDeals({
  appKey,
  appSecret,
  trackingId = 'default',
  globalPages = 2,
  regionalPages = 1,
  pageSize = 50,
  maxPerGlobalFeed = 30,
  maxPerRegionalFeed = 25,
  concurrency = 5
}) {
  const schedule = buildFeedCountrySchedule();
  const byProductId = new Map();
  const rawCouponItems = [];
  const feedStats = [];

  for (let i = 0; i < schedule.length; i += concurrency) {
    const batch = schedule.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(async ({ promotionName, countries }) => {
        const isGlobal = countries.includes('global');
        const pages = isGlobal ? globalPages : regionalPages;
        const limit = isGlobal ? maxPerGlobalFeed : maxPerRegionalFeed;
        const primaryCountry = isGlobal ? undefined : countries[0];
        const fetched = [];

        for (let pageNo = 1; pageNo <= pages; pageNo++) {
          const items = await fetchAliExpressPromoProducts({
            promotionName,
            pageNo,
            pageSize,
            country: primaryCountry,
            appKey,
            appSecret,
            trackingId
          });
          fetched.push(...items);
          if (items.length < pageSize) break;
        }

        const validItems = fetched
          .filter((p) => p?.product_id && p?.product_main_image_url && p?.product_title && (p?.promotion_link || p?.product_detail_url))
          .sort((a, b) => scoreApiProduct(b) - scoreApiProduct(a));

        const selected = validItems.slice(0, limit);
        const withCodeCount = validItems.filter((p) => p?.promo_code_info?.promo_code).length;

        return { promotionName, countries, totalFetched: validItems.length, withCodeCount, selected };
      })
    );

    for (const res of batchResults) {
      if (res.status !== 'fulfilled') {
        feedStats.push({ error: res.reason?.message || 'Feed error' });
        continue;
      }

      const { promotionName, countries, totalFetched, withCodeCount, selected } = res.value;
      feedStats.push({ promotionName, countries, totalFetched, withCodeCount, kept: selected.length });

      for (const rawProduct of selected) {
        const normalized = normalizeAliExpressApiProduct(rawProduct, {
          countries,
          dealType: countries.includes('global') ? 'api-global' : 'api-regional'
        });

        const existing = byProductId.get(normalized.ProductId);
        if (existing) {
          const mergedCountries = existing.countries.includes('global') || normalized.countries.includes('global')
            ? ['global']
            : [...new Set([...existing.countries, ...normalized.countries])];
          // Conservar el que tenga cupón activo si alguno carece de él
          const preferNew = !existing['Code Name'] && normalized['Code Name'];
          byProductId.set(normalized.ProductId, {
            ...(preferNew ? normalized : existing),
            countries: mergedCountries
          });
        } else {
          byProductId.set(normalized.ProductId, normalized);
        }

        if (rawProduct.promo_code_info?.promo_code) {
          rawCouponItems.push({
            ...rawProduct.promo_code_info,
            product_id: rawProduct.product_id,
            product_title: rawProduct.product_title,
            code_promotionurl: rawProduct.promotion_link || rawProduct.product_detail_url,
            countries,
            category: normalized.category,
            currency: rawProduct.target_sale_price_currency || 'USD'
          });
        }
      }
    }
  }

  return {
    deals: [...byProductId.values()],
    rawCouponItems,
    feedStats
  };
}
