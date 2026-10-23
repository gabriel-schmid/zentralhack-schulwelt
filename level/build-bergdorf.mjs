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
  schulhaus: "_m0-qRVAAUwmuxfswuPp",
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
    id: "schulhaus",
    gx: 11,
    gy: 3,
    gw: 9,
    gd: 5,
    hUnits: 2.4,
    h: 77,
    label: "Schulhaus",
    v4Archetype: "school",
    topColor: "#f0e2c8",
    leftColor: "#e2d2b4",
    rightColor: "#d2c09e",
    accent: "#3288EF",
    v4Roof: "#b0613f",
    v4Wall: "#f0e2c8",
    windowColor: "rgba(255,220,140,0.7)",
    hazuId: PLACES.schulhaus,
  },
  house("werkstatt", 4, 8, 3, 3, "Werkstatt", ["#d9a066", "#b8804a", "#9a6634", "#F97316"], { hazuId: PLACES.werkstatt, hUnits: 2 }),
  house("kueche", 23, 8, 3, 3, "Küche", ["#f2d4c4", "#d9b2a0", "#bf9280", "#EF4444"], { hazuId: PLACES.kueche }),
  house("stall", 13, 19, 2, 2, "Garten und Hof", ["#d8e8c8", "#b4cf9c", "#93b478", "#22C55E"], { hazuId: PLACES.garten, hUnits: 1.3 }),
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

const npcs = [
  npc("hauswart", 15, 9, "Hauswart Toni", "#64748B", "Hauswart · Schulhaus", { hat: "cap" }),
  npc("jana", 12, 13, "Jana", "#22C55E", "Lernende"),
  npc("koechin", 22, 11, "Frau Rossi", "#EF4444", "Köchin · Küche", { female: true, hat: "chef" }),
];

const dialogue = {
  hauswart: {
    intro:
      "Grüezi im Bergdorf! Im Schulhaus trifft sich die ganze Klasse am Morgen und am Abend in der Aula. Drinnen findest du auch das Lernatelier, den Coaching-Raum und die Workshops.",
    hint: "Die Tür ist vorne am Schulhaus. Draussen gibt es die Werkstatt, die Küche und den Garten.",
    phases: [{ type: "intro" }, { type: "complete", message: "Viel Spass beim Entdecken!" }],
  },
  jana: {
    intro: "Hoi! Ich gehe nach der Morgenrunde in den Garten. Heute pflanzen wir Salat für die Küche.",
    hint: "Jedes Projekt im Dorf braucht etwas, das wir wirklich brauchen.",
    phases: [{ type: "intro" }, { type: "complete", message: "Bis heute Abend in der Aula!" }],
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
