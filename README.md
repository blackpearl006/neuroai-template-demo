# NeuroAI Paper Template

A polished, interactive **website template for neuroimaging / brain-AI papers**.
Ship a conference-grade paper page (NeurIPS / CVPR / MICCAI / Nature / Lancet
style) by editing **Markdown, CSV and one settings file** — no coding.

> **Three ways to use it**
> 1. **Non-coder** — edit the files in `content/`, run two commands, deploy. No React needed.
> 2. **With an AI agent** — point an agent at [`AGENTS.md`](AGENTS.md); it adapts the whole site from your paper + assets.
> 3. **Power user** — full control of themes, fonts, components and the 3D/volume brain renderers.

Stack: **Vite + React + Tailwind + Three.js + NiiVue**. Deploys free on **GitHub Pages**.
Full walkthrough in [`HOWTO.md`](HOWTO.md).

---

## 🚀 Quick start

```bash
git clone <this-repo> my-paper
cd my-paper
npm install
npm run dev          # open the printed localhost URL
```

Then edit the files in **`content/`** (see below). Save; the page hot-reloads.

### Deploy (GitHub Pages, via Actions)

1. Create a repo and push. For a **user/org site** name it `your-name.github.io`; for a **project site** any name works.
2. In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.

> **Base path** is `"./"`, which works for both a root user-site and a project
> subpath without changes — it's a single-page app.

---

## 🗂 Everything you edit lives in `content/`

No code. Three kinds of files:

| File(s) | Controls | Format |
|---|---|---|
| `config.yml` | title, authors, theme, fonts, hero buttons, which sections show + their order | settings (`name: value`) |
| `hero.md`, `abstract.md`, `architecture.md`, `preprocessing.md`, `explorer.md`, `results.md`, `resources.md` | the **words** of each section | Markdown (with a small `---` front-matter block for eyebrow/title) |
| `stats.csv`, `metrics.csv`, `results-table.csv`, `links.csv` | the **numbers** / table / links | CSV (open in Excel/Sheets) |
| `citation.bib` | citation | BibTeX |

A typo in any of these can't white-screen the site — at worst that one section
looks blank until you fix it. Figures go in **`public/`** and are referenced by
relative path (e.g. `demo/fig.png`).

Section `id`s (used in `config.yml → sections`): `hero, abstract, architecture,
preprocessing, explorer, results, showcase, resources`. Hide one with
`enabled: false`; reorder by moving its line.

---

## 🎨 Themes & fonts

CSS-variable driven, switchable live by the reader via the control bottom-right
(hide it with `showThemeToggle: false` in `config.yml`).

- **Themes:** `light` · `dark` · `gradient` — add one in `src/lib/themes.js`.
- **Fonts:** `apple` · `editorial` · `modern` · `display` — add a pairing in `src/lib/fonts.js`.

---

## 🧠 The brain explorer

The Explorer section renders brain atlases as **interactive 3D meshes**, **NiiVue
label volumes**, **2D glass-brain projections**, or a **sortable table**.
Parcellated atlases (Brainnetome, Schaefer-400, AAL, Harvard-Oxford, Yeo, Glasser)
ship as meshes; coordinate atlases render as nodes. To add/regenerate atlases
(developer step, needs Python):

```bash
pip install nibabel nilearn scikit-image trimesh fast_simplification certifi marked
python3 scripts/build-parcellation-meshes.py             # meshes + volumes + json
python3 scripts/build-parcellation-meshes.py --glass-only  # the 2D glass-brain PNGs
node   scripts/build-atlases.mjs                          # coordinate-node atlases from CSVs
```

The template **ships pre-generated assets**, so it builds and looks great without
running anything.

---

## 📁 Project structure

```
content/                ★ edit these — config.yml + *.md + *.csv + citation.bib
src/
  config.js             re-exports the assembled config
  lib/content.js        parses content/ (Markdown + CSV + YAML) into the config
  App.jsx               composes the enabled sections
  lib/                  themes.js · fonts.js · appearance.js · theme.js · atlas.js
  sections/             Hero · Abstract · Architecture · Preprocessing ·
                        Explorer · Results · Showcase · Resources
  components/           Math · CodeBlock · DataTable · Carousel · Gallery ·
                        Markdown · Atlas3D · AtlasVolume · GlassBrain2D · …
public/assets/          pre-generated atlas meshes, volumes, glass PNGs, figures
scripts/                build-atlases.mjs · build-parcellation-meshes.py
HOWTO.md                step-by-step for making it your own
AGENTS.md               runbook for AI agents adapting the template
```

---

## 🙏 Credits & license

- Inspired by the [Clarity](https://shikun.io/projects/clarity) template's minimalist, hackable philosophy.
- Atlases: nilearn, neuroparc, TemplateFlow (see `public/assets/atlases/CREDITS.md`).
- See `LICENSE`.
