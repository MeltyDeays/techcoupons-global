-- ==============================================================================
-- MIGRACIÓN DE ESQUEMA: CLASIFICACIÓN DE TIPO DE CUPÓN Y ORIGEN DE FUENTE
-- PROYECTO: CuponesTech Global (Supabase PostgreSQL)
-- TABLA: public.cuponestech_coupons
-- FECHA: 2026-11-19
-- ESTADO: PROPUESTA SIN EJECUTAR (Solo lectura; no ejecutada en esta fase)
-- SEGURIDAD: 100% retrocompatible; no altera tablas de CivicReport ni borra datos.
-- ==============================================================================

-- 0. Conteo previo para verificar integridad de filas:
SELECT COUNT(*) AS filas_antes FROM public.cuponestech_coupons;

-- 1. Añadir tipo de alcance del cupón:
--    'cart': Cupón general acumulable en el carrito de compras sobre min_spend.
--    'product': Cupón específico atado a un único artículo / vendedor (promo_code_info).
--    'campaign': Promoción de aterrizaje o descuento de evento sin código de texto.
ALTER TABLE public.cuponestech_coupons
  ADD COLUMN IF NOT EXISTS coupon_scope TEXT NOT NULL DEFAULT 'cart'
  CHECK (coupon_scope IN ('cart', 'product', 'campaign'));

-- 2. Añadir origen oficial verificado:
--    Identifica la fuente exacta de ingesta o auditoría.
ALTER TABLE public.cuponestech_coupons
  ADD COLUMN IF NOT EXISTS source_origin TEXT NOT NULL DEFAULT 'admitad'
  CHECK (source_origin IN ('admitad', 'aliexpress_portal', 'awin', 'cj', 'manual_verificado'));

-- 3. Añadir identificador de producto objetivo (para coupon_scope = 'product'):
--    Si el cupón es de producto, guarda el product_id numérico de AliExpress/Temu.
ALTER TABLE public.cuponestech_coupons
  ADD COLUMN IF NOT EXISTS target_product_id TEXT;

-- 4. Constraint de validación obligatoria (idempotente vía pg_constraint):
--    Garantiza que ningún cupón pueda publicarse sin origen web oficial ni fecha de verificación.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_cuponestech_coupons_verification'
      AND conrelid = 'public.cuponestech_coupons'::regclass
  ) THEN
    ALTER TABLE public.cuponestech_coupons
      ADD CONSTRAINT chk_cuponestech_coupons_verification
      CHECK (
        source_url IS NOT NULL AND source_url <> '' AND
        last_verified_at IS NOT NULL
      );
  END IF;
END $$;

-- 5. Índice de rendimiento para consultas multi-país de carrito (vigencia filtrada en tiempo de ejecución):
CREATE INDEX IF NOT EXISTS idx_cuponestech_coupons_scope_valid_until
  ON public.cuponestech_coupons (coupon_scope, valid_until);

-- Comentarios documentales de columnas en el catálogo de PostgreSQL:
COMMENT ON COLUMN public.cuponestech_coupons.coupon_scope IS 'Alcance de aplicación: cart (carrito global), product (producto específico), campaign (evento)';
COMMENT ON COLUMN public.cuponestech_coupons.source_origin IS 'Origen oficial: admitad, aliexpress_portal, awin, cj, manual_verificado';
COMMENT ON COLUMN public.cuponestech_coupons.target_product_id IS 'ID de producto específico cuando coupon_scope es product';

-- 6. Conteo posterior para comprobar que no se perdieron filas:
SELECT
  COUNT(*) AS filas_despues,
  COUNT(*) FILTER (WHERE coupon_scope = 'cart') AS scope_cart,
  COUNT(*) FILTER (WHERE source_origin = 'admitad') AS origin_admitad
FROM public.cuponestech_coupons;
