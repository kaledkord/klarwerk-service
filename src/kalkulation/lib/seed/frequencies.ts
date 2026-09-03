import type { Frequency } from '../types';

/**
 * Standard-Turnusse. IDs sind stabil (fq_*), damit Leistungen und
 * Demo-Daten referenzieren können.
 */
export const SEED_FREQUENCIES: Frequency[] = [
  { id: 'fq_2x_taeglich', name: '2× täglich (Mo–Fr)', kind: 'perDay', count: 2, workdaysPerWeek: 5, system: true, active: true, sortOrder: 10 },
  { id: 'fq_taeglich', name: 'täglich (Mo–Fr)', kind: 'perDay', count: 1, workdaysPerWeek: 5, system: true, active: true, sortOrder: 20 },
  { id: 'fq_mo_sa', name: 'Montag bis Samstag (6×)', kind: 'perDay', count: 1, workdaysPerWeek: 6, system: true, active: true, sortOrder: 30 },
  { id: 'fq_taeglich_7', name: 'täglich (7 Tage)', kind: 'perDay', count: 1, workdaysPerWeek: 7, system: true, active: true, sortOrder: 40 },
  { id: 'fq_6w', name: '6× wöchentlich', kind: 'perWeek', count: 6, system: true, active: true, sortOrder: 50 },
  { id: 'fq_5w', name: '5× wöchentlich', kind: 'perWeek', count: 5, system: true, active: true, sortOrder: 60 },
  { id: 'fq_4w', name: '4× wöchentlich', kind: 'perWeek', count: 4, system: true, active: true, sortOrder: 70 },
  { id: 'fq_3w', name: '3× wöchentlich', kind: 'perWeek', count: 3, system: true, active: true, sortOrder: 80 },
  { id: 'fq_2w', name: '2× wöchentlich', kind: 'perWeek', count: 2, system: true, active: true, sortOrder: 90 },
  { id: 'fq_1w', name: '1× wöchentlich', kind: 'perWeek', count: 1, system: true, active: true, sortOrder: 100 },
  { id: 'fq_14t', name: 'alle 2 Wochen', kind: 'everyNWeeks', count: 1, intervalWeeks: 2, system: true, active: true, sortOrder: 110 },
  { id: 'fq_2m', name: '2× monatlich', kind: 'perMonth', count: 2, system: true, active: true, sortOrder: 120 },
  { id: 'fq_1m', name: '1× monatlich', kind: 'perMonth', count: 1, system: true, active: true, sortOrder: 130 },
  { id: 'fq_quartal', name: 'quartalsweise', kind: 'perYear', count: 4, system: true, active: true, sortOrder: 140 },
  { id: 'fq_halbjahr', name: 'halbjährlich', kind: 'perYear', count: 2, system: true, active: true, sortOrder: 150 },
  { id: 'fq_jahr', name: 'jährlich', kind: 'perYear', count: 1, system: true, active: true, sortOrder: 160 },
  { id: 'fq_einmalig', name: 'einmalig', kind: 'oneTime', count: 1, system: true, active: true, sortOrder: 170 },
  { id: 'fq_bedarf', name: 'nach Bedarf', kind: 'onDemand', count: 1, system: true, active: true, sortOrder: 180 },
];
