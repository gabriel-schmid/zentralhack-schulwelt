# Engine idea: indoor mode for Hazu World

Assessment from Saturday night (00:50). Hazu World renders every level as a
floating island; house interiors therefore look like small islands. An
«indoor mode» would be our own engine contribution.

## What it would be

- Level flag `data.v4.indoor = {walls: "auto"|"none", ceiling?, floor?, light?}`.
  The level schema already lets unknown `v4` keys through, so the flag
  validates and round-trips today.
- No island margin, cliff or rocky underside; flat floor inside the map.
- No sky, water, plants or weather; an indoor background and brighter light.
- Walls generated along the map edge; the wall facing the camera is hidden
  (cutaway), so the room reads from every angle.
- First person needs no change.

Estimated size: about 300–400 lines in the engine (grid, terrain, level
scene, atmosphere, a new `room.js`) plus tests. A minimal slice (flag, no
island, no sky, auto walls with the camera-facing wall hidden) fits in
roughly 6–8 hours.

## Where it can run

- **Local demo:** yes, on the engine's dev server with an offline fixture.
- **Live Schulwelt on hazu.app:** not before the end of the hackathon. The
  in-app world loads the engine from the app build, so it needs an app
  release with review. The widget path is blocked too: our world is private,
  and private level files answer 404 to the widget's anonymous reads.

## Plan

1. Now: dollhouse rooms as data (walls and furniture as a landmark), already
   flagged with `data.v4.indoor: {walls: "none"}`.
2. Optional, on a branch: build the minimal indoor-mode slice and show it
   locally as our engine contribution.
3. After the hackathon: propose it for the engine (review and release by
   Hazu).

The dollhouse levels get no sky and no underside for free once indoor mode
lands; `walls: "auto"` stays opt-in, so walls are never doubled.
