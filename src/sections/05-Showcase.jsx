import Section from "../components/Section";
import Math from "../components/Math";
import CodeBlock from "../components/CodeBlock";
import DataTable from "../components/DataTable";
import CompareSlider from "../components/CompareSlider";
import BrainGrid from "../components/BrainGrid";
import BrainRenderer from "../components/BrainRenderer";
import Carousel from "../components/Carousel";
import Gallery from "../components/Gallery";
import Callout from "../components/Callout";

const B = import.meta.env.BASE_URL;
const A = (p) => `${B}${p}`;

// Demo imagery (Unsplash, search "brain" — see public/demo/CREDITS.md).
const BRAIN = Array.from({ length: 8 }, (_, i) => A(`demo/brain-0${i + 1}.jpg`));

const CODE = `import torch
from model import BrainAgeNet

model = BrainAgeNet.load("weights.pt").eval()
with torch.no_grad():
    pred_age = model(volume)        # (B, 1)
mae = (pred_age - true_age).abs().mean()`;

const TABLE_COLS = [
  { key: "cohort", label: "Cohort" },
  { key: "n", label: "N", align: "right" },
  { key: "mae", label: "MAE (yr)", align: "right" },
  { key: "r", label: "r", align: "right" },
];
const TABLE_ROWS = [
  { cohort: "Dataset A", n: "1,024", mae: "3.21", r: "0.94" },
  { cohort: "Dataset B", n: "642", mae: "3.88", r: "0.91" },
  { cohort: "Dataset C", n: "918", mae: "4.10", r: "0.89" },
];

const SLICES = ["axial_1", "axial_3", "axial_5", "coronal_1", "coronal_2", "sagittal_1", "sagittal_2", "axial_6"];

// A living catalogue of the template's content + brain-render primitives.
// Copy any block into your own sections.
export default function Showcase() {
  return (
    <Section
      id="showcase"
      eyebrow="Toolbox"
      title="Component showcase"
      lede="Every building block the template ships with. Drop these into your own sections — carousels, galleries, math, code, tables, comparison sliders, callouts, brain grids and interactive 3D/volume viewers."
    >
      <Block title="Carousel / slideshow (auto-advancing · hover to pause)">
        <Carousel
          items={BRAIN.slice(0, 5).map((src, i) => ({ src, caption: `Slide ${i + 1} — swap for your own figures.` }))}
          height={420}
        />
      </Block>

      <Block title="Image gallery (responsive grid · click to enlarge)">
        <Gallery
          cols={4}
          items={BRAIN.map((src, i) => ({ src, caption: `Figure ${i + 1}` }))}
          caption="A responsive image grid with a built-in lightbox — like Clarity's columns-2 / columns-6."
        />
      </Block>

      <Block title="Callouts (note · tip · warning)">
        <Callout kind="note" title="Note">Use callouts to flag context, assumptions or caveats inline with your prose.</Callout>
        <Callout kind="tip" title="Tip">Everything on this page is driven by the Markdown &amp; CSV files in the <code>content/</code> folder — no code.</Callout>
        <Callout kind="warning" title="Heads up">Replace the placeholder Unsplash imagery with your own figures before publishing.</Callout>
      </Block>

      <Block title="Math (LaTeX via KaTeX)">
        <Math tex={"\\mathrm{MAE} = \\frac{1}{N}\\sum_{i=1}^{N} \\left| \\hat{y}_i - y_i \\right|"} />
        <p className="font-serif text-ink2">
          Inline math works too — e.g. the correlation was <Math inline tex={"r = 0.94"} />.
        </p>
      </Block>

      <Block title="Code (copy button, theme-aware highlighting)">
        <CodeBlock language="python" code={CODE} filename="predict.py" />
      </Block>

      <Block title="Table (responsive)">
        <DataTable columns={TABLE_COLS} rows={TABLE_ROWS} caption="Per-dataset performance (illustrative)." />
      </Block>

      <Block title="Comparison slider (Healthy / Unhealthy · before / after)">
        <CompareSlider
          before={{ src: A("assets/preprocessing/raw.png"), label: "Raw" }}
          after={{ src: A("assets/preprocessing/brain.png"), label: "Skull-stripped" }}
          caption="Drag the handle to compare. Use for healthy vs. patient, raw vs. processed, model A vs. B."
          height={340}
        />
      </Block>

      <Block title="Brain grid (static renders)">
        <BrainGrid
          cols={4}
          items={SLICES.map((s) => ({ type: "image", src: `assets/slices/${s}.png` }))}
          caption="A responsive grid of static slice renders — works for cohort galleries or multi-view panels."
        />
      </Block>

      <Block title="Interactive volume (NiiVue)">
        <BrainRenderer type="volume" url="assets/preprocessing/normalised.nii.gz" colormap="gray" height={420} caption="A fully interactive NIfTI viewer — scroll, pan, switch planes." />
      </Block>
    </Section>
  );
}

const Block = ({ title, children }) => (
  <div className="mt-8 first:mt-2">
    <p className="font-sans text-sm font-semibold text-ink2 mb-3">{title}</p>
    {children}
  </div>
);
