import { beforeAll, describe, expect, it } from 'vitest';

// localStorage-Mock für die Node-Testumgebung
beforeAll(() => {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => void store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
});

describe('Gemini-Schlüsselspeicher (Direktverbindung)', () => {
  it('speichert, liest und entfernt den Schlüssel (mit Trim)', async () => {
    const { getGeminiKey, setGeminiKey } = await import('../keyStore');
    expect(getGeminiKey()).toBeNull();
    setGeminiKey('  AIzaTestSchluessel1234567890abcdefghij  ');
    expect(getGeminiKey()).toBe('AIzaTestSchluessel1234567890abcdefghij');
    setGeminiKey(null);
    expect(getGeminiKey()).toBeNull();
  });

  it('maskiert den Schlüssel für die Anzeige', async () => {
    const { maskKey } = await import('../keyStore');
    expect(maskKey('AIzaXXXXXXXXXXXXXXXXk3Fg')).toBe('AIza…k3Fg');
    expect(maskKey('kurz')).toBe('••••');
  });

  it('erkennt plausible Google-Schlüssel', async () => {
    const { looksLikeGeminiKey } = await import('../keyStore');
    expect(looksLikeGeminiKey('AIzaSyB1234567890abcdefghijklmnopqrstu')).toBe(true);
    expect(looksLikeGeminiKey('zu kurz')).toBe(false);
    expect(looksLikeGeminiKey('enthält leerzeichen und ist trotzdem lang genug!!')).toBe(false);
  });

  it('der Schlüssel landet NIE im JSON-Datenexport', async () => {
    const { setGeminiKey } = await import('../keyStore');
    const secret = 'AIzaGeheimerTestSchluessel987654321000';
    setGeminiKey(secret);

    const { useKwStore } = await import('../../store');
    const json = useKwStore.getState().exportJson();
    expect(json).not.toContain(secret);
    expect(json).not.toContain('klarwerk-gemini-key');

    setGeminiKey(null);
  });
});
