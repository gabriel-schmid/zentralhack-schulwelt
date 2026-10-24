# Concept coverage

Snapshot of 24 October 2026 (late evening). Checks which concept elements the
world explains to a visitor, where, and with which line or mechanic. Sources:
[concept-notes.md](concept-notes.md), [shared-concept.md](shared-concept.md),
[pedagogy.md](pedagogy.md), [idea.md](idea.md), [personas.md](personas.md),
[places.md](places.md), [challenge.md](challenge.md), [safety.md](safety.md),
Luca's `docs/mathematics-demo.md` (branch `codex/mathe`), the level generators
`level/build-schulhaus.mjs` and `level/build-bergdorf.mjs`, the route texts in
`level/route-dialogues.mjs` and the stations `widgets/tagesplan/`,
`widgets/konflikt/` and `widgets/saeuren-basen/`.

The level generators were being edited while this was written. Quotes reflect
the files at that moment; recheck before relying on an exact line.

Status:

- **covered**: a visitor on the route meets a clear line or mechanic.
- **weak**: present only implicitly, only in an optional branch, only in the
  Genius prompt (not guaranteed to come up), or in an outdated text.
- **missing**: no visitor-facing line or mechanic.

Open decisions from shared-concept.md stay open. Where a suggestion below
touches one, it is marked **(open)** and the dialogue must say so or avoid
stating it as fact.

## 1. Concept elements

### From concept-notes.md

What works in today's school (keep):

1. Lernen, **Durchmischung** – learning in mixed ages/groups
2. **Klassen, Zugehörigkeit** – classes, belonging
3. **Respekt gegenüber LP, Vorbildfunktion** – respect towards teachers, role models
4. **Viele Fächer / Abwechslung** – many subjects, variety
5. **Klare Struktur** – clear structure
6. **Feedbackkultur** – feedback culture

What is missing (add):

7. **Innere Differenzierung** – differentiation between individual learners
8. **Praxisbezug: «Wieso lerne ich das?»** – practical relevance
9. **Interesse / Wahlmöglichkeiten** – room for interests and choice

Core idea: **Raum für intrinsische Motivation** (10), held by:

11. **Struktur: Zeit, Räume, Personen/Coaches**
12. **Überprüfbarkeit** – it can be checked
13. **Abwechslung** (same as 4; counted once)
14. **Mindestanforderung / LP** – minimum requirements, set with the teacher
15. **Verbindlichkeit** – commitment

Dashboard / Überblick:

16. **Briefing vom Tag**
17. **1:1 planbar** – bookable 1:1
18. **Abschluss / Erzählen / Highlights**
19. **Freitag: 1:1 und Feedback**
20. **Timeline mit Meilensteinen** (progress path)

Building blocks:

21. **Lehrer-Persona**
22. **Besonderes Interesse** (room for choice; overlaps 9)
23. **Rahmenbedingungen**: zeitliche Struktur, Räume, Lehrplan/Lernziel
24. **Formatives → summatives Assessment**

(«NPC prompting ← Vorlage + Personas» is a production method, not something a
visitor should understand; it is left out of the table.)

### From shared-concept.md

Confirmed decisions:

25. Binding **minimum requirements** from the framework curriculum, **derived by
    teachers/the school** (teachers keep some scope)
26. Minimum objectives are **assessed**; missing them can mean failing a
    subject or stage
27. **Existing grading regulations stay in force** (which regulation: open)
28. **Freedom from the beginning**, including the route to the minimum
    requirements; not a reward after passing
29. Broad freedom within the binding frame (exact scope: open)
30. **Coaches advise but cannot force**; learning cannot be forced
31. **Formative assessment shows risk early** (risk of failing the summative
    assessment and the subject)
32. **Disciplinary measures as last resort** (triggers: open)

Design priorities:

33. Not every learner has to feel interested in every activity
34. Transfer of shared competencies to personal interests
35. «Wieso lerne ich das?» stays a legitimate question (with 8)
36. Internal vs external differentiation (between individuals vs groups)
37. Specialisation alongside shared minimum objectives
38. Time, spaces, curriculum, formative and summative assessment made explicit

Luca's additions (mathematics morning):

39. **Teacher videos + comprehension questions done independently before a
    checkpoint**; preparation is not proof of understanding
40. **Shared checkpoints alternate with accompanied self-study**

Further elements named for the world:

41. **Optional workshops with expert knowledge**
42. **Morning and evening class meetups** (Morgen-/Abendrunde)
43. **1:1 coaching**
44. **Safety as a side element** (Suva as the source, see safety.md)

## 2. Coverage table

Route steps: ⓪ village, then entrance hall (Tagesplan), ① Aula, ② ③
Lernatelier, ④ Interessen-Atelier, ⑤ Coaching-Raum, ⑥ Workshop-Raum, ⑦ Aula
(sign only).

| # | Element | Where now / planned | Line or mechanic | Status |
| - | ------- | ------------------- | ---------------- | ------ |
| 1 | Durchmischung | ② Lea (2. Jahr) and Joel (3. Jahr) at one table; Tagesplan Mathe-Fixpunkt | Joel: «Dafür habe ich ihr vorhin den Grundwert erklärt.» Tagesplan: «Verbindlicher Fachtermin für alle Jahrgänge.» Nobody names the mixing as a value | weak |
| 2 | Klassen, Zugehörigkeit | – | No line. Frau Arnold's «Wer erzählt, was er oder sie heute vorhat?» implies a group but never says «Klasse» | missing |
| 3 | Respekt gegenüber LP, Vorbild | – (persona material only: Meinhard «role-model type», Tesla asks for feedback on his own design) | No line | missing |
| 4/13 | Abwechslung | ① Frau Arnold; Tagesplan free blocks | Arnold: «Dazwischen plant ihr selbst: Fach, eigenes Projekt, Coaching oder Workshop.» Tagesplan options Lernzeit / Eigenes Projekt / Workshop / 1:1 / Pause | covered |
| 5 | Klare Struktur | ① Frau Arnold; hall Yara + Tagesplan | Arnold: «Fix sind heute drei Dinge…» Yara: «Die dunklen Blöcke sind fix, die hellen füllst du selbst.» Choice «Welche Blöcke sind heute für alle fix?» | covered |
| 6 | Feedbackkultur | ③ Frau Sutter; ④ Tobi (testers); Tagesplan Abendrunde; Konflikt «Probedurchlauf» | Sutter: «Rückmeldung, keine Note». Tobi: «Alle Testenden verpassen die gleiche Abzweigung.» Feedback as a normal, two-way habit is never named | weak |
| 7/36 | Innere Differenzierung | ③ Frau Sutter; Tagesplan «Sicht Coach» | Sutter: «Lea Prozente, Joel lineare Funktionen» is a difference by year (external). Coach view shows different status and next step per learner, but only if the visitor opens that tab | weak |
| 8/35 | Praxisbezug «Wieso lerne ich das?» | ② Quirin; ① Matilda; ② Joel | Quirin: «Fahrpläne lesen und Wartezeiten ausrechnen ist Mathe.» Matilda: quantities and cost for twelve portions. Joel: T-shirt cost term. The question itself is only in the Genius prompt | covered |
| 9/22 | Interesse / Wahlmöglichkeiten, besonderes Interesse | ④ Tobi, Interessen-Atelier; Tagesplan «Eigenes Projekt» | Tobi: «In der freien Lernzeit baue ich einen Audio-Pfad…» Tagesplan: «Zeit für das, was dich interessiert.» | covered |
| 10 | Raum für intrinsische Motivation (core) | ⑥ Tesla; Konflikt station | Tesla: «Der Workshop ist freiwillig: Wer kommt, will es wissen.» Konflikt, Meinhard: «Die Motivation dafür muss von euch kommen, nicht von mir.» The core idea is never stated on the main route | weak |
| 11/23/38 | Struktur / Rahmenbedingungen: Zeit, Räume, Personen | Tagesplan (Yara); door signs ①–⑦; «Im Haus» tab | «Jede Wahl führt zu einem Ort hier im Schulhaus.» Each block names a room and a person. Lehrplan/Lernziel: see 14 | covered |
| 12 | Überprüfbarkeit | ③ Frau Sutter; Tagesplan status | Sutter: «Am Checkpoint frage ich nach Erklärungen.» Joel: «Video geschaut heisst aber noch nicht verstanden.» | covered |
| 14/25 | Mindestanforderung / LP, derived by teachers | ③ Frau Sutter; ② Quirin; Tagesplan rule | Sutter: «Jede Klasse hat verbindliche Lernziele.» Tagesplan: «Mindestens ein Block Lernzeit für die verbindlichen Ziele.» That teachers derive them from the framework curriculum, with some scope, is not said | weak (binding: covered; derivation: missing) |
| 15 | Verbindlichkeit | ⑤ Meinhard intro; Tagesplan rule; Konflikt | Meinhard: «Am Schluss halten wir deinen nächsten Schritt fest.» Konflikt: «Schreib es auf. Am Freitag schauen wir kurz darauf.» Follow-up of an agreement is only in the optional station | weak |
| 16/42 | Briefing vom Tag, Morgenrunde | ① Frau Arnold, Matilda; Tagesplan «Morgenrunde» | Arnold intro; Matilda states her plan. Tagesplan: «Briefing: Was steht heute an?» | covered |
| 17 | 1:1 planbar | Tagesplan option «1:1 bei Herrn Meinhard» | A free block can be booked as 1:1. No character says it | weak |
| 18/42 | Abschluss / Highlights, Abendrunde | ① Frau Arnold (choice + complete); sign ⑦; Tagesplan «Abendrunde» | Arnold choice: «Wir zeigen, was weitergekommen ist und was noch offen ist.» Tagesplan: «Highlights erzählen». At ⑦ there is only a sign, no character | weak |
| 19 | Freitag: 1:1 und Feedback | Konflikt (Freitag · Probedurchlauf); coach prompt | Konflikt only. pedagogy.md lists it; no route line | missing (route) |
| 20 | Timeline / progress path with milestones | Konflikt shows Montag → Freitag with a formative meter | No milestone path; the Tagesplan covers one day | missing |
| 21 | Lehrer-Persona | Frau Arnold, Frau Sutter, Herr Meinhard, Herr Tesla | All four speak. Frau Arnold and Frau Sutter have no entry in personas.md | covered (docs gap) |
| 24 | Formativ → summativ | ③ Frau Sutter; Tagesplan coach view; Konflikt meter | Sutter choice: «Ersetzt die Rückmeldung am Checkpoint die Prüfung?» → «Nein, die Prüfung folgt später nach dem geltenden Notenreglement». pedagogy.md still calls the Dorfplatz presentation the summative moment, which shared-concept open decision 6 does not confirm | covered (doc conflict) |
| 26 | Minimum objectives assessed; failing possible | Konflikt endings; coach prompt | Konflikt: «Für die Mindestanforderung fehlt dein eigener Nachweis.» No route line says that failing a subject is possible | weak |
| 27 | Grading regulations unchanged | ③ Frau Sutter; Tagesplan coach view | «nach dem geltenden Notenreglement»; «nach dem bestehenden Notenreglement» | covered |
| 28 | Freedom from the beginning | ② Quirin; ③ Sutter; ① Arnold; Tagesplan | Quirin: «In Mathe habe ich die Mindestanforderungen noch nicht geschafft, und trotzdem darf ich an meinem Projekt arbeiten.» Choice «Freiheit gilt von Anfang an, die Mindestanforderungen bleiben». Sutter: «Den Weg dahin planen sie selbst.» | covered |
| 29 | Scope of freedom (open) | Tagesplan | «Regel in diesem Beispiel» marks the rule as an example | covered (kept open) |
| 30 | Coaches advise, cannot force | Konflikt (Meinhard); Genius prompt | «Zum Lernen zwingen kann ich dich nicht.» Only on one Konflikt branch and in the prompt; Meinhard's fixed intro does not say it | weak |
| 31 | Formative shows risk early | ③ Sutter complete; Tagesplan status «gefährdet»; Konflikt meter | Sutter: «Die Rückmeldung zeigt früh, ob es für die Lernziele reicht, damit die Prüfung keine Überraschung wird.» | covered |
| 32 | Disciplinary measures last resort (triggers open) | Konflikt, branch «Was passiert, wenn ich einfach nichts mache?» | «…als letztes Mittel auch Disziplinarmassnahmen möglich. So weit soll es nicht kommen.» Only one branch | weak (acceptable as a side detail) |
| 33 | Not every activity must interest everyone | ① Matilda | «Und nein, ich zeichne keine Plakate dafür. Zeichnen ist gerade nur für mich.» | covered |
| 34 | Transfer of shared competencies to interests | Tagesplan Tobi («schreibt eine Wegbeschreibung genauer (Sprachziel)»); ② Quirin | Visible in the coach view; Tobi's dialogue says «Mathe und Deutsch bleiben im Plan» but not that his project serves a Sprachziel | weak |
| 37 | Specialisation alongside minimum objectives | ④ Tobi; ② Quirin | Implicit in both | weak |
| 39 | Videos + comprehension questions before checkpoints | ② Lea, Joel; Tagesplan Mathe-Fixpunkt | Lea: «Joel und ich haben unsere Mathe-Videos geschaut und die Verständnisfragen selbst beantwortet.» Joel: «Video geschaut heisst aber noch nicht verstanden.» | covered |
| 40 | Checkpoints alternate with accompanied self-study | ② Lea; ③ Sutter; Tagesplan Fixpunkt → Lernzeit | Lea: «Zuerst fragen wir uns gegenseitig, erst dann Frau Sutter.» Sutter: «Wer auf mich wartet, notiert die Frage…» The rhythm (checkpoint, then accompanied Lernzeit, then the next checkpoint) is not said | weak |
| 41 | Optional workshops with expert knowledge | ⑥ Herr Tesla; Säure-Base-Labor | «Der Workshop ist freiwillig.» Optional: covered. Expertise (why a workshop coach rather than the class teacher) is not said | weak |
| 43 | 1:1 coaching | ⑤ Herr Meinhard (Genius) | «Jetzt geht es um dich, nicht um eine Rolle.» Live conversation with the visitor | covered |
| 44 | Safety (Suva) | ⑥ Säure-Base-Labor; Sägestation (Werkstatt, not on the route) | Lab: protective gear step, «nie etwas davon kosten». Source given as «Allgemeine Laborregeln für den Chemieunterricht»; no Suva source anywhere in `widgets/` or `level/` | weak |

Inconsistencies found while checking (to fix, not concept gaps):

- Tagesplan tab «Im Haus» still says Aula «Hier triffst du Lea» and Pausenzone
  «Hier sind Yara und Matilda». On the route Lea is in the Lernatelier, Matilda
  in the Aula and Yara at the Tagesplan in the entrance hall.
- `route-dialogues.mjs` keeps a Pausenzone Yara with the formative question
  «Wozu sind die Rückmeldungen unterwegs da?». `build-schulhaus.mjs` overrides
  Yara with the Tagesplan text, so that question is no longer live (Frau Sutter
  now carries the formative point).
- Frau Arnold says «Mathe-Checkpoint»; the Tagesplan block is «Mathe-Fixpunkt».
  One term is easier for visitors.
- The Konflikt station is listed under the Workshop-Raum in places.md and under
  the Coaching-Raum in the Tagesplan. Its place in the world is not settled.
- pedagogy.md names the Dorfplatz presentation as the summative assessment;
  shared-concept.md (open decision 6) says a presentation alone is not yet an
  agreed assessment model. The Konflikt station correctly keeps it open.

## 3. Gaps and instructions for the dialogue writer

Dialogue format: `intro`, optional `hint`, optional `choice` (correct option
first), `complete`. «Step 1» = intro, «step 2» = choice, «step 3» = complete.
Each character carries the elements listed in its heading; the German lines are
proposals to adapt, not fixed text. Keep every line short (two to three
sentences) and in Swiss spelling.

### Joel, village ⓪ — Abwechslung (teaser for the route)

Current text covers projects and the route start. Small change only.

- **Step 1:** keep. Optionally add one sentence that fits his persona
  (dislikes sitting still): «Am Morgen Mathe, später Interviews draussen. Den
  ganzen Tag still sitzen muss hier niemand.»
- **Visitor understands:** a school day here mixes subjects and kinds of work.

### Yara, entrance hall / Tagesplan — Struktur (Zeit, Räume) and 1:1 planbar

Current text covers fixed vs free blocks. Missing: that a 1:1 can be booked,
and that each choice leads to a room.

- **Step 1:** keep fixed/free blocks. Add: «Jeder Block führt dich in einen
  Raum. Und wenn du Hilfe willst, buchst du dir einen Block beim Coach.»
- **Step 3 (complete):** keep the cleaning-up hook. Replace «Fach, eigenes
  Projekt, Coaching oder Workshop» (Frau Arnold already says it) with the
  minimum rule from the station: «Eine Regel gilt hier im Beispiel: mindestens
  ein Block Lernzeit für die verbindlichen Ziele.» The scope of free choice is
  **(open)**; keep «hier im Beispiel».
- **Visitor understands:** time and rooms are the frame; a 1:1 is something
  learners plan themselves.

### Frau Arnold, Aula ① — Briefing vom Tag and Abschluss/Highlights

Covered. Strengthen ⑦, where no character stands.

- **Step 3 (complete):** name the Abendrunde explicitly as highlights plus open
  points: «Am Abend erzählt jede und jeder ein Highlight und was noch offen
  ist.» Use «Mathe-Checkpoint» or «Mathe-Fixpunkt» consistently with the
  Tagesplan.
- **Sign ⑦:** keep the text; add «Highlights» so the sign alone carries the
  closing round.
- **Visitor understands:** the day starts with a briefing and ends with telling
  what worked and what is open.

### Matilda, Aula ① — Klassen/Zugehörigkeit and Durchmischung

Currently two steps (plan, no posters). The «no posters» line already carries
element 33; keep it. Add a choice step for belonging and mixing.

- **Step 1:** keep her plan, add one clause: «Die Morgenrunde mache ich mit
  meiner Klasse. In der Lernzeit sitze ich oft neben Jüngeren.»
- **Step 2 (new choice):** «Was bleibt, auch wenn alle ihren Tag selbst
  planen?» Correct: «Die eigene Klasse: Dort startet und endet der Tag.»
  Wrong: «Nichts, Klassen gibt es keine mehr» / «Man sieht nur noch den
  Coach.»
- **(open):** whether the Morgen-/Abendrunde is held by class or across years
  is a time-structure decision (shared-concept open decision 3). Confirm with
  the owner before stating «mit meiner Klasse» as a fact; otherwise phrase it
  as Matilda's own experience in this example.
- **Visitor understands:** freedom does not dissolve the class; belonging stays,
  and mixed ages meet during learning time.

### Quirin, Lernatelier ② — Freedom from the beginning and Praxisbezug

Covered and central. No change needed. If the writer touches it, keep the
choice «Freiheit gilt von Anfang an, die Mindestanforderungen bleiben» and the
timetable-is-mathematics line verbatim in meaning. Optionally say the question
aloud: «Wieso lerne ich Zeitspannen rechnen? Für meinen Bus.»

- **Visitor understands:** freedom is not a reward; school content gets a
  reason through his own question.

### Lea + Joel, Lernatelier ② — Preparation (videos + Verständnisfragen) and innere Differenzierung

Preparation is covered. Differentiation is not: they sit together but nobody
says that each gets different help for a different need.

- **Lea, step 1:** keep. **Lea, step 3:** after «Zuerst fragen wir uns
  gegenseitig», add: «Ich brauche ein zweites Beispiel, Joel eine Probe. Gleiche
  Stunde, ganz verschiedene Hilfe.»
- **Joel, step 3:** keep «Video geschaut heisst aber noch nicht verstanden.»
- Durchmischung is carried here implicitly (2. and 3. Jahr help each other);
  Matilda names it, so Lea and Joel need not.
- **Visitor understands:** preparation happens alone beforehand and is not
  proof; within one room each learner works on their own gap.

### Frau Sutter, Lernatelier ③ — Mindestanforderung (derived by teachers) and formative → summative

Formative → summative and grading regulations are covered. Missing: where the
minimum requirements come from, and the checkpoint/self-study rhythm (Luca).

- **Step 1:** replace «Jede Klasse hat verbindliche Lernziele» with: «Die
  verbindlichen Lernziele leiten wir Lehrpersonen aus dem Lehrplan ab. Die
  erreicht jede und jeder, den Weg plant ihr selbst.» Do not name a specific
  curriculum or school type **(open)**.
- **Step 3 (complete):** add the rhythm: «Nach dem Checkpoint kommt begleitete
  Lernzeit, dann der nächste Checkpoint.» Optionally add that missing the
  minimum can mean failing the subject: «Wer sie nicht erreicht, kann das Fach
  nicht bestehen. Darum soll die Rückmeldung früh kommen.»
- **Visitor understands:** the binding goals are set by teachers from the
  curriculum; checkpoints give early, ungraded evidence; the exam and grading
  rules stay.

### Tobi, Interessen-Atelier ④ — Interesse/Wahlmöglichkeiten and Feedbackkultur

Interest is covered. Feedback culture and transfer are implicit.

- **Step 1:** add the transfer: «Die Wegweiser muss ich genau formulieren, das
  zählt für mein Deutsch-Ziel.» (matches the Tagesplan «Sprachziel»).
- **Step 3 (complete):** make feedback a normal habit, not a verdict: «Hier
  testen wir gegenseitig unsere Sachen. Rückmeldung ist normal, auch für
  mich.»
- **Visitor understands:** own interests can serve shared goals, and feedback
  between learners is part of every project.

### Herr Meinhard, Coaching-Raum ⑤ — Raum für intrinsische Motivation (coaches cannot force) and Verbindlichkeit / Freitag 1:1

His fixed intro is the only guaranteed text; the Genius prompt already covers
most rules but the conversation may not reach them.

- **Step 1 (intro):** add the core idea and his limit: «Zwingen kann ich
  niemanden, lernen musst du schon selbst wollen. Ich helfe dir, deinen Grund
  zu finden.» Keep «Am Schluss halten wir deinen nächsten Schritt fest» and add
  the follow-up: «Am Freitag schauen wir, ob es geklappt hat.»
- Keep `isGenius` and `COACH_PROMPT`; no choice step.
- **Konflikt station:** keep difficulty / disagreement / refusal separate and
  the disciplinary line as a last resort. Exact triggers stay **(open)**; the
  station already says so implicitly («So weit soll es nicht kommen»). Keep
  the note «Wie Einzelbeiträge in Gruppenprojekten beurteilt werden, ist … noch
  nicht entschieden» **(open, decision 6)**.
- **Visitor understands:** the coach advises and helps find meaning; motivation
  cannot be forced; agreements are followed up on Friday.

### Herr Tesla, Workshop-Raum ⑥ — Optional workshop with expert knowledge and Vorbild

Optional is covered. Expertise and role model are missing. Safety is a side
note here, not one of his two elements.

- **Step 1:** add his expertise and his own project: «Ich bin Physiker und
  Ingenieur. Gerade baue ich selbst eine Solar-Ladestation, und ich lasse sie
  von euch testen.»
- **Step 2 (new choice):** «Warum gibt es Workshops bei Herrn Tesla?» Correct:
  «Er bringt Fachwissen, das man im eigenen Projekt brauchen kann.» Wrong:
  «Weil man dort Noten sammelt» / «Weil alle hin müssen.»
- **Step 3 (complete):** keep the safety sentence and add a source once one is
  checked. **Safety (Suva):** the lab currently cites «Allgemeine Laborregeln
  für den Chemieunterricht». Per safety.md, take the rule from official
  material and put the source next to it; do not invent a Suva rule. If no
  matching Suva document is found for school labs, keep the general source and
  say so.
- **Visitor understands:** workshops are voluntary and come from an expert; the
  teacher is a role model because he learns and asks for feedback too.

### Elements still without a carrier

- **Timeline / progress path with milestones (20):** no character can show a
  path across days. Proposal: a «Sicht Woche» in the Tagesplan, or a
  milestone line in the coach view. Until then, mention it in the pitch, not
  in a dialogue.
- **Respekt gegenüber LP (3):** carried as «Vorbild» by Herr Tesla; respect
  itself needs no extra line.
- **Persona docs:** add entries for Frau Arnold and Frau Sutter to
  personas.md so the teacher personas are documented like the others.

## 4. Visitor path

The physical route, and what each stop adds. The story builds twice: once
across the whole route (structure → freedom → support → evidence) and once in
miniature inside the Lernatelier.

1. **Village ⓪, Joel:** a day mixes subjects and projects; follow the numbers.
   (*structure, teaser*)
2. **Entrance hall, Yara + Tagesplan:** fixed and free blocks, each leads to a
   room, a 1:1 can be booked, one Lernzeit block is required in this example.
   (*structure: time, rooms, people*)
3. **Aula ①, Frau Arnold:** morning briefing, three fixed points, the evening
   round. **Matilda:** the class stays, ages mix, not everything has to
   interest everyone. (*structure, belonging*)
4. **Lernatelier ②, Quirin** (at the door): freedom from the start, the minimum
   requirements stay, his bus project is mathematics. (*freedom*)
5. **Lernatelier ②, Lea + Joel:** prepared with videos and questions, help each
   other, each needs different help. (*support*)
6. **Lernatelier ③, Frau Sutter:** goals derived by teachers, checkpoint gives
   early ungraded feedback, exam and grading rules unchanged. (*evidence*)
7. **Interessen-Atelier ④, Tobi:** own project serves a shared goal; testing
   and feedback are normal. (*freedom, deepened*)
8. **Coaching-Raum ⑤, Herr Meinhard:** the visitor talks as themselves;
   motivation cannot be forced; an agreement is followed up on Friday.
   Konflikt station: what happens when a group project stalls. (*support,
   then consequences*)
9. **Workshop-Raum ⑥, Herr Tesla:** voluntary expert workshop, safety first.
   (*support, choice*)
10. **Aula ⑦, sign:** highlights and open points. (*evidence, closing*)

Note: in the Tagesplan the Mathe-Fixpunkt (08:30) comes before the free
blocks, so evidence (③) appearing before Tobi (④) is consistent with the day.
If the team wants a strict structure → freedom → support → evidence order,
the alternative is to let visitors meet Tobi before the Lernatelier; that would
break the route numbering and is only a proposal.
