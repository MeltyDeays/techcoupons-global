import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { submitIndexNow, INDEXNOW_KEY, INDEXNOW_HOST } from '../src/utils/indexnow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`No existe public/sitemap.xml en ${SITEMAP_PATH}. Ejecuta primero npm run build.`);
  }

  const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = [];
  const locRegex = /<loc>\s*(https?:\/\/[^<\s]+)\s*<\/loc>/gi;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  console.log(`[IndexNow] Enviando ${urls.length} URLs de ${INDEXNOW_HOST} (key ${INDEXNOW_KEY})...`);
  const result = await submitIndexNow(urls);
  console.log('[IndexNow] Resultado:', JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[IndexNow Error]', err);
  process.exitCode = 1;
});
