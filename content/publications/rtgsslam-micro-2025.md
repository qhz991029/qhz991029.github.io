---
id: rtgsslam-micro-2025
title: "RTGSSLAM: An Edge GPU Plug-in for Real-Time 3D Gaussian Splatting-based SLAM Systems"
authors:
  - Leshu Li
  - Jiayin Qin
  - Jie Peng
  - Zishen Wan
  - Huaizhi Qu
  - Ye Han
  - Pingqing Zheng
  - Hongsen Zhang
  - Tianlong Chen
  - Yang Zhao
venue: MICRO
venueType: conference
year: 2025
status: published
links:
  arxiv: "https://arxiv.org/abs/2510.06644"
---

3D Gaussian Splatting based SLAM systems can largely benefit from state-of-the-art rendering efficiency and accuracy, but have not yet been broadly adopted in resource-constrained edge devices due to insufficient speed. Addressing this, the work identifies notable redundancies across the SLAM pipeline for acceleration. It introduces an algorithm-hardware co-design framework that comprehensively reduces these redundancies for real-time 3DGS-SLAM on edge. On the algorithm side, it removes redundant Gaussians and pixels by reusing existing computations. On the hardware side, it introduces streaming, scheduling, and buffer designs that reduce imbalance and memory access overhead. Integrated into an edge GPU, the resulting system achieves real-time performance on multiple datasets and algorithms with substantial energy-efficiency gains and negligible quality loss.
