import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const CitiesOverview = lazy(() => import('./pages/CitiesOverview'));
const CityPage = lazy(() => import('./pages/CityPage'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Impressum = lazy(() => import('./pages/legal/Impressum'));
const Datenschutz = lazy(() => import('./pages/legal/Datenschutz'));
const AGB = lazy(() => import('./pages/legal/AGB'));
const RechtlicheHinweise = lazy(() => import('./pages/legal/RechtlicheHinweise'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-white/10 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="ueber-uns" element={<About />} />
              <Route path="leistungen" element={<Services />} />
              <Route path="leistungen/:serviceId" element={<ServicePage />} />
              <Route path="einsatzgebiet" element={<CitiesOverview />} />
              <Route path="einsatzgebiet/:citySlug" element={<CityPage />} />
              <Route path="nachhaltigkeit" element={<Sustainability />} />
              <Route path="kontakt" element={<Contact />} />
              <Route path="impressum" element={<Impressum />} />
              <Route path="datenschutz" element={<Datenschutz />} />
              <Route path="agb" element={<AGB />} />
              <Route path="rechtliche-hinweise" element={<RechtlicheHinweise />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}
