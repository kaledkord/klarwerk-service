"""
Erzeugt aus den Originalfotos (scripts/bilder-quellen.json) optimierte Varianten für die Website:

  public/bilder/<schluessel>-<breite>.avif   (AVIF, kleinste Dateien)
  public/bilder/<schluessel>-<breite>.webp   (WebP, Rückfall für ältere Browser)
  public/bilder/<schluessel>.jpg             (JPEG, Rückfall für <img src>, Open Graph, JSON-LD)
  src/data/bilder.json                       (Manifest: Rückfall-URL → srcset je Format, Maße)

Aufruf (einmalig oder wenn ein Original wechselt):  python scripts/bilder-erzeugen.py
Braucht nur Pillow mit AVIF- und WebP-Unterstützung (ab Pillow 11.2). Die erzeugten Dateien
werden eingecheckt, damit der Build (Netlify, Bolt, CI) kein natives Bildwerkzeug braucht.
Schon vorhandene Varianten werden nicht neu geschrieben; mit --neu werden alle neu erzeugt.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, features

WURZEL = Path(__file__).resolve().parents[1]
ZIEL = WURZEL / "public" / "bilder"
MANIFEST = WURZEL / "src" / "data" / "bilder.json"
QUELLEN = json.loads((WURZEL / "scripts" / "bilder-quellen.json").read_text(encoding="utf-8"))

AVIF_QUALITAET = 58
WEBP_QUALITAET = 80
JPEG_QUALITAET = 82
RUECKFALL_BREITE = 1200
NEU = "--neu" in sys.argv


def pruefe_codecs() -> None:
    fehlend = [n for n in ("webp", "avif") if not features.check(n)]
    if fehlend:
        sys.exit(f"Pillow ohne {', '.join(fehlend)}-Unterstützung. Bitte Pillow >= 11.2 installieren.")


def lade(quelle: Path) -> Image.Image:
    bild = Image.open(quelle)
    bild.load()
    if bild.mode == "RGB":
        return bild
    # Transparenz auf Weiß legen, alles andere nach RGB wandeln.
    rgba = bild.convert("RGBA")
    hintergrund = Image.new("RGB", bild.size, (255, 255, 255))
    hintergrund.paste(rgba, mask=rgba.split()[-1])
    return hintergrund


def skaliere(bild: Image.Image, breite: int) -> Image.Image:
    if breite >= bild.width:
        return bild
    hoehe = round(bild.height * breite / bild.width)
    return bild.resize((breite, hoehe), Image.Resampling.LANCZOS)


def speichere(bild: Image.Image, ziel: Path, fmt: str) -> None:
    if ziel.exists() and not NEU:
        return
    ziel.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "avif":
        bild.save(ziel, "AVIF", quality=AVIF_QUALITAET, speed=4)
    elif fmt == "webp":
        bild.save(ziel, "WEBP", quality=WEBP_QUALITAET, method=6)
    else:
        bild.save(ziel, "JPEG", quality=JPEG_QUALITAET, progressive=True, optimize=True)


def main() -> None:
    pruefe_codecs()
    manifest: dict[str, dict] = {}
    gesamt_vorher = 0
    gesamt_nachher = 0
    for schluessel, eintrag in QUELLEN["bilder"].items():
        quelle = WURZEL / eintrag["quelle"]
        if not quelle.exists():
            sys.exit(f"Quelle fehlt: {quelle}")
        original = lade(quelle)
        gesamt_vorher += quelle.stat().st_size
        breiten = sorted({min(b, original.width) for b in eintrag.get("breiten", QUELLEN["breiten"])})
        srcsets: dict[str, list[str]] = {"avif": [], "webp": []}
        for breite in breiten:
            variante = skaliere(original, breite)
            for fmt in ("avif", "webp"):
                datei = ZIEL / f"{schluessel}-{breite}.{fmt}"
                speichere(variante, datei, fmt)
                srcsets[fmt].append(f"/bilder/{datei.name} {breite}w")
                gesamt_nachher += datei.stat().st_size
        rueckfall_breite = max([b for b in breiten if b <= RUECKFALL_BREITE] or [breiten[0]])
        rueckfall = skaliere(original, rueckfall_breite)
        rueckfall_datei = ZIEL / f"{schluessel}.jpg"
        speichere(rueckfall, rueckfall_datei, "jpg")
        gesamt_nachher += rueckfall_datei.stat().st_size
        manifest[f"/bilder/{rueckfall_datei.name}"] = {
            "w": rueckfall.width,
            "h": rueckfall.height,
            "avif": ", ".join(srcsets["avif"]),
            "webp": ", ".join(srcsets["webp"]),
        }
        print(f"  ok {schluessel:32s} {original.width}x{original.height} -> {len(breiten)} Breiten", flush=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(manifest)} Bilder, Originale {gesamt_vorher/1e6:.1f} MB -> alle Varianten zusammen {gesamt_nachher/1e6:.1f} MB")
    print(f"Manifest: {MANIFEST.relative_to(WURZEL)}")


if __name__ == "__main__":
    main()
