// Convert the brain-atlas coordinate CSVs into the JSON the site loads.
//
//   node scripts/build-atlases.mjs
//
// Reads every <atlas>.csv from ATLAS_SRC (columns: name, x.mni, y.mni, z.mni,
// lobe, hemi, index, [network]) and writes:
//   public/assets/atlases/<atlas>.json   — { key, label, count, hasMesh, regions }
//   public/assets/atlases/index.json     — [{ key, label, count, hasMesh }]
//
// Each region gets a deterministic pseudo-random `score` (0..1); the top
// IMPORTANCE_PCT fraction are flagged `sig:1` — a stand-in for "regions that
// drive the prediction". Swap in your own scores by editing the JSON or this
// script. No real data here: this is template demo content.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const ATLAS_SRC = "/Users/ninad/Documents/neurodata/atlases_other";
const OUT = join(ROOT, "public/assets/atlases");

const IMPORTANCE_PCT = 0.20; // top 20% of regions flagged significant

// key → display label + whether a parcellated .glb mesh exists (Brainnetome only)
const ATLASES = [
  { key: "brainnetome",         label: "Brainnetome (246)",   hasMesh: true  },
  { key: "aal90",               label: "AAL-90",              hasMesh: false },
  { key: "dosenbach160",        label: "Dosenbach-160",       hasMesh: false },
  { key: "power264",            label: "Power-264",           hasMesh: false },
  { key: "craddock200",         label: "Craddock-200",        hasMesh: false },
  { key: "gordon333",           label: "Gordon-333",          hasMesh: false },
  { key: "hcp_mmp_glasser_360", label: "Glasser-360",         hasMesh: false },
  { key: "dk.scgm82",           label: "Desikan-Killiany-82", hasMesh: false },
  { key: "destrieux",           label: "Destrieux-148",       hasMesh: false },
  { key: "destrieux_scgm",      label: "Destrieux+SCGM-162",  hasMesh: false },
];

// Tiny seeded RNG (mulberry32) so importance flags are stable across builds.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Minimal CSV parser (handles quoted fields with commas).
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      if (field !== "" || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
    } else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const NETWORK_COL = { dosenbach160: "network", power264: "network", gordon333: "network", brainnetome: "Yeo_7network" };

mkdirSync(OUT, { recursive: true });
const index = [];

for (const { key, label, hasMesh } of ATLASES) {
  const csvPath = join(ATLAS_SRC, `${key}.csv`);
  if (!existsSync(csvPath)) { console.warn(`skip ${key} — no CSV`); continue; }

  const rows = parseCSV(readFileSync(csvPath, "utf8"));
  const header = rows[0].map((h) => h.replace(/^"|"$/g, ""));
  const col = (n) => header.indexOf(n);
  const ix = { name: col("name"), x: col("x.mni"), y: col("y.mni"), z: col("z.mni"), lobe: col("lobe"), hemi: col("hemi"), index: col("index") };
  const netCol = NETWORK_COL[key] ? col(NETWORK_COL[key]) : -1;

  const rng = mulberry32(hashSeed(key));
  let regions = rows.slice(1).filter((r) => r.length > 1).map((r, i) => ({
    id:      parseInt(r[ix.index]) || i + 1,
    name:    r[ix.name],
    x:       Number(r[ix.x]),
    y:       Number(r[ix.y]),
    z:       Number(r[ix.z]),
    lobe:    r[ix.lobe] || "NA",
    hemi:    r[ix.hemi] || "NA",
    network: netCol >= 0 ? (r[netCol] || null) : null,
    score:   +rng().toFixed(4),
  }));

  // Flag the top IMPORTANCE_PCT by score as significant.
  const cutoff = [...regions].sort((a, b) => b.score - a.score)[Math.floor(regions.length * IMPORTANCE_PCT)]?.score ?? 1;
  regions = regions.map((r) => ({ ...r, sig: r.score > cutoff ? 1 : 0 }));

  writeFileSync(join(OUT, `${key}.json`), JSON.stringify({ key, label, count: regions.length, hasMesh, regions }));
  index.push({ key, label, count: regions.length, hasMesh });
  console.log(`✓ ${key.padEnd(20)} ${regions.length} regions · ${regions.filter((r) => r.sig).length} significant`);
}

writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log(`\nWrote ${index.length} atlases → ${OUT}`);
