import config from "./config";
import Hero          from "./sections/00-Hero";
import Abstract      from "./sections/01-Abstract";
import Playground    from "./sections/02-Playground";
import Comparisons   from "./sections/03-Comparisons";
import Methods       from "./sections/03-Methods";
import Preprocessing from "./sections/04-Preprocessing";
import Resources     from "./sections/04-Resources";
import Showcase      from "./sections/05-Showcase";
import FontSizeControl    from "./components/FontSizeControl";
import AppearanceControls from "./components/AppearanceControls";

// id (from site.config.sections) → section component.
const REGISTRY = {
  hero: Hero,
  abstract: Abstract,
  playground: Playground,
  comparisons: Comparisons,
  methods: Methods,
  preprocessing: Preprocessing,
  showcase: Showcase,
  resources: Resources,
};

const HR = () => <hr className="border-rule/20 max-w-wide mx-auto px-6" />;

export default function App() {
  const { identity } = config;
  const sections = config.sections.filter((s) => s.enabled && REGISTRY[s.id]);

  return (
    <main>
      <FontSizeControl />
      {config.showThemeToggle && <AppearanceControls />}

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
