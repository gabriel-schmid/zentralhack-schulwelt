// Generates level/bergdorf.json, the village exterior of the Schulwelt.
//
//   node level/build-bergdorf.mjs
//
// Layout (tiles): forest border, a village square in the middle and the
// Schulhaus on its north side; its door opens the Schulhaus interior
// (building.hazuId). The village is only the arrival: Joel greets visitors
// on the square, everything else happens inside the Schulhaus.
//
// Around the square stand a few small chalets with a fountain, trees, a bus
// stop and a meadow with two goals. They are scenery only: a building
// without `hazuId` or `isTravelPoint` has no door, and one without a label
// has no name sign.

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";
import { routeVillage } from "./route-dialogues.mjs";

const COLS = 30;
const ROWS = 28;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7, COBBLE: 8, ROCK: 9 };

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

// a lane south from the square to the lower houses
fill(15, 18, 1, 5, T.ROAD);

// garden beds and flowers
fill(8, 19, 5, 4, T.PARK);
fill(8, 23, 5, 1, T.FLOWERS);
fill(3, 4, 4, 1, T.FLOWERS);
fill(3, 5, 1, 2, T.FLOWERS);

// a pond by the garden
fill(3, 20, 3, 3, T.WATER);

// meadow with two goals east of the Schulhaus
fill(21, 3, 6, 4, T.PARK);

// cobbled footpaths from the chalets to the roads
fill(7, 11, 1, 1, T.COBBLE);
fill(7, 13, 1, 1, T.COBBLE);
fill(23, 11, 1, 1, T.COBBLE);
fill(23, 13, 1, 1, T.COBBLE);
fill(16, 22, 8, 1, T.COBBLE);
fill(9, 18, 6, 1, T.COBBLE);
fill(23, 7, 1, 2, T.COBBLE);

// rocks where the forest meets the meadows
fill(2, 2, 2, 1, T.ROCK);
fill(2, 3, 1, 1, T.ROCK);
fill(26, 23, 2, 1, T.ROCK);
fill(27, 22, 1, 1, T.ROCK);
fill(2, 15, 1, 2, T.ROCK);

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

// A small goal on the meadow: white posts and crossbar, a net of thin cords
// behind. The footprint is 1 x 2 tiles; `ry` turns the mouth to the pitch.
const HALF_TURN = 1.5708;
function goal(id, ry) {
  const white = "#f4f4f4";
  const cord = "#e2e6e8";
  const bar = (pos, len, axis, color = white, r = 0.1) => ({
    shape: "cyl",
    pos,
    rot: axis === "x" ? [0, 0, HALF_TURN] : axis === "z" ? [HALF_TURN, 0, 0] : [0, 0, 0],
    scale: [r, len, r],
    color,
    mat: "METAL",
  });
  const parts = [];
  for (const x of [-1.5, 1.5]) {
    parts.push(bar([x, 0.7, 0.5], 1.4, "y"));
    parts.push(bar([x, 0.4, -0.4], 0.8, "y", cord, 0.05));
    parts.push(bar([x, 1.4, 0.05], 0.9, "z", cord, 0.04));
  }
  parts.push(bar([0, 1.4, 0.5], 3.1, "x"));
  // net: cords on the back
  for (const x of [-0.75, 0, 0.75]) parts.push(bar([x, 0.4, -0.4], 0.8, "y", cord, 0.025));
  for (const y of [0.4, 0.8]) parts.push(bar([0, y, -0.4], 3, "x", cord, 0.025));
  return {
    $schema: "hazu.world/landmark@1",
    id,
    version: "1.0.0",
    title: "Tor",
    frame: { kind: "footprint", name: "F", ry },
    parts,
    result: { top: 1.5 },
  };
}

// Small chalets around the square: scenery only (no hazuId, no label, so
// no door and no sign). Dark timber or whitewashed walls, steep roofs.
const chalet = (id, gx, gy, gw, gd, hUnits, wall, roof, accent) => ({
  id,
  gx,
  gy,
  gw,
  gd,
  hUnits,
  h: Math.round(hUnits * 32),
  label: "",
  v4Archetype: "house",
  v4Wall: wall,
  v4Roof: roof,
  accent,
  windowColor: "rgba(255,220,140,0.7)",
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
    rendererFn: "schulhaus_aussen",
    accent: "#3288EF",
    hazuId: PLACES.schulhaus,
  },
  chalet("chalet_west", 6, 8, 3, 3, 1.7, "#8a5a36", "#4b3d33", "#2f6f4f"),
  chalet("chalet_west_low", 6, 14, 2, 2, 1.2, "#f3ece0", "#5a4a3f", "#b0413e"),
  chalet("chalet_east", 22, 9, 3, 2, 1.4, "#e9dcc4", "#4f4a46", "#3f6a8f"),
  chalet("gasthaus", 22, 14, 3, 3, 2.0, "#9b6a42", "#3f3a36", "#b0413e"),
  chalet("chalet_south", 17, 19, 3, 3, 1.5, "#f1e6d2", "#5d4b3c", "#4f7a5a"),
  chalet("stadel", 22, 20, 2, 2, 1.0, "#7a5233", "#5b6168", "#7a5233"),
  { id: "goal_west", gx: 21, gy: 4, gw: 1, gd: 2, hUnits: 0.5, h: 16, label: "", rendererFn: "dorf_goal_w" },
  { id: "goal_east", gx: 26, gy: 4, gw: 1, gd: 2, hUnits: 0.5, h: 16, label: "", rendererFn: "dorf_goal_e" },
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

const npcs = [
  npc("joel", 13, 10, "Joel", "#22C55E", "Lernender · 3. Jahr", { look: { hairStyle: "short", hair: "#3b2a1e" } }),
];

// Joel from docs/personas.md greets visitors and points to door ① of the
// «Vormittag» route (routeVillage in route-dialogues.mjs). He appears again
// in the Schulhaus, in the Lernatelier with Lea.
const dialogue = { ...routeVillage };

const tree = (gx, gy) => ({ type: "tree", gx, gy });

const props = [
  { type: "lamppost", gx: 11, gy: 9 },
  { type: "lamppost", gx: 19, gy: 9 },
  { type: "lamppost", gx: 11, gy: 15 },
  { type: "lamppost", gx: 19, gy: 15 },
  { type: "bench", gx: 14, gy: 15 },
  { type: "bench", gx: 16, gy: 15 },
  // the village fountain (Dorfbrunnen) off the path to the Schulhaus door
  { type: "fountain", gx: 18, gy: 12 },
  { type: "bench", gx: 18, gy: 14 },
  { type: "flower_pot", gx: 17, gy: 10 },
  { type: "flower_pot", gx: 12, gy: 14 },
  // bus stop and street lamps on the road
  { type: "bus_stop", gx: 10, gy: 12 },
  { type: "lamppost", gx: 4, gy: 12 },
  { type: "lamppost", gx: 26, gy: 12 },
  { type: "lamppost", gx: 15, gy: 20 },
  // one table with a parasol in front of the Gasthaus
  { type: "cafe_table", gx: 25, gy: 13 },
  { type: "parasol", gx: 25, gy: 13 },
  // flower pots by the chalet doors, a bench at the pond and the meadow
  { type: "flower_pot", gx: 8, gy: 11 },
  { type: "flower_pot", gx: 8, gy: 13 },
  { type: "flower_pot", gx: 24, gy: 11 },
  { type: "flower_pot", gx: 20, gy: 21 },
  { type: "bench", gx: 6, gy: 20 },
  { type: "bench", gx: 23, gy: 7 },
  // trees around the houses and along the forest edge
  tree(4, 9), tree(3, 13), tree(9, 8), tree(4, 17), tree(9, 15),
  tree(21, 11), tree(26, 9), tree(26, 15), tree(20, 16), tree(26, 19),
  tree(19, 23), tree(13, 20), tree(6, 24), tree(21, 24),
  tree(9, 4), tree(8, 6), tree(21, 2), tree(25, 2),
];

const level = {
  data: {
    name: "Bergdorf",
    gridCols: COLS,
    gridRows: ROWS,
    tileTypes: T,
    tileWalkable: [true, true, false, true, true, true, true, false, true, false],
    map,
    buildings,
    landmarks: [schulhausFacade(), goal("dorf_goal_w", HALF_TURN), goal("dorf_goal_e", -HALF_TURN)],
    props,
    npcs,
    collectibles: [],
    playerStart: { x: 15.5, y: 13.5 },
    v4: { season: "summer", weather: "clear", timeOfDay: null, style: "classic" },
  },
  dialogue: mixAnswers(dialogue),
  i18n: {},
};

const out = new URL("./bergdorf.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 2) + "\n");
console.log(`wrote ${out.pathname}`);
