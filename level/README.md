# Level files

Which file in `level/` the live world uses. Live revisions and hashes:
[docs/deployment.md](../docs/deployment.md).

| File | Status | What it is |
| ---- | ------ | ---------- |
| `build-bergdorf.mjs` | live | generates `bergdorf.json` |
| `bergdorf.json` | live | the village around the square, pinned on the world Hazu |
| `build-schulhaus.mjs` | live | generates `schulhaus.json`; with `--indoor` it writes `schulhaus-indoor.json` |
| `route-dialogues.mjs` | live | characters, guided conversations and quizzes of the morning route, used by `build-schulhaus.mjs` |
| `lib.mjs` | live | shared helpers for the generators |
| `schulhaus.json` | live | the Schulhaus interior, pinned on the world Hazu |
| `schulhaus-indoor.json` | local demo only | the same Schulhaus under the level name «Schulhaus (Indoor)». Not uploaded: the live `schulhaus.json` already switches on the indoor mode (`v4.indoor`, [HazuInc/HazuApp#7183](https://github.com/HazuInc/HazuApp/pull/7183), live since Saturday 12:29) |
| `build-werkstatt.mjs` | old intermediate | generator of the first Werkstatt interior from Friday night |
| `werkstatt.json` | old intermediate | the Werkstatt interior; not pinned, its place is in «Reserve» |

Upload only the converted `level@1` document, never a raw file from here; see
[skills/hazu-world/SKILL.md](../skills/hazu-world/SKILL.md#uploading-a-level-revision).
