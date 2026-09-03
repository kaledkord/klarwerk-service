/** Druckansicht Kundenangebot (PDF über den Browser-Druckdialog). */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Printer, X } from 'lucide-react';
import { useKwStore } from '../lib/store';
import { useCalcResults } from '../components/domain';
import { OfferDocument } from '../components/calc/OfferDocument';
import '../kalkulation.css';

export default function PrintOfferPage() {
  const { id } = useParams<{ id: string }>();
  const data = useKwStore((st) => st.data);
  const calc = data.calculations.find((c) => c.id === id);
  const results = useCalcResults(calc);
  const customer = data.customers.find((c) => c.id === calc?.customerId);
  const object = data.objects.find((o) => o.id === calc?.objectId);

  useEffect(() => {
    document.title = calc?.offer ? `Angebot ${calc.offer.offerNumber} – ${calc.name}` : 'Angebot';
  }, [calc]);

  if (!calc || !results || !calc.offer) {
    return (
      <div className="kw-app min-h-screen flex items-center justify-center text-sm text-slate-500">
        Kein Angebot vorhanden — bitte zuerst im Kalkulations-Workspace ein Angebot erstellen.
      </div>
    );
  }

  return (
    <div className="kw-app min-h-screen bg-slate-200 print:bg-white">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="kw-no-print sticky top-0 z-10 flex items-center justify-center gap-2 border-b border-slate-300 bg-white/90 backdrop-blur px-4 py-2.5">
        <p className="text-xs text-slate-500 mr-2">
          Kundenansicht — ohne interne Kosten. Über „Drucken“ als PDF speichern (Ziel: „Als PDF speichern“).
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="kw-press inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          <Printer size={13} /> Drucken / PDF
        </button>
        <button
          type="button"
          onClick={() => window.close()}
          className="kw-press inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600"
        >
          <X size={13} /> Schließen
        </button>
      </div>
      <div className="py-6 print:py-0">
        <div className="mx-auto max-w-[210mm] bg-white shadow-glass-lg print:shadow-none">
          <OfferDocument calc={calc} totals={results.totals} offer={calc.offer} customer={customer} object={object} />
        </div>
      </div>
    </div>
  );
}
