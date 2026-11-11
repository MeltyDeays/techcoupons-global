import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootRedirect, MarketCatalogPage, LegalPage } from './App.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { DEFAULT_LOCALE } from './config/locales.js';
import './index.css';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/:locale/admin" element={<AdminDashboard />} />
      <Route path="/:locale" element={<MarketCatalogPage mode="all" />} />
      <Route path="/:locale/temu" element={<MarketCatalogPage mode="temu" />} />
      <Route path="/:locale/aliexpress" element={<MarketCatalogPage mode="aliexpress" />} />
      <Route path="/:locale/category/:slug" element={<MarketCatalogPage mode="category" />} />
      <Route path="/:locale/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/:locale/terms" element={<LegalPage type="terms" />} />
      <Route path="/:locale/about" element={<LegalPage type="about" />} />
      <Route path="/:locale/contact" element={<LegalPage type="contact" />} />
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
