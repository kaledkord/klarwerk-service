/**
 * Lokale Analyse (Fallback ohne KI-Backend): einfacher deutscher
 * Regel-Parser für Anfragen wie „500 m² Büro, zweimal pro Woche,
 * 4 Büros, 2 Toiletten, Küche und Treppenhaus“.
 *
 * Erfindet keine Werte: nutzt die Leistungspakete und kennzeichnet
 * alles Unklare als Annahme bzw. fehlende Information.
 */

import type { KwData } from '../types';
import { ROOM_TEMPLATES, type TemplateKey } from '../templates';
import type { AiDraft, AiDraftService } from './draftSchema';

const WORD_NUMBERS: Record<string, number> = {
  ein: 1, eine: 1, einem: 1, einer: 1, zwei: 2, drei: 3, vier: 4, fuenf: 5, fünf: 5,
  sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwoelf: 12, zwölf: 12,
};

function num(text: string): number | null {
  const direct = /(\d+[.,]?\d*)/.exec(text);
  if (direct) return parseFloat(direct[1].replace('.', '').replace(',', '.'));
  for (const [w, v] of Object.entries(WORD_NUMBERS)) if (text.includes(w)) return v;
  return null;
}

function detectMainFrequency(text: string): { label: string; found: boolean } {
  const t = text.toLowerCase();
  const patterns: [RegExp, string][] = [
    [/(2|zwei)\s*(×|x|mal)?\s*(pro tag|taglich|täglich)/, '2× täglich (Mo–Fr)'],
    [/(taglich|täglich|jeden (arbeits)?tag|mo\s*[–-]\s*fr)/, 'täglich (Mo–Fr)'],
    [/(5|funf|fünf)\s*(×|x|mal)\s*(pro woche|wochentlich|wöchentlich|die woche)/, '5× wöchentlich'],
    [/(4|vier)\s*(×|x|mal)\s*(pro woche|wochentlich|wöchentlich|die woche)/, '4× wöchentlich'],
    [/(3|drei)\s*(×|x|mal)\s*(pro woche|wochentlich|wöchentlich|die woche)/, '3× wöchentlich'],
    [/(2|zwei)\s*(×|x|mal)\s*(pro woche|wochentlich|wöchentlich|die woche)/, '2× wöchentlich'],
    [/(1|ein)\s*(×|x|mal)\s*(pro woche|wochentlich|wöchentlich|die woche)/, '1× wöchentlich'],
    [/alle (zwei|2) wochen|14[- ]?t(ä|a)gig/, 'alle 2 Wochen'],
    [/(monatlich|1x im monat|einmal im monat)/, '1× monatlich'],
  ];
  for (const [re, label] of patterns) if (re.test(t)) return { label, found: true };
  return { label: '2× wöchentlich', found: false };
}

interface RoomHit {
  template: TemplateKey;
  label: string;
  areaLabel: string;
  count: number;
  areaShare: number;
}

export function localAnalyze(message: string, data: KwData): { aiText: string; draft: AiDraft } {
  const t = message.toLowerCase();
  const totalArea = (() => {
    const m = /(\d+[.,]?\d*)\s*(m²|m2|qm|quadratmeter)/.exec(t);
    return m ? parseFloat(m[1].replace('.', '').replace(',', '.')) : null;
  })();

  const mainFreq = detectMainFrequency(t);

  const objectType = /praxis|zahnarzt|arzt/.test(t)
    ? 'Praxis'
    : /lager|halle|logistik/.test(t)
      ? 'Lager'
      : /kita|schule/.test(t)
        ? 'Schule'
        : /verkauf|laden|studio|autohaus/.test(t)
          ? 'Verkaufsfläche'
          : 'Büro';

  // Raumtreffer sammeln
  const hits: RoomHit[] = [];
  const grab = (re: RegExp, template: TemplateKey, label: string, areaLabel: string, share: number) => {
    const m = re.exec(t);
    if (!m) return;
    const context = t.slice(Math.max(0, (m.index ?? 0) - 12), m.index);
    const count = num(context) ?? 1;
    hits.push({ template, label, areaLabel, count, areaShare: share });
  };
  grab(/b(ü|u)ro/, 'buero', 'Büros', 'Bürobereich', 0.6);
  grab(/besprechung|konferenz/, 'besprechung', 'Besprechungsräume', 'Bürobereich', 0.08);
  grab(/toilette|wc|sanit(ä|a)r/, 'sanitaer', 'Sanitärbereich', 'Sanitär', 0.08);
  grab(/k(ü|u)che|teek(ü|u)che/, 'kueche', 'Küche', 'Sozialbereich', 0.06);
  grab(/treppenhaus|treppe/, 'treppenhaus', 'Treppenhaus', 'Treppenhaus', 0.06);
  grab(/flur|verkehrsfl/, 'flur', 'Flure', 'Verkehrsflächen', 0.12);
  grab(/empfang|eingang/, 'eingang', 'Empfang', 'Verkehrsflächen', 0.06);
  grab(/lager(?!hal)/, 'lager', 'Lager', 'Lager', 0.1);
  grab(/behandlung/, 'behandlung', 'Behandlungsräume', 'Behandlung', 0.4);

  if (hits.length === 0) {
    hits.push({ template: 'buero', label: 'Flächen gesamt', areaLabel: 'Allgemein', count: 1, areaShare: 1 });
  }

  const shareSum = hits.reduce((s, h) => s + h.areaShare, 0);
  const services: AiDraftService[] = [];
  const assumptions: string[] = [];
  const missing: string[] = [];
  const questions: string[] = [];

  const freqNameById = (id: string) => data.frequencies.find((f) => f.id === id)?.name ?? '1× wöchentlich';

  for (const hit of hits) {
    const tpl = ROOM_TEMPLATES[hit.template];
    const area = totalArea != null ? (totalArea * hit.areaShare) / shareSum : null;
    for (const item of tpl.items) {
      const service = data.services.find((s) => s.id === item.serviceId);
      if (!service) continue;
      const qty =
        service.unit === 'm²'
          ? area != null
            ? Math.round(area * 10) / 10
            : null
          : area != null
            ? item.qty(area)
            : hit.count;
      services.push({
        area: hit.areaLabel,
        room: hit.label,
        service_id: service.id,
        service_name: service.name,
        frequency_label: item.freq === 'main' ? mainFreq.label : freqNameById(item.freq),
        quantity: qty,
        unit: service.unit,
        confidence: item.freq === 'main' && mainFreq.found ? 0.75 : 0.55,
        assumption: null,
      });
    }
  }

  if (totalArea == null) missing.push('Gesamtfläche des Objekts (m²)');
  if (!mainFreq.found) {
    assumptions.push('Kein Turnus erkannt — 2× wöchentlich als vorläufiger Standard angesetzt.');
    questions.push('Wie oft soll die Unterhaltsreinigung stattfinden (z. B. 2× oder 3× wöchentlich)?');
  }
  if (totalArea != null && hits.length > 1) {
    assumptions.push('Flächenaufteilung auf die Bereiche wurde anteilig geschätzt — bitte prüfen.');
  }
  missing.push('Bodenarten der Räume');
  questions.push('Werden Verbrauchsmaterialien (Papier, Seife) vom Auftraggeber gestellt?');
  questions.push('Wie weit ist das Objekt vom Firmensitz entfernt (km)?');

  const draft: AiDraft = {
    object: { name: null, type: objectType, total_area_sqm: totalArea },
    areas: hits.map((h) => ({
      name: h.areaLabel,
      rooms: [
        {
          name: h.label,
          type: null,
          quantity: h.count,
          area_sqm: totalArea != null ? Math.round(((totalArea * h.areaShare) / shareSum) * 10) / 10 : null,
        },
      ],
    })),
    services,
    missing_information: missing,
    assumptions,
    questions,
    warnings: ['Lokale Analyse ohne KI-Backend — Ergebnis besonders sorgfältig prüfen.'],
    summary: `Lokaler Entwurf: ${objectType}${totalArea ? ` mit ca. ${totalArea} m²` : ''}, ${services.length} Leistungspositionen (Haupt-Turnus ${mainFreq.label}).`,
  };

  const aiText = `Ich habe Ihre Anfrage lokal (ohne KI-Backend) analysiert und einen ersten Entwurf mit ${services.length} Positionen erstellt. ${missing.length > 0 ? `Für eine genauere Kalkulation fehlen noch: ${missing.join(', ')}.` : ''} Bitte prüfen Sie den Entwurf rechts — nichts wird ohne Ihre Freigabe übernommen.`;

  return { aiText, draft };
}
