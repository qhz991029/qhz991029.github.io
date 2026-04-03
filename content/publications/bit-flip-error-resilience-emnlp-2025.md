---
id: bit-flip-error-resilience-emnlp-2025
title: "Bit-Flip Error Resilience in LLMs: A Comprehensive Analysis and Defense Framework"
authors:
  - Yuhang Chen
  - Zhen Tan
  - Ajay Jaiswal
  - Huaizhi Qu
  - Xinyu Zhao
  - Qi Lin
  - Yu Cheng
  - Andrew Kwong
  - Zhichao Cao
  - Tianlong Chen
venue: EMNLP
venueType: conference
year: 2025
status: published
links:
  paper: "https://aclanthology.org/2025.emnlp-main.528/"
---

Bit-flip errors (BFEs) are hardware faults where individual bits in memory or processing units are unintentionally flipped. These errors pose a significant threat to neural network reliability because even small changes in model parameters can lead to large shifts in outputs. Large language models are particularly vulnerable on resource-constrained or outdated hardware. Such hardware often lacks error-correction mechanisms and faces aging issues, leading to instability under the vast parameter counts and heavy computational loads of LLMs. While the impact of BFEs on traditional networks like CNNs is relatively well-studied, their effect on the complex architecture of transformers remains largely unexplored. This paper presents a comprehensive systematic analysis of BFE vulnerabilities in key LLM components, revealing distinct sensitivities across parameters, activations, and gradients during fine-tuning and inference. Based on these findings, it introduces FlipGuard, a defense strategy combining exponent bit protection and self-correction based fine-tuning to mitigate BFE consequences. Experiments demonstrate strong robustness gains, enabling more reliable LLM deployment on diverse and less reliable hardware platforms.
