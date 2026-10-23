// Generates level/werkstatt.json, the interior of the Werkstatt place.
//
//   node level/build-werkstatt.mjs
//
// A workshop yard in front of a sawtooth workshop hall, a coop under
// construction, a timber store and workbenches. The exit gate travels to the
// level "Bergdorf" by name, so the village loads in the same tab (a door to
// the world Hazu itself would open a new app tab).

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";

const COLS = 20;
const ROWS = 18;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7 };

const map = Array.from({ length: ROWS }, () => Array(COLS).fill(T.GRASS));
const fill = (gx, gy, w, d, t) => {
  for (let y = gy; y < gy + d; y++)
    for (let x = gx; x < gx + w; x++) if (map[y]?.[x] !== undefined) map[y][x] = t;
};

fill(0, 0, COLS, 2, T.FOREST);
fill(0, ROWS - 2, COLS, 2, T.FOREST);
fill(0, 0, 2, ROWS, T.FOREST);
fill(COLS - 2, 0, 2, ROWS, T.FOREST);
fill(4, 8, 12, 5, T.PLAZA); // workshop yard
fill(9, 13, 2, 2, T.ROAD); // path to the exit

const house = (id, gx, gy, gw, gd, label, colors, extra = {}) => ({
  id,
  gx,
  gy,
  gw,
  gd,
  hUnits: extra.hUnits ?? 1.2,
  h: Math.round((extra.hUnits ?? 1.2) * 32),
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
    id: "werkhalle",
    gx: 7,
    gy: 2,
    gw: 6,
    gd: 5,
    hUnits: 2.4,
    label: "Werkhalle",
    rendererFn: "powerWorks",
    accent: "#F97316",
  },
  house("huehnerstall", 3, 9, 2, 2, "Hühnerstall (im Bau)", ["#e0c39a", "#c4a276", "#a8865c", "#F97316"]),
  house("holzlager", 15, 9, 2, 2, "Holzlager", ["#c8a878", "#a88858", "#8a6c40", "#9a6634"]),
  house("ausgang", 9, 15, 2, 1, "↩ Zum Dorfplatz", ["#f4efe6", "#e9e2d6", "#ddd4c6", "#3288EF"], {
    isTravelPoint: true,
    destination: "Bergdorf",
    hUnits: 1,
  }),
];

const props = [
  { type: "table", gx: 6, gy: 10 },
  { type: "table", gx: 9, gy: 10 },
  { type: "table", gx: 12, gy: 10 },
  { type: "lamp", gx: 4, gy: 8 },
  { type: "lamp", gx: 15, gy: 8 },
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

const npcs = [
  npc("schreiner", 9, 8, "Herr Bühler", "#b8804a", "Schreiner · Werkstatt"),
  npc("lea", 5, 11, "Lea", "#F97316", "Lernende", { female: true }),
  npc("jonas", 13, 11, "Jonas", "#0EA5E9", "Lernender", { hat: "cap" }),
];

const dialogue = {
  schreiner: {
    intro:
      "Grüezi in der Werkstatt! Diese Woche bauen wir einen Hühnerstall für den Hof. Bevor du ein Werkzeug anfasst, schauen wir zusammen, was du dafür brauchst.",
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
      {
        type: "choice",
        question: "Am Boden liegt ein Verlängerungskabel quer durch die Werkstatt. Was machst du?",
        options: [
          { text: "Ich lege es an den Rand und sichere es, damit niemand stolpert.", correct: true },
          { text: "Ich steige einfach darüber.", correct: false },
          { text: "Ich ziehe den Stecker während jemand sägt.", correct: false },
        ],
      },
      {
        type: "complete",
        message: "Sehr gut. Handschuhe und lose Kleider können sich an der Säge verfangen, und ein Kabel am Boden ist eine Stolperfalle. Jetzt kannst du loslegen.",
      },
    ],
  },
  lea: {
    intro:
      "Hoi! Ich plane den Hühnerstall. Heute zeichne ich, wie gross er wird und welche Bretter wir brauchen. Morgen sägen wir zusammen mit Herrn Bühler.",
    hint: "Ein guter Plan spart Material und Zeit.",
    phases: [{ type: "intro" }, { type: "complete", message: "Heute Abend erzähle ich in der Aula, wie weit wir sind." }],
  },
  jonas: {
    intro:
      "Ich wollte zuerst nur gamen, aber hier merke ich, wofür ich Mathe brauche: Ohne Winkel und Masse passt beim Stall nichts zusammen.",
    hint: "Frag Herrn Bühler, bevor du die Säge benutzt.",
    phases: [{ type: "intro" }, { type: "complete", message: "Wieso lerne ich das? Hier sehe ich es." }],
  },
};

const level = {
  data: {
    name: "Werkstatt",
    gridCols: COLS,
    gridRows: ROWS,
    tileTypes: T,
    tileWalkable: [true, true, false, true, true, true, true, false],
    map,
    buildings,
    props,
    npcs,
    collectibles: [],
    playerStart: { x: 10, y: 13.5 },
    v4: { season: "summer", weather: "clear", timeOfDay: null },
  },
  dialogue: mixAnswers(dialogue),
  i18n: {},
};

const out = new URL("./werkstatt.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 2) + "\n");
console.log(`wrote ${out.pathname}`);
