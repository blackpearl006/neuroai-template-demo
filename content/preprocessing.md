---
eyebrow: "Data"
title: "From raw scan to model input"
lede: "Every cohort goes through the same light, standard pipeline — bias correction, brain extraction, linear registration to MNI and white-matter intensity normalisation — so a scan from any site reaches the network in the same space."
steps: ["Bias correction", "Brain extraction", "Linear registration", "WM normalisation"]
# Before/after figure (files live in /public). Swap for your own pair —
# use two images of the SAME view/size so the slider aligns.
before: "assets/preprocessing/bias_corrected.png"
after: "assets/preprocessing/brain.png"
beforeLabel: "With skull"
afterLabel: "Skull-stripped"
caption: "The same sagittal slice, with the skull, face and neck (left) and after brain extraction (right) — the volume the model actually sees. Drag the handle to compare."
---
