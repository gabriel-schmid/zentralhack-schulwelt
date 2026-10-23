// Helpers shared by the level generators.

// Small stable string hash (FNV-1a), so a rebuild gives the same order.
function hash(text) {
  let h = 0x811c9dc5;
  for (const ch of text) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// Questions are written with the correct option first. This moves it to a
// position derived from the question text, so the right answer is not
// always the first button.
export function mixAnswers(dialogue) {
  for (const entry of Object.values(dialogue)) {
    for (const phase of entry.phases || []) {
      if (phase.type !== "choice") continue;
      const right = phase.options.filter((o) => o.correct);
      const wrong = phase.options.filter((o) => !o.correct);
      const at = hash(phase.question) % phase.options.length;
      phase.options = [...wrong.slice(0, at), ...right, ...wrong.slice(at)];
    }
  }
  return dialogue;
}
