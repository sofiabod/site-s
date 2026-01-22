import './App.css'
import { useRef, useCallback, useState, useEffect } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'

const topics = [
  "Zep", "Memory Systems", "RAG", "Knowledge Graphs", "LLMs",
  "Statistical Learning", "Linear Regression", "Classification",
  "Graph Neural Networks", "Graph Embeddings", "Graph Traversal",
  "Embeddings", "Semantic Search", "Cosine Similarity", "Multi-Vector Retrieval",
  "ColBERT", "ColBERT v2", "Late Interaction", "MaxSim", "MUVERA", "Dense Retrieval", "Sparse Retrieval", "BM25", "Hybrid Search", "Reranking",
  "Bayesian Optimization", "Gaussian Processes", "Expected Improvement",
  "Multi-Objective Optimization", "Gradient-Free Optimization",
  "Reinforcement Learning", "Q-Learning", "Policy Gradient",
  "Experience Replay", "Credit Assignment", "Reward Shaping", "RLHF", "DPO",
  "Value Function", "Bellman Equation", "Markov Decision Process",
  "Exploration vs Exploitation", "Epsilon-Greedy", "Multi-Armed Bandits",
  "Transformers", "Self-Attention", "Fine-tuning", "Prompt Engineering",
  "In-Context Learning", "Chain-of-Thought",
  "Diffusion Models", "VAEs", "GANs",
  "Meta-Learning", "Few-Shot Learning", "Transfer Learning",
  "Backpropagation", "Gradient Descent", "LoRA", "Quantization",
  "K-Means Clustering",
  "Attention Mechanisms", "Context Windows", "Long-Term Memory", "Episodic Memory",
  "Memory Consolidation", "Knowledge Distillation", "Continual Learning", "Catastrophic Forgetting",
  "Mixture of Experts", "RNNs", "LSTMs", "CNNs",
  "Tokenization", "BPE", "Word2Vec", "BERT", "Sentence Transformers",
  "Flash Attention", "KV Cache", "Speculative Decoding", "Mamba",
  "Adam", "SGD", "Learning Rate Scheduling",
  "Mechanistic Interpretability", "Attention Visualization",
  "Constitutional AI", "Red Teaming", "Adversarial Examples",
  "Data Augmentation", "Synthetic Data", "Active Learning",
  "Moran's I", "Spatial Autocorrelation", "Changepoint Detection",
  "CUSUM", "Time Series Forecasting", "Geospatial ML", "Feature Engineering",
  "P-Value", "Moravec's Paradox"
]

const customUrls: Record<string, string> = {
  "In-Context Learning": "https://www.lakera.ai/blog/what-is-in-context-learning",
  "ColBERT v2": "https://arxiv.org/abs/2112.01488",
  "MUVERA": "https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/",
  "MaxSim": "https://jina.ai/news/what-is-colbert-and-late-interaction-and-why-they-matter-in-search/",
  "Late Interaction": "https://jina.ai/news/what-is-colbert-and-late-interaction-and-why-they-matter-in-search/"
}

const notesMap: Record<string, string> = {
  "Zep": "zep",
  "P-Value": "p-value",
  "Statistical Learning": "statistical-learning",
}

const nodes = topics.map((topic) => ({
  id: topic,
  gray: Math.floor(Math.random() * 200) + 30,
  url: customUrls[topic] || `https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`
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
]

const graphData = { nodes, links }

interface Experience {
  title: string
  company: string
  date: string
}

const experiences: Experience[] = [
  {
    title: "Machine Learning Research Intern",
    company: "Sentra",
    date: "oct 2025 - current"
  },
  {
    title: "Software Engineer",
    company: "Omen",
    date: "sep 2025 - current"
  },
  {
    title: "Intern",
    company: "Convictional",
    date: "july 2025 - aug 2025"
  }
]

function App() {
  const fgRef = useRef<any>(null)
  const spritesRef = useRef<Map<string, any>>(new Map())
  const nodePositions = useRef<Map<string, {x: number, y: number, z: number}>>(new Map())
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1554)
  const [showNotes, setShowNotes] = useState<string | null>(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'zep') return 'zep'
    if (hash === 'p-value') return 'p-value'
    if (hash === 'statistical-learning') return 'statistical-learning'
    return null
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filteredNodes = searchQuery.length > 0
    ? nodes.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const zoomToNode = useCallback((nodeId: string) => {
    if (!fgRef.current) return
    const pos = nodePositions.current.get(nodeId)
    if (pos) {
      const distance = 50
      fgRef.current.cameraPosition(
        { x: pos.x + distance, y: pos.y + distance, z: pos.z + distance },
        { x: pos.x, y: pos.y, z: pos.z },
        1500
      )
    }
    setSearchQuery('')
    setShowSearch(false)
  }, [])

  useEffect(() => {
    if (showNotes) {
      window.location.hash = showNotes
    } else {
      history.replaceState(null, '', window.location.pathname)
    }
  }, [showNotes])

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

    graphData.nodes.forEach((node: any) => {
      if (node.x !== undefined) {
        nodePositions.current.set(node.id, { x: node.x, y: node.y, z: node.z })
      }
    })
  }, [])

  if (showNotes) {
    return (
      <div
        onClick={() => setShowNotes(null)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#fafafa',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'default'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
              {showNotes === 'zep' && (
                <>short note on <a href="https://arxiv.org/pdf/2501.13956" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>ZEP</a></>
              )}
              {showNotes === 'p-value' && (
                <>short note on P-Value</>
              )}
              {showNotes === 'statistical-learning' && (
                <>short note on Statistical Learning</>
              )}
            </h2>
            <button
              onClick={() => setShowNotes(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginRight: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
              title="Back to home"
            >
              ⌂
            </button>
          </div>
          <div style={{ maxHeight: '75vh', overflow: 'auto', border: '1px solid #000' }}>
            {showNotes === 'zep' && (
              <img
                src="/zep-notes.png"
                alt="Zep Memory Retrieval Notes"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            )}
            {showNotes === 'p-value' && (
              <img
                src="/notes/p_value.png"
                alt="P-Value Notes"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            )}
            {showNotes === 'statistical-learning' && (
              <img
                src="/notes/stat.png"
                alt="Statistical Learning Notes"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main>
      <div>
        <div className="header-row">
          <h1 style={{ fontSize: '1.5rem' }}>sofia bodnar</h1>
          <nav className="nav-links">
            <a href="/"><img src="/cute.svg" alt="" style={{ height: '80px', marginRight: '-10px' }} /></a>
            <a href="https://www.linkedin.com/in/sofiia-bodnar/" target="_blank" rel="noopener noreferrer">
              <img src="/Linkedin.svg" alt="LinkedIn" style={{ height: '20px' }} />
            </a>
            <a href="mailto:sofiabodnar1729@gmail.com">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6L12 13L2 6" />
              </svg>
            </a>
          </nav>
        </div>
        <p style={{ fontSize: '0.95rem' }}>17 y/o high school student</p>
      </div>

      {!isMobile && (
        <div className="graph-container">
          <div style={{ position: 'relative', marginBottom: '8px', marginLeft: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                placeholder="search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.border = '1px solid #000'; setShowSearch(true) }}
                onBlur={(e) => { e.currentTarget.style.border = '1px solid #ccc'; setTimeout(() => setShowSearch(false), 150) }}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '200px',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
            {showSearch && filteredNodes.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '200px',
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                zIndex: 100,
                marginTop: '4px'
              }}>
                {filteredNodes.slice(0, 10).map(node => (
                  <div
                    key={node.id}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor = '#d0d0d0'
                      zoomToNode(node.id)
                    }}
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      fontFamily: 'Manrope, sans-serif',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    {node.id}
                  </div>
                ))}
              </div>
            )}
          </div>
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
            if (n.id && notesMap[n.id]) {
              setShowNotes(notesMap[n.id])
            } else if (n.url) {
              window.open(n.url, '_blank')
            }
          }}
        />
        </div>
      )}

      <div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>previous builds</h2>

          <p style={{ fontSize: '0.8rem', marginTop: '20px' }}>created <a href="https://www.axiomstartups.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>Axiom</a>, a startup competition for youth</p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>predicted forecast failures using LISA and ensemble ML for HSBDC 2026</p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>created first ML and math community at my hs</p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>recently hosted <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>G Hacks</a> and <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>Claude x Socratica</a></p>
          <p style={{ fontSize: '0.8rem', marginTop: '12px' }}>generated over <a href="https://www.tiktok.com/@infinitybouquets.ca?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>150k views</a> and sold <a href="https://www.instagram.com/infinitybouquets.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700 }}>100+ bouquets</a></p>
        </div>

        <div style={{ marginTop: '60px' }}>
          <h2 id="experience" style={{ fontSize: '1.3rem', fontWeight: 700 }}>experience</h2>
        {experiences.map((exp, index) => (
          <div key={index} style={{ marginTop: index === 0 ? '20px' : '40px' }}>
            <h3 style={{ fontSize: '0.95rem' }}>{exp.title}<span style={{ fontWeight: 300 }}>, {exp.company}</span>
              {exp.company === 'Sentra' && (
                <>
                  <a href="https://www.sentra.app/" target="_blank" rel="noopener noreferrer">
                    <img src="/sentra.svg" alt="Sentra" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
                  </a>
                  <img src="/a16z.png" alt="a16z" style={{ height: '22px', marginLeft: '4px', verticalAlign: 'middle' }} />
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
                developing a self-optimizing memory framework that curates knowledge from experience,<br />working with <img src="/mit.svg" alt="MIT" style={{ height: '22px', verticalAlign: 'middle', margin: '0 6px' }} /> prof
              </p>
            )}
            {exp.company === 'Omen' && (
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                building automation infrastructure for company onboarding and cap table management
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
      </div>

      <footer style={{ marginTop: '80px', fontSize: '0.75rem', color: '#666' }}>
        2026 © Sofia Bodnar
      </footer>
    </main>
  )
}

export default App
