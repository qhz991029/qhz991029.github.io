---
id: betaconform-neurips-2025
title: "BetaConform: Efficient MAP Estimation of LLM Ensemble Judgment Performance with Prior Transfer"
authors:
  - Huaizhi Qu
  - Inyoung Choi
  - Zhen Tan
  - Song Wang
  - Sukwon Yun
  - Qi Long
  - Faizan Siddiqui
  - Kwonjoon Lee
  - Tianlong Chen
venue: NeurIPS
venueType: conference
year: 2025
status: published
isFirstAuthor: true
specialBadges:
  - First Author
links:
  arxiv: "https://arxiv.org/abs/2504.12589"
---

LLM ensembles are widely used for LLM judges. However, how to estimate their accuracy, especially in an efficient way, is unknown. In this paper, we present a principled maximum a posteriori (MAP) framework for an economical and precise estimation of the performance of LLM ensemble judgment. We first propose a mixture of Beta-Binomial distributions to model the judgment distribution, revising the vanilla Binomial distribution. Next, we introduce a conformal prediction-driven approach that enables adaptive stopping during iterative sampling to balance accuracy with efficiency. Furthermore, we design a prior transfer mechanism that utilizes learned distributions on open-source datasets to improve estimation on a target dataset when only scarce annotations are available. Finally, we present BetaConform, a framework that integrates our distribution assumption, adaptive stopping, and the prior transfer mechanism to deliver a theoretically guaranteed distribution estimation of LLM ensemble judgment with minimum labeled samples. BetaConform is also validated empirically. For instance, with only 10 samples from the TruthfulQA dataset, for a Llama ensembled judge, BetaConform gauges its performance with error margin as small as 3.37%.
