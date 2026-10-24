// Validates a built level with the engine before upload. Usage:
// node scripts/check-level.mjs <hazu-world engine dir> <level.json>
import { readFileSync } from "node:fs";
const eng = process.argv[2];
const { levelRoundTrip } = await import(eng + "/src/sdk/level-roundtrip.js");
const text = readFileSync(process.argv[3], "utf8");
const r = levelRoundTrip(text, { id: "TRAIMeIVPNXq5wfkfTG2" });
console.log("ok", r.ok, "errors", JSON.stringify(r.errors), "summary", JSON.stringify(r.summary));
