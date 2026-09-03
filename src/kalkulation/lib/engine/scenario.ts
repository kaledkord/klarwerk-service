/**
 * Szenario-Rechner (Was-wäre-wenn):
 * Marge ändern, Leistungswerte ±%, Turnus-Faktor — ohne die
 * Original-Kalkulation zu verändern.
 */

import type { Calculation, Scenario } from '../types';
import {
  computeCalculation,
  computeLine,
  type CalcTotals,
  type EngineContext,
} from './calculation';

export interface ScenarioResult {
  scenario: Scenario;
  totals: CalcTotals;
}

export function applyScenario(
  calc: Calculation,
  scenario: Scenario,
  ctx: EngineContext
): Calculation {
  const perfFactor = 1 + scenario.performanceDeltaPct / 100;
  return {
    ...calc,
    targetMarginPct: scenario.marginPct != null ? scenario.marginPct : calc.targetMarginPct,
    selectedPriceStrategy: 'target',
    lines: calc.lines.map((l) => {
      // Aktuelle Durchführungen (automatisch oder manuell) ermitteln und
      // exakt mit dem Turnus-Faktor skalieren.
      const current = computeLine(l, calc, ctx);
      const scaledExec =
        scenario.frequencyFactor !== 1 && current.recurring
          ? current.executionsPerMonth * scenario.frequencyFactor
          : null;
      return {
        ...l,
        basePerformanceValue: l.basePerformanceValue * perfFactor,
        manualPerformanceValue:
          l.manualPerformanceValue != null
            ? l.manualPerformanceValue * perfFactor
            : l.manualPerformanceValue,
        manualExecutionsPerMonth:
          scaledExec != null ? scaledExec : l.manualExecutionsPerMonth,
      };
    }),
  };
}

export function computeScenario(
  calc: Calculation,
  scenario: Scenario,
  ctx: EngineContext
): ScenarioResult {
  const transformed = applyScenario(calc, scenario, ctx);
  return { scenario, totals: computeCalculation(transformed, ctx) };
}
