/**
 * Client für den KI-Kalkulationsassistenten — drei Wege, in dieser Reihenfolge:
 *
 * 1. DIREKTVERBINDUNG (Standalone): eigener Gemini-API-Schlüssel aus den
 *    Einstellungen (nur in diesem Browser gespeichert, nie im Datenexport).
 * 2. SERVER-BACKEND: Supabase Edge Function `ai-kalkulation`
 *    (Schlüssel als Server-Secret) — für eine gehostete Variante.
 * 3. LOKALE ANALYSE: eingebauter Regel-Parser, klar gekennzeichnet.
 *
 * Jede KI-Antwort wird strikt validiert (zod); die Mathematik bleibt
 * ausschließlich bei der Kalkulations-Engine.
 */

import { supabase } from '../../../lib/supabase';
import type { KwData } from '../types';
import { aiDraftSchema, type AiAnalyzeResponse } from './draftSchema';
import { localAnalyze } from './localAnalyzer';
import { getGeminiKey } from './keyStore';
import { analyzeDirectWithGemini } from './geminiDirect';
import type { AiContextPayload } from './prompt';

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export type AiVia = 'direct' | 'server' | 'local';

export type AnalyzeResult = AiAnalyzeResponse & { via: AiVia; local?: boolean };

/** Kompakter Stammdaten-Kontext für die Function-Calling-Tools der KI. */
export function buildAiContext(data: KwData): AiContextPayload {
  return {
    services: data.services
      .filter((s) => s.active)
      .map((s) => ({
        id: s.id,
        name: s.name,
        category: data.serviceCategories.find((c) => c.id === s.categoryId)?.name ?? '',
        unit: s.unit,
        performanceValuePerHour: s.defaultPerformanceValue,
        defaultFrequency: data.frequencies.find((f) => f.id === s.defaultFrequencyId)?.name ?? null,
      })),
    frequencies: data.frequencies.filter((f) => f.active).map((f) => ({ id: f.id, name: f.name })),
    roomTypes: data.roomTypes.map((r) => r.name),
    objectTypes: data.objectTypes.map((o) => o.name),
    materials: data.materials
      .filter((m) => m.active)
      .map((m) => ({ name: m.name, kind: m.kind, unit: m.unit, costPerUnit: m.costPerUnit })),
    machines: data.machines.filter((m) => m.active).map((m) => ({ name: m.name, hourlyRatePerHour: m.hourlyRate })),
    settings: {
      targetMarginPct: data.settings.calculation.targetMarginPct,
      minMarginPct: data.settings.calculation.minMarginPct,
      baseWagePerHour: data.settings.labor.baseWage,
      vatPct: data.settings.calculation.vatPct,
      consumablesDefault: data.settings.material.consumablesDefault,
    },
  };
}

export interface BudgetState {
  spentEur: number;
  budgetEur: number;
  pct: number;
  warned: boolean;
  blocked: boolean;
}

export function budgetState(data: KwData): BudgetState {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const spent = data.aiLog.filter((l) => l.at.startsWith(monthKey)).reduce((s, l) => s + l.costEur, 0);
  const budget = data.settings.ai.monthlyBudgetEur;
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  return {
    spentEur: spent,
    budgetEur: budget,
    pct,
    warned: pct >= data.settings.ai.warnAtPct,
    blocked: budget > 0 && pct >= 100,
  };
}

export function estimateCostEur(data: KwData, inputTokens: number, outputTokens: number): number {
  const ai = data.settings.ai;
  return (inputTokens / 1_000_000) * ai.priceInPer1M + (outputTokens / 1_000_000) * ai.priceOutPer1M;
}

/** Draft strikt validieren — ungültige KI-Antworten werden nicht übernommen. */
function withValidatedDraft(payload: AiAnalyzeResponse, via: AiVia): AnalyzeResult {
  if (!payload.ok || !payload.draft) return { ...payload, via };
  const parsed = aiDraftSchema.safeParse(payload.draft);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Die KI-Antwort entsprach nicht dem erwarteten Schema und wurde verworfen. Bitte erneut analysieren.',
      errorCode: 'invalid',
      aiText: payload.aiText,
      usage: payload.usage,
      model: payload.model,
      via,
    };
  }
  return { ...payload, draft: parsed.data, via };
}

function localResult(message: string, data: KwData, note?: string): AnalyzeResult {
  const fallback = localAnalyze(message, data);
  return {
    ok: true,
    via: 'local',
    local: true,
    // Grund für den Fallback sichtbar machen (z. B. „keine Internetverbindung“)
    aiText: note ? `${note}\n\n${fallback.aiText}` : fallback.aiText,
    draft: aiDraftSchema.parse(fallback.draft),
    usage: { inputTokens: 0, outputTokens: 0, calls: 0 },
    model: 'lokale Analyse',
    error: note,
    errorCode: note ? 'not_configured' : undefined,
  };
}

export async function analyzeRequest(
  message: string,
  history: ChatTurn[],
  data: KwData
): Promise<AnalyzeResult> {
  const context = buildAiContext(data);
  const config = {
    model: data.settings.ai.model,
    temperature: data.settings.ai.temperature,
    maxOutputTokens: data.settings.ai.maxOutputTokens,
    functionCalling: data.settings.ai.functionCalling,
  };

  // 1) Direktverbindung mit eigenem Schlüssel
  const apiKey = getGeminiKey();
  if (apiKey) {
    const res = await analyzeDirectWithGemini(apiKey, message, history, context, config);
    if (res.ok) return withValidatedDraft(res, 'direct');
    if (res.networkError) {
      return localResult(message, data, `${res.error} — stattdessen lokale Analyse verwendet.`);
    }
    // Echte API-Fehler (ungültiger Schlüssel, Kontingent …) klar anzeigen
    return { ...res, via: 'direct' };
  }

  // 2) Server-Backend (Edge Function), 3) lokale Analyse
  try {
    const { data: res, error } = await supabase.functions.invoke('ai-kalkulation', {
      body: { message, history, context, config },
    });

    if (error) {
      return localResult(message, data, `KI-Backend nicht erreichbar (${error.message ?? 'Fehler'}).`);
    }

    const payload = res as AiAnalyzeResponse;
    if (!payload.ok) {
      if (payload.errorCode === 'not_configured') {
        return localResult(message, data, payload.error);
      }
      return { ...payload, via: 'server' };
    }
    return withValidatedDraft(payload, 'server');
  } catch {
    return localResult(message, data, 'KI-Backend nicht erreichbar.');
  }
}
