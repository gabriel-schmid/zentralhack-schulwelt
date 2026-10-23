# Schulwelt – Zentral Hack 2026

Eine begehbare 3D-Welt, die zeigt, wie Schule sein könnte: ein Bergdorf mit
Werkstatt, Coaching-Raum, Garten, Küche, Lernatelier und Dorfplatz, dazu ein
KI-Coach.

- Idee und Einreichung: [docs/idee.md](docs/idee.md)
- Fortschritt: [docs/fortschritt.md](docs/fortschritt.md)
- Hazu (privat): https://hazu.app/HIx4jrkOAhhawUaTpPN4

## Ordner

| Ordner | Inhalt |
| ------ | ------ |
| `docs/` | Idee, Orte, Personas, Pädagogik, Sicherheit, Fortschritt |
| `skills/` | Anleitungen für Mensch und KI: Hazu World, Widgets bauen |
| `widgets/` | eine Station pro Ordner; `_vorlage/` zum Kopieren |
| `coach/` | System-Prompt des KI-Coachs |
| `level/` | Backups der Level-Stände aus dem Builder |

## Mit KI arbeiten

- **Claude Code / Codex:** lesen `AGENTS.md` automatisch.
- **ChatGPT:** ein Projekt anlegen und `AGENTS.md`, `skills/widget/SKILL.md`
  und die passenden Dateien aus `docs/` als Projektdateien hochladen. Nach
  grösseren Änderungen die Dateien dort ersetzen.

## Eine neue Station bauen

1. `widgets/_vorlage/` kopieren, z. B. nach `widgets/gefahren-suche/`.
2. `index.html` lokal im Browser öffnen. Ausserhalb von Hazu läuft die Vorlage
   mit Testdaten.
3. Committen und pushen. Gabriel lädt die Datei auf hazu.app hoch und macht
   daraus eine Station in der Welt.
