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
import config from "../config";

const B = import.meta.env.BASE_URL;
const A = (p) => `${B}${p}`;

// Real imagery: the atlas glass-brain projections this template already ships
// (public/assets/atlases/<key>_glass.png). No stock photos — the showcase runs
// on the paper's own assets so nothing reads as placeholder.
const ATLASES = [
  { key: "brainnetome",    label: "Brainnetome · 246 regions" },
  { key: "schaefer400",    label: "Schaefer · 400 parcels" },
  { key: "glasser360",     label: "Glasser HCP-MMP · 360" },
  { key: "aal116",         label: "AAL · 116 regions" },
  { key: "harvard_oxford", label: "Harvard–Oxford" },
  { key: "yeo7",           label: "Yeo · 7 networks" },
  { key: "gordon333",      label: "Gordon · 333 nodes" },
  { key: "power264",       label: "Power · 264 nodes" },
];
const glass = (k) => A(`assets/atlases/${k}_glass.png`);

const CODE = `import torch
from model import BrainAgeNet

model = BrainAgeNet.load("weights.pt").eval()
with torch.no_grad():
    pred_age = model(volume)        # (B, 1)
mae = (pred_age - true_age).abs().mean()`;

// Real per-cohort results — the same table content/results-table.csv drives the
// Results section, rendered here to show the DataTable primitive on live data.
const RESULTS = config.content.results.table;

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
          items={ATLASES.slice(0, 5).map(({ key, label }) => ({ src: glass(key), caption: label }))}
          height={420}
        />
      </Block>

      <Block title="Image gallery (responsive grid · click to enlarge)">
        <Gallery
          cols={4}
          items={ATLASES.map(({ key, label }) => ({ src: glass(key), caption: label }))}
          caption="A responsive image grid with a built-in lightbox — here, eight of the atlas projections the template ships with."
        />
      </Block>

      <Block title="Callouts (note · tip · warning)">
        <Callout kind="note" title="Finding">Prediction is carried by association cortex, medial temporal lobe and key subcortical structures — and the same regions surface across the Schaefer, AAL and Glasser parcellations.</Callout>
        <Callout kind="tip" title="Tip">Everything on this page is driven by the Markdown &amp; CSV files in the <code>content/</code> folder — no code.</Callout>
        <Callout kind="warning" title="Before you publish">This showcase ships enabled so you can browse every primitive. Set <code>showcase → enabled: false</code> in <code>config.yml</code> for a published paper.</Callout>
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
        <DataTable columns={RESULTS.columns} rows={RESULTS.rows} caption="Per-cohort brain-age error — the live results table from content/results-table.csv." />
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
