/**
 * Zentraler Datenspeicher der Kalkulations-App.
 * Persistenz: localStorage (Autosave bei jeder Änderung).
 * Alle Änderungen laufen über benannte Aktionen — die Berechnungen selbst
 * finden ausschließlich in der Engine statt.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  AiLogEntry,
  Calculation,
  CleaningObject,
  Customer,
  Frequency,
  KwData,
  Machine,
  Material,
  ObjectType,
  RoomType,
  Service,
  ServiceCategory,
  Settings,
} from './types';
import { createSeedData, DATA_VERSION } from './seed';
import { uid, formatSequence } from './id';
import type { EngineContext } from './engine';

const STORAGE_KEY = 'klarwerk-kalkulation-v1';
const MAX_VERSIONS = 20;

export interface KwStore {
  data: KwData;
  hydrated: boolean;
  /** Undo-Snapshots je Kalkulation (nicht persistiert). */
  undo: Record<string, { past: string[]; future: string[] }>;

  setHydrated: (v: boolean) => void;

  // Einstellungen
  updateSettings: (fn: (s: Settings) => void) => void;

  // Kunden
  addCustomer: (partial: Omit<Customer, 'id' | 'number' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, fn: (c: Customer) => void) => void;
  deleteCustomer: (id: string) => void;

  // Objekte
  addObject: (partial: Omit<CleaningObject, 'id' | 'createdAt'>) => CleaningObject;
  updateObject: (id: string, fn: (o: CleaningObject) => void) => void;
  deleteObject: (id: string) => void;

  // Kalkulationen
  createCalculation: (init?: Partial<Calculation>) => Calculation;
  updateCalculation: (id: string, fn: (c: Calculation) => void, opts?: { undoable?: boolean }) => void;
  deleteCalculation: (id: string) => void;
  duplicateCalculation: (id: string) => Calculation | undefined;
  saveCalculationVersion: (id: string, label: string) => void;
  restoreCalculationVersion: (id: string, versionId: string) => void;
  undoCalculation: (id: string) => void;
  redoCalculation: (id: string) => void;

  // Bibliothek
  addService: (s: Omit<Service, 'id' | 'system'>) => Service;
  updateService: (id: string, fn: (s: Service) => void) => void;
  deleteService: (id: string) => void;
  addServiceCategory: (name: string) => ServiceCategory;
  addFrequency: (f: Omit<Frequency, 'id' | 'system' | 'sortOrder'>) => Frequency;
  updateFrequency: (id: string, fn: (f: Frequency) => void) => void;
  deleteFrequency: (id: string) => void;
  addMaterial: (m: Omit<Material, 'id'>) => Material;
  updateMaterial: (id: string, fn: (m: Material) => void) => void;
  deleteMaterial: (id: string) => void;
  addMachine: (m: Omit<Machine, 'id'>) => Machine;
  updateMachine: (id: string, fn: (m: Machine) => void) => void;
  deleteMachine: (id: string) => void;
  addObjectType: (name: string) => ObjectType;
  addRoomType: (name: string) => RoomType;

  // KI
  addAiLog: (entry: Omit<AiLogEntry, 'id'>) => AiLogEntry;
  setAiLogAccepted: (id: string, accepted: boolean) => void;

  // Daten
  resetToSeed: () => void;
  clearAllData: () => void;
  exportJson: () => string;
  importJson: (json: string) => { ok: boolean; error?: string };
}

function calcSnapshot(c: Calculation): string {
  const { versions: _versions, ...rest } = c;
  void _versions;
  return JSON.stringify(rest);
}

export const useKwStore = create<KwStore>()(
  persist(
    immer((set, get) => ({
      data: createSeedData(),
      hydrated: false,
      undo: {},

      setHydrated: (v) =>
        set((st) => {
          st.hydrated = v;
        }),

      updateSettings: (fn) =>
        set((st) => {
          fn(st.data.settings);
        }),

      addCustomer: (partial) => {
        const customer: Customer = {
          ...partial,
          id: uid('cust'),
          number: `K-${get().data.counters.customer + 1}`,
          createdAt: new Date().toISOString(),
        };
        set((st) => {
          st.data.counters.customer += 1;
          st.data.customers.push(customer);
        });
        return customer;
      },
      updateCustomer: (id, fn) =>
        set((st) => {
          const c = st.data.customers.find((x) => x.id === id);
          if (c) fn(c);
        }),
      deleteCustomer: (id) =>
        set((st) => {
          st.data.customers = st.data.customers.filter((x) => x.id !== id);
          st.data.objects = st.data.objects.filter((o) => o.customerId !== id);
          for (const calc of st.data.calculations) {
            if (calc.customerId === id) {
              calc.customerId = undefined;
              calc.objectId = undefined;
            }
          }
        }),

      addObject: (partial) => {
        const object: CleaningObject = {
          ...partial,
          id: uid('obj'),
          createdAt: new Date().toISOString(),
        };
        set((st) => {
          st.data.objects.push(object);
        });
        return object;
      },
      updateObject: (id, fn) =>
        set((st) => {
          const o = st.data.objects.find((x) => x.id === id);
          if (o) fn(o);
        }),
      deleteObject: (id) =>
        set((st) => {
          st.data.objects = st.data.objects.filter((x) => x.id !== id);
          for (const calc of st.data.calculations) {
            if (calc.objectId === id) calc.objectId = undefined;
          }
        }),

      createCalculation: (init) => {
        const st0 = get();
        const year = new Date().getFullYear();
        const n = st0.data.counters.calculation + 1;
        const s = st0.data.settings;
        const calc: Calculation = {
          id: uid('calc'),
          number: formatSequence('K', year, n),
          name: 'Neue Kalkulation',
          status: 'entwurf',
          lines: [],
          travel: {
            enabled: true,
            distanceKm: 0,
            tripsPerMonth: null,
            payTravelTime: s.travel.payTravelTimeDefault,
          },
          overheadEnabled: s.overhead.enabledByDefault,
          overheadRatePerHour: null,
          riskKey: s.calculation.defaultRiskKey,
          riskPctOverride: null,
          marginMode: s.calculation.marginMode,
          targetMarginPct: s.calculation.targetMarginPct,
          selectedPriceStrategy: 'target',
          customPrice: null,
          competitorPrice: null,
          wageOverride: null,
          scenarios: [],
          postCalc: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versions: [],
          ...init,
        };
        set((st) => {
          st.data.counters.calculation = n;
          st.data.calculations.unshift(calc);
        });
        return calc;
      },

      updateCalculation: (id, fn, opts) =>
        set((st) => {
          const c = st.data.calculations.find((x) => x.id === id);
          if (!c) return;
          if (opts?.undoable !== false) {
            const stack = (st.undo[id] ??= { past: [], future: [] });
            stack.past.push(calcSnapshot(c));
            if (stack.past.length > 50) stack.past.shift();
            stack.future = [];
          }
          fn(c);
          c.updatedAt = new Date().toISOString();
        }),

      deleteCalculation: (id) =>
        set((st) => {
          st.data.calculations = st.data.calculations.filter((x) => x.id !== id);
          delete st.undo[id];
        }),

      duplicateCalculation: (id) => {
        const src = get().data.calculations.find((x) => x.id === id);
        if (!src) return undefined;
        const year = new Date().getFullYear();
        const n = get().data.counters.calculation + 1;
        const copy: Calculation = {
          ...structuredClone({ ...src }),
          id: uid('calc'),
          number: formatSequence('K', year, n),
          name: `${src.name} (Kopie)`,
          status: 'entwurf',
          offer: undefined,
          postCalc: [],
          versions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lines: src.lines.map((l) => ({ ...structuredClone(l), id: uid('ln') })),
        };
        set((st) => {
          st.data.counters.calculation = n;
          st.data.calculations.unshift(copy);
        });
        return copy;
      },

      saveCalculationVersion: (id, label) =>
        set((st) => {
          const c = st.data.calculations.find((x) => x.id === id);
          if (!c) return;
          c.versions.unshift({
            id: uid('ver'),
            label: label || `Version vom ${new Date().toLocaleString('de-DE')}`,
            at: new Date().toISOString(),
            snapshot: calcSnapshot(c),
          });
          if (c.versions.length > MAX_VERSIONS) c.versions.pop();
        }),

      restoreCalculationVersion: (id, versionId) =>
        set((st) => {
          const c = st.data.calculations.find((x) => x.id === id);
          const v = c?.versions.find((x) => x.id === versionId);
          if (!c || !v) return;
          const restored = JSON.parse(v.snapshot) as Omit<Calculation, 'versions'>;
          Object.assign(c, restored, { versions: c.versions, updatedAt: new Date().toISOString() });
        }),

      undoCalculation: (id) =>
        set((st) => {
          const c = st.data.calculations.find((x) => x.id === id);
          const stack = st.undo[id];
          if (!c || !stack || stack.past.length === 0) return;
          stack.future.push(calcSnapshot(c));
          const prev = JSON.parse(stack.past.pop()!) as Omit<Calculation, 'versions'>;
          Object.assign(c, prev, { versions: c.versions });
        }),

      redoCalculation: (id) =>
        set((st) => {
          const c = st.data.calculations.find((x) => x.id === id);
          const stack = st.undo[id];
          if (!c || !stack || stack.future.length === 0) return;
          stack.past.push(calcSnapshot(c));
          const next = JSON.parse(stack.future.pop()!) as Omit<Calculation, 'versions'>;
          Object.assign(c, next, { versions: c.versions });
        }),

      addService: (partial) => {
        const service: Service = { ...partial, id: uid('sv'), system: false };
        set((st) => {
          st.data.services.push(service);
        });
        return service;
      },
      updateService: (id, fn) =>
        set((st) => {
          const s = st.data.services.find((x) => x.id === id);
          if (s) fn(s);
        }),
      deleteService: (id) =>
        set((st) => {
          const s = st.data.services.find((x) => x.id === id);
          if (!s) return;
          if (s.system) s.active = false;
          else st.data.services = st.data.services.filter((x) => x.id !== id);
        }),
      addServiceCategory: (name) => {
        const cat: ServiceCategory = {
          id: uid('cat'),
          name,
          sortOrder: 1000 + get().data.serviceCategories.length * 10,
          system: false,
        };
        set((st) => {
          st.data.serviceCategories.push(cat);
        });
        return cat;
      },

      addFrequency: (partial) => {
        const freq: Frequency = {
          ...partial,
          id: uid('fq'),
          system: false,
          sortOrder: 500 + get().data.frequencies.length,
        };
        set((st) => {
          st.data.frequencies.push(freq);
        });
        return freq;
      },
      updateFrequency: (id, fn) =>
        set((st) => {
          const f = st.data.frequencies.find((x) => x.id === id);
          if (f) fn(f);
        }),
      deleteFrequency: (id) =>
        set((st) => {
          const f = st.data.frequencies.find((x) => x.id === id);
          if (!f) return;
          if (f.system) f.active = false;
          else st.data.frequencies = st.data.frequencies.filter((x) => x.id !== id);
        }),

      addMaterial: (partial) => {
        const m: Material = { ...partial, id: uid('mat') };
        set((st) => {
          st.data.materials.push(m);
        });
        return m;
      },
      updateMaterial: (id, fn) =>
        set((st) => {
          const m = st.data.materials.find((x) => x.id === id);
          if (m) fn(m);
        }),
      deleteMaterial: (id) =>
        set((st) => {
          st.data.materials = st.data.materials.filter((x) => x.id !== id);
        }),

      addMachine: (partial) => {
        const m: Machine = { ...partial, id: uid('ma') };
        set((st) => {
          st.data.machines.push(m);
        });
        return m;
      },
      updateMachine: (id, fn) =>
        set((st) => {
          const m = st.data.machines.find((x) => x.id === id);
          if (m) fn(m);
        }),
      deleteMachine: (id) =>
        set((st) => {
          const inUse = st.data.calculations.some((c) => c.lines.some((l) => l.machineId === id));
          if (inUse) {
            const m = st.data.machines.find((x) => x.id === id);
            if (m) m.active = false;
          } else {
            st.data.machines = st.data.machines.filter((x) => x.id !== id);
          }
        }),

      addObjectType: (name) => {
        const t: ObjectType = { id: uid('ot'), name, system: false };
        set((st) => {
          st.data.objectTypes.push(t);
        });
        return t;
      },
      addRoomType: (name) => {
        const t: RoomType = { id: uid('rt'), name, system: false };
        set((st) => {
          st.data.roomTypes.push(t);
        });
        return t;
      },

      addAiLog: (entry) => {
        const log: AiLogEntry = { ...entry, id: uid('ai') };
        set((st) => {
          st.data.aiLog.unshift(log);
          if (st.data.aiLog.length > 200) st.data.aiLog.pop();
        });
        return log;
      },
      setAiLogAccepted: (id, accepted) =>
        set((st) => {
          const e = st.data.aiLog.find((x) => x.id === id);
          if (e) e.accepted = accepted;
        }),

      resetToSeed: () =>
        set((st) => {
          st.data = createSeedData();
          st.undo = {};
        }),
      clearAllData: () =>
        set((st) => {
          const seed = createSeedData();
          st.data = {
            ...seed,
            customers: [],
            objects: [],
            calculations: [],
            aiLog: [],
            counters: { customer: 1000, calculation: 0, offer: 0 },
          };
          st.undo = {};
        }),

      exportJson: () => JSON.stringify({ exportedAt: new Date().toISOString(), data: get().data }, null, 2),

      importJson: (json) => {
        try {
          const parsed = JSON.parse(json) as { data?: KwData } | KwData;
          const data = 'data' in parsed && parsed.data ? parsed.data : (parsed as KwData);
          if (!data || typeof data !== 'object' || !Array.isArray((data as KwData).calculations)) {
            return { ok: false, error: 'Die Datei enthält keinen gültigen KlarWerk-Datenexport.' };
          }
          set((st) => {
            st.data = { ...createSeedData(), ...data, dataVersion: DATA_VERSION };
            st.undo = {};
          });
          return { ok: true };
        } catch {
          return { ok: false, error: 'Die Datei konnte nicht gelesen werden (ungültiges JSON).' };
        }
      },
    })),
    {
      name: STORAGE_KEY,
      version: DATA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (st) => ({ data: st.data }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

/** Engine-Kontext aus dem aktuellen Datenbestand. */
export function engineContext(data: KwData): EngineContext {
  return { settings: data.settings, frequencies: data.frequencies, machines: data.machines };
}

// Bequeme Hooks
export const useKwData = () => useKwStore((st) => st.data);
export const useHydrated = () => useKwStore((st) => st.hydrated);
