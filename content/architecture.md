---
eyebrow: "Model"
title: "A compact 3D-CNN for brain age"
lede: "An SFCN-style network reads a whole-brain T1 MRI and regresses a single predicted age — roughly 3M parameters, trainable on a single GPU. The diagram below is generated from the numbers in this file, so there's no image to maintain."
diagram:
  input: "T1 MRI · 182³"
  output: "Brain age (yrs)"
  stages:
    - { ch: 32, fmap: "91³" }
    - { ch: 64, fmap: "45³" }
    - { ch: 128, fmap: "22³" }
    - { ch: 256, fmap: "11³" }
    - { ch: 256, fmap: "5³" }
    - { ch: 64, fmap: "5³" }
---
