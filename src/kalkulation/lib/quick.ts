/**
 * Schnellkalkulation: erzeugt aus wenigen Angaben (Objektart, Fläche,
 * Reinigungsart, Turnus, Verschmutzung, Entfernung) einen vollständigen
 * Kalkulationsentwurf auf Basis der Leistungspakete.
 */

import type { CalcLine, KwData } from './types';
import { NEUTRAL_FACTORS } from './types';
import { lineFromService } from './lines';
import { quickSplitsForObjectType, ROOM_TEMPLATES } from './templates';

export type QuickCleaningKind = 'unterhalt' | 'glas' | 'grund' | 'bauend';

export interface QuickInput {
  objectTypeName: string;
  areaSqm: number;
  kind: QuickCleaningKind;
  mainFrequencyId: string;
  soilingKey: string; // Verschmutzungsgrad
  extras: { glas: boolean; grundreinigung: boolean };
  distanceKm: number;
}

export interface QuickResult {
  lines: CalcLine[];
  assumptions: string[];
}

export function buildQuickLines(input: QuickInput, data: KwData): QuickResult {
  const assumptions: string[] = [];
  const lines: CalcLine[] = [];
  const factors = { ...NEUTRAL_FACTORS, soiling: input.soilingKey };
  let sort = 0;
  const next = () => (sort += 10);

  const push = (serviceId: string, areaLabel: string, roomLabel: string, quantity: number, frequencyId: string) => {
    const service = data.services.find((s) => s.id === serviceId);
    if (!service || !service.active) return;
    lines.push(
      lineFromService(service, data.settings, {
        areaLabel,
        roomLabel,
        quantity: Math.round(quantity * 10) / 10,
        frequencyId,
        factors,
        sortOrder: next(),
      })
    );
  };

  if (input.kind === 'unterhalt') {
    const splits = quickSplitsForObjectType(input.objectTypeName);
    assumptions.push(
      `Flächenaufteilung nach typischem ${input.objectTypeName}-Profil geschätzt (${splits
        .map((s) => `${Math.round(s.share * 100)} % ${s.roomLabel}`)
        .join(', ')}) — bitte in der Profi-Kalkulation prüfen.`
    );
    for (const split of splits) {
      const area = input.areaSqm * split.share;
      const tpl = ROOM_TEMPLATES[split.template];
      for (const item of tpl.items) {
        const service = data.services.find((s) => s.id === item.serviceId);
        if (!service) continue;
        const qty = service.unit === 'm²' ? area : item.qty(area);
        push(item.serviceId, split.areaLabel, split.roomLabel, qty, item.freq === 'main' ? input.mainFrequencyId : item.freq);
      }
    }
  } else if (input.kind === 'glas') {
    const glassArea = input.areaSqm;
    push('sv_fenster_beidseitig', 'Glasreinigung', 'Fensterflächen', glassArea, input.mainFrequencyId);
    push('sv_rahmen_falze', 'Glasreinigung', 'Rahmen und Falze', glassArea * 0.8, input.mainFrequencyId);
    assumptions.push('Angegebene Fläche als Glasfläche (beidseitig) interpretiert.');
  } else if (input.kind === 'grund') {
    push('sv_grund_hartboden', 'Grundreinigung', 'Bodenflächen', input.areaSqm, 'fq_einmalig');
    push('sv_beschichten', 'Grundreinigung', 'Neubeschichtung', input.areaSqm, 'fq_einmalig');
    assumptions.push('Grundreinigung inkl. Neubeschichtung als einmalige Leistung kalkuliert.');
  } else if (input.kind === 'bauend') {
    push('sv_bauschluss', 'Bauendreinigung', 'Bauschlussreinigung', input.areaSqm, 'fq_einmalig');
    push('sv_baufein', 'Bauendreinigung', 'Baufeinreinigung', input.areaSqm, 'fq_einmalig');
    push('sv_bau_glas', 'Bauendreinigung', 'Glasflächen', input.areaSqm * 0.15, 'fq_einmalig');
    assumptions.push('Glasanteil mit 15 % der Fläche geschätzt.');
  }

  // Besondere Leistungen
  if (input.extras.glas && input.kind === 'unterhalt') {
    push('sv_fenster_beidseitig', 'Glasreinigung', 'Fensterflächen', input.areaSqm * 0.2, 'fq_quartal');
    assumptions.push('Glasfläche mit 20 % der Objektfläche geschätzt (quartalsweise Reinigung).');
  }
  if (input.extras.grundreinigung && input.kind === 'unterhalt') {
    push('sv_grund_hartboden', 'Grundreinigung', 'Bodenflächen', input.areaSqm * 0.6, 'fq_einmalig');
    assumptions.push('Grundreinigung einmalig für ca. 60 % der Fläche (Hartböden) angesetzt.');
  }

  if (input.soilingKey !== 'normal') {
    const opt = data.settings.performanceFactors.soiling.find((o) => o.key === input.soilingKey);
    if (opt) assumptions.push(`Verschmutzungsgrad „${opt.label}“ auf alle Leistungswerte angewendet (${Math.round((opt.multiplier - 1) * 100)} %).`);
  }

  return { lines, assumptions };
}
