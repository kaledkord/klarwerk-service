import type { Settings } from '../types';
import { SEED_FLOOR_TYPES } from './master';

/**
 * Standard-Einstellungen — vorbelegt mit den echten KlarWerk-Service-Daten
 * (businessConfig der Website). Alle Werte sind in den Einstellungen
 * vollständig editierbar.
 */
export const SEED_SETTINGS: Settings = {
  company: {
    name: 'KlarWerk Service',
    ownerName: 'Khaled',
    street: 'Am Blöcken 4',
    zip: '24582',
    city: 'Bordesholm',
    phone: '+49 176 31287131',
    email: 'info@klarwerk-service.com',
    website: 'www.klarwerk-service.com',
    taxNumber: '',
    vatId: '',
  },
  calculation: {
    vatPct: 19,
    weeksPerMonth: 52 / 12,
    targetMarginPct: 15,
    minMarginPct: 10,
    warnMarginPct: 12,
    premiumMarginPct: 22,
    marginMode: 'margin',
    rounding: 'cent',
    riskLevels: [
      { key: 'gering', label: 'Geringes Risiko', pct: 0 },
      { key: 'normal', label: 'Normales Risiko', pct: 2 },
      { key: 'mittel', label: 'Mittleres Risiko', pct: 5 },
      { key: 'hoch', label: 'Hohes Risiko', pct: 10 },
      { key: 'sehr_hoch', label: 'Sehr hohes Risiko', pct: 15 },
    ],
    defaultRiskKey: 'normal',
  },
  labor: {
    baseWage: 15.0,
    components: [
      { key: 'sv', label: 'Sozialversicherung (AG-Anteil)', pct: 21 },
      { key: 'urlaub', label: 'Urlaub', pct: 9 },
      { key: 'krankheit', label: 'Krankheit / Ausfallzeiten', pct: 4.5 },
      { key: 'feiertage', label: 'Feiertage', pct: 4 },
      { key: 'bg', label: 'Berufsgenossenschaft', pct: 3 },
      { key: 'sonstige', label: 'Sonstige Personalnebenkosten', pct: 8.5 },
    ],
    surcharges: [
      { key: 'night', label: 'Nachtzuschlag', pct: 25 },
      { key: 'sunday', label: 'Sonntagszuschlag', pct: 50 },
      { key: 'holiday', label: 'Feiertagszuschlag', pct: 100 },
      { key: 'weekend', label: 'Wochenendzuschlag (Sa)', pct: 20 },
      { key: 'hardship', label: 'Erschwerniszuschlag', pct: 10 },
    ],
  },
  overhead: {
    positions: [
      { key: 'buero', label: 'Büro & Verwaltung', amount: 450 },
      { key: 'software', label: 'Software & IT', amount: 180 },
      { key: 'versicherung', label: 'Versicherungen', amount: 220 },
      { key: 'steuer', label: 'Steuerberatung', amount: 250 },
      { key: 'marketing', label: 'Marketing', amount: 200 },
      { key: 'fahrzeuge', label: 'Fahrzeuge (Fixkosten)', amount: 650 },
      { key: 'lager', label: 'Lager & Ausstattung', amount: 150 },
      { key: 'kleidung', label: 'Arbeitskleidung', amount: 80 },
      { key: 'telefon', label: 'Telefon & Internet', amount: 90 },
      { key: 'leitung', label: 'Geschäftsführung / Objektleitung', amount: 800 },
    ],
    productiveHoursPerMonth: 320,
    enabledByDefault: true,
  },
  travel: {
    costPerKm: 0.45,
    avgSpeedKmh: 45,
    payTravelTimeDefault: true,
  },
  material: {
    defaultMode: 'perHour',
    defaultValue: 0.9,
    consumablesDefault: 'auftraggeber',
  },
  performanceFactors: {
    soiling: [
      { key: 'gering', label: 'Gering', multiplier: 1.1 },
      { key: 'normal', label: 'Normal', multiplier: 1 },
      { key: 'mittel', label: 'Mittel', multiplier: 0.95 },
      { key: 'stark', label: 'Stark', multiplier: 0.85 },
      { key: 'extrem', label: 'Extrem', multiplier: 0.7 },
    ],
    frequentation: [
      { key: 'niedrig', label: 'Niedrig', multiplier: 1.05 },
      { key: 'normal', label: 'Normal', multiplier: 1 },
      { key: 'hoch', label: 'Hoch', multiplier: 0.92 },
      { key: 'sehr_hoch', label: 'Sehr hoch', multiplier: 0.85 },
    ],
    furnishing: [
      { key: 'frei', label: 'Frei', multiplier: 1.15 },
      { key: 'normal', label: 'Normal', multiplier: 1 },
      { key: 'stark', label: 'Stark möbliert', multiplier: 0.9 },
      { key: 'sehr_stark', label: 'Sehr stark möbliert', multiplier: 0.8 },
    ],
    accessibility: [
      { key: 'sehr_einfach', label: 'Sehr einfach', multiplier: 1.05 },
      { key: 'normal', label: 'Normal', multiplier: 1 },
      { key: 'erschwert', label: 'Erschwert', multiplier: 0.92 },
      { key: 'schwer', label: 'Schwer', multiplier: 0.85 },
    ],
    hygiene: [
      { key: 'standard', label: 'Standard', multiplier: 1 },
      { key: 'erhoeht', label: 'Erhöht', multiplier: 0.95 },
      { key: 'hoch', label: 'Hoch', multiplier: 0.9 },
      { key: 'medizinisch', label: 'Medizinisch', multiplier: 0.8 },
    ],
  },
  offer: {
    introTemplate:
      'vielen Dank für Ihre Anfrage und das damit verbundene Vertrauen.\n\nGerne unterbreiten wir Ihnen nachfolgend unser Angebot für die professionelle Reinigung Ihres Objekts. Die Leistungen werden durch geschultes Personal, mit professioneller Ausstattung und nach anerkannten Qualitätsstandards der Gebäudereinigung erbracht.',
    termsTemplate:
      'Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.\nDie Reinigungsmittel und Arbeitsgeräte werden von uns gestellt. Verbrauchsmaterialien (z. B. Toilettenpapier, Papierhandtücher, Seife) werden – sofern nicht anders vereinbart – vom Auftraggeber bereitgestellt.\nDer Vertrag wird auf unbestimmte Zeit geschlossen und ist mit einer Frist von drei Monaten zum Monatsende kündbar.\nEs gelten unsere Allgemeinen Geschäftsbedingungen.',
    outroTemplate:
      'Wir freuen uns, wenn unser Angebot Ihren Vorstellungen entspricht, und stehen für Rückfragen oder einen gemeinsamen Objekttermin jederzeit gerne zur Verfügung.',
    validityDays: 30,
  },
  ai: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    temperature: 0.2,
    maxOutputTokens: 8192,
    structuredOutput: true,
    functionCalling: true,
    monthlyBudgetEur: 50,
    warnAtPct: 80,
    priceInPer1M: 0.28,
    priceOutPer1M: 2.3,
  },
  floorTypes: SEED_FLOOR_TYPES,
};
