import { describe, expect, it } from 'vitest';
import type { CalcLine, Calculation } from '../../types';
import { NEUTRAL_FACTORS } from '../../types';
import { createSeedData } from '../../seed';
import {
  computeCalculation,
  computeLine,
  employerRate,
  executionsPerMonth,
  overheadInfo,
  priceFromCost,
  roundPrice,
  type EngineContext,
} from '..';
import { derivePerformanceValue } from '../performance';
import { computeHealth, computeWarnings } from '../health';
import { computeScenario } from '../scenario';
import { analyzePostCalc } from '../postcalc';
import { migrateData } from '../../migrate';

const data = createSeedData();
const ctx: EngineContext = {
  settings: data.settings,
  frequencies: data.frequencies,
  machines: data.machines,
};

const freq = (id: string) => data.frequencies.find((f) => f.id === id)!;

function makeLine(partial: Partial<CalcLine>): CalcLine {
  return {
    id: 'l1',
    areaLabel: 'Test',
    roomLabel: 'Raum',
    serviceName: 'Testleistung',
    unit: 'm²',
    quantity: 100,
    basePerformanceValue: 400,
    factors: { ...NEUTRAL_FACTORS },
    frequencyId: 'fq_2w',
    materialMode: 'none',
    materialValue: 0,
    machineId: null,
    surchargeKey: 'none',
    sortOrder: 10,
    manualPerformanceValue: null,
    manualExecutionsPerMonth: null,
    manualTimePerExecutionH: null,
    ...partial,
  };
}

function makeCalc(partial: Partial<Calculation>): Calculation {
  return {
    id: 'c1',
    number: 'K-2026-900',
    name: 'Testkalkulation',
    status: 'entwurf',
    lines: [],
    travel: { enabled: false, distanceKm: 0, tripsPerMonth: null, payTravelTime: false },
    materialOverride: { mode: 'lines', pct: null, fixed: null },
    machineOverride: { mode: 'lines', pct: null, fixed: null },
    overheadEnabled: false,
    overheadRatePerHour: null,
    riskKey: 'gering',
    riskPctOverride: null,
    marginMode: 'margin',
    targetMarginPct: 15,
    selectedPriceStrategy: 'target',
    customPrice: null,
    competitorPrice: null,
    wageOverride: null,
    scenarios: [],
    postCalc: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    versions: [],
    ...partial,
  };
}

describe('Turnus-Engine', () => {
  const w = 52 / 12;

  it('rechnet 1× wöchentlich in 4,333 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_1w'), w).executionsPerMonth).toBeCloseTo(4.3333, 3);
  });

  it('rechnet 2× wöchentlich in 8,667 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_2w'), w).executionsPerMonth).toBeCloseTo(8.6667, 3);
  });

  it('rechnet 3× wöchentlich in 13 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_3w'), w).executionsPerMonth).toBeCloseTo(13, 5);
  });

  it('rechnet 5× wöchentlich in 21,667 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_5w'), w).executionsPerMonth).toBeCloseTo(21.6667, 3);
  });

  it('rechnet täglich (Mo–Fr) wie 5× wöchentlich', () => {
    expect(executionsPerMonth(freq('fq_taeglich'), w).executionsPerMonth).toBeCloseTo(21.6667, 3);
  });

  it('rechnet 2× täglich (Mo–Fr) in 43,333 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_2x_taeglich'), w).executionsPerMonth).toBeCloseTo(43.3333, 3);
  });

  it('rechnet alle 2 Wochen in 2,167 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_14t'), w).executionsPerMonth).toBeCloseTo(2.1667, 3);
  });

  it('rechnet quartalsweise in 0,333 Durchführungen/Monat um', () => {
    expect(executionsPerMonth(freq('fq_quartal'), w).executionsPerMonth).toBeCloseTo(1 / 3, 4);
  });

  it('markiert einmalig und nach Bedarf korrekt', () => {
    expect(executionsPerMonth(freq('fq_einmalig'), w).oneTime).toBe(true);
    expect(executionsPerMonth(freq('fq_bedarf'), w).onDemand).toBe(true);
  });
});

describe('Leistungswerte-Engine', () => {
  it('wendet Faktoren multiplikativ an (500 × 0,85 × 0,90 = 382,5)', () => {
    const d = derivePerformanceValue(
      500,
      { ...NEUTRAL_FACTORS, soiling: 'stark', furnishing: 'stark' },
      data.settings.performanceFactors
    );
    expect(d.value).toBeCloseTo(500 * 0.85 * 0.9, 5);
    expect(d.steps).toHaveLength(2);
    expect(d.manual).toBe(false);
  });

  it('kennzeichnet manuelle Überschreibung', () => {
    const d = derivePerformanceValue(500, { ...NEUTRAL_FACTORS }, data.settings.performanceFactors, 350, 'Testgrund');
    expect(d.value).toBe(350);
    expect(d.manual).toBe(true);
    expect(d.manualReason).toBe('Testgrund');
  });
});

describe('Personalkosten', () => {
  it('berechnet den Arbeitgeberstundensatz (15 € → 22,50 € bei 50 % Nebenkosten)', () => {
    const info = employerRate(data.settings);
    expect(info.baseWage).toBe(15);
    expect(info.componentsPct).toBeCloseTo(50, 5);
    expect(info.employerRate).toBeCloseTo(22.5, 5);
  });
});

describe('Einzelposition', () => {
  it('berechnet Zeit, Monatsstunden und Personalkosten (Spezifikationsbeispiel)', () => {
    // 500 m², 400 m²/h → 1,25 h; 2×/Woche → 8,667 → 10,83 h/Monat
    const line = makeLine({ quantity: 500, basePerformanceValue: 400, frequencyId: 'fq_2w' });
    const calc = makeCalc({ lines: [line] });
    const r = computeLine(line, calc, ctx);
    expect(r.timePerExecutionH).toBeCloseTo(1.25, 5);
    expect(r.executionsPerMonth).toBeCloseTo(8.6667, 3);
    expect(r.monthlyHours).toBeCloseTo(10.8333, 3);
    expect(r.laborCost).toBeCloseTo(10.8333 * 22.5, 1);
  });

  it('wendet Zuschläge nur auf betroffene Positionen an', () => {
    const line = makeLine({ surchargeKey: 'night' });
    const calc = makeCalc({ lines: [line] });
    const r = computeLine(line, calc, ctx);
    expect(r.surchargePct).toBe(25);
    const base = r.monthlyHours * 22.5;
    expect(r.laborCost).toBeCloseTo(base * 1.25, 5);
  });

  it('berechnet Material je Durchführung', () => {
    const line = makeLine({ materialMode: 'perExecution', materialValue: 2 });
    const calc = makeCalc({ lines: [line] });
    const r = computeLine(line, calc, ctx);
    expect(r.materialCost).toBeCloseTo(2 * 8.6667, 3);
  });

  it('behandelt einmalige Leistungen separat (keine Monatsstunden)', () => {
    const line = makeLine({ frequencyId: 'fq_einmalig', quantity: 100, basePerformanceValue: 50 });
    const calc = makeCalc({ lines: [line] });
    const r = computeLine(line, calc, ctx);
    expect(r.oneTime).toBe(true);
    expect(r.monthlyHours).toBe(0);
    expect(r.perExecutionCost).toBeCloseTo(2 * 22.5, 5);
  });
});

describe('Preisberechnung', () => {
  it('unterscheidet echte Zielmarge und Kostenaufschlag', () => {
    // Echte Marge: 1000 € Kosten, 20 % Marge → 1250 € (250/1250 = 20 %)
    const margin = priceFromCost(1000, 20, 'margin', 'none');
    expect(margin.net).toBeCloseTo(1250, 5);
    expect(margin.marginPct).toBeCloseTo(20, 5);
    // Aufschlag: 1000 € × 1,20 → 1200 € (Marge nur 16,67 %)
    const markup = priceFromCost(1000, 20, 'markup', 'none');
    expect(markup.net).toBeCloseTo(1200, 5);
    expect(markup.marginPct).toBeCloseTo(16.6667, 3);
  });

  it('rundet nach Rundungsregel', () => {
    expect(roundPrice(1234.5678, 'cent')).toBeCloseTo(1234.57, 5);
    expect(roundPrice(1234.56, 'zehnCent')).toBeCloseTo(1234.6, 5);
    expect(roundPrice(1234.56, 'fuenfzigCent')).toBeCloseTo(1234.5, 5);
    expect(roundPrice(1234.56, 'euro')).toBe(1235);
  });
});

describe('Gesamtkalkulation', () => {
  it('summiert Positionen und berechnet Fahrt, Gemeinkosten, Risiko und Preis', () => {
    const lines = [
      makeLine({ id: 'a', quantity: 500, basePerformanceValue: 400, frequencyId: 'fq_2w' }), // 10,83 h
      makeLine({ id: 'b', quantity: 250, basePerformanceValue: 250, frequencyId: 'fq_1w' }), // 4,33 h
    ];
    const calc = makeCalc({
      lines,
      travel: { enabled: true, distanceKm: 10, tripsPerMonth: 8, payTravelTime: true },
      overheadEnabled: true,
      riskKey: 'normal',
    });
    const t = computeCalculation(calc, ctx);

    const expectedHours = 1.25 * ((2 * 52) / 12) + 1 * (52 / 12);
    expect(t.monthlyHours).toBeCloseTo(expectedHours, 6);
    expect(t.laborCost).toBeCloseTo(expectedHours * 22.5, 1);

    // Fahrt: 10 km × 2 × 8 = 160 km × 0,45 = 72 € + Fahrzeit 160/45 h × 22,5
    expect(t.travel.kmPerMonth).toBeCloseTo(160, 5);
    expect(t.travel.kmCost).toBeCloseTo(72, 5);
    expect(t.travel.timeHoursPerMonth).toBeCloseTo(160 / 45, 4);

    // Gemeinkosten aus Einstellungen
    const oh = overheadInfo(data.settings);
    expect(t.overheadRate).toBeCloseTo(oh.ratePerHour, 5);
    expect(t.overheadCost).toBeCloseTo(oh.ratePerHour * expectedHours, 3);

    // Risiko 2 % auf alle Kosten
    const base = t.laborCost + t.materialCost + t.machineCost + t.travel.total + t.overheadCost;
    expect(t.riskCost).toBeCloseTo(base * 0.02, 3);
    expect(t.selfCost).toBeCloseTo(base * 1.02, 3);

    // Zielpreis: Kosten ÷ (1 − 0,15)
    expect(t.prices.target.net).toBeCloseTo(roundPrice(t.selfCost / 0.85, 'cent'), 2);
    expect(t.selected.marginPct).toBeGreaterThan(14.9);
    expect(t.gross).toBeCloseTo(t.selected.net * 1.19, 2);
  });

  it('nutzt automatische Einsatzfahrten aus dem häufigsten Turnus', () => {
    const lines = [
      makeLine({ id: 'a', frequencyId: 'fq_3w' }), // 13/Monat
      makeLine({ id: 'b', frequencyId: 'fq_1w' }),
    ];
    const calc = makeCalc({
      lines,
      travel: { enabled: true, distanceKm: 5, tripsPerMonth: null, payTravelTime: false },
    });
    const t = computeCalculation(calc, ctx);
    expect(t.travel.tripsAuto).toBe(true);
    expect(t.travel.tripsPerMonth).toBeCloseTo(13, 1);
  });

  it('berechnet die Demo-Kalkulation Küchenstudio plausibel', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_kuechenstudio')!;
    const t = computeCalculation(calc, ctx);
    expect(t.monthlyHours).toBeGreaterThan(25);
    expect(t.monthlyHours).toBeLessThan(70);
    expect(t.selected.net).toBeGreaterThan(t.selfCost);
    expect(t.selected.marginPct).toBeCloseTo(15, 0.5);
    expect(t.avgHourlyRevenue).toBeGreaterThan(30);
    expect(t.avgHourlyRevenue).toBeLessThan(80);
  });
});

describe('Individuelle Material- und Maschinenkosten', () => {
  const lines = [makeLine({ id: 'a', materialMode: 'perHour', materialValue: 1 })]; // 2,167 h/Monat

  it("Modus 'lines': Summe aus den Positionen", () => {
    const calc = makeCalc({ lines });
    const t = computeCalculation(calc, ctx);
    expect(t.materialSource.mode).toBe('lines');
    expect(t.materialCost).toBeCloseTo(t.lines[0].materialCost, 6);
  });

  it("Modus 'pctOfLabor' nutzt den Vorschlagswert aus den Einstellungen", () => {
    const calc = makeCalc({
      lines,
      materialOverride: { mode: 'pctOfLabor', pct: null, fixed: null },
    });
    const t = computeCalculation(calc, ctx);
    const suggested = data.settings.costSuggestions.materialPctOfLabor;
    expect(t.materialSource.pctUsed).toBe(suggested);
    expect(t.materialSource.pctIsSuggestion).toBe(true);
    expect(t.materialCost).toBeCloseTo((t.laborCost * suggested) / 100, 6);
  });

  it("Modus 'pctOfLabor' mit eigenem Prozentsatz", () => {
    const calc = makeCalc({
      lines,
      materialOverride: { mode: 'pctOfLabor', pct: 7.5, fixed: null },
    });
    const t = computeCalculation(calc, ctx);
    expect(t.materialSource.pctIsSuggestion).toBe(false);
    expect(t.materialCost).toBeCloseTo(t.laborCost * 0.075, 6);
    // Selbstkosten und Preis bauen auf dem Override auf
    expect(t.selfCost).toBeCloseTo(t.laborCost + t.materialCost, 4);
  });

  it("Modus 'fixed': fester Monatsbetrag für Maschinen", () => {
    const calc = makeCalc({
      lines,
      machineOverride: { mode: 'fixed', pct: null, fixed: 85 },
    });
    const t = computeCalculation(calc, ctx);
    expect(t.machineCost).toBe(85);
    expect(t.machineSource.mode).toBe('fixed');
  });

  it('verteilt Vollkosten auch bei Override vollständig auf die Positionen', () => {
    const two = [
      makeLine({ id: 'a', quantity: 300 }),
      makeLine({ id: 'b', quantity: 100 }),
    ];
    const calc = makeCalc({
      lines: two,
      materialOverride: { mode: 'pctOfLabor', pct: 5, fixed: null },
    });
    const t = computeCalculation(calc, ctx);
    const sum = Object.values(t.perLine).reduce((s, p) => s + p.fullCost, 0);
    expect(sum).toBeCloseTo(t.selfCost, 4);
  });
});

describe('Daten-Migration', () => {
  it('ergänzt fehlende Felder in v1-Datenbeständen ohne Datenverlust', () => {
    const old = createSeedData();
    // v1 simulieren: neue Felder entfernen
    const legacy = JSON.parse(JSON.stringify(old));
    delete legacy.settings.costSuggestions;
    for (const c of legacy.calculations) {
      delete c.materialOverride;
      delete c.machineOverride;
    }
    legacy.customers[0].company = 'Bestandskunde GmbH';

    const migrated = migrateData(legacy);
    expect(migrated.settings.costSuggestions.materialPctOfLabor).toBe(4);
    expect(migrated.calculations[0].materialOverride.mode).toBe('lines');
    expect(migrated.calculations[0].machineOverride.mode).toBe('lines');
    expect(migrated.customers[0].company).toBe('Bestandskunde GmbH');
    // Migrierte Daten sind voll berechenbar
    const t = computeCalculation(migrated.calculations[0], {
      settings: migrated.settings,
      frequencies: migrated.frequencies,
      machines: migrated.machines,
    });
    expect(t.selfCost).toBeGreaterThan(0);
  });
});

describe('Warnungen & Health-Score', () => {
  it('warnt bei Marge unter Mindestmarge und Preis unter Selbstkosten', () => {
    const line = makeLine({});
    const calc = makeCalc({
      lines: [line],
      selectedPriceStrategy: 'custom',
      customPrice: 30, // weit unter Kosten (Selbstkosten ≈ 49 €)
    });
    const t = computeCalculation(calc, ctx);
    const w = computeWarnings(calc, t, ctx);
    expect(w.some((x) => x.code === 'price_below_cost')).toBe(true);
    expect(w.some((x) => x.code === 'margin_below_min')).toBe(true);
  });

  it('vergibt volle Punktzahl für die vollständige Demo-Kalkulation', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_kuechenstudio')!;
    const t = computeCalculation(calc, ctx);
    const h = computeHealth(calc, t, ctx);
    expect(h.score).toBeGreaterThanOrEqual(90);
    expect(h.checks.reduce((s, c) => s + c.points, 0)).toBe(100);
  });

  it('zieht Punkte bei fehlenden Fahrt- und Materialkosten ab', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_logistik')!;
    const t = computeCalculation(calc, ctx);
    const h = computeHealth(calc, t, ctx);
    expect(h.score).toBeLessThan(100);
    expect(h.checks.find((c) => c.label === 'Fahrtkosten aktiviert')?.passed).toBe(false);
    const w = computeWarnings(calc, t, ctx);
    expect(w.some((x) => x.code === 'no_travel')).toBe(true);
    expect(w.some((x) => x.code === 'margin_below_warn')).toBe(true);
  });
});

describe('Szenarien', () => {
  it('berechnet Margen-Szenario ohne Original zu verändern', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_kuechenstudio')!;
    const before = JSON.stringify(calc);
    const r = computeScenario(
      calc,
      { id: 's', name: 'Marge 20', marginPct: 20, performanceDeltaPct: 0, frequencyFactor: 1, createdAt: '' },
      ctx
    );
    expect(r.totals.selected.marginPct).toBeCloseTo(20, 0.5);
    expect(JSON.stringify(calc)).toBe(before);
  });

  it('senkt Leistungswerte im Szenario (−10 % → mehr Stunden)', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_kuechenstudio')!;
    const base = computeCalculation(calc, ctx);
    const r = computeScenario(
      calc,
      { id: 's', name: 'LW −10', marginPct: null, performanceDeltaPct: -10, frequencyFactor: 1, createdAt: '' },
      ctx
    );
    expect(r.totals.monthlyHours).toBeGreaterThan(base.monthlyHours);
    expect(r.totals.monthlyHours).toBeCloseTo(base.monthlyHours / 0.9, 1);
  });
});

describe('Nachkalkulation', () => {
  it('berechnet Ist-Abweichung und Ist-Marge der Praxis', () => {
    const calc = data.calculations.find((c) => c.id === 'calc_praxis')!;
    const t = computeCalculation(calc, ctx);
    const a = analyzePostCalc(calc, t, ctx)!;
    expect(a).not.toBeNull();
    expect(a.months).toBe(3);
    expect(a.avgActualHours).toBeCloseTo((62 + 59 + 58) / 3, 3);
    expect(a.hoursDeltaPct).toBeGreaterThan(0);
    expect(a.actualMarginPct).toBeLessThan(a.plannedMarginPct);
  });
});
