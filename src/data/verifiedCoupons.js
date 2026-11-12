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
export const VERIFIED_COUPONS = [];

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
