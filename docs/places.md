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

## Current layout

- **Village (Bergdorf):** arrival only. The Schulhaus stands on the square and
  Joel greets visitors (route step ⓪). Werkstatt, Küche and Garten are in
  «Reserve» on hazu.app, not in the visitor's path.
- **Schulhaus interior** (`level/schulhaus.json`, dollhouse rooms as data,
  24 x 18 tiles): Bibliothek, Aula and Interessen-Atelier in the north; a
  corridor with lockers; Lernatelier, Coaching-Raum, Pausenzone and
  Workshop-Raum in the south; the entrance hall runs from the corridor to the
  exit. A wide passage in the east joins the Coaching-Raum and the
  Workshop-Raum (⑤ → ⑥). Tile ranges per room: `skills/npc/SKILL.md`.

Route characters show their route number in the subtitle (e.g. «⑤ Coach ·
1:1»; Yara «▶ Start · Tagesplan»), and the level lists them in route order,
so the world panel and the «Übersicht» follow the route. Background
characters (`backgroundNpcs` in `level/route-dialogues.mjs`) fill the house:
muted colours, subtitle «Lernende/Lernender · im Haus», a short intro and a
closing line, no quiz. They are not tasks.

Who stands where:

| Room | Characters | Station |
| ---- | ---------- | ------- |
| Eingangshalle (entrance hall) | Yara, next to the board | Tagesplan |
| Aula | Frau Arnold, Matilda; background: Elin and Dario by the stage | – |
| Lernatelier | Lea and Joel at one table, Frau Sutter (Mathematik, «Mathe-Fixpunkt»), Quirin; background: Ronja and Andri at the back table | – |
| Interessen-Atelier | Tobi | – |
| Coaching-Raum | Herr Meinhard (Genius coach), between the armchairs on the east side | Konflikt in der Projektgruppe |
| Workshop-Raum | Herr Tesla, by the screen east of the workbenches | Säure-Base-Labor |
| Corridor | background: Nils and Anouk at the west lockers | – |
| Bibliothek | background: Seraina and Gian at the bookcase | – |
| Pausenzone | background: Ladina, Flurin and Noemi by the low table | – |

## Route

| Step | Place | What the visitor meets |
| ---- | ----- | ---------------------- |
| ⓪ | Village square | Joel greets and points to the Schulhaus |
| – | Eingangshalle | Yara at the Tagesplan: fixed and free blocks, plan your own day |
| ① | Aula | Morgenrunde with Frau Arnold; Matilda says what she plans today |
| ② | Lernatelier | Lea and Joel learn together (videos, comprehension questions, asking each other first) |
| ③ | Lernatelier | Mathe-Fixpunkt with Frau Sutter: binding goals, feedback rather than a mark; Quirin's maths in his project |
| ④ | Interessen-Atelier | Tobi's own project, an audio walk |
| ⑤ | Coaching-Raum | 1:1 with Herr Meinhard; Konflikt station on request |
| ⑥ | Workshop-Raum | optional workshop with Herr Tesla, Säure-Base-Labor |
| ⑦ | Aula | Abendrunde (sign only): show what moved forward and what stays open |

## Places

| Place | What it is about | Station (widget) | Safety | Interior | Status |
| ----- | ---------------- | ---------------- | ------ | -------- | ------ |
| Village square (Dorfplatz) | arrival; Joel greets | – | – | open square, no interior | live |
| Schulhaus · Eingangshalle | the frame of the day: time, rooms, people | Tagesplan (`widgets/tagesplan/`) with Yara: plan the free blocks, «Sicht Coach», «Im Haus» | – | live | live |
| Schulhaus · Aula | Morgenrunde and Abendrunde | – | – | live | live |
| Schulhaus · Lernatelier | self-study at your own level, Mathe-Fixpunkt | – | – | live | live |
| Schulhaus · Interessen-Atelier | time and space for what a learner cares about | – | – | live | live |
| Schulhaus · Coaching-Raum | 1:1 conversation, goals, follow-up (formative) | talk to Herr Meinhard (Genius): the visitor speaks as themselves; Konflikt in der Projektgruppe (`widgets/konflikt/`): decide for Joel in a group conflict | – | live | live |
| Schulhaus · Workshop-Raum | optional workshops with Herr Tesla | Säure-Base-Labor (`widgets/saeuren-basen/`): safety gear, hypothesis, red-cabbage indicator, pH scale | safety glasses, gloves, never taste | live | live |
| Schulhaus · Bibliothek, Pausenzone | quiet reading, lunch and breaks | – | – | live, background characters only | live |
| Werkstatt (workshop) | plan and build a coop or a raised bed | Sägestation (`widgets/saegestation/`): protective gear, hazards, safe sawing order | ear protection, safety glasses, cables, saw guard | `level/werkstatt.json` | Reserve |
| Küche (kitchen) | cook together | – | hygiene, knives, hot pans | – | Reserve |
| Garten und Hof (garden and yard) | look after animals, tend beds | – | safe lifting, tools | – | Reserve |

Also in Reserve: Luca's «Ein Mathematikvormittag» widget. Its content (Lea
and Joel, Frau Sutter) now lives in the Lernatelier characters.

## Station: Tagesplan (daily overview)

The frame of the day, from the concept notes. One widget at the board in the
entrance hall, introduced by Yara.

- **Mein Tag:** fixed points for everyone (Morgenrunde, Mathe-Fixpunkt,
  Mittag, Abendrunde) and free blocks the visitor fills: Lernzeit, Eigenes
  Projekt, Workshop, 1:1, Konflikt station, Pause. Each choice names a room.
  Rule in this example: at least one block of Lernzeit for the binding goals.
- **Sicht Coach:** fictional learners through the day: where they are, who
  asks for help, a formative status (not a mark) and the next step.
- **Im Haus:** what the visitor finds in each room.

Technical: the saved plan is a private Hazu item created through the bridge
(`createItem`), so it survives a reload.
