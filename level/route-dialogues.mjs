// Dialogue texts for the «Vormittag» route through the Schulhaus, based on
// Luca's six-scene mathematics morning (branch codex/mathe). The route numbers
// ①–⑦ match the door signs. This file is the single source for the route's
// characters and texts; the level generators import and place them.
//
// Each scripted character is a guided conversation (docs/concept-coverage.md
// lists the concept elements each one carries):
//   intro     the character's opening line
//   talk(…)   2–3 conversation turns: the character's next line, then
//             visitor replies that are all «correct» and carry no feedback,
//             so any reply continues the conversation
//   quiz(…)   one real question that follows from the conversation, correct
//             option first; mixAnswers() reorders it when the level is built
//   complete  closing line that points to the next route stop

// A conversation turn: the character speaks, every reply moves on. The
// feedback replaces the engine's «Richtig!», which reads oddly for a reply.
const talk = (line, ...replies) => ({
  type: "choice",
  question: line,
  options: replies.map((text) => ({ text, correct: true, feedback: "…" })),
});
// The one real question: the correct answer first, then the wrong ones.
const quiz = (question, right, ...wrong) => ({
  type: "choice",
  question,
  options: [{ text: right, correct: true }, ...wrong.map((text) => ({ text, correct: false }))],
});

// Characters by route step. Tiles are placed in build-schulhaus.mjs; `room`
// names the target room.
export const routeNpcs = [
  // ① Aula, Morgenrunde
  { id: "lehrerin", name: "Frau Arnold", color: "#3288EF", subject: "① Lehrerin · Morgenrunde", room: "Aula", extra: { female: true, hat: "glasses" } },
  // ① Aula
  { id: "matilda", name: "Matilda", color: "#EC4899", subject: "① Lernende · kreativ, frech", room: "Aula", extra: { female: true, hat: "beret" } },
  // ② Lernatelier, at one table with Joel
  { id: "lea", name: "Lea", color: "#F97316", subject: "② Lernende · liest gern, genau", room: "Lernatelier", extra: { female: true } },
  // ② Lernatelier, at one table with Lea (a second Joel greets in the village)
  { id: "joel", name: "Joel", color: "#22C55E", subject: "② Lernender · sportlich, neugierig", room: "Lernatelier", extra: {} },
  // ③ Lernatelier, the mathematics teacher at the Mathe-Fixpunkt
  { id: "mathe", name: "Frau Sutter", color: "#14B8A6", subject: "③ Mathematik · Fixpunkt", room: "Lernatelier", extra: { female: true, look: { hairStyle: "short" } } },
  // ② Lernatelier, by the hall door
  { id: "quirin", name: "Quirin", color: "#0EA5E9", subject: "② Lernender · Tüftler, zweifelt oft", room: "Lernatelier", extra: { look: { hairStyle: "spiky" } } },
  // ④ Interessen-Atelier
  { id: "tobi", name: "Tobi", color: "#22C55E", subject: "④ Lernender · schnell, oft gelangweilt", room: "Interessen-Atelier", extra: { hat: "cap", look: { hairStyle: "short" } } },
  // ⑤ Coaching-Raum (Genius; build-schulhaus.mjs adds COACH_PROMPT)
  { id: "coach", name: "Herr Meinhard", color: "#8B5CF6", subject: "⑤ Coach · 1:1", room: "Coaching-Raum", extra: { isGenius: true, hat: "glasses", look: { hairStyle: "short", hair: "#b8b4ad" } } },
  // ⑥ Workshop-Raum
  { id: "workshop", name: "Herr Tesla", color: "#F97316", subject: "⑥ Workshop-Coach · Technik", room: "Workshop-Raum", extra: { look: { hairStyle: "short" } } },
  // Entrance hall, next to the Tagesplan (before ①)
  { id: "yara", name: "Yara", color: "#EAB308", subject: "▶ Start · Tagesplan", room: "Eingangshalle", extra: { female: true } },
];

export const routeDialogue = {
  // Entrance hall, Tagesplan: plan your day, fixed vs free blocks, the coaches
  // see the plans, a 1:1 can be booked. Leads to ①.
  yara: {
    intro:
      "Hoi, ich bin Yara, 1. Jahr. Planen ist mein Ding: Gerade organisiere ich einen Tausch- und Flicknachmittag. Und hier am Tagesplan planst du deinen eigenen Schultag.",
    hint: "Herr Meinhard ist der Coach im Coaching-Raum. Bei ihm kann man Zeit buchen.",
    phases: [
      { type: "intro" },
      talk(
        "Die dunklen Blöcke sind Fixpunkte für alle: Morgenrunde, Mathe-Fixpunkt und Abendrunde. Die hellen füllst du selbst. Jeder Block führt dich in einen Raum hier im Haus.",
        "Was kann ich in die hellen legen?",
        "Darf ich wirklich alles frei wählen?",
      ),
      talk(
        "Lernzeit, eigenes Projekt, Workshop oder Pause. Eine Regel gilt hier im Beispiel: mindestens ein Block Lernzeit für die verbindlichen Ziele.",
        "Und wenn ich Hilfe brauche?",
        "Schaut das jemand an?",
      ),
      talk(
        "Die Coaches sehen alle Pläne und merken so früh, wer Hilfe braucht. Und wenn du selbst Hilfe willst, buchst du dir einen freien Block für ein 1:1 bei Herrn Meinhard.",
        "Praktisch.",
        "Hast du das schon gemacht?",
      ),
      quiz(
        "Ich habe heute selbst eins gebucht. Und du: Was kannst du in einen freien Block legen, wenn du Hilfe willst?",
        "Ein 1:1 beim Coach, Herrn Meinhard",
        "Nichts, freie Blöcke sind nur für Pausen",
        "Einen zweiten Mathe-Fixpunkt für alle",
      ),
      {
        type: "complete",
        message:
          "Genau. In meinem 1:1 geht es ums Aufräumen: Für meinen Nachmittag will das niemand machen. Jetzt geh durch Tür ① in die Aula, dort beginnt der Tag mit der Morgenrunde.",
      },
    ],
  },
  // ① Aula, Morgenrunde: structure, fixed points, briefing, evening circle.
  // The quiz and closing line also cover ⑦ (Abendrunde), which has only a sign.
  lehrerin: {
    intro:
      "Guten Morgen, ich bin Frau Arnold! Hier in der Aula beginnt und endet jeder Tag. Fix sind heute drei Dinge: die Morgenrunde hier, der Mathe-Fixpunkt im Lernatelier und am Schluss die Abendrunde, wieder hier.",
    hint: "Am Abend schaut ihr zurück: Was hat geklappt, was ist noch offen?",
    phases: [
      { type: "intro" },
      talk(
        "Am Morgen gibt es ein kurzes Briefing: Was steht heute an, wer ist in welchem Raum? Dann sagt jede und jeder in einem Satz, was er oder sie heute vorhat.",
        "Muss ich auch etwas sagen?",
        "Wozu laut sagen?",
      ),
      talk(
        "Ein Plan, den man laut sagt, gilt mehr, und die anderen wissen, wen sie fragen können. Dazwischen plant ihr selbst. Am Abend kommen wir wieder hier zusammen.",
        "Und was passiert dann?",
        "Und wenn nichts geklappt hat?",
      ),
      quiz(
        "Jede und jeder erzählt ein Highlight. Auch was noch offen ist oder beinahe schiefging, gehört dazu: Daraus lernen alle. Was zeigt ihr also in der Abendrunde?",
        "Ein Highlight und was noch offen ist",
        "Eine Prüfung über den ganzen Tag",
        "Nur, was perfekt geklappt hat",
      ),
      {
        type: "complete",
        message:
          "Genau, das ist die Abendrunde, Nummer ⑦ hier in der Aula. Bis dahin folgst du den Nummern an den Türen. Frag zuerst Matilda nach ihrem Plan, dann geht es ins Lernatelier, Tür ②.",
      },
    ],
  },
  // ① Aula: her own plan for today; not everything must interest everyone;
  // belonging to her class and mixed ages.
  matilda: {
    intro:
      "Hoi, ich bin Matilda, 3. Jahr. Mein Plan für heute: Ich frage alle Gäste meines nächsten Mittagessens, was sie nicht essen können. Beim letzten Mal habe ich das vergessen, peinlich.",
    hint: "Ich habe es gerade gesagt: am Anfang und am Schluss des Tages.",
    phases: [
      { type: "intro" },
      talk(
        "Danach rechne ich aus, wie viel ich für zwölf Portionen brauche und was es kostet. Das ist heute meine Mathe. Kochst du gern?",
        "Ja, sehr!",
        "Eher nicht.",
      ),
      talk(
        "Ob ja oder nein: Nicht alles muss alle interessieren. Ich zeichne zum Beispiel sehr gern, aber Plakate fürs Essen mache ich keine. Das Zeichnen gehört gerade nur mir.",
        "Allein planen klingt einsam.",
        "Und deine Klasse?",
      ),
      talk(
        "Allein bin ich trotzdem nicht. Hier in der Morgenrunde sitze ich mit meiner Klasse, am Abend auch. In der Lernzeit sitze ich oft neben Jüngeren, das hilft beiden.",
        "Klingt gut.",
        "Neben Jüngeren? Wieso das?",
      ),
      quiz(
        "Wer erklärt, versteht es selbst besser. Kleine Frage: Wo treffe ich heute meine Klasse?",
        "In der Morgen- und der Abendrunde hier in der Aula",
        "Gar nicht, Klassen gibt es hier keine mehr",
        "Nur im 1:1 beim Coach",
      ),
      {
        type: "complete",
        message:
          "Genau. Meinen Tag plane ich selbst, zur Klasse gehöre ich trotzdem. Geh jetzt ins Lernatelier, Tür ②: Lea und Joel sind in verschiedenen Jahren und helfen sich gegenseitig.",
      },
    ],
  },
  // ② Lernatelier, same table as Joel: videos and comprehension questions
  // done alone beforehand, ask each other first, then Frau Sutter; the
  // percentage base; different help for different needs.
  lea: {
    intro:
      "Hoi, ich bin Lea, 2. Jahr. Joel neben mir ist im 3. Jahr. Unsere Mathe-Videos haben wir vorher allein geschaut und die Verständnisfragen selbst beantwortet. Jetzt üben wir hier zusammen.",
    hint: "Rechne 20 % von 100 und 20 % von 120.",
    phases: [
      { type: "intro" },
      talk(
        "Joel sagt immer: Video geschaut heisst noch nicht verstanden. Darum fragen wir uns zuerst gegenseitig. Erst wenn wir beide festsitzen, gehen wir zu Frau Sutter.",
        "Warum nicht gleich zu ihr?",
        "Und das klappt?",
      ),
      talk(
        "Frau Sutter hat viele Leute, und oft weiss Joel es schon. Mein Problem: 100 Franken plus 20 % gibt 120, minus 20 % gibt 96. Joel sagt, es liegt am Grundwert.",
        "Ich hätte auch 100 erwartet.",
        "Was ist der Grundwert?",
      ),
      quiz(
        "Der Grundwert ist das, worauf sich die Prozente beziehen. Warum gibt 120 − 20 % nicht wieder 100?",
        "Die 20 % beziehen sich jetzt auf 120, das sind 24 Franken",
        "Weil man bei Prozenten immer auf ganze Zahlen rundet",
        "Weil Prozente beim Abziehen nicht gelten",
      ),
      {
        type: "complete",
        message:
          "Genau, zwei verschiedene Grundwerte. Das zeichne ich jetzt als Balken. Ich brauche ein zweites Beispiel, Joel eine Probe für seinen Term: gleicher Tisch, ganz verschiedene Hilfe. Frag ihn mal.",
      },
    ],
  },
  // ② Lernatelier, same table as Lea: his own goal (linear functions), the
  // test by substitution, preparation is not proof.
  joel: {
    intro:
      "Ich bin Joel, 3. Jahr. Den Grundwert habe ich Lea vorhin erklärt, jetzt hilft sie mir. Sie arbeitet an Prozenten, ich an linearen Funktionen. Gleicher Tisch, andere Ziele.",
    hint: "Setz x = 2 ein und vergleiche mit der Tabelle: 46 Franken.",
    phases: [
      { type: "intro" },
      talk(
        "T-Shirts drucken kostet 30 Franken Grundgebühr und 8 Franken pro Stück. Meine Tabelle stimmt: 1 Stück 38, 2 Stück 46. Mein Term K(x) = 30x + 8 aber nicht.",
        "Woher weisst du das?",
        "Hast du es Lea gezeigt?",
      ),
      talk(
        "Lea sagt, ich soll eine Probe machen: x einsetzen und mit der Tabelle vergleichen. Das Video habe ich geschaut, aber geschaut heisst noch nicht verstanden.",
        "Und, hast du die Probe gemacht?",
        "Gute Idee von Lea.",
      ),
      quiz(
        "Mach du sie: K(2) müsste 46 geben. Was stimmt an K(x) = 30x + 8 nicht?",
        "Grundgebühr und Preis pro T-Shirt sind vertauscht",
        "Nichts, der Term passt zur Tabelle",
        "Es fehlt eine Klammer um 30x + 8",
      ),
      {
        type: "complete",
        message:
          "Genau: K(x) = 30 + 8x. Probe: K(2) = 30 + 16 = 46. Am Mathe-Fixpunkt will Frau Sutter, dass ich erkläre, was die 30 und die 8 bedeuten. Sie steht dort an der Wandtafel, Nummer ③.",
      },
    ],
  },
  // ③ Lernatelier, Mathe-Fixpunkt: binding goals derived by teachers from the
  // curriculum, freedom on the way, the rhythm of Fixpunkt and accompanied
  // Lernzeit, formative feedback, summative later under the existing rules.
  mathe: {
    intro:
      "Ich bin Frau Sutter, Mathematik. Hier ist der Mathe-Fixpunkt. Lea arbeitet an Prozenten, Joel an linearen Funktionen. Beide haben verbindliche Lernziele, den Weg dahin planen sie selbst.",
    hint: "Die Rückmeldung unterwegs ist formativ, die Prüfung ist summativ.",
    phases: [
      { type: "intro" },
      talk(
        "Die verbindlichen Lernziele leiten wir Lehrpersonen aus dem Lehrplan ab, dabei haben wir etwas Spielraum. Wie, wann und mit welchem Projekt ihr sie erreicht, plant ihr selbst.",
        "Und wenn jemand sie nicht erreicht?",
        "Also doch nicht ganz frei?",
      ),
      talk(
        "Frei von Anfang an, aber verbindlich: Wer die Ziele nicht erreicht, kann das Fach nicht bestehen. Darum frage ich hier nach Erklärungen und gebe früh eine Rückmeldung, ohne Note.",
        "Und nach dem Fixpunkt?",
        "Wie oft gibt es das?",
      ),
      quiz(
        "Nach dem Fixpunkt kommt begleitete Lernzeit, dann der nächste Fixpunkt. Ersetzt die Rückmeldung am Fixpunkt die Prüfung?",
        "Nein, die Prüfung folgt später nach dem geltenden Notenreglement",
        "Ja, wer den Fixpunkt schafft, hat bestanden",
        "Ja, an dieser Schule gibt es keine Noten",
      ),
      {
        type: "complete",
        message:
          "Genau. Die Rückmeldung zeigt früh, ob es reicht, damit die Prüfung keine Überraschung wird. Wer auf mich wartet, notiert Frage und bisherige Versuche. Weiter geht es im Interessen-Atelier, Tür ④.",
      },
    ],
  },
  // ② Lernatelier, by the door: freedom from the start while the minimum
  // requirements stay; «Wieso lerne ich das?» answered by his bus project.
  quirin: {
    intro:
      "Hoi, ich bin Quirin, 1. Jahr. Nach dem Training verpasse ich immer knapp den Bus und warte dann ewig. Das untersuche ich jetzt, mit einer Liste aller Fahrten.",
    hint: "Freiheit ist hier keine Belohnung für bestandene Prüfungen.",
    phases: [
      { type: "intro" },
      talk(
        "In Mathe habe ich die Mindestanforderungen noch nicht geschafft. Trotzdem darf ich an meinem Projekt arbeiten, schon seit dem ersten Tag. Hättest du das gedacht?",
        "Nein, ich dachte, zuerst kommt Mathe.",
        "Ja, warum nicht?",
      ),
      talk(
        "Freiheit gibt es hier nicht erst als Belohnung. Die Mindestanforderungen bleiben aber, Mathe lasse ich nicht einfach weg. Manchmal frage ich mich, ob Schule überhaupt was für mich ist.",
        "Das kenne ich.",
        "Wie passt das zusammen?",
      ),
      talk(
        "Mein Projekt hilft. Wieso lerne ich Zeitspannen rechnen? Jetzt weiss ich es: Fahrpläne lesen und Wartezeiten ausrechnen ist Mathe, für meinen eigenen Bus.",
        "Das ist ja echte Mathe.",
        "Macht Sinn.",
      ),
      quiz(
        "Kleine Frage an dich: Warum darf ich am Bus-Projekt arbeiten, obwohl ich in Mathe noch nicht so weit bin?",
        "Freiheit gilt von Anfang an, die Mindestanforderungen bleiben",
        "Ich darf es nicht, zuerst muss ich alle Prüfungen bestehen",
        "Weil Mathe hier nicht zählt",
      ),
      {
        type: "complete",
        message:
          "Genau. Ein Problem bleibt: Ein früherer Bus wäre gut für mich, aber dann verpassen ihn die anderen. Das schaue ich mit Herrn Meinhard an. Schau dir jetzt Lea und Joel am Tisch an.",
      },
    ],
  },
  // ④ Interessen-Atelier: a quick learner who gets bored builds his own
  // project in free learning time, which also serves a language goal; testing
  // and feedback are normal; he learns to watch testers instead of explaining.
  tobi: {
    intro:
      "Hoi, ich bin Tobi, 2. Jahr. Ich verstehe Sachen schnell und langweile mich dann auch schnell. Darum baue ich in der freien Lernzeit einen Audio-Pfad ums Schulhaus, mit Geräuschen und gesprochenen Wegweisern. Das Thema habe ich selbst gewählt.",
    hint: "Wenn ich daneben stehe und erkläre, sehe ich nicht, wo die anderen wirklich hängen bleiben.",
    phases: [
      { type: "intro" },
      talk(
        "Mathe und Deutsch bleiben trotzdem im Plan. Sprachen sind eigentlich nicht so meins, aber die Wegweiser muss ich genau formulieren. Das zählt für mein Deutsch-Ziel.",
        "Praktisch!",
        "Wer testet den Pfad?",
      ),
      talk(
        "Andere testen den Pfad, und alle verpassen dieselbe Abzweigung. Dabei finde ich sie total klar. Hier testen wir gegenseitig unsere Sachen, Rückmeldung gehört dazu, auch für mich.",
        "Ärgert dich das nicht?",
        "Und was machst du jetzt?",
      ),
      quiz(
        "Zuerst hat mich das geärgert. Was hilft mir am meisten, um herauszufinden, woran es liegt?",
        "Beim nächsten Test mitlaufen und beobachten, ohne zu helfen",
        "Den Testenden den Weg vorher genau erklären",
        "Die Abzweigung einfach weglassen",
      ),
      {
        type: "complete",
        message:
          "Genau das meint Herr Meinhard auch: Morgen laufe ich beim Test nur mit und sage nichts. Danach frage ich, was unklar war. Er ist im Coaching-Raum, Tür ⑤.",
      },
    ],
  },
  // ⑤ Coaching-Raum: intro only. build-schulhaus.mjs adds COACH_PROMPT.
  coach: {
    intro:
      "Hallo, ich bin Herr Meinhard, Coach. Hier geht es um dich: Was willst du erreichen? Zwingen kann ich niemanden, die Motivation kommt von dir. Ich helfe dir, deinen Grund zu finden. Am Schluss halten wir deinen nächsten Schritt fest. Am Freitag schauen wir im 1:1, ob es geklappt hat.",
    isGenius: true,
  },
  // ⑥ Workshop-Raum: optional workshop with expert knowledge, his own solar
  // project and the feedback he asks for, points to the Säure-Base-Labor.
  workshop: {
    intro:
      "Willkommen im Workshop-Raum, ich bin Herr Tesla! Ich komme aus Physik und Elektrotechnik. Meine Workshops sind freiwillig: Wer kommt, will es wissen. Das mag ich.",
    hint: "Freiwillig, und mit Wissen aus Physik und Technik für deine Projekte.",
    phases: [
      { type: "intro" },
      talk(
        "Ich bringe Fachwissen, das ihr in euren eigenen Projekten brauchen könnt: Strom, Energie, Messen. Was im Fachunterricht kurz kommt, schauen wir hier genauer an.",
        "Und was baust du selbst?",
        "Muss ich vorher etwas können?",
      ),
      talk(
        "Mitbringen musst du nur Neugier. Ich selbst baue gerade eine kleine Solar-Ladestation: Sie läuft, aber die Testenden verstehen ihre Anzeigen nicht. Also frage ich sie, was unklar ist.",
        "Du fragst Lernende um Rat?",
        "Das ist ehrlich.",
      ),
      quiz(
        "Klar, auch ich lerne noch und brauche Rückmeldung. Und du: Warum gibt es hier Workshops?",
        "Sie bringen Fachwissen, das man im eigenen Projekt braucht",
        "Weil man dort Noten sammelt",
        "Weil alle hingehen müssen",
      ),
      {
        type: "complete",
        message:
          "Genau. Heute ist hier das Säure-Base-Labor offen: Mit Rotkohlsaft testest du, was sauer und was basisch ist. Die Schutzausrüstung wählst du dort selbst, bevor du mischst: Was man selbst entschieden hat, merkt man sich besser als eine Regel auf Papier. Danach zurück in die Aula, zur Abendrunde ⑦.",
      },
    ],
  },
};

// ⓪ Village (build-bergdorf.mjs, id `joel`): greets, points to Yara's
// Tagesplan in the entrance hall and to door ①.
export const routeVillage = {
  joel: {
    intro:
      "Hoi, ich bin Joel! Hier lernt man auch in eigenen Projekten, ich mache eine Audiokarte über Treffpunkte im Dorf. Am Morgen Mathe, später Interviews draussen. Den ganzen Tag still sitzen muss hier niemand.",
    hint: "Die Aula hat die Nummer eins, dort sind alle am Anfang des Tages.",
    phases: [
      { type: "intro" },
      talk(
        "Deinen Tag planst du drinnen am Tagesplan, Yara zeigt ihn dir in der Eingangshalle. Fix für alle ist zuerst die Morgenrunde in der Aula, Tür Nummer eins.",
        "Klingt gut, ich gehe rein.",
        "Und danach?",
      ),
      quiz(
        "Die Nummern an den Türen führen dich durch den Vormittag. Wo beginnt der Tag für alle?",
        "In der Morgenrunde in der Aula, Tür ①",
        "Hier draussen auf dem Dorfplatz",
        "Wann und wo man will, es gibt keinen Start",
      ),
      {
        type: "complete",
        message:
          "Genau! Die Tür ist vorne am Schulhaus, unter dem blauen Vordach. Ich muss los, die Morgenrunde fängt gleich an. Wir sehen uns im Lernatelier, da rechne ich mit Lea.",
      },
    ],
  },
};

// Door and room signs for the route (proposal; ⑦ covers the evening circle
// because characters cannot move between scenes).
export const routeSigns = [
  { step: 1, room: "Aula", text: "① Morgenrunde" },
  { step: 2, room: "Lernatelier", text: "② Zusammen lernen" },
  { step: 3, room: "Lernatelier", text: "③ Mathe-Fixpunkt" },
  { step: 4, room: "Interessen-Atelier", text: "④ Eigene Projekte" },
  { step: 5, room: "Coaching-Raum", text: "⑤ Coaching" },
  { step: 6, room: "Workshop-Raum", text: "⑥ Säure-Base-Labor" },
  { step: 7, room: "Aula", text: "⑦ Abendrunde: Highlights erzählen und zeigen, was offen bleibt" },
];

// Background characters: learners (and one visitor in the village) who just
// stand around and make the house feel lived in. Muted shirts and the
// subject «… im Haus» / «… unterwegs» tell them apart from the route
// characters, whose subject starts with the route number. Each has only an
// intro and a closing line, no question, so the task counter skips them.
// Their lines hint at confirmed concept points (docs/shared-concept.md) in an
// everyday way. Tiles are placed in build-schulhaus.mjs / build-bergdorf.mjs.
const chat = (intro, message) => ({ intro, phases: [{ type: "intro" }, { type: "complete", message }] });

export const backgroundNpcs = [
  // Pausenzone, around the low table
  { id: "ladina", name: "Ladina", color: "#A8A29E", subject: "Lernende · im Haus", room: "Pausenzone", extra: { female: true, look: { hairStyle: "ponytail", hair: "#6b4a2b" } } },
  { id: "flurin", name: "Flurin", color: "#93B4D6", subject: "Lernender · im Haus", room: "Pausenzone", extra: { hat: "cap", look: { hairStyle: "short", hatColor: "#5f6b78" } } },
  { id: "noemi", name: "Noemi", color: "#D6C7A1", subject: "Lernende · im Haus", room: "Pausenzone", extra: { female: true, look: { hairStyle: "long", hair: "#2b1d14", scale: 0.94 } } },
  // corridor, at the lockers
  { id: "nils", name: "Nils", color: "#9CA3AF", subject: "Lernender · im Haus", room: "Korridor", extra: { look: { hairStyle: "spiky", hair: "#c9a36a", scale: 0.93 } } },
  { id: "anouk", name: "Anouk", color: "#A3B8CC", subject: "Lernende · im Haus", room: "Korridor", extra: { female: true, look: { hairStyle: "bun", hat: "beanie", hatColor: "#8E9AAF" } } },
  // Bibliothek, at the bookcase
  { id: "seraina", name: "Seraina", color: "#BFB5A8", subject: "Lernende · im Haus", room: "Bibliothek", extra: { female: true, hat: "glasses", look: { hairStyle: "bob", hair: "#4a3426" } } },
  { id: "gian", name: "Gian", color: "#8E9AAF", subject: "Lernender · im Haus", room: "Bibliothek", extra: { look: { hairStyle: "short", hair: "#1f1712" } } },
  // Aula, in front of the benches on the east side
  { id: "elin", name: "Elin", color: "#C8B89A", subject: "Lernende · im Haus", room: "Aula", extra: { female: true, hat: "scarf", look: { hairStyle: "long", hair: "#8a5a36", scarf: "#7d8b99" } } },
  { id: "dario", name: "Dario", color: "#A7B5A0", subject: "Lernender · im Haus", room: "Aula", extra: { look: { hairStyle: "short", hair: "#3b2a1e" } } },
  // Lernatelier, at the free back table
  { id: "ronja", name: "Ronja", color: "#9FB1BF", subject: "Lernende · im Haus", room: "Lernatelier", extra: { female: true, look: { hairStyle: "ponytail", hair: "#b5651d" } } },
  { id: "andri", name: "Andri", color: "#B5A89A", subject: "Lernender · im Haus", room: "Lernatelier", extra: { hat: "glasses", look: { hairStyle: "short", hair: "#6b4a2b", scale: 0.92 } } },
];

export const backgroundDialogue = {
  ladina: chat("Ich hab heute zwei freie Blöcke für mein Projekt. Nach der Pause geht's los.", "Bis später!"),
  flurin: chat("Im Workshop bei Herrn Tesla war's spannend. Jetzt weiss ich, wie ich in meinem Projekt messen kann.", "Mach's gut!"),
  noemi: chat("Nicht jedes Thema muss mich packen. Die Mindestanforderungen schaffe ich trotzdem.", "Tschüss!"),
  nils: chat("Am Freitag hab ich mein 1:1 bei Herrn Meinhard. Wir schauen, ob mein Plan aufgeht.", "Bis bald!"),
  anouk: chat("Ich frag zuerst die anderen, dann die Lehrerin. Meistens weiss es schon jemand.", "Bis später!"),
  seraina: chat("«Wieso lerne ich das?» darf man hier fragen. Ich such gerade die Antwort für mein Projekt.", "Viel Spass noch!"),
  gian: chat("Zuerst die Mindestanforderungen, dann bau ich weiter. Das Buch hier hilft mir dabei.", "Bis später!"),
  elin: chat("Am Morgen sitze ich hier mit meiner Klasse. Danach plane ich meinen Tag selbst.", "Wir sehen uns!"),
  dario: chat("Heute Abend zeige ich mein Highlight hier in der Aula. Und was noch offen ist.", "Bis zur Abendrunde!"),
  ronja: chat("Am Fixpunkt gibt's eine Rückmeldung, keine Note. So sehe ich früh, ob ich auf Kurs bin.", "Bis später!"),
  andri: chat("Ronja hilft mir bei den Brüchen. Wer erklärt, versteht es selbst besser, sagt sie.", "Tschüss!"),
};

// Background characters in the village (build-bergdorf.mjs).
export const backgroundVillageNpcs = [
  // on the square, by the fountain
  { id: "livio", name: "Livio", color: "#9CA3AF", subject: "Lernender · unterwegs", place: "Dorfbrunnen", extra: { hat: "cap", look: { hairStyle: "short", hatColor: "#7d8b99" } } },
  { id: "mara", name: "Mara", color: "#D6C7A1", subject: "Lernende · unterwegs", place: "Dorfbrunnen", extra: { female: true, look: { hairStyle: "bob", hair: "#2b1d14", scale: 0.94 } } },
  // at the bus stop, an adult visitor
  { id: "silvan", name: "Silvan", color: "#A8A29E", subject: "Besuch", place: "Bushaltestelle", extra: { hat: "glasses", look: { hairStyle: "short", hair: "#8d8780", scale: 1.05 } } },
  // on the meadow by the goals
  { id: "selin", name: "Selin", color: "#93B4D6", subject: "Lernende · unterwegs", place: "Wiese", extra: { female: true, look: { hairStyle: "ponytail", hair: "#3b2a1e", hat: "beanie", hatColor: "#A7B5A0" } } },
];

export const backgroundVillageDialogue = {
  livio: chat("Ich mache heute Interviews im Dorf, für mein Projekt. Nachher geht's zurück ins Schulhaus.", "Bis später!"),
  mara: chat("Gleich ist Morgenrunde in der Aula. Dort sag ich, was ich heute vorhabe.", "Komm auch!"),
  silvan: chat("Ich bin zu Besuch und schaue mir heute den Schultag an. Mal sehen, wie viel die Lernenden selbst planen.", "Einen schönen Tag!"),
  selin: chat("In der Pause spielen wir hier Fussball. Danach hab ich Lernzeit für Mathe.", "Tschüss!"),
};
