import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  twinkle: number;
}

const MAX_PARTICLES = 60;

/**
 * Subtle animated ambient background — soft drifting gradient orbs and
 * gentle twinkling particles in the site's navy/cyan palette.
 * Designed to sit behind content as premium texture, not a distraction.
 * All visual parameters respond gently to scroll position.
 */
export default function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgress = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const orbs: Orb[] = [];
    const particles: Particle[] = [];

    // ── Setup ────────────────────────────────────────────────────────────────
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + 'px';
      canvas!.style.height = height + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initOrbs() {
      orbs.length = 0;
      const palette = [
        { r: 33, g: 167, b: 74 },    // brand green #21A74A
        { r: 52, g: 161, b: 218 },   // brand blue #34A1DA
        { r: 111, g: 211, b: 152 },  // soft green
        { r: 176, g: 219, b: 241 },  // soft blue
        { r: 200, g: 210, b: 200 },  // neutral green-grey
      ];

      const orbCount = width < 768 ? 3 : 5;
      for (let i = 0; i < orbCount; i++) {
        const c = palette[i % palette.length];
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.max(120, Math.random() * 200 + 180),
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.12,
          color: `${c.r}, ${c.g}, ${c.b}`,
          opacity: Math.random() * 0.06 + 0.03,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function initParticles() {
      particles.length = 0;
      const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          speed: Math.random() * 0.2 + 0.08,
          drift: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.25 + 0.08,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    // ── Scroll tracking ───────────────────────────────────────────────────────
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    }

    // ── Drawing ───────────────────────────────────────────────────────────────
    function draw(t: number) {
      const scroll = scrollProgress.current;

      // Fully transparent clear — page bg shows through
      ctx!.clearRect(0, 0, width, height);

      // ── Soft drifting orbs ──────────────────────────────────────────────────
      const scrollShift = scroll * 60;

      for (const orb of orbs) {
        orb.x += orb.speedX;
        orb.y += orb.speedY + Math.sin(t * 0.0003 + orb.phase) * 0.08;

        // Wrap around viewport
        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const pulse = 0.7 + Math.sin(t * 0.0005 + orb.phase) * 0.3;
        const alpha = orb.opacity * pulse * (1 + scroll * 0.4);
        const r = Math.max(1, orb.radius);

        const grad = ctx!.createRadialGradient(orb.x, orb.y - scrollShift * 0.3, 0, orb.x, orb.y - scrollShift * 0.3, r);
        grad.addColorStop(0, `rgba(${orb.color}, ${alpha})`);
        grad.addColorStop(0.5, `rgba(${orb.color}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${orb.color}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y - scrollShift * 0.3, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ── Twinkling particles ──────────────────────────────────────────────────
      const speedMul = 1 + scroll * 1.5;
      const opacityMul = 1 + scroll * 0.8;

      for (const p of particles) {
        p.y -= p.speed * speedMul;
        p.x += p.drift * speedMul;
        p.twinkle += 0.015;

        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;

        const twinkleAlpha = (Math.sin(p.twinkle) * 0.5 + 0.5) * p.opacity * opacityMul;
        const size = Math.max(0.3, p.size);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(100, 130, 180, ${Math.min(twinkleAlpha, 0.5)})`;
        ctx!.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    resize();
    initOrbs();
    initParticles();
    onScroll();
    rafId.current = requestAnimationFrame(draw);

    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initOrbs();
        initParticles();
      }, 200);
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none ${className ?? ''}`}
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
