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
- At most about 8 characters per level; more makes the scene crowded and slow.

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
  intro: "Hallo, ich bin Sandro …",
  isGenius: true,
  geniusSystemPrompt: "Du bist Sandro, Coach im Bergdorf … Antworte immer auf Deutsch in Schweizer Schreibweise …",
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

| Room | Columns (gx) | Rows (gy) | Who belongs there |
| ---- | ------------ | --------- | ----------------- |
| Aula (morning and evening circle) | 7–15 | 2–6, avoid the bench rows | teacher, class |
| Lernatelier | 1–5 | 1–6 | learners working on their plan |
| Coaching-Raum | 17–21 | 1–6 | coach |
| Workshop-Raum | 15–20 | 8–14 | workshop leader, participants |
| Pausenzone / hall | 1–13 | 8–14 | anyone |

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
