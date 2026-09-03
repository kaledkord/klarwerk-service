/**
 * Objektakte: Grunddaten, Vertragsdaten und der Struktur-Editor
 * (Gebäude → Etage → Raum) mit allen Raumdetails.
 */

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Building, Floor, Room } from '../lib/types';
import { useKwStore } from '../lib/store';
import { uid } from '../lib/id';
import { fmtSqm } from '../lib/format';
import { Badge, Button, Card, ConfirmModal, EmptyState, KpiCard, SectionTitle, TextInput, toast } from '../components/ui';
import { StatusBadge } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';
import { ObjectFormModal, RoomFormModal } from '../components/forms';

export default function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = useKwStore((st) => st.data);
  const updateObject = useKwStore((st) => st.updateObject);
  const deleteObject = useKwStore((st) => st.deleteObject);
  const createCalculation = useKwStore((st) => st.createCalculation);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [roomModal, setRoomModal] = useState<{
    buildingId: string;
    floorId: string;
    room?: Room;
  } | null>(null);

  const object = data.objects.find((o) => o.id === id);
  const customer = data.customers.find((c) => c.id === object?.customerId);
  const objectType = data.objectTypes.find((t) => t.id === object?.objectTypeId);

  const stats = useMemo(() => {
    if (!object) return null;
    const rooms = object.buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms));
    return {
      buildings: object.buildings.length,
      floors: object.buildings.reduce((s, b) => s + b.floors.length, 0),
      rooms: rooms.length,
      area: rooms.reduce((s, r) => s + r.areaSqm, 0),
      calcs: data.calculations.filter((k) => k.objectId === object.id),
    };
  }, [object, data.calculations]);

  if (!object || !stats) {
    return (
      <EmptyState
        title="Objekt nicht gefunden"
        action={<Button onClick={() => navigate(`${BASE}/objekte`)}>Zur Objektliste</Button>}
      />
    );
  }

  const addBuilding = () => {
    updateObject(object.id, (o) => {
      o.buildings.push({
        id: uid('bld'),
        name: o.buildings.length === 0 ? 'Gebäude A' : `Gebäude ${String.fromCharCode(65 + o.buildings.length)}`,
        floors: [],
      });
    });
  };

  const addFloor = (buildingId: string) => {
    updateObject(object.id, (o) => {
      const b = o.buildings.find((x) => x.id === buildingId);
      if (!b) return;
      const names = ['Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss', '3. Obergeschoss'];
      b.floors.push({ id: uid('fl'), name: names[b.floors.length] ?? `Etage ${b.floors.length + 1}`, rooms: [] });
    });
  };

  const saveRoom = (buildingId: string, floorId: string, room: Room) => {
    updateObject(object.id, (o) => {
      const floor = o.buildings.find((b) => b.id === buildingId)?.floors.find((f) => f.id === floorId);
      if (!floor) return;
      const idx = floor.rooms.findIndex((r) => r.id === room.id);
      if (idx >= 0) floor.rooms[idx] = room;
      else floor.rooms.push(room);
    });
    setRoomModal(null);
    toast('Raum gespeichert.');
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        crumbs={[
          { label: 'KlarWerk Kalkulation', to: BASE },
          { label: 'Objekte', to: `${BASE}/objekte` },
          { label: object.name },
        ]}
        title={object.name}
        sub={
          <>
            {objectType?.name ?? 'Objekt'} ·{' '}
            {customer ? (
              <button
                type="button"
                className="text-cyan-700 hover:underline"
                onClick={() => navigate(`${BASE}/kunden/${customer.id}`)}
              >
                {customer.company}
              </button>
            ) : (
              'ohne Kunde'
            )}
            {object.city ? ` · ${object.zip ?? ''} ${object.city}` : ''}
          </>
        }
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
                  customerId: object.customerId,
                  objectId: object.id,
                  name: `${object.name} – Unterhaltsreinigung`,
                  travel: {
                    enabled: true,
                    distanceKm: object.distanceKm ?? 0,
                    tripsPerMonth: null,
                    payTravelTime: data.settings.travel.payTravelTimeDefault,
                  },
                });
                navigate(`${BASE}/kalkulationen/${calc.id}`);
              }}
            >
              Kalkulation starten
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Gebäude / Etagen" value={`${stats.buildings} / ${stats.floors}`} icon={<Building2 size={15} />} />
        <KpiCard label="Räume" value={stats.rooms} icon={<Layers size={15} />} />
        <KpiCard label="Gesamtfläche" value={fmtSqm(stats.area)} />
        <KpiCard label="Entfernung" value={object.distanceKm != null ? `${object.distanceKm} km` : '—'} sub="vom Firmensitz" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Struktur-Editor */}
        <Card className="lg:col-span-2" padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle
              right={
                <Button size="sm" variant="outline" icon={<Plus size={12} />} onClick={addBuilding}>
                  Gebäude
                </Button>
              }
            >
              Objektstruktur
            </SectionTitle>
          </div>

          {object.buildings.length === 0 ? (
            <EmptyState
              icon={<Building2 size={30} />}
              title="Noch keine Struktur angelegt"
              description="Legen Sie Gebäude, Etagen und Räume an — jede Raumangabe fließt direkt in die Kalkulation."
              action={<Button onClick={addBuilding}>Erstes Gebäude anlegen</Button>}
            />
          ) : (
            <div className="px-4 pb-4 space-y-3">
              {object.buildings.map((building) => (
                <BuildingBlock
                  key={building.id}
                  objectId={object.id}
                  building={building}
                  collapsed={collapsed}
                  toggle={(key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }))}
                  onAddFloor={() => addFloor(building.id)}
                  onAddRoom={(floorId) => setRoomModal({ buildingId: building.id, floorId })}
                  onEditRoom={(floorId, room) => setRoomModal({ buildingId: building.id, floorId, room })}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Details & Kalkulationen */}
        <div className="space-y-4">
          <Card>
            <SectionTitle>Objektdaten</SectionTitle>
            <dl className="space-y-2 text-xs">
              {[
                ['Ansprechpartner vor Ort', object.contactOnSite],
                ['Telefon vor Ort', object.contactPhone],
                ['Öffnungszeiten', object.openingHours],
                ['Zugang', object.accessNotes],
                ['Leistungsbeginn', object.serviceStart],
                ['Vertragslaufzeit', object.contractTerm],
                ['Kündigungsfrist', object.noticePeriod],
                ['Notizen', object.notes],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
                    <dd className="text-slate-700 whitespace-pre-line">{value}</dd>
                  </div>
                ))}
            </dl>
            {[object.contactOnSite, object.openingHours, object.accessNotes, object.serviceStart].every((v) => !v) ? (
              <p className="text-xs text-slate-400">Noch keine Detailangaben — über „Bearbeiten“ ergänzen.</p>
            ) : null}
          </Card>

          <Card padded={false}>
            <div className="px-5 pt-4">
              <SectionTitle>Kalkulationen zu diesem Objekt</SectionTitle>
            </div>
            {stats.calcs.length === 0 ? (
              <EmptyState title="Noch keine Kalkulationen" />
            ) : (
              <div className="px-2 pb-3">
                {stats.calcs.map((calc) => (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => navigate(`${BASE}/kalkulationen/${calc.id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">{calc.name}</span>
                      <span className="text-[11px] text-slate-500">{calc.number}</span>
                    </span>
                    <StatusBadge status={calc.status} />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {editOpen ? <ObjectFormModal object={object} onClose={() => setEditOpen(false)} onSaved={() => setEditOpen(false)} /> : null}
      {roomModal ? (
        <RoomFormModal
          room={roomModal.room}
          onClose={() => setRoomModal(null)}
          onSave={(room) => saveRoom(roomModal.buildingId, roomModal.floorId, room)}
        />
      ) : null}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteObject(object.id);
          navigate(`${BASE}/objekte`);
        }}
        title="Objekt löschen?"
        message={`„${object.name}“ wird gelöscht. Kalkulationen bleiben erhalten, verlieren aber die Objektzuordnung.`}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Strukturblöcke
// ─────────────────────────────────────────────────────────────────────────────

function BuildingBlock({
  objectId,
  building,
  collapsed,
  toggle,
  onAddFloor,
  onAddRoom,
  onEditRoom,
}: {
  objectId: string;
  building: Building;
  collapsed: Record<string, boolean>;
  toggle: (key: string) => void;
  onAddFloor: () => void;
  onAddRoom: (floorId: string) => void;
  onEditRoom: (floorId: string, room: Room) => void;
}) {
  const updateObject = useKwStore((st) => st.updateObject);
  const roomTypes = useKwStore((st) => st.data.roomTypes);
  const isCollapsed = collapsed[building.id];
  const area = building.floors.reduce((s, f) => s + f.rooms.reduce((x, r) => x + r.areaSqm, 0), 0);

  return (
    <div className="rounded-lg border border-[color:var(--kw-border)]">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-t-lg">
        <button type="button" onClick={() => toggle(building.id)} className="text-slate-400 hover:text-slate-700">
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>
        <EditableName
          value={building.name}
          onChange={(name) =>
            updateObject(objectId, (o) => {
              const b = o.buildings.find((x) => x.id === building.id);
              if (b) b.name = name;
            })
          }
          className="font-bold text-sm text-slate-800"
        />
        <span className="text-[11px] text-slate-400 kw-tnum">{fmtSqm(area)}</span>
        <span className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" icon={<Plus size={12} />} onClick={onAddFloor}>
            Etage
          </Button>
          <button
            type="button"
            className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
            title="Gebäude löschen"
            onClick={() =>
              updateObject(objectId, (o) => {
                o.buildings = o.buildings.filter((x) => x.id !== building.id);
              })
            }
          >
            <Trash2 size={13} />
          </button>
        </span>
      </div>

      {!isCollapsed ? (
        <div className="p-3 space-y-3">
          {building.floors.length === 0 ? (
            <p className="text-xs text-slate-400 px-1">Noch keine Etagen — über „+ Etage“ hinzufügen.</p>
          ) : (
            building.floors.map((floor) => (
              <FloorBlock
                key={floor.id}
                objectId={objectId}
                buildingId={building.id}
                floor={floor}
                roomTypes={roomTypes}
                onAddRoom={() => onAddRoom(floor.id)}
                onEditRoom={(room) => onEditRoom(floor.id, room)}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function FloorBlock({
  objectId,
  buildingId,
  floor,
  roomTypes,
  onAddRoom,
  onEditRoom,
}: {
  objectId: string;
  buildingId: string;
  floor: Floor;
  roomTypes: { id: string; name: string }[];
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
}) {
  const updateObject = useKwStore((st) => st.updateObject);
  const area = floor.rooms.reduce((s, r) => s + r.areaSqm, 0);

  return (
    <div className="rounded-lg border border-slate-200/80">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-100">
        <Layers size={13} className="text-slate-400" />
        <EditableName
          value={floor.name}
          onChange={(name) =>
            updateObject(objectId, (o) => {
              const f = o.buildings.find((b) => b.id === buildingId)?.floors.find((x) => x.id === floor.id);
              if (f) f.name = name;
            })
          }
          className="text-xs font-bold text-slate-700"
        />
        <span className="text-[10px] text-slate-400 kw-tnum">{fmtSqm(area)}</span>
        <span className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" icon={<Plus size={12} />} onClick={onAddRoom}>
            Raum
          </Button>
          <button
            type="button"
            className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
            title="Etage löschen"
            onClick={() =>
              updateObject(objectId, (o) => {
                const b = o.buildings.find((x) => x.id === buildingId);
                if (b) b.floors = b.floors.filter((x) => x.id !== floor.id);
              })
            }
          >
            <Trash2 size={12} />
          </button>
        </span>
      </div>
      {floor.rooms.length === 0 ? (
        <p className="px-3 py-2 text-[11px] text-slate-400">Keine Räume.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {floor.rooms.map((room) => (
            <div key={room.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <button type="button" onClick={() => onEditRoom(room)} className="flex-1 min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-800">{room.name}</span>
                <span className="ml-2 text-[10px] text-slate-400">
                  {roomTypes.find((t) => t.id === room.roomTypeId)?.name ?? ''}
                  {room.floorType ? ` · ${room.floorType}` : ''}
                </span>
              </button>
              {room.areaLabel ? <Badge tone="outline">{room.areaLabel}</Badge> : null}
              <span className="w-20 text-right text-xs text-slate-600 kw-tnum">{fmtSqm(room.areaSqm)}</span>
              <button
                type="button"
                className="kw-press rounded p-1 text-slate-300 hover:text-slate-600"
                title="Raum bearbeiten"
                onClick={() => onEditRoom(room)}
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                className="kw-press rounded p-1 text-slate-300 hover:text-error-600"
                title="Raum löschen"
                onClick={() =>
                  updateObject(objectId, (o) => {
                    const f = o.buildings.find((b) => b.id === buildingId)?.floors.find((x) => x.id === floor.id);
                    if (f) f.rooms = f.rooms.filter((r) => r.id !== room.id);
                  })
                }
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditableName({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (!editing) {
    return (
      <button
        type="button"
        className={`${className ?? ''} hover:underline decoration-dotted underline-offset-2 text-left`}
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        title="Umbenennen"
      >
        {value}
      </button>
    );
  }
  return (
    <TextInput
      className="!py-0.5 !px-1.5 !text-xs !w-44"
      value={draft}
      autoFocus
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (draft.trim() && draft !== value) onChange(draft.trim());
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        if (e.key === 'Escape') {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  );
}
