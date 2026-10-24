// Converts a built level (level/*.json) into the level@1 document the world
// pins, written as base64 for upload. Usage:
// node scripts/doc-level.mjs <hazu-world engine dir> <level.json> <out.b64>
import { readFileSync, writeFileSync } from "node:fs";
const { levelRoundTrip } = await import(process.argv[2] + "/src/sdk/level-roundtrip.js");
const r = levelRoundTrip(readFileSync(process.argv[3], "utf8"), { id: "TRAIMeIVPNXq5wfkfTG2" });
if (!r.ok) throw new Error(r.errors.join("; "));
const bytes = Buffer.from(JSON.stringify(r.doc));
writeFileSync(process.argv[4], bytes.toString("base64"));
console.log("bytes", bytes.length, "schema", r.doc.$schema, "version", r.doc.version);
