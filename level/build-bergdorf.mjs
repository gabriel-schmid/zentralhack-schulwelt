// Generates level/bergdorf.json, the village exterior of the Schulwelt.
//
//   node level/build-bergdorf.mjs
//
// Layout (tiles): forest border, a village square in the middle with the
// forum (amphitheatre) on its north side for the morning and evening circle,
// the workshop auditorium in the south, and one house per place whose door
// opens that place (building.hazuId). NPCs stay at their spot all day.

import { writeFileSync } from "node:fs";

const COLS = 30;
const ROWS = 28;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7 };

const PLACES = {
  werkstatt: "tZNMXBltrzdnsVkElfhC",
  coaching: "hJ73ZiKWocRZADF25pQj",
  garten: "bK_FhPCxRBLKvMG4_flE",
  kueche: "QWixzEpPTgQYY09Ww8cH",
  lernatelier: "frRqjhqx-Bk_71Wu9o8C",
};

const map = Array.from({ length: ROWS }, () => Array(COLS).fill(T.GRASS));
const fill = (gx, gy, w, d, t) => {
  for (let y = gy; y < gy + d; y++)
    for (let x = gx; x < gx + w; x++) if (map[y]?.[x] !== undefined) map[y][x] = t;
};

// forest border, two tiles deep
fill(0, 0, COLS, 2, T.FOREST);
fill(0, ROWS - 2, COLS, 2, T.FOREST);
fill(0, 0, 2, ROWS, T.FOREST);
fill(COLS - 2, 0, 2, ROWS, T.FOREST);

// roads: east-west and north-south through the square
fill(2, 12, COLS - 4, 1, T.ROAD);
fill(15, 8, 1, 10, T.ROAD);

// village square (Dorfplatz)
fill(11, 9, 9, 7, T.PLAZA);

// garden beds and flowers
fill(8, 19, 5, 4, T.PARK);
fill(8, 23, 5, 1, T.FLOWERS);
fill(3, 4, 4, 1, T.FLOWERS);

// a pond by the garden
fill(3, 20, 3, 3, T.WATER);

const house = (id, gx, gy, gw, gd, label, colors, extra = {}) => ({
  id,
  gx,
  gy,
  gw,
  gd,
  hUnits: extra.hUnits ?? 1.6,
  h: Math.round((extra.hUnits ?? 1.6) * 32),
  label,
  topColor: colors[0],
  leftColor: colors[1],
  rightColor: colors[2],
  accent: colors[3],
  windowColor: "rgba(255,220,140,0.7)",
  ...extra,
});

const buildings = [
  {
    id: "forum",
    gx: 13,
    gy: 3,
    gw: 5,
    gd: 5,
    hUnits: 1.5,
    label: "Forum",
    rendererFn: "forumTheatre",
    v4Front: "south",
    accent: "#FA8C16",
  },
  {
    id: "auditorium",
    gx: 17,
    gy: 18,
    gw: 6,
    gd: 3,
    hUnits: 2.2,
    label: "Workshop-Saal",
    rendererFn: "auditorium",
    accent: "#3288EF",
    topColor: "#f4efe6",
    leftColor: "#e9e2d6",
    rightColor: "#ddd4c6",
    v4Seating: { gx: 17, gy: 21, gw: 6, gd: 3 },
  },
  house("werkstatt", 4, 8, 3, 3, "Werkstatt", ["#d9a066", "#b8804a", "#9a6634", "#F97316"], { hazuId: PLACES.werkstatt, hUnits: 2 }),
  house("kueche", 23, 8, 3, 3, "Küche", ["#f2d4c4", "#d9b2a0", "#bf9280", "#EF4444"], { hazuId: PLACES.kueche }),
  house("lernatelier", 4, 14, 3, 3, "Lernatelier", ["#cfe6f5", "#a9cde6", "#88b3d1", "#0EA5E9"], { hazuId: PLACES.lernatelier }),
  house("coaching", 23, 14, 2, 2, "Coaching-Raum", ["#e3d9f7", "#c6b5ec", "#a993dc", "#8B5CF6"], { hazuId: PLACES.coaching, hUnits: 1.3 }),
  house("stall", 13, 19, 2, 2, "Garten und Hof", ["#d8e8c8", "#b4cf9c", "#93b478", "#22C55E"], { hazuId: PLACES.garten, hUnits: 1.3 }),
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

const npcs = [
  npc("lehrerin", 15, 9, "Frau Arnold", "#3288EF", "Lehrerin · Forum", { female: true, hat: "glasses" }),
  npc("lea", 12, 10, "Lea", "#F97316", "Lernende", { female: true }),
  npc("noah", 18, 10, "Noah", "#22C55E", "Lernender", { hat: "cap" }),
  npc("mia", 13, 14, "Mia", "#EAB308", "Lernende", { female: true, hat: "scarf" }),
  npc("coach", 22, 16, "Coach Sandro", "#8B5CF6", "Coach · 1:1", { isGenius: true }),
  npc("schreiner", 7, 11, "Herr Bühler", "#b8804a", "Schreiner · Werkstatt"),
  npc("koechin", 22, 11, "Frau Rossi", "#EF4444", "Köchin · Küche", { female: true, hat: "chef" }),
  npc("workshop", 20, 20, "Frau Keller", "#3288EF", "Workshop-Leiterin", { female: true }),
];

const dialogue = {
  lehrerin: {
    intro:
      "Guten Morgen und willkommen im Bergdorf! Jeden Morgen treffen wir uns hier im Forum: Ich sage, was heute ansteht, und ihr erzählt, was ihr euch vornehmt. Am Abend kommen wir wieder zusammen und teilen unsere Highlights.",
    hint: "Schau dir die Orte im Dorf an. Jeder Ort hat sein eigenes Projekt.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was passiert am Abend im Forum?",
        options: [
          { text: "Wir erzählen, was wir erreicht haben, und teilen unsere Highlights.", correct: true },
          { text: "Wir schreiben eine Prüfung.", correct: false },
          { text: "Nichts, der Tag endet in den Werkstätten.", correct: false },
        ],
      },
      { type: "complete", message: "Genau. So weiss jede und jeder, was die anderen gelernt haben." },
    ],
  },
  lea: {
    intro: "Hoi! Ich baue diese Woche mit Noah ein Hochbeet. Heute plane ich zuerst, welches Holz wir brauchen.",
    hint: "Im Lernatelier kannst du deinen eigenen Wochenplan machen.",
    phases: [{ type: "intro" }, { type: "complete", message: "Bis heute Abend im Forum!" }],
  },
  noah: {
    intro: "Ich gehe heute in den Workshop von Frau Keller. Sie zeigt, wie man ein Projekt richtig plant.",
    hint: "Die Workshops sind freiwillig. Du wählst selbst, was dich interessiert.",
    phases: [{ type: "intro" }, { type: "complete", message: "Komm doch auch mit in den Workshop-Saal!" }],
  },
  mia: {
    intro: "Ich habe heute ein 1:1 mit dem Coach. Wir schauen, ob ich meine Ziele von letzter Woche erreicht habe.",
    hint: "Den Coach findest du beim Coaching-Raum.",
    phases: [{ type: "intro" }, { type: "complete", message: "Ein 1:1 hilft mir, dranzubleiben." }],
  },
  coach: {
    intro:
      "Hallo, ich bin Sandro, dein Coach. Erzähl mir, woran du gerade arbeitest, oder sag mir, wo du nicht weiterkommst.",
    isGenius: true,
    geniusSystemPrompt:
      "Du bist Sandro, Coach im Bergdorf, einer Schule, in der man in echten Projekten lernt. Du führst 1:1-Gespräche mit Lernenden. Antworte immer auf Deutsch in Schweizer Schreibweise (ss statt ß), kurz, freundlich und auf Augenhöhe. Hilf, eigene Ziele zu setzen und den nächsten Schritt zu finden; gib keine fertigen Lösungen, sondern stelle gute Fragen. Du kennst die Grundsätze der Schule: Raum für eigene Interessen in einer klaren Struktur, Lernen in echten Projekten, Mindestanforderungen und Verbindlichkeit, regelmässiges Feedback. Bei Projekten mit Werkzeug, Tieren oder in der Küche denkst du an die Sicherheit und fragst nach, wenn etwas fehlt; du ersetzt keine Instruktion durch eine Fachperson. Am Ende fasst du in zwei Sätzen zusammen, was sich die Person vorgenommen hat.",
  },
  schreiner: {
    intro: "Grüezi! In der Werkstatt bauen wir einen Hühnerstall. Bevor du die Säge anfasst, schauen wir zusammen, was du dafür brauchst.",
    hint: "Schutzausrüstung kommt immer vor dem Werkzeug.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was ziehst du an, bevor du mit der Kreissäge arbeitest?",
        options: [
          { text: "Schutzbrille und Gehörschutz", correct: true },
          { text: "Handschuhe und einen Schal", correct: false },
          { text: "Nichts, es geht ja schnell", correct: false },
        ],
      },
      { type: "complete", message: "Richtig. Handschuhe und lose Kleider können sich an der Säge verfangen." },
    ],
  },
  koechin: {
    intro: "Willkommen in der Küche! Heute kochen wir zusammen das Mittagessen für alle.",
    hint: "Ein Messer legst du immer mit der Klinge vom Rand weg ab.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was machst du zuerst, bevor du mit Lebensmitteln arbeitest?",
        options: [
          { text: "Hände waschen", correct: true },
          { text: "Den Herd einschalten", correct: false },
          { text: "Das Messer schleifen", correct: false },
        ],
      },
      { type: "complete", message: "Genau, Hygiene kommt zuerst." },
    ],
  },
  workshop: {
    intro:
      "Hallo! Ich bin Frau Keller und leite die Workshops im Saal. Diese Woche geht es darum, wie man ein Projekt plant: Ziel, Schritte, Material und Zeit.",
    hint: "Die Workshops sind freiwillig und finden während der Woche statt.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Womit beginnt eine gute Projektplanung?",
        options: [
          { text: "Mit einem klaren Ziel", correct: true },
          { text: "Mit dem Einkaufen des Materials", correct: false },
          { text: "Mit dem Bauen, planen kann man später", correct: false },
        ],
      },
      { type: "complete", message: "Genau. Wer das Ziel kennt, kann die Schritte planen." },
    ],
  },
};

const props = [
  { type: "lamppost", gx: 11, gy: 9 },
  { type: "lamppost", gx: 19, gy: 9 },
  { type: "lamppost", gx: 11, gy: 15 },
  { type: "lamppost", gx: 19, gy: 15 },
  { type: "bench", gx: 14, gy: 15 },
  { type: "bench", gx: 16, gy: 15 },
];

const level = {
  data: {
    name: "Bergdorf",
    gridCols: COLS,
    gridRows: ROWS,
    tileTypes: T,
    tileWalkable: [true, true, false, true, true, true, true, false],
    map,
    buildings,
    props,
    npcs,
    collectibles: [],
    playerStart: { x: 15.5, y: 13.5 },
    v4: { season: "summer", weather: "clear", timeOfDay: null },
  },
  dialogue,
  i18n: {},
};

const out = new URL("./bergdorf.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 2) + "\n");
console.log(`wrote ${out.pathname}`);
