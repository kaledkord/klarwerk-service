/** Übersicht: Prüfhinweise, Health-Score, Kostenaufbau, Bereichs-Zusammenfassung. */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Calculation } from '../../lib/types';
import { useKwStore } from '../../lib/store';
import { fmtEur, fmtHours, fmtNum, fmtPct } from '../../lib/format';
import type { CalcResults } from '../domain';
import { CostBreakdown, HealthChecklist, HealthRing, WarningsList } from '../domain';
import { Card, SectionTitle, Select } from '../ui';
import { BASE } from '../shell';

export function OverviewTab({
  calc,
  results,
  update,
}: {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
}) {
  const data = useKwStore((st) => st.data);
  const { totals, warnings, health } = results;

  const areaSummary = useMemo(() => {
    const map = new Map<string, { hours: number; cost: number; price: number; count: number }>();
    for (const line of calc.lines) {
      const r = totals.lines.find((x) => x.lineId === line.id);
      if (!r) continue;
      const entry = map.get(line.areaLabel) ?? { hours: 0, cost: 0, price: 0, count: 0 };
      entry.hours += r.monthlyHours;
      entry.cost += totals.perLine[line.id]?.fullCost ?? 0;
      entry.price += totals.perLine[line.id]?.price ?? 0;
      entry.count += 1;
      map.set(line.areaLabel, entry);
    }
    return [...map.entries()];
  }, [calc.lines, totals]);

  const customers = data.customers;
  const objects = data.objects.filter((o) => !calc.customerId || o.customerId === calc.customerId);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {/* Zuordnung */}
        <Card>
          <SectionTitle>Zuordnung</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Kunde</p>
              <Select
                value={calc.customerId ?? ''}
                onChange={(e) =>
                  update((c) => {
                    c.customerId = e.target.value || undefined;
                    const obj = data.objects.find((o) => o.id === c.objectId);
                    if (obj && obj.customerId !== c.customerId) c.objectId = undefined;
                  }, false)
                }
              >
                <option value="">— Kein Kunde —</option>
                {customers.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.company}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Objekt</p>
              <Select
                value={calc.objectId ?? ''}
                onChange={(e) =>
                  update((c) => {
                    c.objectId = e.target.value || undefined;
                    const obj = data.objects.find((o) => o.id === c.objectId);
                    if (obj) {
                      c.customerId = obj.customerId;
                      if (obj.distanceKm != null && c.travel.distanceKm === 0) c.travel.distanceKm = obj.distanceKm;
                    }
                  }, false)
                }
              >
                <option value="">— Kein Objekt —</option>
                {objects.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
              {calc.objectId ? (
                <Link to={`${BASE}/objekte/${calc.objectId}`} className="mt-1 inline-block text-[11px] text-cyan-700 hover:underline">
                  Objekt öffnen →
                </Link>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Bereichs-Zusammenfassung */}
        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle>Zusammenfassung nach Bereichen</SectionTitle>
          </div>
          {areaSummary.length === 0 ? (
            <p className="px-5 pb-5 text-xs text-slate-400">
              Noch keine Positionen — im Tab „Räume & Leistungen“ beginnen.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="kw-table">
                <thead>
                  <tr>
                    <th>Bereich</th>
                    <th className="!text-right">Positionen</th>
                    <th className="!text-right">Stunden/Monat</th>
                    <th className="!text-right">Kosten/Monat</th>
                    <th className="!text-right">Preis/Monat</th>
                    <th className="!text-right">Anteil</th>
                  </tr>
                </thead>
                <tbody>
                  {areaSummary.map(([area, s]) => (
                    <tr key={area}>
                      <td className="font-semibold text-slate-800">{area || 'Ohne Bereich'}</td>
                      <td className="text-right kw-tnum">{s.count}</td>
                      <td className="text-right kw-tnum">{fmtNum(s.hours, 2)} h</td>
                      <td className="text-right kw-tnum">{fmtEur(s.cost)}</td>
                      <td className="text-right kw-tnum font-semibold">{fmtEur(s.price)}</td>
                      <td className="text-right kw-tnum text-slate-500">
                        {totals.selected.net > 0 ? fmtPct((s.price / totals.selected.net) * 100, 0) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Kostenaufbau */}
        <Card>
          <SectionTitle>Kostenaufbau & Preis</SectionTitle>
          <div className="max-w-md">
            <CostBreakdown totals={totals} showTitle={false} />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <SectionTitle>Prüfhinweise</SectionTitle>
          <WarningsList warnings={warnings} />
        </Card>
        <Card>
          <SectionTitle
            right={<HealthRing score={health.score} size={36} />}
          >
            Kalkulationsqualität
          </SectionTitle>
          <HealthChecklist health={health} />
        </Card>
        {totals.oneTime ? (
          <Card>
            <SectionTitle>Einmalige Leistungen</SectionTitle>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Aufwand</span><span className="kw-tnum">{fmtHours(totals.oneTime.hours, 1)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Kosten</span><span className="kw-tnum">{fmtEur(totals.oneTime.cost)}</span></div>
              <div className="flex justify-between font-bold text-slate-800"><span>Angebotspreis (netto)</span><span className="kw-tnum">{fmtEur(totals.oneTime.price.net)}</span></div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
