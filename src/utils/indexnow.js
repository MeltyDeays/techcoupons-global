export const INDEXNOW_KEY = 'd84f91a2c3e54b768901f2a3c4d5e6f7';
export const INDEXNOW_HOST = 'cuponestech.tech';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_BATCH = 10000;

/**
 * Envía lotes de URLs al protocolo IndexNow (Bing, Yandex, DuckDuckGo, Yahoo, Ecosia, Naver).
 * @param {string[]} urls Lista absoluta de URLs pertenecientes al host.
 */
export async function submitIndexNow(urls = []) {
  const uniqueUrls = [...new Set(
    (urls || [])
      .map((u) => String(u || '').trim())
      .filter((u) => u.startsWith(`https://${INDEXNOW_HOST}`))
  )];

  if (uniqueUrls.length === 0) {
    return { ok: true, skipped: true, submitted: 0, batches: [] };
  }

  const batches = [];
  let totalSubmitted = 0;
  let allOk = true;

  for (let i = 0; i < uniqueUrls.length; i += MAX_URLS_PER_BATCH) {
    const chunk = uniqueUrls.slice(i, i + MAX_URLS_PER_BATCH);
    try {
      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: INDEXNOW_HOST,
          key: INDEXNOW_KEY,
          keyLocation: INDEXNOW_KEY_LOCATION,
          urlList: chunk
        }),
        signal: AbortSignal.timeout(8000)
      });

      const ok = response.ok || response.status === 200 || response.status === 202;
      if (!ok) allOk = false;
      if (ok) totalSubmitted += chunk.length;

      batches.push({
        count: chunk.length,
        status: response.status,
        ok
      });
    } catch (err) {
      allOk = false;
      batches.push({
        count: chunk.length,
        status: 0,
        ok: false,
        error: err.message
      });
    }
  }

  return {
    ok: allOk,
    submitted: totalSubmitted,
    totalUrls: uniqueUrls.length,
    batches
  };
}
