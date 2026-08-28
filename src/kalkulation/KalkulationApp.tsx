/**
 * KlarWerk Kalkulation — interne Anwendung unter /kalkulation.
 * Eigene App-Shell (ohne Website-Header/-Footer), eigenes Routing,
 * noindex für Suchmaschinen.
 */

import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppShell } from './components/shell';
import { Toaster } from './components/ui';
import './kalkulation.css';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const CustomerDetailPage = lazy(() => import('./pages/CustomerDetailPage'));
const ObjectsPage = lazy(() => import('./pages/ObjectsPage'));
const ObjectDetailPage = lazy(() => import('./pages/ObjectDetailPage'));
const CalculationsPage = lazy(() => import('./pages/CalculationsPage'));
const CalculationWizardPage = lazy(() => import('./pages/CalculationWizardPage'));
const CalculationDetailPage = lazy(() => import('./pages/CalculationDetailPage'));
const QuickCalcPage = lazy(() => import('./pages/QuickCalcPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const PrintOfferPage = lazy(() => import('./pages/PrintOfferPage'));
const PrintInternalPage = lazy(() => import('./pages/PrintInternalPage'));

function Loader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-600" />
    </div>
  );
}

export default function KalkulationApp() {
  return (
    <>
      <Helmet>
        <title>KlarWerk Kalkulation – Intelligente Kalkulation für Gebäudedienstleistungen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Routes>
        {/* Druckansichten ohne App-Shell */}
        <Route
          path="druck/angebot/:id"
          element={
            <Suspense fallback={<Loader />}>
              <PrintOfferPage />
            </Suspense>
          }
        />
        <Route
          path="druck/intern/:id"
          element={
            <Suspense fallback={<Loader />}>
              <PrintInternalPage />
            </Suspense>
          }
        />
        {/* App mit Shell */}
        <Route
          path="*"
          element={
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="kunden" element={<CustomersPage />} />
                  <Route path="kunden/:id" element={<CustomerDetailPage />} />
                  <Route path="objekte" element={<ObjectsPage />} />
                  <Route path="objekte/:id" element={<ObjectDetailPage />} />
                  <Route path="kalkulationen" element={<CalculationsPage />} />
                  <Route path="kalkulationen/neu" element={<CalculationWizardPage />} />
                  <Route path="kalkulationen/:id" element={<CalculationDetailPage />} />
                  <Route path="schnellkalkulation" element={<QuickCalcPage />} />
                  <Route path="bibliothek" element={<LibraryPage />} />
                  <Route path="einstellungen" element={<SettingsPage />} />
                  <Route path="assistent" element={<AssistantPage />} />
                  <Route path="*" element={<Navigate to="/kalkulation" replace />} />
                </Routes>
              </Suspense>
            </AppShell>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}
