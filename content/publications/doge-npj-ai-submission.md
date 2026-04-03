---
id: doge-npj-ai-submission
title: "DOGe: Defensive Output Generation for LLM Protection Against Knowledge Distillation"
authors:
  - Pingzhi Li
  - Zhen Tan
  - Huaizhi Qu
  - Huan Liu
  - Tianlong Chen
venue: Preprint
venueType: preprint
year: 2026
status: preprint
specialBadges:
  - Under Review
links:
  arxiv: "https://arxiv.org/abs/2505.19504"
---

Large Language Models represent substantial intellectual and economic investments, yet their effectiveness can inadvertently facilitate model imitation via knowledge distillation. In practical scenarios, competitors can distill proprietary model capabilities by observing publicly accessible outputs. Existing protection methods either identify imitation only after the fact or assume access to internal logits, making them ineffective against distillation from output text alone. This paper introduces DOGe, an effective and efficient defensive output generation strategy that subtly modifies model behavior so outputs remain useful for legitimate users while being misleading for distillation. The method fine-tunes only the final linear layer with an adversarial loss, significantly undermining imitation attempts while preserving teacher performance.
