#!/usr/bin/env python3
"""Generate parcellated atlas assets for the brain explorer.

For each configured atlas this produces, in MNI-mm space:
  public/assets/meshes/<key>.glb          parcellated surface mesh (nodes roi_<id>)
  public/assets/atlases/<key>.nii.gz      clean 3D integer label volume (NiiVue)
  public/assets/atlases/<key>.json        region metadata (id,name,x,y,z,...,score,sig)
and merges the atlas into public/assets/atlases/index.json.

Usage:
  python3 scripts/build-parcellation-meshes.py                # all configured
  python3 scripts/build-parcellation-meshes.py --only schaefer400
"""
import argparse, json, os, sys, hashlib, ssl, csv, io, tempfile, urllib.request
import certifi
import numpy as np
import nibabel as nib
from skimage import measure
import trimesh
from nilearn import datasets

SSL_CTX = ssl.create_default_context(cafile=certifi.where())
NEUROPARC = "https://raw.githubusercontent.com/neurodata/neuroparc/master/atlases/label/Human"

def _download(url):
    cache = os.path.join(tempfile.gettempdir(), "np_" + url.rsplit("/", 1)[-1])
    if not os.path.exists(cache):
        with urllib.request.urlopen(url, context=SSL_CTX) as r, open(cache, "wb") as f:
            f.write(r.read())
    return cache

def fetch_neuroparc(name, display):
    """AAL / Glasser etc. from neuroparc (MNI152NLin6 2mm) — avoids flaky hosts."""
    nii = _download(f"{NEUROPARC}/{name}_space-MNI152NLin6_res-2x2x2.nii.gz")
    txt = urllib.request.urlopen(f"{NEUROPARC}/Anatomical-labels-csv/{name}.csv", context=SSL_CTX).read().decode()
    names = {}
    for row in csv.reader(io.StringIO(txt)):
        if not row or not row[0].strip().lstrip("-").isdigit():
            continue
        i, nm = int(row[0]), (row[1].strip() if len(row) > 1 else "")
        if i != 0 and nm and nm.lower() != "null":
            names[i] = nm
    return nib.load(nii), names, display

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MESH_DIR = os.path.join(ROOT, "public/assets/meshes")
ATLAS_DIR = os.path.join(ROOT, "public/assets/atlases")
IMPORTANCE_PCT = 0.20
MAX_FACES_PER_PARCEL = 1200  # decimation cap to keep GLBs small
SPLIT_HEMI = {"glasser360"}  # atlases whose labels span both hemispheres

# ── Atlas fetchers ────────────────────────────────────────────────────────────
# Each returns: (nifti_img, {label_int: name}, display_label)

def _img(maps):
    return maps if isinstance(maps, nib.Nifti1Image) else nib.load(maps)

def fetch_schaefer400():
    a = datasets.fetch_atlas_schaefer_2018(n_rois=400, yeo_networks=7, resolution_mm=2)
    names = {i + 1: n.decode() if isinstance(n, bytes) else n for i, n in enumerate(a["labels"])}
    return _img(a["maps"]), names, "Schaefer-400"

def fetch_aal():
    a = datasets.fetch_atlas_aal()
    names = {int(idx): lab for idx, lab in zip(a["indices"], a["labels"])}
    return _img(a["maps"]), names, "AAL-116"

def fetch_harvard_oxford():
    a = datasets.fetch_atlas_harvard_oxford("cort-maxprob-thr25-2mm")
    labels = a["labels"]  # index 0 == 'Background'
    names = {i: labels[i] for i in range(1, len(labels))}
    return _img(a["maps"]), names, "Harvard-Oxford"

def fetch_yeo7():
    a = datasets.fetch_atlas_yeo_2011()
    names = {i: f"7Networks_{i}" for i in range(1, 8)}
    return _img(a["thick_7"]), names, "Yeo-7"

ATLASES = {
    "schaefer400":    fetch_schaefer400,
    "harvard_oxford": fetch_harvard_oxford,
    "yeo7":           fetch_yeo7,
    "aal116":         lambda: fetch_neuroparc("AAL", "AAL-116"),
    "glasser360":     lambda: fetch_neuroparc("Glasser", "Glasser-360"),
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def seeded_scores(key, n):
    rng = np.random.default_rng(int(hashlib.md5(key.encode()).hexdigest()[:8], 16))
    return rng.random(n)

def hemi_from_x(x, name=""):
    nm = name.upper()
    if "LH" in nm or name.endswith("_L") or ".L" in nm: return "L"
    if "RH" in nm or name.endswith("_R") or ".R" in nm: return "R"
    return "L" if x < 0 else "R"

def network_from_name(name):
    # Schaefer: 7Networks_LH_Vis_1 → "Vis"; else None
    parts = name.replace("7Networks_", "").split("_")
    if len(parts) >= 3 and parts[0] in ("LH", "RH"):
        return parts[1]
    return None

def build_atlas(key, fetch):
    print(f"\n▶ {key}")
    img, names, display = fetch()
    data = np.asarray(img.dataobj)
    data = np.squeeze(data).round().astype(np.int32)
    affine = img.affine
    labels = [int(l) for l in np.unique(data) if l != 0]

    # Some atlases (e.g. neuroparc Glasser) label both hemispheres with the same
    # value. Split each label into L/R by world-x so parcels are per-hemisphere.
    ii, jj, kk = np.indices(data.shape)
    worldx = affine[0, 0] * ii + affine[0, 1] * jj + affine[0, 2] * kk + affine[0, 3]
    parcels = []  # (out_id, name, mask)
    for lab in labels:
        base = data == lab
        nm = names.get(lab, f"region_{lab}")
        if key in SPLIT_HEMI:
            for idoff, side, expr in ((0, "L", worldx < 0), (10000, "R", worldx >= 0)):
                m = base & expr
                if m.sum() > 10:
                    parcels.append((lab + idoff, f"{nm}_{side}", m))
        else:
            parcels.append((lab, nm, base))
    print(f"  {len(labels)} labels → {len(parcels)} parcels · volume {data.shape}")

    # 1) clean 3D label volume for NiiVue
    os.makedirs(ATLAS_DIR, exist_ok=True)
    os.makedirs(MESH_DIR, exist_ok=True)
    nib.save(nib.Nifti1Image(data.astype(np.int16), affine), os.path.join(ATLAS_DIR, f"{key}.nii.gz"))

    # 2) mesh per parcel + centroid metadata
    scene = trimesh.Scene()
    regions = []
    scores = seeded_scores(key, len(parcels))
    for i, (pid, nm, mask) in enumerate(parcels):
        # pad so border parcels are closed surfaces
        padded = np.pad(mask.astype(np.float32), 1)
        try:
            verts, faces, _, _ = measure.marching_cubes(padded, level=0.5)
        except (ValueError, RuntimeError):
            continue
        verts -= 1.0  # undo pad
        # voxel (i,j,k) → MNI mm
        verts_mni = nib.affines.apply_affine(affine, verts)
        m = trimesh.Trimesh(vertices=verts_mni, faces=faces, process=True)
        trimesh.smoothing.filter_taubin(m, iterations=8)
        if len(m.faces) > MAX_FACES_PER_PARCEL:
            m = m.simplify_quadric_decimation(face_count=MAX_FACES_PER_PARCEL)
        scene.add_geometry(m, node_name=f"roi_{pid}", geom_name=f"roi_{pid}")
        cx, cy, cz = (float(v) for v in m.centroid)
        regions.append({
            "id": int(pid), "name": nm,
            "x": round(cx, 1), "y": round(cy, 1), "z": round(cz, 1),
            "lobe": "NA", "hemi": hemi_from_x(cx, nm),
            "network": network_from_name(nm),
            "score": round(float(scores[i]), 4),
        })

    # 3) top-20% importance flag
    cutoff = np.quantile([r["score"] for r in regions], 1 - IMPORTANCE_PCT)
    for r in regions:
        r["sig"] = 1 if r["score"] > cutoff else 0

    scene.export(os.path.join(MESH_DIR, f"{key}.glb"))
    json.dump({"key": key, "label": display, "count": len(regions), "regions": regions},
              open(os.path.join(ATLAS_DIR, f"{key}.json"), "w"))
    glb_mb = os.path.getsize(os.path.join(MESH_DIR, f"{key}.glb")) / 1e6
    print(f"  ✓ {len(regions)} regions · {sum(r['sig'] for r in regions)} important · {glb_mb:.1f}MB glb")
    return {"key": key, "label": display, "count": len(regions),
            "render": "mesh", "mesh": f"{key}.glb", "volume": f"{key}.nii.gz"}

def merge_index(entries):
    path = os.path.join(ATLAS_DIR, "index.json")
    index = json.load(open(path)) if os.path.exists(path) else []
    # normalise existing entries (node atlases) to the new schema
    for e in index:
        e.setdefault("render", "mesh" if e.get("hasMesh") else "nodes")
        e.setdefault("mesh", "atlas.glb" if e.get("hasMesh") else None)
        e.setdefault("volume", None)
        e.pop("hasMesh", None)
    by_key = {e["key"]: e for e in index}
    for e in entries:
        by_key[e["key"]] = {**by_key.get(e["key"], {}), **e}
    # mesh/parcellated atlases first, then node atlases
    out = sorted(by_key.values(), key=lambda e: (e["render"] != "mesh", e["label"]))
    json.dump(out, open(path, "w"), indent=2)
    print(f"\nindex.json → {len(out)} atlases ({sum(e['render']=='mesh' for e in out)} parcellated)")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated atlas keys")
    args = ap.parse_args()
    keys = args.only.split(",") if args.only else list(ATLASES)
    entries = [build_atlas(k, ATLASES[k]) for k in keys]
    merge_index(entries)
