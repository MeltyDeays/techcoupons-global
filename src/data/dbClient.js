/**
-- =========================================================================
-- CUPONESTECH GLOBAL - CLIENTE DE BASE DE DATOS SUPABASE / POSTGRESQL
-- =========================================================================
*/
import pg from 'pg';
import { mapDbProductToCatalogDeal } from '../utils/manualCatalog.js';
const { Pool } = pg;

let pool = null;
const ensuredPools = new WeakMap();

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

export function buildActiveCouponsQuery({ store = null, country = 'global', category = null, limit = 50 } = {}) {
  const conditions = ['valid_until > NOW()', "coupon_scope = 'cart'"];
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
  return { sql, values };
}

/**
 * Consulta cupones activos (valid_until > NOW()) desde la base de datos
 */
export async function getActiveCouponsFromDB({ store = null, country = 'global', category = null, limit = 50 } = {}) {
  const p = getPool();
  if (!p) return [];

  const { sql, values } = buildActiveCouponsQuery({ store, country, category, limit });

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
      coupon_scope, source_origin,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18, $19, $20, $21, $22,
      $23, $24,
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
      coupon_scope = EXCLUDED.coupon_scope,
      source_origin = EXCLUDED.source_origin,
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
    typeof c.notes === 'object' ? c.notes.en : (c.notes || null),
    c.couponScope || 'cart',
    c.sourceOrigin || 'admitad'
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

/**
 * Garantiza de forma idempotente y cacheada por pool que existan las tablas de productos y categorías.
 */
export async function ensureProductsSchema(poolOverride = null) {
  const p = poolOverride || getPool();
  if (!p) return false;

  const existing = ensuredPools.get(p);
  if (existing) return existing;

  const promise = (async () => {
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.cuponestech_categories (
        slug VARCHAR(80) PRIMARY KEY,
        label_es TEXT NOT NULL,
        label_en TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.cuponestech_products (
        id VARCHAR(120) PRIMARY KEY,
        product_id VARCHAR(80) NOT NULL,
        store VARCHAR(20) NOT NULL DEFAULT 'aliexpress',
        title TEXT NOT NULL,
        tracking_url TEXT NOT NULL,
        image_url TEXT NOT NULL,
        origin_price VARCHAR(40),
        discount_price VARCHAR(40),
        discount VARCHAR(20),
        currency VARCHAR(10) NOT NULL DEFAULT 'USD',
        category VARCHAR(80) NOT NULL,
        category_label VARCHAR(120),
        countries TEXT[] NOT NULL DEFAULT '{"global"}',
        source_origin VARCHAR(40) NOT NULL DEFAULT 'sitestripe_manual',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_products_active_created
        ON public.cuponestech_products (is_active, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_products_category
        ON public.cuponestech_products (category);
      CREATE INDEX IF NOT EXISTS idx_products_countries
        ON public.cuponestech_products USING GIN (countries);
    `);
    return true;
  })().catch((err) => {
    ensuredPools.delete(p);
    throw err;
  });

  ensuredPools.set(p, promise);
  return promise;
}

export function buildActiveProductsQuery({ category = null, country = null, limit = 100 } = {}) {
  const conditions = ['is_active = true'];
  const values = [];
  let idx = 1;

  if (category) {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  if (country && country !== 'global') {
    conditions.push(`('global' = ANY(countries) OR $${idx++} = ANY(countries))`);
    values.push(country.toLowerCase());
  }

  values.push(limit);
  const sql = `
    SELECT * FROM public.cuponestech_products
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
    LIMIT $${idx}
  `;
  return { sql, values };
}

export async function getActiveProductsFromDB(
  { category = null, country = null, limit = 100 } = {},
  poolOverride = null
) {
  const p = poolOverride || getPool();
  if (!p) return [];

  try {
    await ensureProductsSchema(p);
    const { sql, values } = buildActiveProductsQuery({ category, country, limit });
    const res = await p.query(sql, values);
    return res.rows.map(mapDbProductToCatalogDeal).filter(Boolean);
  } catch (err) {
    console.error('Error consultando productos manuales en BD:', err.message);
    return [];
  }
}

export async function upsertProductToDB(product, poolOverride = null) {
  const p = poolOverride || getPool();
  if (!p) throw new Error('DATABASE_URL no configurada');

  await ensureProductsSchema(p);

  const sql = `
    INSERT INTO public.cuponestech_products (
      id, product_id, store, title, tracking_url, image_url,
      origin_price, discount_price, discount, currency,
      category, category_label, countries, source_origin,
      is_active, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13, $14,
      true, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      product_id = EXCLUDED.product_id,
      store = EXCLUDED.store,
      title = EXCLUDED.title,
      tracking_url = EXCLUDED.tracking_url,
      image_url = EXCLUDED.image_url,
      origin_price = EXCLUDED.origin_price,
      discount_price = EXCLUDED.discount_price,
      discount = EXCLUDED.discount,
      currency = EXCLUDED.currency,
      category = EXCLUDED.category,
      category_label = EXCLUDED.category_label,
      countries = EXCLUDED.countries,
      source_origin = EXCLUDED.source_origin,
      is_active = true,
      updated_at = NOW()
    RETURNING *;
  `;

  const values = [
    product.id,
    product.productId || product.id,
    product.store || 'aliexpress',
    product.title,
    product.trackingUrl,
    product.imageUrl,
    product.originPrice || '',
    product.discountPrice || '',
    product.discount || '',
    product.currency || 'USD',
    product.category,
    product.categoryLabel || product.category,
    Array.isArray(product.countries) && product.countries.length ? product.countries : ['global'],
    product.sourceOrigin || 'sitestripe_manual'
  ];

  const res = await p.query(sql, values);
  return mapDbProductToCatalogDeal(res.rows[0]);
}

export async function deleteProductFromDB(id, poolOverride = null) {
  const p = poolOverride || getPool();
  if (!p) throw new Error('DATABASE_URL no configurada');

  await ensureProductsSchema(p);
  const res = await p.query(
    `UPDATE public.cuponestech_products
     SET is_active = false, updated_at = NOW()
     WHERE id = $1 OR product_id = $1
     RETURNING id`,
    [String(id)]
  );
  return res.rows[0] || null;
}

export async function getCustomCategoriesFromDB(poolOverride = null) {
  const p = poolOverride || getPool();
  if (!p) return [];

  try {
    await ensureProductsSchema(p);
    const res = await p.query(
      `SELECT slug, label_es, label_en, created_at
       FROM public.cuponestech_categories
       ORDER BY created_at ASC`
    );
    return res.rows.map((r) => ({
      slug: r.slug,
      label: r.label_es,
      labelEs: r.label_es,
      labelEn: r.label_en || r.label_es
    }));
  } catch (err) {
    console.error('Error consultando categorías en BD:', err.message);
    return [];
  }
}

export async function upsertCategoryToDB({ slug, labelEs, labelEn = null }, poolOverride = null) {
  const p = poolOverride || getPool();
  if (!p) throw new Error('DATABASE_URL no configurada');

  await ensureProductsSchema(p);
  const res = await p.query(
    `INSERT INTO public.cuponestech_categories (slug, label_es, label_en, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (slug) DO UPDATE SET
       label_es = EXCLUDED.label_es,
       label_en = COALESCE(EXCLUDED.label_en, public.cuponestech_categories.label_en),
       updated_at = NOW()
     RETURNING slug, label_es, label_en`,
    [slug, labelEs, labelEn || labelEs]
  );
  const row = res.rows[0];
  return row ? { slug: row.slug, label: row.label_es, labelEs: row.label_es, labelEn: row.label_en } : null;
}
