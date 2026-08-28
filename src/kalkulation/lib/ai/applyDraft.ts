/**
 * Übernahme eines KI-Entwurfs in echte Kalkulationszeilen.
 * Leistungen und Turnusse werden gegen die eigenen Stammdaten aufgelöst —
 * die KI erfindet keine Leistungswerte: Basis ist immer die Bibliothek.
 */

import type { CalcLine, KwData } from '../types';
import { NEUTRAL_FACTORS } from '../types';
import { lineFromService } from '../lines';
import type { AiDraft, AiDraftService } from './draftSchema';

export interface ResolvedDraftLine {
  draft: AiDraftService;
  line: CalcLine | null;
  /** Hinweis, wenn Leistung oder Turnus nicht sauber aufgelöst werden konnten. */
  resolution: string[];
  confidence: number;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Leistung anhand ID oder Namensähnlichkeit in der Bibliothek finden. */
export function resolveService(entry: AiDraftService, data: KwData) {
  if (entry.service_id) {
    const byId = data.services.find((s) => s.id === entry.service_id && s.active);
    if (byId) return { service: byId, note: null };
  }
  const target = normalize(entry.service_name);
  const targetWords = target.split(' ').filter((w) => w.length > 3);
  let best: { service: (typeof data.services)[number]; score: number } | null = null;
  for (const s of data.services) {
    if (!s.active) continue;
    const name = normalize(s.name);
    let score = 0;
    if (name === target) score = 100;
    else if (name.includes(target) || target.includes(name)) score = 80;
    else {
      for (const w of targetWords) if (name.includes(w)) score += 20;
    }
    if (score > 0 && (!best || score > best.score)) best = { service: s, score };
  }
  if (best && best.score >= 20) {
    return {
      service: best.service,
      note: best.score < 80 ? `„${entry.service_name}“ → „${best.service.name}“ zugeordnet` : null,
    };
  }
  return { service: null, note: `Leistung „${entry.service_name}“ nicht in der Bibliothek gefunden` };
}

/** Turnus-Klartext („2× wöchentlich“, „täglich“, „monatlich“ …) auflösen. */
export function resolveFrequency(label: string, data: KwData) {
  const t = normalize(label);
  const exact = data.frequencies.find((f) => normalize(f.name) === t);
  if (exact) return { id: exact.id, note: null };

  const num = /(\d+[.,]?\d*)/.exec(t);
  const count = num ? parseFloat(num[1].replace(',', '.')) : 1;

  const pick = (id: string, note: string | null = null) => {
    const f = data.frequencies.find((x) => x.id === id);
    return f ? { id: f.id, note } : { id: 'fq_1w', note: `Turnus „${label}“ unklar — 1× wöchentlich angenommen` };
  };

  if (/(taglich|jeden tag|mo\s*-?\s*fr|werktag)/.test(t)) {
    if (count >= 2) return pick('fq_2x_taeglich');
    return pick('fq_taeglich');
  }
  if (/woch/.test(t)) {
    if (/alle 2|zweiwoch|14/.test(t)) return pick('fq_14t');
    const map: Record<number, string> = { 1: 'fq_1w', 2: 'fq_2w', 3: 'fq_3w', 4: 'fq_4w', 5: 'fq_5w', 6: 'fq_6w' };
    return pick(map[Math.round(count)] ?? 'fq_1w', map[Math.round(count)] ? null : `„${label}“ → 1× wöchentlich angenommen`);
  }
  if (/monat/.test(t)) {
    if (Math.round(count) === 2) return pick('fq_2m');
    return pick('fq_1m');
  }
  if (/quartal|vierteljahr/.test(t)) return pick('fq_quartal');
  if (/halbjahr/.test(t)) return pick('fq_halbjahr');
  if (/jahr/.test(t)) return pick('fq_jahr');
  if (/einmal/.test(t)) return pick('fq_einmalig');
  if (/bedarf|abruf/.test(t)) return pick('fq_bedarf');
  return { id: 'fq_1w', note: `Turnus „${label}“ unklar — 1× wöchentlich angenommen` };
}

/** Alle Entwurfspositionen gegen die Stammdaten auflösen (ohne zu speichern). */
export function resolveDraft(draft: AiDraft, data: KwData): ResolvedDraftLine[] {
  let sort = 0;
  return draft.services.map((entry) => {
    const resolution: string[] = [];
    const { service, note: serviceNote } = resolveService(entry, data);
    if (serviceNote) resolution.push(serviceNote);
    const { id: frequencyId, note: freqNote } = resolveFrequency(entry.frequency_label, data);
    if (freqNote) resolution.push(freqNote);
    if (entry.assumption) resolution.push(`Annahme: ${entry.assumption}`);

    if (!service) {
      return { draft: entry, line: null, resolution, confidence: entry.confidence };
    }

    // Menge: von der KI, sonst aus der Bereichs-/Raumfläche des Entwurfs
    let quantity = entry.quantity ?? null;
    if (quantity == null && service.unit === 'm²') {
      const area = draft.areas.find((a) => a.name === entry.area);
      const room = area?.rooms.find((r) => !entry.room || r.name === entry.room);
      quantity = room?.area_sqm ?? null;
      if (quantity == null && draft.object.total_area_sqm && draft.areas.length <= 1) {
        quantity = draft.object.total_area_sqm;
        resolution.push('Menge aus Gesamtfläche übernommen — bitte prüfen');
      }
    }
    if (quantity == null) {
      quantity = service.unit === 'm²' ? 0 : 1;
      if (service.unit === 'm²') resolution.push('Fläche fehlt — bitte ergänzen');
    }

    sort += 10;
    const line = lineFromService(service, data.settings, {
      areaLabel: entry.area,
      roomLabel: entry.room ?? entry.area,
      quantity,
      frequencyId,
      factors: { ...NEUTRAL_FACTORS },
      sortOrder: sort,
      note: entry.assumption ? `KI-Annahme: ${entry.assumption}` : undefined,
    });
    return { draft: entry, line, resolution, confidence: entry.confidence };
  });
}
