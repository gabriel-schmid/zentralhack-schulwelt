# Schulwelt – Zentral Hack 2026

A walkable 3D world that shows what school could be: a mountain village with a
workshop, coaching room, garden, kitchen, study studio and village square, plus
an AI coach.

- Idea and submission: [docs/idea.md](docs/idea.md)
- Challenge and judging: [docs/challenge.md](docs/challenge.md)
- Progress: [docs/progress.md](docs/progress.md)
- Tools, open source, AI: [docs/tools.md](docs/tools.md)

## For the jury

- **Problem:** self-directed learning, coaching and project work are hard to
  explain; you have to experience them.
- **Audience:** pupils, parents, teachers, schools.
- **Solution:** a walkable 3D world with learning places, interactive stations
  and an AI coach.
- **Existed before:** the Hazu World engine on hazu.app.
- **Built during the hackathon:** see [docs/progress.md](docs/progress.md) and
  the commits in this repo.

## Folders

| Folder | Contents |
| ------ | -------- |
| `docs/` | idea, challenge, places, personas, pedagogy, safety, progress, tools |
| `skills/` | guides for humans and AI: Hazu World, building widgets |
| `widgets/` | one station per folder; copy `_template/` to start |
| `coach/` | the AI coach's system prompt |
| `level/` | backups of level versions from the builder |

## Working with AI

- **Claude Code / Codex:** read `AGENTS.md` automatically.
- **ChatGPT:** create a project and upload `AGENTS.md`,
  `skills/widget/SKILL.md` and the relevant files from `docs/` as project
  files. Replace them there after bigger changes.

## Building a new station

1. Copy `widgets/_template/`, e.g. to `widgets/hazard-hunt/`.
2. Open `index.html` in a browser. Outside Hazu the template runs with mock
   data.
3. Commit and push. Gabriel uploads the file to hazu.app and turns it into a
   station in the world.
