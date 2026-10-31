import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="bg-paper-100 min-h-[70vh] flex items-center justify-center">
      <SEO
        title="Seite nicht gefunden"
        description="Die angeforderte Seite wurde nicht gefunden. Kehren Sie zur Startseite von KlarWerk Service zurück oder kontaktieren Sie uns für Gebäudereinigung und Gebäudeservice."
        canonicalPath="/404"
        noindex
      />
      <div className="klw-auftritt-kurz text-center px-6 max-w-lg">
        <span className="text-8xl font-black text-slate-100 leading-none block">404</span>
        <h1 className="mt-4 text-3xl font-black text-white tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="mt-3 text-slate-400 leading-relaxed">
          Die angeforderte Seite existiert leider nicht. Möglicherweise wurde sie verschoben oder gelöscht.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary text-sm px-6 py-3">
            <Home size={16} />
            Zur Startseite
          </Link>
          <Link to="/kontakt" className="btn-secondary text-sm px-6 py-3">
            Kontakt aufnehmen
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
