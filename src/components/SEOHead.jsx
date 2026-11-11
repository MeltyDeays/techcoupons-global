import React, { useEffect } from 'react';
import { LOCALES, BASE_DOMAIN, DEFAULT_LOCALE, buildStructuredData } from '../config/locales.js';

export default function SEOHead({ localeConfig, routeSuffix = '', pageTitle, pageDescription, coupons = [] }) {
  const cleanSuffix = routeSuffix ? (routeSuffix.startsWith('/') ? routeSuffix : `/${routeSuffix}`) : '';
  const canonicalUrl = `${BASE_DOMAIN}/${localeConfig.code}${cleanSuffix}`;
  const title = pageTitle || `${localeConfig.dict.heroTitle} | Temu & AliExpress`;
  const description = pageDescription || localeConfig.dict.heroSubtitle;

  useEffect(() => {
    document.documentElement.lang = localeConfig.code;
    document.documentElement.dir = localeConfig.rtl ? 'rtl' : 'ltr';
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Clean old dynamic hreflang & schema tags
    document.querySelectorAll('link[data-dynamic-hreflang="true"], script[data-dynamic-schema="true"]').forEach((el) => el.remove());

    LOCALES.forEach((loc) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', loc.code);
      link.setAttribute('href', `${BASE_DOMAIN}/${loc.code}${cleanSuffix}`);
      link.setAttribute('data-dynamic-hreflang', 'true');
      document.head.appendChild(link);
    });

    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${BASE_DOMAIN}/${DEFAULT_LOCALE}${cleanSuffix}`);
    xDefault.setAttribute('data-dynamic-hreflang', 'true');
    document.head.appendChild(xDefault);

    const schemas = buildStructuredData(localeConfig, coupons, canonicalUrl);
    schemas.forEach((schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-schema', 'true');
      script.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }, [localeConfig, cleanSuffix, title, description, canonicalUrl, coupons]);

  return null;
}
