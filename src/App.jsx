import config from "./config";
import Hero          from "./sections/00-Hero";
import Abstract      from "./sections/01-Abstract";
import Architecture  from "./sections/03-Architecture";
import Preprocessing from "./sections/04-Preprocessing";
import Explorer      from "./sections/02-Explorer";
import Results       from "./sections/06-Results";
import Resources     from "./sections/04-Resources";
import Showcase      from "./sections/05-Showcase";
import AppearanceControls from "./components/AppearanceControls";
import TableOfContents    from "./components/TableOfContents";

// id (from site.config.sections) → section component.
const REGISTRY = {
  hero: Hero,
  abstract: Abstract,
  architecture: Architecture,
  preprocessing: Preprocessing,
  explorer: Explorer,
  results: Results,
  showcase: Showcase,
  resources: Resources,
};

const HR = () => <hr className="border-rule/20 max-w-wide mx-auto px-6" />;

export default function App() {
  const { identity } = config;
  const sections = config.sections.filter((s) => s.enabled && REGISTRY[s.id]);

  return (
    <main>
      {config.showThemeToggle && <AppearanceControls />}
      <TableOfContents />

      {sections.map((s, i) => {
        const Cmp = REGISTRY[s.id];
        return (
          <div key={s.id}>
            {i > 0 && <HR />}
            <Cmp />
          </div>
        );
      })}

      <footer className="py-12 text-center font-mono text-xs text-ink2 border-t border-rule/20 mt-8">
        <p>© {identity.year} {identity.authors} · {identity.institution}</p>
        <p className="mt-1 text-ink2/50">
          Built with the NeuroAI paper template
          {identity.repoUrl && (
            <> · <a href={identity.repoUrl} className="hover:text-ink underline">Source</a></>
          )}
        </p>
      </footer>
    </main>
  );
}
