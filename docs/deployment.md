# Deployment: what is live where

This file maps repo files to the live Hazu World on hazu.app, so you can check
that what you play is what this repository holds. All Hazus below are private.
Facts were read from hazu.app on Saturday, 24 October 2026.

## World Hazu

| | |
| - | - |
| Hazu | `TRAIMeIVPNXq5wfkfTG2` «Schulwelt», https://hazu.app/TRAIMeIVPNXq5wfkfTG2 |
| Privacy | private; invited hazu.app accounts only |
| Default view | `world` |

The world's settings live in `layout.world` of this Hazu (schema
`hazu.world/settings@1`). It pins one level revision per place: each pin names
the asset `url`, the `documentId`, the `revision` and the file's `sha256`, so the
world only loads exactly those bytes.

## Levels

| Level | Repo source | Live document | Revision | Asset | sha256 of the live file |
| ----- | ----------- | ------------- | -------- | ----- | ----------------------- |
| Bergdorf (village, on the world Hazu `TRAIMeIVPNXq5wfkfTG2`) | `level/build-bergdorf.mjs` → `level/bergdorf.json` | `doc_eea84d56d6c0485c8b6fd000cda306ac` | 3 | `asset_3c0811d9f4e2460ebef9615a250ba272` | `1ad8c838ce49c01a7065d422156d2c531433c11c40f69253712e65cc1ad168b4` |
| Schulhaus (on the place Hazu `_m0-qRVAAUwmuxfswuPp`) | `level/build-schulhaus.mjs` + `level/route-dialogues.mjs` → `level/schulhaus.json` | `doc_0efde5e6ab4d4b90bff0952529122f55` | 5 | `asset_76b52024aa8645abb0234c80d9b1160d` | `e8c05533e5c05c72c64de191f47ca3c32df788a63d93ad7dac15687ba2b4336d` |

**Pending:** Schulhaus revision 5 matches commit `4ed5e6b`. Commit `fad4e73`
changes two dialogue lines and is not uploaded yet; its converted file has the
sha256 `bafac271716f41309324edd638bee3085cadbd655dfc1befb1e64ea1d7bb411b`. This
row gets the new revision once it is uploaded and pinned.

The uploaded file is not the raw repo JSON. It is the converted `level@1`
document: the engine's `levelRoundTrip` (Hazu World SDK,
`apps/hazu-world/src/sdk/level-roundtrip.js` in the engine repository) adds
`"$schema": "hazu.world/level@1"` and `version`, and the result is stored as
compact JSON. So the live sha256 differs from `sha256sum level/*.json`.

To reproduce a live sha256:

1. `node level/build-bergdorf.mjs` or `node level/build-schulhaus.mjs`. The
   output is byte-identical to the committed `level/*.json`.
2. `node scripts/doc-level.mjs <engine dir> level/<name>.json out.b64`
   converts it (the engine dir is `apps/hazu-world` in the engine
   repository), then `base64 -d -i out.b64 | shasum -a 256`.
   `scripts/check-level.mjs` validates a level with the engine first.

We checked both rows this way: `level/bergdorf.json` at `fad4e73` gives the
Bergdorf hash, `level/schulhaus.json` at `4ed5e6b` gives the Schulhaus hash.

## Stations

A station is a sub-Hazu of a place with:

- the tag `hz-world-sim` (the world shows it as a station),
- the tag `hw-npc-<character id>` (the station stands as a screen next to that
  character),
- `layout.defaultView: "widget"`,
- `event.widgetViewSettings`: `url` (the widget's document URL, which always
  serves the newest revision), `bridge: true` (the widget may save items
  through the Hazu bridge) and `learning: true`.

All three stations sit in the Schulhaus Hazu `_m0-qRVAAUwmuxfswuPp`.

| Station | Hazu | Repo source | Document | Live revision | Character (tag) |
| ------- | ---- | ----------- | -------- | ------------- | --------------- |
| Tagesplan | `Kur3--1W2Om9ChLwzcu3` | `widgets/tagesplan/index.html` | `doc_e52cf725ed3f4ab481ee75d18fdddc81` | 3 | Yara (`hw-npc-yara`) |
| Säure-Base-Labor | `k6O-jIz2NIb6e-Q0dgax` | `widgets/saeuren-basen/index.html` | `doc_1eb34a79537341709ae92c5deef143db` | 4 | Herr Tesla (`hw-npc-workshop`) |
| Konflikt in der Projektgruppe | `OlhBe1_bzlj7rSR4fv_T` | `widgets/konflikt/index.html` | `doc_c8bc1b33c87247c28d0d2085f5b5c73c` | 3 | Herr Meinhard (`hw-npc-coach`) |

Widgets are uploaded as they are, without conversion. The sha256 of each live
revision equals `sha256sum` of the repo file:

| Station | sha256 (live = repo) | Last repo commit |
| ------- | -------------------- | ---------------- |
| Tagesplan | `674b5e5873fc8efb26dbcf405bbd7e20a3cc56da08504cb84a1aa706e14e2af2` | `08da13e` |
| Säure-Base-Labor | `330f5b458550f1bdc5d13a5437c9790d8f4f7c877466737e4c2f619f214c9194` | `d521a1f` |
| Konflikt | `24c933ba8ca912d083ddc754fefc008c2ba84cf483ace7d6cb50972beac75383` | `a42ce14` |

## Reserve Hazu

`EBl3tB2u0KEC63wDKIwa` «Reserve» sits next to the world Hazu, not inside it.
Every sub-Hazu of the world that has no door in a level shows up as a loose
signboard near the start. Places we built but no longer use are parked here so
the world stays focused on the Schulhaus.

| Parked | Hazu | What it is |
| ------ | ---- | ---------- |
| Sägestation | `3UrjDNf8urw8VD-7OEo5` | station `widgets/saegestation/` (tag `hz-world-sim`, `hw-npc-schreiner`) |
| Ein Mathematikvormittag | `LTjw1DYvatdQehCf0OGG` | Luca's station (branch `codex/mathe`); its content now lives in the Lernatelier characters |
| Werkstatt | `tZNMXBltrzdnsVkElfhC` | place of the old Werkstatt interior (`level/werkstatt.json`) |
| Küche | `QWixzEpPTgQYY09Ww8cH` | place, never built |
| Garten und Hof | `bK_FhPCxRBLKvMG4_flE` | place, never built |
| Dorfplatz | `eEES-rZbllKEqy1uuiRX` | place from the first village |
| Figuren | `JITvlYasVsTNZ1MgXOPp` | container for character Genius configurations (tag `hazuworld-characters`) |
| Coaching-Raum | `hJ73ZiKWocRZADF25pQj` | old place; the room now lives inside the Schulhaus level |
| Lernatelier | `frRqjhqx-Bk_71Wu9o8C` | old place; the room now lives inside the Schulhaus level |

## AI coach

Herr Meinhard is a Hazu Genius character defined in the Schulhaus level: the
character has `isGenius: true` and a `geniusSystemPrompt`, which is the German
`COACH_PROMPT` in `level/build-schulhaus.mjs`
([coach/system-prompt.md](../coach/system-prompt.md) is its English
reference). There is no separate Genius configuration, so he runs on Genius's
default model `hazu/fast`. Today that is GPT-6 Luna, hosted in Frankfurt and
routed through Requesty; Genius only allows models processed in the EU. We read
this from the platform code (`genius/model-policy.ts` in the Hazu backend), not
from the world, which does not report the model it uses.

## Engine

The Hazu World engine is not in this repository. Our indoor mode (rooms
instead of floating islands, cut-away walls, sliding along walls) is
[HazuInc/HazuApp#7183](https://github.com/HazuInc/HazuApp/pull/7183): open, not
merged, not deployed. The live world runs the engine without it.

## Submission version

The git tag `submission` will mark the judged state of this repository. It is
set at the freeze.
