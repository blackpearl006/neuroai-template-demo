import Section from "../components/Section";
import DataTable from "../components/DataTable";
import Callout from "../components/Callout";
import config from "../config";

// Results & Discussion — the numbers that matter. Big metric callouts, an
// optional results table, findings prose and a discussion note. Everything is
// driven by site.config.js → content.results, so it's trivial to edit.
export default function Results() {
  const c = config.content.results || {};
  const metrics = c.metrics || [];
  const findings = c.findings || [];

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

      {c.table && <DataTable columns={c.table.columns} rows={c.table.rows} caption={c.table.caption} />}

      {findings.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {findings.map((f) => (
            <div key={f.heading}>
              <h3 className="font-sans font-semibold text-ink text-lg mb-2">{f.heading}</h3>
              <p className="font-serif text-ink2 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      )}

      {c.discussion && <Callout kind="note" title="Discussion">{c.discussion}</Callout>}
    </Section>
  );
}
