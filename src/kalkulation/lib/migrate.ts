/**
 * Daten-Migration: ergänzt in bestehenden Datenbeständen (localStorage
 * älterer Versionen, JSON-Importe) fehlende neue Felder mit sinnvollen
 * Standardwerten — vorhandene Daten bleiben unangetastet.
 */

import type { Calculation, KwData, Settings } from './types';
import { DEFAULT_COST_OVERRIDE } from './types';

export function migrateData(data: KwData): KwData {
  const settings = data.settings as Settings;

  // v2: Vorschlagswerte für prozentuale Material-/Maschinenkosten
  if (!settings.costSuggestions) {
    settings.costSuggestions = { materialPctOfLabor: 4, machinePctOfLabor: 2 };
  }

  for (const calc of data.calculations as Calculation[]) {
    // v2: individuelle Kostenermittlung je Kalkulation
    if (!calc.materialOverride) calc.materialOverride = { ...DEFAULT_COST_OVERRIDE };
    if (!calc.machineOverride) calc.machineOverride = { ...DEFAULT_COST_OVERRIDE };
    if (!calc.versions) calc.versions = [];
    if (!calc.postCalc) calc.postCalc = [];
    if (!calc.scenarios) calc.scenarios = [];
  }

  return data;
}
