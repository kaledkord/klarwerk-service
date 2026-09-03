/**
 * KlarWerk Kalkulation — zentrales Datenmodell.
 *
 * Alle Entitäten sind so aufgebaut, dass jede einzelne Leistungsposition
 * (CalcLine) unabhängig kalkuliert werden kann: eigener Turnus, eigener
 * Leistungswert, eigene Faktoren, eigene Kosten.
 */

export type ID = string;

// ─────────────────────────────────────────────────────────────────────────────
// Turnus
// ─────────────────────────────────────────────────────────────────────────────

export type FrequencyKind =
  | 'perDay' // count× täglich an workdaysPerWeek Tagen pro Woche
  | 'perWeek' // count× wöchentlich
  | 'everyNWeeks' // alle N Wochen
  | 'everyNDays' // alle N Tage
  | 'perMonth' // count× monatlich
  | 'perYear' // count× jährlich (quartalsweise = 4, halbjährlich = 2, jährlich = 1)
  | 'oneTime' // einmalig
  | 'onDemand'; // nach Bedarf (Abruf)

export interface Frequency {
  id: ID;
  name: string;
  kind: FrequencyKind;
  /** Anzahl je Basiseinheit (z. B. 2 bei „2× wöchentlich“). */
  count: number;
  /** Nur kind='perDay': an wie vielen Tagen pro Woche (Mo–Fr = 5, Mo–Sa = 6, 7 = jeden Tag). */
  workdaysPerWeek?: number;
  /** Nur kind='everyNDays'. */
  intervalDays?: number;
  /** Nur kind='everyNWeeks'. */
  intervalWeeks?: number;
  system: boolean;
  active: boolean;
  sortOrder: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Leistungswerte & Anpassungsfaktoren
// ─────────────────────────────────────────────────────────────────────────────

export type FactorGroupKey =
  | 'soiling' // Verschmutzung
  | 'frequentation' // Frequentierung
  | 'furnishing' // Möblierung
  | 'accessibility' // Zugänglichkeit
  | 'hygiene'; // Hygienestandard

export interface FactorOption {
  key: string;
  label: string;
  /** Multiplikator auf den Standard-Leistungswert (0.85 = −15 %). */
  multiplier: number;
}

export type PerformanceFactorConfig = Record<FactorGroupKey, FactorOption[]>;

/** Auswahl je Faktorgruppe (key der FactorOption). */
export type FactorSelection = Record<FactorGroupKey, string>;

export const FACTOR_GROUP_LABELS: Record<FactorGroupKey, string> = {
  soiling: 'Verschmutzung',
  frequentation: 'Frequentierung',
  furnishing: 'Möblierung',
  accessibility: 'Zugänglichkeit',
  hygiene: 'Hygienestandard',
};

export const NEUTRAL_FACTORS: FactorSelection = {
  soiling: 'normal',
  frequentation: 'normal',
  furnishing: 'normal',
  accessibility: 'normal',
  hygiene: 'standard',
};

// ─────────────────────────────────────────────────────────────────────────────
// Leistungsbibliothek
// ─────────────────────────────────────────────────────────────────────────────

export type Unit = 'm²' | 'Stk.' | 'm' | 'h' | 'Pauschale';

export interface ServiceCategory {
  id: ID;
  name: string;
  sortOrder: number;
  system: boolean;
}

export interface Service {
  id: ID;
  name: string;
  categoryId: ID;
  unit: Unit;
  /**
   * Standard-Leistungswert in Einheiten pro Stunde
   * (m²/h, Stk./h, m/h; bei unit 'h' und 'Pauschale' immer 1).
   */
  defaultPerformanceValue: number;
  description?: string;
  defaultFrequencyId?: ID;
  active: boolean;
  system: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Material & Maschinen
// ─────────────────────────────────────────────────────────────────────────────

export type MaterialKind = 'reinigungsmaterial' | 'verbrauchsmaterial';

export interface Material {
  id: ID;
  name: string;
  kind: MaterialKind;
  unit: string; // z. B. "Liter", "Rolle", "Stück"
  costPerUnit: number;
  note?: string;
  active: boolean;
}

export interface Machine {
  id: ID;
  name: string;
  /** Kalkulatorischer Stundensatz (Abschreibung, Wartung, Energie, Material). */
  hourlyRate: number;
  purchasePrice?: number;
  usefulLifeYears?: number;
  maintenancePerYear?: number;
  energyCostPerHour?: number;
  note?: string;
  active: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Kunden & Objekte
// ─────────────────────────────────────────────────────────────────────────────

export interface Customer {
  id: ID;
  number: string; // z. B. K-1001
  company: string;
  contactPerson?: string;
  contactRole?: string;
  street?: string;
  zip?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  billingAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface ObjectType {
  id: ID;
  name: string;
  system: boolean;
}

export interface RoomType {
  id: ID;
  name: string;
  system: boolean;
}

export interface Room {
  id: ID;
  name: string;
  roomTypeId?: ID;
  /** Bereich zur Gruppierung (z. B. „Bürobereich“, „Sanitär“). */
  areaLabel?: string;
  areaSqm: number;
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  floorType?: string; // Bodenart
  factors: FactorSelection;
  notes?: string;
}

export interface Floor {
  id: ID;
  name: string; // z. B. "Erdgeschoss"
  rooms: Room[];
}

export interface Building {
  id: ID;
  name: string; // z. B. "Gebäude A" (Gebäudeteile über Namen abbildbar)
  floors: Floor[];
}

export interface CleaningObject {
  id: ID;
  name: string;
  customerId: ID;
  objectTypeId?: ID;
  street?: string;
  zip?: string;
  city?: string;
  contactOnSite?: string;
  contactPhone?: string;
  openingHours?: string;
  accessNotes?: string;
  serviceStart?: string;
  contractTerm?: string;
  noticePeriod?: string;
  /** Einfache Entfernung Firmensitz → Objekt in km. */
  distanceKm?: number;
  notes?: string;
  buildings: Building[];
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulation
// ─────────────────────────────────────────────────────────────────────────────

export type CalculationStatus =
  | 'entwurf'
  | 'in_bearbeitung'
  | 'angebot_erstellt'
  | 'angebot_versendet'
  | 'gewonnen'
  | 'verloren'
  | 'archiviert';

export const CALCULATION_STATUS_LABELS: Record<CalculationStatus, string> = {
  entwurf: 'Entwurf',
  in_bearbeitung: 'In Bearbeitung',
  angebot_erstellt: 'Angebot erstellt',
  angebot_versendet: 'Angebot versendet',
  gewonnen: 'Gewonnen',
  verloren: 'Verloren',
  archiviert: 'Archiviert',
};

export type MaterialMode =
  | 'none'
  | 'perHour' // € je Arbeitsstunde
  | 'perExecution' // € je Durchführung
  | 'perSqmMonth' // € je m² und Monat
  | 'perMonth'; // € pauschal je Monat

export const MATERIAL_MODE_LABELS: Record<MaterialMode, string> = {
  none: 'Kein Material',
  perHour: '€ je Stunde',
  perExecution: '€ je Durchführung',
  perSqmMonth: '€ je m²/Monat',
  perMonth: '€ pauschal/Monat',
};

export type SurchargeKey = 'none' | 'night' | 'sunday' | 'holiday' | 'weekend' | 'hardship';

/**
 * Eine einzelne Leistungsposition — das Herzstück der Kalkulation.
 * Jede Position hat ihren EIGENEN Turnus, eigene Leistungswerte,
 * eigene Faktoren und eigene Kosten.
 */
export interface CalcLine {
  id: ID;
  /** Optionale Verknüpfung zu einem Raum der Objektstruktur. */
  roomId?: ID;
  areaLabel: string; // Bereich
  roomLabel: string; // Raum
  serviceId?: ID;
  serviceName: string;
  unit: Unit;
  quantity: number;
  /** Standard-Leistungswert (Einheiten/h) zum Zeitpunkt der Anlage. */
  basePerformanceValue: number;
  factors: FactorSelection;
  /** Manuell überschriebener Leistungswert (Kennzeichnung „Manuell angepasst“). */
  manualPerformanceValue?: number | null;
  manualPerformanceReason?: string;
  /** Eigener Turnus DIESER Position. */
  frequencyId: ID;
  /** Manuelle Übersteuerung der Durchführungen/Monat. */
  manualExecutionsPerMonth?: number | null;
  /** Manuelle Übersteuerung der Zeit je Durchführung (h). */
  manualTimePerExecutionH?: number | null;
  materialMode: MaterialMode;
  materialValue: number;
  machineId?: ID | null;
  surchargeKey: SurchargeKey;
  note?: string;
  sortOrder: number;
}

export interface TravelConfig {
  enabled: boolean;
  distanceKm: number;
  /** null = automatisch (max. Durchführungen/Monat über alle Positionen). */
  tripsPerMonth: number | null;
  payTravelTime: boolean;
}

/**
 * Individuelle Kostenermittlung je Kalkulation für Material bzw. Maschinen:
 *  - 'lines':      Summe aus den einzelnen Leistungspositionen (Standard)
 *  - 'pctOfLabor': Prozentsatz der Personalkosten (mit Vorschlagswert)
 *  - 'fixed':      fester Betrag je Monat
 */
export type CostOverrideMode = 'lines' | 'pctOfLabor' | 'fixed';

export interface CostOverride {
  mode: CostOverrideMode;
  /** Eigener Prozentsatz; null = Vorschlagswert aus den Einstellungen. */
  pct: number | null;
  /** Fester Betrag €/Monat (Modus 'fixed'). */
  fixed: number | null;
}

export const DEFAULT_COST_OVERRIDE: CostOverride = { mode: 'lines', pct: null, fixed: null };

export type PriceStrategy = 'min' | 'target' | 'premium' | 'competitor' | 'custom';

export interface Scenario {
  id: ID;
  name: string;
  /** Abweichende Zielmarge in % (null = wie Kalkulation). */
  marginPct: number | null;
  /** Leistungswert-Anpassung in % (z. B. −10 → alle Leistungswerte −10 %). */
  performanceDeltaPct: number;
  /** Faktor auf alle Durchführungen/Monat (z. B. 1,5 = 50 % häufiger). */
  frequencyFactor: number;
  createdAt: string;
}

export interface OfferConfig {
  offerNumber: string;
  date: string;
  validUntil: string;
  intro: string;
  outro: string;
  terms: string;
  showQuantities: boolean;
  layout: 'table' | 'text' | 'both';
  priceNote: string;
  /** Positionsbezogene Overrides für die Angebotsdarstellung. */
  lineOverrides: Record<ID, { displayName?: string; hidden?: boolean }>;
}

export interface PostCalcEntry {
  id: ID;
  /** Monat im Format YYYY-MM. */
  month: string;
  actualHours: number;
  actualMaterialCost: number;
  reasons: string[];
  note?: string;
}

export interface CalculationVersion {
  id: ID;
  label: string;
  at: string;
  /** JSON-Snapshot der kalkulationsrelevanten Felder. */
  snapshot: string;
}

export interface Calculation {
  id: ID;
  number: string; // z. B. K-2026-001
  name: string;
  customerId?: ID;
  objectId?: ID;
  status: CalculationStatus;
  lines: CalcLine[];
  travel: TravelConfig;
  /** Materialkosten dieser Kalkulation: aus Positionen, % vom Personal oder fest. */
  materialOverride: CostOverride;
  /** Maschinenkosten dieser Kalkulation: aus Positionen, % vom Personal oder fest. */
  machineOverride: CostOverride;
  overheadEnabled: boolean;
  /** null = Wert aus den Einstellungen. */
  overheadRatePerHour: number | null;
  riskKey: string;
  /** Individueller Risikozuschlag in % (überschreibt riskKey-Wert, wenn gesetzt). */
  riskPctOverride: number | null;
  marginMode: 'margin' | 'markup';
  targetMarginPct: number;
  selectedPriceStrategy: PriceStrategy;
  /** Nur bei competitor/custom relevant. */
  customPrice: number | null;
  competitorPrice: number | null;
  /** null = Standard-Stundenlohn aus Einstellungen. */
  wageOverride: number | null;
  scenarios: Scenario[];
  offer?: OfferConfig;
  postCalc: PostCalcEntry[];
  aiOrigin?: { isDraft: boolean; note?: string };
  createdAt: string;
  updatedAt: string;
  versions: CalculationVersion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Einstellungen
// ─────────────────────────────────────────────────────────────────────────────

export interface LaborComponent {
  key: string;
  label: string;
  pct: number;
}

export interface SurchargeDef {
  key: SurchargeKey;
  label: string;
  pct: number;
}

export interface RiskLevel {
  key: string;
  label: string;
  pct: number;
}

export interface OverheadPosition {
  key: string;
  label: string;
  amount: number;
}

export type RoundingMode = 'none' | 'cent' | 'zehnCent' | 'fuenfzigCent' | 'euro';

export const ROUNDING_LABELS: Record<RoundingMode, string> = {
  none: 'Keine Rundung',
  cent: 'Auf Cent (0,01 €)',
  zehnCent: 'Auf 10 Cent (0,10 €)',
  fuenfzigCent: 'Auf 50 Cent (0,50 €)',
  euro: 'Auf volle Euro (1,00 €)',
};

export interface AiConfig {
  provider: 'gemini';
  model: string;
  temperature: number;
  maxOutputTokens: number;
  structuredOutput: boolean;
  functionCalling: boolean;
  monthlyBudgetEur: number;
  warnAtPct: number;
  /** Geschätzte Preise in € je 1 Mio. Tokens (editierbar). */
  priceInPer1M: number;
  priceOutPer1M: number;
}

export interface Settings {
  company: {
    name: string;
    ownerName: string;
    street: string;
    zip: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    taxNumber: string;
    vatId: string;
  };
  calculation: {
    vatPct: number;
    /** Wochen je Monat für die Turnus-Umrechnung (Standard 52/12 ≈ 4,333). */
    weeksPerMonth: number;
    targetMarginPct: number;
    minMarginPct: number;
    warnMarginPct: number;
    premiumMarginPct: number;
    marginMode: 'margin' | 'markup';
    rounding: RoundingMode;
    riskLevels: RiskLevel[];
    defaultRiskKey: string;
  };
  labor: {
    baseWage: number;
    components: LaborComponent[];
    surcharges: SurchargeDef[];
  };
  overhead: {
    positions: OverheadPosition[];
    productiveHoursPerMonth: number;
    enabledByDefault: boolean;
  };
  travel: {
    costPerKm: number;
    avgSpeedKmh: number;
    payTravelTimeDefault: boolean;
  };
  material: {
    defaultMode: MaterialMode;
    defaultValue: number;
    consumablesDefault: 'auftraggeber' | 'auftragnehmer' | 'separat';
  };
  /** Vorschlagswerte für die prozentuale Kostenermittlung (% der Personalkosten). */
  costSuggestions: {
    materialPctOfLabor: number;
    machinePctOfLabor: number;
  };
  performanceFactors: PerformanceFactorConfig;
  offer: {
    introTemplate: string;
    termsTemplate: string;
    outroTemplate: string;
    validityDays: number;
  };
  ai: AiConfig;
  floorTypes: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// KI-Protokoll
// ─────────────────────────────────────────────────────────────────────────────

export interface AiLogEntry {
  id: ID;
  at: string;
  model: string;
  userInput: string;
  inputTokens: number;
  outputTokens: number;
  costEur: number;
  summary?: string;
  accepted?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gesamt-Datenbestand (persistiert)
// ─────────────────────────────────────────────────────────────────────────────

export interface KwData {
  dataVersion: number;
  counters: { customer: number; calculation: number; offer: number };
  settings: Settings;
  frequencies: Frequency[];
  serviceCategories: ServiceCategory[];
  services: Service[];
  materials: Material[];
  machines: Machine[];
  objectTypes: ObjectType[];
  roomTypes: RoomType[];
  customers: Customer[];
  objects: CleaningObject[];
  calculations: Calculation[];
  aiLog: AiLogEntry[];
}
