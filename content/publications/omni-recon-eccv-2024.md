---
id: omni-recon-eccv-2024
title: "Omni-Recon: Advocating a Pretrain-Bake-Finetune Paradigm towards Foundation Neural Radiance Fields"
authors:
  - Yonggan Fu
  - Huaizhi Qu
  - Zhifan Ye
  - Chaojian Li
  - Yingyan Celine Lin
venue: ECCV
venueType: conference
year: 2024
status: published
specialBadges:
  - Oral
links:
  arxiv: "https://arxiv.org/abs/2403.11131"
---

Recent breakthroughs in Neural Radiance Fields have sparked significant demand for their integration into real-world 3D applications. However, the varied functionalities required by different 3D applications often necessitate diverse NeRF models with various pipelines, leading to tedious NeRF training for each target task and cumbersome trial-and-error experiments. Drawing inspiration from the generalization capability and adaptability of emerging foundation models, this work develops one general-purpose NeRF for handling diverse 3D tasks. Omni-Recon supports generalizable 3D reconstruction and zero-shot multitask scene understanding, and also adapts to downstream 3D applications such as real-time rendering and scene editing. Its key insight is that an image-based rendering pipeline with accurate geometry and appearance estimation can lift 2D image features into their 3D counterparts, thus extending widely explored 2D tasks to the 3D world in a generalizable manner.
