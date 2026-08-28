/**
 * Direktverbindung Browser → Google Gemini API (für die private
 * Standalone-Nutzung mit eigenem API-Schlüssel).
 *
 * Ablauf wie im Server-Backend:
 *   Phase A — Verständnis mit Function Calling auf den eigenen Stammdaten
 *   Phase B — strukturierter Entwurf als JSON (responseSchema)
 * Die Mathematik bleibt vollständig bei der Kalkulations-Engine.
 */

import {
  AI_SYSTEM_PROMPT,
  DRAFT_RESPONSE_SCHEMA,
  STRUCTURING_PROMPT,
  execTool,
  toolDeclarations,
  type AiContextPayload,
} from './prompt';
import type { AiAnalyzeResponse } from './draftSchema';
import type { ChatTurn } from './client';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiUsage {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
}

type Part = Record<string, unknown>;
type Content = { role: string; parts: Part[] };

function sanitizeModel(model?: string): string {
  return model && /^gemini-[a-z0-9.\-]+$/i.test(model) ? model : 'gemini-2.5-flash';
}

function friendlyError(status: number, body: string): string {
  if (status === 400 && body.includes('API_KEY_INVALID')) {
    return 'Google hat den API-Schlüssel abgelehnt (ungültig). Bitte in den Einstellungen prüfen, ob der Schlüssel vollständig und ohne zusätzliche Leerzeichen eingefügt wurde — am besten direkt aus Google AI Studio über das Kopier-Symbol neu einfügen.';
  }
  if (status === 400 && body.includes('API key expired')) {
    return 'Der API-Schlüssel ist abgelaufen. Bitte in Google AI Studio einen neuen Schlüssel erstellen.';
  }
  if (status === 403) {
    return 'Zugriff verweigert (403). Der Schlüssel hat möglicherweise Einschränkungen (z. B. auf bestimmte Websites) — für die lokale Nutzung bitte einen Schlüssel ohne Anwendungseinschränkung verwenden.';
  }
  if (status === 429) {
    return 'Das Google-Kontingent ist vorübergehend erschöpft (429). Bitte kurz warten und erneut versuchen — oder im Google-Konto das Kontingent prüfen.';
  }
  if (status === 404) {
    return 'Das gewählte Modell wurde nicht gefunden (404). Bitte in den Einstellungen ein anderes Gemini-Modell wählen.';
  }
  if (status === 503) {
    return 'Die Google-Server sind gerade kurzzeitig überlastet (503) — das liegt an Google, nicht an Ihrer Einrichtung. Die App hat es bereits automatisch mehrfach erneut versucht. Bitte in ein bis zwei Minuten noch einmal senden.';
  }
  return `Google-API-Fehler (${status}): ${body.slice(0, 200)}`;
}

/** Bei Überlastung/Kontingent kurz erneut versuchen — Google nennt dies selbst "meist vorübergehend". */
const RETRYABLE_STATUSES = new Set([503, 429]);
const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [1500, 3000];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(
  apiKey: string,
  model: string,
  body: Record<string, unknown>
): Promise<{ data: Record<string, unknown>; usage: GeminiUsage }> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body),
      });
    } catch {
      throw Object.assign(new Error('Keine Verbindung zur Google-API — bitte Internetverbindung prüfen.'), {
        network: true,
      });
    }
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      return { data, usage: (data.usageMetadata ?? {}) as GeminiUsage };
    }
    const text = await res.text().catch(() => '');
    if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
      await delay(RETRY_DELAYS_MS[attempt]);
      continue;
    }
    throw Object.assign(new Error(friendlyError(res.status, text)), { status: res.status });
  }
}

function candidateParts(data: Record<string, unknown>): Part[] {
  const candidates = data.candidates as { content?: { parts?: Part[] } }[] | undefined;
  return candidates?.[0]?.content?.parts ?? [];
}

export interface AvailableModel {
  id: string;
  displayName: string;
}

/**
 * Fragt bei Google ab, welche Modelle DIESER Schlüssel tatsächlich nutzen
 * darf (Google-Endpunkt „ListModels“). Google-Konten sind unterschiedlich
 * freigeschaltet — statt Modellnamen zu raten, zeigt dies die echte Liste.
 */
export async function listAvailableModels(
  apiKey: string
): Promise<{ ok: boolean; models?: AvailableModel[]; message?: string }> {
  let res: Response;
  try {
    res = await fetch(API_BASE, { headers: { 'x-goog-api-key': apiKey } });
  } catch {
    return { ok: false, message: 'Keine Verbindung zur Google-API — bitte Internetverbindung prüfen.' };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, message: friendlyError(res.status, text) };
  }
  const data = (await res.json()) as {
    models?: { name: string; displayName?: string; supportedGenerationMethods?: string[] }[];
  };
  const models = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent') && m.name.includes('gemini'))
    .map((m) => ({ id: m.name.replace(/^models\//, ''), displayName: m.displayName || m.name }));
  if (models.length === 0) {
    return {
      ok: false,
      message:
        'Dieser Schlüssel hat laut Google aktuell keinen Zugriff auf ein Gemini-Modell für Textgenerierung. Bitte in Google AI Studio prüfen, ob die „Generative Language API“ für dieses Projekt aktiviert ist.',
    };
  }
  return { ok: true, models };
}

export interface DirectConfig {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  functionCalling: boolean;
}

export async function analyzeDirectWithGemini(
  apiKey: string,
  message: string,
  history: ChatTurn[],
  context: AiContextPayload,
  config: DirectConfig
): Promise<AiAnalyzeResponse & { networkError?: boolean }> {
  const model = sanitizeModel(config.model);
  const temperature = Math.min(Math.max(config.temperature ?? 0.2, 0), 2);
  const maxOutputTokens = Math.min(Math.max(config.maxOutputTokens ?? 8192, 512), 32768);

  const usageTotal = { inputTokens: 0, outputTokens: 0, calls: 0 };
  const track = (u: GeminiUsage) => {
    usageTotal.inputTokens += u.promptTokenCount ?? 0;
    usageTotal.outputTokens += u.candidatesTokenCount ?? 0;
    usageTotal.calls += 1;
  };

  try {
    // ── Phase A: Verständnis + Tools ────────────────────────────────────────
    const contents: Content[] = [
      ...history.slice(-10).map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    let aiText = '';
    for (let round = 0; round < 6; round++) {
      const { data, usage } = await callGemini(apiKey, model, {
        systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
        contents,
        ...(config.functionCalling !== false ? { tools: [{ functionDeclarations: toolDeclarations() }] } : {}),
        generationConfig: { temperature, maxOutputTokens },
      });
      track(usage);

      const parts = candidateParts(data);
      const functionCalls = parts.filter((p) => p.functionCall) as {
        functionCall: { name: string; args?: Record<string, unknown> };
      }[];

      if (functionCalls.length === 0) {
        aiText = parts
          .map((p) => (typeof p.text === 'string' ? p.text : ''))
          .join('')
          .trim();
        break;
      }

      contents.push({ role: 'model', parts });
      contents.push({
        role: 'user',
        parts: functionCalls.map((fc) => ({
          functionResponse: {
            name: fc.functionCall.name,
            response: { result: execTool(fc.functionCall.name, fc.functionCall.args ?? {}, context) },
          },
        })),
      });
    }

    // ── Phase B: strukturierter Entwurf ─────────────────────────────────────
    const { data: structured, usage: structUsage } = await callGemini(apiKey, model, {
      systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
      contents: [
        ...contents,
        ...(aiText ? [{ role: 'model', parts: [{ text: aiText }] }] : []),
        { role: 'user', parts: [{ text: STRUCTURING_PROMPT }] },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens,
        responseMimeType: 'application/json',
        responseSchema: DRAFT_RESPONSE_SCHEMA,
      },
    });
    track(structUsage);

    const draftText = candidateParts(structured)
      .map((p) => (typeof p.text === 'string' ? p.text : ''))
      .join('');

    let draft: unknown;
    try {
      draft = JSON.parse(draftText);
    } catch {
      return {
        ok: false,
        errorCode: 'invalid',
        error: 'Die KI-Antwort konnte nicht als JSON gelesen werden. Bitte erneut versuchen.',
        aiText,
        usage: usageTotal,
        model,
      };
    }

    return {
      ok: true,
      aiText: aiText || 'Analyse abgeschlossen — Entwurf erstellt.',
      draft: draft as AiAnalyzeResponse['draft'],
      usage: usageTotal,
      model,
    };
  } catch (err) {
    const e = err as Error & { network?: boolean };
    return {
      ok: false,
      errorCode: 'upstream',
      error: e.message,
      usage: usageTotal,
      model,
      networkError: Boolean(e.network),
    };
  }
}

/** Kurzer Verbindungstest für den „Schlüssel testen“-Knopf. */
export async function testGeminiKey(
  apiKey: string,
  model: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const { data } = await callGemini(apiKey, sanitizeModel(model), {
      contents: [{ role: 'user', parts: [{ text: 'Antworte mit genau einem Wort: OK' }] }],
      generationConfig: { temperature: 0, maxOutputTokens: 200 },
    });
    const text = candidateParts(data)
      .map((p) => (typeof p.text === 'string' ? p.text : ''))
      .join('')
      .trim();
    return {
      ok: true,
      message: `Verbindung erfolgreich — ${sanitizeModel(model)} hat geantwortet${text ? ` („${text.slice(0, 40)}“)` : ''}.`,
    };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
