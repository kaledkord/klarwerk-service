import { useEffect, useRef } from 'react';

// Kamerafahrt (Higgsfield), die mit dem Hero-Foto beginnt. Kurz vor dem Ende blendet
// das Video auf das Foto darunter aus, springt an den Anfang und blendet wieder ein –
// so wirkt die Fahrt wie eine Schleife ohne sichtbaren Sprung.
const BLENDE_MS = 700;
const AUSBLENDEN_VOR_ENDE_S = 1;

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Ohne Video: weniger Bewegung gewünscht oder Datensparmodus – dann bleibt das Foto.
    const sparmodus = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || sparmodus) return;

    let ausgeblendet = false;
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

    video.addEventListener('playing', einblenden);
    video.addEventListener('timeupdate', pruefeEnde);
    video.addEventListener('ended', vonVorn);
    // Erst nach dem Laden der Seite setzen, damit Foto und Text zuerst kommen.
    video.muted = true;
    video.src = src;
    video.play().catch(() => {});

    return () => {
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
      preload="auto"
      aria-hidden="true"
    />
  );
}
