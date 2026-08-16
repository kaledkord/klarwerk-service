import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import AnimatedSection from '../components/ui/AnimatedSection';
import ContactForm from '../components/ui/ContactForm';
import { seoConfig } from '../config/seoConfig';
import { businessConfig } from '../config/businessConfig';

const contactInfo = [
  { icon: Phone, label: 'Telefon', value: businessConfig.phone.display, href: `tel:${businessConfig.phone.raw}` },
  { icon: Mail, label: 'E-Mail', value: businessConfig.email, href: `mailto:${businessConfig.email}` },
  { icon: MapPin, label: 'Anschrift', value: `${businessConfig.address.street}, ${businessConfig.address.zip} ${businessConfig.address.city}` },
  { icon: MapPin, label: 'Einsatzgebiet', value: 'Schleswig-Holstein, Hamburg & NRW' },
  { icon: Clock, label: 'Erreichbarkeit', value: 'Mo–Fr 07:00–19:00 Uhr · Sa 09:00–14:00 Uhr' },
];

export default function Contact() {
  return (
    <div className="bg-white">
      <SEO
        {...seoConfig['/kontakt']}
        keywords="Kontakt KlarWerk Service, Gebäudereinigung Angebot, Reinigungsfirma Kontakt"
      />

      <section className="pt-36 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">Kontakt</span>
            <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">Kontaktieren Sie uns</h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              Sie haben Fragen oder möchten ein Angebot anfordern? Füllen Sie das Formular aus oder kontaktieren Sie uns direkt – wir melden uns innerhalb von 24 Stunden.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
          <AnimatedSection className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Direkt erreichbar</h2>
            <div className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                      <Icon size={18} className="text-brand-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="mt-1 font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="block">{content}</a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Angebot anfordern</h2>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
