/**
 * Fachliche Bausteine: Statusanzeigen, Health-Score, Turnus-Auswahl,
 * Leistungswert-Herleitung, Kostenaufbau, Preisstrategien.
 */

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, PenLine, XCircle } from 'lucide-react';
import type { Calculation, CalculationStatus, Frequency } from '../lib/types';
import { CALCULATION_STATUS_LABELS } from '../lib/types';
import {
  computeCalculation,
  computeHealth,
  computeWarnings,
  executionsPerMonth,
  frequencyFormula,
  type CalcTotals,
  type CalcWarning,
  type EngineContext,
  type HealthResult,
  type PerfDerivation,
} from '../lib/engine';
import { engineContext, useKwStore } from '../lib/store';
import { fmtEur, fmtHours, fmtNum, fmtPct } from '../lib/format';
import { Badge, Button, cx, FieldLabel, Modal, NumberInput, Select, TextInput } from './ui';

// ─────────────────────────────────────────────────────────────────────────────
// Ergebnis-Hook
// ─────────────────────────────────────────────────────────────────────────────

export interface CalcResults {
  totals: CalcTotals;
  warnings: CalcWarning[];
  health: HealthResult;
  ctx: EngineContext;
}

export function useCalcResults(calc: Calculation | undefined): CalcResults | null {
  const data = useKwStore((st) => st.data);
  return useMemo(() => {
    if (!calc) return null;
    const ctx = engineContext(data);
    const totals = computeCalculation(calc, ctx);
    return {
      totals,
      warnings: computeWarnings(calc, totals, ctx),
      health: computeHealth(calc, totals, ctx),
      ctx,
    };
  }, [calc, data]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Status
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_TONES: Record<CalculationStatus, 'neutral' | 'blue' | 'amber' | 'green' | 'red' | 'navy' | 'outline'> = {
  entwurf: 'neutral',
  in_bearbeitung: 'blue',
  angebot_erstellt: 'amber',
  angebot_versendet: 'navy',
  gewonnen: 'green',
  verloren: 'red',
  archiviert: 'outline',
};

export function StatusBadge({ status }: { status: CalculationStatus }) {
  return <Badge tone={STATUS_TONES[status]}>{CALCULATION_STATUS_LABELS[status]}</Badge>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Health-Score
// ─────────────────────────────────────────────────────────────────────────────

export function healthColor(score: number): string {
  if (score >= 85) return '#21a74a';
  if (score >= 65) return '#f5891f';
  return '#f0552b';
}

export function HealthRing({ score, size = 40 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const color = healthColor(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Kalkulationsqualität ${score} von 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6ecf2" strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 300ms var(--kw-ease), stroke 300ms var(--kw-ease)' }}
      />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.3}
        fontWeight={800}
        fill={color}
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}

export function HealthChecklist({ health }: { health: HealthResult }) {
  return (
    <div className="space-y-1">
      {health.checks.map((c) => (
        <div key={c.label} className="flex items-start justify-between gap-3 text-xs">
          <span className="flex items-start gap-1.5 min-w-0">
            {c.passed ? (
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-brand-500" />
            ) : (
              <XCircle size={13} className="mt-0.5 shrink-0 text-error-500" />
            )}
            <span className={cx('min-w-0', c.passed ? 'text-slate-600' : 'text-slate-800 font-semibold')}>
              {c.label}
              {c.detail && !c.passed ? <span className="block text-[10px] font-normal text-slate-400">{c.detail}</span> : null}
            </span>
          </span>
          <span className={cx('kw-tnum shrink-0 font-semibold', c.passed ? 'text-brand-600' : 'text-slate-400')}>
            {c.earned}/{c.points}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Warnungen
// ─────────────────────────────────────────────────────────────────────────────

export function WarningRow({ warning }: { warning: CalcWarning }) {
  const icon =
    warning.severity === 'error' ? (
      <XCircle size={14} className="shrink-0 text-error-500 mt-0.5" />
    ) : warning.severity === 'warn' ? (
      <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5" />
    ) : warning.severity === 'ok' ? (
      <CheckCircle2 size={14} className="shrink-0 text-brand-500 mt-0.5" />
    ) : (
      <Info size={14} className="shrink-0 text-cyan-500 mt-0.5" />
    );
  return (
    <div className="flex items-start gap-2 text-xs text-slate-700 py-1">
      {icon}
      <span className="min-w-0">{warning.message}</span>
    </div>
  );
}

export function WarningsList({ warnings, compact }: { warnings: CalcWarning[]; compact?: boolean }) {
  if (warnings.length === 0) {
    return <p className="text-xs text-slate-400">Keine Hinweise.</p>;
  }
  const sorted = [...warnings].sort((a, b) => severityRank(a) - severityRank(b));
  return (
    <div className={cx(compact && 'max-h-48 overflow-y-auto pr-1')}>
      {sorted.map((w, i) => (
        <WarningRow key={`${w.code}-${i}`} warning={w} />
      ))}
    </div>
  );
}

function severityRank(w: CalcWarning): number {
  return { error: 0, warn: 1, info: 2, ok: 3 }[w.severity];
}

// ─────────────────────────────────────────────────────────────────────────────
// Turnus-Auswahl (inkl. benutzerdefiniertem Turnus)
// ─────────────────────────────────────────────────────────────────────────────

const CUSTOM_VALUE = '__custom__';

export function FrequencyPicker({
  value,
  onChange,
  cell = false,
  className,
}: {
  value: string;
  onChange: (frequencyId: string) => void;
  cell?: boolean;
  className?: string;
}) {
  const frequencies = useKwStore((st) => st.data.frequencies);
  const weeksPerMonth = useKwStore((st) => st.data.settings.calculation.weeksPerMonth);
  const [customOpen, setCustomOpen] = useState(false);

  const active = frequencies
    .filter((f) => f.active || f.id === value)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <select
        className={cx(cell ? 'kw-cell-input' : 'kw-input', className)}
        value={value}
        onChange={(e) => {
          if (e.target.value === CUSTOM_VALUE) {
            setCustomOpen(true);
            return;
          }
          onChange(e.target.value);
        }}
        title={(() => {
          const f = frequencies.find((x) => x.id === value);
          if (!f) return undefined;
          const fm = executionsPerMonth(f, weeksPerMonth);
          if (fm.oneTime) return 'Einmalige Leistung';
          if (fm.onDemand) return 'Nach Bedarf';
          return `${frequencyFormula(f, weeksPerMonth)} = ${fmtNum(fm.executionsPerMonth, 2)} Durchführungen/Monat`;
        })()}
      >
        {active.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
        <option value={CUSTOM_VALUE}>+ Eigener Turnus …</option>
      </select>
      {customOpen ? (
        <CustomFrequencyModal
          onClose={() => setCustomOpen(false)}
          onCreated={(f) => {
            onChange(f.id);
            setCustomOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export function CustomFrequencyModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (f: Frequency) => void;
}) {
  const addFrequency = useKwStore((st) => st.addFrequency);
  const weeksPerMonth = useKwStore((st) => st.data.settings.calculation.weeksPerMonth);
  const [kind, setKind] = useState<'perWeek' | 'perMonth' | 'everyNDays' | 'perDay' | 'perYear'>('perWeek');
  const [count, setCount] = useState<number | null>(2);
  const [interval, setIntervalDays] = useState<number | null>(10);
  const [workdays, setWorkdays] = useState<number | null>(5);
  const [name, setName] = useState('');

  const preview = useMemo(() => {
    const f: Frequency = {
      id: 'tmp',
      name: 'tmp',
      kind,
      count: count ?? 1,
      intervalDays: interval ?? undefined,
      workdaysPerWeek: workdays ?? undefined,
      system: false,
      active: true,
      sortOrder: 0,
    };
    return executionsPerMonth(f, weeksPerMonth).executionsPerMonth;
  }, [kind, count, interval, workdays, weeksPerMonth]);

  const defaultName = useMemo(() => {
    switch (kind) {
      case 'perWeek':
        return `${fmtNum(count ?? 1, 1)}× wöchentlich`;
      case 'perMonth':
        return `${fmtNum(count ?? 1, 1)}× monatlich`;
      case 'perYear':
        return `${fmtNum(count ?? 1, 1)}× jährlich`;
      case 'everyNDays':
        return `alle ${fmtNum(interval ?? 10, 0)} Tage`;
      case 'perDay':
        return `${fmtNum(count ?? 1, 0)}× täglich an ${fmtNum(workdays ?? 5, 0)} Tagen/Woche`;
    }
  }, [kind, count, interval, workdays]);

  return (
    <Modal
      open
      onClose={onClose}
      title="Eigenen Turnus erstellen"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              const f = addFrequency({
                name: name.trim() || defaultName,
                kind,
                count: count ?? 1,
                intervalDays: kind === 'everyNDays' ? (interval ?? 10) : undefined,
                workdaysPerWeek: kind === 'perDay' ? (workdays ?? 5) : undefined,
                active: true,
              });
              onCreated(f);
            }}
          >
            Turnus anlegen
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <FieldLabel>Art</FieldLabel>
          <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="perWeek">× wöchentlich</option>
            <option value="perMonth">× monatlich</option>
            <option value="perDay">× täglich (Arbeitstage wählbar)</option>
            <option value="everyNDays">alle N Tage</option>
            <option value="perYear">× jährlich</option>
          </Select>
        </div>
        {kind === 'everyNDays' ? (
          <div>
            <FieldLabel>Intervall in Tagen</FieldLabel>
            <NumberInput value={interval} onChange={setIntervalDays} decimals={0} min={1} />
          </div>
        ) : (
          <div>
            <FieldLabel>Anzahl</FieldLabel>
            <NumberInput value={count} onChange={setCount} decimals={2} min={0.1} />
          </div>
        )}
        {kind === 'perDay' ? (
          <div>
            <FieldLabel>Tage pro Woche</FieldLabel>
            <NumberInput value={workdays} onChange={setWorkdays} decimals={0} min={1} max={7} />
          </div>
        ) : null}
        <div>
          <FieldLabel hint="(optional)">Bezeichnung</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder={defaultName} />
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
          Entspricht <strong className="kw-tnum">{fmtNum(preview, 2)}</strong> Durchführungen pro Monat
          {' '}(<span className="kw-tnum">{fmtNum(preview * 12, 1)}</span> pro Jahr).
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Leistungswert-Herleitung
// ─────────────────────────────────────────────────────────────────────────────

export function PerfDerivationView({ perf, unit }: { perf: PerfDerivation; unit: string }) {
  if (perf.manual) {
    return (
      <div className="space-y-1.5 text-xs">
        <p className="flex items-center gap-1.5 font-semibold text-amber-700">
          <PenLine size={12} /> Manuell angepasst
        </p>
        <p className="text-slate-600">
          Standardwert: <span className="kw-tnum">{fmtNum(perf.base, 1)} {unit}/h</span>
          {' → '}
          <span className="kw-tnum font-semibold">{fmtNum(perf.value, 1)} {unit}/h</span>
        </p>
        {perf.manualReason ? (
          <p className="text-slate-500">Grund: {perf.manualReason}</p>
        ) : (
          <p className="text-amber-600">Kein Grund hinterlegt.</p>
        )}
      </div>
    );
  }
  return (
    <div className="text-xs space-y-1">
      <p className="font-semibold text-slate-700 mb-1.5">Herleitung des Leistungswerts</p>
      <div className="flex items-center justify-between text-slate-600">
        <span>Standardwert</span>
        <span className="kw-tnum">{fmtNum(perf.base, 1)} {unit}/h</span>
      </div>
      {perf.steps.map((s) => (
        <div key={s.group} className="flex items-center justify-between text-slate-600">
          <span>
            {s.groupLabel} <span className="text-slate-400">({s.optionLabel})</span>
          </span>
          <span className={cx('kw-tnum', s.deltaPct < 0 ? 'text-error-600' : 'text-brand-600')}>
            {s.deltaPct > 0 ? '+' : ''}
            {fmtNum(s.deltaPct, 1)} %
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-slate-200 pt-1 font-bold text-slate-800">
        <span>Effektiver Wert</span>
        <span className="kw-tnum">{fmtNum(perf.value, 1)} {unit}/h</span>
      </div>
      {perf.steps.length === 0 ? (
        <p className="text-slate-400">Alle Faktoren neutral — Standardwert unverändert.</p>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Kostenaufbau („Wie entsteht der Preis?“)
// ─────────────────────────────────────────────────────────────────────────────

export function CostBreakdown({ totals, showTitle = true }: { totals: CalcTotals; showTitle?: boolean }) {
  const sourceSub = (src: CalcTotals['materialSource']) =>
    src.mode === 'pctOfLabor'
      ? `${fmtNum(src.pctUsed ?? 0, 1)} % der Personalkosten${src.pctIsSuggestion ? ' (Vorschlag)' : ''}`
      : src.mode === 'fixed'
        ? 'fester Betrag je Monat'
        : undefined;
  const rows: { label: string; value: number; sub?: string }[] = [
    {
      label: 'Personalkosten',
      value: totals.laborCost,
      sub: `${fmtHours(totals.monthlyHours)} × ${fmtEur(totals.rate.employerRate)}/h (AG-Satz)`,
    },
    { label: 'Material', value: totals.materialCost, sub: sourceSub(totals.materialSource) },
    { label: 'Maschinen', value: totals.machineCost, sub: sourceSub(totals.machineSource) },
    {
      label: 'Fahrtkosten',
      value: totals.travel.total,
      sub: totals.travel.enabled
        ? `${fmtNum(totals.travel.kmPerMonth, 0)} km + ${fmtHours(totals.travel.timeHoursPerMonth, 1)} Fahrzeit`
        : 'deaktiviert',
    },
    {
      label: 'Gemeinkosten',
      value: totals.overheadCost,
      sub: totals.overheadEnabled
        ? `${fmtHours(totals.monthlyHours, 1)} × ${fmtEur(totals.overheadRate)}/h`
        : 'deaktiviert',
    },
    { label: `Risikozuschlag (${fmtPct(totals.riskPct, 1)})`, value: totals.riskCost },
  ];
  return (
    <div className="text-xs">
      {showTitle ? <p className="font-semibold text-slate-700 mb-2">So entsteht der Preis</p> : null}
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3">
            <span className="text-slate-600 min-w-0">
              {r.label}
              {r.sub ? <span className="block text-[10px] text-slate-400">{r.sub}</span> : null}
            </span>
            <span className="kw-tnum text-slate-800">{fmtEur(r.value)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
          <span>Selbstkosten</span>
          <span className="kw-tnum">{fmtEur(totals.selfCost)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Gewinn ({fmtPct(totals.selected.marginPct, 1)} Marge)</span>
          <span className="kw-tnum text-brand-700">{fmtEur(totals.selected.profit)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-slate-900">
          <span>Verkaufspreis (netto)</span>
          <span className="kw-tnum">{fmtEur(totals.selected.net)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>zzgl. {fmtNum(totals.vatPct, 0)} % MwSt.</span>
          <span className="kw-tnum">{fmtEur(totals.vatAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-700 font-semibold">
          <span>Brutto</span>
          <span className="kw-tnum">{fmtEur(totals.gross)}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Preisstrategien
// ─────────────────────────────────────────────────────────────────────────────

export function PriceStrategyTable({
  totals,
  calc,
  onSelect,
  onCompetitorChange,
  onCustomChange,
}: {
  totals: CalcTotals;
  calc: Calculation;
  onSelect: (strategy: Calculation['selectedPriceStrategy']) => void;
  onCompetitorChange: (v: number | null) => void;
  onCustomChange: (v: number | null) => void;
}) {
  const minMargin = useKwStore((st) => st.data.settings.calculation.minMarginPct);
  const rows: {
    key: Calculation['selectedPriceStrategy'];
    label: string;
    info?: string;
    price: { net: number; profit: number; marginPct: number } | null;
    editable?: 'competitor' | 'custom';
  }[] = [
    { key: 'min', label: 'Mindestpreis', info: `Mindestmarge ${fmtPct(minMargin, 0)}`, price: totals.prices.min },
    { key: 'target', label: 'Zielpreis', info: `Zielmarge ${fmtPct(calc.targetMarginPct, 0)}`, price: totals.prices.target },
    { key: 'premium', label: 'Premiumpreis', price: totals.prices.premium },
    { key: 'competitor', label: 'Wettbewerbspreis', price: totals.prices.competitor, editable: 'competitor' },
    { key: 'custom', label: 'Eigener Preis', price: totals.prices.custom, editable: 'custom' },
  ];

  return (
    <table className="kw-table">
      <thead>
        <tr>
          <th></th>
          <th>Preisstrategie</th>
          <th className="!text-right">Netto/Monat</th>
          <th className="!text-right">Gewinn</th>
          <th className="!text-right">Marge</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const selected = calc.selectedPriceStrategy === r.key;
          const belowMin = r.price != null && r.price.marginPct < minMargin;
          return (
            <tr key={r.key} className={selected ? '!bg-brand-50/60' : undefined}>
              <td className="w-8">
                <input
                  type="radio"
                  name="price-strategy"
                  checked={selected}
                  disabled={r.price == null}
                  onChange={() => onSelect(r.key)}
                  className="accent-[#188a3c] h-3.5 w-3.5 cursor-pointer"
                  aria-label={r.label}
                />
              </td>
              <td>
                <span className="font-semibold text-slate-800">{r.label}</span>
                {r.info ? <span className="block text-[10px] text-slate-400">{r.info}</span> : null}
              </td>
              <td className="text-right kw-tnum">
                {r.editable ? (
                  <NumberInput
                    cell
                    value={r.editable === 'competitor' ? calc.competitorPrice : calc.customPrice}
                    onChange={(v) => (r.editable === 'competitor' ? onCompetitorChange(v) : onCustomChange(v))}
                    suffix="€"
                    placeholder="—"
                    className="w-28 ml-auto"
                  />
                ) : r.price ? (
                  <span className="font-semibold">{fmtEur(r.price.net)}</span>
                ) : (
                  '—'
                )}
              </td>
              <td className="text-right kw-tnum text-slate-600">{r.price ? fmtEur(r.price.profit) : '—'}</td>
              <td className="text-right kw-tnum">
                {r.price ? (
                  <span className={cx('font-semibold', belowMin ? 'text-error-600' : 'text-brand-700')}>
                    {fmtPct(r.price.marginPct, 1)}
                  </span>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
