// Generates level/schulhaus.json, the interior of the Schulhaus.
//
//   node level/build-schulhaus.mjs
//
// A dollhouse school: back and side walls, the front (south) open toward the
// camera. Rooms: Aula (morning and evening circle) in the middle, Lernatelier
// in the west, Coaching-Raum in the east, Workshop-Raum and Pausenzone in the
// south. Each room is a tiny anchor building (its name sign) whose landmark
// document draws the room's walls and furniture outside its own footprint,
// so the floor stays walkable. Furniture gets colliders.
//
// Flagged `v4.indoor: {walls: "none"}` for the engine's indoor mode (no sky,
// no island) once it exists; the walls here stay ours.

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";

const COLS = 22;
const ROWS = 16;
const TILE_M = 2; // metres per tile
const WALL_H = 3.2;
const WALL_T = 0.3;
const T = { GRASS: 0, ROAD: 1, WATER: 2, PLAZA: 3, BRIDGE: 4, PARK: 5, FLOWERS: 6, FOREST: 7 };

const map = Array.from({ length: ROWS }, () => Array(COLS).fill(T.PLAZA));

const C = {
  wall: "#f3ede2",
  wallAccent: "#e4d6bf",
  wood: "#c8955a",
  woodDark: "#8a6236",
  stage: "#a8744a",
  fabric: "#5b7fb8",
  fabricWarm: "#d9774b",
  green: "#4c9a5a",
  board: "#2f4a3a",
  white: "#fafafa",
  metal: "#9aa3ad",
  floorWood: "#d9b88a",
  floorLino: "#9fb3c2",
  floorCarpet: "#c98b7a",
  floorGreen: "#a9c4a0",
  glass: "#a9d8f2",
  locker: ["#3288EF", "#F97316", "#22C55E", "#EAB308", "#8B5CF6"],
  note: ["#fde68a", "#fca5a5", "#a7f3d0", "#bfdbfe"],
  curtain: "#b23a48",
};

// A room's parts are written in level tile coordinates (x = column, z = row,
// continuous) and converted to the anchor's frame: its footprint centre,
// facing south (+z), in metres.
function roomDoc(id, title, anchor, build) {
  const ox = anchor.gx + 0.5;
  const oz = anchor.gy + 0.5;
  const P = (x, z) => [(x - ox) * TILE_M, (z - oz) * TILE_M];
  const parts = [];
  const box = (x0, z0, x1, z1, y0, h, color, mat = "PLASTER") => {
    const [ax, az] = P(x0, z0);
    const [bx, bz] = P(x1, z1);
    parts.push({
      shape: "box",
      pos: [(ax + bx) / 2, y0 + h / 2, (az + bz) / 2],
      scale: [Math.abs(bx - ax), h, Math.abs(bz - az)],
      color,
      mat,
    });
  };
  const collide = (x, z, r) => {
    const [cx, cz] = P(x, z);
    parts.push({ collider: [cx, cz], r });
  };
  // A wall from (x0, z0) to (x1, z1), axis-aligned, with colliders along it.
  const wall = (x0, z0, x1, z1, color = C.wall) => {
    const t = WALL_T / TILE_M / 2;
    if (z0 === z1) box(x0, z0 - t, x1, z0 + t, 0, WALL_H, color);
    else box(x0 - t, z0, x0 + t, z1, 0, WALL_H, color);
    // The map edge already stops walkers; only inner walls need colliders.
    const onEdge = (x0 === x1 && (x0 === 0 || x0 === COLS)) || (z0 === z1 && z0 === 0);
    if (onEdge) return;
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.ceil((len * TILE_M) / 1.2));
    for (let i = 0; i <= n; i++) collide(x0 + ((x1 - x0) * i) / n, z0 + ((z1 - z0) * i) / n, 0.35);
  };
  // Furniture block with one collider per tile it covers.
  const thing = (x0, z0, x1, z1, h, color, mat = "WOOD", r = 0.75) => {
    box(x0, z0, x1, z1, 0, h, color, mat);
    // one collider per tile covered, sized to the block
    for (let x = x0 + 0.5; x < x1 + 0.01; x += 1)
      for (let z = z0 + Math.min(0.5, (z1 - z0) / 2); z < z1 + 0.01; z += 1)
        collide(Math.min(x, x1 - 0.2), Math.min(z, z1 - 0.2), r * 0.7);
  };
  // Flat floor overlay for a room.
  const floor = (x0, z0, x1, z1, color) => box(x0, z0, x1, z1, 0, 0.06, color, "PAINT");
  // Something flat hung on the back wall (z = 0) or a side wall (x = 0 / COLS).
  const t = WALL_T / TILE_M / 2 + 0.01;
  const onBack = (x0, x1, y0, h, color, mat = "PAINT", extra = {}) => {
    box(x0, t, x1, t + 0.05, y0, h, color, mat);
    if (extra.glow) parts[parts.length - 1].glow = extra.glow;
  };
  const onSide = (x, z0, z1, y0, h, color, mat = "PAINT", extra = {}) => {
    const inward = x === 0 ? 1 : -1;
    const a = x + inward * t;
    box(Math.min(a, a + inward * 0.05), z0, Math.max(a, a + inward * 0.05), z1, y0, h, color, mat);
    if (extra.glow) parts[parts.length - 1].glow = extra.glow;
  };
  // Lintel and posts over a doorway in a wall along x (z fixed) or along z.
  const doorFrame = (x0, z0, x1, z1) => {
    const d = WALL_T / TILE_M / 2 + 0.02;
    if (z0 === z1) {
      box(x0, z0 - d, x1, z0 + d, 2.3, WALL_H - 2.3, C.wall, "PLASTER");
      box(x0, z0 - d, x0 + 0.08, z0 + d, 0, 2.3, C.woodDark, "WOOD");
      box(x1 - 0.08, z0 - d, x1, z0 + d, 0, 2.3, C.woodDark, "WOOD");
    } else {
      box(x0 - d, z0, x0 + d, z1, 2.3, WALL_H - 2.3, C.wall, "PLASTER");
      box(x0 - d, z0, x0 + d, z0 + 0.08, 0, 2.3, C.woodDark, "WOOD");
      box(x0 - d, z1 - 0.08, x0 + d, z1, 0, 2.3, C.woodDark, "WOOD");
    }
  };
  const windows = (xs, y0 = 1.3, h = 1.4) => {
    for (const [x0, x1] of xs) {
      onBack(x0, x1, y0, h, C.glass, "GLAZING", { glow: 0.4 });
      onBack(x0 - 0.05, x1 + 0.05, y0 - 0.1, 0.1, C.white);
    }
  };
  build({ box, wall, thing, collide, floor, onBack, onSide, doorFrame, windows });
  return { $schema: "hazu.world/landmark@1", id, version: "1.0.0", title, frame: { kind: "footprint", name: "F" }, parts };
}

// Two decimals are plenty (centimetres) and keep the level document small.
const r2 = (v) => Math.round(v * 100) / 100;
function roundParts(doc) {
  for (const p of doc.parts) {
    for (const k of ["pos", "scale", "collider"]) if (p[k]) p[k] = p[k].map(r2);
    if (p.r) p.r = r2(p.r);
  }
  return doc;
}

const anchors = {
  // one tile in from the map edge: the island's rim slopes, and a landmark's
  // floor is its footprint's lowest corner
  aula: { gx: 6, gy: 1 },
  lernatelier: { gx: 1, gy: 1 },
  coaching: { gx: 20, gy: 1 },
  workshop: { gx: 20, gy: 9 },
  pause: { gx: 1, gy: 9 },
  ausgang: { gx: 10, gy: 15 },
};

const landmarks = [
  roomDoc("schulhaus_aula", "Aula", anchors.aula, ({ box, wall, thing, floor, onBack, onSide, doorFrame, windows }) => {
    // back wall of the whole house and the Aula's side walls with doorways
    wall(0, 0, 22, 0);
    wall(6, 0, 6, 4.5);
    wall(16, 0, 16, 4.5);
    doorFrame(6, 4.5, 6, 6.2);
    doorFrame(16, 4.5, 16, 6.2);
    // stage with a lectern and a screen on the back wall
    thing(8.5, 0.2, 13.5, 2, 0.45, C.stage, "WOOD", 1);
    box(9.5, 0.08, 12.5, 0.18, 1.2, 1.6, C.board, "PAINT");
    box(10.7, 1.3, 11.3, 1.8, 0.45, 1.1, C.woodDark, "WOOD");
    floor(6.1, 0.1, 15.9, 7, C.floorWood);
    // curtains beside the board, a school clock, windows high on the wall
    onBack(8.6, 9.3, 0.5, 2.6, C.curtain, "FABRIC");
    onBack(12.7, 13.4, 0.5, 2.6, C.curtain, "FABRIC");
    onBack(10.75, 11.25, 2.6, 0.5, C.white);
    onBack(10.98, 11.02, 2.85, 0.2, C.board);
    onBack(11, 11.15, 2.84, 0.03, C.board);
    windows([[6.6, 8.2], [13.8, 15.4]], 1.4, 1.5);
    // benches in three rows with a middle aisle
    for (const z of [3.6, 4.8, 6]) {
      thing(7.4, z, 10.6, z + 0.45, 0.45, C.wood);
      thing(11.4, z, 14.6, z + 0.45, 0.45, C.wood);
    }
  }),
  roomDoc("schulhaus_lernatelier", "Lernatelier", anchors.lernatelier, ({ box, wall, thing, floor, onBack, onSide, doorFrame, windows }) => {
    wall(0, 0, 0, 16);
    wall(0, 7, 2.5, 7);
    wall(4, 7, 6, 7);
    // desks with chairs
    for (const [x, z] of [[1.5, 2], [3.6, 2], [1.5, 4.4], [3.6, 4.4]]) {
      thing(x, z, x + 1.4, z + 0.8, 0.75, C.wood);
      thing(x + 0.45, z + 1, x + 0.95, z + 1.45, 0.45, C.fabric, "FABRIC");
    }
    // shelf on the west wall with coloured books
    thing(0.2, 1, 0.6, 6, 1.9, C.woodDark);
    for (let i = 0; i < 8; i++)
      box(0.62, 1.2 + i * 0.6, 0.7, 1.6 + i * 0.6, 1.2, 0.35, ["#c0392b", "#2c7be5", "#27ae60", "#f1c40f"][i % 4], "PAINT");
    floor(0.1, 0.1, 6, 7, C.floorWood);
    doorFrame(2.5, 7, 4, 7);
    // green board, weekly-plan pin board with notes, windows
    onBack(2.2, 4.8, 1.1, 1.2, C.board);
    windows([[0.8, 1.9]], 1.3, 1.4);
    for (let i = 0; i < 6; i++) onBack(4.95 + (i % 3) * 0.25, 5.15 + (i % 3) * 0.25, 1.3 + Math.floor(i / 3) * 0.4, 0.3, C.note[i % 4]);
  }),
  roomDoc("schulhaus_coaching", "Coaching-Raum", anchors.coaching, ({ box, wall, thing, floor, onBack, onSide, doorFrame, windows }) => {
    wall(22, 0, 22, 16);
    wall(16, 7, 18, 7);
    wall(19.5, 7, 22, 7);
    // two armchairs facing each other, a small table, a plant
    thing(17.6, 2.6, 18.6, 3.6, 0.8, C.fabricWarm, "FABRIC");
    thing(20.2, 2.6, 21.2, 3.6, 0.8, C.fabric, "FABRIC");
    thing(18.9, 2.85, 19.9, 3.35, 0.5, C.wood);
    thing(21.2, 0.4, 21.7, 0.9, 1.4, C.green, "LEAF");
    floor(16.1, 0.1, 21.9, 7, C.floorCarpet);
    doorFrame(18, 7, 19.5, 7);
    // goals whiteboard with sticky notes, window, a rug
    onBack(17.3, 20.3, 1.1, 1.2, C.white);
    for (let i = 0; i < 5; i++) onBack(17.6 + i * 0.5, 17.9 + i * 0.5, 1.6 + (i % 2) * 0.3, 0.25, C.note[i % 4]);
    windows([[20.6, 21.6]], 1.3, 1.4);
    floor(17.8, 2.2, 21, 4, "#e9d5b7");
  }),
  roomDoc("schulhaus_workshop", "Workshop-Raum", anchors.workshop, ({ box, wall, thing, floor, onBack, onSide, doorFrame, windows }) => {
    floor(14, 7.1, 21.9, 15.9, C.floorGreen);
    // lockers along the east wall of the hall
    for (let i = 0; i < 5; i++) thing(21.2, 7.4 + i * 0.5, 21.75, 7.85 + i * 0.5, 1.9, C.locker[i % 5], "PAINT", 0.5);
    // screen on the east wall and two long tables
    box(21.84, 10, 21.92, 13.5, 1.1, 1.8, C.board, "PAINT");
    thing(16.5, 10, 20, 10.8, 0.75, C.wood);
    thing(16.5, 12.4, 20, 13.2, 0.75, C.wood);
  }),
  roomDoc("schulhaus_pause", "Pausenzone", anchors.pause, ({ box, wall, thing, floor, onBack, onSide, doorFrame, windows }) => {
    floor(0.1, 7.1, 14, 15.9, C.floorLino);
    // lockers along the south side of the Lernatelier wall
    for (let i = 0; i < 4; i++) thing(0.2 + i * 0.55, 7.2, 0.7 + i * 0.55, 7.65, 1.9, C.locker[i % 5], "PAINT", 0.5);
    // notice board by the entrance with notes
    box(7.6, 14.9, 9.6, 15, 1.1, 1.1, C.wood, "WOOD");
    for (let i = 0; i < 6; i++) box(7.75 + (i % 3) * 0.6, 14.85, 8.15 + (i % 3) * 0.6, 14.9, 1.25 + Math.floor(i / 3) * 0.45, 0.32, C.note[i % 4], "PAINT");
    // doormat at the exit
    floor(9.8, 14.2, 12.2, 15, "#7a5a3a");
    thing(1.4, 10.5, 4.4, 11.4, 0.7, C.fabric, "FABRIC");
    thing(2.4, 12.2, 3.4, 13, 0.45, C.wood);
    thing(0.4, 14.6, 0.9, 15.1, 1.4, C.green, "LEAF");
    thing(5, 9.2, 5.5, 9.7, 1.4, C.green, "LEAF");
  }),
  roomDoc("schulhaus_ausgang", "Ausgang", anchors.ausgang, ({ box }) => {
    // a school door frame with a green exit sign over it
    box(10, 15.2, 10.15, 15.45, 0, 2.6, C.woodDark, "WOOD");
    box(11.85, 15.2, 12, 15.45, 0, 2.6, C.woodDark, "WOOD");
    box(10, 15.2, 12, 15.45, 2.6, 0.25, C.woodDark, "WOOD");
    box(10.15, 15.3, 11.85, 15.4, 0, 2.6, "#9fd3f0", "GLAZING");
    box(10.6, 15.15, 11.4, 15.2, 2.95, 0.35, "#1f9d55", "PAINT");
  }),
];

landmarks.forEach(roundParts);
// The exit's interaction point sits inside the room, in front of the door.
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
  anchor("aula", "Aula", "#3288EF"),
  anchor("lernatelier", "Lernatelier", "#0EA5E9"),
  anchor("coaching", "Coaching-Raum", "#8B5CF6"),
  anchor("workshop", "Workshop-Raum", "#F97316"),
  anchor("pause", "Pausenzone", "#22C55E"),
  {
    id: "ausgang",
    gx: 10,
    gy: 15,
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

const npcs = [
  npc("lehrerin", 11, 2, "Frau Arnold", "#3288EF", "Lehrerin · Aula", { female: true, hat: "glasses" }),
  npc("lea", 8, 3, "Lea", "#F97316", "Lernende", { female: true }),
  npc("noah", 13, 3, "Noah", "#22C55E", "Lernender", { hat: "cap" }),
  npc("mia", 2, 6, "Mia", "#EAB308", "Lernende · Lernatelier", { female: true, hat: "scarf" }),
  npc("coach", 19, 4, "Coach Sandro", "#8B5CF6", "Coach · 1:1", { isGenius: true }),
  npc("workshop", 18, 11, "Frau Keller", "#3288EF", "Workshop-Leiterin", { female: true }),
];

const dialogue = {
  lehrerin: {
    intro:
      "Guten Morgen! Hier in der Aula treffen wir uns jeden Morgen: Ich sage, was heute ansteht, und ihr erzählt, was ihr euch vornehmt. Am Abend kommen wir wieder hier zusammen und teilen unsere Highlights.",
    hint: "Im Coaching-Raum planst du mit Sandro deine Ziele.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Was passiert am Abend in der Aula?",
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
    intro: "Hoi! Heute erzähle ich in der Morgenrunde, dass wir mit dem Hühnerstall anfangen.",
    hint: "Die Werkstatt ist draussen im Dorf.",
    phases: [{ type: "intro" }, { type: "complete", message: "Bis heute Abend hier in der Aula!" }],
  },
  noah: {
    intro: "Ich gehe nach der Morgenrunde in den Workshop von Frau Keller. Sie zeigt, wie man ein Projekt plant.",
    hint: "Die Workshops sind freiwillig. Du wählst selbst, was dich interessiert.",
    phases: [{ type: "intro" }, { type: "complete", message: "Der Workshop-Raum ist hinten rechts." }],
  },
  mia: {
    intro: "Im Lernatelier mache ich meinen Wochenplan. Mathe habe ich schon fertig, jetzt arbeite ich an meinem Interessensprojekt über Bienen.",
    hint: "Mindestanforderungen zuerst, dann bleibt Zeit für eigene Projekte.",
    phases: [{ type: "intro" }, { type: "complete", message: "Am Freitag bespreche ich alles im 1:1." }],
  },
  coach: {
    intro: "Hallo, ich bin Sandro, dein Coach. Erzähl mir, woran du gerade arbeitest, oder sag mir, wo du nicht weiterkommst.",
    isGenius: true,
    geniusSystemPrompt:
      "Du bist Sandro, Coach im Bergdorf, einer Schule, in der man in echten Projekten lernt. Du führst 1:1-Gespräche mit Lernenden. Antworte immer auf Deutsch in Schweizer Schreibweise (ss statt ß), kurz, freundlich und auf Augenhöhe. Hilf, eigene Ziele zu setzen und den nächsten Schritt zu finden; gib keine fertigen Lösungen, sondern stelle gute Fragen. Du kennst die Grundsätze der Schule: Raum für eigene Interessen in einer klaren Struktur, Lernen in echten Projekten, Mindestanforderungen und Verbindlichkeit, regelmässiges Feedback. Bei Projekten mit Werkzeug, Tieren oder in der Küche denkst du an die Sicherheit und fragst nach, wenn etwas fehlt; du ersetzt keine Instruktion durch eine Fachperson. Am Ende fasst du in zwei Sätzen zusammen, was sich die Person vorgenommen hat.",
  },
  workshop: {
    intro:
      "Hallo! Ich bin Frau Keller und leite die Workshops. Diese Woche geht es darum, wie man ein Projekt plant: Ziel, Schritte, Material und Zeit.",
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

const level = {
  data: {
    name: "Schulhaus",
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
    playerStart: { x: 11, y: 14 },
    v4: { season: "summer", weather: "clear", timeOfDay: null, indoor: { walls: "none" } },
  },
  dialogue: mixAnswers(dialogue),
  i18n: {},
};

const out = new URL("./schulhaus.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 1) + "\n");
console.log(`wrote ${out.pathname}`);
