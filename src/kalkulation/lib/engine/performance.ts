/**
 * Leistungswerte-Engine: leitet aus Standard-Leistungswert und
 * Anpassungsfaktoren den effektiven Leistungswert her — transparent,
 * Schritt für Schritt nachvollziehbar.
 */

import {
  FACTOR_GROUP_LABELS,
  type FactorGroupKey,
  type FactorSelection,
  type PerformanceFactorConfig,
  type Unit,
} from '../types';

export interface PerfStep {
  group: FactorGroupKey;
  groupLabel: string;
  optionLabel: string;
  multiplier: number;
  /** Prozentuale Wirkung, z. B. −15. */
  deltaPct: number;
}

export interface PerfDerivation {
  base: number;
  steps: PerfStep[];
  /** Effektiver Leistungswert (Einheiten/h). */
  value: number;
  manual: boolean;
  manualReason?: string;
}

export const FACTOR_GROUP_ORDER: FactorGroupKey[] = [
  'soiling',
  'frequentation',
  'furnishing',
  'accessibility',
  'hygiene',
];

export function derivePerformanceValue(
  base: number,
  factors: FactorSelection,
  config: PerformanceFactorConfig,
  manualValue?: number | null,
  manualReason?: string
): PerfDerivation {
  if (manualValue != null && manualValue > 0) {
    return { base, steps: [], value: manualValue, manual: true, manualReason };
  }
  const steps: PerfStep[] = [];
  let value = base;
  for (const group of FACTOR_GROUP_ORDER) {
    const key = factors[group];
    const option = config[group]?.find((o) => o.key === key);
    if (!option) continue;
    if (option.multiplier !== 1) {
      steps.push({
        group,
        groupLabel: FACTOR_GROUP_LABELS[group],
        optionLabel: option.label,
        multiplier: option.multiplier,
        deltaPct: Math.round((option.multiplier - 1) * 1000) / 10,
      });
    }
    value *= option.multiplier;
  }
  return { base, steps, value, manual: false };
}

/**
 * Plausibilitätsbereiche je Einheit (Einheiten/h) für Warnungen —
 * bewusst großzügig, um branchenübliche Spannen abzudecken.
 */
export const PLAUSIBLE_PERFORMANCE: Record<Unit, [number, number]> = {
  'm²': [15, 1500],
  'Stk.': [2, 200],
  m: [15, 800],
  h: [1, 1],
  Pauschale: [1, 1],
};

export function isPerformancePlausible(unit: Unit, value: number): boolean {
  if (unit === 'h' || unit === 'Pauschale') return true;
  const [min, max] = PLAUSIBLE_PERFORMANCE[unit];
  return value >= min && value <= max;
}
