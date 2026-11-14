/**
-- =========================================================================
-- CUPONESTECH GLOBAL - CLIENTE DE BASE DE DATOS SUPABASE / POSTGRESQL
-- =========================================================================
*/
import pg from 'pg';
const { Pool } = pg;

let pool = null;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000
    });
  }
  return pool;
}

/**
 * Consulta cupones activos (valid_until > NOW()) desde la base de datos
 */
export async function getActiveCouponsFromDB({ store = null, country = 'global', category = null, limit = 50 } = {}) {
  const p = getPool();
  if (!p) return [];

  const conditions = ['valid_until > NOW()'];
  const values = [];
  let idx = 1;

  if (store) {
    conditions.push(`store = $${idx++}`);
    values.push(store);
  }

  if (country && country !== 'global') {
    conditions.push(`('global' = ANY(countries) OR $${idx++} = ANY(countries))`);
    values.push(country.toLowerCase());
  }

  if (category) {
    conditions.push(`(category IS NULL OR category = $${idx++})`);
    values.push(category);
  }

  values.push(limit);
  const sql = `
    SELECT * FROM public.cuponestech_coupons
    WHERE ${conditions.join(' AND ')}
    ORDER BY discount_value DESC
    LIMIT $${idx}
  `;

  try {
    const res = await p.query(sql, values);
    return res.rows.map(mapRowToCoupon);
  } catch (err) {
    console.error('Error consultando cupones en BD:', err.message);
    return [];
  }
}

/**
 * Inserta o actualiza un cupón verificado en la base de datos
 */
export async function upsertCouponToDB(c) {
  const p = getPool();
  if (!p) throw new Error('DATABASE_URL no configurada');

  const sql = `
    INSERT INTO public.cuponestech_coupons (
      id, store, code, backup_code, countries, user_type, currency,
      discount_type, discount_value, max_discount, min_spend,
      valid_from, valid_until, channel, source_url, last_verified_at,
      affiliate_url, category, title_es, title_en, notes_es, notes_en,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18, $19, $20, $21, $22,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      code = EXCLUDED.code,
      backup_code = EXCLUDED.backup_code,
      countries = EXCLUDED.countries,
      user_type = EXCLUDED.user_type,
      currency = EXCLUDED.currency,
      discount_type = EXCLUDED.discount_type,
      discount_value = EXCLUDED.discount_value,
      max_discount = EXCLUDED.max_discount,
      min_spend = EXCLUDED.min_spend,
      valid_from = EXCLUDED.valid_from,
      valid_until = EXCLUDED.valid_until,
      channel = EXCLUDED.channel,
      source_url = EXCLUDED.source_url,
      last_verified_at = EXCLUDED.last_verified_at,
      affiliate_url = EXCLUDED.affiliate_url,
      category = EXCLUDED.category,
      title_es = EXCLUDED.title_es,
      title_en = EXCLUDED.title_en,
      notes_es = EXCLUDED.notes_es,
      notes_en = EXCLUDED.notes_en,
      updated_at = NOW()
    RETURNING id;
  `;

  const values = [
    c.id,
    c.store,
    c.code,
    c.backupCode || null,
    Array.isArray(c.countries) ? c.countries : ['global'],
    c.userType || 'all',
    c.currency || 'USD',
    c.discountType || 'fixed',
    c.discountValue || 0,
    c.maxDiscount || null,
    c.minSpend || 0,
    c.validFrom || new Date().toISOString(),
    c.validUntil,
    c.channel || 'both',
    c.sourceUrl || null,
    c.lastVerifiedAt || new Date().toISOString(),
    c.affiliateUrl || null,
    c.category || null,
    typeof c.title === 'object' ? (c.title.es || c.title.en || 'Cupón Oficial') : (c.title || 'Cupón Oficial'),
    typeof c.title === 'object' ? (c.title.en || c.title.es || 'Official Coupon') : (c.title || 'Official Coupon'),
    typeof c.notes === 'object' ? c.notes.es : (c.notes || null),
    typeof c.notes === 'object' ? c.notes.en : (c.notes || null)
  ];

  const res = await p.query(sql, values);
  return res.rows[0];
}

/**
 * Mapea fila SQL al objeto Coupon esperado por el frontend
 */
function mapRowToCoupon(r) {
  return {
    id: r.id,
    store: r.store,
    code: r.code,
    backupCode: r.backup_code,
    countries: r.countries,
    userType: r.user_type,
    currency: r.currency,
    discountType: r.discount_type,
    discountValue: Number(r.discount_value),
    maxDiscount: r.max_discount ? Number(r.max_discount) : null,
    minSpend: Number(r.min_spend),
    validFrom: r.valid_from ? new Date(r.valid_from).toISOString() : '',
    validUntil: r.valid_until ? new Date(r.valid_until).toISOString() : '',
    channel: r.channel,
    sourceUrl: r.source_url,
    lastVerifiedAt: r.last_verified_at ? new Date(r.last_verified_at).toISOString() : '',
    affiliateUrl: r.affiliate_url,
    category: r.category,
    title: { es: r.title_es, en: r.title_en || r.title_es },
    notes: r.notes_es || r.notes_en ? { es: r.notes_es, en: r.notes_en } : undefined
  };
}
