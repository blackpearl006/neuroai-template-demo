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

> **It ships as a finished demo paper** — *"Anatomical Predictors of Fluid Reasoning"* —
> so the first thing you see is a complete, polished page rather than empty
> scaffolding. Replace the demo text/numbers in `content/` with your own. The
> component **showcase** (every building block in one place) ships **off**; flip
> `showcase → enabled: true` in `config.yml` to browse it.

---

## 🚀 Quick start

```bash
git clone <this-repo> my-paper
cd my-paper
npm install
npm run dev          # open the printed localhost URL
```

Then edit the files in **`content/`** (see below). Save; the page hot-reloads.

### 📤 Publish it (GitHub Pages)

Three steps — no manual building, no uploads:

1. **Create a GitHub repo** and push this project to it. Any repo name works
   (e.g. `my-paper`); for a root site name it `your-username.github.io`.
2. On GitHub, go to **Settings → Pages → Build and deployment → Source** and
   choose **GitHub Actions**.
3. **Push to the `main` branch.**

That's it. The included workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
builds and deploys automatically on every push to `main`. Watch the green ✓ under
the repo's **Actions** tab — the first deploy takes ~1–2 min.

Your site goes live at:

```
https://<your-username>.github.io/<repo-name>/
```

> **No config to change.** Base path is `"./"` (relative), so the same build
> works whether it's a root user-site or a project subpath.

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

- **Themes:** `light` · `dark` · `gradient` · `clinical` — add one in `src/lib/themes.js`.
- **Fonts:** `apple` · `editorial` · `modern` · `display` · `clinical` — add a pairing in `src/lib/fonts.js`.

> **Clinical preset:** set `theme: clinical` + `fonts: clinical` for a cool
> slate-and-teal "scanner" look — reticle eyebrows, scan-line dividers and IBM
> Plex — aimed at clinical / radiology papers. The default stays the warm
> editorial research look.

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

**Put your own results on a brain — no Python.** Drop a `content/brain-values.csv`
(`region,value[,sig]`, matching an atlas region name or id — see
`content/brain-values.example.csv`) and the Explorer's 3D mesh and region table
recolour to *your* ROI values (min-max normalised, so any scale works). Omit the
file and the shipped demo saliency shows. (The 2D glass-brain is a pre-rendered
image; regenerate it with the Python script for custom 2D projections.)

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
