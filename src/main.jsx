import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootRedirect, MarketCatalogPage, DynamicsPage, GuidesPage, LegalPage } from './App.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { DEFAULT_LOCALE } from './config/locales.js';
import { ROUTE_SLUGS_BY_LANG } from './data/multilingualSections.js';
import './index.css';

const uniqueSlugs = (key) => [
  ...new Set(Object.values(ROUTE_SLUGS_BY_LANG).map((m) => m[key]).filter(Boolean))
];

const DYNAMICS_SLUGS = uniqueSlugs('dynamics');
const GUIDES_SLUGS = uniqueSlugs('guides');
const PRIVACY_SLUGS = uniqueSlugs('privacy');
const TERMS_SLUGS = uniqueSlugs('terms');
const ABOUT_SLUGS = uniqueSlugs('about');
const CONTACT_SLUGS = uniqueSlugs('contact');
const CATEGORY_WORDS = uniqueSlugs('category');

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/:locale/admin" element={<AdminDashboard />} />
      <Route path="/:locale" element={<MarketCatalogPage storeFilter={null} />} />
      <Route path="/:locale/temu" element={<MarketCatalogPage storeFilter="temu" />} />
      <Route path="/:locale/aliexpress" element={<MarketCatalogPage storeFilter="aliexpress" />} />

      {CATEGORY_WORDS.map((catWord) => (
        <React.Fragment key={catWord}>
          <Route path={`/:locale/temu/${catWord}/:slug`} element={<MarketCatalogPage storeFilter="temu" />} />
          <Route path={`/:locale/aliexpress/${catWord}/:slug`} element={<MarketCatalogPage storeFilter="aliexpress" />} />
          <Route path={`/:locale/${catWord}/:slug`} element={<MarketCatalogPage storeFilter={null} />} />
        </React.Fragment>
      ))}

      {DYNAMICS_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<DynamicsPage />} />
      ))}
      {GUIDES_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<GuidesPage />} />
      ))}
      {PRIVACY_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<LegalPage type="privacy" />} />
      ))}
      {TERMS_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<LegalPage type="terms" />} />
      ))}
      {ABOUT_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<LegalPage type="about" />} />
      ))}
      {CONTACT_SLUGS.map((s) => (
        <Route key={s} path={`/:locale/${s}`} element={<LegalPage type="contact" />} />
      ))}

      <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
