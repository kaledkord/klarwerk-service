/**
 * Lokale Leistungsseiten: eine Leistung in einer Stadt, z. B. /leistungen/praxisreinigung/kiel.
 *
 * Bewusst KEINE automatische Kombination aller Leistungen mit allen Städten. Jede Seite hier
 * ist einzeln geschrieben – mit eigenen Zielgruppen, eigenem Ablauf, eigenen FAQ und echtem
 * Ortsbezug. Eine neue Seite kommt nur dazu, wenn sie wirklich eigene Inhalte hat.
 */

import {
  Activity,
  Brain,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileText,
  KeyRound,
  Laptop,
  Lock,
  Scale,
  Smile,
  Stethoscope,
  Store,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

/** Überschriften und Zwischentexte, die je nach Leistung anders lauten (Praxis vs. Büro usw.). */
export interface LokaleTexte {
  /** Kleine Zeile über den Zielgruppen, z. B. „Für Ihre Praxis“. */
  zielgruppenLabel: string;
  zielgruppenTitel: string;
  zielgruppenText: string;
  /** Kasten „Das bleibt bei Ihnen“ im Leistungsumfang. */
  grenzenTitel: string;
  grenzenText: string;
  ablaufTitel: string;
  vertrauenLabel: string;
  ergaenzungTitel: string;
  ctaText: string;
}

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
  /** Hauptfoto. Ohne `src` wird automatisch das Foto der allgemeinen Leistungsseite genommen. */
  bild: { src?: string; alt: string };
  /** Kurze Fakten unter dem Hero. */
  eckdaten: { titel: string; text: string }[];
  zielgruppen: { titel: string; text: string }[];
  /** `wir`: was wir reinigen. `beiIhnen`: was bewusst beim Kunden bleibt. */
  umfang: { wir: string[]; beiIhnen: string[] };
  zeiten: { titel: string; text: string; punkte: string[] };
  vertrauen: { titel: string; text: string }[];
  anfahrt: { titel: string; text: string; westufer: string[]; ostufer: string[]; umland: string[] };
  ablauf: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  /** Passende Ergänzungsleistungen (IDs aus services.ts) mit Begründung. */
  ergaenzungen: { serviceId: string; text: string }[];
  texte: LokaleTexte;
  /** Symbole für Zielgruppen- und Vertrauenskarten, in der Reihenfolge der Daten. */
  icons: { zielgruppen: LucideIcon[]; vertrauen: LucideIcon[] };
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
      // gleiches Foto wie auf /leistungen/praxisreinigung (kommt aus services.ts)
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
      beiIhnen: [
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
    texte: {
      zielgruppenLabel: 'Für Ihre Praxis',
      zielgruppenTitel: 'Jede Praxis in Kiel braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrer Praxisart aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihrem Praxisteam',
      grenzenText: 'Klare Grenzen schützen Patienten, Geräte und Ihre Haftung.',
      ablaufTitel: 'So starten wir in Ihrer Praxis',
      vertrauenLabel: 'Hygiene & Vertrauen',
      ergaenzungTitel: 'Alles für Ihre Praxis aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihre Praxis in Kiel und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Stethoscope, Smile, Activity, Brain, Building2],
      vertrauen: [ClipboardCheck, FileText, Lock, UserCheck],
    },
  },

  {
    serviceId: 'bueroreinigung',
    citySlug: 'kiel',
    leistung: 'Büroreinigung',
    ort: 'Kiel',
    seo: {
      title: 'Büroreinigung Kiel – fester Ansprechpartner | KlarWerk',
      description:
        'Büroreinigung in Kiel für Kanzleien, Agenturen und Bürogebäude: außerhalb der Arbeitszeit, mit festem Ansprechpartner und eingearbeiteter Vertretung.',
      keywords:
        'Büroreinigung Kiel, Reinigungsfirma Büro Kiel, Büroreinigung Kanzlei Kiel, Unterhaltsreinigung Büro Kiel, Büroreinigung Kronshagen, Büroreinigung Altenholz',
    },
    h1: 'Büroreinigung in Kiel',
    intro:
      'Saubere Schreibtische, eine gepflegte Teeküche und frische Sanitärräume – jeden Morgen, ohne dass Sie Reinigung organisieren, kontrollieren oder Ausfälle auffangen müssen. KlarWerk Service reinigt Büros, Kanzleien und Agenturen in Kiel nach festem Plan, außerhalb Ihrer Arbeitszeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
    bild: {
      // gleiches Foto wie auf /leistungen/bueroreinigung (kommt aus services.ts)
      alt: 'Gepflegte Büroräume – Büroreinigung in Kiel durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Arbeitszeit', text: 'Abends, früh morgens oder an festen Wochentagen' },
      { titel: 'Ein fester Ansprechpartner', text: 'Für Plan, Schlüssel, Rückfragen und Kontrollen' },
      { titel: 'Vertretung, die Ihr Büro kennt', text: 'Bei Urlaub und Krankheit läuft die Reinigung weiter' },
    ],
    zielgruppen: [
      {
        titel: 'Kanzleien und Steuerbüros',
        text: 'Mandantengespräche, Akten auf dem Tisch, Diskretion als Pflicht: Wir reinigen freigeräumte Flächen, Böden, Besprechungsraum und Empfang – Unterlagen bleiben, wo sie liegen.',
      },
      {
        titel: 'Agenturen und IT-Büros',
        text: 'Offene Arbeitsflächen, viel genutzte Teeküche, Besprechungsräume im Dauereinsatz. Hier zählen eine feste Routine für Küche und Sanitär und Böden, die den Tag mitmachen.',
      },
      {
        titel: 'Büros mit Kundenverkehr',
        text: 'Makler, Versicherungsagenturen, Immobilienbüros: Eingang, Glastür und Wartebereich sind Ihre Visitenkarte und werden bei jeder Reinigung mitgenommen.',
      },
      {
        titel: 'Kleine Büros',
        text: 'Wenige Arbeitsplätze, überschaubare Fläche: Oft reicht eine Reinigung an ein oder zwei festen Wochentagen – mit genauso festem Ansprechpartner wie bei großen Objekten.',
      },
      {
        titel: 'Bürogebäude und Hausverwaltungen',
        text: 'Mehrere Mieter, gemeinsame Flure, Treppenhaus und Eingangsbereich: ein Ansprechpartner, ein abgestimmter Plan für Mietflächen und Gemeinschaftsflächen.',
      },
    ],
    umfang: {
      wir: [
        'Arbeitsplätze: freigeräumte Schreibtische, Ablagen und Fensterbänke',
        'Böden in allen Räumen – Hartböden gewischt, Teppichböden gesaugt',
        'Teeküche: Spüle, Arbeitsflächen, Fronten und Geräte außen',
        'Sanitärräume gründlich und hygienisch, Verbrauchsmaterial auf Wunsch',
        'Kontaktflächen wie Türklinken, Lichtschalter und Handläufe',
        'Empfang, Flure und Besprechungsräume, Papierkörbe und Mülltrennung',
        'Glas innen: Glastüren, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Akten, Unterlagen und volle Schreibtische – die räumen wir nicht um',
        'Geschirr und Spülmaschine, wenn nicht ausdrücklich vereinbart',
        'Server- und Technikräume nur nach Absprache und Einweisung',
      ],
    },
    zeiten: {
      titel: 'Reinigung, wenn Ihr Büro leer ist',
      text: 'Ihr Team soll von der Reinigung nichts merken außer dem Ergebnis. Wie oft wir kommen, hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab – den Rhythmus legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Abends nach Feierabend',
        'Früh morgens vor Arbeitsbeginn',
        'An festen Wochentagen statt täglich, wenn das reicht',
        'Grundreinigung der Böden in ruhigen Zeiten, etwa zwischen den Jahren',
      ],
    },
    vertrauen: [
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Pro Objekt eine Person, die Ihre Räume, Wünsche und Besonderheiten kennt. Sie müssen nichts zweimal erklären.',
      },
      {
        titel: 'Regelmäßige Qualitätskontrollen',
        text: 'Wir prüfen das Ergebnis vor Ort und stimmen Anpassungen mit Ihnen ab – bevor Ihnen etwas auffällt.',
      },
      {
        titel: 'Eingearbeitete Vertretung',
        text: 'Bei Urlaub und Krankheit übernimmt jemand, der Ihr Büro und den Reinigungsplan kennt. Keine Lücke, keine neue Einweisung.',
      },
      {
        titel: 'Schlüssel in guten Händen',
        text: 'Schlüssel oder Transponder behandeln wir vertraulich, die Übergabe und Ihre Alarmregelung halten wir schriftlich fest.',
      },
    ],
    anfahrt: {
      titel: 'Büroreinigung in allen Kieler Stadtteilen',
      text: 'Von Bordesholm sind wir über die A215 schnell in Kiel – in der Innenstadt, auf beiden Ufern der Förde und im direkten Umland. Kurze Wege machen Besichtigung, Kontrollen und kurzfristige Absprachen einfach.',
      westufer: ['Innenstadt & Altstadt', 'Brunswik', 'Düsternbrook', 'Ravensberg', 'Wik', 'Holtenau', 'Suchsdorf', 'Mettenhof', 'Hassee', 'Russee', 'Friedrichsort'],
      ostufer: ['Gaarden', 'Elmschenhagen', 'Wellsee', 'Wellingdorf', 'Neumühlen-Dietrichsdorf', 'Ellerbek'],
      umland: ['Kronshagen', 'Altenholz', 'Molfsee', 'Flintbek', 'Schwentinental', 'Heikendorf'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Art des Büros, ungefähre Fläche und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrem Büro',
        desc: 'Kostenlos vor Ort in Kiel: Wir gehen Räume, Bodenbeläge, Teeküche und Sanitär gemeinsam durch und klären, was wie oft gereinigt wird.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Bereichen und Rhythmus – Sie sehen genau, was Sie bekommen.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel- und Alarmregelung, Zeiten, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Büros in ganz Kiel?',
        answer:
          'Ja. Wir betreuen Büros in allen Kieler Stadtteilen, vom Westufer bis zum Ostufer, sowie im direkten Umland wie Kronshagen, Altenholz, Molfsee und Schwentinental. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich von Kiel.',
      },
      {
        question: 'Wann wird unser Büro gereinigt?',
        answer:
          'Außerhalb Ihrer Arbeitszeiten: abends nach Feierabend, früh morgens vor Arbeitsbeginn oder an festen Wochentagen. Wir richten uns nach Ihrem Betriebsablauf.',
      },
      {
        question: 'Wie oft sollte ein Büro gereinigt werden?',
        answer:
          'Das hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab. Nach der Besichtigung empfehlen wir Ihnen einen passenden Rhythmus – von täglich bis zu festen Wochentagen.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihr Büro und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe – Sie müssen nichts neu erklären.',
      },
      {
        question: 'Wie läuft das mit Schlüssel und Alarmanlage?',
        answer:
          'Schlüssel oder Transponder behandeln wir vertraulich. Übergabe, Zutrittszeiten und Ihre Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        question: 'Übernehmen Sie auch die Fenster?',
        answer:
          'Glastüren, Glaswände und Spiegel innen gehören zur laufenden Büroreinigung. Fenster innen und außen reinigen wir auf Wunsch als eigenen Termin im Rahmen der Glasreinigung.',
      },
      {
        question: 'Was kostet die Büroreinigung in Kiel?',
        answer:
          'Das hängt von Fläche, Bodenbelägen, Ausstattung und Reinigungsrhythmus ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis – ohne versteckte Kosten.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Fenster, Glasfassade und Eingangstür – streifenfrei, innen und außen, im festen Turnus.' },
      { serviceId: 'grundreinigung', text: 'Teppich- und Hartböden gründlich reinigen und neu einpflegen, ideal in ruhigen Wochen.' },
      { serviceId: 'hausmeisterservice', text: 'Kleine Reparaturen, Kontrollgänge und Außenanlagen für Ihr Bürogebäude.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Büro',
      zielgruppenTitel: 'Jedes Büro in Kiel braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrem Büro aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihnen',
      grenzenText: 'Klare Absprachen schützen Ihre Unterlagen, Ihre Technik und Ihre Abläufe.',
      ablaufTitel: 'So starten wir in Ihrem Büro',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Alles für Ihr Büro aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihr Büro in Kiel und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Scale, Laptop, Store, Briefcase, Building2],
      vertrauen: [UserCheck, ClipboardCheck, Users, KeyRound],
    },
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
