import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';

// Ripple burst that appears on click
function Ripple({ x, y, id, onDone }: { x: number; y: number; id: number; onDone: () => void }) {
  return (
    <motion.span
      key={id}
      className="pointer-events-none absolute rounded-full"
      style={{
        left: x,
        top: y,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(52,161,218,0.45) 0%, rgba(33,168,65,0.15) 60%, transparent 100%)',
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 320, height: 320, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onDone}
    />
  );
}

export default function AnimatedLogo() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleCounter = useRef(0);

  // Raw mouse position relative to card centre (–1 → 1)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed tilt values
  const springCfg = { stiffness: 220, damping: 28 };
  const tiltX = useSpring(useTransform(rawY, [-1, 1], [10, -10]), springCfg);
  const tiltY = useSpring(useTransform(rawX, [-1, 1], [-10, 10]), springCfg);

  // Shimmer shift derived from mouse X
  const shimmerX = useSpring(useTransform(rawX, [-1, 1], [-40, 140]), springCfg);
  const shimmerOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  // Glow position
  const glowX = useSpring(useTransform(rawX, [-1, 1], [0, 100]), springCfg);
  const glowY = useSpring(useTransform(rawY, [-1, 1], [0, 100]), springCfg);
  const glowOpacity = useSpring(0, { stiffness: 180, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) / (rect.width / 2));
    rawY.set((e.clientY - cy) / (rect.height / 2));
  }, [prefersReduced, rawX, rawY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    shimmerOpacity.set(1);
    glowOpacity.set(1);
  }, [shimmerOpacity, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
    shimmerOpacity.set(0);
    glowOpacity.set(0);
  }, [rawX, rawY, shimmerOpacity, glowOpacity]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleCounter.current;
    setRipples((prev) => [...prev, { id, x, y }]);
  }, [prefersReduced]);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Reset tilt on unmount
  useEffect(() => () => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  const disabled = !!prefersReduced;

  // Shimmer gradient (moves across logo on hover)
  const shimmerGradient = useTransform(shimmerX, (x) =>
    `linear-gradient(105deg, transparent ${x - 20}%, rgba(255,255,255,0.55) ${x}%, rgba(255,255,255,0.15) ${x + 10}%, transparent ${x + 30}%)`
  );

  // Radial glow that follows mouse
  const glowGradient = useTransform([glowX, glowY] as const, ([gx, gy]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(52,161,218,0.22) 0%, rgba(33,168,65,0.12) 40%, transparent 75%)`
  );

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={!disabled && isHovered ? {
          boxShadow: '0 0 60px 12px rgba(52,161,218,0.18), 0 0 120px 30px rgba(33,168,65,0.10)',
        } : {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Card */}
      <motion.div
        ref={ref}
        className="relative select-none cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200"
        style={disabled ? {} : {
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
          transformPerspective: 900,
        }}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : {
          scale: 0.95,
          transition: { type: 'spring', stiffness: 600, damping: 20 },
        }}
        animate={disabled ? {} : isHovered ? {} : {
          scale: 1,
          transition: { type: 'spring', stiffness: 300, damping: 25 },
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Logo image */}
        <div className="relative px-12 py-10 md:px-16 md:py-14 flex items-center justify-center">
          <img
            src="/logos/Orginal.svg"
            alt="KlarWerk Service Logo"
            className="w-full max-w-[280px] md:max-w-[340px] h-auto pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Shimmer overlay */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: shimmerGradient, opacity: shimmerOpacity }}
          />
        )}

        {/* Mouse-tracked glow */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: glowGradient, opacity: glowOpacity }}
          />
        )}

        {/* Click ripples */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {ripples.map((r) => (
            <Ripple key={r.id} x={r.x} y={r.y} id={r.id} onDone={() => removeRipple(r.id)} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
