import { useEffect } from 'react';
import {
  LOCALES,
  BASE_DOMAIN,
  DEFAULT_LOCALE,
  getLocaleConfig,
  buildStructuredData,
  buildRouteSeoMeta
} from '../config/locales.js';
import { translatePathToLocale } from '../data/multilingualSections.js';

function setMetaTag(attrKey, attrValue, content, dataFlag = null) {
  let el = document.head.querySelector(`meta[${attrKey}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrKey, attrValue);
    document.head.appendChild(el);
  }
  if (dataFlag) el.setAttribute(dataFlag, 'true');
  el.setAttribute('content', content);
}

export default function SEOHead({ localeConfig, route = null, routeSuffix = '', pageTitle, pageDescription, coupons = [], isRoot = false }) {
  const cleanSuffix = routeSuffix ? (routeSuffix.startsWith('/') ? routeSuffix : `/${routeSuffix}`) : '';
  const currentPath = isRoot ? '/' : `/${localeConfig.code}${cleanSuffix}`;
  const canonicalUrl = `${BASE_DOMAIN}${currentPath}`;
  const resolvedRoute = route || { type: cleanSuffix.replace(/^\//, '') || 'home', storeFilter: null, slug: null };
  const routeType = resolvedRoute.type || 'home';
  const routeStore = resolvedRoute.storeFilter || null;
  const routeSlug = resolvedRoute.slug || null;
  const seoMeta = buildRouteSeoMeta(localeConfig, { type: routeType, storeFilter: routeStore, slug: routeSlug });
  const title = pageTitle || seoMeta.title;
  const description = pageDescription || seoMeta.description;

  useEffect(() => {
    document.documentElement.lang = localeConfig.code;
    document.documentElement.dir = localeConfig.rtl ? 'rtl' : 'ltr';
    document.title = title;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', seoMeta.keywords, 'data-dynamic-meta');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setMetaTag('property', 'og:type', 'website', 'data-dynamic-og');
    setMetaTag('property', 'og:site_name', 'CuponesTech', 'data-dynamic-og');
    setMetaTag('property', 'og:title', title, 'data-dynamic-og');
    setMetaTag('property', 'og:description', description, 'data-dynamic-og');
    setMetaTag('property', 'og:url', canonicalUrl, 'data-dynamic-og');
    setMetaTag('property', 'og:image', `${BASE_DOMAIN}/favicon-192x192.png`, 'data-dynamic-og');
    setMetaTag('property', 'og:locale', seoMeta.ogLocale, 'data-dynamic-og');
    setMetaTag('name', 'twitter:card', 'summary', 'data-dynamic-og');
    setMetaTag('name', 'twitter:title', title, 'data-dynamic-og');
    setMetaTag('name', 'twitter:description', description, 'data-dynamic-og');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    document.querySelectorAll('link[data-dynamic-hreflang="true"], script[data-dynamic-schema="true"]').forEach((el) => el.remove());

    LOCALES.forEach((loc) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', loc.code);
      link.setAttribute('href', `${BASE_DOMAIN}${translatePathToLocale(currentPath, loc)}`);
      link.setAttribute('data-dynamic-hreflang', 'true');
      document.head.appendChild(link);
    });

    const xDefaultLoc = getLocaleConfig(DEFAULT_LOCALE);
    const xDefaultHref = routeType === 'home' && !routeStore && !routeSlug
      ? `${BASE_DOMAIN}/`
      : `${BASE_DOMAIN}${translatePathToLocale(currentPath, xDefaultLoc)}`;
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', xDefaultHref);
    xDefault.setAttribute('data-dynamic-hreflang', 'true');
    document.head.appendChild(xDefault);

    const schemas = buildStructuredData(localeConfig, coupons, canonicalUrl, { type: routeType, storeFilter: routeStore, slug: routeSlug });
    schemas.forEach((schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-schema', 'true');
      script.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }, [localeConfig.code, routeType, routeStore, routeSlug, cleanSuffix, currentPath, title, description, seoMeta.keywords, seoMeta.ogLocale, canonicalUrl, coupons.length, isRoot]);

  return null;
}
