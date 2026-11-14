/**
 * CUPONES VERIFICADOS — ÚNICA FUENTE DE CÓDIGOS PUBLICADOS
 * --------------------------------------------------------
 * Regla: un código solo se publica si TODOS los campos obligatorios están completos,
 * la fecha actual está dentro de [validFrom, validUntil] y fue verificado hace <= MAX_VERIFIED_AGE_DAYS.
 * Nunca añadir códigos generados por IA ni copiados sin probar en la tienda real.
 *
 * Fuentes válidas:
 *  - AliExpress: página oficial de promo codes del evento (por país) o AliExpress Portals / Affiliate API.
 *  - Temu: TU código de afiliado (Programa de Afiliados Temu). Solo cuentas nuevas del mismo país.
 *  - Admitad: API de cupones de la campaña aprobada.
 *
 * Esquema (copiar y rellenar):
 * {
 *   id: 'ali-us-1111-5off',            // único
 *   store: 'aliexpress',               // 'aliexpress' | 'temu'
 *   code: 'XXXX',
 *   countries: ['us'],                 // ISO2 de la cuenta/dirección de envío (campo `iso` de locales.js)
 *   userType: 'all',                   // 'all' | 'new' (nunca compró / cuenta nueva) | 'existing'
 *   currency: 'USD',                   // moneda REAL del cupón en ese país (sin conversión)
 *   discountType: 'fixed',             // 'fixed' | 'percent'
 *   discountValue: 5,
 *   maxDiscount: null,                 // tope para 'percent' (opcional)
 *   minSpend: 39,                      // en `currency`, sobre productos (sin envío ni impuestos)
 *   validFrom: '2026-11-11T00:00:00-08:00',
 *   validUntil: '2026-11-17T23:59:59-08:00',
 *   channel: 'both',                   // 'app' | 'web' | 'both'
 *   sourceUrl: 'https://...',          // dónde se obtuvo (página oficial / panel afiliado)
 *   lastVerifiedAt: '2026-11-11T20:00:00-06:00', // última prueba real en checkout
 *   affiliateUrl: '',                  // link con tracking (opcional; vacío = tienda oficial)
 *   category: null,                    // null = todo el carrito; o slug de categoría si la tienda lo limita
 *   title: { es: '...', en: '...' },
 *   notes: { es: '...', en: '...' }    // exclusiones / condiciones extra (opcional)
 * }
 */
export const VERIFIED_COUPONS = [
  {
    id: 'ali-1111-3off-global',
    store: 'aliexpress',
    code: 'IFPDAPWF',
    backupCode: 'IFPIJJXZ',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 3,
    maxDiscount: null,
    minSpend: 18,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$3 de descuento en pedidos desde $18',
      en: '$3 off orders over $18'
    },
    notes: {
      es: 'Válido en compras globales de AliExpress durante la extensión de 11.11. Aplicable directamente en el carrito.',
      en: 'Valid on global AliExpress orders during 11.11 sale extension. Apply at checkout.'
    }
  },
  {
    id: 'ali-1111-8off-global',
    store: 'aliexpress',
    code: 'IFPUJYJQ',
    backupCode: 'IFPZC8QZ',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 8,
    maxDiscount: null,
    minSpend: 45,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$8 de descuento en pedidos desde $45',
      en: '$8 off orders over $45'
    },
    notes: {
      es: 'Válido en toda la tienda para pedidos globales durante 11.11.',
      en: 'Valid storewide on global orders during 11.11.'
    }
  },
  {
    id: 'ali-1111-13off-global',
    store: 'aliexpress',
    code: 'IFPIWQBA',
    backupCode: 'IFPB9GEY',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 13,
    maxDiscount: null,
    minSpend: 79,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$13 de descuento en pedidos desde $79',
      en: '$13 off orders over $79'
    },
    notes: {
      es: 'Aplicable directamente en el checkout sobre el importe de productos.',
      en: 'Apply directly at checkout on eligible basket value.'
    }
  },
  {
    id: 'ali-1111-24off-global',
    store: 'aliexpress',
    code: 'IFPLTR3B',
    backupCode: 'IFPTZNDK',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 24,
    maxDiscount: null,
    minSpend: 139,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$24 de descuento en pedidos desde $139',
      en: '$24 off orders over $139'
    },
    notes: {
      es: 'Código oficial de escala 11.11 en pedidos medianos/grandes.',
      en: 'Official 11.11 promo code for mid-to-large carts.'
    }
  },
  {
    id: 'ali-1111-40off-global',
    store: 'aliexpress',
    code: 'IFPMJPWK',
    backupCode: 'IFPS0C1I',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 40,
    maxDiscount: null,
    minSpend: 229,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$40 de descuento en pedidos desde $229',
      en: '$40 off orders over $229'
    },
    notes: {
      es: 'Descuento directo en electrónica, moda, hogar y gadgets.',
      en: 'Direct discount on electronics, fashion, home and gadgets.'
    }
  },
  {
    id: 'ali-1111-60off-global',
    store: 'aliexpress',
    code: 'IFPZBWVW',
    backupCode: 'IFPYOYNU',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 60,
    maxDiscount: null,
    minSpend: 349,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$60 de descuento en pedidos desde $349',
      en: '$60 off orders over $349'
    },
    notes: {
      es: 'Ahorro masivo en compras grandes durante el festival 11.11.',
      en: 'Major discount on high-tier carts during 11.11 festival.'
    }
  },
  {
    id: 'ali-1111-80off-global',
    store: 'aliexpress',
    code: 'IFP6QDGG',
    backupCode: 'IFPIMHP5',
    countries: ['global'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 80,
    maxDiscount: null,
    minSpend: 469,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$80 de descuento en pedidos desde $469',
      en: '$80 off orders over $469'
    },
    notes: {
      es: 'Nivel superior de cupón para pedidos tecnológicos y de volumen.',
      en: 'High-tier discount code for premium technology and bulk carts.'
    }
  },
  {
    id: 'ali-us-1111-20off',
    store: 'aliexpress',
    code: 'IFPDNF3A',
    backupCode: 'IFPTCHSG',
    countries: ['us'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 20,
    maxDiscount: null,
    minSpend: 99,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$20 de descuento en pedidos desde $99 (EE. UU.)',
      en: '$20 off orders over $99 (USA)'
    },
    notes: {
      es: 'Exclusivo para envíos a Estados Unidos durante 11.11.',
      en: 'Exclusive for shipments to United States during 11.11.'
    }
  },
  {
    id: 'ali-us-1111-40off',
    store: 'aliexpress',
    code: 'IFP8PVFM',
    backupCode: 'IFPHJCIM',
    countries: ['us'],
    userType: 'all',
    currency: 'USD',
    discountType: 'fixed',
    discountValue: 40,
    maxDiscount: null,
    minSpend: 199,
    validFrom: '2026-11-01T00:00:00Z',
    validUntil: '2026-11-18T23:59:59Z',
    channel: 'both',
    sourceUrl: 'https://portals.aliexpress.com',
    lastVerifiedAt: '2026-11-14T22:00:00Z',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mBZjPN',
    category: null,
    title: {
      es: '$40 de descuento en pedidos desde $199 (EE. UU.)',
      en: '$40 off orders over $199 (USA)'
    },
    notes: {
      es: 'Exclusivo para pedidos con entrega en Estados Unidos.',
      en: 'Exclusive for orders shipping to the United States.'
    }
  }
];

export const MAX_VERIFIED_AGE_DAYS = 7;

const STORES = ['aliexpress', 'temu'];
const USER_TYPES = ['all', 'new', 'existing'];
const CHANNELS = ['app', 'web', 'both'];
const DAY_MS = 24 * 60 * 60 * 1000;

const isDate = (v) => typeof v === 'string' && !isNaN(new Date(v).getTime());
const isText = (v) => typeof v === 'string' && v.trim() !== '';

/** Devuelve lista de errores (vacía = publicable). */
export function validateCoupon(c, now = new Date()) {
  if (!c || typeof c !== 'object') return ['not an object'];
  const errors = [];
  if (!isText(c.id)) errors.push('id');
  if (!STORES.includes(c.store)) errors.push('store');
  if (!isText(c.code)) errors.push('code');
  if (!Array.isArray(c.countries) || !c.countries.length || !c.countries.every(isText)) errors.push('countries');
  if (!USER_TYPES.includes(c.userType)) errors.push('userType');
  if (!/^[A-Z]{3}$/.test(c.currency || '')) errors.push('currency');
  if (!['fixed', 'percent'].includes(c.discountType)) errors.push('discountType');
  if (!(c.discountValue > 0)) errors.push('discountValue');
  if (c.discountType === 'percent' && c.discountValue > 100) errors.push('discountValue>100');
  if (!(c.minSpend >= 0)) errors.push('minSpend');
  if (!CHANNELS.includes(c.channel)) errors.push('channel');
  if (!isText(c.sourceUrl) || !/^https:\/\//.test(c.sourceUrl)) errors.push('sourceUrl');
  if (!isText(c.title?.es) && !isText(c.title?.en)) errors.push('title');
  if (!isDate(c.validFrom)) errors.push('validFrom');
  if (!isDate(c.validUntil)) errors.push('validUntil');
  if (!isDate(c.lastVerifiedAt)) errors.push('lastVerifiedAt');
  if (errors.length) return errors;

  const t = now.getTime();
  if (t < new Date(c.validFrom).getTime()) errors.push('not started');
  if (t > new Date(c.validUntil).getTime()) errors.push('expired');
  if (t - new Date(c.lastVerifiedAt).getTime() > MAX_VERIFIED_AGE_DAYS * DAY_MS) errors.push('verification stale');
  return errors;
}

// shortcut: etiquetas solo es/en (resto de idiomas cae a en), traducir cuando haya cupones publicados.
const LABELS = {
  es: {
    country: (list) => `Cuenta y envío en: ${list}`,
    userType: { all: 'Válido para todos los usuarios', new: 'Solo cuentas nuevas (primera compra)', existing: 'Solo cuentas con compras previas' },
    minSpend: (v) => `Compra mínima ${v} en productos (sin envío ni impuestos)`,
    noMin: 'Sin compra mínima',
    channel: { app: 'Solo en la app', web: 'Solo en la web', both: 'App y web' },
    validUntil: (d) => `Válido hasta ${d}`,
    maxDiscount: (v) => `Descuento máximo ${v}`,
    once: 'Un código por pedido',
    verified: (d) => `Verificado el ${d}`,
    off: 'de descuento'
  },
  en: {
    country: (list) => `Account & shipping in: ${list}`,
    userType: { all: 'Valid for all users', new: 'New accounts only (first order)', existing: 'Existing customers only' },
    minSpend: (v) => `Minimum ${v} on items (excl. shipping & tax)`,
    noMin: 'No minimum spend',
    channel: { app: 'App only', web: 'Website only', both: 'App & website' },
    validUntil: (d) => `Valid until ${d}`,
    maxDiscount: (v) => `Max discount ${v}`,
    once: 'One code per order',
    verified: (d) => `Verified on ${d}`,
    off: 'off'
  }
};

function money(value, currency, localeCode) {
  try {
    return new Intl.NumberFormat(localeCode, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

function shortDate(iso, localeCode) {
  try {
    return new Date(iso).toLocaleDateString(localeCode, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

const isGlobalTarget = (k) => {
  const norm = String(k || '').toLowerCase().trim();
  return norm === '*' || norm === 'global' || norm === 'all' || norm === 'ww';
};

/** Cupones publicables para un locale, ya con textos de requisitos listos para la UI. */
export function getVerifiedCouponsForLocale(localeConfig, coupons = VERIFIED_COUPONS, now = new Date()) {
  const lang = localeConfig.lang;
  const L = LABELS[lang] || LABELS.en;
  const iso = String(localeConfig.iso || '').toLowerCase();

  return coupons
    .filter((c) => validateCoupon(c, now).length === 0)
    .filter((c) => c.countries.some((k) => isGlobalTarget(k) || k.toLowerCase().trim() === iso))
    .map((c) => {
      const discountLabel = c.discountType === 'percent'
        ? `-${c.discountValue}%`
        : `${money(c.discountValue, c.currency, localeConfig.code)} ${L.off}`;
      const countryText = c.countries.some(isGlobalTarget)
        ? (lang === 'es' ? 'Válido para todos los países admitidos (Global)' : 'Valid in all supported countries (Global)')
        : c.countries.map((k) => k.toUpperCase()).join(', ');

      const requirements = [
        L.country(countryText),
        L.userType[c.userType],
        c.minSpend > 0 ? L.minSpend(money(c.minSpend, c.currency, localeConfig.code)) : L.noMin,
        c.maxDiscount > 0 ? L.maxDiscount(money(c.maxDiscount, c.currency, localeConfig.code)) : null,
        L.channel[c.channel],
        L.once,
        L.validUntil(shortDate(c.validUntil, localeConfig.code))
      ].filter(Boolean);

      return {
        ...c,
        expiresAt: c.validUntil,
        title: c.title?.[lang] || c.title?.en || c.title?.es,
        appliesToText: c.notes?.[lang] || c.notes?.en || c.notes?.es || null,
        discountLabel,
        minSpendLabel: c.minSpend > 0 ? money(c.minSpend, c.currency, localeConfig.code) : L.noMin,
        requirements,
        verifiedLabel: L.verified(shortDate(c.lastVerifiedAt, localeConfig.code))
      };
    });
}
