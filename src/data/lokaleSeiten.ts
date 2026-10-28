/**
 * Lokale Leistungsseiten: eine Leistung in einer Stadt, z. B. /leistungen/praxisreinigung/kiel.
 *
 * Bewusst KEINE automatische Kombination aller Leistungen mit allen Städten. Jede Seite hier
 * ist einzeln geschrieben – mit eigenen Zielgruppen, eigenem Ablauf, eigenen FAQ und echtem
 * Ortsbezug. Eine neue Seite kommt nur dazu, wenn sie wirklich eigene Inhalte hat.
 */

export interface LokaleSeite {
  serviceId: string;
  citySlug: string;
  /** Anzeigename der Leistung, z. B. „Praxisreinigung“. */
  leistung: string;
  /** Anzeigename des Ortes, z. B. „Kiel“. */
  ort: string;
  seo: { title: string; description: string; keywords: string };
  h1: string;
  intro: string;
  bild: { src: string; alt: string };
  /** Kurze Fakten unter dem Hero. */
  eckdaten: { titel: string; text: string }[];
  zielgruppen: { titel: string; text: string }[];
  umfang: { wir: string[]; praxis: string[] };
  zeiten: { titel: string; text: string; punkte: string[] };
  vertrauen: { titel: string; text: string }[];
  anfahrt: { titel: string; text: string; westufer: string[]; ostufer: string[]; umland: string[] };
  ablauf: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  /** Passende Ergänzungsleistungen (IDs aus services.ts) mit Begründung. */
  ergaenzungen: { serviceId: string; text: string }[];
}

export const lokaleSeiten: LokaleSeite[] = [
  {
    serviceId: 'praxisreinigung',
    citySlug: 'kiel',
    leistung: 'Praxisreinigung',
    ort: 'Kiel',
    seo: {
      title: 'Praxisreinigung Kiel nach Feierabend | KlarWerk Service',
      description:
        'Praxisreinigung in Kiel für Arzt-, Zahnarzt- und Therapiepraxen: nach Ihrem Hygieneplan, außerhalb der Sprechzeiten, mit festem Ansprechpartner.',
      keywords:
        'Praxisreinigung Kiel, Reinigung Arztpraxis Kiel, Zahnarztpraxis Reinigung Kiel, Reinigungsfirma Praxis Kiel, Physiotherapie Reinigung Kiel, Praxisreinigung Kronshagen',
    },
    h1: 'Praxisreinigung in Kiel',
    intro:
      'Ihre Praxis soll morgens sauber, hygienisch und ohne Nachfragen bereitstehen – ob in der Innenstadt, auf dem Westufer oder am Ostufer. KlarWerk Service reinigt Arzt-, Zahnarzt- und Therapiepraxen in Kiel nach Ihrem Hygieneplan, außerhalb der Sprechzeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
    bild: {
      src: 'https://images.unsplash.com/photo-1669101602108-fa5ba89507ee?auto=format&fit=crop&w=900&q=80',
      alt: 'Saubere Praxisräume – Praxisreinigung in Kiel durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Sprechzeiten', text: 'Abends, früh morgens oder am freien Nachmittag' },
      { titel: 'Nach Ihrem Hygieneplan', text: 'Bereiche, Mittel und Intervalle wie bei Ihnen festgelegt' },
      { titel: 'Fester Ansprechpartner', text: 'Auch bei Urlaub und Krankheit eine eingearbeitete Vertretung' },
    ],
    zielgruppen: [
      {
        titel: 'Hausarzt- und Facharztpraxen',
        text: 'Volles Wartezimmer, viel Laufverkehr am Empfang: Böden, Wartebereich und häufig berührte Flächen wie Türklinken, Tresen und Armlehnen werden bei jeder Reinigung gereinigt und nach Plan desinfiziert.',
      },
      {
        titel: 'Zahnarztpraxen',
        text: 'Behandlungszimmer mit Böden und Oberflächen rund um die Behandlungseinheit, dazu Rezeption, Wartebereich und Sanitär. Was am Gerät selbst passiert, bleibt bei Ihrem Praxisteam.',
      },
      {
        titel: 'Physio-, Ergo- und Logopädiepraxen',
        text: 'Therapieliegen, Ablagen, Trainingsflächen, Umkleiden und Duschen – Räume, die den ganzen Tag genutzt werden und dafür eine feste Routine brauchen.',
      },
      {
        titel: 'Psychotherapie und kleine Praxen',
        text: 'Wenige Räume, ruhige Atmosphäre, Diskretion zählt. Hier reicht oft eine Reinigung an festen Wochentagen statt täglich.',
      },
      {
        titel: 'MVZ, Praxisgemeinschaften und Ärztehäuser',
        text: 'Mehrere Praxen auf einer Etage oder in einem Haus: ein Ansprechpartner, ein abgestimmter Plan – und auf Wunsch Leistungsverzeichnis und Rechnung getrennt nach Praxis.',
      },
    ],
    umfang: {
      wir: [
        'Böden in allen Räumen – feucht gewischt, in sensiblen Bereichen desinfizierend',
        'Wartebereich, Empfang und Flure',
        'Kontaktflächen wie Türklinken, Lichtschalter, Tresen und Armlehnen',
        'Behandlungs- und Therapieräume: Liegen, Arbeitsflächen und Ablagen',
        'Sanitärbereiche für Patienten und Team',
        'Sozialraum und Teeküche, Papierkörbe und Hausmüll',
        'Glasflächen innen: Eingangstür, Glaswände und Spiegel',
      ],
      praxis: [
        'Aufbereitung von Instrumenten und Medizinprodukten',
        'Desinfektion medizinischer Geräte nach Herstellervorgabe',
        'Patientenakten, Unterlagen und Bildschirme – die fassen wir nicht an',
      ],
    },
    zeiten: {
      titel: 'Reinigung, wenn Ihre Praxis leer ist',
      text: 'Patienten und Team sollen von der Reinigung nichts merken außer dem Ergebnis. Den Rhythmus – täglich oder an festen Wochentagen – legen wir nach Praxisgröße und Hygieneplan gemeinsam fest.',
      punkte: [
        'Abends nach der letzten Sprechstunde',
        'Früh morgens vor Praxisbeginn',
        'An Ihren freien Nachmittagen, etwa mittwochs oder freitags',
        'Grundreinigung der Böden in den Praxisferien',
      ],
    },
    vertrauen: [
      {
        titel: 'Ihr Hygieneplan ist die Vorgabe',
        text: 'Wir übernehmen Ihre Festlegungen zu Bereichen, Mitteln und Intervallen und setzen VAH-gelistete Desinfektionsmittel passend zum Einsatzbereich ein.',
      },
      {
        titel: 'Jede Reinigung dokumentiert',
        text: 'Sie sehen jederzeit, was wann gereinigt wurde – hilfreich für Ihre Hygienedokumentation und bei Begehungen.',
      },
      {
        titel: 'Diskret und verschwiegen',
        text: 'Wer in einer Praxis reinigt, sieht vieles. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        titel: 'Kontrolle statt Hoffnung',
        text: 'Regelmäßige Qualitätskontrollen durch Ihren festen Ansprechpartner – Mängel werden behoben, bevor sie Ihnen auffallen.',
      },
    ],
    anfahrt: {
      titel: 'Kurze Wege in ganz Kiel',
      text: 'Von Bordesholm sind wir über die A215 schnell in Kiel. Wir reinigen Praxen in allen Stadtteilen und im direkten Umland – auch dort, wo Sie für Ihre Praxis feste, verlässliche Zeiten brauchen.',
      westufer: ['Innenstadt & Altstadt', 'Düsternbrook', 'Ravensberg', 'Wik', 'Holtenau', 'Suchsdorf', 'Mettenhof', 'Hassee', 'Russee', 'Friedrichsort', 'Schilksee'],
      ostufer: ['Gaarden', 'Elmschenhagen', 'Wellingdorf', 'Neumühlen-Dietrichsdorf', 'Ellerbek'],
      umland: ['Kronshagen', 'Altenholz', 'Molfsee', 'Flintbek', 'Schwentinental', 'Heikendorf'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Praxisart, ungefähre Raumzahl und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrer Praxis',
        desc: 'Kostenlos vor Ort in Kiel: Wir gehen Räume, Bodenbeläge und Ihren Hygieneplan gemeinsam durch.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Räumen und Rhythmus, kalkuliert mit unserem eigenen Programm für die Gebäudereinigung.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel- und Alarmregelung, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Praxen in ganz Kiel?',
        answer:
          'Ja. Wir betreuen Praxen in allen Kieler Stadtteilen, vom Westufer bis zum Ostufer, sowie im direkten Umland wie Kronshagen, Altenholz, Molfsee und Schwentinental. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich von Kiel.',
      },
      {
        question: 'Reinigen Sie während der Sprechzeiten?',
        answer:
          'In der Regel nicht. Wir reinigen abends nach der letzten Sprechstunde, früh morgens vor Praxisbeginn oder an Ihren freien Nachmittagen. Ob täglich oder an festen Wochentagen, richtet sich nach Ihrer Praxisgröße und Ihrem Hygieneplan.',
      },
      {
        question: 'Arbeiten Sie nach unserem Hygieneplan?',
        answer:
          'Ja. Wir übernehmen die Vorgaben Ihres Hygieneplans zu Bereichen, Mitteln und Intervallen, setzen VAH-gelistete Desinfektionsmittel ein und dokumentieren jede Reinigung nachvollziehbar.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihre Praxis und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe – Sie müssen nichts neu erklären.',
      },
      {
        question: 'Übernehmen Sie auch die Aufbereitung von Instrumenten?',
        answer:
          'Nein. Die Aufbereitung von Medizinprodukten und die Desinfektion medizinischer Geräte bleiben bei Ihrem Praxisteam. Wir reinigen und desinfizieren Böden, Oberflächen, Kontaktflächen und Sanitärbereiche.',
      },
      {
        question: 'Wie gehen Sie mit Patientendaten um?',
        answer:
          'Diskret: Akten, Unterlagen und Bildschirme fassen wir nicht an. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        question: 'Was kostet die Praxisreinigung in Kiel?',
        answer:
          'Das hängt von Praxisgröße, Raumanzahl, Bodenbelägen und Reinigungsrhythmus ab. Nach einer kostenlosen Besichtigung in Ihrer Praxis erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis – ohne versteckte Kosten.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Praxisfenster, Eingangstür und Praxisschild – streifenfrei, innen und außen.' },
      { serviceId: 'grundreinigung', text: 'Böden gründlich reinigen und neu einpflegen, ideal in den Praxisferien.' },
      { serviceId: 'unterhaltsreinigung', text: 'Für Büro- und Verwaltungsflächen im selben Haus nach festem Plan.' },
    ],
  },
];

export function getLokaleSeite(serviceId: string, citySlug: string): LokaleSeite | undefined {
  return lokaleSeiten.find((s) => s.serviceId === serviceId && s.citySlug === citySlug);
}

export function lokaleSeitenFuerStadt(citySlug: string): LokaleSeite[] {
  return lokaleSeiten.filter((s) => s.citySlug === citySlug);
}

export function lokalerPfad(seite: Pick<LokaleSeite, 'serviceId' | 'citySlug'>): string {
  return `/leistungen/${seite.serviceId}/${seite.citySlug}`;
}
