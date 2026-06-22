import Section from "../components/Section";
import Markdown from "../components/Markdown";
import config from "../config";

export default function Abstract() {
  const a = config.content.abstract;

  return (
    <Section id="abstract" eyebrow={a.eyebrow} title={a.title} lede={a.lede}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {a.stats.map((s) => (
          <div key={s.label} className="bg-paper2 rounded-xl p-6 border border-rule/20">
            <p className="font-sans text-4xl font-bold text-sig tabular-nums">{s.stat}</p>
            <p className="font-sans text-sm font-semibold text-ink mt-1">{s.label}</p>
            <p className="font-serif text-sm text-ink2 mt-1 leading-snug">{s.detail}</p>
          </div>
        ))}
      </div>

      <Markdown html={a.html} className="mt-10" />
    </Section>
  );
}
