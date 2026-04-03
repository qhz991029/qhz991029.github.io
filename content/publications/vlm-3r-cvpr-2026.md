---
id: vlm-3r-cvpr-2026
title: "VLM-3R: Vision-Language Models Augmented with Instruction-Aligned 3D Reconstruction"
authors:
  - Zhiwen Fan
  - Jian Zhang
  - Renjie Li
  - Junge Zhang
  - Runjin Chen
  - Hezhen Hu
  - Kevin Wang
  - Huaizhi Qu
  - Dilin Wang
  - Zhicheng Yan
  - Hongyu Xu
  - Justin Theiss
  - Tianlong Chen
  - Jiachen Li
  - Zhengzhong Tu
  - Zhangyang Wang
  - Rakesh Ranjan
venue: CVPR
venueType: conference
year: 2026
status: accepted
links:
  arxiv: "https://arxiv.org/abs/2505.20279"
  code: "https://github.com/VITA-Group/VLM-3R"
---

The rapid advancement of Large Multimodal Models (LMMs) for 2D images and videos has motivated extending these models to understand 3D scenes, aiming for human-like visual-spatial intelligence. Nevertheless, achieving deep spatial understanding comparable to human capabilities poses significant challenges in model encoding and data acquisition. Existing methods frequently depend on external depth sensors for geometry capture or utilize off-the-shelf algorithms for pre-constructing 3D maps, thereby limiting their scalability, especially with prevalent monocular video inputs and for time-sensitive applications. In this work, we introduce VLM-3R, a unified framework for Vision-Language Models that incorporates 3D reconstructive instruction tuning. VLM-3R processes monocular video frames by employing a geometry encoder to derive implicit 3D tokens that represent spatial understanding. Leveraging our Spatial-Visual-View Fusion and over 200K curated 3D reconstructive instruction tuning question-answer pairs, VLM-3R effectively aligns real-world spatial context with language instructions. This enables monocular 3D spatial assistance and embodied reasoning. To facilitate the evaluation of temporal reasoning, we introduce the Vision-Spatial-Temporal Intelligence benchmark, featuring over 138.6K QA pairs across five distinct tasks focused on evolving spatial relationships. Extensive experiments demonstrate that VLM-3R not only facilitates robust visual-spatial reasoning but also enables the understanding of temporal 3D context changes, excelling in both accuracy and scalability.
