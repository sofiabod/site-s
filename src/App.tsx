import './App.css'
import { useRef, useCallback, useState, useEffect } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'

const topicUrls: Record<string, string> = {
  "Zep": "https://www.getzep.com/",
  "Memory Systems": "https://www.geeksforgeeks.org/machine-learning/types-of-memory-in-ai-agents/",
  "RAG": "https://www.geeksforgeeks.org/machine-learning/retrieval-augmented-generation-rag/",
  "Knowledge Graphs": "https://www.geeksforgeeks.org/machine-learning/knowledge-graphs-in-ai/",
  "LLMs": "https://www.geeksforgeeks.org/machine-learning/large-language-model-llm/",
  "Statistical Learning": "https://www.geeksforgeeks.org/machine-learning/statistical-learning-approach-in-machine-learning/",
  "Linear Regression": "https://www.geeksforgeeks.org/machine-learning/ml-linear-regression/",
  "Classification": "https://www.geeksforgeeks.org/machine-learning/getting-started-with-classification/",
  "Graph Neural Networks": "https://distill.pub/2021/gnn-intro/",
  "Graph Embeddings": "https://www.geeksforgeeks.org/machine-learning/graph-embedding-in-nlp/",
  "Graph Traversal": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
  "Embeddings": "https://www.geeksforgeeks.org/machine-learning/word-embeddings-in-nlp/",
  "Semantic Search": "https://www.sbert.net/examples/applications/semantic-search/README.html",
  "Cosine Similarity": "https://www.geeksforgeeks.org/machine-learning/cosine-similarity/",
  "Multi-Vector Retrieval": "https://python.langchain.com/docs/how_to/multi_vector/",
  "ColBERT": "https://arxiv.org/abs/2004.12832",
  "ColBERT v2": "https://arxiv.org/abs/2112.01488",
  "Late Interaction": "https://jina.ai/news/what-is-colbert-and-late-interaction-and-why-they-matter-in-search/",
  "MaxSim": "https://jina.ai/news/what-is-colbert-and-late-interaction-and-why-they-matter-in-search/",
  "MUVERA": "https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/",
  "Dense Retrieval": "https://www.geeksforgeeks.org/machine-learning/dense-retrieval/",
  "Sparse Retrieval": "https://www.pinecone.io/learn/sparse-dense-embeddings/",
  "BM25": "https://www.geeksforgeeks.org/understanding-tf-idf-term-frequency-inverse-document-frequency/",
  "Hybrid Search": "https://www.pinecone.io/learn/hybrid-search-intro/",
  "Reranking": "https://www.pinecone.io/learn/series/rag/rerankers/",
  "Bayesian Optimization": "https://distill.pub/2020/bayesian-optimization/",
  "Gaussian Processes": "https://distill.pub/2019/visual-exploration-gaussian-processes/",
  "Expected Improvement": "https://ekamperi.github.io/machine%20learning/2021/06/11/acquisition-functions.html",
  "Multi-Objective Optimization": "https://www.geeksforgeeks.org/machine-learning/multi-objective-optimization/",
  "Gradient-Free Optimization": "https://www.geeksforgeeks.org/machine-learning/derivative-free-optimization/",
  "Reinforcement Learning": "https://www.geeksforgeeks.org/machine-learning/what-is-reinforcement-learning/",
  "Q-Learning": "https://www.geeksforgeeks.org/machine-learning/q-learning-in-python/",
  "Policy Gradient": "https://www.geeksforgeeks.org/machine-learning/policy-gradient-methods-in-reinforcement-learning/",
  "Experience Replay": "https://www.geeksforgeeks.org/machine-learning/experience-replay-in-deep-q-network/",
  "Credit Assignment": "https://ai.stackexchange.com/questions/12908/what-is-the-credit-assignment-problem",
  "Reward Shaping": "https://gibberblot.github.io/rl-notes/single-agent/reward-shaping.html",
  "RLHF": "https://huggingface.co/blog/rlhf",
  "DPO": "https://arxiv.org/abs/2305.18290",
  "Value Function": "https://www.geeksforgeeks.org/machine-learning/value-function-in-reinforcement-learning/",
  "Bellman Equation": "https://www.geeksforgeeks.org/machine-learning/bellman-equation/",
  "Markov Decision Process": "https://www.geeksforgeeks.org/machine-learning/markov-decision-process/",
  "Exploration vs Exploitation": "https://www.geeksforgeeks.org/machine-learning/exploration-vs-exploitation-in-reinforcement-learning/",
  "Epsilon-Greedy": "https://www.geeksforgeeks.org/machine-learning/epsilon-greedy-algorithm-in-reinforcement-learning/",
  "Multi-Armed Bandits": "https://www.geeksforgeeks.org/machine-learning/multi-armed-bandit-problem/",
  "Transformers": "https://jalammar.github.io/illustrated-transformer/",
  "Self-Attention": "https://jalammar.github.io/illustrated-transformer/",
  "Fine-tuning": "https://www.geeksforgeeks.org/machine-learning/fine-tuning-large-language-models/",
  "Prompt Engineering": "https://www.promptingguide.ai/",
  "In-Context Learning": "https://www.lakera.ai/blog/what-is-in-context-learning",
  "Chain-of-Thought": "https://www.promptingguide.ai/techniques/cot",
  "Diffusion Models": "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/",
  "VAEs": "https://www.geeksforgeeks.org/machine-learning/variational-autoencoders/",
  "GANs": "https://www.geeksforgeeks.org/machine-learning/generative-adversarial-network-gan/",
  "Meta-Learning": "https://lilianweng.github.io/posts/2018-11-30-meta-learning/",
  "Few-Shot Learning": "https://www.geeksforgeeks.org/machine-learning/ml-few-shot-learning/",
  "Transfer Learning": "https://www.geeksforgeeks.org/machine-learning/ml-introduction-to-transfer-learning/",
  "Backpropagation": "https://www.geeksforgeeks.org/machine-learning/backpropagation-in-neural-network/",
  "Gradient Descent": "https://www.geeksforgeeks.org/machine-learning/gradient-descent-algorithm-and-its-variants/",
  "LoRA": "https://huggingface.co/docs/peft/conceptual_guides/lora",
  "Quantization": "https://huggingface.co/docs/optimum/concept_guides/quantization",
  "K-Means Clustering": "https://www.geeksforgeeks.org/machine-learning/k-means-clustering-introduction/",
  "Attention Mechanisms": "https://lilianweng.github.io/posts/2018-06-24-attention/",
  "Context Windows": "https://www.hopsworks.ai/dictionary/context-window-for-llms",
  "Long-Term Memory": "https://www.geeksforgeeks.org/machine-learning/types-of-memory-in-ai-agents/",
  "Episodic Memory": "https://www.geeksforgeeks.org/machine-learning/types-of-memory-in-ai-agents/",
  "Memory Consolidation": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3721510/",
  "Knowledge Distillation": "https://www.geeksforgeeks.org/machine-learning/knowledge-distillation/",
  "Continual Learning": "https://www.geeksforgeeks.org/machine-learning/continual-learning/",
  "Catastrophic Forgetting": "https://www.geeksforgeeks.org/machine-learning/catastrophic-forgetting/",
  "Mixture of Experts": "https://huggingface.co/blog/moe",
  "RNNs": "https://www.geeksforgeeks.org/machine-learning/introduction-to-recurrent-neural-network/",
  "LSTMs": "https://www.geeksforgeeks.org/machine-learning/deep-learning-introduction-to-long-short-term-memory/",
  "CNNs": "https://www.geeksforgeeks.org/machine-learning/introduction-convolution-neural-network/",
  "Tokenization": "https://huggingface.co/docs/transformers/tokenizer_summary",
  "BPE": "https://huggingface.co/learn/nlp-course/chapter6/5",
  "Word2Vec": "https://www.geeksforgeeks.org/machine-learning/python-word-embedding-using-word2vec/",
  "BERT": "https://jalammar.github.io/illustrated-bert/",
  "Sentence Transformers": "https://www.sbert.net/",
  "Flash Attention": "https://arxiv.org/abs/2205.14135",
  "KV Cache": "https://www.dipkumar.com/posts/kv-caching/",
  "Speculative Decoding": "https://arxiv.org/abs/2211.17192",
  "Mamba": "https://arxiv.org/abs/2312.00752",
  "Adam": "https://www.geeksforgeeks.org/machine-learning/adam-optimizer/",
  "SGD": "https://www.geeksforgeeks.org/machine-learning/ml-stochastic-gradient-descent-sgd/",
  "Learning Rate Scheduling": "https://www.geeksforgeeks.org/machine-learning/how-to-use-a-learning-rate-scheduler-in-pytorch/",
  "Mechanistic Interpretability": "https://www.neelnanda.io/mechanistic-interpretability/getting-started",
  "Attention Visualization": "https://jalammar.github.io/illustrated-transformer/",
  "Constitutional AI": "https://arxiv.org/abs/2212.08073",
  "Red Teaming": "https://huggingface.co/blog/red-teaming",
  "Adversarial Examples": "https://www.geeksforgeeks.org/machine-learning/adversarial-examples-in-deep-learning/",
  "Data Augmentation": "https://www.geeksforgeeks.org/machine-learning/data-augmentation-in-deep-learning/",
  "Synthetic Data": "https://www.geeksforgeeks.org/machine-learning/synthetic-data/",
  "Active Learning": "https://www.geeksforgeeks.org/machine-learning/active-learning-in-machine-learning/",
  "Moran's I": "https://www.geeksforgeeks.org/morans-i-spatial-autocorrelation/",
  "Spatial Autocorrelation": "https://www.geeksforgeeks.org/spatial-auto-correlation/",
  "Changepoint Detection": "https://www.geeksforgeeks.org/change-point-detection-in-time-series-data/",
  "CUSUM": "https://www.geeksforgeeks.org/cusum-control-charts/",
  "Time Series Forecasting": "https://www.geeksforgeeks.org/machine-learning/time-series-forecasting-using-machine-learning/",
  "Geospatial ML": "https://www.geeksforgeeks.org/geospatial-data-analysis/",
  "Feature Engineering": "https://www.geeksforgeeks.org/machine-learning/what-is-feature-engineering/",
  "P-Value": "https://www.geeksforgeeks.org/understanding-the-p-value/",
  "Moravec's Paradox": "https://www.geeksforgeeks.org/moravecs-paradox/",
  "Process Driven Autoformalization": "https://arxiv.org/abs/2406.01940",
  "FORML4": "https://arxiv.org/abs/2406.01940",
}

const topics = Object.keys(topicUrls)

const nodes = topics.map((topic) => ({
  id: topic,
  gray: Math.floor(Math.random() * 200) + 30,
  url: topicUrls[topic],
}))

const links: { source: string; target: string }[] = [
  { source: "Zep", target: "Memory Systems" },
  { source: "Zep", target: "RAG" },
  { source: "Zep", target: "Knowledge Graphs" },
  { source: "Zep", target: "LLMs" },
  { source: "Zep", target: "Semantic Search" },
  { source: "RAG", target: "LLMs" },
  { source: "RAG", target: "Embeddings" },
  { source: "RAG", target: "Semantic Search" },
  { source: "RAG", target: "Knowledge Graphs" },
  { source: "Memory Systems", target: "LLMs" },
  { source: "Knowledge Graphs", target: "Graph Neural Networks" },
  { source: "Knowledge Graphs", target: "Graph Traversal" },
  { source: "Knowledge Graphs", target: "Graph Embeddings" },
  { source: "Graph Neural Networks", target: "Graph Embeddings" },
  { source: "Graph Neural Networks", target: "Embeddings" },
  { source: "Graph Traversal", target: "Graph Neural Networks" },
  { source: "Graph Embeddings", target: "Embeddings" },
  { source: "Embeddings", target: "Cosine Similarity" },
  { source: "Embeddings", target: "Semantic Search" },
  { source: "Embeddings", target: "Multi-Vector Retrieval" },
  { source: "Cosine Similarity", target: "Semantic Search" },
  { source: "Semantic Search", target: "Multi-Vector Retrieval" },
  { source: "Multi-Vector Retrieval", target: "RAG" },
  { source: "ColBERT", target: "Late Interaction" },
  { source: "ColBERT", target: "Multi-Vector Retrieval" },
  { source: "ColBERT", target: "MaxSim" },
  { source: "ColBERT v2", target: "ColBERT" },
  { source: "ColBERT v2", target: "Multi-Vector Retrieval" },
  { source: "ColBERT v2", target: "Dense Retrieval" },
  { source: "MaxSim", target: "Late Interaction" },
  { source: "MaxSim", target: "Cosine Similarity" },
  { source: "MUVERA", target: "Multi-Vector Retrieval" },
  { source: "MUVERA", target: "ColBERT" },
  { source: "MUVERA", target: "Dense Retrieval" },
  { source: "MUVERA", target: "Embeddings" },
  { source: "Late Interaction", target: "Dense Retrieval" },
  { source: "Dense Retrieval", target: "Embeddings" },
  { source: "Dense Retrieval", target: "Semantic Search" },
  { source: "Sparse Retrieval", target: "BM25" },
  { source: "Hybrid Search", target: "Dense Retrieval" },
  { source: "Hybrid Search", target: "Sparse Retrieval" },
  { source: "Hybrid Search", target: "RAG" },
  { source: "Reranking", target: "Semantic Search" },
  { source: "Reranking", target: "ColBERT" },
  { source: "BM25", target: "Semantic Search" },
  { source: "Bayesian Optimization", target: "Gaussian Processes" },
  { source: "Bayesian Optimization", target: "Expected Improvement" },
  { source: "Bayesian Optimization", target: "Gradient-Free Optimization" },
  { source: "Gaussian Processes", target: "Expected Improvement" },
  { source: "Multi-Objective Optimization", target: "Bayesian Optimization" },
  { source: "Gradient-Free Optimization", target: "Multi-Objective Optimization" },
  { source: "Bayesian Optimization", target: "Reinforcement Learning" },
  { source: "Bayesian Optimization", target: "RAG" },
  { source: "Bayesian Optimization", target: "Semantic Search" },
  { source: "Multi-Objective Optimization", target: "RLHF" },
  { source: "Multi-Objective Optimization", target: "RAG" },
  { source: "Gaussian Processes", target: "Embeddings" },
  { source: "Gaussian Processes", target: "Cosine Similarity" },
  { source: "Expected Improvement", target: "Q-Learning" },
  { source: "Reinforcement Learning", target: "Q-Learning" },
  { source: "Reinforcement Learning", target: "Policy Gradient" },
  { source: "Reinforcement Learning", target: "Experience Replay" },
  { source: "Reinforcement Learning", target: "Credit Assignment" },
  { source: "Reinforcement Learning", target: "Reward Shaping" },
  { source: "Q-Learning", target: "Experience Replay" },
  { source: "Policy Gradient", target: "Reward Shaping" },
  { source: "Reward Shaping", target: "Credit Assignment" },
  { source: "RLHF", target: "Reinforcement Learning" },
  { source: "RLHF", target: "LLMs" },
  { source: "RLHF", target: "Reward Shaping" },
  { source: "DPO", target: "RLHF" },
  { source: "DPO", target: "LLMs" },
  { source: "Reinforcement Learning", target: "Value Function" },
  { source: "Value Function", target: "Bellman Equation" },
  { source: "Reinforcement Learning", target: "Markov Decision Process" },
  { source: "Markov Decision Process", target: "Bellman Equation" },
  { source: "Q-Learning", target: "Value Function" },
  { source: "Reinforcement Learning", target: "Exploration vs Exploitation" },
  { source: "Exploration vs Exploitation", target: "Epsilon-Greedy" },
  { source: "Multi-Armed Bandits", target: "Exploration vs Exploitation" },
  { source: "Multi-Armed Bandits", target: "Bayesian Optimization" },
  { source: "Epsilon-Greedy", target: "Q-Learning" },
  { source: "LLMs", target: "Transformers" },
  { source: "Transformers", target: "Self-Attention" },
  { source: "Self-Attention", target: "Attention Mechanisms" },
  { source: "LLMs", target: "Fine-tuning" },
  { source: "Fine-tuning", target: "LoRA" },
  { source: "LLMs", target: "Prompt Engineering" },
  { source: "Prompt Engineering", target: "In-Context Learning" },
  { source: "Prompt Engineering", target: "Chain-of-Thought" },
  { source: "In-Context Learning", target: "Few-Shot Learning" },
  { source: "RAG", target: "In-Context Learning" },
  { source: "Diffusion Models", target: "GANs" },
  { source: "VAEs", target: "GANs" },
  { source: "VAEs", target: "Embeddings" },
  { source: "Diffusion Models", target: "Gradient Descent" },
  { source: "Meta-Learning", target: "Few-Shot Learning" },
  { source: "Meta-Learning", target: "Transfer Learning" },
  { source: "Transfer Learning", target: "Fine-tuning" },
  { source: "Few-Shot Learning", target: "In-Context Learning" },
  { source: "Backpropagation", target: "Gradient Descent" },
  { source: "Gradient Descent", target: "Bayesian Optimization" },
  { source: "LoRA", target: "Fine-tuning" },
  { source: "Quantization", target: "LLMs" },
  { source: "LoRA", target: "Quantization" },
  { source: "K-Means Clustering", target: "Embeddings" },
  { source: "Memory Systems", target: "Long-Term Memory" },
  { source: "Memory Systems", target: "Episodic Memory" },
  { source: "Long-Term Memory", target: "Episodic Memory" },
  { source: "Attention Mechanisms", target: "Context Windows" },
  { source: "Context Windows", target: "LLMs" },
  { source: "Zep", target: "Episodic Memory" },
  { source: "Experience Replay", target: "Episodic Memory" },
  { source: "Memory Systems", target: "Memory Consolidation" },
  { source: "Memory Consolidation", target: "Long-Term Memory" },
  { source: "Memory Consolidation", target: "Episodic Memory" },
  { source: "Memory Consolidation", target: "Experience Replay" },
  { source: "Zep", target: "Memory Consolidation" },
  { source: "Knowledge Distillation", target: "LLMs" },
  { source: "Knowledge Distillation", target: "Quantization" },
  { source: "Knowledge Distillation", target: "Fine-tuning" },
  { source: "Knowledge Distillation", target: "Transfer Learning" },
  { source: "Knowledge Distillation", target: "LoRA" },
  { source: "Continual Learning", target: "Catastrophic Forgetting" },
  { source: "Continual Learning", target: "Memory Systems" },
  { source: "Continual Learning", target: "Meta-Learning" },
  { source: "Continual Learning", target: "Episodic Memory" },
  { source: "Catastrophic Forgetting", target: "Experience Replay" },
  { source: "Catastrophic Forgetting", target: "Long-Term Memory" },
  { source: "Continual Learning", target: "Transfer Learning" },
  { source: "LLMs", target: "Mixture of Experts" },
  { source: "Mixture of Experts", target: "Transformers" },
  { source: "RNNs", target: "LSTMs" },
  { source: "LSTMs", target: "Memory Systems" },
  { source: "CNNs", target: "Embeddings" },
  { source: "LLMs", target: "Tokenization" },
  { source: "Tokenization", target: "BPE" },
  { source: "Word2Vec", target: "Embeddings" },
  { source: "BERT", target: "Transformers" },
  { source: "BERT", target: "Embeddings" },
  { source: "Sentence Transformers", target: "BERT" },
  { source: "Sentence Transformers", target: "Semantic Search" },
  { source: "Flash Attention", target: "Self-Attention" },
  { source: "KV Cache", target: "Transformers" },
  { source: "KV Cache", target: "Context Windows" },
  { source: "Speculative Decoding", target: "LLMs" },
  { source: "Mamba", target: "LLMs" },
  { source: "Mamba", target: "RNNs" },
  { source: "Adam", target: "Gradient Descent" },
  { source: "SGD", target: "Gradient Descent" },
  { source: "Learning Rate Scheduling", target: "Gradient Descent" },
  { source: "Adam", target: "SGD" },
  { source: "Mechanistic Interpretability", target: "LLMs" },
  { source: "Attention Visualization", target: "Self-Attention" },
  { source: "Mechanistic Interpretability", target: "Attention Visualization" },
  { source: "Constitutional AI", target: "RLHF" },
  { source: "Red Teaming", target: "LLMs" },
  { source: "Adversarial Examples", target: "Red Teaming" },
  { source: "Constitutional AI", target: "DPO" },
  { source: "Data Augmentation", target: "Fine-tuning" },
  { source: "Synthetic Data", target: "Data Augmentation" },
  { source: "Active Learning", target: "Meta-Learning" },
  { source: "Synthetic Data", target: "LLMs" },
  { source: "Moran's I", target: "Spatial Autocorrelation" },
  { source: "Geospatial ML", target: "Moran's I" },
  { source: "Geospatial ML", target: "CNNs" },
  { source: "Geospatial ML", target: "K-Means Clustering" },
  { source: "Changepoint Detection", target: "CUSUM" },
  { source: "Changepoint Detection", target: "Time Series Forecasting" },
  { source: "Time Series Forecasting", target: "LSTMs" },
  { source: "Time Series Forecasting", target: "Transformers" },
  { source: "Feature Engineering", target: "Gradient Descent" },
  { source: "Feature Engineering", target: "Data Augmentation" },
  { source: "CUSUM", target: "Time Series Forecasting" },
  { source: "P-Value", target: "Moran's I" },
  { source: "P-Value", target: "Spatial Autocorrelation" },
  { source: "P-Value", target: "Gaussian Processes" },
  { source: "P-Value", target: "Multi-Armed Bandits" },
  { source: "Statistical Learning", target: "K-Means Clustering" },
  { source: "Statistical Learning", target: "Linear Regression" },
  { source: "Statistical Learning", target: "Classification" },
  { source: "Statistical Learning", target: "Gradient Descent" },
  { source: "Statistical Learning", target: "Feature Engineering" },
  { source: "Statistical Learning", target: "P-Value" },
  { source: "Statistical Learning", target: "Gaussian Processes" },
  { source: "Statistical Learning", target: "Backpropagation" },
  { source: "Linear Regression", target: "Gradient Descent" },
  { source: "Classification", target: "Embeddings" },
  { source: "Moravec's Paradox", target: "CNNs" },
  { source: "Moravec's Paradox", target: "Reinforcement Learning" },
  { source: "Moravec's Paradox", target: "LLMs" },
  { source: "Process Driven Autoformalization", target: "Bayesian Optimization" },
  { source: "Process Driven Autoformalization", target: "Feature Engineering" },
  { source: "FORML4", target: "Process Driven Autoformalization" },
]

const graphData = { nodes, links }

interface Experience {
  title: string
  company: string
  date: string
}

const experiences: Experience[] = [
  {
    title: "ML Research Engineer",
    company: "Sentra",
    date: "oct 2025 - current"
  },
  {
    title: "Software Engineer",
    company: "Omen",
    date: "sep 2025 - current"
  },
  {
    title: "Machine Learning Intern",
    company: "Convictional",
    date: "july 2025 - aug 2025"
  }
]

function App() {
  const fgRef = useRef<any>(null)
  const spritesRef = useRef<Map<string, any>>(new Map())
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1554)
  const [showMindset, setShowMindset] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1554)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (fgRef.current) {
      const controls = fgRef.current.controls()
      controls.minDistance = 0.1
      controls.maxDistance = 10000
      controls.enablePan = true
      controls.panSpeed = 10
      controls.rotateSpeed = 8
      controls.zoomSpeed = 5
      controls.enableDamping = true
      controls.dampingFactor = 0.2
      controls.mouseButtons = {
        LEFT: 0,    // rotate
        MIDDLE: 1,  // zoom
        RIGHT: 2    // pan
      }
    }
  }, [isMobile])

  const updateLabelVisibility = useCallback(() => {
    if (!fgRef.current) return
    const camera = fgRef.current.camera()
    const distance = camera.position.length()
    const showLabels = distance < 1500

    spritesRef.current.forEach((sprite) => {
      sprite.visible = showLabels
    })
  }, [])

  const navLinks = (
    <nav className="nav-links" style={{ position: 'absolute', left: '600px' }}>
      <a onClick={() => setShowMindset(!showMindset)} style={{ cursor: 'pointer' }}>
        <img src="/penguin.svg" alt={showMindset ? "Back" : "Mindset"} style={{ height: '65px', marginRight: '-25px', marginTop: '-2px' }} />
      </a>
      <a href="https://www.linkedin.com/in/sofiia-bodnar/" target="_blank" rel="noopener noreferrer">
        <img src="/Linkedin.svg" alt="LinkedIn" style={{ height: '20px' }} />
      </a>
    </nav>
  )

  if (showMindset) {
    return (
      <main>
        <div>
          <div className="header-row">
            <h1 style={{ fontSize: '1.5rem' }}>mindset</h1>
            {navLinks}
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            every waking hour is a working hour
          </p>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '12px' }}>
            "I will figure it out"
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>
            your maximum is someone's minimum
          </p>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '12px' }}>
            go above and beyond, over prepare, be obsessed
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>
            create your own opportunities
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>
            your time is extremely precious
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '30px' }}>
            fav quote:
          </p>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '8px' }}>
            "I work from the moment I wake up to the moment I go<br />to sleep" - Jensen Huang
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            iterate. iterate. iterate.
          </p>
        </div>

        </main>
    )
  }


  return (
    <main>
      <div>
        <div className="header-row">
          <h1 style={{ fontSize: '1.5rem' }}>sofia bodnar</h1>
          {navLinks}
        </div>
      </div>

      {!isMobile && (
        <div className="graph-container">
          <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          width={500}
          height={400}
          backgroundColor="#fafafa"
          showNavInfo={false}
          nodeColor={(node: { gray?: number }) => {
            const g = node.gray || 128
            return `rgb(${g}, ${g}, ${g})`
          }}
          nodeOpacity={1}
          linkColor={() => '#000000'}
          nodeThreeObjectExtend={true}
          nodeThreeObject={(node: any) => {
            const n = node as { id?: string }
            const sprite = new SpriteText(n.id || '') as any
            sprite.fontFace = 'Manrope'
            sprite.fontWeight = '300'
            sprite.textHeight = 2
            sprite.color = '#000000'
            sprite.position.y = 8
            sprite.visible = false
            spritesRef.current.set(n.id || '', sprite)
            return sprite
          }}
          onEngineTick={updateLabelVisibility}
          onNodeClick={(node: any) => {
            const n = node as { id?: string; url?: string }
            if (n.url) {
              window.open(n.url, '_blank')
            }
          }}
        />
        </div>
      )}

      <div>

        <div style={{ marginTop: '40px' }}>
          <h2 id="experience" style={{ fontSize: '1.3rem', fontWeight: 700 }}>experience</h2>
        {experiences.map((exp, index) => (
          <div key={index} style={{ marginTop: index === 0 ? '20px' : '40px' }}>
            <h3 style={{ fontSize: '0.95rem' }}>{exp.title}<span style={{ fontWeight: 300 }}>, {exp.company}</span>
              {exp.company === 'Sentra' && (
                <>
                  <a href="https://www.sentra.app/" target="_blank" rel="noopener noreferrer">
                    <img src="/sentra.svg" alt="Sentra" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
                  </a>
                  <a href="https://www.forbes.com/sites/charliefink/2026/02/02/sentra-raises-5-million-to-build-enterprise-general-intelligence/" target="_blank" rel="noopener noreferrer">
                    <img src="/a16z.png" alt="a16z" style={{ height: '22px', marginLeft: '4px', verticalAlign: 'middle' }} />
                  </a>
                </>
              )}
              {exp.company === 'Omen' && (
                <a href="https://omen.trade/" target="_blank" rel="noopener noreferrer">
                  <img src="/omen.svg" alt="Omen" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
                </a>
              )}
              {exp.company === 'Convictional' && (
                <>
                  <a href="https://get.convictional.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/convictional_logo.jpeg" alt="Convictional" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
                  </a>
                  <a href="https://www.ycombinator.com/companies/convictional" target="_blank" rel="noopener noreferrer">
                    <img src="/yc.svg" alt="Y Combinator" style={{ height: '18px', marginLeft: '4px', verticalAlign: 'middle' }} />
                  </a>
                </>
              )}
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{exp.date}</p>
            {exp.company === 'Sentra' && (
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                developing a self-optimizing memory framework that curates knowledge from<br />experience, working with <img src="/mit.svg" alt="MIT" style={{ height: '22px', verticalAlign: 'middle', margin: '0 6px' }} /> prof
              </p>
            )}
            {exp.company === 'Omen' && (
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                building automation infrastructure for company onboarding and cap table<br />management
              </p>
            )}
            {exp.company === 'Convictional' && (
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                researched multi-vector retrieval, benchmarking <a href="https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>MUVERA</a> and <a href="https://arxiv.org/pdf/2112.01488" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>ColBERT v2</a>
              </p>
            )}
          </div>
        ))}
        </div>

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>sidequests</h2>

          <p style={{ fontSize: '0.8rem', marginTop: '20px' }}>created <a href="https://www.axiomstartups.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>Axiom</a>, a startup competition for youth</p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>predicted forecast failures using LISA and ensemble ML,<br /><span style={{ fontStyle: 'italic' }}>published by <a href="https://journal.stemfellowship.org/doi/epdf/10.17975/sfj-2026-002" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>Canadian Science Publishing</a></span></p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>created first ML and math community at my hs</p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>recently hosted <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>G Hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>Claude x Socratica</a> and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>PRISM</a></p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>generated over <a href="https://www.tiktok.com/@infinitybouquets.ca?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>150k views</a> and sold <a href="https://www.instagram.com/infinitybouquets.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>100+ bouquets</a></p>
        </div>
      </div>

      <footer style={{ marginTop: '80px', fontSize: '0.75rem', color: '#666' }}>
        <span>2026 © Sofia Bodnar</span>
        <span style={{ marginLeft: '100px' }}>sofiabodnar1729 [at] gmail [dot] com</span>
      </footer>
    </main>
  )
}

export default App
