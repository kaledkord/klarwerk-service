import type {
  CalcLine,
  Calculation,
  CleaningObject,
  Customer,
  FactorSelection,
  MaterialMode,
  Room,
  SurchargeKey,
} from '../types';
import { NEUTRAL_FACTORS } from '../types';
import { SEED_SERVICES } from './services';

/**
 * Realistische Beispieldaten zum Kennenlernen der Anwendung.
 * Alle Daten sind vollständig editier- und löschbar.
 */

const now = new Date('2026-08-20T09:00:00.000Z').toISOString();

function factors(overrides: Partial<FactorSelection> = {}): FactorSelection {
  return { ...NEUTRAL_FACTORS, ...overrides };
}

function room(
  id: string,
  name: string,
  areaSqm: number,
  opts: Partial<Room> = {}
): Room {
  return {
    id,
    name,
    areaSqm,
    factors: factors(),
    ...opts,
    ...(opts.factors ? { factors: opts.factors } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Kunden
// ─────────────────────────────────────────────────────────────────────────────

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust_kuechenhaus',
    number: 'K-1001',
    company: 'Küchenhaus Nord GmbH',
    contactPerson: 'Jan Petersen',
    contactRole: 'Geschäftsführer',
    street: 'Holstenstraße 42',
    zip: '24103',
    city: 'Kiel',
    state: 'Schleswig-Holstein',
    phone: '+49 431 555120',
    email: 'j.petersen@kuechenhaus-nord.de',
    notes: 'Ausstellungsflächen besonders sorgfältig behandeln — hochwertige Musterküchen.',
    createdAt: now,
  },
  {
    id: 'cust_praxis',
    number: 'K-1002',
    company: 'Zahnarztpraxis Dr. Feldmann',
    contactPerson: 'Dr. Sabine Feldmann',
    contactRole: 'Praxisinhaberin',
    street: 'Kuhberg 18',
    zip: '24534',
    city: 'Neumünster',
    state: 'Schleswig-Holstein',
    phone: '+49 4321 44870',
    email: 'praxis@dr-feldmann.de',
    notes: 'Reinigung täglich nach Praxisschluss ab 19:00 Uhr. Hygienestandard medizinisch.',
    createdAt: now,
  },
  {
    id: 'cust_logistik',
    number: 'K-1003',
    company: 'Logistik Nord GmbH & Co. KG',
    contactPerson: 'Torben Wilken',
    contactRole: 'Betriebsleiter',
    street: 'Industriestraße 7',
    zip: '24537',
    city: 'Neumünster',
    state: 'Schleswig-Holstein',
    phone: '+49 4321 90210',
    email: 't.wilken@logistik-nord.de',
    createdAt: now,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Objekte
// ─────────────────────────────────────────────────────────────────────────────

export const SEED_OBJECTS: CleaningObject[] = [
  {
    id: 'obj_kuechenstudio',
    name: 'Küchenstudio Kiel',
    customerId: 'cust_kuechenhaus',
    objectTypeId: 'ot_13', // Küchenstudio
    street: 'Holstenstraße 42',
    zip: '24103',
    city: 'Kiel',
    contactOnSite: 'Frau Lorenzen (Empfang)',
    contactPhone: '+49 431 555121',
    openingHours: 'Mo–Fr 09:30–18:30, Sa 09:30–16:00',
    accessNotes: 'Reinigung vor Öffnung ab 07:00 Uhr. Schlüssel + Alarmcode vorhanden.',
    serviceStart: '2026-10-01',
    contractTerm: 'Unbefristet',
    noticePeriod: '3 Monate zum Monatsende',
    distanceKm: 12,
    buildings: [
      {
        id: 'bld_ks_a',
        name: 'Gebäude A',
        floors: [
          {
            id: 'fl_ks_eg',
            name: 'Erdgeschoss',
            rooms: [
              room('rm_ks_ausstellung', 'Ausstellung', 280, {
                areaLabel: 'Ausstellung',
                roomTypeId: 'rt_14',
                floorType: 'Feinsteinzeug',
                factors: factors({ frequentation: 'hoch', furnishing: 'stark' }),
                notes: 'Musterküchen — Oberflächen nur mit geeigneten Tüchern.',
              }),
              room('rm_ks_eingang', 'Eingangsbereich', 40, {
                areaLabel: 'Verkehrsflächen',
                roomTypeId: 'rt_4',
                floorType: 'Feinsteinzeug',
                factors: factors({ frequentation: 'hoch' }),
              }),
              room('rm_ks_buero1', 'Büro 1', 18, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_1',
                floorType: 'Teppich',
              }),
              room('rm_ks_buero2', 'Büro 2', 16, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_1',
                floorType: 'Teppich',
              }),
              room('rm_ks_besprechung', 'Besprechungsraum', 24, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_3',
                floorType: 'Teppich',
              }),
              room('rm_ks_kueche', 'Küche', 12, {
                areaLabel: 'Küche & Sozialbereich',
                roomTypeId: 'rt_9',
                floorType: 'Fliesen',
              }),
              room('rm_ks_wc_d', 'WC Damen', 8, {
                areaLabel: 'Sanitär',
                roomTypeId: 'rt_7',
                floorType: 'Fliesen',
                factors: factors({ hygiene: 'erhoeht' }),
              }),
              room('rm_ks_wc_h', 'WC Herren', 8, {
                areaLabel: 'Sanitär',
                roomTypeId: 'rt_7',
                floorType: 'Fliesen',
                factors: factors({ hygiene: 'erhoeht' }),
              }),
              room('rm_ks_treppe', 'Treppenhaus', 30, {
                areaLabel: 'Treppenhaus',
                roomTypeId: 'rt_6',
                floorType: 'Naturstein',
              }),
              room('rm_ks_lager', 'Lager', 60, {
                areaLabel: 'Lager',
                roomTypeId: 'rt_11',
                floorType: 'Beton',
              }),
            ],
          },
          {
            id: 'fl_ks_og',
            name: '1. Obergeschoss',
            rooms: [
              room('rm_ks_buero3', 'Büro 3', 20, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_1',
                floorType: 'Teppich',
              }),
              room('rm_ks_buero4', 'Büro 4', 18, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_1',
                floorType: 'Teppich',
              }),
              room('rm_ks_sozial', 'Sozialraum', 22, {
                areaLabel: 'Küche & Sozialbereich',
                roomTypeId: 'rt_10',
                floorType: 'PVC',
              }),
              room('rm_ks_flur_og', 'Flur', 25, {
                areaLabel: 'Verkehrsflächen',
                roomTypeId: 'rt_5',
                floorType: 'PVC',
              }),
            ],
          },
        ],
      },
    ],
    createdAt: now,
  },
  {
    id: 'obj_praxis',
    name: 'Praxis Dr. Feldmann',
    customerId: 'cust_praxis',
    objectTypeId: 'ot_4', // Zahnarztpraxis
    street: 'Kuhberg 18',
    zip: '24534',
    city: 'Neumünster',
    contactOnSite: 'Frau Petersen (Praxismanagement)',
    openingHours: 'Mo–Fr 08:00–19:00',
    accessNotes: 'Reinigung täglich nach Praxisschluss ab 19:00 Uhr.',
    serviceStart: '2026-04-01',
    contractTerm: '24 Monate',
    noticePeriod: '3 Monate zum Vertragsende',
    distanceKm: 18,
    buildings: [
      {
        id: 'bld_px_a',
        name: 'Praxisetage (2. OG)',
        floors: [
          {
            id: 'fl_px_1',
            name: 'Praxisräume',
            rooms: [
              room('rm_px_empfang', 'Empfang & Wartebereich', 45, {
                areaLabel: 'Empfang & Warten',
                roomTypeId: 'rt_4',
                floorType: 'PVC',
                factors: factors({ frequentation: 'hoch' }),
              }),
              room('rm_px_behandlung', 'Behandlungsräume 1–4', 96, {
                areaLabel: 'Behandlung',
                roomTypeId: 'rt_15',
                floorType: 'PVC',
                factors: factors({ hygiene: 'medizinisch' }),
              }),
              room('rm_px_labor', 'Eigenlabor', 18, {
                areaLabel: 'Behandlung',
                roomTypeId: 'rt_17',
                floorType: 'PVC',
                factors: factors({ hygiene: 'hoch' }),
              }),
              room('rm_px_steri', 'Sterilisation', 12, {
                areaLabel: 'Behandlung',
                roomTypeId: 'rt_15',
                floorType: 'PVC',
                factors: factors({ hygiene: 'medizinisch' }),
              }),
              room('rm_px_buero', 'Büro & Abrechnung', 16, {
                areaLabel: 'Verwaltung',
                roomTypeId: 'rt_1',
                floorType: 'Teppich',
              }),
              room('rm_px_sozial', 'Personalküche', 14, {
                areaLabel: 'Sozialbereich',
                roomTypeId: 'rt_9',
                floorType: 'Fliesen',
              }),
              room('rm_px_wc', 'WC Personal & Patienten', 16, {
                areaLabel: 'Sanitär',
                roomTypeId: 'rt_7',
                floorType: 'Fliesen',
                factors: factors({ hygiene: 'hoch', frequentation: 'hoch' }),
              }),
              room('rm_px_flur', 'Flure', 35, {
                areaLabel: 'Verkehrsflächen',
                roomTypeId: 'rt_5',
                floorType: 'PVC',
              }),
            ],
          },
        ],
      },
    ],
    createdAt: now,
  },
  {
    id: 'obj_logistik',
    name: 'Logistikhalle Neumünster',
    customerId: 'cust_logistik',
    objectTypeId: 'ot_17', // Logistikzentrum
    street: 'Industriestraße 7',
    zip: '24537',
    city: 'Neumünster',
    openingHours: 'Mo–Sa 06:00–22:00 (2-Schicht-Betrieb)',
    distanceKm: 22,
    buildings: [
      {
        id: 'bld_lg_halle',
        name: 'Halle 1',
        floors: [
          {
            id: 'fl_lg_halle',
            name: 'Hallenebene',
            rooms: [
              room('rm_lg_halle', 'Lager- und Kommissionierfläche', 1500, {
                areaLabel: 'Halle',
                roomTypeId: 'rt_11',
                floorType: 'Beton',
                factors: factors({ soiling: 'stark', furnishing: 'stark' }),
              }),
              room('rm_lg_bueros', 'Büros & Leitstand', 120, {
                areaLabel: 'Bürobereich',
                roomTypeId: 'rt_1',
                floorType: 'PVC',
              }),
              room('rm_lg_sozial', 'Sozialraum & Umkleiden', 60, {
                areaLabel: 'Sozialbereich',
                roomTypeId: 'rt_8',
                floorType: 'Fliesen',
                factors: factors({ frequentation: 'sehr_hoch' }),
              }),
              room('rm_lg_wc', 'Sanitäranlagen', 30, {
                areaLabel: 'Sanitär',
                roomTypeId: 'rt_7',
                floorType: 'Fliesen',
                factors: factors({ frequentation: 'sehr_hoch', soiling: 'stark' }),
              }),
            ],
          },
        ],
      },
    ],
    createdAt: now,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulationszeilen-Helfer
// ─────────────────────────────────────────────────────────────────────────────

interface LineOpts {
  roomId?: string;
  factors?: Partial<FactorSelection>;
  materialMode?: MaterialMode;
  materialValue?: number;
  machineId?: string;
  surchargeKey?: SurchargeKey;
  note?: string;
  quantityUnitOverride?: never;
}

let lineCounter = 0;

function line(
  areaLabel: string,
  roomLabel: string,
  serviceId: string,
  quantity: number,
  frequencyId: string,
  opts: LineOpts = {}
): CalcLine {
  const service = SEED_SERVICES.find((s) => s.id === serviceId);
  if (!service) throw new Error(`Unbekannte Leistung im Seed: ${serviceId}`);
  lineCounter += 1;
  return {
    id: `ln_seed_${lineCounter}`,
    roomId: opts.roomId,
    areaLabel,
    roomLabel,
    serviceId,
    serviceName: service.name,
    unit: service.unit,
    quantity,
    basePerformanceValue: service.defaultPerformanceValue,
    factors: factors(opts.factors),
    frequencyId,
    materialMode: opts.materialMode ?? 'perHour',
    materialValue: opts.materialValue ?? 0.9,
    machineId: opts.machineId ?? null,
    surchargeKey: opts.surchargeKey ?? 'none',
    note: opts.note,
    sortOrder: lineCounter * 10,
    manualPerformanceValue: null,
    manualExecutionsPerMonth: null,
    manualTimePerExecutionH: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulation 1: Küchenstudio Kiel (Angebot versendet)
// ─────────────────────────────────────────────────────────────────────────────

const showroom = { frequentation: 'hoch', furnishing: 'stark' } as const;
const sanitaerKs = { hygiene: 'erhoeht' } as const;

const kuechenstudioLines: CalcLine[] = [
  // Bürobereich — jede Leistung mit EIGENEM Turnus
  line('Bürobereich', 'Büros 1–4', 'sv_papierkorb', 8, 'fq_2w', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Büros 1–4', 'sv_oberfl_feucht', 45, 'fq_2w', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Büros 1–4', 'sv_buero_saugen', 72, 'fq_2w', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Büros 1–4', 'sv_buero_wischen', 72, 'fq_1w', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Büros 1–4', 'sv_tuergriffe', 8, 'fq_1w', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Büros 1–4', 'sv_sockelleisten', 65, 'fq_1m', { roomId: 'rm_ks_buero1' }),
  line('Bürobereich', 'Besprechungsraum', 'sv_tische', 2, 'fq_2w', { roomId: 'rm_ks_besprechung' }),
  line('Bürobereich', 'Besprechungsraum', 'sv_buero_saugen', 24, 'fq_2w', { roomId: 'rm_ks_besprechung' }),
  line('Bürobereich', 'Besprechungsraum', 'sv_buero_wischen', 24, 'fq_1w', { roomId: 'rm_ks_besprechung' }),

  // Ausstellung
  line('Ausstellung', 'Ausstellung EG', 'sv_buero_saugen', 280, 'fq_2w', {
    roomId: 'rm_ks_ausstellung',
    factors: showroom,
    note: 'Hartboden-Sauger, Kojen mit umfahren',
  }),
  line('Ausstellung', 'Ausstellung EG', 'sv_buero_wischen', 280, 'fq_1w', {
    roomId: 'rm_ks_ausstellung',
    factors: showroom,
  }),
  line('Ausstellung', 'Ausstellung EG', 'sv_oberfl_feucht', 150, 'fq_1w', {
    roomId: 'rm_ks_ausstellung',
    factors: showroom,
    note: 'Fronten und Arbeitsplatten der Musterküchen — nur geeignete Tücher',
  }),

  // Verkehrsflächen
  line('Verkehrsflächen', 'Eingangsbereich', 'sv_verkehr_kehren', 40, 'fq_2w', {
    roomId: 'rm_ks_eingang',
    factors: { frequentation: 'hoch' },
  }),
  line('Verkehrsflächen', 'Eingangsbereich', 'sv_verkehr_wischen', 40, 'fq_2w', {
    roomId: 'rm_ks_eingang',
    factors: { frequentation: 'hoch' },
  }),
  line('Verkehrsflächen', 'Eingangsbereich', 'sv_glasflaechen_innen', 15, 'fq_1w', {
    roomId: 'rm_ks_eingang',
  }),
  line('Verkehrsflächen', 'Flur OG', 'sv_verkehr_saugen', 25, 'fq_2w', { roomId: 'rm_ks_flur_og' }),
  line('Verkehrsflächen', 'Flur OG', 'sv_verkehr_wischen', 25, 'fq_1w', { roomId: 'rm_ks_flur_og' }),

  // Sanitär
  line('Sanitär', 'WC Damen & Herren', 'sv_wc', 2, 'fq_3w', {
    roomId: 'rm_ks_wc_d',
    factors: sanitaerKs,
    materialMode: 'perExecution',
    materialValue: 0.6,
  }),
  line('Sanitär', 'WC Damen & Herren', 'sv_waschbecken', 2, 'fq_3w', {
    roomId: 'rm_ks_wc_d',
    factors: sanitaerKs,
    materialMode: 'perExecution',
    materialValue: 0.3,
  }),
  line('Sanitär', 'WC Damen & Herren', 'sv_spiegel', 2, 'fq_3w', { roomId: 'rm_ks_wc_d', factors: sanitaerKs }),
  line('Sanitär', 'WC Damen & Herren', 'sv_spender', 4, 'fq_3w', {
    roomId: 'rm_ks_wc_d',
    factors: sanitaerKs,
    note: 'Verbrauchsmaterial stellt der Auftraggeber',
  }),
  line('Sanitär', 'WC Damen & Herren', 'sv_san_boden_wischen', 16, 'fq_3w', {
    roomId: 'rm_ks_wc_d',
    factors: sanitaerKs,
    materialMode: 'perExecution',
    materialValue: 0.4,
  }),
  line('Sanitär', 'WC Damen & Herren', 'sv_kontaktflaechen', 2, 'fq_3w', { roomId: 'rm_ks_wc_d', factors: sanitaerKs }),
  line('Sanitär', 'WC Damen & Herren', 'sv_fliesen', 12, 'fq_1m', { roomId: 'rm_ks_wc_d' }),

  // Küche & Sozialbereich
  line('Küche & Sozialbereich', 'Küche & Sozialraum', 'sv_arbeitsflaechen', 4, 'fq_2w', { roomId: 'rm_ks_kueche' }),
  line('Küche & Sozialbereich', 'Küche & Sozialraum', 'sv_spuele', 2, 'fq_2w', { roomId: 'rm_ks_kueche' }),
  line('Küche & Sozialbereich', 'Küche & Sozialraum', 'sv_kueche_boden', 34, 'fq_2w', { roomId: 'rm_ks_kueche' }),
  line('Küche & Sozialbereich', 'Küche & Sozialraum', 'sv_kueche_abfall', 2, 'fq_2w', { roomId: 'rm_ks_kueche' }),

  // Treppenhaus — eigene Turnusse je Leistung
  line('Treppenhaus', 'Treppe EG–OG', 'sv_treppe_saugen', 30, 'fq_1w', { roomId: 'rm_ks_treppe' }),
  line('Treppenhaus', 'Treppe EG–OG', 'sv_treppe_wischen', 30, 'fq_1w', { roomId: 'rm_ks_treppe' }),
  line('Treppenhaus', 'Treppe EG–OG', 'sv_treppe_handlauf', 12, 'fq_2w', { roomId: 'rm_ks_treppe' }),
  line('Treppenhaus', 'Treppe EG–OG', 'sv_treppe_fenster', 8, 'fq_1m', { roomId: 'rm_ks_treppe' }),

  // Lager
  line('Lager', 'Lager EG', 'sv_buero_kehren', 60, 'fq_1m', { roomId: 'rm_ks_lager' }),

  // Glasreinigung
  line('Glasreinigung', 'Schaufensterfront', 'sv_schaufenster', 45, 'fq_1m', {
    materialMode: 'perExecution',
    materialValue: 1.5,
  }),
  line('Glasreinigung', 'Fenster gesamt', 'sv_fenster_beidseitig', 120, 'fq_quartal', {
    materialMode: 'perExecution',
    materialValue: 3,
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulation 2: Zahnarztpraxis (gewonnen, mit Nachkalkulation)
// ─────────────────────────────────────────────────────────────────────────────

const med = { hygiene: 'medizinisch' } as const;
const hoch = { hygiene: 'hoch' } as const;

const praxisLines: CalcLine[] = [
  line('Empfang & Warten', 'Empfang & Wartebereich', 'sv_buero_saugen', 45, 'fq_taeglich', {
    roomId: 'rm_px_empfang',
    factors: { frequentation: 'hoch' },
  }),
  line('Empfang & Warten', 'Empfang & Wartebereich', 'sv_buero_wischen', 45, 'fq_taeglich', {
    roomId: 'rm_px_empfang',
    factors: { frequentation: 'hoch' },
  }),
  line('Empfang & Warten', 'Empfang & Wartebereich', 'sv_oberfl_feucht', 20, 'fq_taeglich', {
    roomId: 'rm_px_empfang',
  }),
  line('Behandlung', 'Behandlungsräume 1–4', 'sv_buero_wischen', 96, 'fq_taeglich', {
    roomId: 'rm_px_behandlung',
    factors: med,
    materialMode: 'perExecution',
    materialValue: 1.2,
    note: 'Wischdesinfektion nach Hygieneplan',
  }),
  line('Behandlung', 'Behandlungsräume 1–4', 'sv_kontaktflaechen', 4, 'fq_taeglich', {
    roomId: 'rm_px_behandlung',
    factors: med,
  }),
  line('Behandlung', 'Eigenlabor & Sterilisation', 'sv_buero_wischen', 30, 'fq_taeglich', {
    roomId: 'rm_px_steri',
    factors: hoch,
  }),
  line('Verwaltung', 'Büro & Abrechnung', 'sv_buero_saugen', 16, 'fq_2w', { roomId: 'rm_px_buero' }),
  line('Verwaltung', 'Büro & Abrechnung', 'sv_papierkorb', 3, 'fq_taeglich', { roomId: 'rm_px_buero' }),
  line('Sozialbereich', 'Personalküche', 'sv_arbeitsflaechen', 3, 'fq_taeglich', { roomId: 'rm_px_sozial' }),
  line('Sozialbereich', 'Personalküche', 'sv_kueche_boden', 14, 'fq_taeglich', { roomId: 'rm_px_sozial' }),
  line('Sanitär', 'WC Personal & Patienten', 'sv_wc', 3, 'fq_taeglich', {
    roomId: 'rm_px_wc',
    factors: hoch,
    materialMode: 'perExecution',
    materialValue: 0.8,
  }),
  line('Sanitär', 'WC Personal & Patienten', 'sv_waschbecken', 4, 'fq_taeglich', {
    roomId: 'rm_px_wc',
    factors: hoch,
  }),
  line('Sanitär', 'WC Personal & Patienten', 'sv_san_boden_wischen', 16, 'fq_taeglich', {
    roomId: 'rm_px_wc',
    factors: hoch,
    materialMode: 'perExecution',
    materialValue: 0.5,
  }),
  line('Sanitär', 'WC Personal & Patienten', 'sv_spender', 6, 'fq_taeglich', { roomId: 'rm_px_wc' }),
  line('Verkehrsflächen', 'Flure', 'sv_verkehr_wischen', 35, 'fq_taeglich', { roomId: 'rm_px_flur' }),
  line('Glasreinigung', 'Glastüren & Trennwände', 'sv_glastueren', 4, 'fq_1w', {}),
  line('Glasreinigung', 'Fenster gesamt', 'sv_fenster_beidseitig', 60, 'fq_quartal', {
    materialMode: 'perExecution',
    materialValue: 2,
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulation 3: Logistikhalle (in Bearbeitung, mit Warnungen)
// ─────────────────────────────────────────────────────────────────────────────

const logistikLines: CalcLine[] = [
  line('Halle', 'Lager- und Kommissionierfläche', 'sv_industrie', 1500, 'fq_1w', {
    roomId: 'rm_lg_halle',
    factors: { soiling: 'stark', furnishing: 'stark' },
    machineId: 'ma_scheuersaug',
    materialMode: 'none',
    materialValue: 0,
    note: 'Fahrwege und Kommissionierzonen, Blocklager ausgenommen',
  }),
  line('Bürobereich', 'Büros & Leitstand', 'sv_buero_saugen', 120, 'fq_1w', {
    roomId: 'rm_lg_bueros',
    materialMode: 'none',
    materialValue: 0,
  }),
  line('Bürobereich', 'Büros & Leitstand', 'sv_buero_wischen', 120, 'fq_1w', {
    roomId: 'rm_lg_bueros',
    materialMode: 'none',
    materialValue: 0,
  }),
  line('Sozialbereich', 'Sozialraum & Umkleiden', 'sv_kueche_boden', 60, 'fq_3w', {
    roomId: 'rm_lg_sozial',
    factors: { frequentation: 'sehr_hoch' },
    materialMode: 'none',
    materialValue: 0,
  }),
  line('Sanitär', 'Sanitäranlagen', 'sv_wc', 6, 'fq_3w', {
    roomId: 'rm_lg_wc',
    factors: { frequentation: 'sehr_hoch', soiling: 'stark' },
    materialMode: 'none',
    materialValue: 0,
  }),
  line('Sanitär', 'Sanitäranlagen', 'sv_san_boden_wischen', 30, 'fq_3w', {
    roomId: 'rm_lg_wc',
    factors: { frequentation: 'sehr_hoch', soiling: 'stark' },
    materialMode: 'none',
    materialValue: 0,
  }),
  line('Sonderleistungen', 'Hallenboden', 'sv_grund_hartboden', 1500, 'fq_einmalig', {
    roomId: 'rm_lg_halle',
    machineId: 'ma_einscheiben',
    materialMode: 'perExecution',
    materialValue: 120,
    note: 'Einmalige Grundreinigung vor Vertragsbeginn',
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulationen
// ─────────────────────────────────────────────────────────────────────────────

export const SEED_CALCULATIONS: Calculation[] = [
  {
    id: 'calc_kuechenstudio',
    number: 'K-2026-001',
    name: 'Küchenstudio Kiel – Unterhaltsreinigung',
    customerId: 'cust_kuechenhaus',
    objectId: 'obj_kuechenstudio',
    status: 'angebot_versendet',
    lines: kuechenstudioLines,
    travel: { enabled: true, distanceKm: 12, tripsPerMonth: null, payTravelTime: true },
    overheadEnabled: true,
    overheadRatePerHour: null,
    riskKey: 'normal',
    riskPctOverride: null,
    marginMode: 'margin',
    targetMarginPct: 15,
    selectedPriceStrategy: 'target',
    customPrice: null,
    competitorPrice: null,
    wageOverride: null,
    scenarios: [
      { id: 'sc_ks_1', name: 'Marge 12 %', marginPct: 12, performanceDeltaPct: 0, frequencyFactor: 1, createdAt: now },
      { id: 'sc_ks_2', name: 'Leistungswerte −10 %', marginPct: null, performanceDeltaPct: -10, frequencyFactor: 1, createdAt: now },
    ],
    offer: {
      offerNumber: 'A-2026-001',
      date: '2026-08-14',
      validUntil: '2026-09-13',
      intro:
        'vielen Dank für Ihre Anfrage und den freundlichen Termin vor Ort.\n\nGerne unterbreiten wir Ihnen nachfolgend unser Angebot für die Unterhaltsreinigung Ihres Küchenstudios in Kiel. Die Leistungen werden durch geschultes Personal, mit professioneller Ausstattung und besonderer Sorgfalt im Ausstellungsbereich erbracht.',
      outro:
        'Wir freuen uns, wenn unser Angebot Ihren Vorstellungen entspricht, und stehen für Rückfragen oder einen gemeinsamen Objekttermin jederzeit gerne zur Verfügung.',
      terms:
        'Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.\nDie Reinigungsmittel und Arbeitsgeräte werden von uns gestellt. Verbrauchsmaterialien (z. B. Toilettenpapier, Papierhandtücher, Seife) werden vom Auftraggeber bereitgestellt.\nDer Vertrag wird auf unbestimmte Zeit geschlossen und ist mit einer Frist von drei Monaten zum Monatsende kündbar.',
      showQuantities: false,
      layout: 'table',
      priceNote: '',
      lineOverrides: {},
    },
    postCalc: [],
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:30:00.000Z',
    versions: [],
  },
  {
    id: 'calc_praxis',
    number: 'K-2026-002',
    name: 'Praxis Dr. Feldmann – Unterhaltsreinigung',
    customerId: 'cust_praxis',
    objectId: 'obj_praxis',
    status: 'gewonnen',
    lines: praxisLines,
    travel: { enabled: true, distanceKm: 18, tripsPerMonth: null, payTravelTime: true },
    overheadEnabled: true,
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
    postCalc: [
      {
        id: 'pc_px_1',
        month: '2026-05',
        actualHours: 96,
        actualMaterialCost: 148,
        reasons: ['Verschmutzung unterschätzt'],
        note: 'Einarbeitung des Teams, zusätzliche Wischgänge im Wartebereich.',
      },
      {
        id: 'pc_px_2',
        month: '2026-06',
        actualHours: 92,
        actualMaterialCost: 132,
        reasons: ['Zusatzleistungen erbracht'],
      },
      {
        id: 'pc_px_3',
        month: '2026-07',
        actualHours: 90,
        actualMaterialCost: 128,
        reasons: [],
      },
    ],
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-08-05T16:00:00.000Z',
    versions: [],
  },
  {
    id: 'calc_logistik',
    number: 'K-2026-003',
    name: 'Logistikhalle Neumünster – Reinigung & Grundreinigung',
    customerId: 'cust_logistik',
    objectId: 'obj_logistik',
    status: 'in_bearbeitung',
    lines: logistikLines,
    travel: { enabled: false, distanceKm: 22, tripsPerMonth: null, payTravelTime: true },
    overheadEnabled: true,
    overheadRatePerHour: null,
    riskKey: 'mittel',
    riskPctOverride: null,
    marginMode: 'margin',
    targetMarginPct: 11,
    selectedPriceStrategy: 'target',
    customPrice: null,
    competitorPrice: 2400,
    wageOverride: null,
    scenarios: [],
    postCalc: [],
    createdAt: '2026-08-18T08:00:00.000Z',
    updatedAt: '2026-08-24T11:00:00.000Z',
    versions: [],
  },
];
