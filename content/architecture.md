---
eyebrow: "Model"
title: "A compact 3D-CNN for fluid reasoning"
lede: "MorphoNet-18, a 3D residual network, reads a whole-brain T1 MRI and regresses a single predicted reasoning score — roughly 3M parameters, trainable on a single GPU."
# Architecture figure — drop your own image in /public and point to it here
# (PNG / JPG / SVG). Any figure works: CNN, transformer, diffusion, whatever.
figure: "assets/architecture.svg"
caption: "MorphoNet-18: six residual Conv→BatchNorm→ReLU→MaxPool blocks progressively halve the volume while deepening the channels, then global average pooling and a fully-connected head regress a single fluid-reasoning score."
---
