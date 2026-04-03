---
id: monovlm-cvpr-2026
title: "MonoVLM: Monocular 3D Visual Grounding with Vision Language Models"
authors:
  - Huaizhi Qu
  - Hossein Nourkhiz Mahjoub
  - Vaishnav Tadiparthi
  - Kwonjoon Lee
  - Tianlong Chen
venue: CVPR
venueType: conference
year: 2026
status: accepted
isFirstAuthor: true
specialBadges:
  - First Author
links: {}
---

Vision-Language Models (VLMs) have demonstrated remarkable capabilities in instruction following and 2D visual understanding. However, state-of-the-art VLMs, including GPT-5, still struggle with 3D perception, particularly in tasks such as monocular 3D visual grounding. While specialized vision-only models excel in this domain, they often lack the rich semantic understanding inherent to VLMs. To bridge this gap, we propose MonoVLM, a novel triple-stage training framework that effectively enables VLMs with accurate monocular 3D grounding. The core of our method is a progressive training process, which utilizes Group Relative Policy Optimization (GRPO) to gradually teach the model to first localize the described object, then understand its 3D structure, and finally, perform accurate estimation. Comprehensive experiments show that MonoVLM models significantly outperform existing VLMs and even surpass the performance of specialized vision-only models. We validate our design via extensive comparisons and ablation studies.
