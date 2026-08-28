/** Kundenakte: Stammdaten, Kennzahlen, Objekte und Kalkulationen des Kunden. */

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { engineContext, useKwStore } from '../lib/store';
import { computeCalculation } from '../lib/engine';
import { fmtDate, fmtEur0, fmtPct } from '../lib/format';
import { Button, Card, ConfirmModal, EmptyState, KpiCard, SectionTitle } from '../components/ui';
import { StatusBadge } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';
import { CustomerFormModal, ObjectFormModal } from '../components/forms';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = useKwStore((st) => st.data);
  const deleteCustomer = useKwStore((st) => st.deleteCustomer);
  const createCalculation = useKwStore((st) => st.createCalculation);
  const [editOpen, setEditOpen] = useState(false);
  const [objectOpen, setObjectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const customer = data.customers.find((c) => c.id === id);

  const model = useMemo(() => {
    if (!customer) return null;
    const ctx = engineContext(data);
    const objects = data.objects.filter((o) => o.customerId === customer.id);
    const calcs = data.calculations
      .filter((k) => k.customerId === customer.id)
      .map((calc) => ({ calc, totals: computeCalculation(calc, ctx) }));
    const offers = calcs.filter(
      ({ calc }) => calc.status === 'angebot_erstellt' || calc.status === 'angebot_versendet'
    );
    const won = calcs.filter(({ calc }) => calc.status === 'gewonnen');
    const withHours = calcs.filter(({ totals }) => totals.monthlyHours > 0);
    return {
      objects,
      calcs,
      offerCount: offers.length,
      offerVolume: offers.reduce((s, { totals }) => s + totals.selected.net, 0),
      wonCount: won.length,
      revenue: won.reduce((s, { totals }) => s + totals.selected.net, 0),
      avgMargin:
        withHours.length > 0
          ? withHours.reduce((s, { totals }) => s + totals.selected.marginPct, 0) / withHours.length
          : null,
    };
  }, [customer, data]);

  if (!customer || !model) {
    return (
      <EmptyState
        title="Kunde nicht gefunden"
        action={<Button onClick={() => navigate(`${BASE}/kunden`)}>Zur Kundenliste</Button>}
      />
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        crumbs={[
          { label: 'KlarWerk Kalkulation', to: BASE },
          { label: 'Kunden', to: `${BASE}/kunden` },
          { label: customer.company },
        ]}
        title={customer.company}
        sub={`Kundennummer ${customer.number} · angelegt am ${fmtDate(customer.createdAt)}`}
        actions={
          <>
            <Button variant="outline" icon={<Pencil size={14} />} onClick={() => setEditOpen(true)}>
              Bearbeiten
            </Button>
            <Button variant="ghost" icon={<Trash2 size={14} />} onClick={() => setDeleteOpen(true)}>
              Löschen
            </Button>
            <Button
              icon={<Plus size={14} />}
              onClick={() => {
                const calc = createCalculation({
                  customerId: customer.id,
                  name: `${customer.company} – Neue Kalkulation`,
                });
                navigate(`${BASE}/kalkulationen/${calc.id}`);
              }}
            >
              Neue Kalkulation
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Objekte" value={model.objects.length} />
        <KpiCard label="Kalkulationen" value={model.calcs.length} />
        <KpiCard label="Offene Angebote" value={model.offerCount} />
        <KpiCard label="Angebotsvolumen" value={`${fmtEur0(model.offerVolume)}/M.`} />
        <KpiCard label="Aktive Verträge" value={model.wonCount} tone="green" />
        <KpiCard
          label="Umsatz / Ø Marge"
          value={fmtEur0(model.revenue)}
          sub={model.avgMargin != null ? `Ø Marge ${fmtPct(model.avgMargin, 1)}` : undefined}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Stammdaten */}
        <Card>
          <SectionTitle>Kontakt & Adresse</SectionTitle>
          <div className="space-y-2.5 text-sm">
            {customer.contactPerson ? (
              <p className="font-semibold text-slate-800">
                {customer.contactPerson}
                {customer.contactRole ? (
                  <span className="block text-xs font-normal text-slate-500">{customer.contactRole}</span>
                ) : null}
              </p>
            ) : null}
            {(customer.street || customer.city) && (
              <p className="flex items-start gap-2 text-slate-600">
                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                <span>
                  {customer.street}
                  {customer.street ? <br /> : null}
                  {customer.zip} {customer.city}
                  {customer.state ? <span className="block text-xs text-slate-400">{customer.state}</span> : null}
                </span>
              </p>
            )}
            {customer.phone ? (
              <p className="flex items-center gap-2 text-slate-600">
                <Phone size={14} className="shrink-0 text-slate-400" /> {customer.phone}
              </p>
            ) : null}
            {customer.email ? (
              <p className="flex items-center gap-2 text-slate-600">
                <Mail size={14} className="shrink-0 text-slate-400" />
                <a href={`mailto:${customer.email}`} className="text-cyan-700 hover:underline">
                  {customer.email}
                </a>
              </p>
            ) : null}
            {customer.billingAddress ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-3 mb-0.5">
                  Rechnungsadresse
                </p>
                <p className="text-xs text-slate-600 whitespace-pre-line">{customer.billingAddress}</p>
              </div>
            ) : null}
            {customer.notes ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-3 mb-0.5">Notizen</p>
                <p className="text-xs text-slate-600 whitespace-pre-line">{customer.notes}</p>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Objekte */}
        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle
              right={
                <Button size="sm" variant="outline" icon={<Plus size={12} />} onClick={() => setObjectOpen(true)}>
                  Objekt
                </Button>
              }
            >
              Objekte
            </SectionTitle>
          </div>
          {model.objects.length === 0 ? (
            <EmptyState
              icon={<Building2 size={28} />}
              title="Keine Objekte"
              description="Legen Sie das erste Objekt dieses Kunden an."
            />
          ) : (
            <div className="px-2 pb-3">
              {model.objects.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => navigate(`${BASE}/objekte/${o.id}`)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">{o.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {data.objectTypes.find((t) => t.id === o.objectTypeId)?.name ?? 'Objekt'} · {o.city ?? '—'}
                    </span>
                  </span>
                  <Building2 size={15} className="shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Kalkulationen */}
        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle>Kalkulationen & Angebote</SectionTitle>
          </div>
          {model.calcs.length === 0 ? (
            <EmptyState title="Noch keine Kalkulationen" />
          ) : (
            <div className="px-2 pb-3">
              {model.calcs.map(({ calc, totals }) => (
                <button
                  key={calc.id}
                  type="button"
                  onClick={() => navigate(`${BASE}/kalkulationen/${calc.id}`)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">{calc.name}</span>
                    <span className="text-[11px] text-slate-500 kw-tnum">
                      {calc.number} · {totals.monthlyHours > 0 ? `${fmtEur0(totals.selected.net)}/M.` : 'einmalig'}
                    </span>
                  </span>
                  <StatusBadge status={calc.status} />
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {editOpen ? <CustomerFormModal customer={customer} onClose={() => setEditOpen(false)} onSaved={() => setEditOpen(false)} /> : null}
      {objectOpen ? (
        <ObjectFormModal
          defaultCustomerId={customer.id}
          onClose={() => setObjectOpen(false)}
          onSaved={(objectId) => {
            setObjectOpen(false);
            navigate(`${BASE}/objekte/${objectId}`);
          }}
        />
      ) : null}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteCustomer(customer.id);
          navigate(`${BASE}/kunden`);
        }}
        title="Kunden löschen?"
        message={`„${customer.company}“ wird mit allen Objekten gelöscht. Kalkulationen bleiben erhalten, verlieren aber die Kundenzuordnung.`}
      />
    </div>
  );
}
