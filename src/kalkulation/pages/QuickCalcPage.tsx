/**
 * Schnellkalkulation: wenige Eingaben → sofortiger Kalkulationsentwurf
 * mit Live-Vorschau. Übernahme als vollwertige Profi-Kalkulation möglich.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import type { Calculation } from '../lib/types';
import { engineContext, useKwStore } from '../lib/store';
import { computeCalculation } from '../lib/engine';
import { buildQuickLines, type QuickCleaningKind } from '../lib/quick';
import { fmtEur, fmtEur0, fmtHours, fmtPct } from '../lib/format';
import {
  Button,
  Callout,
  Card,
  FieldLabel,
  NumberInput,
  SectionTitle,
  Select,
  toast,
  Toggle,
} from '../components/ui';
import { CostBreakdown, FrequencyPicker } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';

export default function QuickCalcPage() {
  const data = useKwStore((st) => st.data);
  const createCalculation = useKwStore((st) => st.createCalculation);
  const navigate = useNavigate();

  const [objectTypeId, setObjectTypeId] = useState(data.objectTypes[0]?.id ?? '');
  const [area, setArea] = useState<number | null>(500);
  const [kind, setKind] = useState<QuickCleaningKind>('unterhalt');
  const [mainFreq, setMainFreq] = useState('fq_2w');
  const [soiling, setSoiling] = useState('normal');
  const [extraGlas, setExtraGlas] = useState(false);
  const [extraGrund, setExtraGrund] = useState(false);
  const [distance, setDistance] = useState<number | null>(15);

  const objectTypeName = data.objectTypes.find((t) => t.id === objectTypeId)?.name ?? 'Büro';

  const preview = useMemo(() => {
    if (!area || area <= 0) return null;
    const { lines, assumptions } = buildQuickLines(
      {
        objectTypeName,
        areaSqm: area,
        kind,
        mainFrequencyId: mainFreq,
        soilingKey: soiling,
        extras: { glas: extraGlas, grundreinigung: extraGrund },
        distanceKm: distance ?? 0,
      },
      data
    );
    const s = data.settings;
    const temp: Calculation = {
      id: 'temp',
      number: 'VORSCHAU',
      name: 'Schnellkalkulation',
      status: 'entwurf',
      lines,
      travel: { enabled: (distance ?? 0) > 0, distanceKm: distance ?? 0, tripsPerMonth: null, payTravelTime: s.travel.payTravelTimeDefault },
      overheadEnabled: s.overhead.enabledByDefault,
      overheadRatePerHour: null,
      riskKey: s.calculation.defaultRiskKey,
      riskPctOverride: null,
      marginMode: s.calculation.marginMode,
      targetMarginPct: s.calculation.targetMarginPct,
      selectedPriceStrategy: 'target',
      customPrice: null,
      competitorPrice: null,
      wageOverride: null,
      scenarios: [],
      postCalc: [],
      createdAt: '',
      updatedAt: '',
      versions: [],
    };
    return { temp, lines, assumptions, totals: computeCalculation(temp, engineContext(data)) };
  }, [area, kind, mainFreq, soiling, extraGlas, extraGrund, distance, objectTypeName, data]);

  const takeover = () => {
    if (!preview) return;
    const calc = createCalculation({
      name: `${objectTypeName} ${area} m² – ${kindLabel(kind)}`,
      lines: preview.lines.map((l) => ({ ...l })),
      travel: { ...preview.temp.travel },
    });
    toast('Schnellkalkulation als Profi-Kalkulation übernommen.');
    navigate(`${BASE}/kalkulationen/${calc.id}?tab=leistungen`);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Schnellkalkulation' }]}
        title="Schnellkalkulation"
        sub="Kleine Objekte in Sekunden kalkulieren — anschließend nahtlos als Profi-Kalkulation weiterbearbeiten."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Eingaben */}
        <Card>
          <SectionTitle>Eingaben</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>1 · Objektart</FieldLabel>
              <Select value={objectTypeId} onChange={(e) => setObjectTypeId(e.target.value)}>
                {data.objectTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>2 · Fläche</FieldLabel>
              <NumberInput value={area} min={1} onChange={setArea} suffix="m²" alignRight={false} />
            </div>
            <div>
              <FieldLabel>3 · Reinigungsart</FieldLabel>
              <Select value={kind} onChange={(e) => setKind(e.target.value as QuickCleaningKind)}>
                <option value="unterhalt">Unterhaltsreinigung</option>
                <option value="glas">Glasreinigung</option>
                <option value="grund">Grundreinigung (einmalig)</option>
                <option value="bauend">Bauendreinigung (einmalig)</option>
              </Select>
            </div>
            <div>
              <FieldLabel>4 · Häufigkeit (Haupt-Turnus)</FieldLabel>
              <FrequencyPicker value={mainFreq} onChange={setMainFreq} />
              <p className="mt-1 text-[10px] text-slate-400">
                Spezielle Leistungen behalten ihren eigenen Turnus (z. B. Sockelleisten monatlich).
              </p>
            </div>
            <div>
              <FieldLabel>5 · Verschmutzung</FieldLabel>
              <Select value={soiling} onChange={(e) => setSoiling(e.target.value)}>
                {data.settings.performanceFactors.soiling.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>7 · Entfernung</FieldLabel>
              <NumberInput value={distance} min={0} onChange={setDistance} suffix="km" alignRight={false} />
            </div>
            {kind === 'unterhalt' ? (
              <div className="sm:col-span-2">
                <FieldLabel>6 · Besondere Leistungen</FieldLabel>
                <div className="flex flex-wrap gap-4 pt-1">
                  <Toggle checked={extraGlas} onChange={setExtraGlas} label={<span className="text-xs">Glasreinigung (quartalsweise)</span>} />
                  <Toggle checked={extraGrund} onChange={setExtraGrund} label={<span className="text-xs">Grundreinigung (einmalig)</span>} />
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Vorschau */}
        <div className="space-y-4">
          {!preview ? (
            <Card>
              <SectionTitle>Vorschau</SectionTitle>
              <p className="text-sm text-slate-500">Bitte eine Fläche angeben.</p>
            </Card>
          ) : (
            <>
              <Card className="!bg-navy-950 !border-navy-900">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Vorläufige Kalkulation
                  </p>
                  <Zap size={15} className="text-brand-400" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {preview.totals.monthlyHours > 0 ? (
                    <>
                      <div>
                        <p className="text-[10px] text-slate-400">Sollstunden/Monat</p>
                        <p className="text-lg font-extrabold text-white kw-tnum">{fmtHours(preview.totals.monthlyHours, 1)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Angebotspreis netto/Monat</p>
                        <p className="text-lg font-extrabold text-brand-300 kw-tnum">{fmtEur0(preview.totals.selected.net)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Selbstkosten/Monat</p>
                        <p className="text-sm font-bold text-slate-200 kw-tnum">{fmtEur(preview.totals.selfCost)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Marge · €/h</p>
                        <p className="text-sm font-bold text-slate-200 kw-tnum">
                          {fmtPct(preview.totals.selected.marginPct, 1)} · {fmtEur(preview.totals.avgHourlyRevenue)}
                        </p>
                      </div>
                    </>
                  ) : null}
                  {preview.totals.oneTime ? (
                    <>
                      <div>
                        <p className="text-[10px] text-slate-400">Einmaliger Aufwand</p>
                        <p className="text-lg font-extrabold text-white kw-tnum">{fmtHours(preview.totals.oneTime.hours, 1)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Einmalpreis netto</p>
                        <p className="text-lg font-extrabold text-brand-300 kw-tnum">{fmtEur0(preview.totals.oneTime.price.net)}</p>
                      </div>
                    </>
                  ) : null}
                </div>
                <p className="mt-3 text-[10px] text-slate-500">
                  {preview.lines.length} Positionen · jede mit eigenem Turnus · basiert auf Ihren Leistungswerten und
                  Einstellungen
                </p>
              </Card>

              {preview.assumptions.length > 0 ? (
                <Callout tone="info">
                  <p className="font-bold mb-1">Annahmen der Schnellkalkulation</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {preview.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </Callout>
              ) : null}

              <Card>
                <SectionTitle>Kostenaufbau</SectionTitle>
                <CostBreakdown totals={preview.totals} showTitle={false} />
              </Card>

              <Button size="lg" className="w-full" icon={<ArrowRight size={15} />} onClick={takeover}>
                Als Profi-Kalkulation weiterbearbeiten
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function kindLabel(kind: QuickCleaningKind): string {
  return {
    unterhalt: 'Unterhaltsreinigung',
    glas: 'Glasreinigung',
    grund: 'Grundreinigung',
    bauend: 'Bauendreinigung',
  }[kind];
}
