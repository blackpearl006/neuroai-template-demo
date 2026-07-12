// Hand-rolled SVG bar chart — grouped or stacked — driven straight from a CSV in
// wide format (first column = category, each remaining numeric column = a series).
// No charting library: fills come from an on-brand categorical palette, the axes
// and gridlines use the theme tokens, so it matches light/dark and costs ~0 KB.
//
//   Cohort,Model,Baseline        →  grouped bars, one group per row
//   Hemisphere,Frontal,Temporal  →  stacked bars when `stacked` is set
//
// On-brand categorical palette (drawn from the reference sites' colours; each
// reads cleanly on both the cream and dark themes).
const DEFAULT_COLORS = ["#C8312B", "#E89B2C", "#2A9E8F", "#4B78C4", "#9B6FD4", "#5A6478"];

function niceCeil(v) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = [1, 2, 3, 4, 5, 6, 8, 10].find((s) => s >= n - 1e-9) || 10;
  return step * pow;
}
const trimNum = (n) => +n.toFixed(2);

export default function BarChart({
  rows = [],
  categoryKey,
  stacked = false,
  unit = "",
  colors = DEFAULT_COLORS,
  height = 280,
  caption,
}) {
  if (!rows.length) return null;
  const catKey = categoryKey || Object.keys(rows[0])[0];
  const seriesKeys = Object.keys(rows[0]).filter((k) => k !== catKey);
  const cats = rows.map((r) => r[catKey]);
  const values = rows.map((r) => seriesKeys.map((k) => parseFloat(r[k]) || 0));

  const maxVal = stacked
    ? Math.max(...values.map((v) => v.reduce((a, b) => a + b, 0)))
    : Math.max(...values.flat());
  const top = niceCeil(maxVal);

  // viewBox geometry
  const W = 640, H = height;
  const padL = 40, padR = 12, padT = 8, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const band = plotW / cats.length;
  const innerW = band * 0.68;                 // bar-group width within a band
  const bandX = (i) => padL + i * band + (band - innerW) / 2;
  const y = (v) => padT + plotH * (1 - v / top);
  const nTicks = 4;
  const ticks = Array.from({ length: nTicks + 1 }, (_, i) => trimNum((top / nTicks) * i));

  return (
    <figure className="rounded-xl border border-rule/20 bg-paper2 p-4">
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        {seriesKeys.map((k, si) => (
          <span key={k} className="flex items-center gap-1.5 font-mono text-[11px] text-ink2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[si % colors.length] }} />
            {k}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={caption || "bar chart"}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="stroke-rule/20" strokeWidth="1" />
            <text x={padL - 7} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink2 font-mono" fontSize="10">{t}</text>
          </g>
        ))}

        {cats.map((cat, ci) => {
          const vals = values[ci];
          if (stacked) {
            let acc = 0;
            return (
              <g key={cat}>
                {vals.map((v, si) => {
                  const yTop = y(acc + v), h = y(acc) - y(acc + v);
                  acc += v;
                  return (
                    <rect key={si} x={bandX(ci)} y={yTop} width={innerW} height={Math.max(0, h)} style={{ fill: colors[si % colors.length] }}>
                      <title>{`${cat} · ${seriesKeys[si]}: ${v}${unit}`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          }
          const bw = innerW / vals.length;
          return (
            <g key={cat}>
              {vals.map((v, si) => (
                <rect key={si} x={bandX(ci) + si * bw} y={y(v)} width={bw * 0.84} height={Math.max(0, y(0) - y(v))} rx="1.5" style={{ fill: colors[si % colors.length] }}>
                  <title>{`${cat} · ${seriesKeys[si]}: ${v}${unit}`}</title>
                </rect>
              ))}
            </g>
          );
        })}

        {cats.map((cat, ci) => (
          <text key={cat} x={padL + ci * band + band / 2} y={H - padB + 15} textAnchor="middle" className="fill-ink2 font-mono" fontSize="10">{cat}</text>
        ))}
        <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} className="stroke-rule/40" strokeWidth="1" />
      </svg>

      {caption && <figcaption className="font-serif text-xs text-ink2 mt-2 italic">{caption}</figcaption>}
    </figure>
  );
}
