/** Stichpunkt unter „Unsere Reinigungsleistungen in …“, auf Wunsch mit Link auf die passende Seite. */
export type CityHighlight = string | { text: string; to: string };

export interface City {
  slug: string;
  name: string;
  region: string;
  description: string;
  intro: string;
  /** Satz nach der Einleitung mit Links auf die Ortsseiten der Leistungen (nur Städte mit eigenen Seiten). */
  eigeneSeiten?: { vorspann: string; links: { label: string; to: string }[] };
  highlights: CityHighlight[];
  /** Zusätzliche Fragen vor den allgemeinen FAQ der Stadtseite. */
  faqs?: { question: string; answer: string }[];
  image: string;
  /** Priorität für Sortierung/Signale: 1 = Kernregion SH, 2 = Hamburg, 3 = überregional. */
  tier: 1 | 2 | 3;
  /** Optionaler eigener Seitentitel (inkl. Marke), sonst „Gebäudereinigung {Ort} | KlarWerk Service“. */
  seoTitle?: string;
}

export const cities: City[] = [
  {
    slug: 'bordesholm',
    name: 'Bordesholm',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung mit Firmensitz in Bordesholm: Büros, Praxen und Wohnanlagen im Amt Bordesholm, kurze Wege, fester Ansprechpartner. Angebot anfragen.',
    seoTitle: 'Gebäudereinigung aus Bordesholm | KlarWerk Service',
    intro:
      'In Bordesholm und im gesamten Amt Bordesholm zwischen Kiel und Neumünster betreut KlarWerk Service Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. Feste Ansprechpartner, verlässliche Termine und gründliche Ergebnisse – von der regelmäßigen Unterhaltsreinigung bis zur einmaligen Grund- und Sonderreinigung.',
    highlights: [
      'Reinigung für Gewerbe, Büros und Praxen in Bordesholm',
      'Treppenhaus- und Unterhaltsreinigung für Wohnanlagen im Amt Bordesholm',
      'Feste Ansprechpartner und verlässliche Termine',
      'Hausmeisterservice und Gartenpflege aus einer Hand',
    ],
    image: '/bilder/leistung-unterhaltsreinigung.jpg',
    tier: 1,
  },
  {
    slug: 'kiel',
    name: 'Kiel',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Kiel: Büro-, Praxis- und Glasreinigung mit festem Ansprechpartner, von Bordesholm in 20 Minuten im ganzen Stadtgebiet und Umland.',
    seoTitle: 'Gebäudereinigung Kiel für Büro & Praxis | KlarWerk Service',
    intro:
      'KlarWerk Service reinigt Büros, Praxen, Geschäfte und Wohnanlagen in ganz Kiel – auf dem Westufer von der Innenstadt über Ravensberg, Schreventeich und Wik bis Mettenhof und Friedrichsort, auf dem Ostufer in Gaarden, Neumühlen-Dietrichsdorf und Wellsee. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich, über die A215 sind wir in 20 Minuten bei Ihnen.',
    eigeneSeiten: {
      vorspann: 'Für die häufigsten Aufträge haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung', to: '/leistungen/bueroreinigung/kiel' },
        { label: 'Praxisreinigung', to: '/leistungen/praxisreinigung/kiel' },
        { label: 'Glasreinigung', to: '/leistungen/glasreinigung/kiel' },
        { label: 'Grundreinigung für Kitas und Schulen in Kiel', to: '/leistungen/grundreinigung/kiel' },
        { label: 'Unterhaltsreinigung', to: '/leistungen/unterhaltsreinigung/kiel' },
        { label: 'Bauendreinigung', to: '/leistungen/bauendreinigung/kiel' },
        { label: 'Kita-Reinigung', to: '/leistungen/kita-reinigung/kiel' },
        { label: 'Schulreinigung', to: '/leistungen/schulreinigung/kiel' },
      ],
    },
    highlights: [
      { text: 'Büroreinigung in Kiel nach Feierabend', to: '/leistungen/bueroreinigung/kiel' },
      { text: 'Praxisreinigung in Kiel nach Hygieneplan', to: '/leistungen/praxisreinigung/kiel' },
      { text: 'Glasreinigung in Kiel, streifenfrei innen und außen', to: '/leistungen/glasreinigung/kiel' },
      { text: 'Treppenhausreinigung für Wohnanlagen in Kiel', to: '/leistungen/unterhaltsreinigung/kiel' },
    ],
    faqs: [
      {
        question: 'In welchen Stadtteilen von Kiel reinigen Sie?',
        answer:
          'Im ganzen Stadtgebiet: auf dem Westufer in der Innenstadt, in Ravensberg, Brunswik, Schreventeich, Wik, Hassee, Suchsdorf, am Südfriedhof, in Mettenhof und Friedrichsort, auf dem Ostufer in Gaarden, Neumühlen-Dietrichsdorf und Wellsee. Dazu kommt das Umland mit Kronshagen, Altenholz, Molfsee, Flintbek, Schwentinental und Heikendorf.',
      },
    ],
    image: '/bilder/stadt-kiel.jpg',
    tier: 1,
  },
  {
    slug: 'neumuenster',
    name: 'Neumünster',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Neumünster für Büros, Praxen und Gewerbe: Unterhalts-, Glas- und Grundreinigung, fester Ansprechpartner, kurze Anfahrt aus Bordesholm.',
    intro:
      'In Neumünster bieten wir umfassende Gebäudereinigung für gewerbliche und private Kunden an. Ob Büroreinigung, Glasreinigung oder Hausmeisterservice – KlarWerk Service sorgt für Sauberkeit in der Mittelstadt zwischen Kiel und Hamburg.',
    highlights: [
      'Büroreinigung im Neumünsteraner Stadtgebiet',
      'Treppenhausreinigung für Mehrfamilienhäuser',
      'Glasreinigung für Geschäfte und Praxen',
      'Grundreinigung und Bauendreinigung in Neumünster',
    ],
    image: '/bilder/stadt-neumuenster.jpg',
    tier: 1,
  },
  {
    slug: 'rendsburg',
    name: 'Rendsburg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Rendsburg für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Rendsburg für Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. An der Eider und im gesamten Kreis Rendsburg-Eckernförde sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    eigeneSeiten: {
      vorspann: 'Für die drei häufigsten Aufträge in Rendsburg haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung', to: '/leistungen/bueroreinigung/rendsburg' },
        { label: 'Praxisreinigung', to: '/leistungen/praxisreinigung/rendsburg' },
        { label: 'Glasreinigung in Rendsburg', to: '/leistungen/glasreinigung/rendsburg' },
      ],
    },
    highlights: [
      { text: 'Büroreinigung in Rendsburg nach Feierabend', to: '/leistungen/bueroreinigung/rendsburg' },
      { text: 'Praxisreinigung in Rendsburg nach Hygieneplan', to: '/leistungen/praxisreinigung/rendsburg' },
      { text: 'Glasreinigung in Rendsburg, streifenfrei innen und außen', to: '/leistungen/glasreinigung/rendsburg' },
      'Treppenhausreinigung für Wohnanlagen in Rendsburg',
    ],
    image: '/bilder/stadt-rendsburg.jpg',
    tier: 1,
  },
  {
    slug: 'preetz',
    name: 'Preetz',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Preetz: Zuverlässige Reinigung für Wohn- und Geschäftsobjekte. Persönlicher Service für Preetz und Umgebung.',
    intro:
      'KlarWerk Service bietet professionelle Gebäudereinigung in Preetz und Umgebung an. Wir betreuen Wohnanlagen, Büros und Geschäftsobjekte in der Schusterstadt mit persönlichem Engagement und regionaler Nähe.',
    highlights: [
      'Regelmäßige Reinigung für Wohnanlagen in Preetz',
      'Büroreinigung für kleine und mittlere Unternehmen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege für Außenanlagen in Preetz',
    ],
    image: '/bilder/stadt-preetz.jpg',
    tier: 1,
  },
  {
    slug: 'ploen-eckernfoerde',
    name: 'Plön & Eckernförde',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Plön und Eckernförde: Professionelle Reinigung für Wohn- und Geschäftsobjekte. Zuverlässig, flexibel und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Plön und Eckernförde an. Von der Holsteinischen Schweiz bis zur Ostseeküste sorgen wir für Sauberkeit in Wohnanlagen, Büros und Geschäftsobjekten – mit regionaler Nähe und persönlichem Engagement.',
    highlights: [
      'Büroreinigung für Unternehmen in Plön und Eckernförde',
      'Treppenhausreinigung für Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege und Außenanlagenpflege',
    ],
    image: '/bilder/stadt-ploen-eckernfoerde.jpg',
    tier: 1,
  },
  {
    slug: 'bad-segeberg',
    name: 'Bad Segeberg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Bad Segeberg für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'In Bad Segeberg bietet KlarWerk Service umfassende Gebäudereinigung für gewerbliche und private Kunden. Vom Kurort bis ins Umland sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Bad Segeberger Stadtgebiet',
      'Treppenhausreinigung für Wohnanlagen',
      'Glasreinigung für Geschäfte und Praxen',
      'Hausmeisterservice für Wohnanlagen in Bad Segeberg',
    ],
    image: '/bilder/stadt-bad-segeberg.jpg',
    tier: 1,
  },
  {
    slug: 'eutin',
    name: 'Eutin',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Eutin: Professionelle Reinigung für Wohn- und Geschäftsobjekte. Zuverlässig, flexibel und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Eutin und Umgebung an. In der Rosenstadt und im gesamten Kreis Ostholstein sorgen wir für Sauberkeit in Wohnanlagen, Büros und Geschäftsobjekten mit persönlichem Engagement.',
    highlights: [
      'Büroreinigung für Unternehmen in Eutin',
      'Treppenhausreinigung für Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege und Außenanlagenpflege in Eutin',
    ],
    image: '/bilder/stadt-eutin.jpg',
    tier: 1,
  },
  {
    slug: 'luebeck',
    name: 'Lübeck',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Lübeck: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Lübeck für Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. Von der Hansestadt bis ins Umland sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Lübecker Zentrum und Vororten',
      'Glasreinigung für historische und moderne Fassaden',
      'Treppenhausreinigung für Wohnanlagen in Lübeck',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
    ],
    image: '/bilder/stadt-luebeck.jpg',
    tier: 1,
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    region: 'Hamburg',
    description:
      'Gebäudereinigung in Hamburg: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Flexibel, zuverlässig und persönlich betreut.',
    intro:
      'In der Hansestadt Hamburg bieten wir umfassende Gebäudereinigung für gewerbliche und private Kunden. Vom Stadtzentrum bis in die Randbezirke – KlarWerk Service steht für zuverlässige Reinigungslösungen mit persönlichem Service.',
    highlights: [
      'Büroreinigung im Hamburger Zentrum und der HafenCity',
      'Glasreinigung für Bürogebäude und Geschäftsobjekte',
      'Treppenhausreinigung für Hamburger Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen in Hamburg',
    ],
    image: '/bilder/stadt-hamburg.jpg',
    tier: 2,
  },
  {
    slug: 'nordrhein-westfalen',
    name: 'Nordrhein-Westfalen',
    region: 'Nordrhein-Westfalen',
    description:
      'Gebäudereinigung in Nordrhein-Westfalen für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: flexibel, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service ist auch in Nordrhein-Westfalen für gewerbliche und private Kunden tätig. Von Köln über Düsseldorf bis ins Ruhrgebiet sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten mit persönlichem Engagement.',
    highlights: [
      'Büroreinigung in Köln, Düsseldorf und im Ruhrgebiet',
      'Glasreinigung für Bürogebäude und Geschäftsobjekte',
      'Treppenhausreinigung für Wohnanlagen in NRW',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
    ],
    image: '/bilder/stadt-nordrhein-westfalen.jpg',
    tier: 3,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
