/**
 * Intelligente Warnungen + Kalkulations-Health-Score (0–100).
 * Der Score entsteht aus definierten, transparenten Prüfungen —
 * jede Prüfung zeigt, warum Punkte vergeben oder abgezogen wurden.
 */

import type { Calculation } from '../types';
import type { CalcTotals, EngineContext } from './calculation';
import { isPerformancePlausible } from './performance';

export type WarningSeverity = 'error' | 'warn' | 'info' | 'ok';

export interface CalcWarning {
  severity: WarningSeverity;
  code: string;
  message: string;
}

export interface HealthCheck {
  label: string;
  passed: boolean;
  points: number;
  earned: number;
  detail?: string;
}

export interface HealthResult {
  score: number;
  checks: HealthCheck[];
}

export function computeWarnings(
  calc: Calculation,
  totals: CalcTotals,
  ctx: EngineContext
): CalcWarning[] {
  const { settings } = ctx;
  const w: CalcWarning[] = [];
  const minMargin = settings.calculation.minMarginPct;
  const warnMargin = settings.calculation.warnMarginPct;
  const hasLines = calc.lines.length > 0;
  const recurring = totals.lines.filter((l) => l.recurring);

  if (hasLines && totals.selected.net < totals.selfCost) {
    w.push({
      severity: 'error',
      code: 'price_below_cost',
      message: 'Verkaufspreis liegt unter den Selbstkosten.',
    });
  }
  if (hasLines && totals.selected.marginPct < minMargin) {
    w.push({
      severity: 'error',
      code: 'margin_below_min',
      message: `Marge ${fmtPct(totals.selected.marginPct)} liegt unter der Mindestmarge von ${fmtPct(minMargin)}.`,
    });
  } else if (hasLines && totals.selected.marginPct < warnMargin) {
    w.push({
      severity: 'warn',
      code: 'margin_below_warn',
      message: `Marge ${fmtPct(totals.selected.marginPct)} liegt unter der Warnschwelle von ${fmtPct(warnMargin)}.`,
    });
  }
  if (hasLines && recurring.length > 0 && totals.materialCost === 0) {
    w.push({
      severity: 'warn',
      code: 'no_material',
      message: 'Keine Materialkosten hinterlegt.',
    });
  }
  if (hasLines && !calc.travel.enabled) {
    w.push({
      severity: 'warn',
      code: 'no_travel',
      message: 'Fahrtkosten sind nicht berücksichtigt.',
    });
  }
  if (hasLines && !calc.overheadEnabled) {
    w.push({
      severity: 'warn',
      code: 'no_overhead',
      message: 'Gemeinkosten sind nicht aktiviert.',
    });
  }

  const implausible = calc.lines.filter((line) => {
    const res = totals.lines.find((r) => r.lineId === line.id);
    if (!res || line.unit === 'h' || line.unit === 'Pauschale') return false;
    return !isPerformancePlausible(line.unit, res.perf.value);
  });
  for (const line of implausible) {
    const res = totals.lines.find((r) => r.lineId === line.id)!;
    w.push({
      severity: 'error',
      code: 'implausible_performance',
      message: `Leistungswert ungewöhnlich (${fmtNum(res.perf.value)} ${line.unit}/h) bei „${line.serviceName}“ (${line.roomLabel}).`,
    });
  }

  const manualNoReason = calc.lines.filter(
    (l) => l.manualPerformanceValue != null && !l.manualPerformanceReason?.trim()
  );
  const manualLines = calc.lines.filter((l) => l.manualPerformanceValue != null);
  if (manualLines.length > 0) {
    w.push({
      severity: 'warn',
      code: 'manual_performance',
      message: `${manualLines.length} Leistungswert(e) manuell angepasst${
        manualNoReason.length > 0 ? ` — ${manualNoReason.length} ohne Begründung` : ''
      }.`,
    });
  }

  const zeroQty = calc.lines.filter((l) => l.quantity <= 0);
  if (zeroQty.length > 0) {
    w.push({
      severity: 'error',
      code: 'zero_quantity',
      message: `${zeroQty.length} Position(en) ohne Menge.`,
    });
  }

  if (hasLines && recurring.length > 0 && totals.monthlyHours > 0 && totals.monthlyHours < 2) {
    w.push({
      severity: 'warn',
      code: 'very_low_hours',
      message: `Kalkulierte Sollstunden sehr niedrig (${fmtNum(totals.monthlyHours)} h/Monat) — bitte prüfen.`,
    });
  }

  if (!calc.customerId || !calc.objectId) {
    w.push({
      severity: 'info',
      code: 'incomplete_links',
      message: 'Kalkulation ist noch nicht vollständig mit Kunde und Objekt verknüpft.',
    });
  }

  if (w.length === 0 && hasLines) {
    w.push({ severity: 'ok', code: 'complete', message: 'Kalkulation vollständig — keine Auffälligkeiten.' });
  }
  return w;
}

export function computeHealth(
  calc: Calculation,
  totals: CalcTotals,
  ctx: EngineContext
): HealthResult {
  const { settings } = ctx;
  const checks: HealthCheck[] = [];
  const add = (label: string, points: number, passed: boolean, detail?: string) => {
    checks.push({ label, points, passed, earned: passed ? points : 0, detail });
  };

  const hasLines = calc.lines.length > 0;
  add('Kunde und Objekt verknüpft', 8, Boolean(calc.customerId && calc.objectId));
  add('Mindestens eine Leistungsposition', 8, hasLines);
  add(
    'Alle Positionen mit Menge > 0',
    10,
    hasLines && calc.lines.every((l) => l.quantity > 0),
    hasLines ? undefined : 'Keine Positionen vorhanden'
  );
  add(
    'Alle Positionen mit gültigem Turnus',
    10,
    hasLines && calc.lines.every((l) => ctx.frequencies.some((f) => f.id === l.frequencyId))
  );
  add(
    'Leistungswerte im plausiblen Bereich',
    10,
    hasLines &&
      totals.lines.every((r) => {
        const line = calc.lines.find((l) => l.id === r.lineId)!;
        return isPerformancePlausible(line.unit, r.perf.value);
      })
  );
  add(
    'Materialkosten berücksichtigt',
    8,
    hasLines && (totals.materialCost > 0 || calc.lines.some((l) => l.materialMode !== 'none'))
  );
  add('Fahrtkosten aktiviert', 8, calc.travel.enabled);
  add('Gemeinkosten aktiviert', 10, calc.overheadEnabled);
  add(
    `Marge ≥ Mindestmarge (${fmtPct(settings.calculation.minMarginPct)})`,
    14,
    hasLines && totals.selected.marginPct >= settings.calculation.minMarginPct,
    `Aktuell ${fmtPct(totals.selected.marginPct)}`
  );
  add('Verkaufspreis ≥ Selbstkosten', 10, hasLines && totals.selected.net >= totals.selfCost);
  add(
    'Manuelle Anpassungen begründet',
    4,
    calc.lines.every((l) => l.manualPerformanceValue == null || Boolean(l.manualPerformanceReason?.trim()))
  );

  const score = checks.reduce((s, c) => s + c.earned, 0);
  return { score, checks };
}

function fmtPct(v: number): string {
  return `${v.toLocaleString('de-DE', { maximumFractionDigits: 1 })} %`;
}
function fmtNum(v: number): string {
  return v.toLocaleString('de-DE', { maximumFractionDigits: 2 });
}
