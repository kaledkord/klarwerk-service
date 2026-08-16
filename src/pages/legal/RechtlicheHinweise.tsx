import LegalPage from './LegalPage';

export default function RechtlicheHinweise() {
  return (
    <LegalPage
      title="Rechtliche Hinweise"
      description="Rechtliche Hinweise von KlarWerk Service – Gebäudereinigung und Gebäudeservice."
      canonicalPath="/rechtliche-hinweise"
    >
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Haftungsausschluss</h2>
        <p>Die Inhalte dieser Website werden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Markenrecht</h2>
        <p>Alle auf dieser Website verwendeten Marken und Markenbezeichnungen sind, soweit nicht anders angegeben, Marken der KlarWerk Service oder Dritter und rechtlich geschützt.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Streitbeilegung</h2>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Verbraucherstreitbeilegung</h2>
        <p>Wir weisen darauf hin, dass wir nicht an einem Verfahren zur Streitbeilegung vor einer Verbraucherschlichtungsstelle teilnehmen.</p>
      </div>
    </LegalPage>
  );
}
