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
    const n = Math.max(1, Math.ceil((len * TILE_M) / 0.9));
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
  build({ box, wall, thing, collide });
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
  aula: { gx: 6, gy: 0 },
  lernatelier: { gx: 0, gy: 0 },
  coaching: { gx: 21, gy: 0 },
  workshop: { gx: 21, gy: 8 },
  pause: { gx: 0, gy: 8 },
};

const landmarks = [
  roomDoc("schulhaus_aula", "Aula", anchors.aula, ({ box, wall, thing }) => {
    // back wall of the whole house and the Aula's side walls with doorways
    wall(0, 0, 22, 0);
    wall(6, 0, 6, 4.5);
    wall(16, 0, 16, 4.5);
    // stage with a lectern and a screen on the back wall
    thing(8.5, 0.2, 13.5, 2, 0.45, C.stage, "WOOD", 1);
    box(9.5, 0.08, 12.5, 0.18, 1.2, 1.6, C.board, "PAINT");
    box(10.7, 1.3, 11.3, 1.8, 0.45, 1.1, C.woodDark, "WOOD");
    // benches in three rows with a middle aisle
    for (const z of [3.6, 4.8, 6]) {
      thing(7.4, z, 10.6, z + 0.45, 0.45, C.wood);
      thing(11.4, z, 14.6, z + 0.45, 0.45, C.wood);
    }
  }),
  roomDoc("schulhaus_lernatelier", "Lernatelier", anchors.lernatelier, ({ box, wall, thing }) => {
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
    // weekly-plan board
    box(2.2, 0.08, 4.8, 0.16, 1.1, 1.2, C.white, "PAINT");
  }),
  roomDoc("schulhaus_coaching", "Coaching-Raum", anchors.coaching, ({ box, wall, thing }) => {
    wall(22, 0, 22, 16);
    wall(16, 7, 18, 7);
    wall(19.5, 7, 22, 7);
    // two armchairs facing each other, a small table, a plant
    thing(17.6, 2.6, 18.6, 3.6, 0.8, C.fabricWarm, "FABRIC");
    thing(20.2, 2.6, 21.2, 3.6, 0.8, C.fabric, "FABRIC");
    thing(18.9, 2.85, 19.9, 3.35, 0.5, C.wood);
    thing(21.2, 0.4, 21.7, 0.9, 1.4, C.green, "LEAF");
    // whiteboard for goals
    box(17.3, 0.08, 20.3, 0.16, 1.1, 1.2, C.white, "PAINT");
  }),
  roomDoc("schulhaus_workshop", "Workshop-Raum", anchors.workshop, ({ box, thing }) => {
    // screen on the east wall and two long tables
    box(21.84, 10, 21.92, 13.5, 1.1, 1.8, C.board, "PAINT");
    thing(16.5, 10, 20, 10.8, 0.75, C.wood);
    thing(16.5, 12.4, 20, 13.2, 0.75, C.wood);
  }),
  roomDoc("schulhaus_pause", "Pausenzone", anchors.pause, ({ thing }) => {
    thing(1.4, 10.5, 4.4, 11.4, 0.7, C.fabric, "FABRIC");
    thing(2.4, 12.2, 3.4, 13, 0.45, C.wood);
    thing(0.4, 14.6, 0.9, 15.1, 1.4, C.green, "LEAF");
    thing(5, 9.2, 5.5, 9.7, 1.4, C.green, "LEAF");
  }),
];

landmarks.forEach(roundParts);

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
    h: 32,
    label: "↩ Zum Dorfplatz",
    topColor: "#f4efe6",
    leftColor: "#e9e2d6",
    rightColor: "#ddd4c6",
    accent: "#3288EF",
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
  dialogue,
  i18n: {},
};

const out = new URL("./schulhaus.json", import.meta.url);
writeFileSync(out, JSON.stringify(level, null, 1) + "\n");
console.log(`wrote ${out.pathname}`);
