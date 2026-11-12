import { getLocaleConfig } from '../config/locales.js';
import { AFFILIATE_CONFIG } from '../config/affiliateConfig.js';
import { getVerifiedCouponsForLocale, VERIFIED_COUPONS } from './verifiedCoupons.js';

const OFFICIAL_STORE_URL = {
  temu: 'https://www.temu.com',
  aliexpress: 'https://www.aliexpress.com'
};

/**
 * Catálogo público: solo cupones de VERIFIED_COUPONS que pasan validación
 * (vigentes, verificados recientemente y del país del locale).
 */
export function getCouponsForLocale(
  localeCode,
  { storeFilter = null, categoryFilter = null, onlyEvent1111 = false } = {},
  { coupons = VERIFIED_COUPONS, now = new Date() } = {}
) {
  const localeConfig = getLocaleConfig(localeCode);
  const availableStores = localeConfig.stores || ['temu', 'aliexpress'];

  return getVerifiedCouponsForLocale(localeConfig, coupons, now)
    .filter((c) => {
      if (!availableStores.includes(c.store)) return false;
      if (storeFilter && c.store !== storeFilter) return false;
      // category null = válido en todo el carrito → aparece en todas las categorías
      if (categoryFilter && c.category && c.category !== categoryFilter) return false;
      if (onlyEvent1111 && !c.eventId) return false;
      return true;
    })
    .map((c) => {
      const configured = c.store === 'temu'
        ? AFFILIATE_CONFIG.temuBaseTrackingUrl
        : AFFILIATE_CONFIG.aliexpressBaseTrackingUrl;
      return {
        ...c,
        categoryLabel: c.category ? (localeConfig.dict.categories?.[c.category] || c.category) : null,
        currencyCode: c.currency,
        numericPrice: c.discountValue,
        affiliateLink: c.affiliateUrl || configured || OFFICIAL_STORE_URL[c.store]
      };
    });
}
