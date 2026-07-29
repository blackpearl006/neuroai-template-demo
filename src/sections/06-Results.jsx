import Section from "../components/Section";
import DataTable from "../components/DataTable";
import BarChart from "../components/BarChart";
import Markdown from "../components/Markdown";
import config from "../config";

// Results & Discussion. Metric cards (content/metrics.csv), a results table
// (content/results-table.csv) and prose (content/results.md) — all editable
// without touching code.
export default function Results() {
  const c = config.content.results || {};
  const metrics = c.metrics || [];
  const hasTable = c.table?.rows?.length > 0;
  const charts = c.charts || {};

  return (
    <Section
      id="results"
      eyebrow={c.eyebrow || "Results"}
      title={c.title || "Results & Discussion"}
      lede={c.lede || "Headline numbers, then what they mean. Replace these with your own results."}
    >
      {metrics.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-paper2 rounded-xl p-6 border border-rule/20">
              <p className="font-sans text-4xl font-bold text-ink tabular-nums">{m.stat}</p>
              <p className="font-sans text-sm text-ink mt-1">{m.label}</p>
              {m.detail && <p className="font-serif text-xs text-ink2 mt-1">{m.detail}</p>}
            </div>
          ))}
        </div>
      )}

      {(charts.mae?.length > 0 || charts.lobes?.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {charts.mae?.length > 0 && (
            <BarChart
              rows={charts.mae}
              categoryKey="Cohort"
              unit=" yr"
              colors={["#C8312B", "#94A0B4"]}
              caption="Mean absolute error per cohort — model vs. a group-mean baseline (placeholder data)."
            />
          )}
          {charts.lobes?.length > 0 && (
            <BarChart
              rows={charts.lobes}
              categoryKey="Hemisphere"
              stacked
              unit="%"
              caption="Share of total saliency by lobe and hemisphere (placeholder data)."
            />
          )}
        </div>
      )}

      {hasTable && <DataTable columns={c.table.columns} rows={c.table.rows} caption={c.table.caption} />}

      <Markdown html={c.html} className="mt-8" />
    </Section>
  );
}
