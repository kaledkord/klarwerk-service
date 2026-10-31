"""
„faststart“ für MP4-Dateien ohne ffmpeg: verschiebt das moov-Atom (Index) an den Dateianfang,
damit der Browser das Video als Stream abspielen kann, statt erst die ganze Datei zu laden.
Die Bild- und Tondaten bleiben unverändert (kein Neukodieren).

Aufruf: python scripts/video-faststart.py public/hero-objektpflege.mp4
Liegt das moov-Atom schon vorn, passiert nichts.
"""
from __future__ import annotations

import struct
import sys
from pathlib import Path

BEHAELTER = {b"moov", b"trak", b"mdia", b"minf", b"stbl"}


def atome(daten: bytes, start: int, ende: int):
    pos = start
    while pos + 8 <= ende:
        groesse, art = struct.unpack(">I4s", daten[pos : pos + 8])
        kopf = 8
        if groesse == 1:
            groesse = struct.unpack(">Q", daten[pos + 8 : pos + 16])[0]
            kopf = 16
        elif groesse == 0:
            groesse = ende - pos
        yield pos, kopf, groesse, art
        pos += groesse


def verschiebe_offsets(moov: bytearray, start: int, ende: int, versatz: int) -> int:
    """stco/co64 (Chunk-Offsets) im moov um 'versatz' erhöhen. Gibt die Zahl der Tabellen zurück."""
    anzahl = 0
    for pos, kopf, groesse, art in atome(moov, start, ende):
        if art in BEHAELTER:
            anzahl += verschiebe_offsets(moov, pos + kopf, pos + groesse, versatz)
        elif art in (b"stco", b"co64"):
            eintraege = struct.unpack(">I", moov[pos + kopf + 4 : pos + kopf + 8])[0]
            fmt, breite = (">I", 4) if art == b"stco" else (">Q", 8)
            basis = pos + kopf + 8
            for i in range(eintraege):
                feld = slice(basis + i * breite, basis + (i + 1) * breite)
                wert = struct.unpack(fmt, moov[feld])[0]
                moov[feld] = struct.pack(fmt, wert + versatz)
            anzahl += 1
    return anzahl


def main(pfad: Path) -> None:
    daten = pfad.read_bytes()
    liste = list(atome(daten, 0, len(daten)))
    arten = [a[3] for a in liste]
    if b"moov" not in arten or b"mdat" not in arten:
        sys.exit("Kein gültiges MP4 (moov oder mdat fehlt).")
    if arten.index(b"moov") < arten.index(b"mdat"):
        print("moov liegt schon vor mdat – nichts zu tun.")
        return
    moov_pos, _, moov_groesse, _ = next(a for a in liste if a[3] == b"moov")
    moov = bytearray(daten[moov_pos : moov_pos + moov_groesse])
    # Reihenfolge danach: ftyp, moov, (übrige Atome außer free), mdat … – alles hinter dem neuen moov
    # rückt um dessen Größe nach hinten, freie Atome vor dem mdat fallen weg.
    ftyp = next(a for a in liste if a[3] == b"ftyp")
    rest = [a for a in liste if a[3] not in (b"ftyp", b"moov", b"free")]
    # Versatz der Mediendaten: neue Position des mdat minus alte Position.
    neu_pos = ftyp[2] + moov_groesse
    alt_pos_mdat = next(a for a in rest if a[3] == b"mdat")[0]
    neu_pos_mdat = neu_pos + sum(a[2] for a in rest[: [a[3] for a in rest].index(b"mdat")])
    versatz = neu_pos_mdat - alt_pos_mdat
    tabellen = verschiebe_offsets(moov, 8, len(moov), versatz)
    ausgabe = bytearray()
    ausgabe += daten[ftyp[0] : ftyp[0] + ftyp[2]]
    ausgabe += moov
    for pos, _, groesse, _ in rest:
        ausgabe += daten[pos : pos + groesse]
    sicherung = pfad.with_suffix(pfad.suffix + ".vorher")
    if not sicherung.exists():
        sicherung.write_bytes(daten)
    pfad.write_bytes(ausgabe)
    print(f"moov nach vorn verschoben, {tabellen} Offset-Tabellen um {versatz:+d} Bytes angepasst.")
    print(f"{pfad} ({len(daten):,} → {len(ausgabe):,} Bytes); Original als {sicherung.name} daneben.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Aufruf: python scripts/video-faststart.py <datei.mp4>")
    main(Path(sys.argv[1]))
