---
name: npc
description: How to write and place NPCs (characters, dialogues, quizzes, AI coaches) for the Schulwelt levels. Read before adding or changing a character, its dialogue or a quiz.
---

# NPCs in the Schulwelt

Characters live in the level generators, not on hazu.app and not in the
generated JSON. Edit the generator, regenerate, and Gabriel (or Claude)
uploads the level.

| Level | Generator | Where the characters are |
| ----- | --------- | ------------------------ |
| Village (Bergdorf) | `level/build-bergdorf.mjs` | `const npcs` and `const dialogue` |
| Schulhaus interior | `level/build-schulhaus.mjs` | same |
| Werkstatt interior | `level/build-werkstatt.mjs` | same |

Never edit `level/*.json` by hand; the next build overwrites it.

## A character

```js
npc("mia", 2, 6, "Mia", "#EAB308", "Lernende · Lernatelier", { female: true, hat: "scarf" })
//   id   gx gy  name   colour     subtitle under the name   options
```

- `id`: lowercase, no spaces, unique in the level. The dialogue uses the same id.
- `gx, gy`: tile position (column, row). The tile must be free floor, not
  furniture or a wall. If unsure, give the room and Gabriel/Claude places it.
- `hat`: one of `glasses`, `cap`, `beret`, `sunhat`, `baker`, `scarf`,
  `stethoscope`, `shawl`, `chef`, or leave it out.
- `female: true` for the female body; leave it out otherwise.
- Keep the count small: every character costs frame time. The Schulhaus has
  21 (10 route characters and 11 background characters); treat that as the
  ceiling and add a character only to a room that has none.

### Background characters

Background characters (`backgroundNpcs` and `backgroundDialogue` in
`level/route-dialogues.mjs`) make the house feel used without adding tasks:

- dialogue: an `intro` and a `complete` line only, no quiz;
- muted, greyish colours, so the route characters stand out;
- subtitle «Lernende · im Haus» / «Lernender · im Haus» («unterwegs» in the
  village), never a route number;
- they do not count as tasks: the progress and the «Übersicht» are the
  route characters' quizzes only.

Route characters carry their route number at the start of the subtitle
(«① Lehrerin · Morgenrunde»), and the generator lists them in route order
(Yara «▶ Start» first, background characters last): the world panel and the
«Übersicht» show them in that order.

## A scripted dialogue

```js
mia: {
  intro: "Im Lernatelier mache ich meinen Wochenplan …",   // first line, shown when you press X
  hint: "Mindestanforderungen zuerst …",                   // shown on the hint button during a question
  phases: [
    { type: "intro" },
    {
      type: "choice",
      question: "Was machst du, wenn …?",
      options: [
        { text: "Die richtige Antwort", correct: true },   // ALWAYS write the correct answer first
        { text: "Falsch A", correct: false },
        { text: "Falsch B", correct: false },
      ],
    },
    { type: "complete", message: "Schlusssatz nach der richtigen Antwort." },
  ],
},
```

- Write the correct option **first**. `level/lib.mjs` (`mixAnswers`) moves it
  to a stable, varied position when the level is built; don't shuffle by hand.
- Exactly one option is correct; three options per question.
- A character without a question: `phases: [{ type: "intro" }, { type: "complete", message: "…" }]`.
- Keep texts short: `intro` up to about 300 characters (it types out letter by
  letter), questions one sentence, options under about 70 characters.
- Visitor-facing text is German, Swiss spelling: «ss», never «ß».

## An AI character (Genius)

```js
coach: {
  intro: "Hallo, ich bin Herr Meinhard …",
  isGenius: true,
  geniusSystemPrompt: "Du bist Herr Meinhard, Coach im Schulhaus … Antworte immer auf Deutsch in Schweizer Schreibweise …",
},
```

Also set `isGenius: true` in the character's `npc(...)` options.

- Each AI conversation costs credits; keep it to the coach and at most one or
  two experts (e.g. Frau Keller for workshops).
- The prompt carries the character's role, knowledge and limits. Base it on
  [docs/shared-concept.md](../../docs/shared-concept.md) and
  [docs/pedagogy.md](../../docs/pedagogy.md): confirmed decisions may be stated
  as facts; open decisions and assumptions must not be presented as settled.
- Safety: an AI character never replaces instruction by a qualified person and
  says so when real work with tools, animals or the kitchen is involved.

## Rooms in the Schulhaus (tile ranges)

The Schulhaus is 24 x 18 tiles: three rooms in the north, a corridor across
the building, four rooms south of it, and the entrance hall in the middle
running down to the exit. The floor plan is drawn at the top of
`level/build-schulhaus.mjs`.

| Room | Columns (gx) | Rows (gy) | Who belongs there |
| ---- | ------------ | --------- | ----------------- |
| Bibliothek | 0–5 | 0–5 | readers, a librarian |
| Aula (morning and evening circle) | 6–17 | 0–5, avoid the stage (row 0–1) and bench rows | teacher, class |
| Interessen-Atelier | 18–23 | 0–5 | learners on their own project |
| Corridor | 0–23 | 6–7 | anyone passing by; keep doorways free |
| Lernatelier | 0–9 | 8–12 | learners working on their plan |
| Entrance hall | 10–13 | 8–17 | visitors, Hauswart; keep row 16–17 free (exit) |
| Coaching-Raum | 14–23 | 8–12 | coach |
| Pausenzone | 0–9 | 13–17 | anyone |
| Workshop-Raum | 14–23 | 13–17 | workshop leader, participants |

Don't put a character on a room's name sign (the anchor tile: 1/1, 7/1,
22/1, 1/9, 13/9, 22/9, 1/16, 22/16) or on furniture; `node level/build-schulhaus.mjs`
does not check that, so look at it in the world after uploading.

## Workflow

1. Persona first: fill in [docs/personas.md](../../docs/personas.md) (role,
   traits, how they talk, what you learn with them, first line).
2. Add or change the character in the right generator.
3. Check: `node level/build-<level>.mjs` must print `wrote …` without errors.
4. Commit and push; tell Gabriel which level changed. Gabriel/Claude validate
   it against the engine, upload it and pin it in the world.
5. Note it in [docs/progress.md](../../docs/progress.md).

## Don'ts

- No real people, no real school, no real names of teachers or pupils.
- No quiz whose «correct» answer is a matter of opinion about the school
  model; quiz facts (safety rules, how the day works), discuss opinions.
- Don't rename an existing `id` without telling Gabriel (links and positions
  depend on it).
