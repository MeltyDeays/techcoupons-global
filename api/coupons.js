/**
 * ENDPOINT DE CONSULTA DE CUPONES VERIFICADOS
 * -------------------------------------------
 * Provee cupones reales y vigentes con caché de borde (CDN)
 * para alimentar la plataforma en tiempo real.
 */
import { getCouponsForLocale } from '../src/data/couponsGenerator.js';
import { getLocaleConfig, DEFAULT_LOCALE } from '../src/config/locales.js';
import { getActiveCouponsFromDB } from '../src/data/dbClient.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { locale = DEFAULT_LOCALE, store = null, category = null } = req.query || {};

  try {
    const localeConfig = getLocaleConfig(locale);
    
    // 1. Consultar base de datos temporal (PostgreSQL / Supabase)
    let coupons = await getActiveCouponsFromDB({
      store: store || null,
      country: localeConfig.iso || 'global',
      category: category || null
    });

    // 2. Si la base de datos aún no tiene registros, usar generador verificado
    if (!coupons || coupons.length === 0) {
      coupons = getCouponsForLocale(localeConfig.code, {
        storeFilter: store || null,
        categoryFilter: category || null
      });
    }

    return res.status(200).json({
      ok: true,
      locale: localeConfig.code,
      country: localeConfig.countryName,
      total: coupons.length,
      coupons
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
