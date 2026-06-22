import config from "../config";

// Prefix a project-relative asset path with the deploy base; pass http(s) through.
const asset = (p) => (!p || /^https?:/.test(p) ? p : `${import.meta.env.BASE_URL}${p}`);

// Splits the title so the configured accent word renders in the signal colour.
function renderTitle(title, accent) {
  if (!accent || !title.includes(accent)) return title;
  const [before, after] = title.split(accent);
  return (
    <>
      {before}
      <span className="text-sig">{accent}</span>
      {after}
    </>
  );
}

export default function Hero() {
  const { identity } = config;
  const hero = config.content.hero;

  return (
    <header className="max-w-wide mx-auto px-6 pt-20 pb-14">
      {hero.eyebrow && (
        <p className="font-mono text-xs text-ink2 uppercase tracking-widest mb-4">
          {hero.eyebrow}
        </p>
      )}
      <h1 className="font-sans text-5xl md:text-6xl font-semibold text-ink leading-[1.1] max-w-[22ch]">
        {renderTitle(identity.title, identity.titleAccent)}
      </h1>
      {(identity.authors || identity.institution) && (
        <p className="mt-5 font-sans text-base text-ink">
          {identity.authors}
          {identity.authors && identity.institution ? <span className="text-ink2"> · {identity.institution}</span> : identity.institution}
        </p>
      )}
      <p
        className="mt-5 font-serif text-xl text-ink2 max-w-[58ch] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: hero.taglineHtml }}
      />
      <div className="flex flex-wrap gap-3 mt-8">
        <a
          href={hero.primaryCta.href}
          className="font-mono text-sm bg-ink text-paper px-6 py-2.5 rounded-lg hover:bg-rule transition-colors"
        >
          {hero.primaryCta.label}
        </a>
        <a
          href={hero.secondaryCta.href}
          className="font-mono text-sm border border-rule/40 text-ink2 px-6 py-2.5 rounded-lg hover:text-ink hover:border-ink/60 transition-colors"
        >
          {hero.secondaryCta.label}
        </a>
      </div>

      {/* Feature chips */}
      {hero.chips?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
          {hero.chips.map((c) => (
            <span key={c} className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-rule/30 text-ink2 bg-paper2">
              {c}
            </span>
          ))}
          {hero.badge && (
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-ink text-paper">
              {hero.badge}
            </span>
          )}
        </div>
      )}

      {/* Optional project cover image. Omit `hero.cover` in content/config.yml for
          Clarity's "no-cover" title layout (the default). */}
      {hero.cover && (
        <figure className="mt-12 rounded-2xl overflow-hidden border border-rule/20">
          <img src={asset(hero.cover)} alt={identity.title} className="w-full object-cover max-h-[460px]" />
        </figure>
      )}
    </header>
  );
}
