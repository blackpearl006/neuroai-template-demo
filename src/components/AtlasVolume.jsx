import { useEffect, useRef, useState, useMemo } from "react";
import { Niivue, SLICE_TYPE } from "@niivue/niivue";
import { sequentialColor } from "../lib/theme";

const BASE = import.meta.env.BASE_URL;
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const SLICE_BUTTONS = [
  { label: "3D", val: SLICE_TYPE.RENDER },
  { label: "multi", val: SLICE_TYPE.MULTIPLANAR },
];

// NiiVue render of a parcellation label volume. Each parcel is coloured via a
// `colormapLabel` LUT: important regions by importance, the rest faint so the
// brain reads as context. The lighter-weight counterpart to the GLB mesh.
export default function AtlasVolume({ atlas, height = 520 }) {
  const canvasRef = useRef(null);
  const nvRef = useRef(null);
  const [slice, setSlice] = useState(SLICE_TYPE.RENDER);
  const [loading, setLoading] = useState(true);

  // Build the label LUT (flat RGBA, indexed by parcel id) from the atlas regions.
  const lut = useMemo(() => {
    const maxId = Math.max(0, ...atlas.regions.map((r) => r.id));
    const maxScore = Math.max(1e-6, ...atlas.regions.map((r) => r.score));
    const arr = new Uint8ClampedArray((maxId + 1) * 4); // 0 = transparent background
    const labels = new Array(maxId + 1).fill("");
    for (const r of atlas.regions) {
      const [R, G, B] = r.sig ? hexToRgb(sequentialColor(r.score / maxScore)) : [128, 144, 160];
      const o = 4 * r.id;
      arr[o] = R; arr[o + 1] = G; arr[o + 2] = B; arr[o + 3] = r.sig ? 255 : 55;
      labels[r.id] = r.name;
    }
    return { lut: arr, min: 0, max: maxId, labels };
  }, [atlas]);

  useEffect(() => {
    const nv = new Niivue({
      show3Dcrosshair: false,
      backColor: [0.078, 0.118, 0.176, 1],
      isColorbar: false,
      isOrientCube: false,
      sliceType: SLICE_TYPE.RENDER,
    });
    nv.attachToCanvas(canvasRef.current);
    nvRef.current = nv;
    const ro = new ResizeObserver(() => {
      const c = canvasRef.current;
      if (!c || !c.clientWidth) return;
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      if (typeof nv.resizeListener === "function") nv.resizeListener();
      nv.drawScene();
    });
    ro.observe(canvasRef.current);
    return () => { ro.disconnect(); nvRef.current = null; };
  }, []);

  // load / recolour the volume whenever the atlas changes
  useEffect(() => {
    const nv = nvRef.current;
    if (!nv) return;
    setLoading(true);
    nv.loadVolumes([{ url: `${BASE}assets/atlases/${atlas.volume}` }]).then(() => {
      const vol = nv.volumes[0];
      vol.colormapLabel = lut;
      nv.updateGLVolume();
      nv.setSliceType(SLICE_TYPE.RENDER);
      setLoading(false);
      nv.drawScene();
    });
  }, [atlas.volume, lut]);

  useEffect(() => { nvRef.current?.setSliceType(slice); }, [slice]);

  return (
    <div className="relative rounded-xl border border-rule/30 overflow-hidden" style={{ height, background: "#141E2D" }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-sm pointer-events-none">
          <p className="font-mono text-[11px] text-paper/80 tracking-widest">loading volume…</p>
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-1 bg-black/60 backdrop-blur rounded-md p-1 border border-white/10">
        {SLICE_BUTTONS.map((b) => (
          <button key={b.label} onClick={() => setSlice(b.val)}
            className={`font-mono text-[10px] px-2 py-1 rounded transition-colors ${slice === b.val ? "bg-accent text-ink font-semibold" : "text-paper/60 hover:text-paper"}`}>
            {b.label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2 left-3 font-mono text-[10px] text-paper/45 tracking-wide pointer-events-none">
        NiiVue label volume · drag to rotate · scroll to zoom
      </div>
    </div>
  );
}
