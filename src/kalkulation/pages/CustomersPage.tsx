/** Kundenverwaltung: Liste mit Kennzahlen + Anlage neuer Kunden. */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { engineContext, useKwStore } from '../lib/store';
import { computeCalculation } from '../lib/engine';
import { fmtEur0, fmtPct } from '../lib/format';
import { Button, Card, EmptyState, TextInput } from '../components/ui';
import { BASE, PageHeader } from '../components/shell';
import { CustomerFormModal } from '../components/forms';

export default function CustomersPage() {
  const data = useKwStore((st) => st.data);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const rows = useMemo(() => {
    const ctx = engineContext(data);
    const q = query.trim().toLowerCase();
    return data.customers
      .filter((c) => !q || `${c.company} ${c.number} ${c.city ?? ''} ${c.contactPerson ?? ''}`.toLowerCase().includes(q))
      .map((customer) => {
        const objects = data.objects.filter((o) => o.customerId === customer.id);
        const calcs = data.calculations.filter((k) => k.customerId === customer.id);
        const totals = calcs.map((k) => computeCalculation(k, ctx));
        const offers = calcs.filter((k) => k.status === 'angebot_erstellt' || k.status === 'angebot_versendet');
        const won = calcs
          .map((k, i) => ({ k, t: totals[i] }))
          .filter(({ k }) => k.status === 'gewonnen');
        const withHours = totals.filter((t) => t.monthlyHours > 0);
        const avgMargin =
          withHours.length > 0 ? withHours.reduce((s, t) => s + t.selected.marginPct, 0) / withHours.length : null;
        return {
          customer,
          objectCount: objects.length,
          calcCount: calcs.length,
          offerCount: offers.length,
          offerVolume: offers.reduce((s, k) => {
            const idx = calcs.indexOf(k);
            return s + totals[idx].selected.net;
          }, 0),
          revenue: won.reduce((s, { t }) => s + t.selected.net, 0),
          activeContracts: won.length,
          avgMargin,
        };
      })
      .sort((a, b) => a.customer.company.localeCompare(b.customer.company, 'de'));
  }, [data, query]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Kunden' }]}
        title="Kunden"
        sub={`${data.customers.length} Kunden im Bestand`}
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
            Neuer Kunde
          </Button>
        }
      />

      <div className="mb-3 max-w-sm">
        <TextInput
          placeholder="Kunden suchen …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card padded={false}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title={query ? 'Keine Treffer' : 'Noch keine Kunden'}
            description={query ? 'Passen Sie die Suche an.' : 'Legen Sie Ihren ersten Kunden an, um Objekte und Kalkulationen zuzuordnen.'}
            action={!query ? <Button onClick={() => setCreateOpen(true)}>Neuer Kunde</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="kw-table">
              <thead>
                <tr>
                  <th>Kunde</th>
                  <th>Ort</th>
                  <th className="!text-right">Objekte</th>
                  <th className="!text-right">Angebote</th>
                  <th className="!text-right">Angebotsvolumen</th>
                  <th className="!text-right">Aktive Verträge</th>
                  <th className="!text-right">Umsatz/Monat</th>
                  <th className="!text-right">Ø Marge</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.customer.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`${BASE}/kunden/${r.customer.id}`)}
                  >
                    <td>
                      <span className="block font-semibold text-slate-800">{r.customer.company}</span>
                      <span className="text-[10px] text-slate-400">
                        {r.customer.number}
                        {r.customer.contactPerson ? ` · ${r.customer.contactPerson}` : ''}
                      </span>
                    </td>
                    <td className="text-slate-600">{r.customer.city ?? '—'}</td>
                    <td className="text-right kw-tnum">{r.objectCount}</td>
                    <td className="text-right kw-tnum">{r.offerCount}</td>
                    <td className="text-right kw-tnum">{r.offerVolume > 0 ? `${fmtEur0(r.offerVolume)}/M.` : '—'}</td>
                    <td className="text-right kw-tnum">{r.activeContracts}</td>
                    <td className="text-right kw-tnum font-semibold text-slate-800">
                      {r.revenue > 0 ? fmtEur0(r.revenue) : '—'}
                    </td>
                    <td className="text-right kw-tnum">
                      {r.avgMargin != null ? fmtPct(r.avgMargin, 1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {createOpen ? (
        <CustomerFormModal
          onClose={() => setCreateOpen(false)}
          onSaved={(id) => {
            setCreateOpen(false);
            navigate(`${BASE}/kunden/${id}`);
          }}
        />
      ) : null}
    </div>
  );
}
