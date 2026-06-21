# NeuroAI Paper Template

A polished, interactive **website template for neuroimaging / brain-AI papers**.
Built on the [brainage-fingerprints](https://github.com/blackpearl006/brainage-fingerprints.github.io)
site and turned into a reusable, config-driven template — so you can ship a
conference-grade paper page (NeurIPS / CVPR / MICCAI / Nature / Lancet style) by
editing **one file**.

> **Three ways to use it**
> 1. **Non-coder** — edit `src/site.config.js`, run two commands, deploy. No React needed.
> 2. **With an AI agent** — point an agent at [`AGENTS.md`](AGENTS.md); it adapts the whole site from your paper + assets.
> 3. **Power user / artist** — full control of themes, fonts, layouts, and configurable 3D brain renderers.

Stack: **Vite + React + Tailwind + Three.js + NiiVue**. Deploys free on **GitHub Pages**.

---

## ✨ What you get

- **One-file customization** — identity, theme, fonts, sections, and content live in `src/site.config.js`.
- **Live theme + font switcher** — Light / Dark / Gradient themes; Apple-system / Editorial / Modern / Display fonts; reader-controlled text size.
- **Content primitives** — LaTeX math (KaTeX), code blocks with copy buttons, responsive tables, before/after comparison sliders (Healthy/Unhealthy), and lazy video/GIF embeds.
- **Brain-render layer** — a declarative `BrainRenderer` for static images, **interactive NIfTI volumes** (NiiVue), **3D atlas meshes** with rotate/auto-rotate (Three.js), videos, and a responsive `BrainGrid`.
- **ROI-fingerprint explorer** — multi-cohort attribution playground, cross-analysis comparisons, sortable ROI table, network radar (data-driven; optional).
- **Preprocessing pipeline viewer** — step-through NIfTI stages.
- **Publication-grade** — config-driven `<title>` + Open Graph / Twitter cards + favicon, accessible, responsive 320px → 4K.
- **Demo + minimal** — a full worked example (this site) and a `?variant=minimal` Lorem-Ipsum starter showing every primitive.

---

## 🚀 Quick start

```bash
git clone https://github.com/neuroai-template/neuroai-template.github.io.git my-paper
cd my-paper
npm install
npm run dev          # open the printed localhost URL
```

Then edit **`src/site.config.js`** — change the title, authors, links, theme, fonts,
and which sections appear. Save; the page hot-reloads.

Preview the clean starter at `http://localhost:5173/?variant=minimal`.

### Deploy (GitHub Pages, via Actions)

1. Create a repo and push. For a **user/org site** name it `your-name.github.io`; for a **project site** any name works.
2. In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.

> **Base path:** the default `deploy.basePath: "./"` (in `site.config.js`) works for
> **both** a root user-site *and* a project subpath without changes — because this is a
> single-page app. No fiddling required.

---

## 🗂 Configure everything in `src/site.config.js`

| Key | What it controls |
|---|---|
| `identity` | Title (+ accent word), tagline, eyebrow, authors, institution, year, repo URL |
| `meta` | Browser tab title, description, OG/Twitter social card, canonical URL, `lang` |
| `deploy.basePath` | GitHub Pages base (`"./"` is the robust default) |
| `theme` | `"light"` \| `"dark"` \| `"gradient"` (see `src/lib/themes.js`) |
| `fonts` | `"apple"` \| `"editorial"` \| `"modern"` \| `"display"` (see `src/lib/fonts.js`) |
| `fontScale` | Default reader text size `"sm"`–`"xl"` |
| `showThemeToggle` | Show/hide the live theme+font switcher |
| `sections` | Ordered list of `{ id, nav, enabled }` — reorder or drop sections without code |
| `taxonomy` | Cohorts / analyses / thresholds / ROI count for the fingerprint explorer |
| `content` | Editable text for the hero, abstract, and resources sections |

**Add / remove / reorder sections** by editing the `sections` array. Available `id`s:
`hero`, `abstract`, `playground`, `comparisons`, `methods`, `preprocessing`, `showcase`, `resources`.
Set `enabled: false` to hide one.

---

## 🎨 Themes & fonts

Themes and fonts are **CSS-variable driven**, so they apply instantly and are switchable live.

- **Add a theme:** copy a block in `src/lib/themes.js`, change the RGB triplets.
- **Add a font pairing:** copy a block in `src/lib/fonts.js`, set `{ sans, serif, mono }` and a Google Fonts URL (or `null` for system fonts).
- The **Apple** font theme uses the native San Francisco / New York / SF Mono stack — zero downloads, perfect on Apple devices, graceful fallback elsewhere.

Readers can recolour and re-type the site live via the 🎨 control (bottom-right);
choices persist in their browser. Hide it with `showThemeToggle: false`.

---

## 🧩 Content & brain primitives

Drop these into any section (see [`docs/PRIMITIVES.md`](docs/PRIMITIVES.md) for full API + examples):

```jsx
<Math tex="\mathrm{MAE} = \frac{1}{N}\sum_i |\hat y_i - y_i|" />
<CodeBlock language="python" code={code} filename="predict.py" />
<DataTable columns={cols} rows={rows} caption="…" />
<CompareSlider before={{src, label:"Healthy"}} after={{src, label:"Patient"}} />
<MediaEmbed src="demo.mp4" autoplay loop muted caption="…" />

<BrainRenderer type="volume" url="assets/brain.nii.gz" />        {/* interactive NiiVue */}
<BrainRenderer type="mesh" counts={…} sig={…} regions={…} />     {/* 3D atlas, rotatable */}
<BrainGrid cols={4} items={[{type:"image", src:"…"}, …]} />      {/* grid of renders */}
```

`BrainRenderer` types: `image` · `volume` · `mesh` · `video` · `gif` · `compare`.
Asset paths are repo-relative (resolved against the deploy base automatically).

---

## 🔬 Data pipeline (optional)

If your paper has ROI-level attribution data, the `scripts/` regenerate the demo
assets from your own inputs. See [`docs/SCHEMAS.md`](docs/SCHEMAS.md) for JSON shapes
and `scripts/config.py` for paths/taxonomy.

```bash
pip install -r scripts/requirements.txt
# edit scripts/config.py to point at your data, then:
python scripts/build_data.py                 # → public/assets/data/{regions,fingerprints}.json
python scripts/make_figures.py               # → public/assets/figures/*.png (glass brains)
python scripts/gen_brain_slices.py           # → public/assets/slices/*.png
python scripts/prep_preprocessing_assets.py  # → public/assets/preprocessing/*.nii.gz
```

The template **ships pre-generated demo assets**, so the site builds and looks great
without running any Python.

---

## 🖼 Layout Studio

Open **`?studio=1`** (e.g. `http://localhost:5173/?studio=1`) for an in-browser
layout planner: preview the live site across **iPhone / iPad / Mac / 4K** frames,
**reorder and toggle sections**, recolour/retype with theme+font pickers, then
**Copy / Download a `site.config` snippet** to paste back into `src/site.config.js`.
It's a dev-only view (lazy-loaded, never part of the published page). Design notes +
roadmap in [`docs/LAYOUT_STUDIO.md`](docs/LAYOUT_STUDIO.md).

---

## 📁 Project structure

```
src/
  site.config.js          ★ edit this — identity, theme, fonts, sections, content
  site.config.minimal.js  Lorem starter (?variant=minimal)
  config.js               variant resolver
  App.jsx                 composes enabled sections
  lib/                    themes.js · fonts.js · appearance.js · theme.js · data.js
  sections/               Hero · Abstract · Playground · Comparisons · Methods ·
                          Preprocessing · Showcase · Resources
  components/             primitives (Math, CodeBlock, DataTable, CompareSlider,
                          MediaEmbed, BrainRenderer, BrainGrid, …) + viewers
public/assets/            pre-generated demo data, figures, slices, volumes, mesh
scripts/                  Python pipeline to regenerate assets
docs/                     PRIMITIVES.md · SCHEMAS.md · LAYOUT_STUDIO.md
AGENTS.md                 runbook for AI agents adapting the template
```

---

## 🙏 Credits & license

- Adapted from the **brainage-fingerprints** site by Ninad Aithal et al. (IISc Bangalore).
- Inspired by the [Clarity](https://shikun.io/projects/clarity) template's minimalist, hackable philosophy.
- See `LICENSE`.
