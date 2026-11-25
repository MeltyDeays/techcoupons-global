-- =========================================================================
-- CUPONESTECH GLOBAL - ESQUEMA DE BASE DE DATOS TEMPORAL DE CUPONES
-- Sincronizado localmente con Supabase PostgreSQL
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.cuponestech_coupons (
  id VARCHAR(100) PRIMARY KEY,
  store VARCHAR(20) NOT NULL CHECK (store IN ('aliexpress', 'temu')),
  code VARCHAR(50) NOT NULL,
  backup_code VARCHAR(50),
  countries TEXT[] NOT NULL DEFAULT '{"global"}',
  user_type VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (user_type IN ('all', 'new', 'existing')),
  currency VARCHAR(5) NOT NULL DEFAULT 'USD',
  discount_type VARCHAR(10) NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percent')),
  discount_value NUMERIC(10, 2) NOT NULL,
  max_discount NUMERIC(10, 2),
  min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  channel VARCHAR(10) NOT NULL DEFAULT 'both' CHECK (channel IN ('app', 'web', 'both')),
  source_url TEXT,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  affiliate_url TEXT,
  category VARCHAR(50),
  title_es TEXT NOT NULL,
  title_en TEXT,
  notes_es TEXT,
  notes_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de alta velocidad para consultas en borde
CREATE INDEX IF NOT EXISTS idx_coupons_store_valid 
  ON public.cuponestech_coupons (store, valid_until DESC);

CREATE INDEX IF NOT EXISTS idx_coupons_countries 
  ON public.cuponestech_coupons USING GIN (countries);

-- Row Level Security (RLS)
ALTER TABLE public.cuponestech_coupons ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cuponestech_coupons' 
    AND policyname = 'Public Read Active Coupons'
  ) THEN
    CREATE POLICY "Public Read Active Coupons" 
      ON public.cuponestech_coupons 
      FOR SELECT 
      USING (valid_until > NOW());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cuponestech_coupons' 
    AND policyname = 'Admin Full Access'
  ) THEN
    CREATE POLICY "Admin Full Access" 
      ON public.cuponestech_coupons 
      FOR ALL 
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- =========================================================================
-- PRODUCTOS MANUALES ALIEXPRESS (SITESTRIPE) Y CATEGORÍAS PERSONALIZADAS
-- =========================================================================

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

ALTER TABLE public.cuponestech_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuponestech_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cuponestech_categories'
    AND policyname = 'Public Read Categories'
  ) THEN
    CREATE POLICY "Public Read Categories"
      ON public.cuponestech_categories
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cuponestech_categories'
    AND policyname = 'Admin Full Access Categories'
  ) THEN
    CREATE POLICY "Admin Full Access Categories"
      ON public.cuponestech_categories
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cuponestech_products'
    AND policyname = 'Public Read Active Products'
  ) THEN
    CREATE POLICY "Public Read Active Products"
      ON public.cuponestech_products
      FOR SELECT
      USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cuponestech_products'
    AND policyname = 'Admin Full Access Products'
  ) THEN
    CREATE POLICY "Admin Full Access Products"
      ON public.cuponestech_products
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
