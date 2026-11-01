import { services, type Service } from './services';

// Die vier Leistungsbereiche, in den Farben der vier Säulen aus dem Logo. Sie ordnen die Seite
// /leistungen (Sprungleiste und Abschnitte), das Menü „Leistungen“ und die Farbe der Leistungskarten.
// Welche Leistung in welchen Bereich gehört, steht an der Leistung selbst (`bereich` in services.ts).

export type Bereich = 'regelmaessig' | 'branchen' | 'einmalig' | 'haus-aussen';

export const LOGOFARBE = { blau: '#35A1DA', orange: '#F5891F', rot: '#F0552B', gruen: '#21A841' } as const;
/** Hellere Fassung für Schrift auf dunklem Grund (Kontrast mindestens 4,5:1 auf paper). */
export const LOGOFARBE_HELL = { blau: '#7cc4e8', orange: '#f9a95a', rot: '#f58a6b', gruen: '#6fd398' } as const;
export type Logofarbe = keyof typeof LOGOFARBE;

export interface Leistungsbereich {
  /** Zugleich die Sprungmarke auf /leistungen (#regelmaessig …). */
  id: Bereich;
  titel: string;
  /** Kurzform für die Sprungleiste unter 1280 px und das Menü. */
  kurz: string;
  text: string;
  farbe: Logofarbe;
}

export const leistungsbereiche: Leistungsbereich[] = [
  {
    id: 'regelmaessig',
    titel: 'Regelmäßige Reinigung',
    kurz: 'Regelmäßig',
    text: 'Feste Termine und feste Ansprechpartner: Sauberkeit, um die Sie sich nicht mehr kümmern müssen.',
    farbe: 'blau',
  },
  {
    id: 'branchen',
    titel: 'Reinigung für Ihre Branche',
    kurz: 'Für Ihre Branche',
    text: 'Praxen, Pflege, Kitas, Schulen, Gastronomie, Handel und Lager: Hygiene nach den Anforderungen Ihres Hauses.',
    farbe: 'orange',
  },
  {
    id: 'einmalig',
    titel: 'Sonder- und Einmalreinigung',
    kurz: 'Einmalig',
    text: 'Einmal gründlich: nach dem Bau, vor dem Einzug oder wenn es mehr braucht als die tägliche Reinigung.',
    farbe: 'rot',
  },
  {
    id: 'haus-aussen',
    titel: 'Haus und Außenanlagen',
    kurz: 'Haus & Außen',
    text: 'Hausmeisterservice, Grünpflege und Winterdienst rund um Ihr Objekt.',
    farbe: 'gruen',
  },
];

/** Leistungen eines Bereichs in der Reihenfolge von services.ts. */
export function leistungenIm(bereich: Bereich): Service[] {
  return services.filter((s) => s.bereich === bereich);
}

export function farbeVon(service: Service): Logofarbe {
  return leistungsbereiche.find((b) => b.id === service.bereich)?.farbe ?? 'blau';
}
