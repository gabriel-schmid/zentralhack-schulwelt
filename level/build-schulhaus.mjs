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
import { backgroundDialogue, backgroundNpcs, routeDialogue, routeNpcs } from "./route-dialogues.mjs";

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
      { for: { f: [-0.25, 0.25] }, shape: "box", pos: ["f*w", 0.74, "d/2-0.03"], scale: [0.6, 0.16, 0.04], color: "#a8744a", mat: "WOOD" },
      { for: { f: [-0.25, 0.25] }, shape: "box", pos: ["f*w", 0.74, "d/2-0.005"], scale: [0.14, 0.03, 0.03], color: "#2b2f36", mat: "METAL", skipLean: true },
      { for: { s: [-1, 1] }, parts: [
        { shape: "box", pos: ["w/2-0.3", 0.98, "s*(d/2-0.12)"], scale: [0.2, 0.14, 0.06], color: "#4a6fa5", mat: "METAL" },
        { shape: "box", pos: ["w/2-0.3", 0.91, "s*(d/2-0.12)+s*0.08"], scale: [0.04, 0.04, 0.14], color: "#d4d8de", mat: "METAL", skipLean: true },
      ] },
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
  // potted plant: tapered pot with a rim, a bushy crown of leaf clumps
  plant: {
    parts: [
      { shape: "pot", pos: [0, 0.22, 0], color: "#c0663f", mat: "PAINT" },
      { shape: "cyl8", pos: [0, 0.44, 0], scale: [0.54, 0.06, 0.54], color: "#a9542f", mat: "PAINT" },
      { shape: "box", pos: [0, 0.6, 0], scale: [0.05, 0.3, 0.05], color: "#5a3f24", mat: "WOOD", skipLean: true },
      { shape: "ico", pos: [0, 0.95, 0], scale: [0.82, 0.72, 0.82], color: "#5aae68", mat: "LEAF" },
      { for: { a: [0, 2.1, 4.2] }, shape: "ico", pos: ["0.26*cos(a)", 0.78, "0.26*sin(a)"], scale: [0.44, 0.38, 0.44], color: "#4c9a5a", mat: "LEAF", skipLean: true },
      { shape: "ico", pos: [0.05, 1.3, -0.03], scale: [0.52, 0.5, 0.52], color: "#6cc07a", mat: "LEAF" },
    ],
  },
  // board on a wall, front +z from the wall face: surface c, frame f (wood
  // when `wd`, else aluminium), a tray with chalk and a sponge when `tr`
  board: {
    params: ["w", "h", "y", "c", "f", "wd", "tr"],
    defaults: { f: "#8a6236", wd: 1, tr: 1 },
    parts: [
      { shape: "box", pos: [0, "y+h/2", 0.02], scale: ["w", "h", 0.03], color: "c", mat: "PAINT" },
      { if: "wd", parts: [
        { for: { s: [-1, 1] }, shape: "box", pos: [0, "y+h/2+s*(h/2+0.025)", 0.03], scale: ["w+0.1", 0.05, 0.05], color: "f", mat: "WOOD" },
        { for: { s: [-1, 1] }, shape: "box", pos: ["s*(w/2+0.025)", "y+h/2", 0.03], scale: [0.05, "h", 0.05], color: "f", mat: "WOOD" },
      ] },
      { if: "!wd", parts: [
        { for: { s: [-1, 1] }, shape: "box", pos: [0, "y+h/2+s*(h/2+0.02)", 0.03], scale: ["w+0.08", 0.04, 0.05], color: "f", mat: "METAL" },
        { for: { s: [-1, 1] }, shape: "box", pos: ["s*(w/2+0.02)", "y+h/2", 0.03], scale: [0.04, "h", 0.05], color: "f", mat: "METAL" },
      ] },
      { if: "tr", parts: [
        { shape: "box", pos: [0, "y-0.07", 0.07], scale: ["w*0.8", 0.025, 0.11], color: METAL, mat: "METAL" },
        { shape: "box", pos: [0, "y-0.05", 0.12], scale: ["w*0.8", 0.03, 0.012], color: METAL, mat: "METAL", skipLean: true },
        { for: { k: [-0.3, -0.22, 0.12] }, shape: "box", pos: ["k*w", "y-0.048", 0.07], scale: [0.08, 0.016, 0.016], color: "#ffffff", mat: "PAINT", skipLean: true },
        { shape: "box", pos: ["0.3*w", "y-0.04", 0.07], scale: [0.12, 0.04, 0.05], color: "#f6c445", mat: "FABRIC", skipLean: true },
      ] },
    ],
  },
  // stage curtain gathered in n folds (alternating shades), front +z
  curtain: {
    params: ["n", "h"],
    parts: [
      { repeat: { i: "n" }, shape: "cyl8", pos: ["(i-(n-1)/2)*0.25", "h/2", 0], scale: [0.29, "h", 0.2], color: "i%2 ? '#8f2a37' : '#b23a48'", mat: "FABRIC" },
    ],
  },
  // lectern: base, column, sloping top with a ledge, a school badge, a mic
  lectern: {
    parts: [
      { shape: "box", pos: [0, 0.02, 0], scale: [0.55, 0.04, 0.45], color: "#5a3b22", mat: "WOOD" },
      { shape: "box", pos: [0, 0.52, 0], scale: [0.42, 0.96, 0.32], color: "#8a6236", mat: "WOOD" },
      { shape: "box", pos: [0, 0.5, 0.165], scale: [0.36, 0.8, 0.02], color: "#a8744a", mat: "WOOD" },
      { shape: "box", pos: [0, 1.06, 0], rot: [-0.3, 0, 0], scale: [0.62, 0.05, 0.46], color: "#6e4c2a", mat: "WOOD" },
      { shape: "box", pos: [0, 1.0, -0.22], scale: [0.6, 0.06, 0.03], color: "#5a3b22", mat: "WOOD", skipLean: true },
      { shape: "cyl8", pos: [0, 0.72, 0.18], rot: [1.5708, 0, 0], scale: [0.18, 0.02, 0.18], color: "#3288EF", mat: "PAINT", skipLean: true },
      { shape: "cyl6", pos: [0.18, 1.22, 0.05], rot: [-0.5, 0, 0], scale: [0.02, 0.3, 0.02], color: "#2b2f36", mat: "METAL", skipLean: true },
    ],
  },
  // low (coffee) table: rounded top, four legs, a shelf below, a mug and a notebook
  lowtable: {
    params: ["w", "d", "h"],
    defaults: { h: 0.45 },
    parts: [
      { shape: "rbox", pos: [0, "h-0.03", 0], scale: ["w", 0.06, "d"], color: "#d6b07a", mat: "WOOD" },
      { for: { sx: [-1, 1], sz: [-1, 1] }, shape: "box", pos: ["sx*(w/2-0.08)", "(h-0.06)/2", "sz*(d/2-0.08)"], scale: [0.06, "h-0.06", 0.06], color: "#8a6236", mat: "WOOD" },
      { shape: "box", pos: [0, 0.12, 0], scale: ["w-0.2", 0.025, "d-0.2"], color: "#a8744a", mat: "WOOD" },
      { shape: "box", pos: ["-w*0.18", "h+0.012", 0.02], rot: [0, 0.3, 0], scale: [0.21, 0.025, 0.29], color: "#3288EF", mat: "PAINT", skipLean: true },
      { shape: "cyl8", pos: ["w*0.22", "h+0.05", "-d*0.1"], scale: [0.08, 0.1, 0.08], color: "#f4efe6", mat: "PAINT", skipLean: true },
    ],
  },
  // red toolbox with a lid and a carrying handle
  toolbox: {
    parts: [
      { shape: "box", pos: [0, 0.1, 0], scale: [0.46, 0.2, 0.22], color: "#c0392b", mat: "PAINT" },
      { shape: "box", pos: [0, 0.225, 0], scale: [0.48, 0.05, 0.24], color: "#962d22", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*0.12", 0.28, 0], scale: [0.025, 0.07, 0.025], color: "#2b2f36", mat: "METAL", skipLean: true },
      { shape: "box", pos: [0, 0.32, 0], scale: [0.27, 0.025, 0.03], color: "#2b2f36", mat: "METAL", skipLean: true },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*0.16", 0.18, 0.115], scale: [0.04, 0.05, 0.012], color: METAL, mat: "METAL", skipLean: true },
    ],
  },
  // blue tote crate, open on top, with wood offcuts sticking out
  crate: {
    parts: [
      { shape: "box", pos: [0, 0.01, 0], scale: [0.44, 0.02, 0.32], color: "#1f5fae", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: [0, 0.1, "s*0.15"], scale: [0.44, 0.2, 0.02], color: "#2c7be5", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*0.21", 0.1, 0], scale: [0.02, 0.2, 0.28], color: "#2c7be5", mat: "PAINT" },
      { shape: "box", pos: [-0.06, 0.19, 0.02], rot: [0, 0.2, 0.5], scale: [0.36, 0.05, 0.08], color: "#e2c497", mat: "WOOD" },
      { shape: "box", pos: [0.08, 0.16, -0.04], rot: [0.3, -0.3, 0], scale: [0.07, 0.07, 0.3], color: "#c8955a", mat: "WOOD", skipLean: true },
    ],
  },
  // one school locker column, 0.4 m wide, doors toward +z: two compartments
  // with coloured doors (vent slits, handle, number plate) on a plinth under
  // a cap; `o` opens the lower (1) or upper (2) door on its hinge, showing a
  // school bag or a jacket inside
  locker: {
    params: ["c", "o"],
    defaults: { o: 0 },
    let: { W: 0.4, D: 0.5, hc: 0.885 },
    parts: [
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*(W/2-0.008)", 0.985, 0], scale: [0.016, 1.77, "D"], color: "#9aa1ab", mat: "METAL" },
      { shape: "box", pos: [0, 1.885, 0.005], scale: ["W+0.004", 0.03, "D+0.01"], color: "#8a919b", mat: "METAL" },
      { shape: "box", pos: [0, 0.05, -0.03], scale: ["W-0.01", 0.1, "D-0.06"], color: "#3d4450", mat: "PAINT" },
      { for: { t: [0, 1] }, if: "o != t+1", parts: [
        { shape: "box", pos: [0, "0.1+hc*t+hc/2", 0], scale: ["W-0.02", "hc", "D-0.01"], color: "#23272e", mat: "PAINT" },
        { shape: "box", pos: [0, "0.1+hc*t+hc/2", "D/2+0.01"], scale: ["W-0.03", "hc-0.03", 0.02], color: "c", mat: "PAINT" },
        { for: { v: [0, 1, 2] }, shape: "box", pos: [-0.02, "0.1+hc*(t+1)-0.1-v*0.035", "D/2+0.022"], scale: [0.22, 0.012, 0.006], color: "#1f2329", mat: "PAINT", skipLean: true },
        { shape: "box", pos: ["W/2-0.055", "0.1+hc*t+hc/2", "D/2+0.032"], scale: [0.022, 0.15, 0.022], color: "#d4d8de", mat: "METAL", skipLean: true },
        { shape: "box", pos: [-0.02, "0.1+hc*(t+1)-0.24", "D/2+0.022"], scale: [0.07, 0.035, 0.006], color: "#eee8d8", mat: "PAINT", skipLean: true },
      ] },
      { if: "o", let: { y0: "0.1+hc*(o-1)" }, parts: [
        { shape: "box", pos: [0, "y0+hc/2", "-D/2+0.015"], scale: ["W-0.02", "hc", 0.03], color: "#b8bec7", mat: "METAL" },
        { for: { s: [0, 1] }, shape: "box", pos: [0, "y0+0.01+s*(hc-0.02)", 0], scale: ["W-0.02", 0.02, "D-0.01"], color: "#8a919b", mat: "METAL" },
        { frame: ["-W/2+0.015", 0, "D/2", -1.75], parts: [
          { shape: "box", pos: ["(W-0.03)/2", "y0+hc/2", 0.01], scale: ["W-0.03", "hc-0.03", 0.02], color: "c", mat: "PAINT" },
          { for: { v: [0, 1, 2] }, shape: "box", pos: ["(W-0.03)/2-0.02", "y0+hc-0.1-v*0.035", 0.022], scale: [0.22, 0.012, 0.006], color: "#1f2329", mat: "PAINT", skipLean: true },
          { shape: "box", pos: ["W-0.085", "y0+hc/2", 0.032], scale: [0.022, 0.15, 0.022], color: "#d4d8de", mat: "METAL", skipLean: true },
        ] },
        { if: "o == 2", parts: [
          { shape: "rbox", pos: [0, "y0+hc-0.38", -0.04], scale: [0.32, 0.58, 0.16], color: "#c0392b", mat: "FABRIC" },
          { shape: "rboxSoft", pos: [0, "y0+hc-0.12", -0.08], scale: [0.2, 0.14, 0.1], color: "#962d22", mat: "FABRIC", skipLean: true },
          { shape: "box", pos: [0, "y0+0.17", 0], rot: [0, 0.4, 0], scale: [0.22, 0.12, 0.08], color: "#f1c40f", mat: "PAINT", skipLean: true },
        ] },
        { if: "o == 1", parts: [
          { shape: "rboxSoft", pos: [0, "y0+0.2", -0.02], scale: [0.32, 0.36, 0.24], color: "#16a085", mat: "FABRIC" },
          { shape: "rboxSoft", pos: [0, "y0+0.13", 0.11], scale: [0.24, 0.16, 0.07], color: "#0f7a65", mat: "FABRIC", skipLean: true },
          { shape: "box", pos: [0, "y0+0.4", -0.02], scale: [0.14, 0.03, 0.03], color: "#2b2f36", mat: "PAINT", skipLean: true },
        ] },
      ] },
    ],
  },
};

// Lab things for Herr Tesla's Workshop-Raum (the Säure-Base-Labor), same
// convention: metres, centred, front toward +z. Glass is opaque in the
// engine, so a vessel is a coloured liquid part under a pale glass part.
const GLASS = "#d6eef7";
// red-cabbage indicator from acid to base: red, pink, purple, blue, green, yellow
const INDICATOR = ["#dc2626", "#ec4899", "#7e22ce", "#2563eb", "#16a34a", "#eab308"];
Object.assign(DEFS, {
  // Erlenmeyer flask, k times 23 cm tall: liquid c in the wide lower half
  flask: {
    params: ["c", "k"],
    defaults: { k: 1 },
    parts: [
      { shape: "flaskLow", pos: [0, "0.045*k", 0], scale: ["k", "k", "k"], color: "c", mat: "PAINT" },
      { shape: "flaskTop", pos: [0, "0.13*k", 0], scale: ["k", "k", "k"], color: GLASS, mat: "GLASS" },
      { shape: "cyl8", pos: [0, "0.2*k", 0], scale: ["0.034*k", "0.06*k", "0.034*k"], color: GLASS, mat: "GLASS" },
    ],
  },
  // beaker, liquid c two thirds up
  beaker: {
    params: ["c"],
    parts: [
      { shape: "cyl8", pos: [0, 0.04, 0], scale: [0.1, 0.08, 0.1], color: "c", mat: "PAINT" },
      { shape: "cyl8", pos: [0, 0.105, 0], scale: [0.098, 0.05, 0.098], color: GLASS, mat: "GLASS" },
      { shape: "box", pos: [0, 0.128, 0.05], scale: [0.025, 0.006, 0.02], color: GLASS, mat: "GLASS", skipLean: true },
    ],
  },
  // wooden test-tube rack with six tubes in the indicator colours
  tuberack: {
    parts: [
      { shape: "box", pos: [0, 0.01, 0], scale: [0.36, 0.02, 0.1], color: "#c8955a", mat: "WOOD" },
      { shape: "box", pos: [0, 0.085, 0], scale: [0.36, 0.02, 0.1], color: "#c8955a", mat: "WOOD" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*0.17", 0.05, 0], scale: [0.02, 0.08, 0.1], color: "#8a6236", mat: "WOOD" },
      ...INDICATOR.flatMap((c, i) => [
        { shape: "cyl6", pos: [r2(-0.125 + i * 0.05), 0.065, 0], scale: [0.024, 0.09, 0.024], color: c, mat: "PAINT" },
        { shape: "cyl6", pos: [r2(-0.125 + i * 0.05), 0.14, 0], scale: [0.024, 0.06, 0.024], color: GLASS, mat: "GLASS" },
      ]),
    ],
  },
  // lab bench against a wall: grey cabinets, black top, a reagent shelf
  // with brown and clear bottles at the back
  labbench: {
    params: ["w"],
    parts: [
      { shape: "box", pos: [0, 0.05, -0.03], scale: ["w-0.04", 0.1, 0.6], color: "#3d4450", mat: "PAINT" },
      { shape: "box", pos: [0, 0.48, 0], scale: ["w", 0.76, 0.66], color: "#e4e7eb", mat: "PAINT" },
      { for: { f: [-0.25, 0, 0.25] }, shape: "box", pos: ["f*w", 0.48, 0.333], scale: [0.012, 0.7, 0.01], color: "#9aa1ab", mat: "PAINT", skipLean: true },
      { for: { f: [-0.375, -0.125, 0.125, 0.375] }, shape: "box", pos: ["f*w+0.08", 0.74, 0.345], scale: [0.12, 0.02, 0.02], color: "#5f6b78", mat: "METAL", skipLean: true },
      { shape: "box", pos: [0, 0.88, 0.02], scale: ["w+0.04", 0.04, 0.74], color: "#262a30", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*(w/2-0.04)", 1.25, -0.25], scale: [0.04, 0.7, 0.2], color: "#c8955a", mat: "WOOD" },
      { for: { y: [1.28, 1.58] }, shape: "box", pos: [0, "y", -0.25], scale: ["w-0.04", 0.03, 0.2], color: "#c8955a", mat: "WOOD" },
      { for: { k: [-0.4, -0.3, -0.12, 0.05, 0.15, 0.32] }, shape: "cyl8", pos: ["k*w", 1.38, -0.25], scale: [0.08, 0.17, 0.08], color: "k < 0 ? '#7a4a1e' : '#cfe3ea'", mat: "GLASS" },
      { for: { k: [-0.4, -0.3, -0.12, 0.05, 0.15, 0.32] }, shape: "cyl8", pos: ["k*w", 1.49, -0.25], scale: [0.04, 0.05, 0.04], color: "#2b2f36", mat: "PAINT", skipLean: true },
    ],
  },
  // fume hood: base cabinet, a hood with the sash pushed up, a duct to the
  // ceiling; the room puts glassware inside (worktop at 0.9 m)
  fumehood: {
    parts: [
      { shape: "box", pos: [0, 0.43, 0], scale: [1.3, 0.86, 0.7], color: "#e4e7eb", mat: "PAINT" },
      { shape: "box", pos: [0, 0.88, 0.01], scale: [1.32, 0.04, 0.74], color: "#262a30", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["s*0.62", 1.5, 0], scale: [0.06, 1.2, 0.7], color: "#eef0f2", mat: "PAINT" },
      { shape: "box", pos: [0, 1.5, -0.33], scale: [1.18, 1.2, 0.04], color: "#cfd5dc", mat: "PAINT" },
      { shape: "box", pos: [0, 2.35, 0], scale: [1.3, 0.5, 0.7], color: "#eef0f2", mat: "PAINT" },
      { shape: "box", pos: [0, 1.88, 0.33], scale: [1.18, 0.44, 0.03], color: "#bfe3f2", mat: "GLASS" },
      { shape: "box", pos: [0, 1.67, 0.345], scale: [1.18, 0.04, 0.03], color: "#5f6b78", mat: "METAL" },
      { shape: "box", pos: [0, 2.35, 0.355], scale: [0.5, 0.12, 0.01], color: "#F97316", mat: "PAINT", skipLean: true },
      { shape: "cyl8", pos: [0, 2.9, -0.1], scale: [0.26, 0.6, 0.26], color: "#b8bec7", mat: "METAL" },
      { for: { x: [-0.4, 0, 0.4] }, collider: ["x", 0], r: 0.4 },
    ],
  },
  // on a wall, front +z: goggles rack under a blue «wear goggles» sign, the
  // green first-aid sign, the green eyewash sign over an eyewash bottle box
  safety: {
    parts: [
      { shape: "box", pos: [-0.55, 1.4, 0.02], scale: [0.55, 0.5, 0.03], color: "#eef0f2", mat: "PAINT" },
      { for: { y: [1.3, 1.52] }, shape: "box", pos: [-0.55, "y", 0.05], scale: [0.55, 0.02, 0.05], color: "#9aa1ab", mat: "METAL" },
      { for: { x: [-0.72, -0.55, -0.38], y: [1.24, 1.46] }, parts: [
        { shape: "rboxSoft", pos: ["x", "y", 0.07], scale: [0.14, 0.06, 0.05], color: "#bfe3f2", mat: "GLASS" },
        { shape: "box", pos: ["x", "y+0.04", 0.06], scale: [0.15, 0.015, 0.02], color: "y > 1.3 ? '#facc15' : '#3288EF'", mat: "FABRIC", skipLean: true },
      ] },
      { shape: "cyl20", pos: [-0.55, 1.88, 0.025], rot: [1.5708, 0, 0], scale: [0.3, 0.02, 0.3], color: "#1d4ed8", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "box", pos: ["-0.55+s*0.05", 1.88, 0.04], scale: [0.07, 0.05, 0.01], color: "#ffffff", mat: "PAINT", skipLean: true },
      { shape: "box", pos: [0, 1.85, 0.02], scale: [0.4, 0.4, 0.02], color: "#15803d", mat: "PAINT" },
      { shape: "box", pos: [0, 1.85, 0.035], scale: [0.26, 0.08, 0.01], color: "#ffffff", mat: "PAINT" },
      { shape: "box", pos: [0, 1.85, 0.035], scale: [0.08, 0.26, 0.01], color: "#ffffff", mat: "PAINT" },
      { shape: "box", pos: [0.5, 1.85, 0.02], scale: [0.4, 0.4, 0.02], color: "#15803d", mat: "PAINT" },
      { shape: "cyl20", pos: [0.5, 1.85, 0.035], rot: [1.5708, 0, 0], scale: [0.26, 0.01, 0.13], color: "#ffffff", mat: "PAINT" },
      { shape: "cyl20", pos: [0.5, 1.85, 0.042], rot: [1.5708, 0, 0], scale: [0.09, 0.01, 0.09], color: "#15803d", mat: "PAINT", skipLean: true },
      { shape: "box", pos: [0.5, 1.33, 0.08], scale: [0.32, 0.34, 0.12], color: "#16a34a", mat: "PAINT" },
      { for: { s: [-1, 1] }, shape: "cyl8", pos: ["0.5+s*0.07", 1.36, 0.15], scale: [0.09, 0.22, 0.09], color: "#f8fafc", mat: "PAINT", skipLean: true },
    ],
  },
  // solar panel on a stand, tilted toward +z, with an orange charging box
  // and its cable (Herr Tesla's Solar-Ladestation)
  solar: {
    parts: [
      { shape: "box", pos: [0, 0.025, 0], scale: [0.6, 0.05, 0.5], color: "#3d4450", mat: "METAL" },
      { shape: "cyl8", pos: [0, 0.55, -0.05], scale: [0.07, 1.0, 0.07], color: "#9aa1ab", mat: "METAL" },
      { shape: "box", pos: [0, 1.09, 0], rot: [0.6, 0, 0], scale: [1.06, 0.03, 0.72], color: "#c3c8cf", mat: "METAL" },
      { shape: "box", pos: [0, 1.1, 0], rot: [0.6, 0, 0], scale: [1.0, 0.04, 0.66], color: "#1e3a5f", mat: "SOLAR" },
      { shape: "box", pos: [0.48, 0.12, 0.3], scale: [0.32, 0.24, 0.2], color: "#F97316", mat: "PAINT" },
      { shape: "box", pos: [0.48, 0.245, 0.3], scale: [0.09, 0.012, 0.16], color: "#1f2329", mat: "PAINT", skipLean: true },
      { shape: "box", pos: [0.4, 0.18, 0.402], scale: [0.03, 0.03, 0.01], color: "#4ade80", mat: "PAINT", glow: 1, skipLean: true },
      { shape: "cyl6", pos: [0.25, 0.3, 0.1], rot: [0, 0, 1.0], scale: [0.02, 0.62, 0.02], color: "#1f2329", mat: "PAINT", skipLean: true },
      { collider: [0, 0], r: 0.5 },
      { collider: [0.48, 0.3], r: 0.25 },
    ],
  },
  // oscilloscope with a green trace, a yellow multimeter beside it
  scope: {
    parts: [
      { shape: "box", pos: [0, 0.13, 0], scale: [0.42, 0.26, 0.32], color: "#d4d8de", mat: "METAL" },
      { shape: "box", pos: [-0.07, 0.14, 0.161], scale: [0.22, 0.15, 0.01], color: "#0b2b1a", mat: "PAINT" },
      { for: { k: [0, 1, 2, 3] }, shape: "box", pos: ["-0.145+k*0.05", 0.14, 0.167], rot: [0, 0, "k%2 ? -0.9 : 0.9"], scale: [0.065, 0.008, 0.004], color: "#4ade80", mat: "PAINT", glow: 1, skipLean: true },
      { for: { x: [0.1, 0.16], y: [0.08, 0.18] }, shape: "cyl6", pos: ["x", "y", 0.17], rot: [1.5708, 0, 0], scale: [0.035, 0.02, 0.035], color: "#2b2f36", mat: "PAINT", skipLean: true },
      { shape: "rbox", pos: [0.42, 0.09, 0.05], rot: [-0.3, -0.3, 0], scale: [0.11, 0.18, 0.04], color: "#facc15", mat: "PAINT" },
      { shape: "box", pos: [0.42, 0.13, 0.072], rot: [-0.3, -0.3, 0], scale: [0.08, 0.04, 0.006], color: "#9fb59a", mat: "PAINT", skipLean: true },
      { for: { s: [-1, 1] }, shape: "cyl6", pos: ["0.42+s*0.025", 0.012, 0.16], rot: [1.5708, 0, 0], scale: [0.012, 0.2, 0.012], color: "s > 0 ? '#dc2626' : '#1f2329'", mat: "PAINT", skipLean: true },
    ],
  },
  // periodic-table poster: white sheet, title strip, the element cells in
  // their block colours (s red, d blue, p yellow, noble gases violet, f green)
  periodic: {
    let: { cw: 0.075 },
    parts: [
      { shape: "box", pos: [0, 0.5, 0.01], scale: [1.5, 1.0, 0.012], color: "#fbfaf6", mat: "PAINT" },
      { shape: "box", pos: [0, 0.93, 0.018], scale: [1.3, 0.06, 0.004], color: "#1e3a8a", mat: "PAINT" },
      // [first column, cells, row, colour]; rows 7.4 and 8.4 are the f-block
      ...[
        [0, 1, 0, "#f87171"], [17, 1, 0, "#a78bfa"],
        [0, 2, 1, "#f87171"], [12, 5, 1, "#fcd34d"], [17, 1, 1, "#a78bfa"],
        [0, 2, 2, "#f87171"], [12, 5, 2, "#fcd34d"], [17, 1, 2, "#a78bfa"],
        ...[3, 4, 5, 6].flatMap((r) => [[0, 2, r, "#f87171"], [2, 10, r, "#60a5fa"], [12, 5, r, "#fcd34d"], [17, 1, r, "#a78bfa"]]),
        [3, 14, 7.4, "#86efac"], [3, 14, 8.4, "#86efac"],
      ].map(([c0, n, row, color]) => ({
        repeat: { i: n },
        shape: "box",
        pos: [`(${c0}+i-8.5)*cw`, r2(0.82 - row * 0.075), 0.02],
        scale: ["cw-0.01", 0.065, 0.004],
        color,
        mat: "PAINT",
      })),
    ],
  },
});

// Own geometries (three.js arguments), carried by the rooms that use them.
const GEOMS = {
  pot: { type: "cylinder", args: [0.24, 0.17, 0.44, 10] }, // tapered flower pot
  flaskLow: { type: "cylinder", args: [0.045, 0.075, 0.09, 12] }, // Erlenmeyer, lower half
  flaskTop: { type: "cylinder", args: [0.017, 0.045, 0.08, 12] }, // Erlenmeyer, shoulder
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
  // Colliders every `step` metres from (x0, z0) to (x1, z1) as one repeat node.
  const collideLine = (x0, z0, x1, z1, r, step) => {
    const [ax, az] = P(x0, z0);
    const [bx, bz] = P(x1, z1);
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step));
    const at = (a, b) => (b === a ? a : `${a}+i*${Math.round(((b - a) / n) * 1e4) / 1e4}`);
    parts.push({ repeat: { i: n + 1 }, collider: [at(ax, bx), at(az, bz)], r });
  };
  const t = WALL_T / TILE_M / 2;
  // Axis-aligned wall with colliders every 0.4 m: close enough that the
  // walker's body (radius 0.3) stays out of the wall, small enough that
  // doorways stay wide. The map edge walls need them too, the walk mask
  // alone lets the body reach halfway into them.
  const wall = (x0, z0, x1, z1) => {
    if (z0 === z1) box(x0, z0 - t, x1, z0 + t, 0, WALL_H, C.wall);
    else box(x0 - t, z0, x0 + t, z1, 0, WALL_H, C.wall);
    collideLine(x0, z0, x1, z1, 0.2, 0.4);
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
  const place = (x, z, face, nodes, y = 0) => {
    const [px, pz] = P(x, z);
    const yaw = FACE[face];
    parts.push({ frame: yaw ? [px, y, pz, yaw] : [px, y, pz], parts: nodes });
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
  // `n` boards; `fill` books per bay and level. `binders`: ring binders of
  // one height with white spine labels.
  const bookcase = (x0, z0, x1, z1, face, h, n, bays, fill, colors, back = 0, binders = false) => {
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
          const w = binders ? 0.07 : 0.05 + rnd() * 0.05;
          const bh = gap * (binders ? 0.8 : 0.55 + rnd() * 0.3);
          const y0 = 0.05 + lv * gap + 0.0175;
          const book = { x: r2(x + w / 2), y: r2(y0 + bh / 2), w: r2(w), h: r2(bh), c: colors[Math.floor(rnd() * colors.length)] };
          (i % 2 ? leanBooks : books).push(book);
          x += w + 0.006;
          if (rnd() < 0.18) x += 0.12; // a gap now and then
        }
      }
    // one node per set of books, every other book left out on the lean tiers
    const row = { shape: "box", pos: ["x", "y", r2(-D / 2 + 0.16)], scale: ["w", "h", 0.26], color: "c", mat: "PAINT" };
    const label = { shape: "box", pos: ["x", "y+h*0.12", r2(-D / 2 + 0.293)], scale: ["w*0.62", "h*0.36", 0.006], color: "#f8f6ee", mat: "PAINT", skipLean: true };
    const ring = { shape: "cyl6", pos: ["x", "y-h*0.3", r2(-D / 2 + 0.292)], rot: [1.5708, 0, 0], scale: [0.03, 0.006, 0.03], color: "#2b2f36", mat: "PAINT", skipLean: true };
    if (binders) nodes.push({ each: books, parts: [row, label, ring] }, { each: leanBooks, parts: [{ ...row, skipLean: true }, label, ring] });
    else nodes.push({ each: books, ...row }, { each: leanBooks, ...row, skipLean: true });
    // centre of the case: pushed back toward the wall
    const back3 = { south: [0, -1], north: [0, 1], east: [-1, 0], west: [1, 0] }[face];
    place(cx + (back3[0] * shift) / TILE_M, cz + (back3[1] * shift) / TILE_M, face, nodes);
    footprint(x0, z0, x1, z1);
  };
  // A framed board on a wall (`board` component): (x, z) on the wall line,
  // its face toward `face`; w, h in metres, y its lower edge.
  const board = (x, z, face, w, h, y, c, more = {}, extra = []) => {
    const d = { south: [0, t], north: [0, -t], east: [t, 0], west: [-t, 0] }[face];
    place(x + d[0], z + d[1], face, [use("board", { w, h, y, c, ...more }), ...extra]);
  };
  // A low table over a footprint (`lowtable`, with a mug and a notebook).
  const lowtable = (x0, z0, x1, z1, h = 0.45) => {
    const [x, z] = mid(x0, z0, x1, z1);
    place(x, z, "south", [use("lowtable", { w: r2((x1 - x0) * TILE_M - 0.1), d: r2((z1 - z0) * TILE_M - 0.1), h })]);
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
    collide, collideLine, board, lowtable,
  });
  // only the components this room uses
  const used = new Set(JSON.stringify(parts).match(/"use":"\w+"/g)?.map((s) => s.slice(7, -1)));
  const define = Object.fromEntries(Object.entries(DEFS).filter(([k]) => used.has(k)));
  const doc = { $schema: "hazu.world/landmark@1", id, frame: { kind: "footprint", name: "F" } };
  const json = JSON.stringify(define);
  const geometries = Object.fromEntries(Object.entries(GEOMS).filter(([k]) => json.includes(`"shape":"${k}"`)));
  if (Object.keys(geometries).length) doc.geometries = geometries;
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
  roomDoc("schulhaus_aula", anchors.aula, ({ box, wall, wallWithDoor, thing, floor, onBack, windowsBack, place, use, footprint, sign, collide, board }) => {
    wall(0, 0, COLS, 0); // back wall of the whole house
    wall(6, 0, 6, 6);
    wall(18, 0, 18, 6);
    wallWithDoor(6, 18, 6, 10.5, 13.5); // wide double door onto the corridor
    floor(6.1, 0.1, 17.9, 5.95, C.floorWood);
    // stage with a dark skirt, a light nosing and two steps in the middle;
    // a lectern, the framed board, gathered curtains under a pelmet, a clock,
    // high windows
    thing(9, 0.2, 15, 1.8, 0.45, C.stage);
    box(9, 1.8, 15, 1.83, 0.04, 0.36, "#5a3b22", "WOOD");
    box(8.98, 1.77, 15.02, 1.85, 0.4, 0.06, C.wood, "WOOD");
    box(11.3, 1.8, 12.7, 1.95, 0, 0.3, C.stage, "WOOD");
    box(11.3, 1.95, 12.7, 2.1, 0, 0.15, C.stage, "WOOD");
    for (const [z, y] of [[1.95, 0.27], [2.1, 0.12]]) box(11.3, z - 0.01, 12.7, z + 0.005, y, 0.03, C.wood, "WOOD").skipLean = true;
    for (const x of [11.7, 12.3]) collide(x, 1.95, 0.3);
    place(12, 1.15, "south", [use("lectern")], 0.45);
    board(12, 0, "south", 7.6, 1.45, 1.15, C.board);
    for (const x of [9.55, 14.45]) place(x, 0.2, "south", [use("curtain", { n: 6, h: 2.7 })], 0.45);
    box(9, 0.08, 15, 0.3, 2.95, 0.22, "#8f2a37", "FABRIC");
    place(6.08, 3, "east", [{ shape: "cyl20", pos: [0, 2.45, 0.02], rot: [1.5708, 0, 0], scale: [0.4, 0.05, 0.4], color: C.white, mat: "PAINT" },
      { shape: "box", pos: [0, 2.49, 0.05], scale: [0.025, 0.14, 0.01], color: "#2b2f36", mat: "PAINT", skipLean: true },
      { shape: "box", pos: [0.04, 2.45, 0.05], rot: [0, 0, 1.2], scale: [0.02, 0.1, 0.01], color: "#2b2f36", mat: "PAINT", skipLean: true }]);
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
  roomDoc("schulhaus_interessen", anchors.interessen, ({ wallWithDoor, floor, notes, windowsBack, desk, chairsAround, plant, sign, board }) => {
    wallWithDoor(18, COLS, 6, 20.2, 21.8);
    floor(18.1, 0.1, 23.9, 5.95, C.floorGreen);
    // project tables with chairs, a plant, a pin board with project notes
    desk(18.8, 2.4, 21, 3.4);
    chairsAround(18.8, 2.4, 21, 3.4, 2, C.chairs);
    desk(21.6, 3.8, 23.4, 4.8);
    chairsAround(21.6, 3.8, 23.4, 4.8, 2, C.chairs.slice(2), ["north"]);
    plant(23.2, 0.4, 23.7, 0.9);
    board(20, 0, "south", 5.5, 1.3, 1.1, "#c9a26b", { tr: 0 }); // cork pin board
    notes(18.8, 0.095, 1.25, 6);
    windowsBack([[21.9, 22.9]]);
    sign(21, 6.11, "south");
  }),
  roomDoc("schulhaus_lernatelier", anchors.lernatelier, ({ wallWithDoor, wallWithDoorZ, wall, floor, desk, chairsAround, bookcase, sign, board }) => {
    wallWithDoor(0, 10, 8, 6, 7.5); // north wall onto the corridor
    wall(0, 13, 10, 13);
    wallWithDoorZ(10, 8, 13, 9.5, 11); // east wall onto the hall
    floor(0.1, 8.05, 9.95, 12.95, C.floorWood);
    // group tables in two rows, the green board on the west wall
    board(0, 10.6, "east", 5.4, 1.2, 1.05, C.board);
    let k = 0;
    for (const x of [3, 5.6])
      for (const z of [9.3, 11.3]) {
        desk(x, z, x + 1.4, z + 0.8);
        // Lea and Joel stand at the north side of the first table, working together
        const sides = x === 3 && z === 9.3 ? ["south"] : undefined;
        chairsAround(x, z, x + 1.4, z + 0.8, 2, C.chairs.slice(k++ % 3), sides);
      }
    bookcase(8.4, 12.2, 9.8, 12.8, "north", 1.6, 4, 2, 5, C.binders, -0.1, true); // weekly-plan shelf
    sign(6.75, 7.89, "north");
  }),
  roomDoc("schulhaus_coaching", anchors.coaching, ({ wallWithDoor, wallWithDoorZ, wall, floor, sofa, plant, sign, board, lowtable, local, collideLine }) => {
    wallWithDoor(14, COLS, 8, 16.5, 18);
    // A wide passage into the Workshop-Raum (⑤ → ⑥), east of the
    // workbenches. «Hingehen» walks a straight grid path that does not know
    // the walls (engine world/grid.js findPath), so Herr Tesla stands in
    // line with this opening: walking over from the Coaching-Raum goes
    // through it instead of stopping at the wall.
    wallWithDoor(14, COLS, 13, 21, 23.9);
    wallWithDoorZ(14, 8, 13, 9.5, 11);
    // no east wall (the dollhouse's open side): colliders keep walkers and
    // «Hingehen» spots off the island rim
    collideLine(COLS, 8, COLS, 13, 0.2, 0.4);
    floor(14.05, 8.05, 23.9, 12.95, C.floorCarpet);
    // two armchairs facing each other (east, in line with the passage to
    // the Workshop-Raum), a low table, a rug, a plant, goals board
    floor(19.8, 9.6, 23.2, 11.4, "#e9d5b7", 1);
    sofa(19.9, 10, 20.9, 11, "east", 1.05, 0.95, C.fabricWarm, "#f3b08c");
    sofa(22.1, 10, 23.1, 11, "west", 1.05, 0.95, C.fabric, "#9db8e3");
    lowtable(21.15, 10.25, 21.85, 10.75);
    plant(14.3, 12.2, 14.8, 12.7); // the east corner is the passage
    // whiteboard with a few lines of goals in marker and sticky notes
    const ink = (x, y, w, color) => local("box", x, y, 0.04, w, 0.025, 0.01, color, "PAINT", true);
    board(COLS, 10.5, "west", 5.8, 1.2, 1.05, C.white, { f: "#c3c8cf", wd: 0 }, [
      ink(-2.1, 2.0, 1.1, "#1e3a8a"), ink(-2.25, 1.82, 0.8, "#1e3a8a"), ink(-2.0, 1.64, 1.3, "#1e3a8a"), ink(-2.2, 1.46, 0.9, "#15803d"),
      ink(-0.4, 2.0, 0.9, "#b91c1c"), ink(-0.3, 1.82, 1.1, "#1e3a8a"), ink(-0.45, 1.64, 0.8, "#1e3a8a"),
      ...[[1.3, 1.85, C.note[0]], [1.75, 1.85, C.note[2]], [1.3, 1.45, C.note[3]], [2.2, 1.6, C.note[1]]].map(([x, y, c]) => local("box", x, y, 0.045, 0.3, 0.3, 0.01, c, "PAINT")),
    ]);
    sign(17.25, 7.89, "north");
  }),
  roomDoc("schulhaus_pause", anchors.pause, ({ floor, windowsSide, lowtable, sofa, plant, sign }) => {
    floor(0.1, 13.05, 9.95, 17.95, C.floorLino);
    // sofa, coffee table, a plant
    sofa(1.4, 14, 4.6, 14.9, "south", 4.4, 1, C.fabric, "#9db8e3", 3);
    lowtable(2.5, 15.6, 3.5, 16.4, 0.42);
    plant(0.4, 17.2, 0.9, 17.7);
    windowsSide(0, [[14.2, 16.2]]);
    sign(5.5, 13.11, "south"); // centred on its north wall, seen from the hall
  }),
  roomDoc("schulhaus_workshop", anchors.workshop, ({ wallWithDoorZ, floor, place, use, footprint, sign, board, collideLine }) => {
    wallWithDoorZ(14, 13, 18, 14.5, 16);
    collideLine(COLS, 13, COLS, 18, 0.2, 0.4); // open east side, as in the Coaching-Raum
    floor(14.05, 13.05, 23.9, 17.95, C.floorGreen);
    // two workbenches facing a screen on the east wall, stools, a toolbox
    board(COLS, 15.5, "west", 5.6, 1.7, 1.1, "#1d2733", { f: "#2b2f36", wd: 0, tr: 0 }); // screen
    // pegboard with tools on the north wall
    board(16.3, 13, "south", 2.6, 1.0, 1.15, "#d8b98a", { tr: 0 });
    const tool = (x, y, rz, sx, sy, color, mat = "METAL") => ({ shape: "box", pos: [x, y, 0.06], rot: rz ? [0, 0, rz] : undefined, scale: [sx, sy, 0.025], color, mat });
    place(16.3, 13 + WALL_T / TILE_M / 2, "south", [
      tool(-0.9, 1.6, 0, 0.04, 0.34, C.wood, "WOOD"), tool(-0.9, 1.79, 0, 0.16, 0.05, "#3d4450"), // hammer
      tool(-0.35, 1.7, 0, 0.5, 0.13, "#b8bec7"), tool(-0.66, 1.7, 0, 0.12, 0.13, "#c0392b", "PAINT"), // saw
      tool(0.25, 1.62, 0.25, 0.04, 0.4, "#9aa1ab"), // wrench
      tool(0.6, 1.62, 0, 0.035, 0.22, "#d4d8de"), tool(0.6, 1.83, 0, 0.06, 0.16, "#F97316", "PAINT"), // screwdriver
      tool(0.95, 1.6, 0, 0.05, 0.3, C.woodDark, "WOOD"), tool(0.95, 1.79, 0, 0.12, 0.1, "#5f6b78"), // mallet
    ]);
    // things standing on a top at height y, in the frame of what carries them
    const on = (x, z, y, node, yaw) => ({ frame: yaw ? [x, y, z, yaw] : [x, y, z], parts: [node] });
    for (const [z0, z1, stoolZ, extra] of [
      // toolbox, oscilloscope and multimeter on the back bench
      [14.2, 15, 14.16, [on(-2.6, 0, 0.9, use("toolbox")), on(2.4, -0.15, 0.9, use("scope"), -0.15)]],
      // the red-cabbage flask and three beakers on the front bench
      [16.2, 17, 17.04, [on(1.8, 0.1, 0.9, use("crate"), 0.3), on(-0.3, 0, 0.9, use("flask", { c: INDICATOR[2], k: 1.8 })),
        ...[-1.3, -1.05, -0.8].map((x, i) => on(x, 0.1, 0.9, use("beaker", { c: INDICATOR[i * 2] })))]],
    ]) {
      place(18.25, (z0 + z1) / 2, "south", [use("workbench", { w: 8.9, d: 1.5 }), ...extra]);
      footprint(16, z0, 20.5, z1);
      [16.6, 17.7, 18.8, 19.9].forEach((x, i) => place(x, stoolZ, "south", [use("stool", { c: C.chairs[(i + (z0 > 15 ? 2 : 0)) % C.chairs.length] })]));
    }
    // Säure-Base-Labor corner: a lab bench with glassware against the west
    // wall south of the door, the safety corner north of it, a fume hood and
    // a periodic table on the north wall (west of the passage), Herr Tesla's
    // solar charging station in the open south-east corner
    const t = WALL_T / TILE_M / 2;
    place(14 + t + 0.175, 17.15, "east", [
      use("labbench", { w: 2.5 }),
      on(0.8, 0.05, 0.9, use("tuberack")),
      on(0.35, 0.1, 0.9, use("flask", { c: "#16a34a" })),
      on(0.05, 0.12, 0.9, use("beaker", { c: "#dc2626" })),
      on(-0.3, 0.05, 0.9, use("flask", { c: "#2563eb", k: 1.2 })),
      on(-0.8, 0.12, 0.9, use("beaker", { c: "#eab308" })),
    ]);
    collideLine(14.25, 16.6, 14.25, 17.7, 0.4, 0.5);
    place(14 + t, 13.75, "east", [use("safety")]);
    place(20.2, 13 + t + 0.175, "south", [use("fumehood"), on(-0.3, -0.05, 0.9, use("flask", { c: "#16a34a", k: 1.3 })), on(0.25, 0, 0.9, use("beaker", { c: "#eab308" }))]);
    place(18.55, 13 + t, "south", [use("periodic")], 1.25);
    place(22.3, 17.2, "south", [use("solar")]);
    sign(13.89, 15.25, "west");
  }),
  roomDoc("schulhaus_halle", anchors.halle, ({ floor, place, use, collide, collideLine, sign }) => {
    floor(0.1, 6.05, 23.9, 7.95, C.floorLino); // corridor
    floor(10.05, 8.05, 13.95, 17.95, C.floorLino); // entrance hall
    // two banks of school lockers against the corridor's north wall (0.4 m
    // columns, 0.5 m deep), one open upper door with a jacket, one open
    // lower door with a school bag; a doormat
    const LZ = 6 + WALL_T / TILE_M / 2 + 0.125; // column centre, its back on the wall
    const bank = (x0, n, shift, open) => {
      const W = 0.2; // tiles
      for (let i = 0; i < n; i++) {
        const o = open[0] === i ? open[1] : 0;
        place(x0 + (i + 0.5) * W, LZ, "south", [use("locker", o ? { c: C.locker[(i + shift) % 5], o } : { c: C.locker[(i + shift) % 5] })]);
        if (o) collide(x0 + i * W + 0.02, LZ + 0.25, 0.25); // the open door
      }
      collideLine(x0 + 0.1, LZ, x0 + n * W - 0.1, LZ, 0.3, 0.4);
    };
    bank(6.4, 10, 0, [3, 2]);
    bank(14.6, 10, 2, [6, 1]);
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
// Background characters (backgroundNpcs): small groups standing on free
// floor, off furniture, doorways, anchors, the open locker doors and the
// route characters' spots. Tile (gx, gy) puts the figure at (gx + 0.5, gy + 0.5).
const bgTiles = {
  ladina: [3.7, 15.1], // Pausenzone, east of the low table
  flurin: [4.4, 15.9],
  noemi: [3.1, 16.5],
  nils: [7.6, 6.3], // corridor, at the west locker bank
  anouk: [8.35, 6.6],
  seraina: [2.8, 0.7], // Bibliothek, at the bookcase
  gian: [3.8, 0.85],
  elin: [15.4, 1.9], // Aula, east of the stage, in front of the benches
  dario: [16.3, 2.15],
  ronja: [7, 10.95], // Lernatelier, east end of the back table
  andri: [7.65, 11.45],
};
const extras = backgroundNpcs.map(({ id, name, color, subject, extra }) => npc(id, ...bgTiles[id], name, color, subject, extra));

// In route order: the world panel's list and the «Übersicht» follow it.
const npcs = [
  // The engine stands each character's station post 2.4 m to its
  // south-east (sims/place.js, fixed angle 0.9 rad, not the figure's yaw), so
  // each guide with a station keeps open floor on that side: Yara south of
  // the Tagesplan, her post clear of the hall wall and the Workshop door.
  cast("yara", 12.1, 12.45),
  cast("lehrerin", 12, 2),
  cast("matilda", 10, 2),
  cast("lea", 2.9, 8.5),
  cast("joel", 3.55, 8.5, { look: { hairStyle: "short", hair: "#3b2a1e" } }),
  cast("quirin", 8, 10),
  cast("mathe", 1.9, 9.6, { female: true, hat: "glasses", look: { hairStyle: "bun", hair: "#6b4a2b" } }),
  cast("tobi", 19, 4),
  // south of the east armchair, in line with the passage; his post stands
  // east of the walk line through it, clear of the passage's jamb
  cast("coach", 22.1, 11.1),
  // east of the workbenches, in line with the passage from the Coaching-Raum
  // (see the connecting door there), far enough from the open east edge that
  // «Hingehen» lands in front of him inside the room and his post stands on
  // the floor between him and the screen
  cast("workshop", 21.7, 13.9),
  ...extras,
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
  ...backgroundDialogue,
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
