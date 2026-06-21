"""Central configuration for the asset-generation pipeline.

Edit the INPUT paths below (or set the matching environment variables) to point at
YOUR data, then run the scripts. Outputs always land inside the repo's
public/assets/ — leave those as-is. Keep COHORTS/ANALYSES/THRESHOLDS in sync with
`taxonomy` in src/site.config.js.

    BRAINAGE_ROOT=/data/BrainAge ATLAS_NII=/data/atlas.nii.gz python scripts/build_data.py
"""
import os
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PUBLIC_ASSETS = REPO / "public" / "assets"


def _path(env, default):
    return Path(os.environ.get(env, default))


# ── INPUTS (point these at your own data) ─────────────────────────────────────
# Root holding the per-cohort fingerprint CSVs (counts + significance).
BRAINAGE_ROOT = _path("BRAINAGE_ROOT", "/path/to/BrainAge")
FIGS = BRAINAGE_ROOT / "3. Figures and tables/indiviual_figure_files"
# ROI metadata CSV (Index, Label, subregion_name, region, Our_7network, Our_20network, hemi).
ROI_META_CSV = _path("ROI_META_CSV", str(BRAINAGE_ROOT / "8. others/brainnetome_ours.csv"))
# Labelled atlas volume (integer ROI ids), used to paint glass-brain figures.
ATLAS_NII = _path("ATLAS_NII", "/path/to/brainnetome_atlas.nii.gz")
# A single MNI-space T1 volume for slice renders.
NORMALISED_NII = _path("NORMALISED_NII", "/path/to/normalised.nii.gz")
# Folder of FSL preprocessing-stage NIfTIs.
FSL_PREPROC_DIR = _path("FSL_PREPROC_DIR", "/path/to/preprocessing-FSL")

# ── OUTPUTS (inside the repo — do not change) ─────────────────────────────────
OUT_DATA = PUBLIC_ASSETS / "data"
OUT_FIGURES = PUBLIC_ASSETS / "figures"
OUT_SLICES = PUBLIC_ASSETS / "slices"
OUT_PREPROCESSING = PUBLIC_ASSETS / "preprocessing"

# ── TAXONOMY (mirror src/site.config.js → taxonomy) ───────────────────────────
COHORTS = ["ADNI", "OASIS3", "MAYO", "CAMCAN", "SALD", "SRPBS", "BrainLat", "ABIL"]
ANALYSES = ["main", "longitudinal", "female", "male", "left_hem", "right_hem", "caucasian"]
THRESHOLDS = ["top_5_perc_rois", "top_10_perc_rois", "top_15_perc_rois", "top_20_perc_rois"]
