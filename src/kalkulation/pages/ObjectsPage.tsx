/** Objektverwaltung: Liste aller Objekte mit Struktur-Kennzahlen. */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { useKwStore } from '../lib/store';
import { fmtSqm } from '../lib/format';
import { Button, Card, EmptyState, TextInput } from '../components/ui';
import { BASE, PageHeader } from '../components/shell';
import { ObjectFormModal } from '../components/forms';

export default function ObjectsPage() {
  const data = useKwStore((st) => st.data);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.objects
      .filter((o) => {
        const customer = data.customers.find((c) => c.id === o.customerId);
        return !q || `${o.name} ${o.city ?? ''} ${customer?.company ?? ''}`.toLowerCase().includes(q);
      })
      .map((object) => {
        const rooms = object.buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms));
        return {
          object,
          customer: data.customers.find((c) => c.id === object.customerId),
          type: data.objectTypes.find((t) => t.id === object.objectTypeId),
          roomCount: rooms.length,
          totalArea: rooms.reduce((s, r) => s + r.areaSqm, 0),
          calcCount: data.calculations.filter((k) => k.objectId === object.id).length,
        };
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name, 'de'));
  }, [data, query]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Objekte' }]}
        title="Objekte"
        sub={`${data.objects.length} Objekte im Bestand`}
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
            Neues Objekt
          </Button>
        }
      />

      <div className="mb-3 max-w-sm">
        <TextInput placeholder="Objekte suchen …" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Card padded={false}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Building2 size={32} />}
            title={query ? 'Keine Treffer' : 'Noch keine Objekte'}
            description={
              query
                ? 'Passen Sie die Suche an.'
                : 'Objekte bilden Gebäude, Etagen und Räume ab — die Grundlage jeder Profi-Kalkulation.'
            }
            action={!query ? <Button onClick={() => setCreateOpen(true)}>Neues Objekt</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="kw-table">
              <thead>
                <tr>
                  <th>Objekt</th>
                  <th>Kunde</th>
                  <th>Objektart</th>
                  <th>Ort</th>
                  <th className="!text-right">Räume</th>
                  <th className="!text-right">Fläche</th>
                  <th className="!text-right">Kalkulationen</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.object.id} className="cursor-pointer" onClick={() => navigate(`${BASE}/objekte/${r.object.id}`)}>
                    <td className="font-semibold text-slate-800">{r.object.name}</td>
                    <td className="text-slate-600">{r.customer?.company ?? '—'}</td>
                    <td className="text-slate-600">{r.type?.name ?? '—'}</td>
                    <td className="text-slate-600">{r.object.city ?? '—'}</td>
                    <td className="text-right kw-tnum">{r.roomCount}</td>
                    <td className="text-right kw-tnum">{r.totalArea > 0 ? fmtSqm(r.totalArea) : '—'}</td>
                    <td className="text-right kw-tnum">{r.calcCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {createOpen ? (
        <ObjectFormModal
          onClose={() => setCreateOpen(false)}
          onSaved={(id) => {
            setCreateOpen(false);
            navigate(`${BASE}/objekte/${id}`);
          }}
        />
      ) : null}
    </div>
  );
}
