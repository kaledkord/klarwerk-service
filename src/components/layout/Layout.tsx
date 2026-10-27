import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './Header';
import Seitenwechsel from './Seitenwechsel';
import ScrollFortschritt from './ScrollFortschritt';
import NAPFooter from '../NAP/NAPFooter';
import NAPHeader from '../NAP/NAPHeader';
import ScrollToTop from '../ScrollToTop';
import AnimatedBackground from '../ui/AnimatedBackground';
import LocalBusinessSchema from '../SEO/LocalBusinessSchema';
import StructuredData from '../SEO/StructuredData';
import { pageTransition } from '../../lib/motion';
import BackToTop from '../ui/BackToTop';
import CookieBanner from '../ui/CookieBanner';

export default function Layout() {
  const location = useLocation();

  return (
    // reducedMotion="never": alle Bewegungen laufen auch bei „Bewegung reduzieren“ (Wunsch von Khaled).
    <MotionConfig reducedMotion="never">
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <ScrollFortschritt />
        <Seitenwechsel />
        <AnimatedBackground />
        <LocalBusinessSchema />
        <StructuredData organization />
        <NAPHeader />
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <NAPFooter />
        <BackToTop />
        <CookieBanner />
      </div>
    </MotionConfig>
  );
}
