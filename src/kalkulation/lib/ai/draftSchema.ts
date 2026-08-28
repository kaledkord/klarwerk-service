/**
 * Schema des KI-Kalkulationsentwurfs (zod-validiert).
 * Die KI liefert ausschließlich strukturierte Entwürfe — die Mathematik
 * bleibt vollständig in der Kalkulations-Engine. Ungültige Antworten
 * werden verworfen, fehlende Angaben als solche gekennzeichnet.
 */

import { z } from 'zod';

export const aiServiceSchema = z.object({
  area: z.string().min(1),
  room: z.string().nullish(),
  /** ID aus der Leistungsbibliothek, wenn die KI sie über die Tools gefunden hat. */
  service_id: z.string().nullish(),
  service_name: z.string().min(1),
  /** Turnus als Klartext, z. B. "2× wöchentlich" — wird gegen die Turnus-Bibliothek aufgelöst. */
  frequency_label: z.string().min(1),
  quantity: z.number().positive().nullish(),
  unit: z.string().nullish(),
  /** 0–1: Wie sicher ist die KI bei dieser Position? */
  confidence: z.number().min(0).max(1).default(0.8),
  assumption: z.string().nullish(),
});

export const aiDraftSchema = z.object({
  object: z.object({
    name: z.string().nullish(),
    type: z.string().nullish(),
    total_area_sqm: z.number().positive().nullish(),
  }),
  areas: z
    .array(
      z.object({
        name: z.string(),
        rooms: z
          .array(
            z.object({
              name: z.string(),
              type: z.string().nullish(),
              quantity: z.number().positive().nullish(),
              area_sqm: z.number().positive().nullish(),
            })
          )
          .default([]),
      })
    )
    .default([]),
  services: z.array(aiServiceSchema).default([]),
  missing_information: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  questions: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  summary: z.string().default(''),
});

export type AiDraft = z.infer<typeof aiDraftSchema>;
export type AiDraftService = z.infer<typeof aiServiceSchema>;

export interface AiAnalyzeResponse {
  ok: boolean;
  error?: string;
  errorCode?: 'not_configured' | 'rate_limited' | 'upstream' | 'invalid';
  aiText?: string;
  draft?: AiDraft;
  usage?: { inputTokens: number; outputTokens: number; calls: number };
  model?: string;
}
