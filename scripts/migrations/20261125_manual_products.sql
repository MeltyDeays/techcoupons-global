-- =========================================================================
-- MIGRACIÓN IDEMPOTENTE: PRODUCTOS MANUALES ALIEXPRESS (SITESTRIPE)
-- Fecha: 2026-11-25
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
