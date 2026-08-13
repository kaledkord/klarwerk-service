export interface City {
  slug: string;
  name: string;
  region: string;
  description: string;
  intro: string;
  highlights: string[];
  image: string;
  /** Priorität für Sortierung/Signale: 1 = Kernregion SH, 2 = Hamburg, 3 = überregional. */
  tier: 1 | 2 | 3;
}

export const cities: City[] = [
  {
    slug: 'bordesholm',
    name: 'Bordesholm',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Bordesholm: KlarWerk Service ist hier zu Hause. Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Gewerbe – direkt vor Ort.',
    intro:
      'Bordesholm ist der Sitz von KlarWerk Service. Von hier aus betreuen wir Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber in der Gemeinde und im gesamten Amt Bordesholm zwischen Kiel und Neumünster. Kurze Wege, feste Ansprechpartner und schnelle Reaktionszeiten sind für uns direkt am Firmensitz selbstverständlich.',
    highlights: [
      'Reinigung für Gewerbe, Büros und Praxen direkt am Firmensitz Bordesholm',
      'Treppenhaus- und Unterhaltsreinigung für Wohnanlagen im Amt Bordesholm',
      'Kurze Anfahrtswege und kurzfristige Termine in Bordesholm und Umgebung',
      'Hausmeisterservice, Winterdienst und Gartenpflege aus einer Hand',
    ],
    image: '/Design_ohne_Titel.png',
    tier: 1,
  },
  {
    slug: 'kiel',
    name: 'Kiel',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Kiel: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'Als regional verwurzelte Reinigungsfirma bieten wir Gebäudereinigung in Kiel für gewerbliche und private Kunden an. Von der regelmäßigen Büroreinigung über Treppenhausreinigung bis hin zu Glasreinigung und Hausmeisterservice – KlarWerk Service ist Ihr zuverlässiger Partner in der Landeshauptstadt Schleswig-Holsteins.',
    highlights: [
      'Büroreinigung für Unternehmen im Kieler Zentrum und Hafenviertel',
      'Treppenhausreinigung für Wohnanlagen in Kiel und Umgebung',
      'Glasreinigung für Geschäftsobjekte und Praxen',
      'Hausmeisterservice für Immobilienverwaltungen in Kiel',
    ],
    image: '/image copy copy copy copy copy copy copy copy copy copy copy.png',
    tier: 1,
  },
  {
    slug: 'neumuenster',
    name: 'Neumünster',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Neumünster: Professionelle Reinigung für Büros, Praxen und Wohnanlagen. Flexibel, zuverlässig und persönlich betreut.',
    intro:
      'In Neumünster bieten wir umfassende Gebäudereinigung für gewerbliche und private Kunden an. Ob Büroreinigung, Glasreinigung oder Hausmeisterservice – KlarWerk Service sorgt für Sauberkeit in der Mittelstadt zwischen Kiel und Hamburg.',
    highlights: [
      'Büroreinigung im Neumünsteraner Stadtgebiet',
      'Treppenhausreinigung für Mehrfamilienhäuser',
      'Glasreinigung für Geschäfte und Praxen',
      'Grundreinigung und Bauendreinigung in Neumünster',
    ],
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy.png',
    tier: 1,
  },
  {
    slug: 'rendsburg',
    name: 'Rendsburg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Rendsburg: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Rendsburg für Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. An der Eider und im gesamten Kreis Rendsburg-Eckernförde sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Rendsburger Stadtgebiet',
      'Glasreinigung für Geschäftsobjekte und Praxen',
      'Treppenhausreinigung für Wohnanlagen in Rendsburg',
      'Hausmeisterservice mit Winterdienst',
    ],
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
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
      'Hausmeisterservice mit Winterdienst',
      'Gartenpflege für Außenanlagen in Preetz',
    ],
    image: '/2942_1075_1_g.jpg',
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
      'Hausmeisterservice mit Winterdienst',
      'Gartenpflege und Außenanlagenpflege',
    ],
    image: '/Plon&Eckenforde.jpg',
    tier: 1,
  },
  {
    slug: 'bad-segeberg',
    name: 'Bad Segeberg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Bad Segeberg: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'In Bad Segeberg bietet KlarWerk Service umfassende Gebäudereinigung für gewerbliche und private Kunden. Vom Kurort bis ins Umland sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Bad Segeberger Stadtgebiet',
      'Treppenhausreinigung für Wohnanlagen',
      'Glasreinigung für Geschäfte und Praxen',
      'Hausmeisterservice mit Winterdienst in Bad Segeberg',
    ],
    image: '/Bad_Segeberg.jpg',
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
      'Hausmeisterservice mit Winterdienst',
      'Gartenpflege und Außenanlagenpflege in Eutin',
    ],
    image: '/Eutin.jpg',
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
      'Hausmeisterservice mit Winterdienst',
    ],
    image: '/Lubeck.jpg',
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
      'Hausmeisterservice mit Winterdienst in Hamburg',
    ],
    image: '/Hamburg.jpg',
    tier: 2,
  },
  {
    slug: 'nordrhein-westfalen',
    name: 'Nordrhein-Westfalen',
    region: 'Nordrhein-Westfalen',
    description:
      'Gebäudereinigung in Nordrhein-Westfalen: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Flexibel, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service ist auch in Nordrhein-Westfalen für gewerbliche und private Kunden tätig. Von Köln über Düsseldorf bis ins Ruhrgebiet sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten mit persönlichem Engagement.',
    highlights: [
      'Büroreinigung in Köln, Düsseldorf und im Ruhrgebiet',
      'Glasreinigung für Bürogebäude und Geschäftsobjekte',
      'Treppenhausreinigung für Wohnanlagen in NRW',
      'Hausmeisterservice mit Winterdienst',
    ],
    image: '/Koln.jpg',
    tier: 3,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
