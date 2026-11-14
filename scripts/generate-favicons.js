import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const BG = [184, 83, 50]; // #B85332
const FG = [252, 249, 244]; // #FCF9F4

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter None
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function sdRoundedBox(px, py, cx, cy, hx, hy, r) {
  const qx = Math.abs(px - cx) - (hx - r);
  const qy = Math.abs(py - cy) - (hy - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

function sampleIconPixel(x, y) {
  // Match public/favicon.svg (viewBox 0 0 64 64)
  if (sdRoundedBox(x, y, 32, 32, 32, 32, 14) > 0) {
    return null;
  }

  // Transform to 24x24 Lucide TicketPercent coordinate space
  const lx = (x - 12) * 0.6;
  const ly = (y - 12) * 0.6;

  const sdTicketRect = sdRoundedBox(lx, ly, 12, 12, 10, 7, 2);
  const sdLeftNotch = Math.hypot(lx - 2, ly - 12) - 3;
  const sdRightNotch = Math.hypot(lx - 22, ly - 12) - 3;
  const sdTicket = Math.max(sdTicketRect, -sdLeftNotch, -sdRightNotch);

  const dOutline = Math.abs(sdTicket) - 1.05;
  const dSlash = sdSegment(lx, ly, 15, 9, 9, 15) - 1.05;
  const dDot1 = Math.hypot(lx - 9, ly - 9) - 1.15;
  const dDot2 = Math.hypot(lx - 15, ly - 15) - 1.15;

  const sdStroke = Math.min(dOutline, dSlash, dDot1, dDot2);
  return sdStroke <= 0 ? FG : BG;
}

function renderCouponIconRgba(size, supersample = 4) {
  const rgba = Buffer.alloc(size * size * 4);
  const invSamples = 1 / (supersample * supersample);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let aSum = 0;

      for (let sy = 0; sy < supersample; sy++) {
        for (let sx = 0; sx < supersample; sx++) {
          const ux = ((px + (sx + 0.5) / supersample) / size) * 64;
          const uy = ((py + (sy + 0.5) / supersample) / size) * 64;
          const rgb = sampleIconPixel(ux, uy);
          if (rgb) {
            rSum += rgb[0];
            gSum += rgb[1];
            bSum += rgb[2];
            aSum += 1;
          }
        }
      }

      const idx = (py * size + px) * 4;
      if (aSum === 0) {
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
      } else {
        rgba[idx] = Math.round(rSum / aSum);
        rgba[idx + 1] = Math.round(gSum / aSum);
        rgba[idx + 2] = Math.round(bSum / aSum);
        rgba[idx + 3] = Math.round(aSum * invSamples * 255);
      }
    }
  }

  return rgba;
}

function buildIcoEntry(size, rgba) {
  const andRowBytes = Math.ceil(size / 32) * 4;
  const andSize = andRowBytes * size;
  const xorSize = size * size * 4;

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(0, 16);
  header.writeUInt32LE(xorSize + andSize, 20);

  const xorData = Buffer.alloc(xorSize);
  const andData = Buffer.alloc(andSize);

  for (let y = 0; y < size; y++) {
    const srcRow = size - 1 - y;
    for (let x = 0; x < size; x++) {
      const srcIdx = (srcRow * size + x) * 4;
      const dstIdx = (y * size + x) * 4;
      xorData[dstIdx] = rgba[srcIdx + 2]; // B
      xorData[dstIdx + 1] = rgba[srcIdx + 1]; // G
      xorData[dstIdx + 2] = rgba[srcIdx]; // R
      xorData[dstIdx + 3] = rgba[srcIdx + 3]; // A

      if (rgba[srcIdx + 3] === 0) {
        const byteIdx = y * andRowBytes + (x >> 3);
        andData[byteIdx] |= 0x80 >> (x & 7);
      }
    }
  }

  return Buffer.concat([header, xorData, andData]);
}

function encodeIco(entries) {
  const count = entries.length;
  const dir = Buffer.alloc(6 + count * 16);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);

  let offset = dir.length;
  entries.forEach((entry, i) => {
    const pos = 6 + i * 16;
    dir[pos] = entry.size >= 256 ? 0 : entry.size;
    dir[pos + 1] = entry.size >= 256 ? 0 : entry.size;
    dir[pos + 2] = 0;
    dir[pos + 3] = 0;
    dir.writeUInt16LE(1, pos + 4);
    dir.writeUInt16LE(32, pos + 6);
    dir.writeUInt32LE(entry.data.length, pos + 8);
    dir.writeUInt32LE(offset, pos + 12);
    offset += entry.data.length;
  });

  return Buffer.concat([dir, ...entries.map((e) => e.data)]);
}

function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const pngSizes = [
    { size: 48, file: 'favicon-48x48.png' },
    { size: 96, file: 'favicon-96x96.png' },
    { size: 180, file: 'apple-touch-icon.png' },
    { size: 192, file: 'favicon-192x192.png' }
  ];

  const renderedBySize = new Map();
  for (const spec of pngSizes) {
    const rgba = renderCouponIconRgba(spec.size, 4);
    renderedBySize.set(spec.size, rgba);
    const pngBuf = encodePng(spec.size, spec.size, rgba);
    fs.writeFileSync(path.join(PUBLIC_DIR, spec.file), pngBuf);
  }

  // Multi-resolution ICO (16x16, 32x32, 48x48)
  const icoEntries = [16, 32, 48].map((size) => {
    const rgba = renderedBySize.get(size) || renderCouponIconRgba(size, 4);
    return { size, data: buildIcoEntry(size, rgba) };
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), encodeIco(icoEntries));

  const manifest = {
    name: 'CuponesTech — Official Verified Promo Codes',
    short_name: 'CuponesTech',
    icons: [
      { src: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { src: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    theme_color: '#B85332',
    background_color: '#F6F2EA',
    display: 'standalone'
  };
  fs.writeFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

  console.log('[Favicons] Generated favicon.ico, PNG sizes (48/96/180/192) and site.webmanifest in public/.');
}

main();
