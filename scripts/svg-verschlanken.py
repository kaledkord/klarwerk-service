"""
Verschlankt die großen SVG-Pfade der Website, ohne das Bild sichtbar zu verändern:

  * Zahlen in Pfaden auf höchstens 2 Nachkommastellen runden (statt bis zu 15).
  * Reine Polygonzüge (M/L-Folgen, die Werkzeug-Symbole des Logos) mit Ramer-Douglas-Peucker
    ausdünnen. Toleranz 0,25 Einheiten bei 660 Einheiten Zeichenfläche – weniger als ein Zehntel
    Pixel bei der größten Darstellung (260 px).

Betrifft:
  index.html                 Loader-Logo (steht in jeder vorgerenderten HTML-Datei)
  src/data/werkzeugHaus.ts   dasselbe Logo als Scroll-Effekt
  public/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg   Logo in Kopf- und Fußzeile

Geprüft per Pixelvergleich im Browser (Original gegen Ergebnis): Kopfzeilen-Logo 0,17 % der Pixel
mit Kantenglättungs-Unterschieden, Loader und Werkzeughaus deckungsgleich.

Aufruf: python scripts/svg-verschlanken.py   (idempotent; mit --pruefen nur Größen anzeigen)
"""
from __future__ import annotations

import math
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[1]
TOLERANZ = 0.25
ZAHL = re.compile(r"-?\d*\.?\d+(?:e-?\d+)?")
NUR_PRUEFEN = "--pruefen" in sys.argv


def runde(text: str, stellen: int = 2) -> str:
    def ersetze(m: re.Match[str]) -> str:
        wert = float(m.group(0))
        s = f"{wert:.{stellen}f}".rstrip("0").rstrip(".")
        return s if s not in ("", "-0", "-") else "0"

    return ZAHL.sub(ersetze, text)


def rdp(punkte: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    if len(punkte) < 3:
        return punkte
    (x1, y1), (x2, y2) = punkte[0], punkte[-1]
    laenge = math.hypot(x2 - x1, y2 - y1)
    maximum, index = 0.0, 0
    for i in range(1, len(punkte) - 1):
        x, y = punkte[i]
        if laenge == 0:
            abstand = math.hypot(x - x1, y - y1)
        else:
            abstand = abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1)) / laenge
        if abstand > maximum:
            maximum, index = abstand, i
    if maximum > eps:
        links = rdp(punkte[: index + 1], eps)
        rechts = rdp(punkte[index:], eps)
        return links[:-1] + rechts
    return [punkte[0], punkte[-1]]


def vereinfache_pfad(d: str) -> str:
    """Nur Pfade aus M/L/Z (Polygonzüge, absolute Koordinaten) ausdünnen; alle anderen nur runden.
    Pfade mit relativen Befehlen (c, l, s …) bleiben unangetastet: gerundete Deltas summieren sich."""
    if re.search(r"[a-z]", d):
        return d
    if not re.fullmatch(r"[MLZ0-9.,\-\s]+", d.strip()):
        return runde(d)
    befehle = re.findall(r"[MLZ][^MLZ]*", d.strip())
    teile: list[str] = []
    zug: list[tuple[float, float]] = []

    def schliesse() -> None:
        nonlocal zug
        if not zug:
            return
        for i, (x, y) in enumerate(rdp(zug, TOLERANZ)):
            teile.append(f"{'M' if i == 0 else 'L'}{runde(str(x))},{runde(str(y))}")
        zug = []

    for befehl in befehle:
        art = befehl[0]
        if art in "Zz":
            schliesse()
            teile.append("Z")
            continue
        zahlen = [float(z) for z in ZAHL.findall(befehl[1:])]
        for i in range(0, len(zahlen) - 1, 2):
            if art == "M" and i == 0:
                schliesse()
            zug.append((zahlen[i], zahlen[i + 1]))
    schliesse()
    return "".join(teile)


def verschlanke_svg_text(text: str, pfade_ausduennen: bool) -> str:
    def ersetze_d(m: re.Match[str]) -> str:
        d = m.group(2)
        neu = vereinfache_pfad(d) if pfade_ausduennen else runde(d)
        return f"{m.group(1)}{neu}{m.group(3)}"

    text = re.sub(r'(\sd=")([^"]+)(")', ersetze_d, text)
    # Zahlen in den übrigen Attributen (clip-path-Pfade, transform, points) ebenfalls runden.
    text = re.sub(r'(\s(?:points|transform)=")([^"]+)(")', lambda m: f"{m.group(1)}{runde(m.group(2))}{m.group(3)}", text)
    return text


def bearbeite(pfad: Path, funktion) -> None:
    alt = pfad.read_text(encoding="utf-8")
    neu = funktion(alt)
    print(f"  {pfad.relative_to(WURZEL)!s:72s} {len(alt.encode()):>8,} → {len(neu.encode()):>8,} Bytes")
    if not NUR_PRUEFEN and neu != alt:
        pfad.write_text(neu, encoding="utf-8", newline="\n")


def index_html(text: str) -> str:
    # Nur das Loader-Logo anfassen (Marke <svg … class="klw-loader-logo">).
    return re.sub(
        r'<svg[^>]*class="klw-loader-logo"[^>]*>.*?</svg>',
        lambda m: verschlanke_svg_text(m.group(0), pfade_ausduennen=True),
        text,
        flags=re.S,
    )


def werkzeughaus_ts(text: str) -> str:
    return re.sub(r"d: '([^']+)'", lambda m: f"d: '{vereinfache_pfad(m.group(1))}'", text)


def svg_datei(text: str) -> str:
    text = re.sub(r"<metadata>.*?</metadata>", "", text, flags=re.S)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = verschlanke_svg_text(text, pfade_ausduennen=False)
    text = re.sub(r">\s+<", "><", text)
    return text.strip() + "\n"


def main() -> None:
    bearbeite(WURZEL / "index.html", index_html)
    bearbeite(WURZEL / "src" / "data" / "werkzeugHaus.ts", werkzeughaus_ts)
    # Nur das Kopfzeilen-Logo (Canva-Export mit absoluten Koordinaten und 6 Nachkommastellen).
    # logos/Orginal.svg nutzt relative Pfadbefehle (Runden verformt), logos/frosch.svg spart nichts.
    bearbeite(WURZEL / "public/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg", svg_datei)


if __name__ == "__main__":
    main()
