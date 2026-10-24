// Generates level/bergdorf.json, the village exterior of the Schulwelt.
//
//   node level/build-bergdorf.mjs
//
// Layout (tiles): forest border, a village square in the middle and the
// Schulhaus on its north side; its door opens the Schulhaus interior
// (building.hazuId). The village is only the arrival: Joel greets visitors
// on the square, everything else happens inside the Schulhaus.

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";

const COLS = 30;
const ROWS = 28;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7 };

const PLACES = {
  schulhaus: "_m0-qRVAAUwmuxfswuPp",
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

// The Schulhaus facade as a landmark document (footprint 9 x 5 tiles =
// 18 x 10 m, frame at the footprint centre, +z faces the square). Two
// plastered wings with window bands, a taller timber entrance hall with a
// glass front and a blue canopy, flower boxes, benches, a bike rack and a
// Swiss flag: friendly instead of a plain block.
const B = (pos, scale, color, mat = "PLASTER", extra = {}) => ({ shape: "box", pos, scale, color, mat, ...extra });
function schulhausFacade() {
  const parts = [];
  const cream = "#f6ead0";
  const wood = "#c98f55";
  const roof = "#5a4a3f";
  const blue = "#3288EF";
  const glass = "#a9d8f2";
  parts.push(B([0, 0.2, 0], [18.6, 0.4, 10.6], "#b9b3a8", "STONE"));
  for (const sx of [-1, 1]) {
    const cx = sx * 5.75;
    parts.push(B([cx, 3.9, 0], [6.5, 7, 10], cream));
    parts.push(B([cx, 7.6, 0], [7.1, 0.4, 10.8], roof, "CONCRETE"));
    parts.push(B([cx, 6.95, 5.04], [6.5, 0.35, 0.06], "#f2b84b", "PAINT"));
    for (const fy of [2.1, 5.0])
      for (const wx of [-2.1, 0, 2.1]) {
        parts.push(B([cx + wx, fy, 5.04], [1.5, 1.7, 0.08], glass, "GLAZING", { glow: 0.35 }));
        parts.push(B([cx + wx, fy - 0.92, 5.1], [1.7, 0.12, 0.2], "#ffffff", "PAINT"));
      }
    // flower box under the ground-floor windows
    parts.push(B([cx, 0.65, 5.45], [5.8, 0.5, 0.6], wood, "WOOD"));
    for (const fx of [-2.4, -1.2, 0, 1.2, 2.4])
      parts.push(B([cx + fx, 1.05, 5.45], [0.7, 0.35, 0.45], fx % 2.4 === 0 ? "#e04f5f" : "#f6c445", "LEAF"));
  }
  // entrance hall
  parts.push(B([0, 4.65, 0.4], [5, 8.5, 10], wood, "CLAD"));
  parts.push(B([0, 9.1, 0.4], [5.6, 0.4, 10.6], blue, "PAINT"));
  parts.push(B([0, 3.3, 5.43], [3.8, 5.4, 0.08], glass, "GLAZING", { glow: 0.45 }));
  parts.push(B([0, 1.3, 5.5], [1.8, 2.4, 0.08], "#2f4a6a", "PAINT"));
  parts.push(B([0, 6.75, 5.45], [4, 0.9, 0.1], "#ffffff", "PAINT"));
  // canopy on two posts
  parts.push(B([0, 3.3, 6.6], [6.2, 0.25, 2.6], blue, "PAINT"));
  for (const px of [-2.8, 2.8]) parts.push({ shape: "cyl", pos: [px, 1.65, 7.7], scale: [0.18, 3.3, 0.18], color: "#ffffff", mat: "METAL" });
  // benches and bike rack on the forecourt
  for (const bx of [-6, 6]) {
    parts.push(B([bx, 0.45, 7.2], [2.4, 0.12, 0.6], wood, "WOOD"));
    parts.push(B([bx, 0.22, 7.2], [2.2, 0.44, 0.3], "#6d757e", "METAL"));
  }
  for (let i = 0; i < 4; i++) parts.push({ shape: "torus", pos: [-8.2 + i * 0.6, 0.45, 6.6], rot: [0, Math.PI / 2, 0], scale: [0.8, 0.8, 0.8], color: "#6d757e", mat: "METAL" });
  // Swiss flag
  parts.push({ shape: "cyl", pos: [8.3, 3.5, 6.8], scale: [0.12, 7, 0.12], color: "#e8e8e8", mat: "METAL" });
  parts.push(B([8.95, 6.4, 6.8], [1.2, 1.2, 0.04], "#d52b1e", "FABRIC"));
  parts.push(B([8.95, 6.4, 6.83], [0.75, 0.22, 0.02], "#ffffff", "FABRIC"));
  parts.push(B([8.95, 6.4, 6.83], [0.22, 0.75, 0.02], "#ffffff", "FABRIC"));
  return {
    $schema: "hazu.world/landmark@1",
    id: "schulhaus_aussen",
    version: "1.0.0",
    title: "Schulhaus",
    frame: { kind: "footprint", name: "F" },
    parts,
    result: { top: 9.3, door: { at: [0, 0, 6.6] } },
  };
}

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
    rendererFn: "schulhaus_aussen",
    accent: "#3288EF",
    hazuId: PLACES.schulhaus,
  },
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

const npcs = [
  npc("joel", 13, 10, "Joel", "#22C55E", "Lernender · 3. Jahr"),
];

// Joel from docs/personas.md: he greets visitors and points to the Schulhaus.
// He is also the lead of the conflict station inside.
const dialogue = {
  joel: {
    intro:
      "Hoi, ich bin Joel! Hier lernt man in eigenen Projekten. Ich mache eine Audiokarte über Treffpunkte im Dorf. Am Morgen treffen wir uns alle in der Aula, dann plant jede und jeder den eigenen Tag.",
    hint: "Die Tür ist vorne am Schulhaus, unter dem blauen Vordach.",
    phases: [
      { type: "intro" },
      {
        type: "complete",
        message: "Komm mit ins Schulhaus. Drinnen findest du die Aula, das Lernatelier, den Coaching-Raum und die Workshops.",
      },
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
    landmarks: [schulhausFacade()],
    props,
    npcs,
    collectibles: [],
    playerStart: { x: 15.5, y: 13.5 },
    v4: { season: "summer", weather: "clear", timeOfDay: null },
  },
  dialogue: mixAnswers(dialogue),
  i18n: {},
};

const out = new URL("./bergdorf.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 2) + "\n");
console.log(`wrote ${out.pathname}`);
