---
eyebrow: "Overview"
title: "Reading fluid reasoning from structural MRI"
lede: "Fluid reasoning — the ability to solve novel problems without leaning on prior knowledge — varies widely between people, and some of that variance is written into brain anatomy. We train a single, compact 3D residual CNN on 9,340 healthy T1 scans and ask not only how accurately it predicts a normed reasoning score, but which regions it reads to get there."
---
### A lifespan model from raw anatomy

We pool **9,340 T1-weighted scans** from eight publicly available cohorts
(8–85 years, both sexes, four continents) and train one MorphoNet-18 residual
network to regress a normed fluid-reasoning score directly from a minimally
preprocessed volume — no hand-engineered features, no regional averaging.

### Where the signal lives

Using integrated-gradients saliency projected onto the **Brainnetome atlas**, we
find the prediction is carried by a stable set of regions in association cortex,
lateral prefrontal cortex and key subcortical structures. The same regions surface
across alternative parcellations (Schaefer, AAL, Glasser), suggesting the signal
is anatomical rather than an artefact of one atlas.
