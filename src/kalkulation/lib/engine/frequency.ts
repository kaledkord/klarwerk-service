/**
 * Turnus-Engine: rechnet jeden Turnus in durchschnittliche
 * Durchführungen pro Monat und Jahr um.
 *
 * Grundlage: weeksPerMonth (Standard 52/12 ≈ 4,3333) — zentral in den
 * Einstellungen konfigurierbar, damit alle Formeln nachvollziehbar bleiben.
 */

import type { Frequency, FrequencyKind } from '../types';

export const DAYS_PER_MONTH = 365 / 12; // ≈ 30,417

export interface FrequencyMath {
  executionsPerMonth: number;
  executionsPerYear: number;
  /** true bei einmaligen Leistungen. */
  oneTime: boolean;
  /** true bei „nach Bedarf“ (Abruf, keine feste Wiederholung). */
  onDemand: boolean;
}

export function executionsPerMonth(freq: Frequency, weeksPerMonth: number): FrequencyMath {
  const perMonth = (v: number): FrequencyMath => ({
    executionsPerMonth: v,
    executionsPerYear: v * 12,
    oneTime: false,
    onDemand: false,
  });

  switch (freq.kind) {
    case 'perDay': {
      const workdays = freq.workdaysPerWeek ?? 5;
      return perMonth(freq.count * workdays * weeksPerMonth);
    }
    case 'perWeek':
      return perMonth(freq.count * weeksPerMonth);
    case 'everyNWeeks': {
      const n = Math.max(1, freq.intervalWeeks ?? 2);
      return perMonth(weeksPerMonth / n);
    }
    case 'everyNDays': {
      const n = Math.max(1, freq.intervalDays ?? 10);
      return perMonth(DAYS_PER_MONTH / n);
    }
    case 'perMonth':
      return perMonth(freq.count);
    case 'perYear':
      return perMonth(freq.count / 12);
    case 'oneTime':
      return { executionsPerMonth: 0, executionsPerYear: 0, oneTime: true, onDemand: false };
    case 'onDemand':
      return { executionsPerMonth: 0, executionsPerYear: 0, oneTime: false, onDemand: true };
    default: {
      const _exhaustive: never = freq.kind;
      void _exhaustive;
      return perMonth(0);
    }
  }
}

/** Lesbare Beschreibung der Umrechnung, z. B. „2 × 52 ÷ 12 = 8,67 / Monat“. */
export function frequencyFormula(freq: Frequency, weeksPerMonth: number): string {
  switch (freq.kind) {
    case 'perDay': {
      const w = freq.workdaysPerWeek ?? 5;
      return `${freq.count} × ${w} Tage × ${fmt(weeksPerMonth)} Wochen/Monat`;
    }
    case 'perWeek':
      return `${freq.count} × ${fmt(weeksPerMonth)} Wochen/Monat`;
    case 'everyNWeeks':
      return `${fmt(weeksPerMonth)} ÷ ${freq.intervalWeeks ?? 2} Wochen`;
    case 'everyNDays':
      return `${fmt(DAYS_PER_MONTH)} Tage/Monat ÷ ${freq.intervalDays ?? 10} Tage`;
    case 'perMonth':
      return `${freq.count} je Monat`;
    case 'perYear':
      return `${freq.count} ÷ 12 Monate`;
    case 'oneTime':
      return 'Einmalige Leistung';
    case 'onDemand':
      return 'Nach Bedarf (je Abruf)';
    default:
      return '';
  }
}

function fmt(v: number): string {
  return v.toLocaleString('de-DE', { maximumFractionDigits: 3 });
}

/** Erstellt einen benutzerdefinierten Turnus aus Kind + Parametern. */
export function makeCustomFrequency(
  partial: Pick<Frequency, 'name' | 'kind' | 'count'> &
    Partial<Pick<Frequency, 'workdaysPerWeek' | 'intervalDays' | 'intervalWeeks'>>,
  id: string,
  sortOrder: number
): Frequency {
  return {
    id,
    name: partial.name,
    kind: partial.kind as FrequencyKind,
    count: partial.count,
    workdaysPerWeek: partial.workdaysPerWeek,
    intervalDays: partial.intervalDays,
    intervalWeeks: partial.intervalWeeks,
    system: false,
    active: true,
    sortOrder,
  };
}
