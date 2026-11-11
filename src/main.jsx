import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootRedirect, MarketCatalogPage, DynamicsPage, GuidesPage, LegalPage } from './App.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { DEFAULT_LOCALE } from './config/locales.js';
import './index.css';

const DYNAMICS_SLUGS = ['dynamics', 'dinamicas', 'dynamiques', 'minispiele', 'dinamiche'];
const GUIDES_SLUGS = ['guides', 'guias', 'ratgeber', 'guide'];
const PRIVACY_SLUGS = ['privacy', 'privacidad', 'privacidade', 'confidentialite', 'datenschutz'];
const TERMS_SLUGS = ['terms', 'terminos', 'termos', 'conditions', 'bedingungen', 'termini'];
const ABOUT_SLUGS = ['about', 'nosotros', 'sobre', 'a-propos', 'ueber-uns', 'chi-siamo'];
const CONTACT_SLUGS = ['contact', 'contacto', 'contato', 'kontakt', 'contatti'];

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/:locale/admin" element={<AdminDashboard />} />
      <Route path="/:locale" element={<MarketCatalogPage storeFilter={null} />} />
      <Route path="/:locale/temu" element={<MarketCatalogPage storeFilter="temu" />} />
      <Route path="/:locale/temu/category/:slug" element={<MarketCatalogPage storeFilter="temu" />} />
      <Route path="/:locale/aliexpress" element={<MarketCatalogPage storeFilter="aliexpress" />} />
      <Route path="/:locale/aliexpress/category/:slug" element={<MarketCatalogPage storeFilter="aliexpress" />} />
      <Route path="/:locale/category/:slug" element={<MarketCatalogPage storeFilter={null} />} />

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
