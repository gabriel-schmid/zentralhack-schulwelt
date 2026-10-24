# Places and stations

## How the world is laid out

- **Exterior:** the world Hazu «Schulwelt» is the village itself. Its level is
  designed in the builder; each house stands for one place.
- **Interiors:** each place is a sub-Hazu of the world. Walking through its
  door opens that place on its own, and it gets its own level (the room
  inside), designed in the builder while you are in it. Punkte inside the
  place become its characters and boards.
- **Stations** are widgets at a place (see
  [skills/widget/SKILL.md](../skills/widget/SKILL.md)).

## Current layout (01:30)

- **Village (Bergdorf):** Schulhaus on the square, Werkstatt, Küche, Garten und
  Hof; Hauswart Toni and Jana outside.
- **Schulhaus interior** (`level/schulhaus.json`, dollhouse rooms as data):
  Aula (morning and evening circle, Frau Arnold, Lea, Noah), Lernatelier (Mia),
  Coaching-Raum (Coach Sandro, Genius), Workshop-Raum (Frau Keller), Pausenzone.
- **Werkstatt interior** (`level/werkstatt.json`) with the Sägestation.

## Places

| Place | What it is about | Station (widget) | Safety | Interior | Status |
| ----- | ---------------- | ---------------- | ------ | -------- | ------ |
| Dorfplatz (village square) | start and end of the day, presenting projects (summative) | **Dashboard** (see below) | – | open square, no interior | open |
| Werkstatt (workshop) | plan and build a coop or a raised bed | Sägestation (`widgets/saegestation/`): pick protective gear, spot hazards, saw in the safe order | ear protection, safety glasses, cables, saw guard | live (`level/werkstatt.json`) | in progress |
| Coaching-Raum (coaching room) | 1:1 conversation, goals, Friday feedback (formative) | talk to the AI coach | – | yes | open |
| Lernatelier (study studio) | independent work at your own level | weekly plan, minimum requirements | – | yes | open |
| Garten und Hof (garden and yard) | look after animals, tend beds | open | safe lifting, tools | later | open |
| Küche (kitchen) | cook together | open | hygiene, knives, hot pans | later | open |
| Interessen-Atelier (special interests) | time and space for what a learner cares about | open | – | later | proposed, not on hazu.app yet |

Minimum goal: the village plus three interiors fully playable (Werkstatt,
Coaching-Raum, Lernatelier).

## Station: Dashboard (daily overview)

The frame of the day, from the concept notes. One widget, opened on the
village square.

- **Morning briefing:** what today is about, the learner's goals.
- **Book a 1:1:** pick a slot with the coach.
- **Progress path:** a timeline with milestones; a reached milestone is
  ticked.
- **Closing round:** tell what happened, note highlights.
- **Friday:** 1:1 and feedback.

Technical: progress and highlights are saved as Hazu items through the bridge
(`createItem` / `updateItem`), so they survive a reload. The briefing and the
closing round can use Genius (e.g. a short summary of the day's highlights).

## Lernatelier: mathematics morning

Local observer demo implemented in `widgets/mathematikvormittag/index.html`.
Five scenes, two learner perspectives, preparation, formative feedback and
changing personal plans. See [setup and scope](mathematics-demo.md).
Status: browser-tested locally; upload and live Hazu wiring pending.
