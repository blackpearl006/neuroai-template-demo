# Make your own site from this template

A step-by-step for reusing this template for a new paper/study (e.g. for a
friend). **No coding required** — you edit Markdown, CSV and one settings file,
all inside the `content/` folder.

## 0. One-time setup

```bash
git clone <this-repo> my-study      # or download the folder
cd my-study
npm install
npm run dev                         # open http://localhost:5173
```

The page hot-reloads as you edit. Stop with Ctrl-C.

## 1. Everything you edit is in the `content/` folder

You never touch code. The folder has three kinds of files:

- **`config.yml`** — settings: title, authors, the colour theme & fonts, the
  hero buttons, and which sections show (turn one off with `enabled: false`,
  reorder by moving the line). It's just `name: value` — keep the indentation.
- **`*.md` (Markdown)** — the words of each section (`hero.md`, `abstract.md`,
  `architecture.md`, `preprocessing.md`, `explorer.md`, `results.md`,
  `resources.md`). Write normally — headings, **bold**, *italic*, [links](#),
  lists. The bit at the very top between the `---` lines is the section's
  eyebrow/title.
- **`*.csv` (open in Excel/Sheets)** — the numbers: `stats.csv` (overview
  cards), `metrics.csv` (results cards), `results-table.csv` (the table),
  `links.csv` (resource links). Edit a cell, save. `citation.bib` holds your
  BibTeX.

A typo in any of these can't break the site — at worst that one section looks
empty until you fix it.

## 2. Swap in your figures & data

- Drop images/figures anywhere under **`public/`** and reference them by
  relative path (e.g. `demo/my-figure.png`). The hero cover, gallery and
  carousel all take such paths.
- **Brain atlases** live in `public/assets/atlases/*.json` (one per atlas) with
  an `index.json` listing them. To regenerate from coordinate CSVs (columns
  `name, x.mni, y.mni, z.mni, lobe, hemi, index`):

  ```bash
  # edit ATLAS_SRC / ATLASES in scripts/build-atlases.mjs, then:
  node scripts/build-atlases.mjs
  ```

  Each region gets a placeholder `score` (0–1) and the top ~20% are flagged
  `sig:1`. Replace `score`/`sig` with your real importance values (edit the JSON
  or the script).

- **Parcellated atlases** (surface mesh + NiiVue label volume) are generated from
  NIfTI label maps by a Python pipeline:

  ```bash
  pip install nibabel nilearn scikit-image trimesh fast_simplification certifi
  python3 scripts/build-parcellation-meshes.py            # all configured atlases
  python3 scripts/build-parcellation-meshes.py --only schaefer400
  ```

  To add an atlas, append a fetcher to the `ATLASES` dict in that script (nilearn
  `fetch_atlas_*` or a neuroparc NIfTI) and re-run. It writes
  `public/assets/meshes/<key>.glb` (parcels named `roi_<id>`),
  `public/assets/atlases/<key>.nii.gz` and `<key>.json`, and updates `index.json`
  (`render:"mesh"`, `mesh`, `volume`). Atlases without a mesh render as coordinate
  nodes (`render:"nodes"`). In the viewer, parcellated atlases offer a **Mesh ▸
  Volume** toggle to compare the surface mesh against the NiiVue volume render.

- The **2D view** uses pre-rendered nilearn glass-brain PNGs. Regenerate them for
  every atlas in `index.json` (e.g. after editing `score`/`sig`) with:

  ```bash
  python3 scripts/build-parcellation-meshes.py --glass-only
  ```
  → `public/assets/atlases/<key>_glass.png`.

## 3. Preview & deploy

```bash
npm run build     # sanity check — must finish with "✓ built"
npm run dev       # final eyeball
```

Deploy to **GitHub Pages** (free):

1. Create a repo under the relevant GitHub account and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds
   and publishes automatically. The site lands at
   `https://<user>.github.io/<repo>/`.

> Pushing the workflow file over an HTTPS token needs the `workflow` scope; if
> that errors, push over SSH instead.

That's it — edit the files in `content/`, drop in figures, push.
