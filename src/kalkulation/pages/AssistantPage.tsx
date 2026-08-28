/**
 * KI-Kalkulationsassistent: Chat links, Live-Kalkulationsentwurf rechts.
 * Jeder KI-Vorschlag ist ein ENTWURF — Übernahme nur nach manueller Freigabe,
 * einzeln oder gesamt. Budgetkontrolle und Protokoll inklusive.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bot,
  Check,
  HelpCircle,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useKwStore } from '../lib/store';
import { analyzeRequest, budgetState, estimateCostEur, type ChatTurn } from '../lib/ai/client';
import { resolveDraft, type ResolvedDraftLine } from '../lib/ai/applyDraft';
import type { AiDraft } from '../lib/ai/draftSchema';
import { fmtEur, fmtNum, fmtPct } from '../lib/format';
import { Badge, Button, Callout, Card, cx, SectionTitle, Textarea, toast } from '../components/ui';
import { BASE, PageHeader } from '../components/shell';

interface ChatMessage extends ChatTurn {
  local?: boolean;
}

const EXAMPLES = [
  '500 m² Büro, zweimal pro Woche reinigen, 4 Büros, 2 Toiletten, Küche und Treppenhaus.',
  'Zahnarztpraxis mit 320 m², tägliche Reinigung nach Praxisschluss, hoher Hygienestandard.',
  'Lagerhalle 1.800 m² mit Sozialräumen, maschinelle Reinigung 1× wöchentlich, Sanitär 3× wöchentlich.',
];

export default function AssistantPage() {
  const data = useKwStore((st) => st.data);
  const addAiLog = useKwStore((st) => st.addAiLog);
  const setAiLogAccepted = useKwStore((st) => st.setAiLogAccepted);
  const createCalculation = useKwStore((st) => st.createCalculation);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<AiDraft | null>(null);
  const [isLocalDraft, setIsLocalDraft] = useState(false);
  const [lastLogId, setLastLogId] = useState<string | null>(null);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const [budgetOverride, setBudgetOverride] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const budget = budgetState(data);
  const blocked = budget.blocked && !budgetOverride;

  const resolved: ResolvedDraftLine[] = useMemo(
    () => (draft ? resolveDraft(draft, data) : []),
    [draft, data]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || busy || blocked) return;
    setInput('');
    setBusy(true);
    const history = messages.map(({ role, text: t }) => ({ role, text: t }));
    setMessages((m) => [...m, { role: 'user', text: message }]);

    const res = await analyzeRequest(message, history, data);
    setBusy(false);

    if (!res.ok) {
      setMessages((m) => [
        ...m,
        { role: 'model', text: res.error ?? 'Die Analyse ist fehlgeschlagen. Bitte erneut versuchen.' },
      ]);
      return;
    }

    const cost = estimateCostEur(data, res.usage?.inputTokens ?? 0, res.usage?.outputTokens ?? 0);
    const log = addAiLog({
      at: new Date().toISOString(),
      model: res.model ?? 'unbekannt',
      userInput: message,
      inputTokens: res.usage?.inputTokens ?? 0,
      outputTokens: res.usage?.outputTokens ?? 0,
      costEur: cost,
      summary: res.draft?.summary,
    });
    setLastLogId(log.id);

    setMessages((m) => [...m, { role: 'model', text: res.aiText ?? 'Entwurf aktualisiert.', local: res.local }]);
    if (res.draft) {
      setDraft(res.draft);
      setIsLocalDraft(Boolean(res.local));
      setSelection({});
    }
  };

  const acceptDraft = (onlySelected: boolean) => {
    if (!draft) return;
    const chosen = resolved.filter((r, i) => r.line && (!onlySelected || selection[i] !== false));
    const lines = chosen.map((r) => ({ ...r.line! }));
    if (lines.length === 0) {
      toast('Keine übernehmbaren Positionen ausgewählt.', 'error');
      return;
    }
    const calc = createCalculation({
      name: draft.object.name || `${draft.object.type ?? 'Objekt'}${draft.object.total_area_sqm ? ` ${fmtNum(draft.object.total_area_sqm, 0)} m²` : ''} – KI-Entwurf`,
      lines,
      aiOrigin: { isDraft: true, note: draft.summary },
    });
    if (lastLogId) setAiLogAccepted(lastLogId, true);
    toast(`${lines.length} Positionen als Kalkulationsentwurf ${calc.number} übernommen — bitte prüfen.`);
    navigate(`${BASE}/kalkulationen/${calc.id}?tab=leistungen`);
  };

  const rejectDraft = () => {
    if (lastLogId) setAiLogAccepted(lastLogId, false);
    setDraft(null);
    setSelection({});
    toast('Entwurf verworfen.', 'info');
  };

  return (
    <div className="max-w-[1500px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'KI-Assistent' }]}
        title="KI-Kalkulationsassistent"
        sub={
          <>
            Beschreiben Sie das Objekt in eigenen Worten — der Assistent strukturiert Bereiche, Leistungen und Turnusse
            aus Ihrer Leistungsbibliothek. Modell: <span className="font-semibold">{data.settings.ai.model}</span> · alle
            Berechnungen macht die Kalkulations-Engine, nie die KI.
          </>
        }
      />

      {budget.warned && !budget.blocked ? (
        <Callout tone="warn" className="mb-3">
          KI-Budget zu {fmtNum(budget.pct, 0)} % verbraucht ({fmtEur(budget.spentEur)} von {fmtEur(budget.budgetEur)}).
        </Callout>
      ) : null}
      {budget.blocked ? (
        <Callout tone="error" className="mb-3">
          <span className="flex flex-wrap items-center gap-2">
            Monatliches KI-Budget erreicht ({fmtEur(budget.spentEur)} von {fmtEur(budget.budgetEur)}) — weitere Anfragen
            nur mit ausdrücklicher Freigabe.
            {!budgetOverride ? (
              <Button size="sm" variant="outline" onClick={() => setBudgetOverride(true)}>
                Für diese Sitzung freigeben
              </Button>
            ) : (
              <Badge tone="amber">Freigegeben für diese Sitzung</Badge>
            )}
          </span>
        </Callout>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Chat */}
        <Card padded={false} className="flex flex-col h-[640px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center px-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-brand-500 text-white mb-3">
                  <Sparkles size={22} />
                </span>
                <p className="text-sm font-bold text-slate-800">Womit darf ich kalkulieren?</p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Freitext genügt — ich erkenne Bereiche, schlage Leistungen aus Ihrer Bibliothek vor und gebe jeder
                  Position ihren eigenen Turnus. Fehlende Angaben frage ich nach, statt sie zu erfinden.
                </p>
                <div className="mt-4 space-y-1.5 w-full max-w-md">
                  {EXAMPLES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => send(e)}
                      className="kw-press block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-600 hover:border-cyan-300 hover:bg-cyan-50"
                    >
                      „{e}“
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cx('flex gap-2.5', m.role === 'user' ? 'justify-end' : '')}>
                  {m.role === 'model' ? (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-brand-500 text-white">
                      <Bot size={14} />
                    </span>
                  ) : null}
                  <div
                    className={cx(
                      'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-navy-950 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    )}
                  >
                    {m.text}
                    {m.local ? (
                      <span className="mt-1.5 block">
                        <Badge tone="amber">Lokale Analyse — KI-Backend nicht konfiguriert</Badge>
                      </span>
                    ) : null}
                  </div>
                  {m.role === 'user' ? (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                      <User size={14} />
                    </span>
                  ) : null}
                </div>
              ))
            )}
            {busy ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 size={14} className="animate-spin" /> Analysiere Anfrage und gleiche mit der
                Leistungsbibliothek ab …
              </div>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--kw-border)] p-3">
            <div className="flex items-end gap-2">
              <Textarea
                rows={2}
                className="!text-sm resize-none"
                placeholder="z. B. 850 m² Bürogebäude, 12 Büros, 2 Besprechungsräume, Küche, WC Damen/Herren, Treppenhaus …"
                value={input}
                disabled={busy || blocked}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
              <Button
                icon={busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                onClick={() => void send()}
                disabled={busy || blocked || input.trim().length === 0}
                aria-label="Senden"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">
              Enter = senden · Umschalt+Enter = neue Zeile · Anfragen werden protokolliert (Einstellungen → KI)
            </p>
          </div>
        </Card>

        {/* Live-Entwurf */}
        <Card padded={false} className="h-[640px] flex flex-col">
          <div className="px-5 pt-4 pb-2 border-b border-[color:var(--kw-border)]">
            <SectionTitle
              className="!mb-0"
              right={
                draft ? (
                  <span className="flex items-center gap-1.5">
                    <Badge tone={isLocalDraft ? 'amber' : 'blue'}>
                      {isLocalDraft ? 'Lokaler Entwurf' : 'KI-Kalkulationsentwurf'}
                    </Badge>
                  </span>
                ) : undefined
              }
            >
              Live-Kalkulationsentwurf
            </SectionTitle>
          </div>

          {!draft ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <HelpCircle size={28} className="text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">
                Der Entwurf erscheint hier, sobald Sie eine Anfrage gestellt haben — und aktualisiert sich mit jeder
                Antwort.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
                {/* Objekt */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <DraftFact label="Objektart" value={draft.object.type ?? '—'} />
                  <DraftFact
                    label="Fläche"
                    value={draft.object.total_area_sqm ? `${fmtNum(draft.object.total_area_sqm, 0)} m²` : 'unbekannt'}
                    missing={!draft.object.total_area_sqm}
                  />
                  <DraftFact label="Positionen" value={String(resolved.length)} />
                </div>

                {/* Leistungen je Bereich */}
                {(() => {
                  const groups = new Map<string, { idx: number; r: ResolvedDraftLine }[]>();
                  resolved.forEach((r, idx) => {
                    const list = groups.get(r.draft.area) ?? [];
                    list.push({ idx, r });
                    groups.set(r.draft.area, list);
                  });
                  return [...groups.entries()].map(([area, items]) => (
                    <div key={area}>
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-1">{area}</p>
                      <div className="space-y-1">
                        {items.map(({ idx, r }) => (
                          <div
                            key={idx}
                            className={cx(
                              'rounded-lg border px-2.5 py-1.5',
                              r.line ? 'border-slate-200 bg-white' : 'border-error-200 bg-error-50'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-3.5 w-3.5 accent-[#188a3c] shrink-0"
                                disabled={!r.line}
                                checked={r.line ? selection[idx] !== false : false}
                                onChange={(e) => setSelection((s) => ({ ...s, [idx]: e.target.checked }))}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-slate-800">
                                  {r.line?.serviceName ?? r.draft.service_name}
                                  {r.draft.room ? <span className="font-normal text-slate-400"> · {r.draft.room}</span> : null}
                                </span>
                                <span className="text-[10px] text-slate-500 kw-tnum">
                                  {r.line
                                    ? `${fmtNum(r.line.quantity, 1)} ${r.line.unit} · ${
                                        data.frequencies.find((f) => f.id === r.line!.frequencyId)?.name
                                      }`
                                    : 'nicht in der Bibliothek gefunden'}
                                </span>
                              </span>
                              <ConfidenceBadge value={r.confidence} />
                            </div>
                            {r.resolution.length > 0 ? (
                              <p className="mt-1 flex items-start gap-1 text-[10px] text-amber-700">
                                <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                                <span>{r.resolution.join(' · ')}</span>
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}

                {/* Fehlende Angaben & Rückfragen */}
                {draft.missing_information.length > 0 ? (
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-1">
                      Fehlende Angaben
                    </p>
                    <ul className="space-y-0.5">
                      {draft.missing_information.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                          <AlertTriangle size={11} className="mt-0.5 shrink-0" /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {draft.questions.length > 0 ? (
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-1">
                      Rückfragen — antworten Sie einfach im Chat
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {draft.questions.map((q, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setInput((v) => (v ? `${v}\n${q} ` : `${q} `))}
                          className="kw-press rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] text-cyan-800 hover:bg-cyan-100 text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {draft.assumptions.length > 0 ? (
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-1">Annahmen</p>
                    <ul className="space-y-0.5">
                      {draft.assumptions.map((a, i) => (
                        <li key={i} className="text-[11px] text-slate-500">
                          • {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[color:var(--kw-border)] p-3 flex flex-wrap items-center gap-2">
                <Button size="sm" icon={<Check size={13} />} onClick={() => acceptDraft(true)}>
                  Ausgewählte übernehmen ({resolved.filter((r, i) => r.line && selection[i] !== false).length})
                </Button>
                <Button size="sm" variant="outline" onClick={() => acceptDraft(false)}>
                  Alle übernehmen
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<RefreshCw size={13} />}
                  onClick={() => void send('Bitte analysiere die Anfrage noch einmal und verbessere den Entwurf.')}
                  disabled={busy || blocked}
                >
                  Erneut analysieren
                </Button>
                <Button size="sm" variant="ghost" icon={<X size={13} />} onClick={rejectDraft} className="!text-error-600">
                  Ablehnen
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function DraftFact({ label, value, missing }: { label: string; value: string; missing?: boolean }) {
  return (
    <div className={cx('rounded-lg border px-2.5 py-1.5', missing ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50')}>
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={cx('text-xs font-bold truncate', missing ? 'text-amber-700' : 'text-slate-800')}>{value}</p>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = value * 100;
  const tone = pct >= 80 ? 'green' : pct >= 55 ? 'amber' : 'red';
  return (
    <Badge tone={tone} title={`Konfidenz der KI: ${fmtPct(pct, 0)}`}>
      {fmtPct(pct, 0)}
    </Badge>
  );
}
