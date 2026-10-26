// Lader aus den vier Säulen des Logos (Stile in index.css, „Lader“).
export default function SaeulenLader({ label = 'Wird geladen' }: { label?: string }) {
  return (
    <span className="klw-saeulen" role="status" aria-label={label}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
