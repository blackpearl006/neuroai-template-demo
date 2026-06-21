#!/usr/bin/env python3
"""Convert BrainAge CSV fingerprint data → JSON for the web."""

import json
import pandas as pd
from config import FIGS, OUT_DATA as OUT, ROI_META_CSV, COHORTS, THRESHOLDS

OUT.mkdir(parents=True, exist_ok=True)

# ── regions.json ─────────────────────────────────────────────
roi_meta = pd.read_csv(ROI_META_CSV)

regions = []
for _, row in roi_meta.iterrows():
    regions.append({
        "id":           int(row["Index"]),
        "label":        str(row["Label"]),
        "subregion":    str(row["subregion_name"]),
        "region":       str(row["region"]),
        "our_network7": str(row["Our_7network"]),
        "our_network20":str(row["Our_20network"]),
        "hemi":         str(row["hemi"]),
    })
(OUT / "regions.json").write_text(json.dumps(regions, indent=2))
print(f"Wrote {len(regions)} regions → regions.json")

# ── fingerprints.json ─────────────────────────────────────────
ANALYSIS_DIRS = {
    "main":         FIGS / "Fig3_Fingerprints_main_cross-sectional/dataset_fingerprints",
    "left_hem":     FIGS / "Fig4_Fingerprints_hemishperical/left_hem_fingerprints",
    "right_hem":    FIGS / "Fig4_Fingerprints_hemishperical/right_hem_fingerprints",
    "female":       FIGS / "Fig5_Fingerprints_sex/female_fingerprints",
    "male":         FIGS / "Fig5_Fingerprints_sex/male_fingerprints",
    "caucasian":    FIGS / "supp/caucaisan_fingerprints",
    "longitudinal": FIGS / "supp/longitudinal_fingerprints",
}
fingerprints = {}
for analysis, directory in ANALYSIS_DIRS.items():
    fingerprints[analysis] = {}
    found = 0
    for cohort in COHORTS:
        counts_file = directory / f"{cohort}_roi_counts.csv"
        sig_file    = directory / f"{cohort}_significant.csv"
        if not counts_file.exists():
            print(f"  MISSING: {counts_file.name}")
            continue
        counts_df = pd.read_csv(counts_file, index_col=0)
        sig_df    = pd.read_csv(sig_file,    index_col=0)
        fingerprints[analysis][cohort] = {}
        for thresh in THRESHOLDS:
            if thresh not in counts_df.index:
                continue
            fingerprints[analysis][cohort][thresh] = {
                "counts": [int(x) for x in counts_df.loc[thresh].tolist()],
                "sig":    [int(x) for x in sig_df.loc[thresh].tolist()],
            }
        found += 1
    print(f"  {analysis}: {found} cohorts")

(OUT / "fingerprints.json").write_text(json.dumps(fingerprints, separators=(",",":")))
size_kb = (OUT / "fingerprints.json").stat().st_size // 1024
print(f"Wrote fingerprints.json ({size_kb} KB)")

# Per-analysis split files (the app lazy-loads fingerprints_<analysis>.json).
for analysis, data in fingerprints.items():
    (OUT / f"fingerprints_{analysis}.json").write_text(json.dumps(data, separators=(",", ":")))
print(f"Wrote {len(fingerprints)} per-analysis fingerprints_*.json files")
