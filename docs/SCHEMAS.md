# Data schemas

The brain explorer reads a small set of JSON files from `public/assets/atlases/`.
All 15 atlases ship pre-generated, so you only touch these if you want to add or
regenerate an atlas (an advanced, Python step — see `scripts/build-parcellation-meshes.py`
and `scripts/build-atlases.mjs`). For everyday editing you never open these files;
edit `content/` instead (see `AGENTS.md`).

## `index.json`

The atlas picker. An array, one object per atlas:

```json
[
  {
    "key": "brainnetome",
    "label": "Brainnetome (246)",
    "count": 246,
    "render": "mesh",
    "mesh": "atlas.glb",
    "volume": null
  }
]
```

| Field | Type | Meaning |
|---|---|---|
| `key` | string | atlas id; also the basename of `<key>.json` and `<key>_glass.png` |
| `label` | string | display name in the picker |
| `count` | int | number of regions |
| `render` | `"mesh"` / `"nodes"` | parcellated surface mesh vs. coordinate node cloud |
| `mesh` | string \| null | `.glb` filename in `public/assets/atlases/` (for `render: "mesh"`) |
| `volume` | string \| null | `.nii.gz` label volume, if a NiiVue "volume" compare view is available |

## `<key>.json` (one per atlas)

```json
{
  "key": "yeo7",
  "label": "Yeo-7",
  "count": 7,
  "regions": [
    { "id": 1, "name": "7Networks_1", "x": 2.4, "y": -72.5, "z": 3.9,
      "lobe": "NA", "hemi": "R", "network": null, "score": 0.0489, "sig": 0 }
  ]
}
```

Each entry in `regions` (in atlas index order, length = `count`):

| Field | Type | Meaning |
|---|---|---|
| `id` | int | 1-based ROI index (matches mesh node `roi_<id>`) |
| `name` | string | region label |
| `x`, `y`, `z` | number | MNI coordinates (used to place node atlases in the brain shell) |
| `lobe` | string | lobe name, or `"NA"` |
| `hemi` | `"L"` / `"R"` | hemisphere |
| `network` | string \| null | network assignment, if any |
| `score` | number 0–1 | importance / saliency (drives colour + the table's bar) |
| `sig` | `0` / `1` | `1` = flagged important (the "important only" filter + ✓) |

The demo ships placeholder `score`/`sig` values. Replace them with your own
attribution when you regenerate an atlas.

## Companion assets (in `public/assets/atlases/`)

| Path | What |
|---|---|
| `<key>.glb` | 3D surface mesh, nodes named `roi_1`…`roi_N` (for `render: "mesh"`) |
| `<key>.nii.gz` | label volume for the optional NiiVue "volume" view |
| `<key>_glass.png` | pre-rendered nilearn glass-brain projection (the fast 2D view + hero figure) |

## Content data (the files you actually edit)

These live in `content/`, not `public/`, and are parsed by `src/lib/content.js`:

| File | Shape | Feeds |
|---|---|---|
| `stats.csv` | `stat,label,detail` | Abstract stat cards |
| `metrics.csv` | `stat,label,detail` | Results metric cards |
| `results-table.csv` | free columns (first is left-aligned, rest right) | Results `<DataTable>` |
| `chart-mae.csv`, `chart-lobes.csv` | wide: first column = category, each other column = a series | Results `<BarChart>` (grouped / stacked) |
| `links.csv` | `label,href,desc,icon` | Resources link grid |
