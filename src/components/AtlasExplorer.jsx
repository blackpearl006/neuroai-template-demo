import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { loadAtlasIndex, loadAtlas } from "../lib/atlas";
import GlassBrain2D from "./GlassBrain2D";
import RegionTable from "./RegionTable";

const Atlas3D = lazy(() => import("./Atlas3D"));
const AtlasVolume = lazy(() => import("./AtlasVolume"));

const VIEWS = [
  { k: "3d", label: "3D" },
  { k: "2d", label: "2D" },
  { k: "table", label: "Table" },
  { k: "split", label: "3D + Table" },
];

function Loading({ label, height = 520 }) {
  return (
    <div className="rounded-xl bg-[#141E2D] flex items-center justify-center" style={{ height }}>
      <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
        <div className="w-4 h-4 rounded-full border-2 border-sig border-t-transparent animate-spin" />
        {label}
      </div>
    </div>
  );
}

// 3D viewer: parcellated/node mesh (three.js) or NiiVue label volume.
const Viewer3D = ({ atlas, mode, height }) => (
  <Suspense fallback={<Loading label="Loading 3D viewer…" height={height} />}>
    {mode === "volume" && atlas.volume
      ? <AtlasVolume atlas={atlas} height={height} />
      : <Atlas3D atlas={atlas} height={height} />}
  </Suspense>
);

// Self-contained, atlas-agnostic explorer. Pick an atlas, pick a view. Parcellated
// atlases (Brainnetome, Schaefer, AAL, Harvard-Oxford, Yeo, Glasser) render as a
// surface mesh (default) or a NiiVue label volume (toggle to compare); the rest
// render as coordinate nodes. ~20% of regions are flagged important (placeholder).
export default function AtlasExplorer({ defaultAtlas = "brainnetome", defaultView = "split" }) {
  const [index, setIndex] = useState(null);
  const [atlasKey, setAtlasKey] = useState(defaultAtlas);
  const [data, setData] = useState(null);
  const [view, setView] = useState(defaultView);
  const [mode3d, setMode3d] = useState("mesh"); // "mesh" | "volume"
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { loadAtlasIndex().then(setIndex); }, []);
  useEffect(() => { setData(null); setMode3d("mesh"); loadAtlas(atlasKey).then(setData); }, [atlasKey]);

  const meta = useMemo(() => index?.find((e) => e.key === atlasKey), [index, atlasKey]);
  const atlas = useMemo(() => (data && meta ? { ...data, ...meta } : data), [data, meta]);

  if (!index || !atlas) {
    return (
      <div className="flex items-center gap-3 py-10">
        <div className="w-4 h-4 rounded-full border-2 border-sig border-t-transparent animate-spin" />
        <p className="font-mono text-sm text-ink2">Loading atlas…</p>
      </div>
    );
  }

  const sig = atlas.regions.filter((r) => r.sig).length;
  const has3d = view === "3d" || view === "split";
  const canCompare = has3d && !!atlas.volume;

  return (
    <div className="rounded-xl border border-rule/20 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-paper border-b border-rule/20">
        <label className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-ink2 uppercase tracking-wider">Atlas</span>
          <select
            value={atlasKey}
            onChange={(e) => setAtlasKey(e.target.value)}
            className="font-sans text-sm bg-paper2 border border-rule/30 rounded-lg px-2.5 py-1.5 text-ink focus:outline-none focus:border-sig/60 cursor-pointer"
          >
            {index.map((a) => (
              <option key={a.key} value={a.key}>{a.label}{a.render === "mesh" ? " · parcellated" : " · nodes"}</option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2 bg-paper2 rounded-lg px-3 py-1.5 border border-rule/20">
          <span className="font-mono text-sm font-bold text-sig tabular-nums">{sig}</span>
          <span className="font-mono text-[10px] text-ink2">/ {atlas.count} important</span>
        </div>

        {/* Mesh ▸ Volume compare toggle (parcellated atlases only) */}
        {canCompare && (
          <div className="flex bg-paper2 rounded-lg border border-rule/20 p-0.5">
            {["mesh", "volume"].map((m) => (
              <button key={m} onClick={() => setMode3d(m)}
                className={`px-2.5 py-1.5 font-mono text-[10px] rounded-md capitalize transition-colors ${mode3d === m ? "bg-ink text-paper" : "text-ink2 hover:text-ink"}`}
                title={m === "mesh" ? "High-quality surface mesh" : "NiiVue label volume (lighter)"}>
                {m}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex bg-paper2 rounded-lg border border-rule/20 p-0.5">
          {VIEWS.map((v) => (
            <button key={v.k} onClick={() => setView(v.k)}
              className={`px-3 py-1.5 font-mono text-[11px] rounded-md transition-colors ${view === v.k ? "bg-ink text-paper" : "text-ink2 hover:text-ink"}`}>
              {v.label}
            </button>
          ))}
        </div>

        {(view === "table" || view === "split") && (
          <button onClick={() => setShowAll((s) => !s)}
            className={`font-mono text-[10px] px-3 py-1.5 rounded-lg border transition-colors ${showAll ? "bg-ink text-paper border-ink" : "border-rule/30 text-ink2 hover:text-ink"}`}>
            {showAll ? "All regions" : "Important only"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {view === "3d" && <Viewer3D atlas={atlas} mode={mode3d} height={560} />}
        {view === "2d" && <GlassBrain2D atlas={atlas} />}
        {view === "table" && <RegionTable atlas={atlas} showAll={showAll} />}
        {view === "split" && (
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <div>
              <p className="font-mono text-[10px] text-ink2 uppercase tracking-wider mb-2">Region table</p>
              <RegionTable atlas={atlas} showAll={showAll} />
            </div>
            <div>
              <p className="font-mono text-[10px] text-ink2 uppercase tracking-wider mb-2">3D brain</p>
              <Viewer3D atlas={atlas} mode={mode3d} height={520} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
