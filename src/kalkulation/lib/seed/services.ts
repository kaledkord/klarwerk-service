import type { Service, ServiceCategory, Unit } from '../types';

/**
 * Leistungsbibliothek mit branchenüblichen Richt-Leistungswerten.
 * Alle Werte sind Standardwerte (Einheiten je Stunde) und können in der
 * Bibliothek vollständig bearbeitet werden.
 */

export const SEED_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat_buero', name: 'Unterhaltsreinigung Büro', sortOrder: 10, system: true },
  { id: 'cat_sanitaer', name: 'Sanitärreinigung', sortOrder: 20, system: true },
  { id: 'cat_kueche', name: 'Küche & Teeküche', sortOrder: 30, system: true },
  { id: 'cat_verkehr', name: 'Verkehrsflächen', sortOrder: 40, system: true },
  { id: 'cat_treppe', name: 'Treppenhaus', sortOrder: 50, system: true },
  { id: 'cat_glas', name: 'Glasreinigung', sortOrder: 60, system: true },
  { id: 'cat_grund', name: 'Grundreinigung', sortOrder: 70, system: true },
  { id: 'cat_bau', name: 'Bauendreinigung', sortOrder: 80, system: true },
  { id: 'cat_sonder', name: 'Sonderreinigung', sortOrder: 90, system: true },
];

function s(
  id: string,
  name: string,
  categoryId: string,
  unit: Unit,
  pv: number,
  defaultFrequencyId?: string,
  description?: string
): Service {
  return {
    id,
    name,
    categoryId,
    unit,
    defaultPerformanceValue: pv,
    defaultFrequencyId,
    description,
    active: true,
    system: true,
  };
}

export const SEED_SERVICES: Service[] = [
  // ── Unterhaltsreinigung Büro ──────────────────────────────────────────────
  s('sv_papierkorb', 'Papierkörbe leeren', 'cat_buero', 'Stk.', 80, 'fq_2w'),
  s('sv_abfall', 'Abfälle entsorgen', 'cat_buero', 'Stk.', 60, 'fq_2w', 'Je Abfallbehälter inkl. Beutelwechsel'),
  s('sv_entstauben', 'Oberflächen entstauben', 'cat_buero', 'm²', 350, 'fq_1w', 'Frei zugängliche Flächen'),
  s('sv_oberfl_feucht', 'Oberflächen feucht reinigen', 'cat_buero', 'm²', 250, 'fq_2w', 'Schreibtische, Sideboards, Fensterbänke'),
  s('sv_tische', 'Tische reinigen', 'cat_buero', 'Stk.', 40, 'fq_2w'),
  s('sv_telefone', 'Telefone reinigen', 'cat_buero', 'Stk.', 60, 'fq_1w'),
  s('sv_tastaturen', 'Tastaturen oberflächlich reinigen', 'cat_buero', 'Stk.', 60, 'fq_1w'),
  s('sv_buero_saugen', 'Bodenfläche saugen', 'cat_buero', 'm²', 400, 'fq_2w', 'Teppich- und Hartböden'),
  s('sv_buero_kehren', 'Bodenfläche kehren', 'cat_buero', 'm²', 600, 'fq_1w'),
  s('sv_buero_wischen', 'Boden feucht wischen', 'cat_buero', 'm²', 250, 'fq_1w'),
  s('sv_tueren', 'Türen reinigen', 'cat_buero', 'Stk.', 20, 'fq_1m', 'Türblatt beidseitig inkl. Zarge'),
  s('sv_tuergriffe', 'Türgriffe und Griffbereiche reinigen', 'cat_buero', 'Stk.', 60, 'fq_1w'),
  s('sv_lichtschalter', 'Lichtschalter reinigen', 'cat_buero', 'Stk.', 80, 'fq_1m'),
  s('sv_heizkoerper', 'Heizkörper reinigen', 'cat_buero', 'Stk.', 15, 'fq_1m'),
  s('sv_sockelleisten', 'Sockelleisten reinigen', 'cat_buero', 'm', 150, 'fq_1m'),

  // ── Sanitär ───────────────────────────────────────────────────────────────
  s('sv_wc', 'WC-Becken reinigen und desinfizieren', 'cat_sanitaer', 'Stk.', 15, 'fq_taeglich'),
  s('sv_urinal', 'Urinale reinigen und desinfizieren', 'cat_sanitaer', 'Stk.', 20, 'fq_taeglich'),
  s('sv_waschbecken', 'Waschbecken reinigen', 'cat_sanitaer', 'Stk.', 30, 'fq_taeglich'),
  s('sv_armaturen', 'Armaturen reinigen und polieren', 'cat_sanitaer', 'Stk.', 40, 'fq_taeglich'),
  s('sv_spiegel', 'Spiegel reinigen', 'cat_sanitaer', 'Stk.', 40, 'fq_3w'),
  s('sv_spender', 'Spender reinigen und auffüllen', 'cat_sanitaer', 'Stk.', 40, 'fq_taeglich'),
  s('sv_san_abfall', 'Abfallbehälter leeren (Sanitär)', 'cat_sanitaer', 'Stk.', 60, 'fq_taeglich'),
  s('sv_san_boden_saugen', 'Sanitärboden kehren/saugen', 'cat_sanitaer', 'm²', 200, 'fq_taeglich'),
  s('sv_san_boden_wischen', 'Sanitärboden nass wischen und desinfizieren', 'cat_sanitaer', 'm²', 150, 'fq_taeglich'),
  s('sv_kontaktflaechen', 'Kontaktflächen desinfizieren', 'cat_sanitaer', 'Stk.', 12, 'fq_taeglich', 'Je Sanitärraum: Griffe, Schalter, Drücker'),
  s('sv_fliesen', 'Wandfliesen reinigen', 'cat_sanitaer', 'm²', 100, 'fq_1m'),

  // ── Küche ─────────────────────────────────────────────────────────────────
  s('sv_arbeitsflaechen', 'Arbeitsflächen reinigen', 'cat_kueche', 'm', 40, 'fq_taeglich', 'Laufende Meter Arbeitsfläche'),
  s('sv_spuele', 'Spüle reinigen', 'cat_kueche', 'Stk.', 30, 'fq_taeglich'),
  s('sv_kueche_armaturen', 'Küchenarmaturen reinigen', 'cat_kueche', 'Stk.', 40, 'fq_taeglich'),
  s('sv_geraete', 'Außenflächen Küchengeräte reinigen', 'cat_kueche', 'Stk.', 30, 'fq_1w', 'Kühlschrank, Mikrowelle, Kaffeemaschine u. a.'),
  s('sv_kueche_tische', 'Tische reinigen (Küche/Pausenraum)', 'cat_kueche', 'Stk.', 40, 'fq_taeglich'),
  s('sv_kueche_boden', 'Küchenboden reinigen', 'cat_kueche', 'm²', 200, 'fq_taeglich'),
  s('sv_kueche_abfall', 'Abfallbehälter leeren (Küche)', 'cat_kueche', 'Stk.', 60, 'fq_taeglich'),

  // ── Verkehrsflächen ───────────────────────────────────────────────────────
  s('sv_verkehr_saugen', 'Verkehrsflächen saugen', 'cat_verkehr', 'm²', 500, 'fq_2w'),
  s('sv_verkehr_kehren', 'Verkehrsflächen kehren', 'cat_verkehr', 'm²', 700, 'fq_2w'),
  s('sv_verkehr_wischen', 'Verkehrsflächen feucht wischen', 'cat_verkehr', 'm²', 300, 'fq_1w'),
  s('sv_flecken', 'Fleckentfernung nach Bedarf', 'cat_verkehr', 'h', 1, 'fq_bedarf', 'Aufwand je Einsatzstunde'),
  s('sv_verkehr_tueren', 'Türen im Verkehrsbereich reinigen', 'cat_verkehr', 'Stk.', 20, 'fq_1m'),
  s('sv_glasflaechen_innen', 'Glasflächen im Eingangsbereich reinigen', 'cat_verkehr', 'm²', 60, 'fq_1w'),
  s('sv_verkehr_handlauf', 'Handläufe reinigen', 'cat_verkehr', 'm', 120, 'fq_1w'),

  // ── Treppenhaus ───────────────────────────────────────────────────────────
  s('sv_treppe_kehren', 'Treppen und Podeste kehren', 'cat_treppe', 'm²', 300, 'fq_1w'),
  s('sv_treppe_saugen', 'Treppen und Podeste saugen', 'cat_treppe', 'm²', 250, 'fq_1w'),
  s('sv_treppe_wischen', 'Treppen und Podeste nass wischen', 'cat_treppe', 'm²', 200, 'fq_1w'),
  s('sv_treppe_handlauf', 'Handläufe und Geländer reinigen', 'cat_treppe', 'm', 100, 'fq_2w'),
  s('sv_treppe_fenster', 'Treppenhausfenster reinigen', 'cat_treppe', 'm²', 40, 'fq_1m'),
  s('sv_eingangstuer', 'Eingangstüren reinigen', 'cat_treppe', 'Stk.', 12, 'fq_1w'),
  s('sv_spinnweben', 'Spinnweben entfernen', 'cat_treppe', 'h', 1, 'fq_1m', 'Aufwand je Stunde'),

  // ── Glasreinigung ─────────────────────────────────────────────────────────
  s('sv_fenster_innen', 'Fensterreinigung innen', 'cat_glas', 'm²', 80, 'fq_quartal'),
  s('sv_fenster_aussen', 'Fensterreinigung außen', 'cat_glas', 'm²', 60, 'fq_quartal'),
  s('sv_fenster_beidseitig', 'Fensterreinigung beidseitig inkl. Rahmen', 'cat_glas', 'm²', 35, 'fq_quartal'),
  s('sv_rahmen_falze', 'Rahmen und Falze reinigen', 'cat_glas', 'm', 60, 'fq_halbjahr'),
  s('sv_glastueren', 'Glastüren reinigen', 'cat_glas', 'Stk.', 15, 'fq_1m'),
  s('sv_trennwaende', 'Glastrennwände reinigen', 'cat_glas', 'm²', 70, 'fq_1m'),
  s('sv_schaufenster', 'Schaufensterreinigung', 'cat_glas', 'm²', 90, 'fq_1m'),

  // ── Grundreinigung ────────────────────────────────────────────────────────
  s('sv_grund_hartboden', 'Grundreinigung Hartboden', 'cat_grund', 'm²', 40, 'fq_jahr'),
  s('sv_entschichten', 'Beschichtung entfernen (Entschichten)', 'cat_grund', 'm²', 25, 'fq_jahr'),
  s('sv_beschichten', 'Neubeschichtung / Einpflege', 'cat_grund', 'm²', 60, 'fq_jahr'),
  s('sv_teppich_intensiv', 'Intensivreinigung Teppich (Sprühextraktion)', 'cat_grund', 'm²', 30, 'fq_jahr'),
  s('sv_zwischenreinigung', 'Maschinelle Zwischenreinigung', 'cat_grund', 'm²', 80, 'fq_halbjahr'),
  s('sv_detail', 'Detailreinigung Inventar', 'cat_grund', 'h', 1, 'fq_jahr', 'Aufwand je Stunde'),

  // ── Bauendreinigung ───────────────────────────────────────────────────────
  s('sv_grob', 'Baugrobreinigung', 'cat_bau', 'm²', 100, 'fq_einmalig'),
  s('sv_bauschluss', 'Bauschlussreinigung', 'cat_bau', 'm²', 60, 'fq_einmalig'),
  s('sv_baufein', 'Baufeinreinigung', 'cat_bau', 'm²', 40, 'fq_einmalig'),
  s('sv_staub', 'Staub- und Feinstaubentfernung', 'cat_bau', 'm²', 80, 'fq_einmalig'),
  s('sv_folien', 'Schutzfolien entfernen', 'cat_bau', 'm²', 120, 'fq_einmalig'),
  s('sv_bau_glas', 'Baustellen-Glasreinigung', 'cat_bau', 'm²', 30, 'fq_einmalig'),

  // ── Sonderreinigung ───────────────────────────────────────────────────────
  s('sv_teppich_sonder', 'Teppichreinigung (Sonderleistung)', 'cat_sonder', 'm²', 30, 'fq_bedarf'),
  s('sv_polster', 'Polsterreinigung', 'cat_sonder', 'Stk.', 6, 'fq_bedarf', 'Je Sitzplatz'),
  s('sv_maschinen', 'Maschinen- und Anlagenreinigung', 'cat_sonder', 'h', 1, 'fq_bedarf'),
  s('sv_industrie', 'Industrieboden maschinell reinigen', 'cat_sonder', 'm²', 150, 'fq_1w'),
  s('sv_solar', 'Solaranlagenreinigung', 'cat_sonder', 'm²', 80, 'fq_jahr'),
  s('sv_sonder_aufwand', 'Sonderleistung nach Aufwand', 'cat_sonder', 'h', 1, 'fq_bedarf'),
];
