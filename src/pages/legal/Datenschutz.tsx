import LegalPage from './LegalPage';

export default function Datenschutz() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      description="Datenschutzerklärung von KlarWerk Service – Datenschutzerklärung gemäß DSGVO."
      canonicalPath="/datenschutz"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">1. Datenschutz auf einen Blick</h2>
        <p>Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">2. Verantwortliche Stelle</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <p className="whitespace-pre-line mt-2">
          KlarWerk Service
          Am Blöcken 4
          24582 Bordesholm
          Telefon: +49 176 31287131
          E-Mail: info@klarwerk-service.com
        </p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">3. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen einer Bestellung, bei einer Kontaktaufnahme oder bei der Nutzung unseres Kontaktformulars freiwillig mitteilen. Folgende Daten werden dabei erhoben:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Name und ggf. Firmenname</li>
          <li>Kontaktdaten (E-Mail-Adresse, Telefonnummer)</li>
          <li>Inhalt Ihrer Nachricht</li>
          <li>Gewünschte Leistung</li>
        </ul>
        <p className="mt-2">Diese Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nach Abschluss der Kommunikation gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">4. Ihre Rechte</h2>
        <p>Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Darüber hinaus haben Sie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">5. Cookies</h2>
        <p>Unsere Website verwendet keine Cookies zur Verfolgung von Nutzerverhalten. Es werden ausschließlich technisch notwendige Funktionen eingesetzt.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">6. Server-Log-Files</h2>
        <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Files, die Ihr Browser automatisch übermittelt. Diese sind: Browsertyp/Version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage. Diese Daten sind nicht bestimmten Personen zuordenbar.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">7. Kontaktformular</h2>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
      </div>
    </LegalPage>
  );
}
