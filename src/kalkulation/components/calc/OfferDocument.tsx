/**
 * Kundenangebot als Dokument — gemeinsam genutzt von Vorschau und Druck.
 * WICHTIG: Zeigt den Turnus JEDER einzelnen Leistung. Interne Kosten,
 * Stunden und Margen erscheinen hier NICHT.
 */

import type { Calculation, CleaningObject, Customer, OfferConfig } from '../../lib/types';
import { useKwStore } from '../../lib/store';
import type { CalcTotals } from '../../lib/engine';
import { fmtDate, fmtEur, fmtNum } from '../../lib/format';

export function OfferDocument({
  calc,
  totals,
  offer,
  customer,
  object,
}: {
  calc: Calculation;
  totals: CalcTotals;
  offer: OfferConfig;
  customer?: Customer;
  object?: CleaningObject;
}) {
  const data = useKwStore((st) => st.data);
  const company = data.settings.company;
  const freqName = (id: string) => data.frequencies.find((f) => f.id === id)?.name ?? '—';

  const visibleLines = calc.lines
    .filter((l) => !offer.lineOverrides[l.id]?.hidden)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const recurringLines = visibleLines.filter((l) => {
    const r = totals.lines.find((x) => x.lineId === l.id);
    return r?.recurring;
  });
  const oneTimeLines = visibleLines.filter((l) => {
    const r = totals.lines.find((x) => x.lineId === l.id);
    return r?.oneTime;
  });
  const onDemandLines = visibleLines.filter((l) => {
    const r = totals.lines.find((x) => x.lineId === l.id);
    return r?.onDemand;
  });

  const groups: { area: string; lines: typeof visibleLines }[] = [];
  for (const line of recurringLines) {
    let g = groups.find((x) => x.area === line.areaLabel);
    if (!g) {
      g = { area: line.areaLabel, lines: [] };
      groups.push(g);
    }
    g.lines.push(line);
  }

  const displayName = (l: (typeof visibleLines)[number]) =>
    offer.lineOverrides[l.id]?.displayName || l.serviceName;

  const salutation = customer?.contactPerson
    ? `Guten Tag ${customer.contactPerson},`
    : 'Sehr geehrte Damen und Herren,';

  return (
    <div className="kw-print-page">
      {/* Kopf */}
      <div className="flex items-start justify-between gap-6 border-b-2 pb-4" style={{ borderColor: '#21a74a' }}>
        <div className="text-[8.5pt] leading-snug" style={{ color: '#5b6b7b' }}>
          <p className="font-bold" style={{ color: '#0f1827' }}>
            {company.name}
          </p>
          <p>{company.street}</p>
          <p>
            {company.zip} {company.city}
          </p>
          <p className="mt-1.5">{company.phone}</p>
          <p>{company.email}</p>
          <p>{company.website}</p>
        </div>
        <div className="flex items-center gap-3">
          <img src="/kalkulation-logo-160.png" alt="KlarWerk Service" className="h-16 w-16 rounded-xl" />
        </div>
      </div>

      {/* Anschrift + Angebotsdaten */}
      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="text-[10pt] leading-relaxed">
          <p className="text-[7.5pt] underline decoration-dotted" style={{ color: '#8795a3' }}>
            {company.name} · {company.street} · {company.zip} {company.city}
          </p>
          <div className="mt-2">
            <p className="font-bold">{customer?.company ?? 'Kunde'}</p>
            {customer?.contactPerson ? <p>{customer.contactPerson}</p> : null}
            {customer?.street ? <p>{customer.street}</p> : null}
            {customer?.zip || customer?.city ? (
              <p>
                {customer?.zip} {customer?.city}
              </p>
            ) : null}
          </div>
        </div>
        <table className="text-[9pt]" style={{ color: '#5b6b7b' }}>
          <tbody>
            <tr>
              <td className="pr-4 py-0.5">Angebotsnummer</td>
              <td className="py-0.5 font-bold" style={{ color: '#0f1827' }}>
                {offer.offerNumber}
              </td>
            </tr>
            <tr>
              <td className="pr-4 py-0.5">Datum</td>
              <td className="py-0.5">{fmtDate(offer.date)}</td>
            </tr>
            <tr>
              <td className="pr-4 py-0.5">Gültig bis</td>
              <td className="py-0.5">{fmtDate(offer.validUntil)}</td>
            </tr>
            {object ? (
              <tr>
                <td className="pr-4 py-0.5 align-top">Objekt</td>
                <td className="py-0.5">
                  {object.name}
                  {object.street ? (
                    <>
                      <br />
                      {object.street}, {object.zip} {object.city}
                    </>
                  ) : null}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Betreff */}
      <h1 className="mt-8 text-[13pt] font-extrabold" style={{ color: '#0f1827' }}>
        Angebot {offer.offerNumber} – {calc.name}
      </h1>

      <p className="mt-4 text-[10pt]">{salutation}</p>
      <p className="mt-2 whitespace-pre-line text-[10pt]">{offer.intro}</p>

      {/* Leistungsumfang */}
      <h2 className="mt-6 text-[11pt] font-bold" style={{ color: '#0f1827' }}>
        Leistungsumfang
      </h2>
      <p className="mt-1 text-[9pt]" style={{ color: '#5b6b7b' }}>
        Die Reinigungsintervalle gelten je Einzelleistung wie nachfolgend aufgeführt.
      </p>

      {groups.map((g) => (
        <div key={g.area} className="mt-4 kw-print-avoid-break">
          <h3 className="text-[10pt] font-bold" style={{ color: '#188a3c' }}>
            {g.area || 'Allgemeine Leistungen'}
          </h3>
          {offer.layout !== 'text' ? (
            <table className="mt-1.5 w-full border-collapse text-[9pt]">
              <thead>
                <tr style={{ background: '#f4f7fa' }}>
                  <th className="border px-2 py-1 text-left font-bold" style={{ borderColor: '#e2e9f0' }}>
                    Leistung
                  </th>
                  {offer.showQuantities ? (
                    <th className="border px-2 py-1 text-right font-bold w-24" style={{ borderColor: '#e2e9f0' }}>
                      Menge
                    </th>
                  ) : null}
                  <th className="border px-2 py-1 text-left font-bold w-40" style={{ borderColor: '#e2e9f0' }}>
                    Turnus
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.lines.map((l) => (
                  <tr key={l.id}>
                    <td className="border px-2 py-1" style={{ borderColor: '#e2e9f0' }}>
                      {displayName(l)}
                      {g.lines.filter((x) => x.roomLabel !== g.lines[0].roomLabel).length > 0 ? (
                        <span style={{ color: '#8795a3' }}> · {l.roomLabel}</span>
                      ) : null}
                    </td>
                    {offer.showQuantities ? (
                      <td className="border px-2 py-1 text-right" style={{ borderColor: '#e2e9f0' }}>
                        {fmtNum(l.quantity, 1)} {l.unit}
                      </td>
                    ) : null}
                    <td className="border px-2 py-1" style={{ borderColor: '#e2e9f0' }}>
                      {freqName(l.frequencyId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {offer.layout !== 'table' ? (
            <ul className="mt-1.5 list-disc pl-5 text-[9.5pt] space-y-0.5">
              {g.lines.map((l) => (
                <li key={`t-${l.id}`}>
                  {displayName(l)} — {freqName(l.frequencyId)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}

      {onDemandLines.length > 0 ? (
        <div className="mt-4 kw-print-avoid-break">
          <h3 className="text-[10pt] font-bold" style={{ color: '#188a3c' }}>
            Leistungen nach Bedarf
          </h3>
          <ul className="mt-1.5 list-disc pl-5 text-[9.5pt] space-y-0.5">
            {onDemandLines.map((l) => (
              <li key={l.id}>{displayName(l)} — auf Abruf, Abrechnung je Durchführung</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Preis */}
      <div className="mt-7 kw-print-avoid-break">
        <h2 className="text-[11pt] font-bold" style={{ color: '#0f1827' }}>
          Ihr Preis
        </h2>
        <table className="mt-2 w-full max-w-md border-collapse text-[10pt]">
          <tbody>
            {totals.monthlyHours > 0 ? (
              <>
                <tr>
                  <td className="py-1 pr-4">Unterhaltsreinigung monatlich (netto)</td>
                  <td className="py-1 text-right font-bold" style={{ color: '#0f1827' }}>
                    {fmtEur(totals.selected.net)}
                  </td>
                </tr>
                <tr style={{ color: '#5b6b7b' }}>
                  <td className="py-0.5 pr-4">zzgl. {fmtNum(totals.vatPct, 0)} % MwSt.</td>
                  <td className="py-0.5 text-right">{fmtEur(totals.vatAmount)}</td>
                </tr>
                <tr className="border-t" style={{ borderColor: '#e2e9f0' }}>
                  <td className="py-1 pr-4 font-bold">Monatlich brutto</td>
                  <td className="py-1 text-right font-bold" style={{ color: '#188a3c' }}>
                    {fmtEur(totals.gross)}
                  </td>
                </tr>
              </>
            ) : null}
            {totals.oneTime && oneTimeLines.length > 0 ? (
              <tr>
                <td className="py-1 pr-4 pt-3">
                  Einmalige Leistungen ({oneTimeLines.map((l) => displayName(l)).join(', ')}) netto
                </td>
                <td className="py-1 pt-3 text-right font-bold" style={{ color: '#0f1827' }}>
                  {fmtEur(totals.oneTime.price.net)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {offer.priceNote ? (
          <p className="mt-1.5 text-[9pt] whitespace-pre-line" style={{ color: '#5b6b7b' }}>
            {offer.priceNote}
          </p>
        ) : null}
      </div>

      {/* Bedingungen */}
      <div className="mt-6 kw-print-avoid-break">
        <h2 className="text-[11pt] font-bold" style={{ color: '#0f1827' }}>
          Vertragsbedingungen
        </h2>
        <p className="mt-1.5 whitespace-pre-line text-[9pt]" style={{ color: '#3d4c5c' }}>
          {offer.terms}
        </p>
        <p className="mt-2 text-[9pt]" style={{ color: '#5b6b7b' }}>
          Dieses Angebot ist gültig bis zum {fmtDate(offer.validUntil)}.
        </p>
      </div>

      <p className="mt-5 whitespace-pre-line text-[10pt]">{offer.outro}</p>
      <p className="mt-4 text-[10pt]">
        Mit freundlichen Grüßen
        <br />
        <span className="font-bold">{company.ownerName ? `${company.ownerName} · ` : ''}{company.name}</span>
      </p>

      {/* Unterschriften */}
      <div className="mt-10 grid grid-cols-2 gap-10 kw-print-avoid-break">
        <div>
          <div className="border-t pt-1.5" style={{ borderColor: '#8795a3' }}>
            <p className="text-[8.5pt]" style={{ color: '#5b6b7b' }}>
              Ort, Datum · Unterschrift Auftraggeber
            </p>
          </div>
        </div>
        <div>
          <div className="border-t pt-1.5" style={{ borderColor: '#8795a3' }}>
            <p className="text-[8.5pt]" style={{ color: '#5b6b7b' }}>
              Ort, Datum · Unterschrift Auftragnehmer
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 border-t pt-2 text-center text-[7.5pt]" style={{ borderColor: '#e2e9f0', color: '#8795a3' }}>
        {company.name} · {company.street} · {company.zip} {company.city} · {company.phone} · {company.email}
        {company.taxNumber ? ` · Steuernummer ${company.taxNumber}` : ''}
        {company.vatId ? ` · USt-IdNr. ${company.vatId}` : ''}
      </p>
    </div>
  );
}
