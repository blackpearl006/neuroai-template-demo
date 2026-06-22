import Section from "../components/Section";
import DataTable from "../components/DataTable";
import Markdown from "../components/Markdown";
import config from "../config";

// Results & Discussion. Metric cards (content/metrics.csv), a results table
// (content/results-table.csv) and prose (content/results.md) — all editable
// without touching code.
export default function Results() {
  const c = config.content.results || {};
  const metrics = c.metrics || [];
  const hasTable = c.table?.rows?.length > 0;

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
              <p className="font-sans text-4xl font-bold text-sig tabular-nums">{m.stat}</p>
              <p className="font-sans text-sm text-ink mt-1">{m.label}</p>
              {m.detail && <p className="font-serif text-xs text-ink2 mt-1">{m.detail}</p>}
            </div>
          ))}
        </div>
      )}

      {hasTable && <DataTable columns={c.table.columns} rows={c.table.rows} caption={c.table.caption} />}

      <Markdown html={c.html} className="mt-8" />
    </Section>
  );
}
