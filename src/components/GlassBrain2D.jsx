import { useMemo } from "react";
import { sequentialColor, palette } from "../lib/theme";

// Atlas-agnostic 2D "glass brain": three MNI projections (sagittal · coronal ·
// axial) of the region coordinates as dots. Important regions are larger and
// colour-coded by importance; the rest are faint. Works for any atlas with
// x/y/z.mni — no per-atlas image needed.
const PANELS = [
  { key: "sagittal", label: "Sagittal", ax: "y", ay: "z", flipX: false, ax2: "L←→R is into page" },
  { key: "coronal",  label: "Coronal",  ax: "x", ay: "z", flipX: false },
  { key: "axial",    label: "Axial",    ax: "x", ay: "y", flipX: false },
];

function Projection({ regions, ax, ay, maxScore, W = 220, H = 220, pad = 16 }) {
  const { pts, ox } = useMemo(() => {
    const xs = regions.map((r) => r[ax]);
    const ys = regions.map((r) => r[ay]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const sx = (W - 2 * pad) / (maxX - minX || 1);
    const sy = (H - 2 * pad) / (maxY - minY || 1);
    const s = Math.min(sx, sy);
    const ox = (W - (maxX - minX) * s) / 2;
    const oy = (H - (maxY - minY) * s) / 2;
    const pts = regions.map((r) => ({
      r,
      px: ox + (r[ax] - minX) * s,
      py: H - (oy + (r[ay] - minY) * s), // flip Y so +up
    }));
    return { pts, ox };
  }, [regions, ax, ay, W, H, pad]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-paper2 border border-rule/20">
      {/* faint brain hull */}
      <ellipse cx={W / 2} cy={H / 2} rx={(W - 2 * pad) / 2} ry={(H - 2 * pad) / 2} fill={palette.ink} fillOpacity={0.04} stroke={palette.rule} strokeOpacity={0.5} strokeWidth="1" />
      {pts.filter((p) => !p.r.sig).map((p) => (
        <circle key={p.r.id} cx={p.px} cy={p.py} r={2} fill={palette.ink2} fillOpacity={0.28} />
      ))}
      {pts.filter((p) => p.r.sig).map((p) => (
        <circle key={p.r.id} cx={p.px} cy={p.py} r={4.5} fill={sequentialColor(p.r.score / maxScore)} stroke={palette.paper} strokeWidth="0.75" />
      ))}
    </svg>
  );
}

export default function GlassBrain2D({ atlas }) {
  const maxScore = useMemo(() => Math.max(1e-6, ...atlas.regions.map((r) => r.score)), [atlas]);
  return (
    <figure className="my-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PANELS.map((p) => (
          <div key={p.key}>
            <p className="font-mono text-[10px] text-ink2 uppercase tracking-wider mb-1.5 text-center">{p.label}</p>
            <Projection regions={atlas.regions} ax={p.ax} ay={p.ay} maxScore={maxScore} />
          </div>
        ))}
      </div>
      <figcaption className="font-serif text-sm text-ink2 mt-3 text-center italic">
        MNI-space projections of {atlas.count} regions — coloured dots mark the important regions.
      </figcaption>
    </figure>
  );
}
