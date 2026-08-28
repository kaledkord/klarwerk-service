/**
 * Helfer zum Erzeugen von Kalkulationszeilen aus Leistungen, Räumen
 * und Vorlagen. Wird von Workspace, Wizard, Schnellkalkulation und
 * KI-Assistent gemeinsam genutzt.
 */

import type { CalcLine, FactorSelection, Room, Service, Settings } from './types';
import { NEUTRAL_FACTORS } from './types';
import { uid } from './id';

export interface LineInit {
  areaLabel: string;
  roomLabel: string;
  roomId?: string;
  quantity?: number;
  frequencyId?: string;
  factors?: FactorSelection;
  sortOrder?: number;
  note?: string;
}

let sortCounter = 0;

export function lineFromService(service: Service, settings: Settings, init: LineInit): CalcLine {
  sortCounter += 10;
  const isSqm = service.unit === 'm²';
  return {
    id: uid('ln'),
    roomId: init.roomId,
    areaLabel: init.areaLabel,
    roomLabel: init.roomLabel,
    serviceId: service.id,
    serviceName: service.name,
    unit: service.unit,
    quantity: init.quantity ?? (isSqm ? 0 : 1),
    basePerformanceValue: service.defaultPerformanceValue,
    factors: init.factors ? { ...init.factors } : { ...NEUTRAL_FACTORS },
    manualPerformanceValue: null,
    manualExecutionsPerMonth: null,
    manualTimePerExecutionH: null,
    frequencyId: init.frequencyId ?? service.defaultFrequencyId ?? 'fq_1w',
    materialMode: settings.material.defaultMode,
    materialValue: settings.material.defaultMode === 'none' ? 0 : settings.material.defaultValue,
    machineId: null,
    surchargeKey: 'none',
    note: init.note,
    sortOrder: init.sortOrder ?? sortCounter,
  };
}

/** Faktoren eines Raums für neue Zeilen übernehmen. */
export function factorsFromRoom(room: Room | undefined): FactorSelection {
  return room ? { ...room.factors } : { ...NEUTRAL_FACTORS };
}
