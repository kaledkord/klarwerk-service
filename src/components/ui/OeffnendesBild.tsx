import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollEffekte, weich } from '../../lib/scrollEffekte';
import { BildQuellen, bildEintrag } from './Bild';

/**
 * Scroll-Effekt 5: Das Bild öffnet sich beim Hineinscrollen ruhig aus einem etwas kleineren Rahmen
 * und blendet dabei auf; im Rahmen bewegt es sich nur leicht. Das Seitenverhältnis gibt der Aufrufer
 * vor (passend zum Foto), damit nichts angeschnitten wird. Bis es geladen ist, schimmert der Platzhalter.
 */
export default function OeffnendesBild({
  src,
  alt,
  className = '',
  sizes = '100vw',
}: {
  src: string;
  alt: string;
  className?: string;
  /** Breite im Layout für die Auswahl der Bildgröße (Standard: volle Breite). */
  sizes?: string;
}) {
  const eintrag = bildEintrag(src);
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [geladen, setGeladen] = useState(false);
  const effekte = useScrollEffekte();
  // Ganz offen, wenn die Bildmitte 60 % des Fensters erreicht – also bevor man den Text daneben liest.
  const { scrollYProgress: oeffnen } = useScroll({ target: ref, offset: ['start end', 'center 0.6'] });
  const { scrollYProgress: durchlauf } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clipPath = useTransform(oeffnen, (p) => {
    const rest = (1 - weich(p)) * 6;
    return `inset(${rest.toFixed(2)}% round 24px)`;
  });
  const opacity = useTransform(oeffnen, (p) => 0.5 + 0.5 * weich(p));
  // Leichte Bewegung im Rahmen; der Zoom von 5 % deckt sie ab, ohne Köpfe oder Ränder abzuschneiden.
  const y = useTransform(durchlauf, (p) => `${((p - 0.5) * -4.8).toFixed(2)}%`);

  // Vorgerenderte Bilder können schon vor dem Hydrieren fertig geladen sein.
  useEffect(() => {
    if (imgRef.current?.complete) setGeladen(true);
  }, []);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className={`h-full w-full overflow-hidden rounded-3xl border border-white/10 ${geladen ? '' : 'klw-schimmer'}`}
        style={effekte ? { clipPath, opacity } : undefined}
      >
        <picture className="contents">
          <BildQuellen src={src} sizes={sizes} />
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            width={eintrag?.w}
            height={eintrag?.h}
            loading="lazy"
            decoding="async"
            onLoad={() => setGeladen(true)}
            className="h-full w-full object-cover object-[center_20%]"
            style={effekte ? { y, scale: 1.05 } : undefined}
          />
        </picture>
      </motion.div>
    </div>
  );
}
