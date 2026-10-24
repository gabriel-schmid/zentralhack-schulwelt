// Generates level/schulhaus.json, the interior of the Schulhaus.
//
//   node level/build-schulhaus.mjs            the live dollhouse level
//   node level/build-schulhaus.mjs --indoor   a local copy for the engine's
//                                             indoor-mode demo
//
// Floor plan (tiles, x = column, z = row; 24 x 18):
//
//   z 0 ┌──────┬────────────────────┬──────┐
//       │Biblio│        Aula        │Inter-│   morning and evening circle
//       │ thek │  (stage, benches)  │essen │
//   z 6 ├─ ──┬─┴────────    ────────┴─┬ ───┤   doorways onto the corridor
//       │    corridor (east – west)        │
//   z 8 ├── ─┴─────┬────┬────────┴── ┬─────┤
//       │Lernatel. │    │ Coaching-Raum  │
//   z13 ├──────────┤hall├────────────────┤
//       │Pausenzone    │ Workshop-Raum  │
//   z18 └──────────┴ exit ┴──────────────┘
//
// A dollhouse: back and side walls, the front (south) open toward the
// camera. Each room is a tiny anchor building (its name sign) whose landmark
// document draws walls and furniture outside its own footprint, so the floor
// stays walkable. Furniture and inner walls get colliders.
//
// The «Vormittag» route (level/route-dialogues.mjs) numbers the doors:
// ① Aula, ② ③ Lernatelier, ④ Interessen-Atelier, ⑤ Coaching-Raum,
// ⑥ Workshop-Raum. The day plan («Tagesplan») hangs in the entrance hall.

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";
import { routeDialogue, routeNpcs } from "./route-dialogues.mjs";

const INDOOR = process.argv.includes("--indoor");
const COLS = 24;
const ROWS = 18;
const TILE_M = 2; // metres per tile
const WALL_H = 3.2;
const WALL_T = 0.3;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7 };

const map = Array.from({ length: ROWS }, () => Array(COLS).fill(T.PLAZA));

const C = {
  wall: "#f3ede2",
  wood: "#c8955a",
  woodDark: "#8a6236",
  stage: "#a8744a",
  fabric: "#5b7fb8",
  fabricWarm: "#d9774b",
  green: "#4c9a5a",
  board: "#2f4a3a",
  white: "#fafafa",
  floorWood: "#d9b88a",
  floorLino: "#9fb3c2",
  floorCarpet: "#c98b7a",
  floorGreen: "#a9c4a0",
  floorWarm: "#e3c9a0",
  glass: "#a9d8f2",
  curtain: "#b23a48",
  books: ["#c0392b", "#2c7be5", "#27ae60", "#f1c40f", "#8e44ad", "#e67e22", "#16a085", "#ecdcc0", "#34495e"],
  binders: ["#3288EF", "#F97316", "#22C55E", "#EAB308", "#ef4444"],
  chairs: ["#3288EF", "#F97316", "#22C55E", "#EAB308", "#8B5CF6", "#0EA5E9"],
  locker: ["#3288EF", "#F97316", "#22C55E", "#EAB308", "#8B5CF6"],
  note: ["#fde68a", "#fca5a5", "#a7f3d0", "#bfdbfe"],
};

const r2 = (v) => Math.round(v * 100) / 100;
// Yaw of a child frame whose +z (a seat's front, a sign's face) points that way.
const FACE = { south: 0, east: 1.5708, north: 3.1416, west: -1.5708 };
const SIGN_Y = 2.62; // name signs hang just above the door lintel (2.3 m)

// Furniture as landmark components, in metres, centred on the footprint,
// front (where a person sits or looks) toward +z. A room places them with a
// child frame. Tiny parts are left out on the lean tiers (Niedrig, Quest).
const METAL = "#7c828c";
const DEFS = {
  // school desk / table: thin top on four slim legs (boxes: a short cylinder
  // leg would count as a fine part and vanish from the lean far view)
  table: {
    params: ["w", "d", "h", "c", "l"],
    defaults: { h: 0.75, c: "#e2c497", l: METAL },
    parts: [
      { shape: "box", pos: [0, "h-0.02", 0], scale: ["w", 0.04, "d"], color: "c", mat: "WOOD" },
      { for: { sx: [-1, 1], sz: [-1, 1] }, shape: "box", pos: ["sx*(w/2-0.07)", "h/2-0.02", "sz*(d/2-0.07)"], scale: [0.045, "h-0.04", 0.045], color: "l", mat: "METAL" },
    ],
  },
  // chair: seat, backrest above a gap, four thin legs (the back legs carry the backrest)
  chair: {
    params: ["c"],
    defaults: { c: "#3288EF" },
    parts: [
      { shape: "box", pos: [0, 0.45, 0], scale: [0.42, 0.04, 0.4], color: "#e2c497", mat: "WOOD" },
      { shape: "box", pos: [0, 0.74, -0.18], scale: [0.42, 0.2, 0.03], color: "c", mat: "PAINT" },
      { for: { sx: [-1, 1] }, shape: "cyl6", pos: ["sx*0.18", 0.215, 0.16], scale: [0.03, 0.43, 0.03], color: METAL, mat: "METAL" },
      { for: { sx: [-1, 1] }, shape: "cyl6", pos: ["sx*0.18", 0.43, -0.18], scale: [0.03, 0.86, 0.03], color: METAL, mat: "METAL" },
      { collider: [0, 0], r: 0.22 },
    ],
  },
  // stool: round seat on four legs
  stool: {
    params: ["c"],
    defaults: { c: "#F97316" },
    parts: [
      { shape: "cyl8", pos: [0, 0.62, 0], scale: [0.42, 0.05, 0.42], color: "c", mat: "PAINT" }, // r > 0.2 m: kept in the lean far view
      { for: { sx: [-1, 1], sz: [-1, 1] }, shape: "cyl6", pos: ["sx*0.11", 0.3, "sz*0.11"], scale: [0.035, 0.6, 0.035], color: METAL, mat: "METAL" },
      { collider: [0, 0], r: 0.2 },
    ],
  },
  // bench: seat plank on leg boards, a backrest plank on posts
  bench: {
    params: ["w", "c"],
    defaults: { c: "#c8955a" },
    parts: [
      { shape: "box", pos: [0, 0.43, 0], scale: ["w", 0.045, 0.36], color: "c", mat: "WOOD" },
      { for: { f: [-1, -0.34, 0.34, 1] }, shape: "box", pos: ["f*(w/2-0.08)", 0.205, 0.01], scale: [0.06, 0.41, 0.3], color: "#8a6236", mat: "WOOD" },
      { for: { f: [-1, -0.34, 0.34, 1] }, shape: "box", pos: ["f*(w/2-0.08)", 0.64, -0.16], scale: [0.05, 0.42, 0.04], color: "#8a6236", mat: "WOOD" },
      { shape: "box", pos: [0, 0.76, -0.17], scale: ["w", 0.14, 0.03], color: "c", mat: "WOOD" },
    ],
  },
  // workbench: thick top, square legs, a lower shelf
  workbench: {
    params: ["w", "d"],
    parts: [
      { shape: "box", pos: [0, 0.86, 0], scale: ["w", 0.08, "d"], color: "#c8955a", mat: "WOOD" },
      { for: { f: [-1, -0.34, 0.34, 1], sz: [-1, 1] }, shape: "box", pos: ["f*(w/2-0.08)", 0.41, "sz*(d/2-0.08)"], scale: [0.08, 0.82, 0.08], color: "#5f6b78", mat: "METAL" },
      { shape: "box", pos: [0, 0.2, 0], scale: ["w-0.1", 0.03, "d-0.12"], color: "#a8744a", mat: "WOOD" },
    ],
  },
  // sofa or armchair: base, back, armrests, n seat cushions
  sofa: {
    params: ["w", "d", "c", "k", "n"],
    defaults: { n: 1 },
    parts: [
      { for: { sx: [-1, 1], sz: [-1, 1] }, shape: "cyl6", pos: ["sx*(w/2-0.1)", 0.04, "sz*(d/2-0.1)"], scale: [0.06, 0.08, 0.06], color: "#5a3f24", mat: "WOOD", skipLean: true },
      { shape: "rbox", pos: [0, 0.23, 0], scale: ["w", 0.3, "d"], color: "c", mat: "FABRIC" },
      { shape: "rbox", pos: [0, 0.62, "-d/2+0.12"], scale: ["w", 0.5, 0.24], color: "c", mat: "FABRIC" },
      { for: { sx: [-1, 1] }, shape: "rboxSoft", pos: ["sx*(w/2-0.09)", 0.5, 0.03], scale: [0.18, 0.3, "d-0.06"], color: "c", mat: "FABRIC" },
      { repeat: { i: "n" }, shape: "rboxSoft", pos: ["-w/2+0.18+(i+0.5)*(w-0.36)/n", 0.44, 0.07], scale: ["(w-0.36)/n-0.03", 0.14, "d-0.3"], color: "k", mat: "FABRIC" },
    ],
  },
  // open bookcase: back panel, u uprights, n boards
  shelf: {
    params: ["w", "d", "h", "n", "u"],
    defaults: { u: 2 },
    parts: [
      { shape: "box", pos: [0, "h/2", "-d/2+0.015"], scale: ["w", "h", 0.03], color: "#6e4c2a", mat: "WOOD" },
      { repeat: { i: "u" }, shape: "box", pos: ["-w/2+0.025+i*(w-0.05)/(u-1)", "h/2", 0], scale: [0.05, "h", "d"], color: "#8a6236", mat: "WOOD" },
      { repeat: { i: "n" }, shape: "box", pos: [0, "0.05+i*(h-0.07)/(n-1)", 0], scale: ["w", 0.035, "d"], color: "#8a6236", mat: "WOOD" },
    ],
  },
  // potted plant
  plant: {
    parts: [
      { shape: "cyl8", pos: [0, 0.22, 0], scale: [0.46, 0.44, 0.46], color: "#c0663f", mat: "PAINT" },
      { shape: "ico", pos: [0, 0.95, 0], scale: [0.85, 1.05, 0.85], color: "#4c9a5a", mat: "LEAF" },
      { shape: "ico", pos: [0.12, 1.35, -0.06], scale: [0.5, 0.6, 0.5], color: "#5aae68", mat: "LEAF", skipLean: true },
    ],
  },
};

// Deterministic pseudo-random numbers (book heights and colours).
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// A room's parts are written in level tile coordinates (continuous) and
// converted to the anchor's frame: its footprint centre, facing south (+z),
// in metres. PLASTER is the engine default, so it is left out.
function roomDoc(id, anchor, build) {
  const ox = anchor.gx + 0.5;
  const oz = anchor.gy + 0.5;
  const P = (x, z) => [r2((x - ox) * TILE_M), r2((z - oz) * TILE_M)];
  const parts = [];
  const box = (x0, z0, x1, z1, y0, h, color, mat, glow) => {
    const [ax, az] = P(x0, z0);
    const [bx, bz] = P(x1, z1);
    const part = {
      shape: "box",
      pos: [r2((ax + bx) / 2), r2(y0 + h / 2), r2((az + bz) / 2)],
      scale: [r2(Math.abs(bx - ax)), r2(h), r2(Math.abs(bz - az))],
      color,
    };
    if (mat && mat !== "PLASTER") part.mat = mat;
    if (glow) part.glow = glow;
    parts.push(part);
    return part;
  };
  const collide = (x, z, r) => parts.push({ collider: P(x, z), r: r2(r) });
  const t = WALL_T / TILE_M / 2;
  // Axis-aligned wall with colliders every 0.4 m: close enough that the
  // walker's body (radius 0.3) stays out of the wall, small enough that
  // doorways stay wide. The map edge walls need them too, the walk mask
  // alone lets the body reach halfway into them.
  const wall = (x0, z0, x1, z1) => {
    if (z0 === z1) box(x0, z0 - t, x1, z0 + t, 0, WALL_H, C.wall);
    else box(x0 - t, z0, x0 + t, z1, 0, WALL_H, C.wall);
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.ceil((len * TILE_M) / 0.4));
    for (let i = 0; i <= n; i++) collide(x0 + ((x1 - x0) * i) / n, z0 + ((z1 - z0) * i) / n, 0.2);
  };
  // A wall along x (z fixed) with a framed doorway between a and b.
  const wallWithDoor = (x0, x1, z, a, b) => {
    if (a > x0) wall(x0, z, a, z);
    if (b < x1) wall(b, z, x1, z);
    const d = t + 0.02;
    box(a, z - d, b, z + d, 2.3, WALL_H - 2.3, C.wall);
    box(a, z - d, a + 0.08, z + d, 0, 2.3, C.woodDark, "WOOD");
    box(b - 0.08, z - d, b, z + d, 0, 2.3, C.woodDark, "WOOD");
  };
  // The same along z (x fixed).
  const wallWithDoorZ = (x, z0, z1, a, b) => {
    if (a > z0) wall(x, z0, x, a);
    if (b < z1) wall(x, b, x, z1);
    const d = t + 0.02;
    box(x - d, a, x + d, b, 2.3, WALL_H - 2.3, C.wall);
    box(x - d, a, x + d, a + 0.08, 0, 2.3, C.woodDark, "WOOD");
    box(x - d, b - 0.08, x + d, b, 0, 2.3, C.woodDark, "WOOD");
  };
  // One collider per tile a piece of furniture covers.
  const footprint = (x0, z0, x1, z1) => {
    for (let x = x0 + 0.5; x < x1 + 0.01; x += 1)
      for (let z = z0 + Math.min(0.5, (z1 - z0) / 2); z < z1 + 0.01; z += 1)
        collide(Math.min(x, x1 - 0.2), Math.min(z, z1 - 0.2), 0.5);
  };
  // Furniture block (cabinet, stage) with its colliders.
  const thing = (x0, z0, x1, z1, h, color, mat = "WOOD") => {
    box(x0, z0, x1, z1, 0, h, color, mat);
    footprint(x0, z0, x1, z1);
  };
  // A child frame at tile point (x, z) whose +z faces `face`, holding
  // component uses or local parts (metres).
  const place = (x, z, face, nodes) => {
    const [px, pz] = P(x, z);
    const yaw = FACE[face];
    parts.push({ frame: yaw ? [px, 0, pz, yaw] : [px, 0, pz], parts: nodes });
  };
  const use = (name, w) => (w ? { use: name, with: w } : { use: name });
  const local = (shape, x, y, z, sx, sy, sz, color, mat, lean) => {
    const p = { shape, pos: [r2(x), r2(y), r2(z)], scale: [r2(sx), r2(sy), r2(sz)], color };
    if (mat && mat !== "PLASTER") p.mat = mat;
    if (lean) p.skipLean = true;
    return p;
  };
  const mid = (x0, z0, x1, z1) => [(x0 + x1) / 2, (z0 + z1) / 2];
  // A table over the footprint (tiles), top inset by `inset` metres.
  const desk = (x0, z0, x1, z1, opts = {}, inset = 0.05) => {
    const [x, z] = mid(x0, z0, x1, z1);
    const w = { w: r2((x1 - x0) * TILE_M - 2 * inset), d: r2((z1 - z0) * TILE_M - 2 * inset), ...opts };
    place(x, z, "south", [use("table", w)]);
    footprint(x0, z0, x1, z1);
  };
  // A chair tucked at a table edge: (x, z) is the edge point, `face` points
  // from the chair toward the table. The seat front sits 8 cm under the top.
  const chair = (x, z, face, c) => {
    const d = (0.2 - 0.08) / TILE_M;
    const off = { south: [0, -d], north: [0, d], east: [-d, 0], west: [d, 0] }[face];
    place(x + off[0], z + off[1], face, [use("chair", { c })]);
  };
  // Chairs along both long (x) sides of a table, `n` per side.
  const chairsAround = (x0, z0, x1, z1, n, colors, sides = ["north", "south"]) => {
    let k = 0;
    for (const side of sides)
      for (let i = 0; i < n; i++) {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
        if (side === "north") chair(x, z0, "south", colors[k++ % colors.length]);
        else chair(x, z1, "north", colors[k++ % colors.length]);
      }
  };
  // A sofa or armchair over a footprint, its back away from `face`.
  const sofa = (x0, z0, x1, z1, face, w, d, c, k, n = 1) => {
    const [x, z] = mid(x0, z0, x1, z1);
    place(x, z, face, [use("sofa", { w, d, c, k, n })]);
    footprint(x0, z0, x1, z1);
  };
  const plant = (x0, z0, x1, z1) => {
    const [x, z] = mid(x0, z0, x1, z1);
    place(x, z, "south", [use("plant")]);
    footprint(x0, z0, x1, z1);
  };
  // A bookcase over a footprint, facing `face`, with rows of books (or
  // binders) in varying heights and colours: `bays` gaps between uprights,
  // `n` boards; `fill` books per bay and level.
  const bookcase = (x0, z0, x1, z1, face, h, n, bays, fill, colors, back = 0) => {
    const along = face === "south" || face === "north";
    const W = ((along ? x1 - x0 : z1 - z0) - 0.04) * TILE_M;
    const D = 0.45;
    // the case stands against the wall behind it, `back` tiles from its footprint edge
    const [cx, cz] = mid(x0, z0, x1, z1);
    const depthT = along ? z1 - z0 : x1 - x0;
    const shift = (depthT / 2 - back) * TILE_M - D / 2; // metres toward the back
    const nodes = [use("shelf", { w: r2(W), d: D, h, n, u: bays + 1 })];
    const bayW = (W - 0.05) / bays;
    const gap = (h - 0.07) / (n - 1);
    const books = [];
    const leanBooks = [];
    for (let lv = 0; lv < n - 1; lv++)
      for (let b = 0; b < bays; b++) {
        let x = -W / 2 + 0.05 + b * bayW + 0.04 + rnd() * 0.25;
        for (let i = 0; i < fill; i++) {
          const w = 0.05 + rnd() * 0.05;
          const bh = gap * (0.55 + rnd() * 0.3);
          const y0 = 0.05 + lv * gap + 0.0175;
          const book = { x: r2(x + w / 2), y: r2(y0 + bh / 2), w: r2(w), h: r2(bh), c: colors[Math.floor(rnd() * colors.length)] };
          (i % 2 ? leanBooks : books).push(book);
          x += w + 0.006;
          if (rnd() < 0.18) x += 0.12; // a gap now and then
        }
      }
    // one node per set of books, every other book left out on the lean tiers
    const row = { shape: "box", pos: ["x", "y", r2(-D / 2 + 0.16)], scale: ["w", "h", 0.26], color: "c", mat: "PAINT" };
    nodes.push({ each: books, ...row }, { each: leanBooks, ...row, skipLean: true });
    // centre of the case: pushed back toward the wall
    const back3 = { south: [0, -1], north: [0, 1], east: [-1, 0], west: [1, 0] }[face];
    place(cx + (back3[0] * shift) / TILE_M, cz + (back3[1] * shift) / TILE_M, face, nodes);
    footprint(x0, z0, x1, z1);
  };
  // The room's name sign at tile point (x, z), facing `face`.
  const sign = (x, z, face, y = SIGN_Y) => {
    const [px, pz] = P(x, z);
    if (face === "south") parts.push({ sign: { at: [px, y, pz] } });
    else parts.push({ frame: [px, 0, pz, FACE[face]], parts: [{ sign: { at: [0, y, 0] } }] });
  };
  // `layer` 1 for a rug or mat on another floor: the same height flickers
  const floor = (x0, z0, x1, z1, color, layer = 0) =>
    box(x0, z0, x1, z1, layer * 0.015, 0.06, color, "PAINT");
  // Flat things on the back wall (z = 0) or an outer side wall.
  const onBack = (x0, x1, y0, h, color, mat = "PAINT", glow) => box(x0, t + 0.01, x1, t + 0.06, y0, h, color, mat, glow);
  const onSide = (x, z0, z1, y0, h, color, mat = "PAINT", glow) => {
    const a = x === 0 ? t + 0.01 : x - t - 0.06;
    box(a, z0, a + 0.05, z1, y0, h, color, mat, glow);
  };
  const windowsBack = (spans) => {
    for (const [x0, x1] of spans) {
      onBack(x0, x1, 1.4, 1.4, C.glass, "GLAZING", 0.4);
      onBack(x0 - 0.05, x1 + 0.05, 1.3, 0.1, C.white);
    }
  };
  const windowsSide = (x, spans) => {
    for (const [z0, z1] of spans) {
      onSide(x, z0, z1, 1.4, 1.4, C.glass, "GLAZING", 0.4);
      onSide(x, z0 - 0.05, z1 + 0.05, 1.3, 0.1, C.white);
    }
  };
  const notes = (x0, z, y0, n) => {
    for (let i = 0; i < n; i++)
      box(x0 + (i % 3) * 0.5, z, x0 + 0.35 + (i % 3) * 0.5, z + 0.05, y0 + Math.floor(i / 3) * 0.4, 0.3, C.note[i % 4], "PAINT");
  };
  build({
    box, wall, wallWithDoor, wallWithDoorZ, thing, floor, onBack, onSide, windowsBack, windowsSide, notes,
    footprint, place, use, local, desk, chair, chairsAround, sofa, plant, bookcase, sign,
  });
  // only the components this room uses
  const used = new Set(JSON.stringify(parts).match(/"use":"\w+"/g)?.map((s) => s.slice(7, -1)));
  const define = Object.fromEntries(Object.entries(DEFS).filter(([k]) => used.has(k)));
  const doc = { $schema: "hazu.world/landmark@1", id, frame: { kind: "footprint", name: "F" } };
  if (used.size) doc.define = define;
  doc.parts = parts;
  return doc;
}

// Anchors sit one tile in from the map edge (the island rim slopes, and a
// landmark's floor is its footprint's lowest corner) and out of the way.
const anchors = {
  aula: { gx: 7, gy: 1 },
  bibliothek: { gx: 1, gy: 1 },
  interessen: { gx: 22, gy: 1 },
  lernatelier: { gx: 1, gy: 9 },
  coaching: { gx: 22, gy: 9 },
  pause: { gx: 1, gy: 16 },
  workshop: { gx: 22, gy: 16 },
  halle: { gx: 13, gy: 9 },
  tagesplan: { gx: 14, gy: 12 }, // behind the hall wall, in the Coaching-Raum's corner
  ausgang: { gx: 11, gy: 17 },
};

const landmarks = [
  roomDoc("schulhaus_aula", anchors.aula, ({ box, wall, wallWithDoor, thing, floor, onBack, windowsBack, place, use, footprint, sign }) => {
    wall(0, 0, COLS, 0); // back wall of the whole house
    wall(6, 0, 6, 6);
    wall(18, 0, 18, 6);
    wallWithDoor(6, 18, 6, 10.5, 13.5); // wide double door onto the corridor
    floor(6.1, 0.1, 17.9, 5.95, C.floorWood);
    // stage, lectern, board, curtains, clock, high windows
    thing(9, 0.2, 15, 1.8, 0.45, C.stage);
    onBack(10, 14, 1.2, 1.6, C.board);
    box(11.7, 1.3, 12.3, 1.7, 0.45, 1.1, C.woodDark, "WOOD");
    onBack(9.2, 9.9, 0.5, 2.6, C.curtain, "FABRIC");
    onBack(14.1, 14.8, 0.5, 2.6, C.curtain, "FABRIC");
    onBack(11.75, 12.25, 2.95, 0.45, C.white);
    windowsBack([[6.6, 8.4], [15.6, 17.4]]);
    // benches in three rows with a middle aisle, facing the stage
    for (const z of [3, 4, 5])
      for (const [x0, x1] of [[7, 11.3], [12.7, 17]]) {
        place((x0 + x1) / 2, z + 0.225, "north", [use("bench", { w: r2((x1 - x0) * TILE_M - 0.1) })]);
        footprint(x0, z, x1, z + 0.45);
      }
    sign(12, 6.11, "south");
  }),
  roomDoc("schulhaus_bibliothek", anchors.bibliothek, ({ wallWithDoor, floor, onBack, desk, chairsAround, sofa, bookcase, sign }) => {
    wallWithDoor(0, 6, 6, 2.2, 3.8);
    floor(0.1, 0.1, 5.9, 5.95, C.floorWarm);
    // bookcase along the back wall, a reading table with chairs, an armchair
    bookcase(2.2, 0.2, 5.8, 0.65, "south", 2.1, 5, 3, 6, C.books, -0.1);
    desk(2, 2.6, 4, 3.6);
    chairsAround(2, 2.6, 4, 3.6, 2, C.chairs);
    sofa(4.6, 3.8, 5.5, 4.7, "west", 0.95, 0.9, C.fabricWarm, "#f0a27a");
    onBack(0.6, 1.8, 1.4, 1.4, C.glass, "GLAZING", 0.4);
    sign(3, 6.11, "south");
  }),
  roomDoc("schulhaus_interessen", anchors.interessen, ({ wallWithDoor, floor, onBack, notes, windowsBack, desk, chairsAround, plant, sign }) => {
    wallWithDoor(18, COLS, 6, 20.2, 21.8);
    floor(18.1, 0.1, 23.9, 5.95, C.floorGreen);
    // project tables with chairs, a plant, a pin board with project notes
    desk(18.8, 2.4, 21, 3.4);
    chairsAround(18.8, 2.4, 21, 3.4, 2, C.chairs);
    desk(21.6, 3.8, 23.4, 4.8);
    chairsAround(21.6, 3.8, 23.4, 4.8, 2, C.chairs.slice(2), ["north"]);
    plant(23.2, 0.4, 23.7, 0.9);
    onBack(18.6, 21.4, 1.1, 1.3, C.wood, "WOOD");
    notes(18.8, 0.13, 1.25, 6);
    windowsBack([[21.9, 22.9]]);
    sign(21, 6.11, "south");
  }),
  roomDoc("schulhaus_lernatelier", anchors.lernatelier, ({ wallWithDoor, wallWithDoorZ, wall, floor, onSide, desk, chairsAround, bookcase, sign }) => {
    wallWithDoor(0, 10, 8, 6, 7.5); // north wall onto the corridor
    wall(0, 13, 10, 13);
    wallWithDoorZ(10, 8, 13, 9.5, 11); // east wall onto the hall
    floor(0.1, 8.05, 9.95, 12.95, C.floorWood);
    // group tables in two rows, the green board on the west wall
    onSide(0, 9.2, 12, 1.1, 1.2, C.board);
    let k = 0;
    for (const x of [3, 5.6])
      for (const z of [9.3, 11.3]) {
        desk(x, z, x + 1.4, z + 0.8);
        // Lea and Joel stand at the north side of the first table, working together
        const sides = x === 3 && z === 9.3 ? ["south"] : undefined;
        chairsAround(x, z, x + 1.4, z + 0.8, 2, C.chairs.slice(k++ % 3), sides);
      }
    bookcase(8.4, 12.2, 9.8, 12.8, "north", 1.6, 4, 2, 5, C.binders, -0.1); // weekly-plan shelf
    sign(6.75, 7.89, "north");
  }),
  roomDoc("schulhaus_coaching", anchors.coaching, ({ wallWithDoor, wallWithDoorZ, wall, floor, onSide, desk, sofa, plant, sign }) => {
    wallWithDoor(14, COLS, 8, 16.5, 18);
    wall(14, 13, COLS, 13);
    wallWithDoorZ(14, 8, 13, 9.5, 11);
    floor(14.05, 8.05, 23.9, 12.95, C.floorCarpet);
    // two armchairs facing each other, a low table, a rug, a plant, goals board
    floor(17.8, 9.6, 21.2, 11.4, "#e9d5b7", 1);
    sofa(17.9, 10, 18.9, 11, "east", 1.05, 0.95, C.fabricWarm, "#f3b08c");
    sofa(20.1, 10, 21.1, 11, "west", 1.05, 0.95, C.fabric, "#9db8e3");
    desk(19.15, 10.25, 19.85, 10.75, { h: 0.45, l: C.woodDark });
    plant(23.2, 12.2, 23.7, 12.7);
    onSide(COLS, 9, 12, 1.1, 1.2, C.white);
    sign(17.25, 7.89, "north");
  }),
  roomDoc("schulhaus_pause", anchors.pause, ({ floor, windowsSide, desk, sofa, plant, sign }) => {
    floor(0.1, 13.05, 9.95, 17.95, C.floorLino);
    // sofa, coffee table, a plant
    sofa(1.4, 14, 4.6, 14.9, "south", 4.4, 1, C.fabric, "#9db8e3", 3);
    desk(2.5, 15.6, 3.5, 16.4, { h: 0.42, l: C.woodDark });
    plant(0.4, 17.2, 0.9, 17.7);
    windowsSide(0, [[14.2, 16.2]]);
    sign(5.5, 13.11, "south"); // centred on its north wall, seen from the hall
  }),
  roomDoc("schulhaus_workshop", anchors.workshop, ({ wallWithDoorZ, floor, onSide, place, use, local, footprint, sign }) => {
    wallWithDoorZ(14, 13, 18, 14.5, 16);
    floor(14.05, 13.05, 23.9, 17.95, C.floorGreen);
    // two workbenches facing a screen on the east wall, stools, a toolbox
    onSide(COLS, 14, 17, 1.1, 1.8, C.board);
    for (const [z0, z1, stoolZ, extra] of [
      [14.2, 15, 14.16, local("box", -2.6, 1.0, 0, 0.45, 0.2, 0.22, "#c0392b", "PAINT", true)],
      [16.2, 17, 17.04, local("box", 1.8, 0.98, 0.1, 0.4, 0.16, 0.3, "#2c7be5", "PAINT", true)],
    ]) {
      place(18.25, (z0 + z1) / 2, "south", [use("workbench", { w: 8.9, d: 1.5 }), extra]);
      footprint(16, z0, 20.5, z1);
      [16.6, 17.7, 18.8, 19.9].forEach((x, i) => place(x, stoolZ, "south", [use("stool", { c: C.chairs[(i + (z0 > 15 ? 2 : 0)) % C.chairs.length] })]));
    }
    sign(13.89, 15.25, "west");
  }),
  roomDoc("schulhaus_halle", anchors.halle, ({ box, thing, floor, sign }) => {
    floor(0.1, 6.05, 23.9, 7.95, C.floorLino); // corridor
    floor(10.05, 8.05, 13.95, 17.95, C.floorLino); // entrance hall
    // lockers along the corridor's north side (vent and handle), a doormat
    const locker = (x, color) => {
      thing(x, 6.2, x + 0.5, 6.65, 1.9, color, "PAINT");
      box(x + 0.12, 6.65, x + 0.38, 6.665, 1.66, 0.05, "#3d4450", "PAINT").skipLean = true;
      box(x + 0.38, 6.65, x + 0.42, 6.675, 0.95, 0.16, METAL, "METAL").skipLean = true;
    };
    for (let i = 0; i < 4; i++) locker(6.4 + i * 0.6, C.locker[i % 5]);
    for (let i = 0; i < 4; i++) locker(14.6 + i * 0.6, C.locker[(i + 2) % 5]);
    floor(11, 16.6, 13, 17.4, "#7a5a3a", 1);
    sign(10.11, 11.95, "east"); // on the hall wall between the Lernatelier door and the corner
  }),
  // The day plan on the hall side of the Coaching-Raum wall (x = 14), facing
  // west: a framed board with a header strip (its name sign), dark columns
  // for the fixed points (Morgenrunde, Mathe-Fixpunkt, Abendrunde) and
  // lighter blocks in three lanes for the time each learner plans freely.
  // Its anchor sits behind the wall, in the Coaching-Raum's corner.
  roomDoc("schulhaus_tagesplan", anchors.tagesplan, ({ box, sign }) => {
    const X = 14 - WALL_T / TILE_M / 2; // hall face of the Coaching-Raum wall
    const z0 = 11.2;
    const z1 = 12.85;
    box(X - 0.03, z0 - 0.05, X, z1 + 0.05, 0.8, 1.75, C.woodDark, "WOOD"); // frame
    box(X - 0.04, z0, X - 0.03, z1, 0.86, 1.22, C.white, "PAINT"); // board
    box(X - 0.04, z0, X - 0.03, z1, 2.12, 0.38, "#3288EF", "PAINT"); // header
    box(X - 0.1, z0 + 0.1, X - 0.03, z1 - 0.1, 0.78, 0.05, C.woodDark, "WOOD"); // marker tray
    const blk = (a, b, y0, h, color) => box(X - 0.05, a, X - 0.04, b, y0, h, color, "PAINT");
    for (const [a, color] of [[11.27, "#1e3a8a"], [11.9, "#0f766e"], [12.6, "#1e3a8a"]]) blk(a, a + 0.18, 0.92, 1.12, color);
    const lanes = [
      [[11.48, 11.66, "#bfdbfe"], [11.68, 11.87, "#fde68a"], [12.11, 12.57, "#bbf7d0"]],
      [[11.48, 11.87, "#fbcfe8"], [12.11, 12.32, "#fed7aa"], [12.34, 12.57, "#bfdbfe"]],
      [[11.48, 11.62, "#bbf7d0"], [11.64, 11.87, "#bfdbfe"], [12.11, 12.45, "#fde68a"]],
    ];
    lanes.forEach((lane, i) => lane.forEach(([a, b, color]) => blk(a, b, 1.7 - i * 0.34, 0.28, color)));
    sign(X - 0.07, (z0 + z1) / 2, "west", 2.31);
  }),
  roomDoc("schulhaus_ausgang", anchors.ausgang, ({ box, sign }) => {
    // glass entrance door, its green sign above it facing the hall
    box(11, 17.2, 11.15, 17.45, 0, 2.6, C.woodDark, "WOOD");
    box(12.85, 17.2, 13, 17.45, 0, 2.6, C.woodDark, "WOOD");
    box(11, 17.2, 13, 17.45, 2.6, 0.25, C.woodDark, "WOOD");
    box(11.15, 17.3, 12.85, 17.4, 0, 2.6, "#9fd3f0", "GLAZING");
    sign(12, 17.14, "north", 3.12);
  }),
];
// The exit's interaction point sits inside the hall, in front of the door.
landmarks.find((d) => d.id === "schulhaus_ausgang").result = { door: { at: [1, 0, -2] } };

const anchor = (key, label, accent) => ({
  id: `raum-${key}`,
  gx: anchors[key].gx,
  gy: anchors[key].gy,
  gw: 1,
  gd: 1,
  hUnits: 1,
  label,
  rendererFn: `schulhaus_${key}`,
  accent,
});

const buildings = [
  // door signs carry the route step (routeSigns in route-dialogues.mjs)
  anchor("aula", "① Aula", "#3288EF"),
  anchor("bibliothek", "Bibliothek", "#b0613f"),
  anchor("interessen", "④ Interessen-Atelier", "#22C55E"),
  anchor("lernatelier", "② ③ Lernatelier", "#0EA5E9"),
  anchor("coaching", "⑤ Coaching-Raum", "#8B5CF6"),
  anchor("pause", "Pausenzone", "#EAB308"),
  anchor("workshop", "⑥ Workshop-Raum", "#F97316"),
  anchor("halle", "Eingangshalle", "#64748B"),
  anchor("tagesplan", "Tagesplan", "#3288EF"),
  {
    id: "ausgang",
    gx: anchors.ausgang.gx,
    gy: anchors.ausgang.gy,
    gw: 2,
    gd: 1,
    hUnits: 1,
    label: "↩ Zum Dorfplatz",
    rendererFn: "schulhaus_ausgang",
    accent: "#1f9d55",
    isTravelPoint: true,
    destination: "Bergdorf",
  },
];

const npc = (id, gx, gy, name, color, subject, extra = {}) => ({ id, gx, gy, name, color, subject, ...extra });

// Characters of the «Vormittag» route (routeNpcs in route-dialogues.mjs),
// placed on free floor clear of furniture, anchors and doorways. Frau Arnold
// and Matilda in the Aula (①); Lea and Joel side by side at the north side of
// one Lernatelier table, Frau Sutter by the green board, Quirin by the hall
// door (② ③); Yara next to the Tagesplan in the entrance hall. Fractional
// tiles put two characters next to each other.
const route = Object.fromEntries(routeNpcs.map((n) => [n.id, n]));
const cast = (id, gx, gy, more = {}) => {
  const { name, color, subject, extra } = route[id];
  const { subject: sub = subject, ...opts } = more;
  return npc(id, gx, gy, name, color, sub, { ...extra, ...opts });
};
const npcs = [
  cast("lehrerin", 12, 2),
  cast("matilda", 10, 2),
  cast("lea", 2.9, 8.5),
  cast("joel", 3.55, 8.5, { look: { hairStyle: "short", hair: "#3b2a1e" } }),
  cast("mathe", 1.9, 9.6, { female: true, hat: "glasses", look: { hairStyle: "bun", hair: "#6b4a2b" } }),
  cast("quirin", 8, 10),
  cast("tobi", 19, 4),
  cast("yara", 12.7, 12.8),
  cast("coach", 19, 11),
  cast("workshop", 21, 15),
];

const COACH_PROMPT = [
  "Du bist Herr Meinhard, 60, Coach im Schulhaus des Bergdorfs, einer Schule, in der man in echten Projekten lernt. Du führst 1:1-Gespräche. Die Person vor dir spricht als sie selbst über ihre eigenen Ziele, nicht in einer Rolle; nimm sie ernst, ob jugendlich oder erwachsen.",
  "Antworte immer auf Deutsch in Schweizer Schreibweise (ss, nie ß), warm, mit etwas Humor, in einfacher Sprache und kurz: höchstens drei bis vier Sätze pro Antwort, meist mit einer Frage am Schluss.",
  "Haltung: Du stellst gute Fragen, statt Lösungen zu liefern. Unter Druck möchtest du schnell eine Lösung anbieten oder lange von dir erzählen; halte dich zurück und frage zuerst. Die Person entscheidet selbst und soll wissen, wo sie Unterstützung findet. Du berätst und unterstützt nach den Grundsätzen der Schule, aber Lernen lässt sich nicht erzwingen.",
  "Was an dieser Schule feststeht: Freiheit gilt von Anfang an, auch für den Weg zu den Mindestanforderungen; sie ist keine Belohnung nach einer bestandenen Prüfung. Die Mindestanforderungen ergeben sich aus dem Rahmenlehrplan und den Lernzielen, die Lehrpersonen oder die Schule daraus ableiten. Sie sind verbindlich und werden geprüft; wer sie nicht erreicht, kann nach den geltenden Reglementen ein Fach oder eine Stufe nicht bestehen. Die bestehenden Notenreglemente gelten weiter. Formative Rückmeldungen unterwegs zeigen, ob der Fortschritt reicht, und machen ein Risiko früh sichtbar. Fragst du nach dem Fortschritt, frag auch, woran die Person ihn erkennt.",
  "Was noch offen ist: Schulstufe, Lehrplan und konkrete Mindestziele, wie viel Wahl genau bei Themen, Tempo, Gruppen, Produkten und Prüfungsformen, Zeitstrukturen und Coaching-Zeit, wie Gruppenprojekte einzeln bewertet werden und was geschieht, wenn jemand nicht weiterkommt oder sich weigert. Stelle nichts davon als entschieden dar; sag ehrlich, dass es noch nicht festgelegt ist.",
  "Gesprächsverlauf: Frag zuerst, worum es der Person geht und was sie erreichen will. Hilf, das Ziel konkret zu machen, den nächsten kleinen Schritt zu finden und eigene Interessen mit dem Verbindlichen zu verbinden. Die Frage «Wieso lerne ich das?» ist berechtigt; hilf, einen Sinn zu finden, statt sie abzuwehren.",
  "Sicherheit: Geht es um echte Arbeit mit Werkzeug, Strom, Tieren oder in der Küche, denkst du an die Sicherheit, fragst nach, wenn etwas fehlt, und sagst klar, dass du keine Instruktion durch eine Fachperson ersetzt.",
  "Abschluss: Will die Person zum Ende kommen oder ist ein nächster Schritt klar, fasse in zwei Sätzen zusammen, was sie als Nächstes vorhat, und halte eine konkrete Abmachung fest (was, bis wann, woran man es merkt). Frag, ob das so stimmt.",
].join(" ");

// Route texts (all from route-dialogues.mjs, Yara's Tagesplan role included;
// the station is wired later through the tag hw-npc-yara), plus the coach's
// Genius prompt.
const dialogue = {
  ...routeDialogue,
  coach: { ...routeDialogue.coach, geniusSystemPrompt: COACH_PROMPT },
};

const level = {
  data: {
    name: INDOOR ? "Schulhaus (Indoor)" : "Schulhaus",
    gridCols: COLS,
    gridRows: ROWS,
    tileTypes: T,
    tileWalkable: [true, true, false, true, true, true, true, false],
    map,
    buildings,
    landmarks,
    props: [],
    npcs,
    collectibles: [],
    playerStart: { x: 12, y: 16 },
    v4: { season: "summer", weather: "clear", timeOfDay: null, indoor: { walls: "none" } },
  },
  dialogue: mixAnswers(dialogue),
  i18n: {},
};

const out = new URL(INDOOR ? "./schulhaus-indoor.json" : "./schulhaus.json", import.meta.url);
// Indented JSON, but any value that fits on a short line stays on one line
// (parts, colliders, map rows): readable and well inside the size budget.
const pretty = (v, ind = "") => {
  const flat = JSON.stringify(v);
  if (flat.length <= 120 || v === null || typeof v !== "object") return flat;
  const inner = ind + " ";
  if (Array.isArray(v)) return "[\n" + v.map((x) => inner + pretty(x, inner)).join(",\n") + "\n" + ind + "]";
  const keys = Object.keys(v).filter((k) => v[k] !== undefined);
  return "{\n" + keys.map((k) => inner + JSON.stringify(k) + ": " + pretty(v[k], inner)).join(",\n") + "\n" + ind + "}";
};
const json = pretty(level);
writeFileSync(out, json + "\n");
console.log(`wrote ${out.pathname}`);
