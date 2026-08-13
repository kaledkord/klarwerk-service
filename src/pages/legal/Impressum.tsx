import LegalPage from './LegalPage';

export default function Impressum() {
  return (
    <LegalPage
      title="Impressum"
      description="Impressum von KlarWerk Service – Gebäudereinigung und Gebäudeservice."
      canonicalPath="/impressum"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Angaben gemäß § 5 DDG</h2>
        <p className="whitespace-pre-line">
          KlarWerk Service
          Einzelunternehmen, Inhaber: [Vor- und Nachname des Inhabers]
          Am Blöcken 4
          24582 Bordesholm
        </p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Kontakt</h2>
        <p>Telefon: +49 176 31287131</p>
        <p>E-Mail: info@klarwerk-service.com</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: [USt-IdNr.]</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
        <p>Berufsbezeichnung: Gebäudereiniger (verliehen in der Bundesrepublik Deutschland)</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Redaktionell verantwortlich</h2>
        <p>[Name des Verantwortlichen]</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Haftung für Inhalte</h2>
        <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Haftung für Links</h2>
        <p>Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Urheberrecht</h2>
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
      </div>
    </LegalPage>
  );
}
