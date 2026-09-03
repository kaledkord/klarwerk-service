/**
 * KlarWerk Kalkulation — KI-Kalkulationsassistent (Google Gemini).
 *
 * Sicherheitsarchitektur:
 *  - GEMINI_API_KEY liegt AUSSCHLIESSLICH als Supabase-Secret auf dem Server
 *    (supabase secrets set GEMINI_API_KEY=...); er verlässt die Function nie.
 *  - Das Frontend sendet die Benutzeranfrage plus einen kompakten Auszug der
 *    eigenen Stammdaten (Leistungsbibliothek, Turnusse, Einstellungen).
 *  - Die KI arbeitet über kontrollierte Tools (Function Calling) NUR mit
 *    diesen Stammdaten und liefert einen strukturierten Entwurf zurück.
 *  - Die mathematische Kalkulation übernimmt ausschließlich die
 *    Kalkulations-Engine im Client — niemals die KI.
 *  - Einfaches Rate-Limiting je IP gegen Missbrauch.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── Rate-Limiting (einfach, pro Instanz) ─────────────────────────────────────
const RATE_LIMIT = 10; // Anfragen
const RATE_WINDOW_MS = 60_000; // je Minute
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

// ── Typen (lose, Validierung im Client per zod) ──────────────────────────────
interface AiContext {
  services: { id: string; name: string; category: string; unit: string; performanceValuePerHour: number; defaultFrequency: string | null }[];
  frequencies: { id: string; name: string }[];
  roomTypes: string[];
  objectTypes: string[];
  materials: { name: string; kind: string; unit: string; costPerUnit: number }[];
  machines: { name: string; hourlyRatePerHour: number }[];
  settings: Record<string, unknown>;
}

// ── System-Prompt des Kalkulationsassistenten ────────────────────────────────
const SYSTEM_PROMPT = `Du bist der spezialisierte KI-Kalkulationsassistent von KlarWerk Kalkulation für die professionelle Kalkulation von Gebäudereinigungsleistungen.

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

// ── Tools (Function Calling) — arbeiten NUR auf den mitgesendeten Stammdaten ─
function toolDeclarations() {
  return [
    {
      name: "search_services",
      description: "Sucht passende Leistungen in der Leistungsbibliothek des Unternehmens (z. B. 'saugen', 'wc', 'fenster').",
      parameters: {
        type: "OBJECT",
        properties: {
          query: { type: "STRING", description: "Suchbegriff" },
          category: { type: "STRING", description: "Optionale Kategorie", nullable: true },
        },
        required: ["query"],
      },
    },
    {
      name: "get_service_details",
      description: "Lädt Details einer Leistung inkl. Einheit und Standard-Leistungswert.",
      parameters: {
        type: "OBJECT",
        properties: { service_id: { type: "STRING" } },
        required: ["service_id"],
      },
    },
    {
      name: "get_frequency_options",
      description: "Listet alle verfügbaren Turnusse (Reinigungsintervalle) des Unternehmens.",
      parameters: { type: "OBJECT", properties: {} },
    },
    {
      name: "get_company_calculation_settings",
      description: "Lädt relevante Kalkulationsparameter des Unternehmens (Zielmarge, Stundenlohn, MwSt., Verbrauchsmaterial-Regelung).",
      parameters: { type: "OBJECT", properties: {} },
    },
    {
      name: "get_room_types",
      description: "Listet die verfügbaren Raumtypen.",
      parameters: { type: "OBJECT", properties: {} },
    },
    {
      name: "get_material_costs",
      description: "Listet Materialien mit Kosten je Einheit.",
      parameters: { type: "OBJECT", properties: {} },
    },
    {
      name: "get_machine_costs",
      description: "Listet Maschinen mit kalkulatorischem Stundensatz.",
      parameters: { type: "OBJECT", properties: {} },
    },
  ];
}

function execTool(name: string, args: Record<string, unknown>, ctx: AiContext): unknown {
  switch (name) {
    case "search_services": {
      const q = String(args.query ?? "").toLowerCase();
      const cat = args.category ? String(args.category).toLowerCase() : null;
      const words = q.split(/\s+/).filter(Boolean);
      const hits = ctx.services
        .filter((s) => (!cat || s.category.toLowerCase().includes(cat)))
        .map((s) => {
          const name = s.name.toLowerCase();
          let score = 0;
          for (const w of words) if (name.includes(w)) score += 1;
          if (name.includes(q)) score += 2;
          return { s, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((x) => x.s);
      return { results: hits, hint: hits.length === 0 ? "Keine Treffer — ggf. anderes Stichwort versuchen." : undefined };
    }
    case "get_service_details": {
      const s = ctx.services.find((x) => x.id === args.service_id);
      return s ?? { error: "Leistung nicht gefunden." };
    }
    case "get_frequency_options":
      return { frequencies: ctx.frequencies };
    case "get_company_calculation_settings":
      return ctx.settings;
    case "get_room_types":
      return { roomTypes: ctx.roomTypes, objectTypes: ctx.objectTypes };
    case "get_material_costs":
      return { materials: ctx.materials };
    case "get_machine_costs":
      return { machines: ctx.machines };
    default:
      return { error: `Unbekanntes Tool: ${name}` };
  }
}

// ── Antwortschema des strukturierten Entwurfs ────────────────────────────────
const DRAFT_SCHEMA = {
  type: "OBJECT",
  properties: {
    object: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", nullable: true },
        type: { type: "STRING", nullable: true },
        total_area_sqm: { type: "NUMBER", nullable: true },
      },
    },
    areas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          rooms: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                type: { type: "STRING", nullable: true },
                quantity: { type: "NUMBER", nullable: true },
                area_sqm: { type: "NUMBER", nullable: true },
              },
              required: ["name"],
            },
          },
        },
        required: ["name"],
      },
    },
    services: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          area: { type: "STRING" },
          room: { type: "STRING", nullable: true },
          service_id: { type: "STRING", nullable: true, description: "ID aus der Leistungsbibliothek, falls über Tools ermittelt" },
          service_name: { type: "STRING" },
          frequency_label: { type: "STRING", description: "Turnus GENAU DIESER Leistung, z. B. '2× wöchentlich'" },
          quantity: { type: "NUMBER", nullable: true },
          unit: { type: "STRING", nullable: true },
          confidence: { type: "NUMBER", description: "0 bis 1" },
          assumption: { type: "STRING", nullable: true },
        },
        required: ["area", "service_name", "frequency_label", "confidence"],
      },
    },
    missing_information: { type: "ARRAY", items: { type: "STRING" } },
    assumptions: { type: "ARRAY", items: { type: "STRING" } },
    questions: { type: "ARRAY", items: { type: "STRING" } },
    warnings: { type: "ARRAY", items: { type: "STRING" } },
    summary: { type: "STRING" },
  },
  required: ["object", "areas", "services", "missing_information", "assumptions", "questions", "warnings", "summary"],
};

// ── Gemini-Aufruf ────────────────────────────────────────────────────────────
interface GeminiUsage {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

async function callGemini(
  apiKey: string,
  model: string,
  body: Record<string, unknown>
): Promise<{ data: Record<string, unknown>; usage: GeminiUsage }> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 400)}`);
  }
  const data = (await res.json()) as Record<string, unknown>;
  const usage = (data.usageMetadata ?? {}) as GeminiUsage;
  return { data, usage };
}

type Part = Record<string, unknown>;
type Content = { role: string; parts: Part[] };

function candidateParts(data: Record<string, unknown>): Part[] {
  const candidates = data.candidates as { content?: { parts?: Part[] } }[] | undefined;
  return candidates?.[0]?.content?.parts ?? [];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Nur POST erlaubt." }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return json({ ok: false, errorCode: "rate_limited", error: "Zu viele Anfragen — bitte kurz warten." }, 429);
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return json({
        ok: false,
        errorCode: "not_configured",
        error:
          "GEMINI_API_KEY ist nicht konfiguriert. Einrichtung: supabase secrets set GEMINI_API_KEY=<Schlüssel> und Function neu deployen.",
      });
    }

    const { message, history, context, config } = (await req.json()) as {
      message?: string;
      history?: { role: "user" | "model"; text: string }[];
      context?: AiContext;
      config?: { model?: string; temperature?: number; maxOutputTokens?: number; functionCalling?: boolean };
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return json({ ok: false, errorCode: "invalid", error: "Leere Anfrage." }, 400);
    }
    if (!context || !Array.isArray(context.services)) {
      return json({ ok: false, errorCode: "invalid", error: "Stammdaten-Kontext fehlt." }, 400);
    }

    // Modell-Allowlist: nur Gemini-Modelle, keine beliebigen Pfade
    const model = /^gemini-[a-z0-9.\-]+$/i.test(config?.model ?? "") ? config!.model! : "gemini-2.5-flash";
    const temperature = Math.min(Math.max(config?.temperature ?? 0.2, 0), 2);
    const maxOutputTokens = Math.min(Math.max(config?.maxOutputTokens ?? 8192, 512), 32768);
    const useTools = config?.functionCalling !== false;

    const usageTotal = { inputTokens: 0, outputTokens: 0, calls: 0 };
    const track = (u: GeminiUsage) => {
      usageTotal.inputTokens += u.promptTokenCount ?? 0;
      usageTotal.outputTokens += u.candidatesTokenCount ?? 0;
      usageTotal.calls += 1;
    };

    // ── Phase A: Verständnis + Tools ────────────────────────────────────────
    const contents: Content[] = [
      ...(history ?? []).slice(-10).map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    let aiText = "";
    for (let round = 0; round < 6; round++) {
      const { data, usage } = await callGemini(apiKey, model, {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        ...(useTools ? { tools: [{ functionDeclarations: toolDeclarations() }] } : {}),
        generationConfig: { temperature, maxOutputTokens },
      });
      track(usage);

      const parts = candidateParts(data);
      const functionCalls = parts.filter((p) => p.functionCall) as { functionCall: { name: string; args?: Record<string, unknown> } }[];

      if (functionCalls.length === 0) {
        aiText = parts
          .map((p) => (typeof p.text === "string" ? p.text : ""))
          .join("")
          .trim();
        break;
      }

      // Tool-Aufrufe ausführen und Ergebnisse zurückgeben
      contents.push({ role: "model", parts });
      contents.push({
        role: "user",
        parts: functionCalls.map((fc) => ({
          functionResponse: {
            name: fc.functionCall.name,
            response: { result: execTool(fc.functionCall.name, fc.functionCall.args ?? {}, context) },
          },
        })),
      });
    }

    // ── Phase B: strukturierter Entwurf (JSON mit Schema) ───────────────────
    const structuringPrompt = `Erstelle aus der bisherigen Analyse den strukturierten Kalkulationsentwurf als JSON.

Zwingende Regeln:
- Jede Leistungsposition einzeln, mit EIGENEM frequency_label (Turnus genau dieser Leistung).
- service_id nur setzen, wenn sie sicher aus der Leistungsbibliothek stammt (Tools). Sonst null.
- Fehlende Informationen NIEMALS erfinden: null verwenden und in missing_information/questions aufführen.
- Jede Annahme in assumptions aufführen und bei der betroffenen Position in assumption vermerken.
- KEINE Preise, Stunden, Kosten oder Leistungswerte ausgeben — nur Struktur (Bereiche, Räume, Leistungen, Turnusse, Mengen).
- confidence je Position ehrlich schätzen (0–1).`;

    const { data: structured, usage: structUsage } = await callGemini(apiKey, model, {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...contents,
        ...(aiText ? [{ role: "model", parts: [{ text: aiText }] }] : []),
        { role: "user", parts: [{ text: structuringPrompt }] },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens,
        responseMimeType: "application/json",
        responseSchema: DRAFT_SCHEMA,
      },
    });
    track(structUsage);

    const draftText = candidateParts(structured)
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .join("");

    let draft: unknown;
    try {
      draft = JSON.parse(draftText);
    } catch {
      return json({
        ok: false,
        errorCode: "invalid",
        error: "Die KI-Antwort konnte nicht als JSON gelesen werden. Bitte erneut versuchen.",
        aiText,
        usage: usageTotal,
        model,
      });
    }

    return json({ ok: true, aiText: aiText || "Analyse abgeschlossen — Entwurf erstellt.", draft, usage: usageTotal, model });
  } catch (err) {
    console.error("ai-kalkulation error:", err);
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
    return json({ ok: false, errorCode: "upstream", error: `KI-Anfrage fehlgeschlagen: ${msg}` }, 502);
  }
});
