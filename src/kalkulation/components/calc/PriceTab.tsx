/**
 * Preis & Szenarien: Margen-Modus, Zielmarge, Preisstrategien,
 * Was-wäre-wenn-Szenarien mit Vergleichstabelle.
 */

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Calculation, Scenario } from '../../lib/types';
import { computeScenario } from '../../lib/engine';
import { useKwStore } from '../../lib/store';
import { uid } from '../../lib/id';
import { fmtEur, fmtHours, fmtNum, fmtPct } from '../../lib/format';
import type { CalcResults } from '../domain';
import { CostBreakdown, PriceStrategyTable } from '../domain';
import {
  Button,
  Callout,
  Card,
  FieldLabel,
  Modal,
  NumberInput,
  SectionTitle,
  SegmentedControl,
  TextInput,
  toast,
} from '../ui';

export function PriceTab({
  calc,
  results,
  update,
}: {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
}) {
  const settings = useKwStore((st) => st.data.settings);
  const { totals, ctx } = results;
  const [scenarioOpen, setScenarioOpen] = useState(false);

  const scenarioResults = useMemo(
    () => calc.scenarios.map((s) => computeScenario(calc, s, ctx)),
    [calc, ctx]
  );

  const belowMin = totals.monthlyHours > 0 && totals.selected.marginPct < settings.calculation.minMarginPct;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <Card>
          <SectionTitle
            right={
              <SegmentedControl
                size="sm"
                value={calc.marginMode}
                onChange={(v) => update((c) => void (c.marginMode = v))}
                options={[
                  { value: 'margin', label: 'Echte Zielmarge' },
                  { value: 'markup', label: 'Kostenaufschlag' },
                ]}
              />
            }
          >
            Marge & Preisstrategie
          </SectionTitle>

          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            <div>
              <FieldLabel>
                {calc.marginMode === 'margin' ? 'Zielmarge (vom Verkaufspreis)' : 'Aufschlag (auf die Kosten)'}
              </FieldLabel>
              <NumberInput
                value={calc.targetMarginPct}
                min={0}
                max={calc.marginMode === 'margin' ? 95 : 500}
                onChange={(v) => update((c) => void (c.targetMarginPct = v ?? settings.calculation.targetMarginPct))}
                suffix="%"
                alignRight={false}
              />
            </div>
            <div className="sm:col-span-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-500 self-end">
              {calc.marginMode === 'margin' ? (
                <>
                  <strong>Echte Marge:</strong> Preis = Kosten ÷ (1 − Marge). Beispiel: 1.000 € Kosten, 20 % →{' '}
                  <span className="kw-tnum">1.250 €</span> (250 € Gewinn = 20 % vom Umsatz).
                </>
              ) : (
                <>
                  <strong>Aufschlag:</strong> Preis = Kosten × (1 + Aufschlag). Beispiel: 1.000 € Kosten, 20 % →{' '}
                  <span className="kw-tnum">1.200 €</span> (Marge dann nur 16,7 % vom Umsatz).
                </>
              )}
            </div>
          </div>

          {belowMin ? (
            <Callout tone="error" className="mb-3">
              Der gewählte Preis liegt unter der Mindestmarge von {fmtPct(settings.calculation.minMarginPct, 0)} —
              nicht zur Angebotsabgabe empfohlen.
            </Callout>
          ) : null}

          <PriceStrategyTable
            totals={totals}
            calc={calc}
            onSelect={(strategy) => update((c) => void (c.selectedPriceStrategy = strategy))}
            onCompetitorChange={(v) => update((c) => void (c.competitorPrice = v))}
            onCustomChange={(v) =>
              update((c) => {
                c.customPrice = v;
                if (v != null) c.selectedPriceStrategy = 'custom';
              })
            }
          />
          <p className="mt-2 text-[11px] text-slate-400">
            Ein Klick auf die Auswahl übernimmt die Strategie als Angebotswert. Rundung:{' '}
            {settings.calculation.rounding === 'none' ? 'keine' : 'aktiv'} (Einstellungen → Kalkulation).
          </p>
        </Card>

        {/* Szenarien */}
        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle
              right={
                <Button size="sm" variant="outline" icon={<Plus size={12} />} onClick={() => setScenarioOpen(true)}>
                  Szenario
                </Button>
              }
            >
              Was-wäre-wenn-Szenarien
            </SectionTitle>
          </div>
          {calc.scenarios.length === 0 ? (
            <p className="px-5 pb-5 text-xs text-slate-400">
              Vergleichen Sie Margen, Leistungswert-Abweichungen (±10 %) oder häufigere Turnusse, ohne die Kalkulation zu
              verändern.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="kw-table">
                <thead>
                  <tr>
                    <th>Szenario</th>
                    <th className="!text-right">Stunden/M.</th>
                    <th className="!text-right">Kosten/M.</th>
                    <th className="!text-right">Verkaufspreis</th>
                    <th className="!text-right">Marge</th>
                    <th className="!text-right">Δ Preis</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="!bg-slate-50/60">
                    <td className="font-semibold text-slate-800">Aktuelle Kalkulation</td>
                    <td className="text-right kw-tnum">{fmtNum(totals.monthlyHours, 1)}</td>
                    <td className="text-right kw-tnum">{fmtEur(totals.selfCost)}</td>
                    <td className="text-right kw-tnum font-semibold">{fmtEur(totals.selected.net)}</td>
                    <td className="text-right kw-tnum">{fmtPct(totals.selected.marginPct, 1)}</td>
                    <td className="text-right kw-tnum text-slate-400">—</td>
                    <td></td>
                  </tr>
                  {scenarioResults.map(({ scenario, totals: t }) => (
                    <tr key={scenario.id}>
                      <td>
                        <span className="font-semibold text-slate-700">{scenario.name}</span>
                        <span className="block text-[10px] text-slate-400">
                          {[
                            scenario.marginPct != null ? `Marge ${fmtNum(scenario.marginPct, 0)} %` : null,
                            scenario.performanceDeltaPct !== 0
                              ? `LW ${scenario.performanceDeltaPct > 0 ? '+' : ''}${fmtNum(scenario.performanceDeltaPct, 0)} %`
                              : null,
                            scenario.frequencyFactor !== 1 ? `Turnus × ${fmtNum(scenario.frequencyFactor, 2)}` : null,
                          ]
                            .filter(Boolean)
                            .join(' · ') || 'wie Original'}
                        </span>
                      </td>
                      <td className="text-right kw-tnum">{fmtNum(t.monthlyHours, 1)}</td>
                      <td className="text-right kw-tnum">{fmtEur(t.selfCost)}</td>
                      <td className="text-right kw-tnum font-semibold">{fmtEur(t.selected.net)}</td>
                      <td className="text-right kw-tnum">{fmtPct(t.selected.marginPct, 1)}</td>
                      <td className="text-right kw-tnum">
                        <span className={t.selected.net >= totals.selected.net ? 'text-brand-700' : 'text-error-600'}>
                          {t.selected.net >= totals.selected.net ? '+' : ''}
                          {fmtEur(t.selected.net - totals.selected.net)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                          title="Szenario löschen"
                          onClick={() =>
                            update((c) => {
                              c.scenarios = c.scenarios.filter((s) => s.id !== scenario.id);
                            })
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <SectionTitle>Wie entsteht der Preis?</SectionTitle>
          <CostBreakdown totals={totals} showTitle={false} />
        </Card>
        {totals.monthlyHours > 0 ? (
          <Card>
            <SectionTitle>Kennzahlen</SectionTitle>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Stundenverrechnungssatz</span><span className="kw-tnum font-semibold">{fmtEur(totals.avgHourlyRevenue)}/h</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Deckungsbeitrag/Monat</span><span className="kw-tnum">{fmtEur(totals.selected.net - totals.laborCost - totals.materialCost - totals.machineCost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Jahreswert (netto)</span><span className="kw-tnum">{fmtEur(totals.selected.net * 12)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Sollstunden/Jahr</span><span className="kw-tnum">{fmtHours(totals.yearlyHours, 0)}</span></div>
            </div>
          </Card>
        ) : null}
      </div>

      {scenarioOpen ? (
        <ScenarioModal
          onClose={() => setScenarioOpen(false)}
          onSave={(s) => {
            update((c) => {
              c.scenarios.push(s);
            });
            setScenarioOpen(false);
            toast('Szenario gespeichert.');
          }}
        />
      ) : null}
    </div>
  );
}

function ScenarioModal({ onClose, onSave }: { onClose: () => void; onSave: (s: Scenario) => void }) {
  const [name, setName] = useState('');
  const [margin, setMargin] = useState<number | null>(null);
  const [perfDelta, setPerfDelta] = useState<number | null>(0);
  const [freqFactor, setFreqFactor] = useState<number | null>(1);

  return (
    <Modal
      open
      onClose={onClose}
      title="Szenario anlegen"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              const parts = [
                margin != null ? `Marge ${margin} %` : null,
                perfDelta ? `LW ${perfDelta > 0 ? '+' : ''}${perfDelta} %` : null,
                freqFactor !== 1 ? `Turnus × ${freqFactor}` : null,
              ].filter(Boolean);
              onSave({
                id: uid('sc'),
                name: name.trim() || parts.join(', ') || 'Szenario',
                marginPct: margin,
                performanceDeltaPct: perfDelta ?? 0,
                frequencyFactor: freqFactor ?? 1,
                createdAt: new Date().toISOString(),
              });
            }}
          >
            Szenario speichern
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <FieldLabel hint="(optional)">Name</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Marge 20 %" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <FieldLabel hint="(leer = unverändert)">Marge</FieldLabel>
            <NumberInput value={margin} min={0} max={95} onChange={setMargin} suffix="%" alignRight={false} />
          </div>
          <div>
            <FieldLabel>Leistungswerte ±</FieldLabel>
            <NumberInput value={perfDelta} min={-90} max={200} onChange={setPerfDelta} suffix="%" alignRight={false} />
          </div>
          <div>
            <FieldLabel>Turnus-Faktor</FieldLabel>
            <NumberInput value={freqFactor} min={0.1} max={10} onChange={setFreqFactor} alignRight={false} />
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Beispiele: Marge 10/15/20 % · Leistungswerte −10 % (vorsichtiger kalkulieren) · Turnus-Faktor 1,5 (aus 2×
          wird 3× wöchentlich).
        </p>
      </div>
    </Modal>
  );
}
