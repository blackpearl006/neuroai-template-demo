---
eyebrow: "Overview"
title: "Reading age from structural MRI"
lede: "Brain age — the age a model predicts from anatomy alone — is a compact marker of brain health. We train a single, compact 3D-CNN on 12,480 healthy T1 scans and ask not only how accurately it predicts age, but which regions it reads to get there."
---
### A lifespan model from raw anatomy

We pool **12,480 T1-weighted scans** from eight publicly available cohorts
(6–94 years, both sexes, four continents) and train one Simple Fully
Convolutional Network to regress chronological age directly from a minimally
preprocessed volume — no hand-engineered features, no regional averaging.

### Where the signal lives

Using integrated-gradients saliency projected onto the **Brainnetome atlas**, we
find the prediction is carried by a stable set of regions in association cortex,
medial temporal lobe and key subcortical structures. The same regions surface
across alternative parcellations (Schaefer, AAL, Glasser), suggesting the signal
is anatomical rather than an artefact of one atlas.
