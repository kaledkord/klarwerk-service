import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../../data/services';

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const Icon = service.icon;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
      className="group flex flex-col bg-paper-100 border border-white/10 rounded-2xl p-7 hover:border-brand-200 shadow-md hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500/15 rounded-xl mb-5 group-hover:bg-brand-600 transition-colors duration-300">
        <Icon
          size={22}
          className="text-brand-300 group-hover:text-white transition-colors duration-300"
        />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{service.shortDesc}</p>
      <Link
        to={`/leistungen/${service.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 group-hover:gap-2.5 transition-all duration-200"
        aria-label={`${service.title} – mehr erfahren`}
      >
        {service.title} ansehen
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
