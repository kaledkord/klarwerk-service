/**
 * Kalkulations-Engine — zentrale, nachvollziehbare Berechnungslogik.
 *
 * Grundformeln:
 *   Zeit je Durchführung   = Menge ÷ effektiver Leistungswert
 *   Monatsstunden          = Zeit je Durchführung × Durchführungen/Monat
 *   Personalkosten         = Monatsstunden × Arbeitgeberstundensatz × (1 + Zuschlag)
 *   Gesamtkosten           = Personal + Material + Maschinen + Fahrt + Gemeinkosten + Risiko
 *   Verkaufspreis (Marge)  = Gesamtkosten ÷ (1 − Zielmarge)
 *   Verkaufspreis (Aufschlag) = Gesamtkosten × (1 + Aufschlag)
 */

import type {
  CalcLine,
  Calculation,
  Frequency,
  Machine,
  PriceStrategy,
  RoundingMode,
  Settings,
  SurchargeKey,
} from '../types';
import { executionsPerMonth } from './frequency';
import { derivePerformanceValue, type PerfDerivation } from './performance';

// ─────────────────────────────────────────────────────────────────────────────
// Kontext
// ─────────────────────────────────────────────────────────────────────────────

export interface EngineContext {
  settings: Settings;
  frequencies: Frequency[];
  machines: Machine[];
}

export function frequencyById(ctx: EngineContext, id: string): Frequency | undefined {
  return ctx.frequencies.find((f) => f.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Personal: Arbeitgeberstundensatz
// ─────────────────────────────────────────────────────────────────────────────

export interface LaborRateInfo {
  baseWage: number;
  componentsPct: number;
  /** Vollständiger Arbeitgeberstundensatz €/h. */
  employerRate: number;
  components: { label: string; pct: number; amount: number }[];
}

export function employerRate(settings: Settings, wageOverride?: number | null): LaborRateInfo {
  const baseWage = wageOverride != null && wageOverride > 0 ? wageOverride : settings.labor.baseWage;
  const components = settings.labor.components.map((c) => ({
    label: c.label,
    pct: c.pct,
    amount: (baseWage * c.pct) / 100,
  }));
  const componentsPct = settings.labor.components.reduce((s, c) => s + c.pct, 0);
  return {
    baseWage,
    componentsPct,
    employerRate: baseWage * (1 + componentsPct / 100),
    components,
  };
}

export function surchargePct(settings: Settings, key: SurchargeKey): number {
  if (key === 'none') return 0;
  return settings.labor.surcharges.find((s) => s.key === key)?.pct ?? 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemeinkosten
// ─────────────────────────────────────────────────────────────────────────────

export interface OverheadInfo {
  monthlyTotal: number;
  productiveHours: number;
  ratePerHour: number;
}

export function overheadInfo(settings: Settings): OverheadInfo {
  const monthlyTotal = settings.overhead.positions.reduce((s, p) => s + p.amount, 0);
  const productiveHours = Math.max(1, settings.overhead.productiveHoursPerMonth);
  return { monthlyTotal, productiveHours, ratePerHour: monthlyTotal / productiveHours };
}

// ─────────────────────────────────────────────────────────────────────────────
// Einzelposition
// ─────────────────────────────────────────────────────────────────────────────

export interface LineResult {
  lineId: string;
  perf: PerfDerivation;
  timePerExecutionH: number;
  timeManual: boolean;
  executionsPerMonth: number;
  executionsPerYear: number;
  execManual: boolean;
  monthlyHours: number;
  yearlyHours: number;
  surchargePct: number;
  laborCost: number;
  materialCost: number;
  machineCost: number;
  /** Direkte Monatskosten (Personal + Material + Maschine). */
  directCost: number;
  recurring: boolean;
  oneTime: boolean;
  onDemand: boolean;
  /** Bei einmalig/Abruf: Kosten je Durchführung. */
  perExecutionCost: number;
  frequencyName: string;
}

export function computeLine(line: CalcLine, calc: Calculation, ctx: EngineContext): LineResult {
  const { settings } = ctx;
  const freq = frequencyById(ctx, line.frequencyId);
  const rate = employerRate(settings, calc.wageOverride).employerRate;

  const perf = derivePerformanceValue(
    line.basePerformanceValue,
    line.factors,
    settings.performanceFactors,
    line.manualPerformanceValue,
    line.manualPerformanceReason
  );

  // Zeit je Durchführung
  let timePerExecutionH: number;
  let timeManual = false;
  if (line.manualTimePerExecutionH != null && line.manualTimePerExecutionH > 0) {
    timePerExecutionH = line.manualTimePerExecutionH;
    timeManual = true;
  } else if (line.unit === 'h' || line.unit === 'Pauschale') {
    timePerExecutionH = line.quantity;
  } else {
    timePerExecutionH = perf.value > 0 ? line.quantity / perf.value : 0;
  }

  // Turnus
  const fm = freq
    ? executionsPerMonth(freq, settings.calculation.weeksPerMonth)
    : { executionsPerMonth: 0, executionsPerYear: 0, oneTime: false, onDemand: false };
  let execPerMonth = fm.executionsPerMonth;
  let execManual = false;
  if (line.manualExecutionsPerMonth != null && line.manualExecutionsPerMonth >= 0) {
    execPerMonth = line.manualExecutionsPerMonth;
    execManual = true;
  }
  const recurring = !fm.oneTime && !fm.onDemand;
  const monthlyHours = recurring ? timePerExecutionH * execPerMonth : 0;

  // Zuschlag (nur auf die tatsächlich betroffenen Stunden dieser Position)
  const sPct = surchargePct(settings, line.surchargeKey);
  const laborCost = monthlyHours * rate * (1 + sPct / 100);

  // Material je Modus
  let materialCost = 0;
  switch (line.materialMode) {
    case 'perHour':
      materialCost = line.materialValue * monthlyHours;
      break;
    case 'perExecution':
      materialCost = line.materialValue * (recurring ? execPerMonth : 0);
      break;
    case 'perSqmMonth':
      materialCost = line.unit === 'm²' ? line.materialValue * line.quantity : line.materialValue;
      break;
    case 'perMonth':
      materialCost = line.materialValue;
      break;
    case 'none':
    default:
      materialCost = 0;
  }

  // Maschine
  const machine = line.machineId ? ctx.machines.find((m) => m.id === line.machineId) : undefined;
  const machineCost = machine ? machine.hourlyRate * monthlyHours : 0;

  // Kosten je Durchführung (für einmalig / nach Bedarf)
  const perExecLabor = timePerExecutionH * rate * (1 + sPct / 100);
  const perExecMaterial =
    line.materialMode === 'perExecution'
      ? line.materialValue
      : line.materialMode === 'perHour'
        ? line.materialValue * timePerExecutionH
        : 0;
  const perExecMachine = machine ? machine.hourlyRate * timePerExecutionH : 0;
  const perExecutionCost = perExecLabor + perExecMaterial + perExecMachine;

  return {
    lineId: line.id,
    perf,
    timePerExecutionH,
    timeManual,
    executionsPerMonth: recurring ? execPerMonth : 0,
    executionsPerYear: recurring ? execPerMonth * 12 : 0,
    execManual,
    monthlyHours,
    yearlyHours: monthlyHours * 12,
    surchargePct: sPct,
    laborCost,
    materialCost: recurring ? materialCost : 0,
    machineCost,
    directCost: laborCost + (recurring ? materialCost : 0) + machineCost,
    recurring,
    oneTime: fm.oneTime,
    onDemand: fm.onDemand,
    perExecutionCost,
    frequencyName: freq?.name ?? '—',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Preisberechnung
// ─────────────────────────────────────────────────────────────────────────────

export interface PriceInfo {
  net: number;
  profit: number;
  /** Echte Gewinnmarge vom Verkaufspreis in %. */
  marginPct: number;
}

export function roundPrice(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'cent':
      return Math.round(value * 100) / 100;
    case 'zehnCent':
      return Math.round(value * 10) / 10;
    case 'fuenfzigCent':
      return Math.round(value * 2) / 2;
    case 'euro':
      return Math.round(value);
    case 'none':
    default:
      return value;
  }
}

/**
 * Preis aus Kosten und Zielwert.
 * mode 'margin': echte Zielmarge vom Verkaufspreis → Preis = Kosten ÷ (1 − m)
 * mode 'markup': Aufschlag auf die Kosten → Preis = Kosten × (1 + m)
 */
export function priceFromCost(
  cost: number,
  pct: number,
  mode: 'margin' | 'markup',
  rounding: RoundingMode
): PriceInfo {
  const m = pct / 100;
  let net: number;
  if (mode === 'margin') {
    net = m >= 1 ? cost : cost / (1 - m);
  } else {
    net = cost * (1 + m);
  }
  net = roundPrice(net, rounding);
  const profit = net - cost;
  return { net, profit, marginPct: net > 0 ? (profit / net) * 100 : 0 };
}

export function priceInfoForNet(net: number, cost: number): PriceInfo {
  const profit = net - cost;
  return { net, profit, marginPct: net > 0 ? (profit / net) * 100 : 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Gesamtkalkulation
// ─────────────────────────────────────────────────────────────────────────────

export interface TravelResult {
  enabled: boolean;
  tripsPerMonth: number;
  tripsAuto: boolean;
  kmPerMonth: number;
  kmCost: number;
  timeHoursPerMonth: number;
  timeCost: number;
  total: number;
}

/** Herkunft der Material-/Maschinenkosten (Positionen, % vom Personal, fest). */
export interface CostSourceInfo {
  mode: 'lines' | 'pctOfLabor' | 'fixed';
  /** Angewendeter Prozentsatz (bei 'pctOfLabor'). */
  pctUsed: number | null;
  /** true, wenn der Vorschlagswert aus den Einstellungen verwendet wurde. */
  pctIsSuggestion: boolean;
  /** Summe aus den Positionen (zum Vergleich immer mitgeliefert). */
  lineSum: number;
  value: number;
}

export interface CalcTotals {
  lines: LineResult[];
  monthlyHours: number;
  yearlyHours: number;
  laborCost: number;
  materialCost: number;
  machineCost: number;
  materialSource: CostSourceInfo;
  machineSource: CostSourceInfo;
  directCost: number;
  travel: TravelResult;
  overheadRate: number;
  overheadCost: number;
  overheadEnabled: boolean;
  riskPct: number;
  riskCost: number;
  /** Selbstkosten gesamt je Monat. */
  selfCost: number;
  rate: LaborRateInfo;
  prices: {
    min: PriceInfo;
    target: PriceInfo;
    premium: PriceInfo;
    competitor: PriceInfo | null;
    custom: PriceInfo | null;
  };
  selectedStrategy: PriceStrategy;
  selected: PriceInfo;
  vatPct: number;
  vatAmount: number;
  gross: number;
  avgHourlyRevenue: number;
  oneTime: { hours: number; cost: number; price: PriceInfo } | null;
  /** Anteilige Vollkosten & Preise je Position (proportional zum Direktkostenanteil). */
  perLine: Record<string, { fullCost: number; price: number }>;
  totalAreaSqm: number;
}

export function computeCalculation(calc: Calculation, ctx: EngineContext): CalcTotals {
  const { settings } = ctx;
  const rate = employerRate(settings, calc.wageOverride);

  const lines = calc.lines.map((l) => computeLine(l, calc, ctx));
  const recurringLines = lines.filter((l) => l.recurring);
  const monthlyHours = recurringLines.reduce((s, l) => s + l.monthlyHours, 0);
  const laborCost = recurringLines.reduce((s, l) => s + l.laborCost, 0);
  const lineMaterialSum = recurringLines.reduce((s, l) => s + l.materialCost, 0);
  const lineMachineSum = recurringLines.reduce((s, l) => s + l.machineCost, 0);

  // Individuelle Kostenermittlung: aus Positionen, % vom Personal oder fest
  const resolveOverride = (
    override: Calculation['materialOverride'],
    lineSum: number,
    suggestedPct: number
  ): CostSourceInfo => {
    const mode = override?.mode ?? 'lines';
    if (mode === 'pctOfLabor') {
      const pctUsed = override.pct != null ? override.pct : suggestedPct;
      return {
        mode,
        pctUsed,
        pctIsSuggestion: override.pct == null,
        lineSum,
        value: (laborCost * pctUsed) / 100,
      };
    }
    if (mode === 'fixed') {
      return { mode, pctUsed: null, pctIsSuggestion: false, lineSum, value: override.fixed ?? 0 };
    }
    return { mode: 'lines', pctUsed: null, pctIsSuggestion: false, lineSum, value: lineSum };
  };

  const materialSource = resolveOverride(
    calc.materialOverride,
    lineMaterialSum,
    settings.costSuggestions.materialPctOfLabor
  );
  const machineSource = resolveOverride(
    calc.machineOverride,
    lineMachineSum,
    settings.costSuggestions.machinePctOfLabor
  );
  const materialCost = materialSource.value;
  const machineCost = machineSource.value;
  const directCost = laborCost + materialCost + machineCost;

  // Fahrtkosten
  const maxExec = recurringLines.reduce((m, l) => Math.max(m, l.executionsPerMonth), 0);
  const autoTrips = Math.round(maxExec * 10) / 10;
  const trips = calc.travel.tripsPerMonth != null ? calc.travel.tripsPerMonth : autoTrips;
  const kmPerTrip = calc.travel.distanceKm * 2; // Hin- und Rückfahrt
  const kmPerMonth = calc.travel.enabled ? kmPerTrip * trips : 0;
  const kmCost = kmPerMonth * settings.travel.costPerKm;
  const timePerTripH =
    settings.travel.avgSpeedKmh > 0 ? kmPerTrip / settings.travel.avgSpeedKmh : 0;
  const timeHoursPerMonth = calc.travel.enabled && calc.travel.payTravelTime ? timePerTripH * trips : 0;
  const timeCost = timeHoursPerMonth * rate.employerRate;
  const travel: TravelResult = {
    enabled: calc.travel.enabled,
    tripsPerMonth: trips,
    tripsAuto: calc.travel.tripsPerMonth == null,
    kmPerMonth,
    kmCost,
    timeHoursPerMonth,
    timeCost,
    total: kmCost + timeCost,
  };

  // Gemeinkosten
  const oh = overheadInfo(settings);
  const overheadRate = calc.overheadRatePerHour != null ? calc.overheadRatePerHour : oh.ratePerHour;
  const overheadCost = calc.overheadEnabled ? overheadRate * monthlyHours : 0;

  // Risiko
  const riskLevel = settings.calculation.riskLevels.find((r) => r.key === calc.riskKey);
  const riskPct = calc.riskPctOverride != null ? calc.riskPctOverride : (riskLevel?.pct ?? 0);
  const riskBase = directCost + travel.total + overheadCost;
  const riskCost = (riskBase * riskPct) / 100;

  const selfCost = riskBase + riskCost;

  // Preisstrategien
  const mode = calc.marginMode;
  const rounding = settings.calculation.rounding;
  const prices = {
    min: priceFromCost(selfCost, settings.calculation.minMarginPct, mode, rounding),
    target: priceFromCost(selfCost, calc.targetMarginPct, mode, rounding),
    premium: priceFromCost(selfCost, settings.calculation.premiumMarginPct, mode, rounding),
    competitor:
      calc.competitorPrice != null && calc.competitorPrice > 0
        ? priceInfoForNet(calc.competitorPrice, selfCost)
        : null,
    custom:
      calc.customPrice != null && calc.customPrice > 0
        ? priceInfoForNet(calc.customPrice, selfCost)
        : null,
  };

  let selected: PriceInfo;
  switch (calc.selectedPriceStrategy) {
    case 'min':
      selected = prices.min;
      break;
    case 'premium':
      selected = prices.premium;
      break;
    case 'competitor':
      selected = prices.competitor ?? prices.target;
      break;
    case 'custom':
      selected = prices.custom ?? prices.target;
      break;
    case 'target':
    default:
      selected = prices.target;
  }

  const vatPct = settings.calculation.vatPct;
  const vatAmount = (selected.net * vatPct) / 100;
  const gross = selected.net + vatAmount;

  // Einmalige Leistungen (eigener Block, gleicher Margen-Modus)
  const oneTimeLines = lines.filter((l) => l.oneTime);
  const oneTimeHours = oneTimeLines.reduce((s, l) => s + l.timePerExecutionH, 0);
  const oneTimeCost = oneTimeLines.reduce((s, l) => s + l.perExecutionCost, 0);
  const oneTime =
    oneTimeLines.length > 0
      ? {
          hours: oneTimeHours,
          cost: oneTimeCost,
          price: priceFromCost(oneTimeCost, calc.targetMarginPct, mode, rounding),
        }
      : null;

  // Anteilige Vollkosten & Preis je Position.
  // Bei prozentualer/fester Material-/Maschinenermittlung wird nur der
  // positionsbezogene Anteil (Personal + ggf. Positionsmaterial/-maschine)
  // als Verteilungsschlüssel verwendet.
  const perLine: Record<string, { fullCost: number; price: number }> = {};
  const allocBase = (l: LineResult) =>
    l.laborCost +
    (materialSource.mode === 'lines' ? l.materialCost : 0) +
    (machineSource.mode === 'lines' ? l.machineCost : 0);
  const allocSum = recurringLines.reduce((s, l) => s + allocBase(l), 0);
  const costFactor = allocSum > 0 ? selfCost / allocSum : 1;
  const priceFactor = selfCost > 0 ? selected.net / selfCost : 1;
  for (const l of lines) {
    if (l.recurring) {
      const fullCost = allocBase(l) * costFactor;
      perLine[l.lineId] = { fullCost, price: fullCost * priceFactor };
    } else {
      const fullCost = l.perExecutionCost * (1 + riskPct / 100);
      perLine[l.lineId] = {
        fullCost,
        price: priceFromCost(fullCost, calc.targetMarginPct, mode, rounding).net,
      };
    }
  }

  // Gesamtfläche (m²-Positionen, je Raum/Leistungskombination nur einmal zählen)
  const seen = new Set<string>();
  let totalAreaSqm = 0;
  for (const line of calc.lines) {
    if (line.unit !== 'm²') continue;
    const key = `${line.areaLabel}|${line.roomLabel}`;
    if (seen.has(key)) continue;
    seen.add(key);
    totalAreaSqm += line.quantity;
  }

  return {
    lines,
    monthlyHours,
    yearlyHours: monthlyHours * 12,
    laborCost,
    materialCost,
    machineCost,
    materialSource,
    machineSource,
    directCost,
    travel,
    overheadRate,
    overheadCost,
    overheadEnabled: calc.overheadEnabled,
    riskPct,
    riskCost,
    selfCost,
    rate,
    prices,
    selectedStrategy: calc.selectedPriceStrategy,
    selected,
    vatPct,
    vatAmount,
    gross,
    avgHourlyRevenue: monthlyHours > 0 ? selected.net / monthlyHours : 0,
    oneTime,
    perLine,
    totalAreaSqm,
  };
}
