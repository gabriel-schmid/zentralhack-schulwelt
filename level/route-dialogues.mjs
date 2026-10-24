// Dialogue texts for the «Vormittag» route through the Schulhaus, based on
// Luca's six-scene mathematics morning (branch codex/mathe). The route numbers
// ①–⑦ match the door signs. Format matches `dialogue` in build-schulhaus.mjs:
// correct option first, mixAnswers() reorders when the level is built.
// This file only holds texts and suggested characters; the level generators
// import and place them.

// Suggested characters, by route step. Tiles are placed by Gabriel; `room`
// names the target room. Changes against build-schulhaus.mjs are noted.
export const routeNpcs = [
  // ① Aula, Morgenrunde (unchanged)
  { id: "lehrerin", name: "Frau Arnold", color: "#3288EF", subject: "Lehrerin · Morgenrunde", room: "Aula", extra: { female: true, hat: "glasses" } },
  // ① Aula, moves here from the Pausenzone
  { id: "matilda", name: "Matilda", color: "#EC4899", subject: "Lernende · 3. Jahr", room: "Aula", extra: { female: true, hat: "beret" } },
  // ② Lernatelier, moves here from the Aula; sits at one table with Joel
  { id: "lea", name: "Lea", color: "#F97316", subject: "Lernende · 2. Jahr", room: "Lernatelier", extra: { female: true } },
  // ② Lernatelier, new in the Schulhaus (a second Joel greets in the village)
  { id: "joel", name: "Joel", color: "#22C55E", subject: "Lernender · 3. Jahr", room: "Lernatelier", extra: {} },
  // ③ Lernatelier, new: the mathematics teacher at the checkpoint
  { id: "mathe", name: "Frau Sutter", color: "#14B8A6", subject: "Mathematik · Checkpoint", room: "Lernatelier", extra: { female: true, look: { hairStyle: "short" } } },
  // Lernatelier (unchanged)
  { id: "quirin", name: "Quirin", color: "#0EA5E9", subject: "Lernender · Lernatelier", room: "Lernatelier", extra: { look: { hairStyle: "spiky" } } },
  // ④ Interessen-Atelier (unchanged)
  { id: "tobi", name: "Tobi", color: "#22C55E", subject: "Lernender · Interessen-Atelier", room: "Interessen-Atelier", extra: { hat: "cap", look: { hairStyle: "short" } } },
  // ⑤ Coaching-Raum (unchanged; keeps COACH_PROMPT)
  { id: "coach", name: "Herr Meinhard", color: "#8B5CF6", subject: "Coach · 1:1", room: "Coaching-Raum", extra: { isGenius: true, hat: "glasses", look: { hairStyle: "short", hair: "#b8b4ad" } } },
  // ⑥ Workshop-Raum (unchanged)
  { id: "workshop", name: "Herr Tesla", color: "#F97316", subject: "Workshop-Coach · Technik", room: "Workshop-Raum", extra: { look: { hairStyle: "short" } } },
  // Pausenzone (unchanged)
  { id: "yara", name: "Yara", color: "#EAB308", subject: "Lernende · Pausenzone", room: "Pausenzone", extra: { female: true } },
];

export const routeDialogue = {
  // ① Aula, Morgenrunde. The complete message also covers ⑦ (Abendrunde),
  // together with the ⑦ sign in the Aula (see routeSigns).
  lehrerin: {
    intro:
      "Guten Morgen! Fix sind heute drei Dinge: die Morgenrunde hier, der Mathe-Checkpoint im Lernatelier und am Schluss die Abendrunde, wieder hier. Dazwischen plant ihr selbst: Fach, eigenes Projekt, Coaching oder Workshop. Wer erzählt, was er oder sie heute vorhat?",
    hint: "Am Abend schaut ihr zurück auf den Tag.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was passiert am Schluss des Tages hier in der Aula?",
        options: [
          { text: "Wir zeigen, was weitergekommen ist und was noch offen ist", correct: true },
          { text: "Wir schreiben eine Prüfung über den ganzen Tag", correct: false },
          { text: "Nichts, der Tag endet im Workshop", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau, das ist die Abendrunde. Bis dahin: Folge den Nummern an den Türen. Nummer zwei ist das Lernatelier, dort rechnen Lea und Joel schon.",
      },
    ],
  },
  // ① Aula: Matilda names her plan in the morning circle.
  matilda: {
    intro:
      "Mein Plan für heute: Bevor ich für mein nächstes Mittagessen einkaufe, frage ich alle Gäste, was sie nicht essen können. Beim letzten Mal habe ich das vergessen, peinlich. Danach rechne ich aus, wie viel ich für zwölf Portionen brauche und was es kostet.",
    phases: [
      { type: "intro" },
      { type: "complete", message: "Und nein, ich zeichne keine Plakate dafür. Zeichnen ist gerade nur für mich." },
    ],
  },
  // ② Lernatelier, same table as Joel. Lea and Joel refer to each other.
  lea: {
    intro:
      "Hoi, ich bin Lea. Joel und ich haben unsere Mathe-Videos geschaut und die Verständnisfragen selbst beantwortet. Meine Rechnung: 100 Franken plus 20 % gibt 120, minus 20 % gibt 96. Stimmt, aber erklären kann ich es nicht. Joel sagt, es liegt am Grundwert.",
    hint: "Rechne 20 % von 100 und 20 % von 120.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Warum ist 120 − 20 % nicht wieder 100?",
        options: [
          { text: "Die 20 % beziehen sich jetzt auf 120, das sind 24 Franken", correct: true },
          { text: "Weil man bei Prozenten immer auf ganze Zahlen rundet", correct: false },
          { text: "Weil Prozente beim Abziehen nicht gelten", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau, zwei verschiedene Grundwerte. Das zeichne ich jetzt als Balken. Zuerst fragen wir uns gegenseitig, erst dann Frau Sutter. Und Joel braucht gerade mich: Sein Term passt nicht zur Tabelle.",
      },
    ],
  },
  // ② Lernatelier, same table as Lea.
  joel: {
    intro:
      "Ich bin Joel. T-Shirts drucken kostet 30 Franken Grundgebühr und 8 Franken pro Stück. Meine Tabelle stimmt: 1 Stück 38, 2 Stück 46. Mein Term K(x) = 30x + 8 aber nicht. Lea sagt, ich soll eine Probe machen. Dafür habe ich ihr vorhin den Grundwert erklärt.",
    hint: "Setz x = 2 ein und vergleiche mit der Tabelle: 46 Franken.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was stimmt an K(x) = 30x + 8 nicht?",
        options: [
          { text: "Grundgebühr und Preis pro T-Shirt sind vertauscht", correct: true },
          { text: "Nichts, der Term passt zur Tabelle", correct: false },
          { text: "Es fehlt eine Klammer um 30x + 8", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau: K(x) = 30 + 8x. Probe: K(2) = 30 + 16 = 46. Video geschaut heisst aber noch nicht verstanden. Am Checkpoint will Frau Sutter, dass ich erkläre, was die 30 und die 8 bedeuten.",
      },
    ],
  },
  // ③ Lernatelier, Mathe-Checkpoint. The feedback question is phrased as
  // «does it replace the exam?» so it does not repeat Yara's question.
  mathe: {
    intro:
      "Ich bin Frau Sutter, Mathematik. Jede Klasse hat verbindliche Lernziele: Lea Prozente, Joel lineare Funktionen. Den Weg dahin planen sie selbst. Am Checkpoint frage ich nach Erklärungen und gebe eine Rückmeldung, keine Note. Und wer festsitzt, kann mich fragen.",
    hint: "Die Rückmeldung unterwegs ist formativ, die Prüfung ist summativ.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Ersetzt die Rückmeldung am Checkpoint die Prüfung?",
        options: [
          { text: "Nein, die Prüfung folgt später nach dem geltenden Notenreglement", correct: true },
          { text: "Ja, wer den Checkpoint schafft, hat bestanden", correct: false },
          { text: "Ja, an dieser Schule gibt es keine Noten", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau. Die Rückmeldung zeigt früh, ob es für die Lernziele reicht, damit die Prüfung keine Überraschung wird. Wer auf mich wartet, notiert die Frage und die bisherigen Versuche.",
      },
    ],
  },
  // Lernatelier: unchanged from build-schulhaus.mjs.
  quirin: {
    intro:
      "Nach dem Training verpasse ich immer knapp den Bus und warte dann ewig. Das untersuche ich jetzt, mit einer Liste aller Fahrten. In Mathe habe ich die Mindestanforderungen noch nicht geschafft, und trotzdem darf ich an meinem Projekt arbeiten.",
    hint: "Freiheit ist hier keine Belohnung für bestandene Prüfungen.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Warum darf Quirin am Bus-Projekt arbeiten, obwohl er in Mathe noch nicht so weit ist?",
        options: [
          { text: "Freiheit gilt von Anfang an, die Mindestanforderungen bleiben", correct: true },
          { text: "Er darf es nicht, zuerst muss er alle Prüfungen bestehen", correct: false },
          { text: "Weil Mathe hier nicht zählt", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau. Und das Projekt hilft sogar: Fahrpläne lesen und Wartezeiten ausrechnen ist Mathe. Ein früherer Bus wäre gut für mich, aber dann verpassen ihn die anderen. Das muss ich noch lösen.",
      },
    ],
  },
  // ④ Interessen-Atelier: own projects, plans change. Tobi tests Lea's
  // voting game, so Lea's tie appears here while she stays in the Lernatelier.
  tobi: {
    intro:
      "In der freien Lernzeit baue ich einen Audio-Pfad ums Schulhaus, mit Geräuschen und gesprochenen Wegweisern. Mathe und Deutsch bleiben im Plan. Nur: Alle Testenden verpassen die gleiche Abzweigung. Und bei Leas Abstimmungsspiel, das ich teste, stand es 2 zu 2 zu 1.",
    hint: "Zwei Vorschläge haben gleich viele Stimmen. Was sagt die Regel dazu?",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was fehlt in Leas erster Regel «Die meisten Stimmen gewinnen»?",
        options: [
          { text: "Was bei einem Gleichstand passiert", correct: true },
          { text: "Nichts, bei 2 zu 2 zu 1 gewinnt der Vorschlag mit 1 Stimme", correct: false },
          { text: "Nichts, bei Gleichstand gewinnt immer der erste Vorschlag", correct: false },
        ],
      },
      {
        type: "complete",
        message:
          "Genau. Lea ergänzt jetzt eine Stichwahl zwischen den beiden Ersten. Und ich? Herr Meinhard meint, ich soll morgen beim Test nur mitlaufen und nichts sagen. Mal schauen.",
      },
    ],
  },
  // ⑤ Coaching-Raum: new intro only. Keep isGenius and COACH_PROMPT as they
  // are; the integrating step sets geniusSystemPrompt: COACH_PROMPT.
  coach: {
    intro:
      "Hallo, ich bin Herr Meinhard, Coach hier im Schulhaus. Lea und Tobi waren heute schon bei mir. Jetzt geht es um dich, nicht um eine Rolle: Was möchtest du erreichen, und wo stehst du gerade? Ich frage nach. Am Schluss halten wir deinen nächsten Schritt fest.",
    isGenius: true,
  },
  // ⑥ Workshop-Raum: points to the open lab.
  workshop: {
    intro:
      "Willkommen im Workshop, ich bin Herr Tesla! Heute ist das Säure-Base-Labor offen: Mit Rotkohlsaft findest du heraus, was sauer und was basisch ist. Der Workshop ist freiwillig: Wer kommt, will es wissen. Das mag ich.",
    phases: [
      { type: "intro" },
      {
        type: "complete",
        message:
          "Zuerst Schutzbrille und Handschuhe. Und nie etwas davon kosten oder trinken. Danach darfst du mischen, so viel du willst. Zum Schluss geht es zurück in die Aula, zur Abendrunde.",
      },
    ],
  },
  // Pausenzone: unchanged from build-schulhaus.mjs.
  yara: {
    intro:
      "Ich organisiere einen Tausch- und Flicknachmittag für Kleider und Alltagsdinge. Viele wollen mitmachen, mega! Nur aufräumen will niemand. Und ob das Geld reicht, muss ich noch nachrechnen.",
    hint: "Bis zur Prüfung soll es keine Überraschung geben.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Wozu sind die Rückmeldungen unterwegs da?",
        options: [
          { text: "Sie zeigen früh, ob ich die Mindestanforderungen schaffe", correct: true },
          { text: "Sie ersetzen die Noten", correct: false },
          { text: "Sie sind nur für die Lehrpersonen", correct: false },
        ],
      },
      { type: "complete", message: "Genau. Beim Budget hat mir das schon geholfen: Jetzt weiss ich, wo ich noch üben muss." },
    ],
  },
};

// ⓪ Village (build-bergdorf.mjs, id `joel`): greets and points to ①.
export const routeVillage = {
  joel: {
    intro:
      "Hoi, ich bin Joel! Hier lernt man auch in eigenen Projekten, ich mache eine Audiokarte über Treffpunkte im Dorf. Jeder Tag beginnt mit der Morgenrunde in der Aula, Tür Nummer eins. Die Nummern an den Türen führen dich durch den Vormittag.",
    hint: "Die Tür ist vorne am Schulhaus, unter dem blauen Vordach.",
    phases: [
      { type: "intro" },
      {
        type: "complete",
        message: "Ich muss los, die Morgenrunde fängt gleich an. Wir sehen uns im Lernatelier, da rechne ich mit Lea.",
      },
    ],
  },
};

// Suggested door and room signs for the route (proposal; ⑦ covers the
// evening circle because characters cannot move between scenes).
export const routeSigns = [
  { step: 1, room: "Aula", text: "① Morgenrunde" },
  { step: 2, room: "Lernatelier", text: "② Zusammen lernen" },
  { step: 3, room: "Lernatelier", text: "③ Mathe-Checkpoint" },
  { step: 4, room: "Interessen-Atelier", text: "④ Eigene Projekte" },
  { step: 5, room: "Coaching-Raum", text: "⑤ Coaching" },
  { step: 6, room: "Workshop-Raum", text: "⑥ Säure-Base-Labor" },
  { step: 7, room: "Aula", text: "⑦ Abendrunde: zeigen, was weitergekommen ist und was offen bleibt" },
];
