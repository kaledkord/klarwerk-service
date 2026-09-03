import { afterEach, describe, expect, it, vi } from 'vitest';
import { testGeminiKey } from '../geminiDirect';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

const OK_BODY = { candidates: [{ content: { parts: [{ text: 'OK' }] } }] };
const OVERLOADED = { error: { code: 503, status: 'UNAVAILABLE', message: 'high demand' } };
const INVALID_KEY = { error: { code: 400, status: 'INVALID_ARGUMENT', message: 'API_KEY_INVALID' } };

describe('Gemini-Direktverbindung: automatische Wiederholung bei Überlastung (503)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('erholt sich nach zwei 503-Antworten automatisch und meldet Erfolg', async () => {
    vi.useFakeTimers();
    let call = 0;
    const fetchMock = vi.fn(async () => {
      call += 1;
      return call <= 2 ? jsonResponse(503, OVERLOADED) : jsonResponse(200, OK_BODY);
    });
    vi.stubGlobal('fetch', fetchMock);

    const resultPromise = testGeminiKey('AIzaTestSchluessel1234567890abcdefghij', 'gemini-2.5-flash');
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.ok).toBe(true);
  });

  it('gibt nach drei anhaltenden 503-Antworten eine klare, kein Alarm-artige Meldung', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => jsonResponse(503, OVERLOADED));
    vi.stubGlobal('fetch', fetchMock);

    const resultPromise = testGeminiKey('AIzaTestSchluessel1234567890abcdefghij', 'gemini-2.5-flash');
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(fetchMock).toHaveBeenCalledTimes(3); // 1 Versuch + 2 Wiederholungen
    expect(result.ok).toBe(false);
    expect(result.message).toContain('kurzzeitig überlastet');
    expect(result.message).toContain('automatisch mehrfach erneut versucht');
  });

  it('wiederholt NICHT bei eindeutig ungültigem Schlüssel (400) — kein sinnloses Warten', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(400, INVALID_KEY));
    vi.stubGlobal('fetch', fetchMock);

    const result = await testGeminiKey('AIzaTestSchluessel1234567890abcdefghij', 'gemini-2.5-flash');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('abgelehnt');
  });
});
