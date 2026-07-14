# AGENTS.md — adapting this template to a new paper

You are an AI agent (Claude Code, Cursor, Copilot, …) tasked with turning this
**NeuroAI paper template** into a finished website for a specific paper. This file
is your runbook. Optimise for *correctness over completeness* — a scientific site
with a wrong number is worse than one with a clearly-marked `TODO`.

> Humans can do all of this by hand too (see `README.md`). This file just lets you
> do the heavy lifting and hand back a reviewable result.

---

## 0. Golden rules (read first)

1. **Never invent numbers, results, citations, or claims.** Copy them verbatim from
   the source paper, or insert `TODO(author): …`. This is non-negotiable.
2. **Edit the files in `content/` first and most.** ~90% of customization is there —
   `config.yml`, the per-section `*.md`, the `*.csv`, and `citation.bib`. Avoid
   touching component internals unless a section genuinely needs new structure.
3. **Keep the build green.** Run `npm run build` after each meaningful change.
4. **Disable, don't destroy.** To remove a section, set `enabled: false` in
   `config.yml → sections` — don't delete the component.
5. **Preserve accessibility & meta** (alt text, headings, OG tags, favicon).
6. A malformed `content/` file can't white-screen the site — a bad `*.md` shows a
   blank section; a bad `config.yml` shows an error banner. Still, fix them.

---

## 1. The editing surface — everything lives in `content/`

| File(s) | Controls | Format |
|---|---|---|
| `config.yml` | title, authors, theme, fonts, hero (buttons, chips, brain figure), which sections show + their order | settings (`name: value`) |
| `hero.md`, `abstract.md`, `architecture.md`, `preprocessing.md`, `explorer.md`, `results.md`, `resources.md` | the **words** of each section (front-matter for eyebrow/title/lede + Markdown body) | Markdown |
| `stats.csv`, `metrics.csv`, `results-table.csv`, `chart-mae.csv`, `chart-lobes.csv`, `links.csv` | the **numbers** — stat cards, results table, bar charts, resource links | CSV (open in Excel/Sheets) |
| `brain-values.csv` *(optional)* | **BYO data** — your own per-region results, coloured onto any atlas in the Explorer, no Python (see §4) | CSV |
| `citation.bib` | the citation | BibTeX |

Figures go in `public/` and are referenced by repo-relative path (the renderer adds
the deploy base path automatically).

Section `id`s (used in `config.yml → sections`): `hero, abstract, architecture,
preprocessing, explorer, results, showcase, resources`.

---

## 2. Decision tree — which sections to keep

For each, decide keep / customize / disable via `config.sections[].enabled`:

| Question about the paper | If yes | If no |
|---|---|---|
| Has an atlas / ROI-level result to show on a brain? | keep `explorer`; set `defaultAtlas` in `content/explorer.md` (see §4) | disable `explorer` |
| Describes a preprocessing pipeline? | keep `preprocessing`; edit steps + the before/after figure in `content/preprocessing.md` | disable |
| Has a model architecture worth a diagram? | keep `architecture` (the diagram is code-driven in `src/components/Architecture.jsx`) | disable, or replace with a figure image |
| Has headline metrics / comparison numbers? | keep `results`; fill `metrics.csv`, `results-table.csv`, and the two `chart-*.csv` | disable the pieces you don't need |
| Has a healthy-vs-patient or before/after contrast? | use `<CompareSlider>` (see `docs/PRIMITIVES.md`) | — |
| Has equations / code central to the method? | use `<Math>` / `<CodeBlock>` | plain prose |
| Always | keep `hero`, `abstract`, `resources`; fill from the paper | |

The `showcase` section is a live catalogue of every component; keep it **off**
(`enabled: false`) for a published paper site unless the reader wants the tour.

---

## 3. Phase 1 — autonomous first pass (edit `content/`)

1. **`config.yml` identity**: `title` (+ a `titleAccent` word that appears in the
   title), `authors`, `institution`, `year`, `repoUrl`.
2. **`config.yml` meta**: `title`, `description`, `url` (the Pages URL), `twitter`,
   `ogImage` (replace `public/og-image.png` with the paper's hero figure or a 1200×630 card).
3. **`config.yml` theme / fonts / fontScale**: pick to match the paper's field.
   `light` + `editorial` is the safe default (a warm, editorial research look).
   For a clinical / radiology paper, `theme: clinical` + `fonts: clinical` ships a
   cool slate-and-teal "scanner" preset (reticle eyebrows, scan-line dividers, IBM
   Plex) in one switch. Readers can also flip any preset live via the Display control.
4. **`config.yml` hero**: `chips`, `badge`, `primaryCta`/`secondaryCta`, and the
   `brain` block (`atlas` = any key under `public/assets/atlases/`, plus `label` +
   `caption`) — the instant glass-brain that anchors the page. Delete `brain:` for a
   text-only hero.
5. **`config.yml` sections**: set the enabled set per §2.
6. **Prose** (`*.md`): rewrite `hero.md`, `abstract.md`, `architecture.md`,
   `preprocessing.md`, `explorer.md`, `results.md`, `resources.md` verbatim from the
   paper. Front-matter sets each section's `eyebrow`/`title`/`lede`.
7. **Numbers** (`*.csv`): fill `stats.csv`, `metrics.csv`, `results-table.csv`, and
   the chart CSVs. Every number must come from the paper; otherwise `TODO(author)`.
8. **Assets**: drop the paper's images into `public/…` and reference them by
   repo-relative path.
9. **Citation**: paste the BibTeX into `content/citation.bib`.

After each step run `npm run build`; fix errors before moving on.

---

## 4. The brain explorer + charts

- **Explorer atlases** are pre-generated and ship with the template (15 atlases in
  `public/assets/atlases/`). Pick which one loads first with `defaultAtlas` and the
  starting view with `defaultView` (`2d` | `3d` | `table` | `split`) in
  `content/explorer.md`. Data shapes are in `docs/SCHEMAS.md`. Regenerating atlases
  from your own NIfTI label maps is an advanced, Python step —
  `scripts/build-parcellation-meshes.py` (+ `scripts/build-atlases.mjs` for
  coordinate-node atlases). If you can't run those, keep the shipped atlases.
- **BYO data — put your own results on a brain (no Python).** Drop a
  `content/brain-values.csv` with columns `region,value[,sig]` where `region` matches
  an atlas region `name` or `id` (see `content/brain-values.example.csv`). The
  Explorer's **3D mesh + region table + "important" count** recolour to your values —
  they're min-max normalised, so any scale works (saliency, t-stat, effect size,
  weight). Rows you omit read as zero / not significant; if you skip the `sig` column
  the top ~20% by value are flagged. *Caveat:* the **2D glass-brain is a pre-rendered
  image** and won't reflect the CSV — regenerate it with the Python script (below) or
  use the 3D / table views for custom data.
- **Bar charts** in Results are driven by `content/chart-mae.csv` (grouped) and
  `content/chart-lobes.csv` (stacked) — wide CSVs: first column = category, each
  other column = a series. Edit the numbers; the SVG chart re-renders. No chart
  library, no code.

---

## 5. Phase 2 — hand back a review checklist

Present this to the human and **wait for sign-off** before deploying:

- [ ] Title, authors, affiliation, year correct.
- [ ] Every stat / number / claim verified against the paper (no fabrications; all `TODO`s resolved or flagged).
- [ ] Links (preprint, code, weights, data) point to real URLs.
- [ ] Citation / BibTeX correct.
- [ ] Section set correct; disabled sections intentional.
- [ ] Theme / font / scale look right; `npm run dev` reviewed on mobile + desktop widths.
- [ ] Social card (`og-image.png`, 1200×630) and favicon updated.
- [ ] `npm run build` passes.
- [ ] `deploy.basePath` is `"./"` (works for both a root user-site and a project subpath).

**Self-check before hand-off** (run these; resolve every hit):

```bash
npm run build                                   # must exit 0
grep -rn "TODO(author" content/                 # every one must be resolved or flagged to the human
grep -rniE "brain age|cortical signatures|maya chandra|becker|12,480|brainnetome-template-demo" content/
                                                 # leftover demo copy — should return nothing once retargeted
```

---

## 6. Deploy (GitHub Pages via Actions)

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source → GitHub Actions** (one-time).
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds and
   publishes automatically; the site appears at
   `https://<user>.github.io/<repo>/`.

---

## 7. Where things live (quick map)

| Need to change… | File |
|---|---|
| Title, authors, links, theme, fonts, sections, hero (incl. brain figure) | `content/config.yml` |
| Any section's prose | `content/<section>.md` |
| Stat cards / results table / chart data / links | `content/*.csv` |
| Your own per-region results on a brain (BYO data) | `content/brain-values.csv` (see §4) |
| Model architecture diagram | `src/components/Architecture.jsx` |
| Colour themes / font pairings | `src/lib/themes.js`, `src/lib/fonts.js` |
| Brain-atlas data | `public/assets/atlases/*` (shapes in `docs/SCHEMAS.md`) |
| Reusable component APIs + examples | `docs/PRIMITIVES.md` |

Do not edit `dist/` (build output) or `node_modules/`.
