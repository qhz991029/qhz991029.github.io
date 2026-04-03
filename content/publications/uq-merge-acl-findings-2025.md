---
id: uq-merge-acl-findings-2025
title: "UQ-Merge: Uncertainty Guided Multimodal Large Language Model Merging"
authors:
  - Huaizhi Qu
  - Xinyu Zhao
  - Jie Peng
  - Kwonjoon Lee
  - Behzad Dariush
  - Tianlong Chen
venue: ACL Findings
venueType: conference
year: 2025
status: published
isFirstAuthor: true
specialBadges:
  - First Author
links:
  paper: "https://aclanthology.org/2025.findings-acl.73/"
---

Multimodal Large Language Models have gained increasing popularity as a promising framework for leveraging strong language reasoning capabilities in the vision-language domain. Given a wide range of MLLMs, model merging potentially offers a cheap way to aggregate their diverse knowledge into a single model. However, directly plugging in existing model merging approaches often leads to suboptimal performance due to the inclusion of harmful over-confident models and the lack of specialized designs for vision-language inputs. To tackle these pain points, we conduct pioneering investigations into the merging procedure and propose UQ-Merge, an uncertainty-guided MLLM merging algorithm that identifies beneficial candidates for merging, determines the merging order and number of helpful candidates, and performs appropriate merging. Within our framework, we consider uncertainty quantification on both text and vision inputs to examine MLLM prediction confidence, and then decide whether and when a model should be included. Extensive experiments consistently demonstrate superior merging performance on both held-in and held-out vision-language benchmarks.
