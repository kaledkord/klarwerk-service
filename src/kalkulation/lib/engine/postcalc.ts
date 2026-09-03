/**
 * Nachkalkulation: Soll/Ist-Vergleich je Monat, Abweichungsanalyse
 * und Datenbasis für die „lernende Kalkulation“.
 */

import type { Calculation, PostCalcEntry } from '../types';
import type { CalcTotals, EngineContext } from './calculation';
import { employerRate } from './calculation';

export interface PostCalcAnalysis {
  months: number;
  avgActualHours: number;
  plannedHours: number;
  hoursDeltaAbs: number;
  hoursDeltaPct: number;
  avgActualMaterial: number;
  plannedMaterial: number;
  materialDeltaAbs: number;
  materialDeltaPct: number;
  /** Geschätzte tatsächliche Kosten je Monat (Ist-Stunden × AG-Satz + Ist-Material + Fahrt + GK + Risiko anteilig). */
  actualCost: number;
  plannedCost: number;
  actualMarginPct: number;
  plannedMarginPct: number;
  revenue: number;
}

export const DEVIATION_REASONS = [
  'Leistungswert zu hoch angesetzt',
  'Verschmutzung unterschätzt',
  'Zu viele Laufwege',
  'Personal langsamer als geplant',
  'Zusatzleistungen erbracht',
  'Materialkosten gestiegen',
  'Falscher Turnus hinterlegt',
  'Falsche Mengen erfasst',
] as const;

export function analyzePostCalc(
  calc: Calculation,
  totals: CalcTotals,
  ctx: EngineContext
): PostCalcAnalysis | null {
  const entries = calc.postCalc;
  if (entries.length === 0) return null;
  const avg = (fn: (e: PostCalcEntry) => number) =>
    entries.reduce((s, e) => s + fn(e), 0) / entries.length;

  const avgActualHours = avg((e) => e.actualHours);
  const avgActualMaterial = avg((e) => e.actualMaterialCost);
  const rate = employerRate(ctx.settings, calc.wageOverride).employerRate;

  const overheadActual = totals.overheadEnabled ? totals.overheadRate * avgActualHours : 0;
  const baseActual = avgActualHours * rate + avgActualMaterial + totals.machineCost + totals.travel.total + overheadActual;
  const actualCost = baseActual * (1 + totals.riskPct / 100);

  const revenue = totals.selected.net;
  const plannedHours = totals.monthlyHours;
  const plannedMaterial = totals.materialCost;

  return {
    months: entries.length,
    avgActualHours,
    plannedHours,
    hoursDeltaAbs: avgActualHours - plannedHours,
    hoursDeltaPct: plannedHours > 0 ? ((avgActualHours - plannedHours) / plannedHours) * 100 : 0,
    avgActualMaterial,
    plannedMaterial,
    materialDeltaAbs: avgActualMaterial - plannedMaterial,
    materialDeltaPct:
      plannedMaterial > 0 ? ((avgActualMaterial - plannedMaterial) / plannedMaterial) * 100 : 0,
    actualCost,
    plannedCost: totals.selfCost,
    actualMarginPct: revenue > 0 ? ((revenue - actualCost) / revenue) * 100 : 0,
    plannedMarginPct: totals.selected.marginPct,
    revenue,
  };
}

/**
 * Lernende Kalkulation: aggregiert Soll/Ist-Verhältnisse über alle
 * Kalkulationen mit Nachkalkulationsdaten. Werte werden NIE automatisch
 * übernommen — nur als Empfehlung angezeigt.
 */
export interface LearningInsight {
  calculationCount: number;
  avgRatio: number; // Ist ÷ Soll (z. B. 1,15 = 15 % mehr Stunden als kalkuliert)
  suggestedPerformanceFactor: number; // Kehrwert, z. B. 0,87
  details: { calcName: string; plannedHours: number; actualHours: number; ratio: number }[];
}

export function learningInsight(
  calculations: { calc: Calculation; totals: CalcTotals }[]
): LearningInsight | null {
  const details = calculations
    .filter(({ calc, totals }) => calc.postCalc.length > 0 && totals.monthlyHours > 0)
    .map(({ calc, totals }) => {
      const avgActual =
        calc.postCalc.reduce((s, e) => s + e.actualHours, 0) / calc.postCalc.length;
      return {
        calcName: calc.name,
        plannedHours: totals.monthlyHours,
        actualHours: avgActual,
        ratio: avgActual / totals.monthlyHours,
      };
    })
    .filter((d) => d.ratio > 0.2 && d.ratio < 5);

  if (details.length === 0) return null;
  const avgRatio = details.reduce((s, d) => s + d.ratio, 0) / details.length;
  return {
    calculationCount: details.length,
    avgRatio,
    suggestedPerformanceFactor: 1 / avgRatio,
    details,
  };
}
