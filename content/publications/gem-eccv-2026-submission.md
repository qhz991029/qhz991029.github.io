---
id: gem-eccv-2026-submission
title: "GEM: 3D Gaussian Splatting for Efficient and Accurate Cryo-EM Reconstruction"
authors:
  - Huaizhi Qu
  - Xiao Wang
  - Gengwei Zhang
  - Jie Peng
  - Tianlong Chen
venue: Preprint
venueType: preprint
year: 2026
status: preprint
isFirstAuthor: true
specialBadges:
  - Under Review
  - First Author
links:
  arxiv: "https://arxiv.org/abs/2509.25075"
  code: "https://github.com/UNITES-Lab/GEM"
---

Cryo-electron microscopy has become a central tool for high-resolution structural biology, yet the massive scale of datasets often renders 3D reconstruction both computationally expensive and memory intensive. Traditional Fourier-space methods are efficient but lose fidelity due to repeated transforms, while recent real-space approaches based on neural radiance fields improve accuracy but incur cubic memory and computation overhead. We introduce GEM, a novel cryo-EM reconstruction framework built on 3D Gaussian Splatting that operates directly in real space while maintaining high efficiency. Instead of modeling the entire density volume, GEM represents proteins with compact 3D Gaussians, each parameterized by only 11 values. To further improve training efficiency, we design a novel gradient computation for the Gaussians that contribute to each voxel, substantially reducing both memory footprint and training cost. On standard cryo-EM benchmarks, GEM achieves faster training and lower memory usage than prior methods while improving local resolution.
