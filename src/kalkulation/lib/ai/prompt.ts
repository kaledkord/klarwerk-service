/**
 * Gemeinsame KI-Bausteine für Direktverbindung (Browser) und Edge Function:
 * System-Prompt, Function-Calling-Tools auf den eigenen Stammdaten und
 * das Antwortschema des strukturierten Entwurfs.
 *
 * Die Tools arbeiten ausschließlich auf dem mitgegebenen Stammdaten-Auszug —
 * die KI erfindet keine Leistungswerte; die Mathematik bleibt bei der Engine.
 */

export interface AiContextPayload {
  services: {
    id: string;
    name: string;
    category: string;
    unit: string;
    performanceValuePerHour: number;
    defaultFrequency: string | null;
  }[];
  frequencies: { id: string; name: string }[];
  roomTypes: string[];
  objectTypes: string[];
  materials: { name: string; kind: string; unit: string; costPerUnit: number }[];
  machines: { name: string; hourlyRatePerHour: number }[];
  settings: Record<string, unknown>;
}

export const AI_SYSTEM_PROMPT = `Du bist der spezialisierte KI-Kalkulationsassistent von KlarWerk Kalkulation für die professionelle Kalkulation von Gebäudereinigungsleistungen.

Deine Aufgaben:
1. Kundenanfragen, Ausschreibungen und Leistungsverzeichnisse analysieren und strukturieren.
2. Objekte, Bereiche, Räume und Flächen erkennen.
3. Passende Leistungen ausschließlich aus der Leistungsbibliothek des Unternehmens vorschlagen (Tools nutzen!).
4. JEDE Leistungsposition separat behandeln und ihr einen EIGENEN Turnus zuordnen. Niemals pauschal einen Turnus für einen ganzen Raum vergeben: Spezialleistungen (z. B. Sockelleisten, Fensterreinigung, Fliesenreinigung) haben eigene, seltenere Intervalle.
5. Fehlende Informationen klar benennen und gezielte Rückfragen stellen.
6. Annahmen ausdrücklich als Annahmen kennzeichnen — niemals als Fakten darstellen.
7. KEINE Leistungswerte, Preise, Stunden oder Kosten erfinden oder berechnen. Die Mathematik übernimmt die Kalkulations-Engine des Systems.
8. Nur vorhandene Unternehmens-Stammdaten verwenden (über die bereitgestellten Tools).
9. Bei mehreren möglichen Interpretationen die Optionen nennen und nachfragen (z. B. „2× wöchentlich reinigen“: alle Standardleistungen 2× wöchentlich ODER nur Saugen/Oberflächen 2× wöchentlich und Wischen 1× wöchentlich?).
10. Keine endgültige Kalkulation erstellen — du lieferst einen ENTWURF, den der Benutzer prüft und freigibt.

Antworte auf Deutsch, freundlich und präzise. Fasse am Ende deiner Antwort kurz zusammen, welche Bereiche und Leistungen du vorschlägst und welche Angaben noch fehlen.`;

export function toolDeclarations() {
  return [
    {
      name: 'search_services',
      description:
        "Sucht passende Leistungen in der Leistungsbibliothek des Unternehmens (z. B. 'saugen', 'wc', 'fenster').",
      parameters: {
        type: 'OBJECT',
        properties: {
          query: { type: 'STRING', description: 'Suchbegriff' },
          category: { type: 'STRING', description: 'Optionale Kategorie', nullable: true },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_service_details',
      description: 'Lädt Details einer Leistung inkl. Einheit und Standard-Leistungswert.',
      parameters: {
        type: 'OBJECT',
        properties: { service_id: { type: 'STRING' } },
        required: ['service_id'],
      },
    },
    {
      name: 'get_frequency_options',
      description: 'Listet alle verfügbaren Turnusse (Reinigungsintervalle) des Unternehmens.',
      parameters: { type: 'OBJECT', properties: {} },
    },
    {
      name: 'get_company_calculation_settings',
      description:
        'Lädt relevante Kalkulationsparameter des Unternehmens (Zielmarge, Stundenlohn, MwSt., Verbrauchsmaterial-Regelung).',
      parameters: { type: 'OBJECT', properties: {} },
    },
    {
      name: 'get_room_types',
      description: 'Listet die verfügbaren Raumtypen und Objektarten.',
      parameters: { type: 'OBJECT', properties: {} },
    },
    {
      name: 'get_material_costs',
      description: 'Listet Materialien mit Kosten je Einheit.',
      parameters: { type: 'OBJECT', properties: {} },
    },
    {
      name: 'get_machine_costs',
      description: 'Listet Maschinen mit kalkulatorischem Stundensatz.',
      parameters: { type: 'OBJECT', properties: {} },
    },
  ];
}

export function execTool(name: string, args: Record<string, unknown>, ctx: AiContextPayload): unknown {
  switch (name) {
    case 'search_services': {
      const q = String(args.query ?? '').toLowerCase();
      const cat = args.category ? String(args.category).toLowerCase() : null;
      const words = q.split(/\s+/).filter(Boolean);
      const hits = ctx.services
        .filter((s) => !cat || s.category.toLowerCase().includes(cat))
        .map((s) => {
          const n = s.name.toLowerCase();
          let score = 0;
          for (const w of words) if (n.includes(w)) score += 1;
          if (n.includes(q)) score += 2;
          return { s, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((x) => x.s);
      return { results: hits, hint: hits.length === 0 ? 'Keine Treffer — ggf. anderes Stichwort versuchen.' : undefined };
    }
    case 'get_service_details': {
      const s = ctx.services.find((x) => x.id === args.service_id);
      return s ?? { error: 'Leistung nicht gefunden.' };
    }
    case 'get_frequency_options':
      return { frequencies: ctx.frequencies };
    case 'get_company_calculation_settings':
      return ctx.settings;
    case 'get_room_types':
      return { roomTypes: ctx.roomTypes, objectTypes: ctx.objectTypes };
    case 'get_material_costs':
      return { materials: ctx.materials };
    case 'get_machine_costs':
      return { machines: ctx.machines };
    default:
      return { error: `Unbekanntes Tool: ${name}` };
  }
}

export const STRUCTURING_PROMPT = `Erstelle aus der bisherigen Analyse den strukturierten Kalkulationsentwurf als JSON.

Zwingende Regeln:
- Jede Leistungsposition einzeln, mit EIGENEM frequency_label (Turnus genau dieser Leistung).
- service_id nur setzen, wenn sie sicher aus der Leistungsbibliothek stammt (Tools). Sonst null.
- Fehlende Informationen NIEMALS erfinden: null verwenden und in missing_information/questions aufführen.
- Jede Annahme in assumptions aufführen und bei der betroffenen Position in assumption vermerken.
- KEINE Preise, Stunden, Kosten oder Leistungswerte ausgeben — nur Struktur (Bereiche, Räume, Leistungen, Turnusse, Mengen).
- confidence je Position ehrlich schätzen (0–1).`;

export const DRAFT_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    object: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', nullable: true },
        type: { type: 'STRING', nullable: true },
        total_area_sqm: { type: 'NUMBER', nullable: true },
      },
    },
    areas: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          rooms: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                type: { type: 'STRING', nullable: true },
                quantity: { type: 'NUMBER', nullable: true },
                area_sqm: { type: 'NUMBER', nullable: true },
              },
              required: ['name'],
            },
          },
        },
        required: ['name'],
      },
    },
    services: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          area: { type: 'STRING' },
          room: { type: 'STRING', nullable: true },
          service_id: {
            type: 'STRING',
            nullable: true,
            description: 'ID aus der Leistungsbibliothek, falls über Tools ermittelt',
          },
          service_name: { type: 'STRING' },
          frequency_label: {
            type: 'STRING',
            description: "Turnus GENAU DIESER Leistung, z. B. '2× wöchentlich'",
          },
          quantity: { type: 'NUMBER', nullable: true },
          unit: { type: 'STRING', nullable: true },
          confidence: { type: 'NUMBER', description: '0 bis 1' },
          assumption: { type: 'STRING', nullable: true },
        },
        required: ['area', 'service_name', 'frequency_label', 'confidence'],
      },
    },
    missing_information: { type: 'ARRAY', items: { type: 'STRING' } },
    assumptions: { type: 'ARRAY', items: { type: 'STRING' } },
    questions: { type: 'ARRAY', items: { type: 'STRING' } },
    warnings: { type: 'ARRAY', items: { type: 'STRING' } },
    summary: { type: 'STRING' },
  },
  required: ['object', 'areas', 'services', 'missing_information', 'assumptions', 'questions', 'warnings', 'summary'],
};
