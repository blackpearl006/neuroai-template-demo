import config from "../config";
import { lazy, Suspense, Component, useState, useEffect } from "react";

const HeroBrain = lazy(() => import("../components/HeroBrain"));

// Quiet boundary: if WebGL is unavailable the live brain simply never appears
// (the reduced-motion path / static poster covers that case) — it must never
// escalate a missing GPU into the app-wide error screen.
class BrainBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

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
  const [brainReady, setBrainReady] = useState(false);
  const [brainFailed, setBrainFailed] = useState(false);
  const [motionOK, setMotionOK] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <header className="max-w-wide mx-auto px-6 pt-20 pb-14">
      {hero.eyebrow && (
        <p className="font-mono text-xs text-ink2 uppercase tracking-widest mb-4">
          {hero.eyebrow}
        </p>
      )}
      <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-semibold text-ink leading-[1.1] max-w-[22ch] text-balance break-words">
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
      {(hero.primaryCta?.href || hero.secondaryCta?.href) && (
        <div className="flex flex-wrap gap-3 mt-8">
          {hero.primaryCta?.href && (
            <a
              href={hero.primaryCta.href}
              className="font-mono text-sm bg-ink text-paper px-6 py-2.5 rounded-lg hover:bg-rule transition-colors"
            >
              {hero.primaryCta.label}
            </a>
          )}
          {hero.secondaryCta?.href && (
            <a
              href={hero.secondaryCta.href}
              className="font-mono text-sm border border-rule/40 text-ink2 px-6 py-2.5 rounded-lg hover:text-ink hover:border-ink/60 transition-colors"
            >
              {hero.secondaryCta.label}
            </a>
          )}
        </div>
      )}

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

      {/* Hero brain. Motion users get a borderless, slowly auto-rotating 3D mesh
          on a transparent canvas — it composites straight onto the page, not a
          framed screenshot. Reduced-motion / no-WebGL users get the instant
          static glass-brain in a minimal figure (a black projection reads best
          contained). Either way the interactive viewer lives in Explorer. */}
      {hero.brain?.atlas && (motionOK && !brainFailed ? (
        <div className="relative mt-12 hero-brain-mask" style={{ height: 460 }}>
          <BrainBoundary onFail={() => setBrainFailed(true)}>
            <Suspense fallback={null}>
              <div
                className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
                style={{ opacity: brainReady ? 1 : 0 }}
              >
                <HeroBrain height={460} onReady={() => setBrainReady(true)} />
              </div>
            </Suspense>
          </BrainBoundary>
          <a
            href="#explorer"
            className="absolute bottom-0 right-1 font-mono text-[10px] uppercase tracking-widest text-ink2/70 hover:text-sig transition-colors"
          >
            Explore in 3D ↓
          </a>
        </div>
      ) : (
        <figure className="mt-12 rounded-2xl border border-rule/20 overflow-hidden bg-paper2">
          <div style={{ background: "#000" }} className="relative">
            <img
              src={asset(`assets/atlases/${hero.brain.atlas}_glass.png`)}
              alt={`${hero.brain.label || "Brain atlas"} glass-brain projection`}
              className="block w-full h-auto"
            />
            <a
              href="#explorer"
              className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Explore in 3D ↓
            </a>
          </div>
        </figure>
      ))}

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
