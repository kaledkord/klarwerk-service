/**
 * Leistungspakete (Vorlagen) je Raumtyp — Grundlage für Schnellkalkulation,
 * Wizard („Standardleistungen einfügen“) und KI-Vorschläge.
 *
 * freq: 'main' übernimmt den vom Benutzer gewählten Haupt-Turnus,
 * feste IDs (z. B. 'fq_1m') bleiben unabhängig davon bestehen —
 * so behält jede Leistung ihren eigenen Turnus.
 */

export interface TemplateItem {
  serviceId: string;
  freq: 'main' | string;
  /** Menge aus der Raumfläche ableiten. */
  qty: (areaSqm: number) => number;
}

export type TemplateKey =
  | 'buero'
  | 'besprechung'
  | 'sanitaer'
  | 'kueche'
  | 'flur'
  | 'treppenhaus'
  | 'eingang'
  | 'lager'
  | 'ausstellung'
  | 'sozialraum'
  | 'behandlung'
  | 'halle';

const perRoom = (n: number) => () => n;
const byArea = (factor = 1) => (a: number) => Math.round(a * factor * 10) / 10;
const countByArea = (sqmPerPiece: number, min = 1) => (a: number) =>
  Math.max(min, Math.round(a / sqmPerPiece));

export const ROOM_TEMPLATES: Record<TemplateKey, { label: string; items: TemplateItem[] }> = {
  buero: {
    label: 'Büro',
    items: [
      { serviceId: 'sv_papierkorb', freq: 'main', qty: countByArea(12) },
      { serviceId: 'sv_oberfl_feucht', freq: 'main', qty: byArea(0.55) },
      { serviceId: 'sv_buero_saugen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_buero_wischen', freq: 'fq_1w', qty: byArea() },
      { serviceId: 'sv_tuergriffe', freq: 'fq_1w', qty: countByArea(15) },
      { serviceId: 'sv_sockelleisten', freq: 'fq_1m', qty: byArea(0.85) },
    ],
  },
  besprechung: {
    label: 'Besprechungsraum',
    items: [
      { serviceId: 'sv_tische', freq: 'main', qty: countByArea(12) },
      { serviceId: 'sv_buero_saugen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_buero_wischen', freq: 'fq_1w', qty: byArea() },
    ],
  },
  sanitaer: {
    label: 'Sanitär / WC',
    items: [
      { serviceId: 'sv_wc', freq: 'main', qty: countByArea(6, 1) },
      { serviceId: 'sv_waschbecken', freq: 'main', qty: countByArea(8, 1) },
      { serviceId: 'sv_spiegel', freq: 'main', qty: countByArea(8, 1) },
      { serviceId: 'sv_spender', freq: 'main', qty: countByArea(5, 2) },
      { serviceId: 'sv_san_boden_wischen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_kontaktflaechen', freq: 'main', qty: perRoom(1) },
      { serviceId: 'sv_fliesen', freq: 'fq_1m', qty: byArea(1.5) },
    ],
  },
  kueche: {
    label: 'Küche / Teeküche',
    items: [
      { serviceId: 'sv_arbeitsflaechen', freq: 'main', qty: countByArea(4, 2) },
      { serviceId: 'sv_spuele', freq: 'main', qty: perRoom(1) },
      { serviceId: 'sv_kueche_boden', freq: 'main', qty: byArea() },
      { serviceId: 'sv_kueche_abfall', freq: 'main', qty: perRoom(1) },
    ],
  },
  flur: {
    label: 'Flur / Verkehrsfläche',
    items: [
      { serviceId: 'sv_verkehr_saugen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_verkehr_wischen', freq: 'fq_1w', qty: byArea() },
    ],
  },
  eingang: {
    label: 'Eingangsbereich',
    items: [
      { serviceId: 'sv_verkehr_kehren', freq: 'main', qty: byArea() },
      { serviceId: 'sv_verkehr_wischen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_glasflaechen_innen', freq: 'fq_1w', qty: byArea(0.3) },
    ],
  },
  treppenhaus: {
    label: 'Treppenhaus',
    items: [
      { serviceId: 'sv_treppe_saugen', freq: 'fq_1w', qty: byArea() },
      { serviceId: 'sv_treppe_wischen', freq: 'fq_1w', qty: byArea() },
      { serviceId: 'sv_treppe_handlauf', freq: 'fq_2w', qty: byArea(0.4) },
      { serviceId: 'sv_treppe_fenster', freq: 'fq_1m', qty: byArea(0.25) },
    ],
  },
  lager: {
    label: 'Lager',
    items: [{ serviceId: 'sv_buero_kehren', freq: 'fq_1m', qty: byArea() }],
  },
  ausstellung: {
    label: 'Ausstellung / Verkaufsfläche',
    items: [
      { serviceId: 'sv_buero_saugen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_buero_wischen', freq: 'fq_1w', qty: byArea() },
      { serviceId: 'sv_oberfl_feucht', freq: 'fq_1w', qty: byArea(0.5) },
    ],
  },
  sozialraum: {
    label: 'Sozialraum',
    items: [
      { serviceId: 'sv_kueche_tische', freq: 'main', qty: countByArea(10) },
      { serviceId: 'sv_kueche_boden', freq: 'main', qty: byArea() },
      { serviceId: 'sv_kueche_abfall', freq: 'main', qty: perRoom(1) },
    ],
  },
  behandlung: {
    label: 'Behandlungsraum (medizinisch)',
    items: [
      { serviceId: 'sv_buero_wischen', freq: 'main', qty: byArea() },
      { serviceId: 'sv_kontaktflaechen', freq: 'main', qty: perRoom(1) },
      { serviceId: 'sv_oberfl_feucht', freq: 'main', qty: byArea(0.4) },
    ],
  },
  halle: {
    label: 'Halle / Produktionsfläche',
    items: [{ serviceId: 'sv_industrie', freq: 'main', qty: byArea() }],
  },
};

/** Raumtyp-Name → Vorlage (für Objektstruktur-Übernahme). */
export function templateForRoomTypeName(name: string | undefined): TemplateKey | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('wc') || n.includes('sanitär') || n.includes('dusche') || n.includes('umkleide')) return 'sanitaer';
  if (n.includes('küche') || n.includes('teeküche')) return 'kueche';
  if (n.includes('treppe')) return 'treppenhaus';
  if (n.includes('empfang') || n.includes('eingang')) return 'eingang';
  if (n.includes('flur') || n.includes('verkehr') || n.includes('aufzug')) return 'flur';
  if (n.includes('lager') || n.includes('archiv')) return 'lager';
  if (n.includes('ausstellung') || n.includes('verkauf')) return 'ausstellung';
  if (n.includes('sozial') || n.includes('warte')) return 'sozialraum';
  if (n.includes('behandlung') || n.includes('labor') || n.includes('steri')) return 'behandlung';
  if (n.includes('produktion') || n.includes('werkstatt') || n.includes('halle')) return 'halle';
  if (n.includes('besprechung')) return 'besprechung';
  if (n.includes('büro')) return 'buero';
  return 'buero';
}

/**
 * Objektart → typische Flächenaufteilung für die Schnellkalkulation.
 * Anteile summieren sich zu 1.
 */
export interface QuickSplit {
  template: TemplateKey;
  share: number;
  roomLabel: string;
  areaLabel: string;
}

export function quickSplitsForObjectType(objectTypeName: string): QuickSplit[] {
  const n = objectTypeName.toLowerCase();
  if (n.includes('praxis') || n.includes('physio')) {
    return [
      { template: 'behandlung', share: 0.4, roomLabel: 'Behandlungsräume', areaLabel: 'Behandlung' },
      { template: 'sozialraum', share: 0.15, roomLabel: 'Empfang & Wartebereich', areaLabel: 'Empfang & Warten' },
      { template: 'buero', share: 0.15, roomLabel: 'Verwaltung', areaLabel: 'Verwaltung' },
      { template: 'flur', share: 0.15, roomLabel: 'Flure', areaLabel: 'Verkehrsflächen' },
      { template: 'sanitaer', share: 0.08, roomLabel: 'Sanitärbereich', areaLabel: 'Sanitär' },
      { template: 'kueche', share: 0.07, roomLabel: 'Personalküche', areaLabel: 'Sozialbereich' },
    ];
  }
  if (n.includes('lager') || n.includes('logistik') || n.includes('produktion') || n.includes('werkstatt')) {
    return [
      { template: 'halle', share: 0.78, roomLabel: 'Hallenfläche', areaLabel: 'Halle' },
      { template: 'buero', share: 0.1, roomLabel: 'Büros', areaLabel: 'Bürobereich' },
      { template: 'sozialraum', share: 0.06, roomLabel: 'Sozialräume', areaLabel: 'Sozialbereich' },
      { template: 'sanitaer', share: 0.06, roomLabel: 'Sanitäranlagen', areaLabel: 'Sanitär' },
    ];
  }
  if (n.includes('verkauf') || n.includes('supermarkt') || n.includes('autohaus') || n.includes('küchenstudio')) {
    return [
      { template: 'ausstellung', share: 0.6, roomLabel: 'Verkaufs-/Ausstellungsfläche', areaLabel: 'Verkaufsfläche' },
      { template: 'buero', share: 0.12, roomLabel: 'Büros', areaLabel: 'Bürobereich' },
      { template: 'flur', share: 0.1, roomLabel: 'Verkehrsflächen', areaLabel: 'Verkehrsflächen' },
      { template: 'sanitaer', share: 0.06, roomLabel: 'Sanitärbereich', areaLabel: 'Sanitär' },
      { template: 'kueche', share: 0.06, roomLabel: 'Küche/Sozialraum', areaLabel: 'Sozialbereich' },
      { template: 'lager', share: 0.06, roomLabel: 'Lager', areaLabel: 'Lager' },
    ];
  }
  if (n.includes('schule') || n.includes('kita')) {
    return [
      { template: 'buero', share: 0.5, roomLabel: 'Gruppen-/Klassenräume', areaLabel: 'Räume' },
      { template: 'flur', share: 0.25, roomLabel: 'Flure', areaLabel: 'Verkehrsflächen' },
      { template: 'sanitaer', share: 0.12, roomLabel: 'Sanitärbereiche', areaLabel: 'Sanitär' },
      { template: 'kueche', share: 0.08, roomLabel: 'Küche', areaLabel: 'Küche' },
      { template: 'treppenhaus', share: 0.05, roomLabel: 'Treppenhaus', areaLabel: 'Treppenhaus' },
    ];
  }
  if (n.includes('treppenhaus')) {
    return [{ template: 'treppenhaus', share: 1, roomLabel: 'Treppenhaus', areaLabel: 'Treppenhaus' }];
  }
  // Standard: Büro / Verwaltung
  return [
    { template: 'buero', share: 0.62, roomLabel: 'Büroflächen', areaLabel: 'Bürobereich' },
    { template: 'besprechung', share: 0.08, roomLabel: 'Besprechungsräume', areaLabel: 'Bürobereich' },
    { template: 'flur', share: 0.12, roomLabel: 'Flure', areaLabel: 'Verkehrsflächen' },
    { template: 'sanitaer', share: 0.07, roomLabel: 'Sanitärbereich', areaLabel: 'Sanitär' },
    { template: 'kueche', share: 0.06, roomLabel: 'Teeküche', areaLabel: 'Sozialbereich' },
    { template: 'treppenhaus', share: 0.05, roomLabel: 'Treppenhaus', areaLabel: 'Treppenhaus' },
  ];
}
