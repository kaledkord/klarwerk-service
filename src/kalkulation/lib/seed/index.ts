import type { KwData } from '../types';
import { SEED_FREQUENCIES } from './frequencies';
import { SEED_SERVICES, SEED_SERVICE_CATEGORIES } from './services';
import { SEED_MACHINES, SEED_MATERIALS, SEED_OBJECT_TYPES, SEED_ROOM_TYPES } from './master';
import { SEED_SETTINGS } from './settings';
import { SEED_CALCULATIONS, SEED_CUSTOMERS, SEED_OBJECTS } from './demo';

export const DATA_VERSION = 1;

export function createSeedData(): KwData {
  return {
    dataVersion: DATA_VERSION,
    counters: { customer: 1003, calculation: 3, offer: 1 },
    settings: structuredClone(SEED_SETTINGS),
    frequencies: structuredClone(SEED_FREQUENCIES),
    serviceCategories: structuredClone(SEED_SERVICE_CATEGORIES),
    services: structuredClone(SEED_SERVICES),
    materials: structuredClone(SEED_MATERIALS),
    machines: structuredClone(SEED_MACHINES),
    objectTypes: structuredClone(SEED_OBJECT_TYPES),
    roomTypes: structuredClone(SEED_ROOM_TYPES),
    customers: structuredClone(SEED_CUSTOMERS),
    objects: structuredClone(SEED_OBJECTS),
    calculations: structuredClone(SEED_CALCULATIONS),
    aiLog: [],
  };
}

export { SEED_SETTINGS } from './settings';
export { SEED_FREQUENCIES } from './frequencies';
export { SEED_SERVICES, SEED_SERVICE_CATEGORIES } from './services';
export { SEED_MACHINES, SEED_MATERIALS, SEED_OBJECT_TYPES, SEED_ROOM_TYPES, SEED_FLOOR_TYPES } from './master';
