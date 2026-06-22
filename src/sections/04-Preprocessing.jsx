import Section from "../components/Section";
import CompareSlider from "../components/CompareSlider";
import config from "../config";

const A = (p) => `${import.meta.env.BASE_URL}${p}`;
const DEFAULT_STEPS = ["Bias correction", "Brain extraction", "Linear registration", "WM normalisation"];

// Light-weight preprocessing summary: a step chip-row + one before/after figure.
// Edit text/steps in site.config.js → content.preprocessing.
export default function Preprocessing() {
  const c = config.content.preprocessing || {};
  const steps = c.steps || DEFAULT_STEPS;
  return (
    <Section
      id="preprocessing"
      eyebrow={c.eyebrow || "Data"}
      title={c.title || "Preprocessing"}
      lede={c.lede || "Each raw scan is bias-corrected, skull-stripped, registered to a common template and intensity-normalised before it reaches the model."}
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-rule/30 bg-paper2 text-ink2">
              <span className="text-sig font-bold mr-1">{i + 1}</span>{s}
            </span>
            {i < steps.length - 1 && <span className="text-ink2/40 select-none">→</span>}
          </div>
        ))}
      </div>
      <CompareSlider
        before={{ src: A("assets/preprocessing/raw.png"), label: "Raw" }}
        after={{ src: A("assets/preprocessing/brain.png"), label: "Preprocessed" }}
        caption="Raw T1 scan vs. the bias-corrected, skull-stripped volume the model sees. Drag to compare."
        height={360}
      />
    </Section>
  );
}
