/**
 * RADAR OFICIAL DE CUPONES — ENDPOINT DE SINCRONIZACIÓN PERIÓDICA
 * -------------------------------------------------------------
 * Ejecutado semanalmente vía Vercel Cron o webhook manual autenticado.
 * Consulta las APIs oficiales de Admitad y AliExpress Portals, descarta
 * cupones vencidos y valida las condiciones de uso reales antes de publicarlos.
 */
import { validateCoupon } from '../src/data/verifiedCoupons.js';
import { parseAndValidateFeed } from '../scripts/ingest-coupons.js';
import {
  fetchAdmitadActiveCoupons,
  fetchAliExpressPromos
} from '../src/data/affiliateClients.js';

export default async function handler(req, res) {
  // 1. Verificación de seguridad (Bearer CRON_SECRET o llamada autorizada)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized cron trigger' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    admitad: { status: 'STANDBY', fetched: 0, valid: 0 },
    aliexpress: { status: 'STANDBY', fetched: 0, valid: 0 },
    syncedCoupons: []
  };

  // 2. Conexión Oficial Admitad
  const admitadToken = process.env.ADMITAD_API_TOKEN;
  const admitadClientId = process.env.ADMITAD_CLIENT_ID;
  const admitadClientSecret = process.env.ADMITAD_CLIENT_SECRET;
  const admitadWebsiteId = process.env.ADMITAD_WEBSITE_ID;

  if (admitadToken || (admitadClientId && admitadClientSecret)) {
    try {
      const rawCoupons = await fetchAdmitadActiveCoupons({
        token: admitadToken,
        clientId: admitadClientId,
        clientSecret: admitadClientSecret,
        websiteId: admitadWebsiteId
      });

      const { valid, invalid } = parseAndValidateFeed(rawCoupons, 'admitad');
      results.admitad = {
        status: 'CONNECTED',
        fetched: rawCoupons.length,
        valid: valid.length,
        rejected: invalid.length
      };
      results.syncedCoupons.push(...valid);
    } catch (err) {
      results.admitad = { status: 'ERROR', message: err.message };
    }
  }

  // 3. Conexión Oficial AliExpress Portals
  const aliAppKey = process.env.ALI_APP_KEY;
  const aliAppSecret = process.env.ALI_APP_SECRET;
  const aliTrackingId = process.env.ALI_TRACKING_ID;

  if (aliAppKey && aliAppSecret) {
    try {
      const rawPromos = await fetchAliExpressPromos({
        appKey: aliAppKey,
        appSecret: aliAppSecret,
        trackingId: aliTrackingId
      });

      const { valid, invalid } = parseAndValidateFeed(rawPromos, 'aliexpress');
      results.aliexpress = {
        status: 'CONNECTED',
        fetched: rawPromos.length,
        valid: valid.length,
        rejected: invalid.length
      };
      results.syncedCoupons.push(...valid);
    } catch (err) {
      results.aliexpress = { status: 'ERROR', message: err.message };
    }
  } else if (aliAppKey && !aliAppSecret) {
    results.aliexpress = { status: 'MISSING_SECRET', message: 'Falta ALI_APP_SECRET para firmar requests con HMAC-SHA256' };
  }

  const isConfigured = results.admitad.status === 'CONNECTED' || results.aliexpress.status === 'CONNECTED';

  return res.status(200).json({
    ok: true,
    message: isConfigured
      ? `Sincronización completada con éxito: ${results.syncedCoupons.length} cupones válidos procesados.`
      : 'Radar en standby: esperando credenciales de Admitad (ADMITAD_API_TOKEN o ADMITAD_CLIENT_ID/SECRET) o AliExpress (ALI_APP_KEY + ALI_APP_SECRET).',
    results
  });
}
