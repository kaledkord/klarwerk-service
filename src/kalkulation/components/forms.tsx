/** Formular-Modale für Kunden, Objekte und Räume. */

import { useState } from 'react';
import type { CleaningObject, Customer, FactorSelection, Room } from '../lib/types';
import { FACTOR_GROUP_LABELS, NEUTRAL_FACTORS } from '../lib/types';
import { FACTOR_GROUP_ORDER } from '../lib/engine';
import { useKwStore } from '../lib/store';
import { uid } from '../lib/id';
import { Button, FieldLabel, Modal, NumberInput, Select, Textarea, TextInput, toast } from './ui';

// ─────────────────────────────────────────────────────────────────────────────
// Kunde
// ─────────────────────────────────────────────────────────────────────────────

export function CustomerFormModal({
  customer,
  onClose,
  onSaved,
}: {
  customer?: Customer;
  onClose: () => void;
  onSaved?: (id: string) => void;
}) {
  const addCustomer = useKwStore((st) => st.addCustomer);
  const updateCustomer = useKwStore((st) => st.updateCustomer);
  const [form, setForm] = useState({
    company: customer?.company ?? '',
    contactPerson: customer?.contactPerson ?? '',
    contactRole: customer?.contactRole ?? '',
    street: customer?.street ?? '',
    zip: customer?.zip ?? '',
    city: customer?.city ?? '',
    state: customer?.state ?? 'Schleswig-Holstein',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    billingAddress: customer?.billingAddress ?? '',
    notes: customer?.notes ?? '',
  });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = () => {
    if (!form.company.trim()) {
      toast('Bitte einen Firmennamen angeben.', 'error');
      return;
    }
    if (customer) {
      updateCustomer(customer.id, (c) => Object.assign(c, form));
      toast('Kunde gespeichert.');
      onSaved?.(customer.id);
    } else {
      const created = addCustomer(form);
      toast(`Kunde ${created.number} angelegt.`);
      onSaved?.(created.id);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={customer ? 'Kunde bearbeiten' : 'Neuen Kunden anlegen'}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={save}>{customer ? 'Speichern' : 'Kunde anlegen'}</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Firmenname *</FieldLabel>
          <TextInput value={form.company} onChange={set('company')} placeholder="z. B. Muster GmbH" autoFocus />
        </div>
        <div>
          <FieldLabel>Ansprechpartner</FieldLabel>
          <TextInput value={form.contactPerson} onChange={set('contactPerson')} />
        </div>
        <div>
          <FieldLabel>Position</FieldLabel>
          <TextInput value={form.contactRole} onChange={set('contactRole')} placeholder="z. B. Geschäftsführung" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Straße</FieldLabel>
          <TextInput value={form.street} onChange={set('street')} />
        </div>
        <div>
          <FieldLabel>PLZ</FieldLabel>
          <TextInput value={form.zip} onChange={set('zip')} />
        </div>
        <div>
          <FieldLabel>Ort</FieldLabel>
          <TextInput value={form.city} onChange={set('city')} />
        </div>
        <div>
          <FieldLabel>Bundesland</FieldLabel>
          <TextInput value={form.state} onChange={set('state')} />
        </div>
        <div>
          <FieldLabel>Telefon</FieldLabel>
          <TextInput value={form.phone} onChange={set('phone')} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>E-Mail</FieldLabel>
          <TextInput type="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel hint="(falls abweichend)">Rechnungsadresse</FieldLabel>
          <Textarea rows={2} value={form.billingAddress} onChange={set('billingAddress')} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Notizen</FieldLabel>
          <Textarea rows={2} value={form.notes} onChange={set('notes')} />
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Objekt
// ─────────────────────────────────────────────────────────────────────────────

export function ObjectFormModal({
  object,
  defaultCustomerId,
  onClose,
  onSaved,
}: {
  object?: CleaningObject;
  defaultCustomerId?: string;
  onClose: () => void;
  onSaved?: (id: string) => void;
}) {
  const data = useKwStore((st) => st.data);
  const addObject = useKwStore((st) => st.addObject);
  const updateObject = useKwStore((st) => st.updateObject);
  const addObjectType = useKwStore((st) => st.addObjectType);

  const [form, setForm] = useState({
    name: object?.name ?? '',
    customerId: object?.customerId ?? defaultCustomerId ?? data.customers[0]?.id ?? '',
    objectTypeId: object?.objectTypeId ?? data.objectTypes[0]?.id ?? '',
    street: object?.street ?? '',
    zip: object?.zip ?? '',
    city: object?.city ?? '',
    contactOnSite: object?.contactOnSite ?? '',
    contactPhone: object?.contactPhone ?? '',
    openingHours: object?.openingHours ?? '',
    accessNotes: object?.accessNotes ?? '',
    serviceStart: object?.serviceStart ?? '',
    contractTerm: object?.contractTerm ?? '',
    noticePeriod: object?.noticePeriod ?? '',
    notes: object?.notes ?? '',
  });
  const [distanceKm, setDistanceKm] = useState<number | null>(object?.distanceKm ?? null);
  const [newType, setNewType] = useState('');

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = () => {
    if (!form.name.trim()) {
      toast('Bitte einen Objektnamen angeben.', 'error');
      return;
    }
    if (!form.customerId) {
      toast('Bitte einen Kunden auswählen (ggf. zuerst anlegen).', 'error');
      return;
    }
    const payload = { ...form, distanceKm: distanceKm ?? undefined };
    if (object) {
      updateObject(object.id, (o) => Object.assign(o, payload));
      toast('Objekt gespeichert.');
      onSaved?.(object.id);
    } else {
      const created = addObject({ ...payload, buildings: [] });
      toast('Objekt angelegt.');
      onSaved?.(created.id);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={object ? 'Objekt bearbeiten' : 'Neues Objekt anlegen'}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={save}>{object ? 'Speichern' : 'Objekt anlegen'}</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Objektname *</FieldLabel>
          <TextInput value={form.name} onChange={set('name')} placeholder="z. B. Büro Kiel" autoFocus />
        </div>
        <div>
          <FieldLabel>Kunde *</FieldLabel>
          <Select value={form.customerId} onChange={set('customerId')}>
            {data.customers.length === 0 ? <option value="">— Kein Kunde vorhanden —</option> : null}
            {data.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Objektart</FieldLabel>
          <Select value={form.objectTypeId} onChange={set('objectTypeId')}>
            {data.objectTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          <div className="mt-1.5 flex gap-1.5">
            <TextInput
              className="!py-1 !text-xs"
              placeholder="Eigene Objektart …"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!newType.trim()) return;
                const t = addObjectType(newType.trim());
                setForm((f) => ({ ...f, objectTypeId: t.id }));
                setNewType('');
              }}
            >
              +
            </Button>
          </div>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Straße</FieldLabel>
          <TextInput value={form.street} onChange={set('street')} />
        </div>
        <div>
          <FieldLabel>PLZ</FieldLabel>
          <TextInput value={form.zip} onChange={set('zip')} />
        </div>
        <div>
          <FieldLabel>Ort</FieldLabel>
          <TextInput value={form.city} onChange={set('city')} />
        </div>
        <div>
          <FieldLabel>Ansprechpartner vor Ort</FieldLabel>
          <TextInput value={form.contactOnSite} onChange={set('contactOnSite')} />
        </div>
        <div>
          <FieldLabel>Telefon vor Ort</FieldLabel>
          <TextInput value={form.contactPhone} onChange={set('contactPhone')} />
        </div>
        <div>
          <FieldLabel>Öffnungszeiten</FieldLabel>
          <TextInput value={form.openingHours} onChange={set('openingHours')} placeholder="z. B. Mo–Fr 08–18 Uhr" />
        </div>
        <div>
          <FieldLabel>Entfernung vom Firmensitz</FieldLabel>
          <NumberInput value={distanceKm} onChange={setDistanceKm} decimals={1} min={0} suffix="km" alignRight={false} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Zugangszeiten / Zugang</FieldLabel>
          <TextInput value={form.accessNotes} onChange={set('accessNotes')} placeholder="z. B. Reinigung ab 19 Uhr, Schlüssel vorhanden" />
        </div>
        <div>
          <FieldLabel>Gewünschter Leistungsbeginn</FieldLabel>
          <TextInput type="date" value={form.serviceStart} onChange={set('serviceStart')} />
        </div>
        <div>
          <FieldLabel>Vertragslaufzeit</FieldLabel>
          <TextInput value={form.contractTerm} onChange={set('contractTerm')} placeholder="z. B. unbefristet" />
        </div>
        <div>
          <FieldLabel>Kündigungsfrist</FieldLabel>
          <TextInput value={form.noticePeriod} onChange={set('noticePeriod')} placeholder="z. B. 3 Monate" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Notizen</FieldLabel>
          <Textarea rows={2} value={form.notes} onChange={set('notes')} />
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Raum
// ─────────────────────────────────────────────────────────────────────────────

export function RoomFormModal({
  room,
  onClose,
  onSave,
}: {
  room?: Room;
  onClose: () => void;
  onSave: (room: Room) => void;
}) {
  const data = useKwStore((st) => st.data);
  const factorConfig = data.settings.performanceFactors;
  const [form, setForm] = useState({
    name: room?.name ?? '',
    roomTypeId: room?.roomTypeId ?? '',
    areaLabel: room?.areaLabel ?? '',
    floorType: room?.floorType ?? '',
    notes: room?.notes ?? '',
  });
  const [areaSqm, setAreaSqm] = useState<number | null>(room?.areaSqm ?? null);
  const [lengthM, setLengthM] = useState<number | null>(room?.lengthM ?? null);
  const [widthM, setWidthM] = useState<number | null>(room?.widthM ?? null);
  const [heightM, setHeightM] = useState<number | null>(room?.heightM ?? null);
  const [factors, setFactors] = useState<FactorSelection>(room?.factors ?? { ...NEUTRAL_FACTORS });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const derivedArea = lengthM != null && widthM != null ? lengthM * widthM : null;

  return (
    <Modal
      open
      onClose={onClose}
      title={room ? 'Raum bearbeiten' : 'Raum hinzufügen'}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              if (!form.name.trim()) {
                toast('Bitte einen Raumnamen angeben.', 'error');
                return;
              }
              const area = areaSqm ?? derivedArea ?? 0;
              onSave({
                id: room?.id ?? uid('rm'),
                name: form.name.trim(),
                roomTypeId: form.roomTypeId || undefined,
                areaLabel: form.areaLabel.trim() || undefined,
                areaSqm: area,
                lengthM: lengthM ?? undefined,
                widthM: widthM ?? undefined,
                heightM: heightM ?? undefined,
                floorType: form.floorType || undefined,
                factors,
                notes: form.notes.trim() || undefined,
              });
            }}
          >
            {room ? 'Speichern' : 'Raum hinzufügen'}
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Raumname *</FieldLabel>
          <TextInput value={form.name} onChange={set('name')} placeholder="z. B. Büro 1" autoFocus />
        </div>
        <div>
          <FieldLabel>Raumtyp</FieldLabel>
          <Select value={form.roomTypeId} onChange={set('roomTypeId')}>
            <option value="">—</option>
            {data.roomTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel hint="(zur Gruppierung in Kalkulation & Angebot)">Bereich</FieldLabel>
          <TextInput value={form.areaLabel} onChange={set('areaLabel')} placeholder="z. B. Bürobereich" />
        </div>
        <div>
          <FieldLabel>Bodenart</FieldLabel>
          <Select value={form.floorType} onChange={set('floorType')}>
            <option value="">—</option>
            {data.settings.floorTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Fläche</FieldLabel>
          <NumberInput
            value={areaSqm}
            onChange={setAreaSqm}
            decimals={1}
            min={0}
            suffix="m²"
            placeholder={derivedArea != null ? `${derivedArea.toLocaleString('de-DE')} (aus L × B)` : undefined}
            alignRight={false}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <FieldLabel hint="opt.">Länge</FieldLabel>
            <NumberInput value={lengthM} onChange={setLengthM} decimals={2} min={0} suffix="m" alignRight={false} />
          </div>
          <div>
            <FieldLabel hint="opt.">Breite</FieldLabel>
            <NumberInput value={widthM} onChange={setWidthM} decimals={2} min={0} suffix="m" alignRight={false} />
          </div>
          <div>
            <FieldLabel hint="opt.">Höhe</FieldLabel>
            <NumberInput value={heightM} onChange={setHeightM} decimals={2} min={0} suffix="m" alignRight={false} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Anpassungsfaktoren (beeinflussen die Leistungswerte)</FieldLabel>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FACTOR_GROUP_ORDER.map((group) => (
              <div key={group}>
                <span className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  {FACTOR_GROUP_LABELS[group]}
                </span>
                <Select
                  className="!py-1.5 !text-xs"
                  value={factors[group]}
                  onChange={(e) => setFactors((f) => ({ ...f, [group]: e.target.value }))}
                >
                  {factorConfig[group].map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                      {o.multiplier !== 1
                        ? ` (${o.multiplier > 1 ? '+' : ''}${Math.round((o.multiplier - 1) * 100)} %)`
                        : ''}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Besonderheiten / Notizen</FieldLabel>
          <Textarea rows={2} value={form.notes} onChange={set('notes')} />
        </div>
      </div>
    </Modal>
  );
}
