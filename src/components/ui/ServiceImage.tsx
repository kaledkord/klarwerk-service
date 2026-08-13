import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const useGrayscale = !isTouchDevice && !reduceMotion;
  const useScale = !reduceMotion;

  const filter = isTouchDevice || reduceMotion
    ? 'grayscale(0%) brightness(1)'
    : isHovered
      ? 'grayscale(0%) brightness(1)'
      : 'grayscale(100%) brightness(0.85)';

  const scale = useScale && !isTouchDevice && isHovered ? 1.06 : 1;

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        animate={{ filter, scale }}
        transition={{
          duration: reduceMotion ? 0 : DURATION,
          ease: EASE,
        }}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  );
}
