---
eyebrow: "Model"
title: "A compact 3D-CNN for brain age"
lede: "An SFCN-style network reads a whole-brain T1 MRI and regresses a single predicted age — roughly 3M parameters, trainable on a single GPU."
# Architecture figure — drop your own image in /public and point to it here
# (PNG / JPG / SVG). Any figure works: CNN, transformer, diffusion, whatever.
figure: "assets/architecture.svg"
caption: "SFCN: six Conv→BatchNorm→ReLU→MaxPool blocks progressively halve the volume while deepening the channels, then global average pooling and a fully-connected head regress a single brain-age value."
---
