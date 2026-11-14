/**
 * CLIENTES OFICIALES DE APIS DE AFILIADOS (Admitad & AliExpress Portals)
 * ---------------------------------------------------------------------
 * Implementación de bajo nivel para conectarse directamente a las APIs
 * oficiales en cuanto se disponga de las credenciales, sin librerías externas.
 */
import crypto from 'crypto';

/**
 * ADMITAD API CLIENT
 * Soporta tanto token directo (Bearer) como flujo OAuth2 automático
 * (client_id + client_secret -> https://api.admitad.com/token/)
 */
export async function getAdmitadAccessToken({
  clientId,
  clientSecret,
  scope = 'coupons coupons_for_website advcampaigns advcampaigns_for_website'
}) {
  if (!clientId || !clientSecret) return null;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    scope
  });

  const res = await fetch('https://api.admitad.com/token/', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Admitad OAuth2 error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function fetchAdmitadActiveCoupons({ token, clientId, clientSecret, websiteId, limit = 100 }) {
  let activeToken = token;
  if (!activeToken && clientId && clientSecret) {
    activeToken = await getAdmitadAccessToken({ clientId, clientSecret });
  }

  if (!activeToken) {
    throw new Error('Falta ADMITAD_API_TOKEN o (ADMITAD_CLIENT_ID + ADMITAD_CLIENT_SECRET)');
  }

  const endpoint = websiteId
    ? `https://api.admitad.com/coupons/website/${websiteId}/?limit=${limit}&status=active`
    : `https://api.admitad.com/coupons/?limit=${limit}&status=active`;

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${activeToken}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Admitad API error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  return json.results || [];
}

/**
 * ALIEXPRESS PORTALS (OPEN PLATFORM) API CLIENT
 * Firma HMAC-SHA256 estándar del protocolo TOP / IOP de AliExpress.
 * Gateway oficial: https://api-sg.aliexpress.com/sync
 */
export function signAliExpressRequest(arg1, arg2, arg3, arg4 = 'sha256') {
  let apiName = '';
  let params = {};
  let appSecret = '';
  let signMethod = 'sha256';

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    apiName = arg1;
    params = arg2;
    appSecret = arg3;
    signMethod = arg4 || 'sha256';
  } else if (typeof arg1 === 'object') {
    params = arg1;
    appSecret = arg2;
    signMethod = arg3 || 'sha256';
  }

  const allParams = { ...params };
  if (apiName && !allParams.method) {
    allParams.method = apiName.replace(/^\//, '').replace(/\//g, '.');
  }

  const sortedKeys = Object.keys(allParams).sort();
  let baseString = '';
  for (const k of sortedKeys) {
    baseString += `${k}${allParams[k]}`;
  }

  return crypto
    .createHmac(signMethod, appSecret)
    .update(baseString, 'utf-8')
    .digest('hex')
    .toUpperCase();
}

export async function callAliExpressOpenPlatform(apiName, businessParams, { appKey, appSecret, trackingId }) {
  if (!appKey || !appSecret) {
    throw new Error('Falta ALI_APP_KEY o ALI_APP_SECRET');
  }

  const gatewayUrl = 'https://api-sg.aliexpress.com/sync';
  const timestamp = Date.now();
  const signMethod = 'sha256';
  const normalizedMethod = apiName.replace(/^\//, '').replace(/\//g, '.');

  const allParams = {
    method: normalizedMethod,
    app_key: String(appKey),
    timestamp: String(timestamp),
    sign_method: signMethod,
    format: 'json',
    v: '2.0',
    ...(trackingId ? { tracking_id: String(trackingId) } : {}),
    ...businessParams
  };

  const signature = signAliExpressRequest(allParams, appSecret, signMethod);
  allParams.sign = signature;

  const formBody = new URLSearchParams(allParams).toString();

  const res = await fetch(gatewayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: formBody
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AliExpress Gateway error (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Consulta de promociones destacadas en AliExpress Portals
 */
export async function fetchAliExpressPromos({ appKey, appSecret, trackingId }) {
  const apiName = 'aliexpress.affiliate.featuredpromo.get';
  const data = await callAliExpressOpenPlatform(apiName, {}, { appKey, appSecret, trackingId });

  const promos = data?.aliexpress_affiliate_featuredpromo_get_response?.resp_result?.result?.promos?.promo || [];
  return Array.isArray(promos) ? promos : [promos].filter(Boolean);
}

/**
 * Convierte una URL estándar en enlace de afiliado oficial (s.click.aliexpress.com)
 */
export async function generateAliExpressTrackingLink({ targetUrl = 'https://www.aliexpress.com', appKey, appSecret, trackingId = 'default' }) {
  const data = await callAliExpressOpenPlatform('aliexpress.affiliate.link.generate', {
    promotion_link_type: '0',
    source_values: targetUrl,
    tracking_id: trackingId
  }, { appKey, appSecret, trackingId });

  const link = data?.aliexpress_affiliate_link_generate_response?.resp_result?.result?.promotion_links?.promotion_link?.[0]?.promotion_link;
  return link || targetUrl;
}
