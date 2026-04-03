---
id: gpu-occupancy-cluster-2023
title: "GPU Occupancy Prediction of Deep Learning Models Using Graph Neural Network"
authors:
  - Hengquan Mei
  - Huaizhi Qu
  - Jingwei Sun
  - Yanjie Gao
  - Haoxiang Lin
  - Guangzhong Sun
venue: Cluster
venueType: conference
year: 2023
status: published
isCoFirst: true
coFirstAuthors:
  - Hengquan Mei
  - Huaizhi Qu
specialBadges:
  - Co-First
links:
  paper: "https://www.microsoft.com/en-us/research/publication/gpu-occupancy-prediction-of-deep-learning-models-using-graph-neural-network/"
---

Over the past few years, deep learning has been rapidly adopted in many fields. Among the various hardware accelerators specifically for deep learning computation, GPUs are the dominant platform. GPU occupancy is an essential indicator of how well GPUs are utilized, and predicting the GPU occupancy of deep learning models is critical for improving both job runtime performance and platform resource efficiency. This paper proposes DNN-occu to predict the GPU occupancy of deep learning models. The key insight is that models can be represented as directed acyclic computation graphs. DNN-occu extracts occupancy-related features from the computational semantics of graph nodes and edges, and employs a graph neural network for better feature encoding and prediction generalization. Experiments on various real-world deep learning models show strong prediction accuracy and generalization to unseen models.
