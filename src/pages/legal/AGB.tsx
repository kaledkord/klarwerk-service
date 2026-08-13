import LegalPage from './LegalPage';

export default function AGB() {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      description="AGB von KlarWerk Service – Gebäudereinigung und Gebäudeservice."
      canonicalPath="/agb"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 1 Geltungsbereich</h2>
        <p>Für alle Lieferungen und Leistungen der KlarWerk Service gelten ausschließlich diese Allgemeinen Geschäftsbedingungen. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 2 Vertragsschluss</h2>
        <p>Ein Vertrag zwischen KlarWerk Service und dem Kunden kommt durch Auftragsbestätigung oder durch Ausführung der Leistung zustande. Angebote sind freibleibend und unverbindlich.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 3 Leistungen</h2>
        <p>Der Umfang der zu erbringenden Leistungen ergibt sich aus dem jeweiligen Angebot bzw. der Auftragsbestätigung. KlarWerk Service erbringt die Leistungen nach den allgemein anerkannten Regeln der Reinigungstechnik.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 4 Preise und Zahlungsbedingungen</h2>
        <p>Es gelten die in der Auftragsbestätigung genannten Preise. Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer. Rechnungen sind innerhalb von 14 Tagen nach Rechnungsstellung ohne Abzug zahlbar, sofern nichts anderes vereinbart wurde.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 5 Kündigung</h2>
        <p>Bei Dauerschuldverhältnissen (z.B. regelmäßige Reinigungsverträge) gilt eine Kündigungsfrist von 4 Wochen zum Monatsende, sofern im Vertrag nichts anderes geregelt ist.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 6 Haftung</h2>
        <p>KlarWerk Service haftet für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet KlarWerk Service nur bei Verletzung wesentlicher Vertragspflichten und nur in Höhe des vorhersehbaren Schadens.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 7 Geheimhaltung</h2>
        <p>Beide Parteien verpflichten sich, alle im Rahmen der Geschäftsbeziehung bekannt gewordenen vertraulichen Informationen geheim zu halten.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">§ 8 Schlussbestimmungen</h2>
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist [Ort], soweit gesetzlich zulässig. Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
      </div>
    </LegalPage>
  );
}
