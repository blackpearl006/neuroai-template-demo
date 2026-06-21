import Section from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import config from "../config";

export default function Resources() {
  const r = config.content.resources;

  return (
    <Section id="resources" eyebrow={r.eyebrow} title={r.title} lede={r.lede}>
      <div className="grid sm:grid-cols-2 gap-4 mt-2">
        {r.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between bg-paper2 rounded-xl p-5 border border-rule/20 hover:border-ink/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{link.icon}</span>
              <div>
                <p className="font-sans font-semibold text-ink group-hover:text-sig transition-colors">
                  {link.label}
                </p>
                <p className="font-serif text-sm text-ink2 mt-0.5">{link.desc}</p>
              </div>
            </div>
            <span className="font-mono text-ink2 group-hover:text-ink transition-colors text-lg">→</span>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <p className="font-sans font-semibold text-ink mb-2">Citation</p>
        <CodeBlock language="bibtex" code={r.citation} />
      </div>
    </Section>
  );
}
