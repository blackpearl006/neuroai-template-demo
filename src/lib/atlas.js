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
