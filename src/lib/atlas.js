// Generic brain-atlas loaders + the MNI→mesh coordinate fit used to drop
// coordinate "node" atlases into the same brain shell as the Brainnetome mesh.
const base = import.meta.env.BASE_URL;
const cache = {};

function load(url) {
  if (!cache[url]) cache[url] = fetch(url).then((r) => r.json());
  return cache[url];
}

export const loadAtlasIndex = () => load(`${base}assets/atlases/index.json`);
export const loadAtlas = (key) => load(`${base}assets/atlases/${key}.json`);

// BYO data: merge author-supplied per-region values (content/brain-values.csv)
// over the baked score/sig, so a non-coder can put their own ROI results on any
// shipped atlas — no Python. Rows: { region:<name|id>, value:<number>, sig?:0|1 }.
// Values are min-max normalised to [0,1] so any scale (saliency, t-stat, effect
// size, weight) colours correctly. Regions absent from the CSV read as 0 / not
// significant. If no `sig` column is given, the top ~20% by value are flagged.
export function applyValues(regions, values) {
  if (!values || !values.length) return regions;
  const byKey = new Map();
  for (const row of values) {
    const k = String(row.region ?? row.name ?? row.id ?? "").trim().toLowerCase();
    if (k) byKey.set(k, row);
  }
  const lookup = (r) =>
    byKey.get(String(r.name).toLowerCase()) || byKey.get(String(r.id).toLowerCase());
  const nums = values.map((v) => Number(v.value)).filter((n) => Number.isFinite(n));
  if (!nums.length) return regions;
  const lo = Math.min(...nums), hi = Math.max(...nums), span = hi - lo || 1;
  const hasSig = values.some((v) => v.sig !== undefined && v.sig !== "");
  const sorted = [...nums].sort((a, b) => a - b);
  const thr = sorted[Math.floor(sorted.length * 0.8)] ?? hi;
  const truthy = (v) => v === 1 || v === "1" || String(v).toLowerCase() === "true";
  return regions.map((r) => {
    const row = lookup(r);
    if (!row) return { ...r, score: 0, sig: 0 };
    const raw = Number(row.value);
    const score = Number.isFinite(raw) ? (raw - lo) / span : 0;
    const sig = hasSig ? (truthy(row.sig) ? 1 : 0) : (raw >= thr ? 1 : 0);
    return { ...r, score, sig };
  });
}

// Least-squares fit of a single line: y = slope*x + intercept.
function fitLine(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: my - slope * mx, corr: Math.abs(num) / (Math.sqrt(den) || 1) };
}

// Given paired MNI and mesh-space coordinates, discover the per-axis mapping
// (mesh axes are permuted/flipped vs MNI) and return mni[x,y,z] → mesh[x,y,z].
// Robust to the L/R, S/I, A/P axis swap baked into the Brainnetome .glb.
export function fitMniToMesh(pairs) {
  const mni = [0, 1, 2].map((k) => pairs.map((p) => p.mni[k]));
  const fits = [0, 1, 2].map((meshAxis) => {
    const meshVals = pairs.map((p) => p.mesh[meshAxis]);
    // pick the MNI axis that best explains this mesh axis
    let best = { corr: -1 };
    for (let k = 0; k < 3; k++) {
      const f = fitLine(mni[k], meshVals);
      if (f.corr > best.corr) best = { ...f, k };
    }
    return best;
  });
  return (m) => fits.map((f) => f.slope * m[f.k] + f.intercept);
}
