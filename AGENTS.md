# AGENTS.md

Shared context for every AI helper (Claude, ChatGPT, Codex) in this project.
Read this file first, then the file in `skills/` that fits the task.

## Project

Zentral Hack 2026 (23–24 October, HSLU Rotkreuz), challenge «Bring your own
challenge» (sponsor: Suva). We build a walkable 3D world that shows what school
could be: a mountain village where learning happens in real projects. Learners
plan their own work, build something, get support in 1:1 coaching and reflect
on their progress. An AI coach knows the school's pedagogical principles. Work
safety appears as a natural part of the projects, not as the main theme.

**Judging and requirements: [docs/challenge.md](docs/challenge.md).** Shape
suggestions around them: visible progress during the hackathon (25 %),
innovation, technology and usefulness (20 % each), pitch (15 %, at most 3
minutes).

The full idea: [docs/idea.md](docs/idea.md). Places and stations:
[docs/places.md](docs/places.md). Characters: [docs/personas.md](docs/personas.md). Principles:
[docs/pedagogy.md](docs/pedagogy.md). Our raw concept notes:
[docs/concept-notes.md](docs/concept-notes.md).

For concept, persona, coach and assessment work, also read the current
[shared concept baseline](docs/shared-concept.md), which separates confirmed
decisions from assumptions and open questions.

## How the project is built

- **The world** runs in Hazu World on hazu.app. It is a view on a Hazu tree:
  sub-Hazus become houses, Punkte (items) become characters and boards.
  Details: [skills/hazu-world/SKILL.md](skills/hazu-world/SKILL.md).
- **Stations** are our own widgets: one HTML file each, opened as an overlay
  in the world. This is the part we program during the hackathon.
  How-to: [skills/widget/SKILL.md](skills/widget/SKILL.md).
- **Characters (NPCs)** live in the level generators `level/build-*.mjs`.
  How to write and place them: [skills/npc/SKILL.md](skills/npc/SKILL.md).
- **The AI coach** is a Genius configuration on hazu.app. Its prompt lives in
  [coach/system-prompt.md](coach/system-prompt.md).

## Rules

- **Language:** repo docs, code and comments in English. Text visitors see in
  the world (dialogues, station UI, coach answers) in German, Swiss spelling
  («ss», never «ß»). Texts we received in German (the submission, the official
  challenge text) stay German.
- A widget is **one single HTML file** with all CSS and JS inside. External
  libraries only from a CDN with a pinned version.
- No code from the Hazu platform or the Hazu World engine in this repo. Only
  what we build during the hackathon, plus docs.
- Never commit credentials, tokens, `.env` files or real personal data.
- Never name a real school or real people. The world is a vision, not a copy.
- Only one person in the level builder at a time (the level is one document;
  the last save wins).
- Add every new tool, library and AI tool to [docs/tools.md](docs/tools.md)
  (required by the challenge).
- After each milestone, update [docs/progress.md](docs/progress.md) with the
  time. The jury judges progress made during the 24 hours.

## Who does what

| Person | Area |
| ------ | ---- |
| Gabriel | World, level builder, wiring stations into hazu.app, tech |
| Partner | Personas, content of the places, stations (widgets) |

## Links

- Hazu (private): https://hazu.app/HIx4jrkOAhhawUaTpPN4
- World: https://hazu.app/TRAIMeIVPNXq5wfkfTG2

## Hazu IDs

| What | ID |
| ---- | -- |
| Schulwelt (world Hazu) | `TRAIMeIVPNXq5wfkfTG2` |
| Schulhaus (interior: Aula, Lernatelier, Coaching, Workshop, Pause) | `_m0-qRVAAUwmuxfswuPp` |
| Sägestation (widget station in the Werkstatt) | `3UrjDNf8urw8VD-7OEo5` |
| Werkstatt (workshop) | `tZNMXBltrzdnsVkElfhC` |
| Coaching-Raum (coaching room, now inside the Schulhaus; Hazu unused) | `hJ73ZiKWocRZADF25pQj` |
| Garten und Hof (garden and yard) | `bK_FhPCxRBLKvMG4_flE` |
| Küche (kitchen) | `QWixzEpPTgQYY09Ww8cH` |
| Lernatelier (study studio, now inside the Schulhaus; Hazu unused) | `frRqjhqx-Bk_71Wu9o8C` |
| Dorfplatz (village square) | `eEES-rZbllKEqy1uuiRX` |
| Figuren (Genius configurations) | `JITvlYasVsTNZ1MgXOPp` |
