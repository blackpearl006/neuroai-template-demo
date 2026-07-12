# Primitives reference

Copy-paste building blocks for your sections. Import from `../components/<Name>`.
See them all live in the **Showcase** section — enable it with
`enabled: true` on the `showcase` line in `config.yml → sections`.

---

## Content

### `<Math>` — LaTeX (KaTeX)
```jsx
<Math tex="\mathrm{MAE} = \frac{1}{N}\sum_i |\hat y_i - y_i|" />   {/* display */}
<Math inline tex="r = 0.94" />                                      {/* inline  */}
```
| prop | default | notes |
|---|---|---|
| `tex` | `""` | LaTeX string |
| `inline` | `false` | inline vs. centered display |

### `<CodeBlock>` — syntax-highlighted code + copy button
```jsx
<CodeBlock language="python" filename="predict.py" code={`import torch\n...`} />
```
| prop | default | notes |
|---|---|---|
| `code` | `""` | source string |
| `language` | auto | highlight.js language id; auto-detects if omitted |
| `filename` | — | label shown in the header |

Token colours follow the active theme (see `src/styles/code.css`).

### `<DataTable>` — responsive table
```jsx
<DataTable
  columns={[{ key: "cohort", label: "Cohort" }, { key: "mae", label: "MAE", align: "right" }]}
  rows={[{ cohort: "ADNI", mae: "3.2" }]}
  caption="…" />
```
`columns[].align`: `"left"` (default) / `"center"` / `"right"`.

### `<BarChart>` — hand-rolled SVG bars (grouped / stacked)
```jsx
<BarChart rows={maeRows} categoryKey="Cohort" unit=" yr"
          colors={["#C8312B", "#94A0B4"]} caption="…" />          {/* grouped */}
<BarChart rows={lobeRows} categoryKey="Hemisphere" stacked unit="%" caption="…" /> {/* stacked */}
```
`rows` is a wide array of objects (first key = category, each other key = a series) —
exactly what a `content/*.csv` parses to. No chart library.
| prop | default | notes |
|---|---|---|
| `rows` | `[]` | wide-format row objects |
| `categoryKey` | first column | which key is the x-axis category |
| `stacked` | `false` | stack the series instead of grouping them |
| `unit` | `""` | appended in tooltips |
| `colors` | on-brand palette | array of CSS colours, one per series |
| `height` | `280` | viewBox height |

### `<Callout>` — note / tip / warning box
```jsx
<Callout kind="tip" title="Heads up">Body text or elements…</Callout>
```
`kind`: `"note"` (default) / `"tip"` / `"warning"`. `title` optional.

### `<Carousel>` — auto-advancing image carousel
```jsx
<Carousel items={[{ src: "assets/a.png", caption: "…", alt: "…" }]} interval={4000} height={420} />
```

### `<Gallery>` — responsive image grid with lightbox
```jsx
<Gallery cols={3} items={[{ src: "assets/a.png", alt: "…", caption: "…" }]} caption="…" />
```
`cols`: 1–4 (responsive). Click any tile to open the lightbox.

### `<CompareSlider>` — before/after (Healthy/Unhealthy)
```jsx
<CompareSlider
  before={{ src: "assets/raw.png",  label: "Healthy" }}
  after={{  src: "assets/lesion.png", label: "Patient" }}
  caption="Drag to compare." height={360} />
```

### `<MediaEmbed>` — video / GIF / image
```jsx
<MediaEmbed src="assets/demo.mp4" autoplay loop muted caption="…" />
<MediaEmbed src="assets/rotation.gif" caption="…" />
```
Autoplay is suppressed under `prefers-reduced-motion`. `controls`, `loop`, `muted`,
`poster` supported.

---

## Brain rendering

### `<BrainRenderer>` — one declarative viewer
```jsx
<BrainRenderer type="image"   src="assets/figures/ADNI_main.png" caption="…" />
<BrainRenderer type="volume"  url="assets/preprocessing/normalised.nii.gz" colormap="gray" height={420} />
<BrainRenderer type="mesh"    counts={counts} sig={sig} regions={regions} height={500} />
<BrainRenderer type="video"   src="assets/spin.mp4" autoplay loop muted />
<BrainRenderer type="gif"     src="assets/spin.gif" />
<BrainRenderer type="compare" before={{src,label}} after={{src,label}} />
```
| type | renders | key props |
|---|---|---|
| `image` | static PNG (glass brain, slice, figure) | `src`, `alt`, `caption` |
| `volume` | interactive NIfTI viewer (NiiVue) | `url`, `overlay`, `colormap`, `height` |
| `mesh` | 3D atlas mesh (legacy — routes to `BrainnetomeAtlas`; prefer the Explorer / `Atlas3D`) | `counts`, `sig`, `regions`, `height` |
| `video` | mp4/webm | `src`, `autoplay`, `loop`, `muted` |
| `gif` | animated gif | `src` |
| `compare` | before/after slider | `before`, `after` |

Static (`image`) = lightweight, screenshot-like. Dynamic (`volume`/`mesh`) =
interactive; `mesh` has a rotate / auto-rotate toggle. Asset paths are
repo-relative — the base path is added automatically. Heavy viewers lazy-load.

### `<BrainGrid>` — responsive grid of renders
```jsx
<BrainGrid
  cols={4}
  heading="Cohort gallery"
  items={[
    { type: "image", src: "assets/slices/axial_1.png" },
    { type: "image", src: "assets/slices/axial_3.png" },
    { type: "volume", url: "assets/preprocessing/brain.nii.gz" },
  ]}
  caption="…" />
```
`cols`: 1–4 (responsive). `items` are `BrainRenderer` configs (mix static + interactive).

---

## Existing viewers (used by sections, available directly)

| Component | Purpose |
|---|---|
| `AtlasExplorer` | the full brain explorer used by the Explorer section: atlas picker + 3D / 2D / table / split views |
| `Atlas3D` | 3D atlas surface mesh or coordinate nodes (three.js) |
| `AtlasVolume` | NiiVue label-volume view (parcellated atlases) |
| `GlassBrain2D` | pre-rendered nilearn glass-brain PNG for an atlas |
| `RegionTable` | sortable ROI table (importance · lobe · hemi) |
| `NiiVueViewer` | general NIfTI multiplanar/3D viewer (`url`, `overlay`, `colormap`, `height`) |
| `GlassBrain` | static image with caption |
| `Section` | section shell (`eyebrow`, `title`, `lede`, `id`) — wrap your content |
| `Markdown`, `ReadMore`, `FigureModal`, `AppearanceControls`, `TableOfContents` | prose + UI helpers |

> `BrainnetomeAtlas` is a legacy Brainnetome-only viewer, superseded by `Atlas3D` —
> don't use it in new sections.

---

## Layout helpers

- Wrap a new section in `<Section eyebrow="…" title="…" lede="…" id="…">…</Section>`
  so it inherits spacing, width (`max-w-wide`), and the nav anchor.
- Register a new section component in `src/App.jsx`'s `REGISTRY` and add its `id`
  to `config.sections`.
- Use theme classes (`text-ink`, `bg-paper2`, `border-rule/20`, `text-sig`,
  `text-accent`, `font-sans/serif/mono`) so it recolours with the theme.
