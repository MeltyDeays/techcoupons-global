import { useEffect } from 'react';
import {
  BASE_DOMAIN,
  buildStructuredData,
  buildRouteSeoMeta,
  resolveRouteSeoPolicy,
  getRouteSuffixForLocale
} from '../config/locales.js';

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

export default function SEOHead({
  localeConfig,
  route = null,
  routeSuffix = '',
  pageTitle,
  pageDescription,
  coupons = [],
  offersCount = 0,
  indexableLocales = null,
  isRoot = false
}) {
  const cleanSuffix = routeSuffix ? (routeSuffix.startsWith('/') ? routeSuffix : `/${routeSuffix}`) : '';
  const resolvedRoute = route || { type: cleanSuffix.replace(/^\//, '') || 'home', storeFilter: null, slug: null };
  const routeType = resolvedRoute.type || 'home';
  const routeStore = resolvedRoute.storeFilter || null;
  const routeSlug = resolvedRoute.slug || null;

  const ssrData = typeof window !== 'undefined' ? window.__SSR_COUPONS__ : null;
  const ssrMatchesRoute = Boolean(
    ssrData &&
    ssrData.locale === localeConfig.code &&
    (ssrData.storeFilter || null) === routeStore &&
    (ssrData.categoryFilter || null) === (routeType === 'category' ? routeSlug : null)
  );
  const resolvedIndexableLocales = indexableLocales ?? (
    ssrMatchesRoute && Array.isArray(ssrData.indexableLocales) ? ssrData.indexableLocales : null
  );

  const policy = resolveRouteSeoPolicy(
    localeConfig,
    { type: routeType, storeFilter: routeStore, slug: routeSlug },
    { coupons, offersCount, isRoot, indexableLocales: resolvedIndexableLocales }
  );
  const canonicalUrl = policy.canonicalUrl;
  const hreflangCodesKey = policy.emitHreflang
    ? policy.hreflangLocales.map((l) => l.code).join(',')
    : '';

  const seoMeta = buildRouteSeoMeta(localeConfig, { type: routeType, storeFilter: routeStore, slug: routeSlug });
  const title = pageTitle || seoMeta.title;
  const description = pageDescription || seoMeta.description;

  useEffect(() => {
    document.documentElement.lang = localeConfig.code;
    document.documentElement.dir = localeConfig.rtl ? 'rtl' : 'ltr';
    document.title = title;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', seoMeta.keywords, 'data-dynamic-meta');
    setMetaTag('name', 'robots', policy.robotsContent);

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

    document
      .querySelectorAll('link[rel="alternate"][hreflang], link[data-dynamic-hreflang="true"], script[data-dynamic-schema="true"]')
      .forEach((el) => el.remove());

    if (policy.emitHreflang) {
      policy.hreflangLocales.forEach((loc) => {
        const altSuffix = getRouteSuffixForLocale({ type: routeType, storeFilter: routeStore, slug: routeSlug }, loc);
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', loc.code);
        link.setAttribute('href', `${BASE_DOMAIN}/${loc.code}${altSuffix}`);
        link.setAttribute('data-dynamic-hreflang', 'true');
        document.head.appendChild(link);
      });

      if (policy.xDefaultHref) {
        const xDefault = document.createElement('link');
        xDefault.setAttribute('rel', 'alternate');
        xDefault.setAttribute('hreflang', 'x-default');
        xDefault.setAttribute('href', policy.xDefaultHref);
        xDefault.setAttribute('data-dynamic-hreflang', 'true');
        document.head.appendChild(xDefault);
      }
    }

    const schemas = buildStructuredData(localeConfig, coupons, canonicalUrl, { type: routeType, storeFilter: routeStore, slug: routeSlug });
    schemas.forEach((schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-schema', 'true');
      script.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }, [
    localeConfig.code,
    routeType,
    routeStore,
    routeSlug,
    cleanSuffix,
    title,
    description,
    seoMeta.keywords,
    seoMeta.ogLocale,
    canonicalUrl,
    policy.robotsContent,
    policy.emitHreflang,
    policy.xDefaultHref,
    hreflangCodesKey,
    coupons.length,
    offersCount,
    isRoot
  ]);

  return null;
}
