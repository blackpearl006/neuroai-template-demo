# Make your own site from this template

A step-by-step for reusing this template for a new paper/study (e.g. for a
friend). No deep coding required — almost everything is one config file.

## 0. One-time setup

```bash
git clone <this-repo> my-study      # or download the folder
cd my-study
npm install
npm run dev                         # open http://localhost:5173
```

The page hot-reloads as you edit. Stop with Ctrl-C.

## 1. Edit one file: `src/site.config.js`

This is the single source of truth. Change:

- **`identity`** — title, authors, institution, tagline, `repoUrl`.
- **`meta`** — browser-tab title + social-share text (and `url` once you know it).
- **`theme` / `fonts`** — `"light" | "dark" | "gradient"`, plus a font preset.
- **`sections`** — turn sections on/off and reorder them. Each entry is
  `{ id, nav, enabled }`; `nav` is the label in the left table-of-contents.
  Set `enabled: false` to hide a section.
- **`content`** — the text/numbers of every section (overview, architecture,
  preprocessing, explorer, results, resources). Edit in place.

The available section `id`s map to components in `src/App.jsx` (`REGISTRY`):
`hero, abstract, architecture, preprocessing, explorer, results, showcase, resources`.

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

That's it — edit `site.config.js`, drop in figures, push.
