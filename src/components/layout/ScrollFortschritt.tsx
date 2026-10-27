import { motion, useScroll } from 'framer-motion';

// Scroll-Effekt 1: dünner Balken im Dachverlauf ganz oben, wächst mit dem Lesefortschritt.
export default function ScrollFortschritt() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#35A1DA] via-[#2AA391] to-[#22A750]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
