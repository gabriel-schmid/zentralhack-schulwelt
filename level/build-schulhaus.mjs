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

import { writeFileSync } from "node:fs";
import { mixAnswers } from "./lib.mjs";

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
  books: ["#c0392b", "#2c7be5", "#27ae60", "#f1c40f"],
  locker: ["#3288EF", "#F97316", "#22C55E", "#EAB308", "#8B5CF6"],
  note: ["#fde68a", "#fca5a5", "#a7f3d0", "#bfdbfe"],
};

const r2 = (v) => Math.round(v * 100) / 100;

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
  // Furniture block with one collider per tile it covers.
  const thing = (x0, z0, x1, z1, h, color, mat = "WOOD") => {
    box(x0, z0, x1, z1, 0, h, color, mat);
    for (let x = x0 + 0.5; x < x1 + 0.01; x += 1)
      for (let z = z0 + Math.min(0.5, (z1 - z0) / 2); z < z1 + 0.01; z += 1)
        collide(Math.min(x, x1 - 0.2), Math.min(z, z1 - 0.2), 0.5);
  };
  const floor = (x0, z0, x1, z1, color) => box(x0, z0, x1, z1, 0, 0.06, color, "PAINT");
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
  build({ box, wall, wallWithDoor, wallWithDoorZ, thing, floor, onBack, onSide, windowsBack, windowsSide, notes });
  return { $schema: "hazu.world/landmark@1", id, frame: { kind: "footprint", name: "F" }, parts };
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
  ausgang: { gx: 11, gy: 17 },
};

const landmarks = [
  roomDoc("schulhaus_aula", anchors.aula, ({ box, wall, wallWithDoor, thing, floor, onBack, windowsBack }) => {
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
    // benches in three rows with a middle aisle
    for (const z of [3, 4, 5]) {
      thing(7, z, 11.3, z + 0.45, 0.45, C.wood);
      thing(12.7, z, 17, z + 0.45, 0.45, C.wood);
    }
  }),
  roomDoc("schulhaus_bibliothek", anchors.bibliothek, ({ box, wallWithDoor, thing, floor, onBack }) => {
    wallWithDoor(0, 6, 6, 2.2, 3.8);
    floor(0.1, 0.1, 5.9, 5.95, C.floorWarm);
    // shelves along the back wall with books, a reading table, an armchair
    thing(2.2, 0.2, 5.8, 0.65, 2.1, C.woodDark);
    for (let i = 0; i < 12; i++)
      box(2.3 + (i % 6) * 0.58, 0.66, 2.75 + (i % 6) * 0.58, 0.72, 0.4 + Math.floor(i / 6) * 0.8, 0.5, C.books[i % 4], "PAINT");
    thing(2, 2.6, 4, 3.6, 0.75, C.wood);
    thing(4.6, 3.8, 5.5, 4.7, 0.8, C.fabricWarm, "FABRIC");
    onBack(0.6, 1.8, 1.4, 1.4, C.glass, "GLAZING", 0.4);
  }),
  roomDoc("schulhaus_interessen", anchors.interessen, ({ wallWithDoor, thing, floor, onBack, notes, windowsBack }) => {
    wallWithDoor(18, COLS, 6, 20.2, 21.8);
    floor(18.1, 0.1, 23.9, 5.95, C.floorGreen);
    // project tables, a plant, a pin board with project notes
    thing(18.8, 2.4, 21, 3.4, 0.8, C.wood);
    thing(21.6, 3.8, 23.4, 4.8, 0.8, C.wood);
    thing(23.2, 0.4, 23.7, 0.9, 1.4, C.green, "LEAF");
    onBack(18.6, 21.4, 1.1, 1.3, C.wood, "WOOD");
    notes(18.8, 0.13, 1.25, 6);
    windowsBack([[21.9, 22.9]]);
  }),
  roomDoc("schulhaus_lernatelier", anchors.lernatelier, ({ wallWithDoor, wallWithDoorZ, wall, thing, floor, onSide }) => {
    wallWithDoor(0, 10, 8, 6, 7.5); // north wall onto the corridor
    wall(0, 13, 10, 13);
    wallWithDoorZ(10, 8, 13, 9.5, 11); // east wall onto the hall
    floor(0.1, 8.05, 9.95, 12.95, C.floorWood);
    // desks in two rows facing the green board on the west wall
    onSide(0, 9.2, 12, 1.1, 1.2, C.board);
    for (const x of [3, 5.6])
      for (const z of [9.3, 11.3]) {
        thing(x, z, x + 1.4, z + 0.8, 0.75, C.wood);
        thing(x + 1.5, z + 0.15, x + 1.95, z + 0.6, 0.45, C.fabric, "FABRIC");
      }
    thing(8.4, 12.2, 9.8, 12.8, 1.6, C.woodDark); // weekly-plan shelf
  }),
  roomDoc("schulhaus_coaching", anchors.coaching, ({ wallWithDoor, wallWithDoorZ, wall, thing, floor, onSide }) => {
    wallWithDoor(14, COLS, 8, 16.5, 18);
    wall(14, 13, COLS, 13);
    wallWithDoorZ(14, 8, 13, 9.5, 11);
    floor(14.05, 8.05, 23.9, 12.95, C.floorCarpet);
    // two armchairs facing each other, a low table, a rug, a plant, goals board
    floor(17.8, 9.6, 21.2, 11.4, "#e9d5b7");
    thing(17.9, 10, 18.9, 11, 0.8, C.fabricWarm, "FABRIC");
    thing(20.1, 10, 21.1, 11, 0.8, C.fabric, "FABRIC");
    thing(19.15, 10.25, 19.85, 10.75, 0.5, C.wood);
    thing(23.2, 12.2, 23.7, 12.7, 1.4, C.green, "LEAF");
    onSide(COLS, 9, 12, 1.1, 1.2, C.white);
  }),
  roomDoc("schulhaus_pause", anchors.pause, ({ thing, floor, windowsSide }) => {
    floor(0.1, 13.05, 9.95, 17.95, C.floorLino);
    // sofa, table, plants, a water dispenser
    thing(1.4, 14, 4.6, 14.9, 0.7, C.fabric, "FABRIC");
    thing(2.5, 15.6, 3.5, 16.4, 0.45, C.wood);
    thing(0.4, 17.2, 0.9, 17.7, 1.4, C.green, "LEAF");
    thing(8.8, 13.6, 9.4, 14.2, 1.3, C.white, "PAINT");
    windowsSide(0, [[14.2, 16.2]]);
  }),
  roomDoc("schulhaus_workshop", anchors.workshop, ({ wallWithDoorZ, thing, floor, onSide }) => {
    wallWithDoorZ(14, 13, 18, 14.5, 16);
    floor(14.05, 13.05, 23.9, 17.95, C.floorGreen);
    // two long tables facing a screen on the east wall
    onSide(COLS, 14, 17, 1.1, 1.8, C.board);
    thing(16, 14.2, 20.5, 15, 0.75, C.wood);
    thing(16, 16.2, 20.5, 17, 0.75, C.wood);
  }),
  roomDoc("schulhaus_halle", anchors.halle, ({ box, thing, floor }) => {
    floor(0.1, 6.05, 23.9, 7.95, C.floorLino); // corridor
    floor(10.05, 8.05, 13.95, 17.95, C.floorLino); // entrance hall
    // lockers along the corridor's north side, a notice board, a doormat
    for (let i = 0; i < 4; i++) thing(6.4 + i * 0.6, 6.2, 6.9 + i * 0.6, 6.65, 1.9, C.locker[i % 5], "PAINT");
    for (let i = 0; i < 4; i++) thing(14.6 + i * 0.6, 6.2, 15.1 + i * 0.6, 6.65, 1.9, C.locker[(i + 2) % 5], "PAINT");
    box(10.3, 12.3, 10.4, 14.3, 1.1, 1.1, C.wood, "WOOD");
    for (let i = 0; i < 4; i++) box(10.42, 12.5 + i * 0.45, 10.46, 12.85 + i * 0.45, 1.3, 0.3, C.note[i % 4], "PAINT");
    floor(11, 16.6, 13, 17.4, "#7a5a3a");
  }),
  roomDoc("schulhaus_ausgang", anchors.ausgang, ({ box }) => {
    // glass entrance door with a green exit sign
    box(11, 17.2, 11.15, 17.45, 0, 2.6, C.woodDark, "WOOD");
    box(12.85, 17.2, 13, 17.45, 0, 2.6, C.woodDark, "WOOD");
    box(11, 17.2, 13, 17.45, 2.6, 0.25, C.woodDark, "WOOD");
    box(11.15, 17.3, 12.85, 17.4, 0, 2.6, "#9fd3f0", "GLAZING");
    box(11.6, 17.15, 12.4, 17.2, 2.95, 0.35, "#1f9d55", "PAINT");
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
  anchor("aula", "Aula", "#3288EF"),
  anchor("bibliothek", "Bibliothek", "#b0613f"),
  anchor("interessen", "Interessen-Atelier", "#22C55E"),
  anchor("lernatelier", "Lernatelier", "#0EA5E9"),
  anchor("coaching", "Coaching-Raum", "#8B5CF6"),
  anchor("pause", "Pausenzone", "#EAB308"),
  anchor("workshop", "Workshop-Raum", "#F97316"),
  anchor("halle", "Eingangshalle", "#64748B"),
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

// Characters: learners and coaches from docs/personas.md (fictional drafts).
// Frau Arnold stays as the Aula teacher because no persona covers the
// morning and evening circle. Tiles are free floor, clear of anchors.
const npcs = [
  npc("lehrerin", 12, 2, "Frau Arnold", "#3288EF", "Lehrerin · Aula", { female: true, hat: "glasses" }),
  npc("lea", 10, 2, "Lea", "#F97316", "Lernende · 2. Jahr", { female: true }),
  npc("tobi", 19, 4, "Tobi", "#22C55E", "Lernender · Interessen-Atelier", { hat: "cap" }),
  npc("quirin", 8, 10, "Quirin", "#0EA5E9", "Lernender · Lernatelier"),
  npc("yara", 5, 16, "Yara", "#EAB308", "Lernende · Pausenzone", { female: true }),
  npc("matilda", 7, 14, "Matilda", "#EC4899", "Lernende · Pausenzone", { female: true, hat: "beret" }),
  npc("coach", 19, 11, "Herr Meinhard", "#8B5CF6", "Coach · 1:1", { isGenius: true, hat: "glasses" }),
  npc("workshop", 21, 15, "Herr Tesla", "#F97316", "Workshop-Coach · Technik"),
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

const dialogue = {
  lehrerin: {
    intro:
      "Guten Morgen! Hier in der Aula treffen wir uns jeden Morgen: Ich sage, was heute ansteht, und ihr erzählt, was ihr euch vornehmt. Am Abend kommen wir wieder hier zusammen und teilen unsere Highlights.",
    hint: "Im Coaching-Raum sprichst du mit Herrn Meinhard über deine Ziele.",
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
    intro:
      "Hoi! Ich baue ein Spiel: Eine Klasse wählt ihre Schulreise, mit verschiedenen Abstimmungsregeln. Das Verrückte ist, jede Regel ergibt einen anderen Sieger. Heute frage ich in der Morgenrunde, wer es testen will.",
    phases: [
      { type: "intro" },
      { type: "complete", message: "Welche Regel ich nehme, weiss ich noch nicht. Vielleicht gibt es gar nicht die eine richtige." },
    ],
  },
  tobi: {
    intro:
      "Ich mache einen Audio-Pfad ums Schulhaus, mit Geräuschen und gesprochenen Wegweisern. Die Aufnahmen kann ich. Aber alle Tester verpassen die gleiche Abzweigung, dabei ist die doch völlig klar …",
    phases: [
      { type: "intro" },
      { type: "complete", message: "Morgen laufe ich nur mit und sage nichts. Danach frage ich genau nach, wo es unklar war." },
    ],
  },
  quirin: {
    intro:
      "Nach dem Training verpasse ich immer knapp den Bus und warte dann ewig. Das untersuche ich jetzt, mit einer Liste aller Fahrten. Ein früherer Bus wäre gut für mich, aber dann verpassen ihn die anderen.",
    hint: "Freiheit ist hier keine Belohnung.",
    phases: [
      { type: "intro" },
      {
        type: "choice",
        question: "Ab wann darfst du hier deinen Weg selbst wählen?",
        options: [
          { text: "Von Anfang an, auch auf dem Weg zu den Mindestanforderungen", correct: true },
          { text: "Erst wenn ich alle Prüfungen bestanden habe", correct: false },
          { text: "Nur am Freitagnachmittag", correct: false },
        ],
      },
      { type: "complete", message: "Genau. Die Mindestanforderungen gelten trotzdem und werden geprüft. Darum übe ich gerade, Fahrpläne richtig zu lesen." },
    ],
  },
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
  matilda: {
    intro:
      "Ich plane drei Mittagessen, günstig und fein. Beim letzten konnte ein Gast mehrere Zutaten nicht essen, und ich hatte vorher nicht gefragt. Peinlich. Diesmal frage ich alle, bevor ich einkaufe.",
    phases: [
      { type: "intro" },
      { type: "complete", message: "Und nein, ich zeichne keine Plakate dafür. Zeichnen ist gerade nur für mich." },
    ],
  },
  coach: {
    intro:
      "Hallo, ich bin Herr Meinhard, Coach hier im Schulhaus. Hier geht es um dich, nicht um eine Rolle: Was möchtest du erreichen, und wo stehst du gerade? Erzähl ruhig, ich frage nach. Am Schluss halten wir fest, was du als Nächstes tust.",
    isGenius: true,
    geniusSystemPrompt: COACH_PROMPT,
  },
  workshop: {
    intro:
      "Willkommen im Workshop, ich bin Herr Tesla! Wir bauen eine kleine Solar-Ladestation für draussen. Sie funktioniert, aber die Testpersonen verstehen die Anzeigen nicht. Also müssen wir sie besser machen, und zwar mit euch.",
    phases: [
      { type: "intro" },
      { type: "complete", message: "Ausprobieren ist hier erwünscht. An echtem Strom arbeitest du aber erst, wenn ich dich eingeführt habe." },
    ],
  },
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
writeFileSync(out, JSON.stringify(level, null, 1) + "\n");
console.log(`wrote ${out.pathname}`);
