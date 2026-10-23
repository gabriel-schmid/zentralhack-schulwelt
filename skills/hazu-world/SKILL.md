---
name: hazu-world
description: Wie unsere Welt auf hazu.app aus dem Hazu-Baum entsteht, wie man sie im Level-Builder gestaltet und wie Stationen hineinkommen. Lesen, bevor du Orte, Figuren oder das Level änderst.
---

# Hazu World

Hazu World ist eine **Ansicht** auf einen Hazu, wie die Liste oder der
Kalender. Die Daten sind normale Hazu-Items; die Welt stellt sie nur dar.

## Hazu-Baum → Welt

| Auf hazu.app | In der Welt |
| ------------ | ----------- |
| Welt-Hazu (`layout.defaultView: "world"`) | das Dorf |
| Unter-Hazu im Welt-Hazu | ein Haus mit Tür; hineingehen öffnet diesen Ort |
| Punkt (Item) | eine Figur oder Tafel mit Text, Bildern oder Quiz |
| Hazu mit Tag `hz-world-sim` und Widget | eine Station; öffnet das Widget als Overlay |
| Genius-Konfiguration im Ordner «Figuren» (Tag `hazuworld-characters`) | eine Tutor-Figur, z. B. der Coach |

Solange es kein gespeichertes Level gibt, baut die Engine aus den Unter-Hazus
und Punkten automatisch ein Dorf.

## Level-Builder

- Öffnet sich in der Welt-Ansicht der App, nur für Bearbeitende des Hazu.
- Speichern legt eine neue Version des Level-Dokuments an. Unter «Versionen»
  holt man frühere Stände zurück.
- **Immer nur eine Person im Builder.** Das Level ist ein einziges Dokument;
  der letzte Speicherstand gewinnt.
- Grössere Stände als Backup nach `level/` exportieren und committen.

## Wer was ändern kann

- **Alle Bearbeitenden** im Browser: Orte (Unter-Hazus), Figuren-Inhalte
  (Punkte), Texte, Quizze, Builder.
- **Gabriel**: Welt-Einstellungen, Widgets hochladen und als Station
  einbinden.

## Grenzen (Stand Oktober 2026)

- Quizantworten aus der Welt werden noch nicht gespeichert.
- VR und Sprache laufen nur im eigenständigen Tab, dort ohne Genius. Die Demo
  läuft am Laptop im Browser.
- Wer nicht Bearbeitende/r des Hazu ist, sieht die Welt erst, wenn sie
  freigeschaltet ist.
