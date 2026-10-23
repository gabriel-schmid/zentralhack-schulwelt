# AGENTS.md

Gemeinsamer Kontext für alle KI-Helfer (Claude, ChatGPT, Codex) in diesem
Projekt. Lies diese Datei zuerst, dann die Datei in `skills/`, die zur Aufgabe
passt.

## Projekt

Zentral Hack 2026 (23.–24. Oktober, HSLU Rotkreuz), Challenge «Bring your own
Challenge» (Sponsor Suva). Wir bauen eine begehbare 3D-Welt, die zeigt, wie
Schule sein könnte: ein Bergdorf, in dem Lernen in echten Projekten
stattfindet. Lernende planen selbst, bauen etwas, holen sich im 1:1-Coaching
Unterstützung und reflektieren ihren Fortschritt. Ein KI-Coach kennt die
pädagogischen Grundsätze. Arbeitssicherheit kommt als natürlicher Teil der
Projekte vor, nicht als Hauptthema.

Die ganze Idee: [docs/idee.md](docs/idee.md). Orte und Stationen:
[docs/orte.md](docs/orte.md). Figuren: [docs/personas.md](docs/personas.md).

## Wie das Projekt gebaut ist

- **Die Welt** läuft in Hazu World auf hazu.app. Sie ist eine Ansicht auf einen
  Hazu-Baum: Unter-Hazus werden zu Häusern, Punkte zu Figuren und Tafeln.
  Details: [skills/hazu-world/SKILL.md](skills/hazu-world/SKILL.md).
- **Stationen** sind eigene Widgets: je eine HTML-Datei, die in der Welt als
  Overlay öffnet. Das ist der Teil, den wir am Hackathon programmieren.
  Anleitung: [skills/widget/SKILL.md](skills/widget/SKILL.md).
- **Der KI-Coach** ist eine Genius-Konfiguration auf hazu.app. Sein Prompt
  steht in [coach/system-prompt.md](coach/system-prompt.md).

## Regeln

- Antworte auf Deutsch (Schweizer Schreibweise, «ss» statt «ß»).
- Ein Widget ist **eine einzige HTML-Datei** mit allem CSS und JS darin.
  Externe Bibliotheken nur über CDN mit fester Version.
- Kein Code aus der Hazu-Plattform oder der Hazu-World-Engine in dieses Repo.
  Hier liegt nur, was wir am Hackathon neu bauen, und Doku.
- Keine Zugangsdaten, Tokens, `.env`-Dateien oder echten Personendaten
  committen.
- Keine echte Schule und keine echten Personen nennen. Die Welt ist eine
  Vision, kein Abbild.
- Im Level-Builder arbeitet immer nur eine Person gleichzeitig (das Level ist
  ein einziges Dokument, der letzte Speicherstand gewinnt).
- Nach jedem Meilenstein [docs/fortschritt.md](docs/fortschritt.md) mit
  Uhrzeit nachführen. Die Jury bewertet den Fortschritt während der 24 Stunden.

## Wer macht was

| Person | Bereich |
| ------ | ------- |
| Gabriel | Welt, Level-Builder, Einbinden der Stationen auf hazu.app, Technik |
| Partner | Personas, Inhalte der Orte, Stationen (Widgets) |

## Links

- Hazu (privat): https://hazu.app/HIx4jrkOAhhawUaTpPN4
- Welt: https://hazu.app/TRAIMeIVPNXq5wfkfTG2

## Hazu-IDs

| Was | ID |
| --- | -- |
| Schulwelt (Welt-Hazu) | `TRAIMeIVPNXq5wfkfTG2` |
| Werkstatt | `tZNMXBltrzdnsVkElfhC` |
| Coaching-Raum | `hJ73ZiKWocRZADF25pQj` |
| Garten und Hof | `bK_FhPCxRBLKvMG4_flE` |
| Küche | `QWixzEpPTgQYY09Ww8cH` |
| Lernatelier | `frRqjhqx-Bk_71Wu9o8C` |
| Dorfplatz | `eEES-rZbllKEqy1uuiRX` |
| Figuren (Genius-Konfigurationen) | `JITvlYasVsTNZ1MgXOPp` |
