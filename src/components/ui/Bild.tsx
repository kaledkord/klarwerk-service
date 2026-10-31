import { forwardRef, type ImgHTMLAttributes } from 'react';
import manifest from '../../data/bilder.json';

/**
 * Responsive Bilder in AVIF und WebP mit JPEG-Rückfall.
 *
 * Die Varianten erzeugt scripts/bilder-erzeugen.py nach public/bilder/ und trägt sie in
 * src/data/bilder.json ein (Schlüssel = Rückfall-URL, z. B. "/bilder/leistung-glasreinigung.jpg").
 * In den Daten (services.ts, cities.ts …) steht weiter eine einfache URL; sie bleibt für JSON-LD
 * und Open Graph gültig. Unbekannte URLs (z. B. externe Bilder) werden als normales <img> ausgegeben.
 */
export interface BildEintrag {
  w: number;
  h: number;
  avif: string;
  webp: string;
}

const BILDER = manifest as Record<string, BildEintrag>;

export function bildEintrag(src: string): BildEintrag | undefined {
  return BILDER[src];
}

/** <source>-Elemente für AVIF und WebP – in ein <picture> vor das <img> setzen. */
export function BildQuellen({ src, sizes = '100vw' }: { src: string; sizes?: string }) {
  const eintrag = BILDER[src];
  if (!eintrag) return null;
  return (
    <>
      <source type="image/avif" srcSet={eintrag.avif} sizes={sizes} />
      <source type="image/webp" srcSet={eintrag.webp} sizes={sizes} />
    </>
  );
}

interface BildProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'sizes' | 'alt'> {
  src: string;
  alt: string;
  /** Wie breit das Bild im Layout ist, als sizes-Angabe (Standard: volle Breite). */
  sizes?: string;
  /** Bild über dem Falz (LCP): sofort und mit hoher Priorität laden. */
  prioritaet?: boolean;
}

const Bild = forwardRef<HTMLImageElement, BildProps>(function Bild(
  { src, alt, sizes = '100vw', prioritaet = false, loading, decoding = 'async', width, height, ...rest },
  ref,
) {
  const eintrag = BILDER[src];
  const img = (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width ?? eintrag?.w}
      height={height ?? eintrag?.h}
      loading={loading ?? (prioritaet ? 'eager' : 'lazy')}
      decoding={decoding}
      {...(prioritaet ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      {...rest}
    />
  );
  if (!eintrag) return img;
  // display: contents – das <picture> nimmt keinen Platz ein, das <img> füllt wie bisher den Elternkasten.
  return (
    <picture className="contents">
      <BildQuellen src={src} sizes={sizes} />
      {img}
    </picture>
  );
});

export default Bild;
