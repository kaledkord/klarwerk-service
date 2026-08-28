/**
 * Kosten & Personal: Arbeitgeberstundensatz, Material- und Maschinenübersicht,
 * Fahrtkosten, Gemeinkosten und Risikozuschlag dieser Kalkulation.
 */

import { Link } from 'react-router-dom';
import type { Calculation } from '../../lib/types';
import { useKwStore } from '../../lib/store';
import { fmtEur, fmtHours, fmtNum, fmtPct } from '../../lib/format';
import type { CalcResults } from '../domain';
import { Card, cx, FieldLabel, NumberInput, SectionTitle, Select, Toggle } from '../ui';
import { BASE } from '../shell';

export function CostsTab({
  calc,
  results,
  update,
}: {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
}) {
  const data = useKwStore((st) => st.data);
  const { totals } = results;
  const settings = data.settings;

  const overheadDefault = totals.overheadRate;
  const machineLines = calc.lines.filter((l) => l.machineId);

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {/* Personal */}
      <Card>
        <SectionTitle>Personalkosten</SectionTitle>
        <div className="space-y-3">
          <div>
            <FieldLabel hint={`(leer = Standard ${fmtEur(settings.labor.baseWage)}/h)`}>
              Stundenlohn für diese Kalkulation
            </FieldLabel>
            <NumberInput
              value={calc.wageOverride}
              min={0}
              onChange={(v) => update((c) => void (c.wageOverride = v))}
              placeholder={fmtNum(settings.labor.baseWage, 2)}
              suffix="€/h"
              alignRight={false}
            />
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Direkter Lohn</span>
              <span className="kw-tnum">{fmtEur(totals.rate.baseWage)}/h</span>
            </div>
            {totals.rate.components.map((c) => (
              <div key={c.label} className="flex justify-between text-slate-500">
                <span>+ {c.label} ({fmtNum(c.pct, 1)} %)</span>
                <span className="kw-tnum">{fmtEur(c.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-800">
              <span>Arbeitgeberstundensatz</span>
              <span className="kw-tnum">{fmtEur(totals.rate.employerRate)}/h</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-600">Personalkosten/Monat</span>
            <span className="kw-tnum font-bold text-slate-900">{fmtEur(totals.laborCost)}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Zuschläge (Nacht, Sonntag, Feiertag …) werden je Position vergeben und wirken nur auf die betroffenen
            Stunden. Arbeitgeberanteile zentral in den{' '}
            <Link to={`${BASE}/einstellungen?tab=personal`} className="text-cyan-700 hover:underline">
              Einstellungen
            </Link>
            .
          </p>
        </div>
      </Card>

      {/* Fahrtkosten */}
      <Card>
        <SectionTitle
          right={
            <Toggle
              checked={calc.travel.enabled}
              onChange={(v) => update((c) => void (c.travel.enabled = v))}
            />
          }
        >
          Fahrtkosten
        </SectionTitle>
        <div className={cx('space-y-3', !calc.travel.enabled && 'opacity-40 pointer-events-none')}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Einfache Entfernung</FieldLabel>
              <NumberInput
                value={calc.travel.distanceKm}
                min={0}
                onChange={(v) => update((c) => void (c.travel.distanceKm = v ?? 0))}
                suffix="km"
                alignRight={false}
              />
            </div>
            <div>
              <FieldLabel hint="(leer = automatisch)">Einsatzfahrten/Monat</FieldLabel>
              <NumberInput
                value={calc.travel.tripsPerMonth}
                min={0}
                onChange={(v) => update((c) => void (c.travel.tripsPerMonth = v))}
                placeholder={`auto: ${fmtNum(totals.travel.tripsPerMonth, 1)}`}
                alignRight={false}
              />
            </div>
          </div>
          <Toggle
            checked={calc.travel.payTravelTime}
            onChange={(v) => update((c) => void (c.travel.payTravelTime = v))}
            label={<span className="text-xs">Fahrzeit als Arbeitszeit vergüten</span>}
          />
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>
                Kilometer/Monat ({fmtNum(totals.travel.tripsPerMonth, 1)} Fahrten × {fmtNum(calc.travel.distanceKm * 2, 0)} km)
                {totals.travel.tripsAuto ? ' · auto' : ''}
              </span>
              <span className="kw-tnum">{fmtNum(totals.travel.kmPerMonth, 0)} km</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fahrzeugkosten ({fmtEur(settings.travel.costPerKm)}/km)</span>
              <span className="kw-tnum">{fmtEur(totals.travel.kmCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fahrzeit ({fmtNum(settings.travel.avgSpeedKmh, 0)} km/h ⌀)</span>
              <span className="kw-tnum">{fmtHours(totals.travel.timeHoursPerMonth, 1)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Personalkosten Fahrzeit</span>
              <span className="kw-tnum">{fmtEur(totals.travel.timeCost)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-800">
              <span>Fahrtkosten/Monat</span>
              <span className="kw-tnum">{fmtEur(totals.travel.total)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Gemeinkosten & Risiko */}
      <Card>
        <SectionTitle
          right={
            <Toggle checked={calc.overheadEnabled} onChange={(v) => update((c) => void (c.overheadEnabled = v))} />
          }
        >
          Gemeinkosten & Risiko
        </SectionTitle>
        <div className="space-y-3">
          <div className={cx(!calc.overheadEnabled && 'opacity-40 pointer-events-none')}>
            <FieldLabel hint={`(leer = ${fmtEur(overheadDefault)}/h aus Einstellungen)`}>
              Gemeinkostensatz je produktiver Stunde
            </FieldLabel>
            <NumberInput
              value={calc.overheadRatePerHour}
              min={0}
              onChange={(v) => update((c) => void (c.overheadRatePerHour = v))}
              placeholder={fmtNum(overheadDefault, 2)}
              suffix="€/h"
              alignRight={false}
            />
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="text-slate-600">Gemeinkosten/Monat</span>
              <span className="kw-tnum font-bold text-slate-900">{fmtEur(totals.overheadCost)}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <FieldLabel>Risikoeinstufung</FieldLabel>
            <Select
              value={calc.riskKey}
              onChange={(e) => update((c) => void (c.riskKey = e.target.value))}
            >
              {settings.calculation.riskLevels.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label} ({fmtNum(r.pct, 0)} %)
                </option>
              ))}
            </Select>
            <div className="mt-2">
              <FieldLabel hint="(leer = Wert der Einstufung)">Individueller Risikozuschlag</FieldLabel>
              <NumberInput
                value={calc.riskPctOverride}
                min={0}
                max={100}
                onChange={(v) => update((c) => void (c.riskPctOverride = v))}
                placeholder={fmtNum(totals.riskPct, 1)}
                suffix="%"
                alignRight={false}
              />
            </div>
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="text-slate-600">Risikozuschlag ({fmtPct(totals.riskPct, 1)})</span>
              <span className="kw-tnum font-bold text-slate-900">{fmtEur(totals.riskCost)}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Empfehlung: unbekanntes Objekt, erschwerte Zugänge, unklare Leistungsbeschreibung oder komplizierte
              Arbeitszeiten sprechen für eine höhere Einstufung — die Entscheidung bleibt bei Ihnen.
            </p>
          </div>
        </div>
      </Card>

      {/* Material */}
      <Card>
        <SectionTitle>Material</SectionTitle>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-slate-600">Materialkosten/Monat (aus den Positionen)</span>
          <span className="kw-tnum font-bold text-slate-900">{fmtEur(totals.materialCost)}</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Material wird je Position berechnet (€/Stunde, €/Durchführung, €/m²·Monat oder pauschal) — im Tab
          „Räume & Leistungen“ über das Detail einer Position einstellbar. Verbrauchsmaterial (Papier, Seife) wird laut
          Standardeinstellung {settings.material.consumablesDefault === 'auftraggeber' ? 'vom Auftraggeber gestellt' : settings.material.consumablesDefault === 'auftragnehmer' ? 'von uns gestellt' : 'separat abgerechnet'}.
        </p>
      </Card>

      {/* Maschinen */}
      <Card>
        <SectionTitle>Maschinen</SectionTitle>
        {machineLines.length === 0 ? (
          <p className="text-xs text-slate-400">
            Keine Maschinen zugeordnet. Maschinen werden je Position zugewiesen (Detail einer Position) und mit ihrem
            Stundensatz auf die Monatsstunden der Position gerechnet.
          </p>
        ) : (
          <div className="space-y-1.5 text-xs">
            {machineLines.map((l) => {
              const machine = data.machines.find((m) => m.id === l.machineId);
              const r = totals.lines.find((x) => x.lineId === l.id);
              return (
                <div key={l.id} className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-slate-600">
                    {machine?.name ?? 'Maschine'} <span className="text-slate-400">({l.serviceName})</span>
                  </span>
                  <span className="kw-tnum shrink-0">{fmtEur(r?.machineCost ?? 0)}</span>
                </div>
              );
            })}
            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-800">
              <span>Maschinenkosten/Monat</span>
              <span className="kw-tnum">{fmtEur(totals.machineCost)}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Summen */}
      <Card className="bg-navy-950 !border-navy-900">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3">Kosten gesamt</p>
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between"><span>Personal</span><span className="kw-tnum">{fmtEur(totals.laborCost)}</span></div>
          <div className="flex justify-between"><span>Material</span><span className="kw-tnum">{fmtEur(totals.materialCost)}</span></div>
          <div className="flex justify-between"><span>Maschinen</span><span className="kw-tnum">{fmtEur(totals.machineCost)}</span></div>
          <div className="flex justify-between"><span>Fahrt</span><span className="kw-tnum">{fmtEur(totals.travel.total)}</span></div>
          <div className="flex justify-between"><span>Gemeinkosten</span><span className="kw-tnum">{fmtEur(totals.overheadCost)}</span></div>
          <div className="flex justify-between"><span>Risiko</span><span className="kw-tnum">{fmtEur(totals.riskCost)}</span></div>
          <div className="flex justify-between border-t border-white/15 pt-2 text-sm font-extrabold text-white">
            <span>Selbstkosten/Monat</span>
            <span className="kw-tnum">{fmtEur(totals.selfCost)}</span>
          </div>
          <div className="flex justify-between text-brand-300 font-bold">
            <span>Angebotspreis (netto)</span>
            <span className="kw-tnum">{fmtEur(totals.selected.net)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
