/** Druckansicht der internen Kalkulation — vollständige Zahlen, nur für den internen Gebrauch. */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Printer, X } from 'lucide-react';
import { useKwStore } from '../lib/store';
import { useCalcResults } from '../components/domain';
import { CALCULATION_STATUS_LABELS } from '../lib/types';
import { fmtDate, fmtEur, fmtHours, fmtNum, fmtPct, fmtSqm } from '../lib/format';
import '../kalkulation.css';

export default function PrintInternalPage() {
  const { id } = useParams<{ id: string }>();
  const data = useKwStore((st) => st.data);
  const calc = data.calculations.find((c) => c.id === id);
  const results = useCalcResults(calc);
  const customer = data.customers.find((c) => c.id === calc?.customerId);
  const object = data.objects.find((o) => o.id === calc?.objectId);

  useEffect(() => {
    document.title = calc ? `Interne Kalkulation ${calc.number}` : 'Interne Kalkulation';
  }, [calc]);

  if (!calc || !results) {
    return <div className="kw-app min-h-screen flex items-center justify-center text-sm text-slate-500">Kalkulation nicht gefunden.</div>;
  }

  const { totals, health, warnings } = results;
  const freqName = (fid: string) => data.frequencies.find((f) => f.id === fid)?.name ?? '—';
  const sorted = [...calc.lines].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="kw-app min-h-screen bg-slate-200 print:bg-white">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="kw-no-print sticky top-0 z-10 flex items-center justify-center gap-2 border-b border-slate-300 bg-white/90 backdrop-blur px-4 py-2.5">
        <p className="text-xs font-semibold text-error-600 mr-2">Interne Ansicht — nicht an Kunden weitergeben.</p>
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
        <div className="mx-auto max-w-[280mm] bg-white shadow-glass-lg print:shadow-none">
          <div className="kw-print-page !max-w-none">
            <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: '#0f1827' }}>
              <div>
                <p className="text-[8pt] font-bold uppercase tracking-wider" style={{ color: '#f0552b' }}>
                  Interne Kalkulation — vertraulich
                </p>
                <h1 className="text-[13pt] font-extrabold mt-0.5" style={{ color: '#0f1827' }}>
                  {calc.name}
                </h1>
                <p className="text-[9pt]" style={{ color: '#5b6b7b' }}>
                  {calc.number} · Status: {CALCULATION_STATUS_LABELS[calc.status]} · Stand {fmtDate(calc.updatedAt)}
                  {customer ? ` · ${customer.company}` : ''}
                  {object ? ` · ${object.name}` : ''}
                </p>
              </div>
              <img src="/kalkulation-logo-160.png" alt="KlarWerk" className="h-12 w-12 rounded-lg" />
            </div>

            {/* Kennzahlen */}
            <div className="mt-4 grid grid-cols-6 gap-2 text-[8.5pt]">
              {[
                ['Gesamtfläche', totals.totalAreaSqm > 0 ? fmtSqm(totals.totalAreaSqm) : '—'],
                ['Sollstunden/Monat', fmtHours(totals.monthlyHours, 2)],
                ['Selbstkosten/Monat', fmtEur(totals.selfCost)],
                ['Angebotspreis netto', fmtEur(totals.selected.net)],
                ['Marge', fmtPct(totals.selected.marginPct, 1)],
                ['Kalkulationsqualität', `${health.score}/100`],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded border px-2 py-1.5" style={{ borderColor: '#e2e9f0' }}>
                  <p style={{ color: '#8795a3' }}>{k}</p>
                  <p className="font-bold kw-tnum" style={{ color: '#0f1827' }}>
                    {v}
                  </p>
                </div>
              ))}
            </div>

            {/* Positionen */}
            <h2 className="mt-5 text-[10.5pt] font-bold" style={{ color: '#0f1827' }}>
              Leistungspositionen
            </h2>
            <table className="mt-1.5 w-full border-collapse text-[7.8pt]">
              <thead>
                <tr style={{ background: '#f4f7fa' }}>
                  {['Bereich', 'Raum', 'Leistung', 'Menge', 'LW', 'Zeit/D.', 'Turnus', 'D./M.', 'Std./M.', 'Personal', 'Material', 'Maschine', 'Kosten', 'Preis'].map((h) => (
                    <th key={h} className="border px-1.5 py-1 text-left font-bold" style={{ borderColor: '#e2e9f0' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((l) => {
                  const r = totals.lines.find((x) => x.lineId === l.id)!;
                  const per = totals.perLine[l.id];
                  return (
                    <tr key={l.id}>
                      <td className="border px-1.5 py-0.5" style={{ borderColor: '#eef2f6' }}>{l.areaLabel}</td>
                      <td className="border px-1.5 py-0.5" style={{ borderColor: '#eef2f6' }}>{l.roomLabel}</td>
                      <td className="border px-1.5 py-0.5" style={{ borderColor: '#eef2f6' }}>
                        {l.serviceName}
                        {r.perf.manual ? ' *' : ''}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>
                        {fmtNum(l.quantity, 1)} {l.unit}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>
                        {l.unit === 'h' || l.unit === 'Pauschale' ? '—' : `${fmtNum(r.perf.value, 0)}/h`}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>
                        {fmtNum(r.timePerExecutionH, 2)} h
                      </td>
                      <td className="border px-1.5 py-0.5" style={{ borderColor: '#eef2f6' }}>{freqName(l.frequencyId)}</td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>
                        {r.recurring ? fmtNum(r.executionsPerMonth, 2) : r.oneTime ? '1×' : 'Abruf'}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum font-bold" style={{ borderColor: '#eef2f6' }}>
                        {r.recurring ? fmtNum(r.monthlyHours, 2) : '—'}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>{fmtEur(r.laborCost)}</td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>{fmtEur(r.materialCost)}</td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>{fmtEur(r.machineCost)}</td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum" style={{ borderColor: '#eef2f6' }}>
                        {fmtEur(per?.fullCost ?? r.directCost)}
                      </td>
                      <td className="border px-1.5 py-0.5 text-right kw-tnum font-bold" style={{ borderColor: '#eef2f6' }}>
                        {fmtEur(per?.price ?? 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-1 text-[7pt]" style={{ color: '#8795a3' }}>
              * Leistungswert manuell angepasst. LW = effektiver Leistungswert inkl. Faktoren. Kosten je Position =
              anteilige Vollkosten (inkl. Fahrt, Gemeinkosten, Risiko).
            </p>

            {/* Kostenaufbau & Preise */}
            <div className="mt-5 grid grid-cols-2 gap-6 kw-print-avoid-break">
              <div>
                <h2 className="text-[10.5pt] font-bold" style={{ color: '#0f1827' }}>
                  Kostenaufbau je Monat
                </h2>
                <table className="mt-1.5 w-full text-[8.5pt]">
                  <tbody>
                    {[
                      [`Personal (${fmtHours(totals.monthlyHours, 1)} × ${fmtEur(totals.rate.employerRate)}/h)`, totals.laborCost],
                      ['Material', totals.materialCost],
                      ['Maschinen', totals.machineCost],
                      [`Fahrt (${fmtNum(totals.travel.kmPerMonth, 0)} km, ${fmtHours(totals.travel.timeHoursPerMonth, 1)})`, totals.travel.total],
                      [`Gemeinkosten (${fmtEur(totals.overheadRate)}/h)`, totals.overheadCost],
                      [`Risiko (${fmtPct(totals.riskPct, 1)})`, totals.riskCost],
                    ].map(([k, v]) => (
                      <tr key={k as string}>
                        <td className="py-0.5" style={{ color: '#5b6b7b' }}>{k}</td>
                        <td className="py-0.5 text-right kw-tnum">{fmtEur(v as number)}</td>
                      </tr>
                    ))}
                    <tr className="border-t font-bold" style={{ borderColor: '#0f1827' }}>
                      <td className="py-1">Selbstkosten</td>
                      <td className="py-1 text-right kw-tnum">{fmtEur(totals.selfCost)}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5" style={{ color: '#5b6b7b' }}>Gewinn ({fmtPct(totals.selected.marginPct, 1)})</td>
                      <td className="py-0.5 text-right kw-tnum" style={{ color: '#188a3c' }}>{fmtEur(totals.selected.profit)}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-0.5">Verkaufspreis netto</td>
                      <td className="py-0.5 text-right kw-tnum">{fmtEur(totals.selected.net)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-[10.5pt] font-bold" style={{ color: '#0f1827' }}>
                  Preisstrategien
                </h2>
                <table className="mt-1.5 w-full text-[8.5pt]">
                  <tbody>
                    {(
                      [
                        { k: 'Mindestpreis', p: totals.prices.min },
                        { k: 'Zielpreis', p: totals.prices.target },
                        { k: 'Premiumpreis', p: totals.prices.premium },
                        ...(totals.prices.competitor ? [{ k: 'Wettbewerbspreis', p: totals.prices.competitor }] : []),
                      ] as { k: string; p: { net: number; marginPct: number } }[]
                    ).map(({ k, p }) => (
                      <tr key={k}>
                        <td className="py-0.5" style={{ color: '#5b6b7b' }}>{k}</td>
                        <td className="py-0.5 text-right kw-tnum">{fmtEur(p.net)}</td>
                        <td className="py-0.5 text-right kw-tnum" style={{ color: '#8795a3' }}>
                          {fmtPct(p.marginPct, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h2 className="mt-4 text-[10.5pt] font-bold" style={{ color: '#0f1827' }}>
                  Prüfhinweise
                </h2>
                <ul className="mt-1 list-disc pl-4 text-[8pt] space-y-0.5" style={{ color: '#5b6b7b' }}>
                  {warnings.map((w, i) => (
                    <li key={i}>{w.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
