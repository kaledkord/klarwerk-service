import { useEffect, useRef } from 'react';

// Kamerafahrt (Higgsfield), die mit dem Hero-Foto beginnt. Kurz vor dem Ende blendet
// das Video auf das Foto darunter aus, springt an den Anfang und blendet wieder ein –
// so wirkt die Fahrt wie eine Schleife ohne sichtbaren Sprung.
//
// Ladeverhalten (Oktober 2026, Ladezeit): Das Video (rund 10 MB) ist nicht Teil des ersten
// Seitenaufbaus. Es startet erst, wenn die Seite fertig geladen ist und der Browser Leerlauf hat,
// und nur auf Bildschirmen ab 768 px ohne Datensparmodus und ohne 2G-Verbindung. Auf dem Handy
// bleibt das Foto stehen, das ohnehin das erste Bild der Fahrt ist. Dank „faststart“ (moov-Atom
// am Dateianfang) spielt der Browser es als Stream, ohne die ganze Datei vorher zu laden.
const BLENDE_MS = 700;
const AUSBLENDEN_VOR_ENDE_S = 1;
const MINDESTBREITE_PX = 768;

type Verbindung = { saveData?: boolean; effectiveType?: string };

function videoErwuenscht(): boolean {
  const verbindung = (navigator as Navigator & { connection?: Verbindung }).connection;
  if (verbindung?.saveData) return false;
  if (verbindung?.effectiveType && /2g$/.test(verbindung.effectiveType)) return false;
  return window.matchMedia(`(min-width: ${MINDESTBREITE_PX}px)`).matches;
}

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !videoErwuenscht()) return;

    let gestartet = false;
    let ausgeblendet = false;
    let leerlaufId = 0;
    const amEnde = () => video.duration > 0 && video.currentTime >= video.duration - AUSBLENDEN_VOR_ENDE_S;
    const einblenden = () => {
      if (amEnde()) return;
      ausgeblendet = false;
      video.style.opacity = '1';
    };
    const pruefeEnde = () => {
      if (!ausgeblendet && amEnde()) {
        ausgeblendet = true;
        video.style.opacity = '0';
      }
    };
    const vonVorn = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    const starten = () => {
      gestartet = true;
      video.addEventListener('playing', einblenden);
      video.addEventListener('timeupdate', pruefeEnde);
      video.addEventListener('ended', vonVorn);
      video.muted = true;
      video.src = src;
      video.play().catch(() => {});
    };
    // Erst nach dem Laden der Seite und im Leerlauf, damit Foto, Text und Schrift zuerst kommen.
    const leerlaufMoeglich = typeof window.requestIdleCallback === 'function';
    const imLeerlauf = () => {
      leerlaufId = leerlaufMoeglich
        ? window.requestIdleCallback(starten, { timeout: 2500 })
        : window.setTimeout(starten, 800);
    };
    if (document.readyState === 'complete') imLeerlauf();
    else window.addEventListener('load', imLeerlauf, { once: true });

    return () => {
      window.removeEventListener('load', imLeerlauf);
      if (leerlaufMoeglich) window.cancelIdleCallback(leerlaufId);
      else window.clearTimeout(leerlaufId);
      if (!gestartet) return;
      video.removeEventListener('playing', einblenden);
      video.removeEventListener('timeupdate', pruefeEnde);
      video.removeEventListener('ended', vonVorn);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-[1] h-full w-full object-cover opacity-0"
      style={{ transition: `opacity ${BLENDE_MS}ms ease` }}
      muted
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
