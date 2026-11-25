/**
 * ENDPOINT CRUD DE PRODUCTOS MANUALES ALIEXPRESS (SITESTRIPE) Y CATEGORÍAS
 * -------------------------------------------------------------------------
 * GET    /api/products        -> Lista productos manuales activos y categorías personalizadas
 * POST   /api/products        -> Valida SiteStripe, crea categoría si es nueva y guarda producto
 * DELETE /api/products?id=... -> Desactiva producto manual por ID
 */
import {
  getActiveProductsFromDB,
  upsertProductToDB,
  deleteProductFromDB,
  getCustomCategoriesFromDB,
  upsertCategoryToDB
} from '../src/data/dbClient.js';
import { normalizeManualProductPayload } from '../src/utils/manualCatalog.js';
import {
  isAuthorizedWithAdminSecret,
  isAdminSecretMissingInProd,
  applyValidatedCorsHeaders
} from './_adminAuth.js';

export function isAuthorizedAdminRequest(req) {
  return isAuthorizedWithAdminSecret(req);
}

function parseJsonBody(rawBody) {
  if (!rawBody) return {};
  if (typeof rawBody === 'object') return rawBody;
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }
  return {};
}

export function createProductsHandler(deps = {}) {
  const getProducts = deps.getActiveProductsFromDB || getActiveProductsFromDB;
  const upsertProduct = deps.upsertProductToDB || upsertProductToDB;
  const deleteProduct = deps.deleteProductFromDB || deleteProductFromDB;
  const getCategories = deps.getCustomCategoriesFromDB || getCustomCategoriesFromDB;
  const upsertCategory = deps.upsertCategoryToDB || upsertCategoryToDB;
  const isDbConfigured = deps.isDbConfigured || (() => Boolean(process.env.DATABASE_URL));

  return async function handler(req, res) {
    applyValidatedCorsHeaders(req, res, {
      methods: 'GET, POST, DELETE, OPTIONS',
      cacheControl: 'no-store, max-age=0'
    });

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const dbConfigured = Boolean(isDbConfigured());

    if (req.method === 'GET') {
      try {
        const { category = null, country = null, limit = 100 } = req.query || {};
        const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 300);
        const [products, categories] = await Promise.all([
          getProducts({ category: category || null, country: country || null, limit: parsedLimit }),
          getCategories()
        ]);
        return res.status(200).json({
          ok: true,
          dbConfigured,
          products,
          categories
        });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    if (req.method === 'POST') {
      if (isAdminSecretMissingInProd()) {
        return res.status(503).json({
          ok: false,
          error: 'ADMIN_SECRET no está configurado en el servidor de producción.'
        });
      }
      if (!isAuthorizedAdminRequest(req)) {
        return res.status(401).json({ ok: false, error: 'No autorizado. Verifica el ADMIN_SECRET.' });
      }
      if (!dbConfigured) {
        return res.status(503).json({
          ok: false,
          error: 'DATABASE_URL no está configurada en el servidor para persistir productos.'
        });
      }

      const body = parseJsonBody(req.body);
      if (body === null) {
        return res.status(400).json({ ok: false, error: 'JSON inválido en el cuerpo de la solicitud.' });
      }

      const normalized = normalizeManualProductPayload(body);
      if (!normalized.ok) {
        return res.status(400).json({
          ok: false,
          error: normalized.errors.join(' '),
          errors: normalized.errors
        });
      }

      try {
        let savedCategory = normalized.category;
        if (normalized.category.isCustom) {
          const upsertedCat = await upsertCategory({
            slug: normalized.category.slug,
            labelEs: normalized.category.label,
            labelEn: normalized.category.label
          });
          if (upsertedCat) {
            savedCategory = { ...upsertedCat, isCustom: true };
          }
        }

        const savedProduct = await upsertProduct(normalized.product);
        return res.status(201).json({
          ok: true,
          product: savedProduct,
          category: savedCategory
        });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    if (req.method === 'DELETE') {
      if (isAdminSecretMissingInProd()) {
        return res.status(503).json({
          ok: false,
          error: 'ADMIN_SECRET no está configurado en el servidor de producción.'
        });
      }
      if (!isAuthorizedAdminRequest(req)) {
        return res.status(401).json({ ok: false, error: 'No autorizado. Verifica el ADMIN_SECRET.' });
      }
      if (!dbConfigured) {
        return res.status(503).json({
          ok: false,
          error: 'DATABASE_URL no está configurada en el servidor.'
        });
      }

      const body = parseJsonBody(req.body) || {};
      const id = String(req.query?.id || body?.id || '').trim();
      if (!id) {
        return res.status(400).json({ ok: false, error: 'Falta el parámetro id del producto.' });
      }

      try {
        const deleted = await deleteProduct(id);
        if (!deleted) {
          return res.status(404).json({ ok: false, error: 'Producto no encontrado.' });
        }
        return res.status(200).json({ ok: true, id: deleted.id });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    return res.status(405).json({ ok: false, error: `Método ${req.method} no permitido.` });
  };
}

export default createProductsHandler();
