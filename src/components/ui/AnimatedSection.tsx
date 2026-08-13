import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, fadeIn, scaleIn, slideInLeft, slideInRight, staggerContainer, staggerItem } from '../../lib/motion';

type AnimationType = 'fadeUp' | 'fadeIn' | 'scale' | 'slideLeft' | 'slideRight';

const variantsMap = {
  fadeUp: fadeInUp,
  fadeIn,
  scale: scaleIn,
  slideLeft: slideInLeft,
  slideRight: slideInRight,
};

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
}

export default function AnimatedSection({ children, className, delay = 0, animation = 'fadeUp' }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      variants={variantsMap[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
