import SEO from '../../components/SEO';

interface LegalPageProps {
  title: string;
  description: string;
  canonicalPath: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, description, canonicalPath, children }: LegalPageProps) {
  return (
    <div className="bg-paper">
      <SEO title={title} description={description} canonicalPath={canonicalPath} />
      <section className="pt-36 pb-16 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="klw-auftritt-kurz text-4xl md:text-5xl font-black tracking-tight" style={{ "--klw-auftritt-y": "20px" } as React.CSSProperties}>
            {title}
          </h1>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-sm max-w-none">
          <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
