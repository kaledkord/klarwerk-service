/**
 * Client für den KI-Kalkulationsassistenten.
 *
 * Sicherheit: Der Gemini-API-Schlüssel liegt ausschließlich serverseitig
 * in der Supabase Edge Function `ai-kalkulation` (Secret GEMINI_API_KEY).
 * Das Frontend sendet nur die Anfrage plus kompakte Stammdaten-Auszüge
 * (Leistungsbibliothek, Turnusse, Einstellungen) als Tool-Kontext.
 */

import { supabase } from '../../../lib/supabase';
import type { KwData } from '../types';
import { aiDraftSchema, type AiAnalyzeResponse } from './draftSchema';
import { localAnalyze } from './localAnalyzer';

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

/** Kompakter Stammdaten-Kontext für die Function-Calling-Tools der KI. */
export function buildAiContext(data: KwData) {
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
    materials: data.materials.filter((m) => m.active).map((m) => ({ name: m.name, kind: m.kind, unit: m.unit, costPerUnit: m.costPerUnit })),
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

/**
 * Analyse über die Edge Function; bei nicht konfiguriertem Backend
 * automatischer, klar gekennzeichneter lokaler Fallback.
 */
export async function analyzeRequest(
  message: string,
  history: ChatTurn[],
  data: KwData
): Promise<AiAnalyzeResponse & { local?: boolean }> {
  try {
    const { data: res, error } = await supabase.functions.invoke('ai-kalkulation', {
      body: {
        message,
        history,
        context: buildAiContext(data),
        config: {
          model: data.settings.ai.model,
          temperature: data.settings.ai.temperature,
          maxOutputTokens: data.settings.ai.maxOutputTokens,
          functionCalling: data.settings.ai.functionCalling,
        },
      },
    });

    if (error) {
      // Function nicht erreichbar/deployt → lokaler Fallback
      const fallback = localAnalyze(message, data);
      return {
        ok: true,
        local: true,
        aiText: fallback.aiText,
        draft: aiDraftSchema.parse(fallback.draft),
        usage: { inputTokens: 0, outputTokens: 0, calls: 0 },
        model: 'lokale Analyse',
        error: `KI-Backend nicht erreichbar (${error.message ?? 'Fehler'}).`,
        errorCode: 'not_configured',
      };
    }

    const payload = res as AiAnalyzeResponse;
    if (!payload.ok) {
      if (payload.errorCode === 'not_configured') {
        const fallback = localAnalyze(message, data);
        return {
          ok: true,
          local: true,
          aiText: fallback.aiText,
          draft: aiDraftSchema.parse(fallback.draft),
          usage: { inputTokens: 0, outputTokens: 0, calls: 0 },
          model: 'lokale Analyse',
          error: payload.error,
          errorCode: payload.errorCode,
        };
      }
      return payload;
    }

    // Draft strikt validieren — ungültige KI-Antworten werden nicht übernommen
    const parsed = aiDraftSchema.safeParse(payload.draft);
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Die KI-Antwort entsprach nicht dem erwarteten Schema und wurde verworfen. Bitte erneut analysieren.',
        errorCode: 'invalid',
        aiText: payload.aiText,
        usage: payload.usage,
        model: payload.model,
      };
    }
    return { ...payload, draft: parsed.data };
  } catch {
    const fallback = localAnalyze(message, data);
    return {
      ok: true,
      local: true,
      aiText: fallback.aiText,
      draft: aiDraftSchema.parse(fallback.draft),
      usage: { inputTokens: 0, outputTokens: 0, calls: 0 },
      model: 'lokale Analyse',
      errorCode: 'not_configured',
      error: 'KI-Backend nicht erreichbar.',
    };
  }
}
