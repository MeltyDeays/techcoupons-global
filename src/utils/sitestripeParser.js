/**
 * Parser resiliente de enlaces y fragmentos HTML de AliExpress SiteStripe ("Get link").
 * Soporta URLs directas, URLs relativas al protocolo (//...) y fragmentos <a><img></a>
 * incluyendo atributos href malformados sin comilla de cierre.
 */

const HTML_AMP_RE = /&(?:amp|#38|#x26);/gi;

function decodeUrlEntities(value) {
  return String(value || '').replace(HTML_AMP_RE, '&');
}

export function normalizeProtocolUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  let candidate = decodeUrlEntities(rawUrl).trim();
  if (!candidate) return null;

  // Rechaza espacios internos o caracteres de control en la URL
  if (/[\s\u0000-\u001F]/.test(candidate)) return null;

  if (candidate.startsWith('//')) {
    if (candidate.startsWith('///')) return null;
    candidate = `https:${candidate}`;
  }

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  if (!parsed.hostname || parsed.hostname.startsWith('.')) {
    return null;
  }

  return parsed.toString();
}

function stripSurroundingQuotes(value) {
  return String(value || '')
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();
}

function parseTagAttributesAt(html, startIndex, { breakUrlAttrOnSpace = true } = {}) {
  const attrs = Object.create(null);
  const len = html.length;
  let i = startIndex;

  while (i < len) {
    while (i < len && (/\s/.test(html[i]) || html[i] === '/')) {
      i++;
    }
    if (i >= len || html[i] === '>') {
      if (i < len && html[i] === '>') i++;
      break;
    }

    const nameStart = i;
    while (i < len && !/[\s=/>]/.test(html[i])) {
      i++;
    }
    const attrName = html.slice(nameStart, i).toLowerCase();
    if (!attrName) {
      i++;
      continue;
    }

    while (i < len && /\s/.test(html[i])) {
      i++;
    }

    let attrVal = '';
    let hasValue = false;
    if (i < len && html[i] === '=') {
      hasValue = true;
      i++;
      while (i < len && /\s/.test(html[i])) {
        i++;
      }

      if (i < len && (html[i] === '"' || html[i] === "'")) {
        const quote = html[i];
        i++;
        const valStart = i;
        while (i < len && html[i] !== quote) {
          // Para src/href, si falta la comilla de cierre antes de un espacio/'>' y otro atributo, cortar limpio
          if (breakUrlAttrOnSpace && (attrName === 'src' || attrName === 'href') && /[\s>]/.test(html[i])) {
            break;
          }
          i++;
        }
        attrVal = html.slice(valStart, i);
        if (i < len && html[i] === quote) {
          i++;
        } else if ((i === len || html[i] === '>') && attrVal.endsWith('/')) {
          attrVal = attrVal.slice(0, -1);
        }
      } else {
        const valStart = i;
        while (i < len && !/[\s>]/.test(html[i])) {
          i++;
        }
        attrVal = html.slice(valStart, i);
        if ((i === len || html[i] === '>') && attrVal.endsWith('/')) {
          attrVal = attrVal.slice(0, -1);
        }
      }
    }

    if (hasValue && !Object.prototype.hasOwnProperty.call(attrs, attrName)) {
      attrs[attrName] = attrVal;
    }
  }

  return { attrs, nextIndex: i };
}

export function extractAllTagAttributes(html, tagName, options = {}) {
  if (typeof html !== 'string' || !html) return [];
  const escaped = String(tagName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagStartRe = new RegExp(`<\\s*${escaped}(?=[\\s/>])`, 'gi');
  const results = [];

  let match;
  while ((match = tagStartRe.exec(html)) !== null) {
    const startIdx = match.index + match[0].length;
    const { attrs, nextIndex } = parseTagAttributesAt(html, startIdx, options);
    results.push(attrs);
    tagStartRe.lastIndex = nextIndex;
  }

  return results;
}

export function extractTagAttributes(html, tagName, options = {}) {
  if (typeof html !== 'string' || !html) return null;
  const escaped = String(tagName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagStartRe = new RegExp(`<\\s*${escaped}(?=[\\s/>])`, 'i');
  const match = tagStartRe.exec(html);
  if (!match) return null;
  const { attrs } = parseTagAttributesAt(html, match.index + match[0].length, options);
  return attrs;
}

function extractHrefFromHtml(html) {
  return extractTagAttributes(html, 'a')?.href ?? null;
}

function extractImgSrcFromHtml(html) {
  return extractTagAttributes(html, 'img')?.src ?? null;
}

export function parseTrackingLinkInput(rawInput) {
  if (typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      trackingUrl: null,
      isValid: false,
      error: 'Ingresa el tracking link de afiliado.'
    };
  }

  const trimmed = rawInput.trim();
  let candidate = trimmed;

  if (/<\s*a\b/i.test(trimmed)) {
    const extracted = extractHrefFromHtml(trimmed);
    if (!extracted) {
      return {
        trackingUrl: null,
        isValid: false,
        error: 'No se encontró un atributo href válido en el enlace.'
      };
    }
    candidate = extracted;
  } else {
    candidate = stripSurroundingQuotes(trimmed);
  }

  const trackingUrl = normalizeProtocolUrl(candidate);
  if (!trackingUrl) {
    return {
      trackingUrl: null,
      isValid: false,
      error: 'El tracking link debe ser una URL válida con protocolo http:// o https://.'
    };
  }

  return { trackingUrl, isValid: true };
}

export function parseSiteStripeImageInput(rawInput) {
  if (typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      imageUrl: null,
      extractedTrackingUrl: null,
      isValid: false,
      sourceType: 'empty',
      error: 'Ingresa una URL de imagen o el código HTML de SiteStripe.'
    };
  }

  const trimmed = rawInput.trim();
  const isHtml = /<\s*(?:img|a)\b/i.test(trimmed);

  if (isHtml) {
    const rawHref = extractHrefFromHtml(trimmed);
    const extractedTrackingUrl = rawHref ? normalizeProtocolUrl(rawHref) : null;
    const rawSrc = extractImgSrcFromHtml(trimmed);

    if (!rawSrc) {
      return {
        imageUrl: null,
        extractedTrackingUrl,
        isValid: false,
        sourceType: 'html',
        error: 'No se encontró ninguna etiqueta <img src="..."> válida en el fragmento HTML.'
      };
    }

    const imageUrl = normalizeProtocolUrl(rawSrc);
    if (!imageUrl) {
      return {
        imageUrl: null,
        extractedTrackingUrl,
        isValid: false,
        sourceType: 'html',
        error: 'La URL de imagen extraída no es válida o utiliza un protocolo no permitido.'
      };
    }

    return {
      imageUrl,
      extractedTrackingUrl,
      isValid: true,
      sourceType: 'html'
    };
  }

  const candidate = stripSurroundingQuotes(trimmed);
  const imageUrl = normalizeProtocolUrl(candidate);
  if (!imageUrl) {
    return {
      imageUrl: null,
      extractedTrackingUrl: null,
      isValid: false,
      sourceType: 'url',
      error: 'La URL de imagen debe iniciar con https://, http:// o //.'
    };
  }

  return {
    imageUrl,
    extractedTrackingUrl: null,
    isValid: true,
    sourceType: 'url'
  };
}
