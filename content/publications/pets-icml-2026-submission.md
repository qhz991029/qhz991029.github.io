---
id: pets-icml-2026-submission
title: "PETS: A Principled Framework Towards Optimal Trajectory Allocation for Efficient Test-Time Self-Consistency"
authors:
  - Huaizhi Qu
  - Zhangyi Liu
  - Xiaowei Yin
  - He Sun
  - Yanjun Han
  - Tianlong Chen
  - Zhun Deng
venue: Preprint
venueType: preprint
year: 2026
status: preprint
isCoFirst: true
coFirstAuthors:
  - Huaizhi Qu
  - Zhangyi Liu
  - Xiaowei Yin
coFirstNote: "sorted alphabetically"
specialBadges:
  - Under Review
  - Co-First
links:
  arxiv: "https://arxiv.org/abs/2602.16745"
---

Test-time scaling can improve model performance by aggregating stochastic reasoning trajectories. However, achieving sample-efficient test-time self-consistency under a limited budget remains an open challenge. We introduce PETS, which initiates a principled study of trajectory allocation through an optimization framework. Central to our approach is the self-consistency rate, a new measure defined as agreement with the infinite-budget majority vote. This formulation makes sample-efficient test-time allocation theoretically grounded and amenable to rigorous analysis. We study both offline and online settings. In the offline regime, we connect trajectory allocation to crowdsourcing and derive theoretical guarantees with an efficient majority-voting-based allocation algorithm. In the online regime, we propose an adaptive method inspired by the offline framework. Experiments show that PETS consistently outperforms uniform allocation while significantly reducing sampling budget.
