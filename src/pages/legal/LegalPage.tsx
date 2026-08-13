import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

interface LegalPageProps {
  title: string;
  description: string;
  canonicalPath: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, description, canonicalPath, children }: LegalPageProps) {
  return (
    <div className="bg-white">
      <SEO title={title} description={description} canonicalPath={canonicalPath} />
      <section className="pt-36 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            {title}
          </motion.h1>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-sm max-w-none">
          <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
