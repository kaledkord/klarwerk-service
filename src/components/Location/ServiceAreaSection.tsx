import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

/**
 * Location-specific content section: "Proudly Serving [City] and Surrounding Areas"
 * Lists service area neighborhoods/zip codes, location-specific paragraph,
 * and a Google Maps embed using geo coordinates.
 */
export default function ServiceAreaSection() {
  const { serviceArea, geo, address, name } = businessConfig;

  const mapSrc = `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}&z=11&output=embed`;

  return (
    <section className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
            Einsatzgebiet
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            Stolz im Einsatz in {serviceArea.primaryCity} und Umgebung
          </h2>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-3xl">
            {name} ist Ihr regionaler Partner für Gebäudereinigung in {address.city} und
            im gesamten Raum {serviceArea.regions.join(', ')}. Mit regionaler Nähe,
            persönlichem Engagement und geschultem Team sorgen wir für Sauberkeit –
            zuverlässig und flexibel.
          </p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 items-start">
          {/* Service area grid */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Navigation size={20} className="text-brand-700" />
              Von uns betreute Orte
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {serviceArea.locations.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={15} className="text-brand-600 shrink-0" />
                    <span className="font-semibold text-slate-900 text-sm">{loc.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {loc.zipCodes.join(', ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Google Maps embed */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-200">
              <iframe
                src={mapSrc}
                title={`${name} Einsatzgebiet ${address.city}`}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
              <MapPin size={16} className="text-brand-600" />
              <span>
                {address.street}, {address.zip} {address.city}, {address.state}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
