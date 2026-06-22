# AGENTS.md — adapting this template to a new paper

You are an AI agent (Claude Code, Cursor, Copilot, …) tasked with turning this
**NeuroAI paper template** into a finished website for a specific paper. This file
is your runbook. Work in **two phases**: an autonomous first pass, then a human
review gate. Optimise for *correctness over completeness* — a scientific site with
a wrong number is worse than one with a clearly-marked `TODO`.

> Humans can do all of this by hand too (see `README.md`). This file just lets you
> do the heavy lifting and hand back a reviewable result.

---

## 0. Golden rules (read first)

1. **Never invent numbers, results, citations, or claims.** Copy them verbatim from
   the source paper, or insert `TODO(author): …`. This is non-negotiable.
2. **Edit `content/config.yml` first and most.** ~80% of customization is there.
   Avoid touching component internals unless a section genuinely needs new structure.
3. **Keep the build green.** Run `npm run build` after each meaningful change.
4. **Don't delete** the minimal variant, the showcase section, or scaffolding/components.
5. **Disable, don't destroy.** To remove a section, set `enabled: false` in
   `config.sections` — don't delete the component.
6. **Preserve accessibility & meta** (alt text, headings, OG tags, favicon).
7. Make small, reviewable commits with clear messages.

---

## 1. Collect inputs

Ask the user for (or locate in the repo) as many as available:

- **Paper**: PDF / abstract / arXiv link / title + author list + affiliation.
- **Links**: preprint/DOI, code repo, model weights, processed data.
- **Figures**: any PNG/SVG figures, glass-brain images, architecture diagrams.
- **Brain assets** (optional): NIfTI volume(s) `.nii.gz`, an atlas mesh `.glb`,
  an atlas + ROI metadata CSV, ROI attribution / significance CSVs, preprocessing stages.
- **Media** (optional): demo videos / GIFs.
- **Deploy target**: the GitHub repo name (decides nothing — base path is `"./"`).

If the user gives only a PDF, extract title/authors/abstract/links/figure captions
from it. **Do not** fabricate missing data — mark `TODO`.

---

## 2. Decision tree — which sections to keep

For each, decide keep / customize / disable and set `config.sections[].enabled`:

| Question about the paper | If yes | If no |
|---|---|---|
| Has ROI-level attribution/significance per cohort? | keep `playground` + `comparisons`; fill `taxonomy` + regenerate data (§4) | disable both |
| Describes a preprocessing pipeline with volumes? | keep `preprocessing`; supply NIfTI stages | disable |
| Has 3D volumes / atlas meshes to show? | use `BrainRenderer`/`BrainGrid` in a section | use static figure images |
| Has a healthy-vs-patient or before/after contrast? | add a `CompareSlider` | — |
| Has equations central to the method? | use `<Math>` in `methods` | plain prose |
| Has code worth showing? | use `<CodeBlock>` | — |
| Always | keep `hero`, `abstract`, `resources`; fill from paper | |

The `methods` and `preprocessing` sections are narrative — rewrite their prose to the
paper. The `showcase` section is a toolbox demo; disable it for the published site
(`enabled: false`) unless the user wants it.

---

## 3. Phase 1 — autonomous first pass (edit `content/config.yml`)

1. **identity**: `title` (+ pick an `titleAccent` word that appears in the title),
   `tagline` (one plain-language sentence), `eyebrow`, `authors`, `institution`,
   `year`, `repoUrl`.
2. **meta**: `title`, `description`, `url` (the Pages URL), `twitter`, keep `ogImage`
   (replace `/public/og-image.png` with the paper's hero figure if provided).
3. **theme / fonts / fontScale**: pick to match the paper's field/venue. Default
   light+editorial is safe; `apple` font + `light` is the cleanest neutral choice.
4. **sections**: set the enabled set per §2.
5. **content.hero / content.abstract / content.resources**: fill verbatim from the
   paper. Stats must come from the paper; otherwise `TODO(author)`.
6. **taxonomy** (only if keeping the explorer): set `cohorts`, `analyses`,
   `thresholds`, `roiCount`, `atlasName` to match the provided data.
7. **Narrative sections**: edit `src/sections/03-Methods.jsx` (the `STEPS` array +
   prose) and `src/sections/04-Preprocessing.jsx` to the paper. Use `<Math>`,
   `<CodeBlock>`, `<DataTable>`, `<CompareSlider>`, `<BrainRenderer>`, `<BrainGrid>`
   as needed (API in `docs/PRIMITIVES.md`).
8. **Assets**: drop the paper's images into `public/assets/…` and reference them with
   repo-relative paths (the renderer prefixes the base path).
9. **Data** (if applicable): regenerate per §4.
10. **index.html / favicon**: meta is auto-injected from `config.meta`; replace
    `public/favicon.svg` if the user has branding.

After each step run `npm run build`; fix errors before moving on.

---

## 4. Regenerate data assets (only if the paper has ROI data)

Inputs and JSON shapes are documented in `docs/SCHEMAS.md`. Edit `scripts/config.py`
(paths + cohort/analysis lists), then:

```bash
pip install -r scripts/requirements.txt
python scripts/build_data.py          # regions.json + fingerprints*.json
python scripts/make_figures.py        # per-cohort glass-brain PNGs
python scripts/gen_brain_slices.py    # slice PNGs (optional, for grids)
python scripts/prep_preprocessing_assets.py  # downsampled NIfTI stages
```

`roiCount` in `config.taxonomy` **must** equal the array lengths in your
`fingerprints` JSON. If you cannot run the scripts (no data), leave the shipped demo
assets, disable the explorer sections, and tell the user.

---

## 5. Phase 2 — hand back a review checklist

Present this to the human and **wait for sign-off** before deploying:

- [ ] Title, authors, affiliation, year correct.
- [ ] Every stat / number / claim verified against the paper (no fabrications; all `TODO`s resolved or flagged).
- [ ] Links (preprint, code, weights, data) point to real URLs.
- [ ] Citation / BibTeX correct.
- [ ] Section set correct; disabled sections intentional.
- [ ] Theme/font/scale look right; `npm run dev` reviewed on mobile + desktop widths.
- [ ] Social card (`og-image.png`) and favicon updated.
- [ ] `npm run build` passes; `?variant=minimal` still renders.
- [ ] `deploy.basePath` correct for the target (default `"./"` is usually right).

---

## 6. Deploy

```bash
npm run build         # final check
git add -A && git commit -m "content: adapt template to <paper>" && git push origin main
```

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to Pages. Confirm
the Actions run is green and the live URL renders. (Pages source must be set to
**GitHub Actions** in repo settings — a one-time human step.)

---

## 7. Where things live (quick map)

| Need to change… | File |
|---|---|
| Title, authors, links, theme, fonts, sections, hero/abstract/resources text | `content/config.yml` |
| Methods / Preprocessing narrative | `src/sections/03-Methods.jsx`, `src/sections/04-Preprocessing.jsx` |
| Colour themes / font pairings | `src/lib/themes.js`, `src/lib/fonts.js` |
| Fingerprint-explorer data | `public/assets/data/*.json` (regenerate via `scripts/`) |
| Primitive APIs + examples | `docs/PRIMITIVES.md` |
| Data JSON shapes | `docs/SCHEMAS.md` |

Do not edit `dist/` (build output) or `node_modules/`.
