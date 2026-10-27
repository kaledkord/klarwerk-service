import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ServiceImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Loading strategy. Defaults to lazy; set eager for above-the-fold images. */
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 2;

export default function ServiceImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  width,
  height,
}: ServiceImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [geladen, setGeladen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Vorgerenderte Bilder können schon vor dem Hydrieren fertig geladen sein.
  useEffect(() => {
    if (imgRef.current?.complete) setGeladen(true);
  }, []);

  const filter = isTouchDevice
    ? 'grayscale(0%) brightness(1)'
    : isHovered
      ? 'grayscale(0%) brightness(1)'
      : 'grayscale(100%) brightness(0.85)';

  const scale = !isTouchDevice && isHovered ? 1.06 : 1;

  // Bilder oben auf der Seite (eager) erscheinen sofort, damit sie nicht auf JavaScript warten.
  const einblenden = loading === 'lazy';

  return (
    <div
      className={`overflow-hidden ${geladen ? '' : 'klw-schimmer'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Reveal „weich“: blendet beim Hineinscrollen ein und setzt sich von 108 auf 100 %. */}
      <motion.div
        className="h-full w-full"
        initial={einblenden ? { opacity: 0, scale: 1.08 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setGeladen(true)}
          animate={{ filter, scale, opacity: einblenden && !geladen ? 0 : 1 }}
          transition={{
            duration: DURATION,
            ease: EASE,
            opacity: { duration: 0.4 },
          }}
          className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
}
