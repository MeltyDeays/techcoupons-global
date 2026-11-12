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
export async function getAdmitadAccessToken({ clientId, clientSecret, scope = 'coupons' }) {
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
export function signAliExpressRequest(apiName, params, appSecret, signMethod = 'sha256') {
  const sortedKeys = Object.keys(params).sort();
  let baseString = apiName;
  for (const k of sortedKeys) {
    baseString += `${k}${params[k]}`;
  }

  return crypto
    .createHmac(signMethod, appSecret)
    .update(baseString)
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

  const allParams = {
    app_key: String(appKey),
    timestamp: String(timestamp),
    sign_method: signMethod,
    format: 'json',
    v: '2.0',
    ...(trackingId ? { tracking_id: String(trackingId) } : {}),
    ...businessParams
  };

  const signature = signAliExpressRequest(apiName, allParams, appSecret, signMethod);
  allParams.sign = signature;

  const url = new URL(gatewayUrl);
  for (const [k, v] of Object.entries(allParams)) {
    url.searchParams.append(k, String(v));
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
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
  const apiName = '/aliexpress/affiliate/featuredpromo/get';
  const data = await callAliExpressOpenPlatform(apiName, {}, { appKey, appSecret, trackingId });

  const promos = data?.aliexpress_affiliate_featuredpromo_get_response?.resp_result?.result?.promos?.promo || [];
  return Array.isArray(promos) ? promos : [promos].filter(Boolean);
}
