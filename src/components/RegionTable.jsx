import { useMemo, useState } from "react";
import { sequentialColor } from "../lib/theme";

// Generic, atlas-agnostic ROI table. Sortable; shows important regions by
// default with a toggle to show all. Columns come straight from the atlas JSON
// (name · lobe · hemi · importance), so it works for every atlas.
export default function RegionTable({ atlas, showAll = false }) {
  const [sortKey, setSortKey] = useState("score");
  const [sortDir, setSortDir] = useState(-1);
  const maxScore = useMemo(() => Math.max(1e-6, ...atlas.regions.map((r) => r.score)), [atlas]);

  const rows = useMemo(() => {
    const list = atlas.regions.filter((r) => showAll || r.sig);
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return typeof av === "string" ? sortDir * av.localeCompare(bv) : sortDir * (av - bv);
    });
  }, [atlas, showAll, sortKey, sortDir]);

  const toggle = (k) => (sortKey === k ? setSortDir((d) => -d) : (setSortKey(k), setSortDir(-1)));
  const th = "px-3 py-2.5 text-left font-mono text-[11px] font-semibold text-ink2 cursor-pointer select-none hover:text-ink whitespace-nowrap";
  const td = "px-3 py-2 font-mono text-xs";

  return (
    <div className="overflow-x-auto rounded-lg border border-rule/20">
      <table className="w-full bg-paper2 text-sm">
        <thead className="border-b border-rule/20 bg-paper">
          <tr>
            <th className={th} onClick={() => toggle("id")}>#</th>
            <th className={th + " w-full"} onClick={() => toggle("name")}>Region</th>
            <th className={th} onClick={() => toggle("lobe")}>Lobe</th>
            <th className={th} onClick={() => toggle("hemi")}>Hemi</th>
            <th className={th + " text-right pr-5"} onClick={() => toggle("score")}>Importance ↕</th>
            <th className={th + " text-center"}>Imp.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className={`border-b border-rule/10 hover:bg-paper transition-colors ${i % 2 ? "bg-paper/40" : ""}`}>
              <td className={td + " text-ink2 whitespace-nowrap"}>{r.id}</td>
              <td className={td + " font-semibold text-ink w-full"}>{r.name}</td>
              <td className={td + " text-ink2 whitespace-nowrap"}>{r.lobe}</td>
              <td className={td + " text-ink2 text-center whitespace-nowrap"}>{r.hemi}</td>
              <td className={td + " pr-5"}>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-16 h-1.5 rounded-full bg-rule/20 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(r.score / maxScore) * 100}%`, background: sequentialColor(r.score / maxScore) }} />
                  </div>
                  <span className="font-semibold tabular-nums w-9 text-right">{r.score.toFixed(2)}</span>
                </div>
              </td>
              <td className={td + " text-center"}>{r.sig ? <span className="text-sig font-bold text-sm">✓</span> : <span className="text-ink2/30 text-sm">–</span>}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-3 py-10 text-center text-ink2 font-sans text-sm">No regions to show.</td></tr>
          )}
        </tbody>
      </table>
      <div className="px-3 py-2 border-t border-rule/20">
        <span className="text-[11px] font-mono text-ink2">{rows.length} region{rows.length !== 1 ? "s" : ""} shown</span>
      </div>
    </div>
  );
}
