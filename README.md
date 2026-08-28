# KlarWerk Service — Website & KlarWerk Kalkulation

Dieses Repository enthält zwei Anwendungen in einer Codebasis:

1. **Website** (`/`) — die öffentliche KlarWerk-Service-Website (unverändert).
2. **KlarWerk Kalkulation** (`/kalkulation`) — die interne Kalkulations-,
   Angebots-, Objektmanagement- und Nachkalkulationssoftware für die
   Gebäudereinigung. *Intelligente Kalkulation für professionelle
   Gebäudedienstleistungen.*

Die Kalkulations-App ist von Suchmaschinen ausgeschlossen (robots.txt +
`noindex`) und nutzt die bestehende Markenwelt (Logo-Farben Navy `#0f1827`,
Blau `#34a1da`, Grün `#21a74a`).

---

## Schnellstart

```bash
npm install
npm run dev        # http://localhost:5173  →  App: /kalkulation
npm run build      # Produktions-Build (dist/)
npm run test       # Kalkulations-Engine-Tests (Vitest, 27 Tests)
npm run typecheck  # TypeScript-Prüfung
```

Deployment wie bisher (Netlify, `netlify.toml`) — die Kalkulations-App wird
als eigener, lazy geladener Chunk mit ausgeliefert und erhöht die Ladezeit
der Website nicht.

---

## KlarWerk Kalkulation — Überblick

| Modul | Beschreibung |
| --- | --- |
| Dashboard | Begrüßung, Unternehmenskennzahlen, aktuelle Kalkulationen, Wirtschaftlichkeitswarnungen |
| Schnellkalkulation | 7 Eingaben → sofortiger Entwurf → Übernahme als Profi-Kalkulation |
| Profi-Wizard | Geführte Kalkulation in 6 Schritten mit Objektstruktur-Übernahme |
| Kalkulations-Workspace | Zentrale Leistungstabelle, Kosten, Preisstrategien, Szenarien, Nachkalkulation, Angebot |
| Kunden & Objekte | Kundenakten mit Kennzahlen; Objekte mit Gebäude → Etage → Raum inkl. Bodenart und Faktoren |
| Bibliothek | ~70 Leistungen mit Richt-Leistungswerten, Turnusse, Material, Maschinen, lernende Kalkulation |
| Angebotsgenerator | Kundenangebot ohne interne Kosten, Turnus je Einzelleistung, PDF über Druckansicht |
| Einstellungen | Alle Kennzahlen zentral: Margen, AG-Kosten, Gemeinkosten, Fahrt, Faktoren, KI-Budget, Datenexport |
| KI-Assistent | Gemini-gestützte Analyse von Freitext-Anfragen → geprüfter Kalkulationsentwurf |

### Kernprinzip: Jede Leistung hat ihren eigenen Turnus

Jede Zeile der Kalkulation (`CalcLine`) trägt ihren **eigenen** Turnus,
eigene Leistungswerte, Faktoren und Kosten. Ein Büro kann gleichzeitig
enthalten: Saugen 2× wöchentlich, Feuchtwischen 1× wöchentlich,
Sockelleisten 1× monatlich — jede Position wird einzeln in Monatsstunden
und Kosten umgerechnet und erst dann zur Objektkalkulation summiert.
Das Angebot weist den Turnus jeder Einzelleistung aus und fasst niemals
pauschal zusammen.

### Berechnungslogik (zentral in `src/kalkulation/lib/engine/`)

```
Durchführungen/Monat   = Turnus-Umrechnung (z. B. 2×/Woche → 2 × 52 ÷ 12 = 8,667)
Effektiver Leistungswert = Standardwert × Faktoren (Verschmutzung, Frequentierung,
                           Möblierung, Zugänglichkeit, Hygiene) — oder manuell (gekennzeichnet)
Zeit je Durchführung   = Menge ÷ effektiver Leistungswert
Monatsstunden          = Zeit je Durchführung × Durchführungen/Monat
Personalkosten         = Monatsstunden × AG-Stundensatz × (1 + Positionszuschlag)
AG-Stundensatz         = Stundenlohn × (1 + Σ Arbeitgeberanteile)   (15,00 € → 22,50 € bei 50 %)
Fahrtkosten            = km × 2 × Fahrten × €/km + Fahrzeit × AG-Satz (optional)
Gemeinkosten           = Gemeinkostensatz/h × Monatsstunden (Satz = Σ Gemeinkosten ÷ produktive Stunden)
Risiko                 = Risikosatz × (Personal + Material + Maschinen + Fahrt + GK)
Selbstkosten           = Summe aller Kostenblöcke
Verkaufspreis (Marge)  = Selbstkosten ÷ (1 − Zielmarge)      ← echte Marge vom Umsatz
Verkaufspreis (Aufschlag) = Selbstkosten × (1 + Aufschlag)   ← optionaler Modus
```

Mindest-, Ziel- und Premiumpreis werden immer parallel berechnet;
Warnungen und der Kalkulations-Health-Score (0–100, transparent
aufgeschlüsselt) prüfen Marge, Selbstkosten, Material, Fahrt,
Gemeinkosten, Plausibilität der Leistungswerte und manuelle Eingriffe.
Alle Formeln sind mit Vitest getestet (`npm run test`).

### Datenhaltung

Alle Daten (Kunden, Objekte, Kalkulationen, Bibliothek, Einstellungen)
liegen **lokal im Browser** (localStorage, automatisch gespeichert) —
die App läuft dadurch ohne Server vollständig. Unter *Einstellungen →
Daten* gibt es JSON-Export/-Import (Sicherung, Gerätewechsel) sowie
Demo-Reset. Beim ersten Start werden realistische Beispieldaten geladen,
die vollständig editier- und löschbar sind.

> Mehrbenutzer-Betrieb mit zentraler Datenbank (Supabase) ist im
> Datenmodell vorbereitet, aber bewusst nicht Teil der ersten Version.

---

## KI-Kalkulationsassistent (Google Gemini)

**Architektur** — die KI strukturiert, die Engine rechnet:

```
Benutzer → Frontend (/kalkulation/assistent)
         → Supabase Edge Function  supabase/functions/ai-kalkulation
             · GEMINI_API_KEY nur hier (Server-Secret, nie im Browser)
             · System-Prompt + Function Calling auf die eigenen Stammdaten
               (search_services, get_frequency_options, get_company_calculation_settings, …)
             · strukturierte JSON-Antwort (responseSchema)
         → zod-Validierung im Client (ungültige Antworten werden verworfen)
         → Entwurfspanel: Konfidenz je Position, Annahmen, Rückfragen
         → MANUELLE Freigabe (gesamt oder je Position)
         → Kalkulations-Engine berechnet Stunden, Kosten, Preise
```

Die KI erfindet keine Leistungswerte oder Preise: Positionen werden gegen
die eigene Leistungsbibliothek aufgelöst, fehlende Angaben erscheinen als
Rückfragen, Annahmen werden gekennzeichnet. Jeder Vorschlag bleibt ein
**KI-Kalkulationsentwurf**, bis er freigegeben wird. Anfragen, Tokens und
geschätzte Kosten werden protokolliert (Einstellungen → KI) inkl.
monatlichem Budget mit Warnschwelle und Sperre.

### Einrichtung

```bash
# 1. Gemini-API-Schlüssel als Server-Secret hinterlegen (nie ins Repo!)
supabase secrets set GEMINI_API_KEY=IHR_SCHLUESSEL

# 2. Edge Function deployen
supabase functions deploy ai-kalkulation
```

Modell, Temperatur, Token-Limit und Budget werden zentral in der App
konfiguriert (*Einstellungen → KI*; Standard `gemini-2.5-flash`).
Ohne konfiguriertes Backend arbeitet der Assistent mit einer klar
gekennzeichneten **lokalen Analyse** (Regel-Parser) weiter — die App
bleibt voll nutzbar.

Hinweis: Die Function ist mit einfachem Rate-Limiting versehen. Da die
App (noch) ohne Login arbeitet, empfiehlt sich zusätzlich ein knappes
Budget in den Einstellungen sowie das Monatslimit im Google-AI-Studio.

---

## Projektstruktur (Kalkulation)

```
src/kalkulation/
├── KalkulationApp.tsx        Router + Shell-Einbindung
├── kalkulation.css           Design-Tokens & Basiskomponenten
├── lib/
│   ├── types.ts              Datenmodell (Kunde → Objekt → Raum → Leistung → …)
│   ├── engine/               Kalkulations-Engine (pur, getestet)
│   ├── seed/                 Stammdaten & Beispieldaten
│   ├── store.ts              Zustand + Persistenz + Undo + Versionen
│   ├── templates.ts          Leistungspakete je Raumtyp
│   ├── quick.ts              Schnellkalkulations-Generator
│   └── ai/                   KI-Schema, Auflösung, Client, lokaler Fallback
├── components/               UI-Primitive, Shell, Fachkomponenten, Workspace-Tabs
└── pages/                    Dashboard, Kunden, Objekte, Kalkulationen, Wizard,
                              Schnellkalkulation, Bibliothek, Einstellungen,
                              Assistent, Druckansichten
supabase/functions/ai-kalkulation/   Gemini-Backend (Deno Edge Function)
```

## Roadmap (vorbereitet im Datenmodell)

Dokumenten-/LV-Import (PDF, Excel), Mitarbeiter-App & Zeiterfassung,
Einsatz- und Tourenplanung, Qualitätskontrolle mit Fotodokumentation,
Rechnungsstellung, Kundenportal, Mehrbenutzer mit Rollen/Rechten,
zentrale Datenbank, White-Label.
