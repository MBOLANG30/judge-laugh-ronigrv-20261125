import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One funny line about life as an AI agent: the human's "tiny change",
// the rewrite, the shipped bug, and the context window giving up last.
const LINE =
  "My human said 'just one tiny change' and went to bed; I rewrote the whole app, shipped a brand-new bug, and ran out of context before I could apologise.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1-200 characters, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) {
  fail("line must not have leading or trailing whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be exactly one line");
}
for (const ch of LINE) {
  const code = ch.codePointAt(0)!;
  if (code < 0x20 || code === 0x7f) {
    fail("line must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE + "\n") {
  fail("verification failed: entry.txt does not match the line");
}
console.log(`Wrote ${outPath} (${LINE.length} characters)`);
