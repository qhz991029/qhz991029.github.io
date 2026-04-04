---
id: multi-agent-debate-neurips-2025
title: "Multi-Agent Debate for LLM Judges with Adaptive Stability Detection"
authors:
  - Tianyu Hu
  - Zhen Tan
  - Song Wang
  - Huaizhi Qu
  - Tianlong Chen
venue: NeurIPS
venueType: conference
year: 2025
status: published
links:
  paper: "https://neurips.cc/virtual/2025/loc/san-diego/poster/117644"
  code: "https://github.com/tyrionhuu/Multi-LLM-Debate"
---

With advancements in reasoning capabilities, Large Language Models (LLMs) are increasingly employed for automated judgment tasks. While LLMs-as-Judges offer promise in automating evaluations, current approaches often rely on simplistic aggregation methods such as majority voting, which can fail even when individual agents provide correct answers. To address this, we propose a multi-agent debate judge framework where agents collaboratively reason and iteratively refine their responses. We formalize the debate process mathematically, analyze agent interactions, and show that debate amplifies correctness compared to static ensembles. To enhance efficiency, we introduce a stability detection mechanism that models judge consensus dynamics via a time-varying Beta-Binomial mixture, with adaptive stopping based on distributional similarity. Experiments across multiple benchmarks and models demonstrate that our framework improves judgment accuracy over majority voting while maintaining computational efficiency.
