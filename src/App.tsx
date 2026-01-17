import './App.css'
import { useRef, useCallback, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'

const topics = [
  // Core
  "Zep", "Memory Systems", "RAG", "Knowledge Graphs", "LLMs",
  // Graph
  "Graph Neural Networks", "Graph Embeddings", "Graph Traversal",
  // Embeddings & Search
  "Embeddings", "Semantic Search", "Cosine Similarity", "Multi-Vector Retrieval",
  // Bayesian Optimization
  "Bayesian Optimization", "Gaussian Processes", "Expected Improvement",
  "Multi-Objective Optimization", "Gradient-Free Optimization",
  // Reinforcement Learning
  "Reinforcement Learning", "Q-Learning", "Policy Gradient",
  "Experience Replay", "Credit Assignment", "Reward Shaping", "RLHF", "DPO"
]

const nodes = topics.map((topic) => ({
  id: topic,
  gray: Math.floor(Math.random() * 200) + 30,
  url: `https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`
}))

const links: { source: string; target: string }[] = [
  // === ZEP ===
  { source: "Zep", target: "Memory Systems" },
  { source: "Zep", target: "RAG" },
  { source: "Zep", target: "Knowledge Graphs" },
  { source: "Zep", target: "LLMs" },
  { source: "Zep", target: "Semantic Search" },

  // === CORE CONNECTIONS ===
  { source: "RAG", target: "LLMs" },
  { source: "RAG", target: "Embeddings" },
  { source: "RAG", target: "Semantic Search" },
  { source: "RAG", target: "Knowledge Graphs" },
  { source: "Memory Systems", target: "LLMs" },

  // === GRAPH ===
  { source: "Knowledge Graphs", target: "Graph Neural Networks" },
  { source: "Knowledge Graphs", target: "Graph Traversal" },
  { source: "Knowledge Graphs", target: "Graph Embeddings" },
  { source: "Graph Neural Networks", target: "Graph Embeddings" },
  { source: "Graph Neural Networks", target: "Embeddings" },
  { source: "Graph Traversal", target: "Graph Neural Networks" },
  { source: "Graph Embeddings", target: "Embeddings" },

  // === EMBEDDINGS & SEARCH ===
  { source: "Embeddings", target: "Cosine Similarity" },
  { source: "Embeddings", target: "Semantic Search" },
  { source: "Embeddings", target: "Multi-Vector Retrieval" },
  { source: "Cosine Similarity", target: "Semantic Search" },
  { source: "Semantic Search", target: "Multi-Vector Retrieval" },
  { source: "Multi-Vector Retrieval", target: "RAG" },

  // === BAYESIAN OPTIMIZATION ===
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

  // === REINFORCEMENT LEARNING ===
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
  }
]

function App() {
  const fgRef = useRef<any>(null)
  const spritesRef = useRef<Map<string, any>>(new Map())
  const [showNotes, setShowNotes] = useState<string | null>(null)

  const updateLabelVisibility = useCallback(() => {
    if (!fgRef.current) return
    const camera = fgRef.current.camera()
    const distance = camera.position.length()
    const showLabels = distance < 1500

    spritesRef.current.forEach((sprite) => {
      sprite.visible = showLabels
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
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', flexShrink: 0 }}>
            short note on <a href="https://arxiv.org/pdf/2501.13956" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>ZEP</a>
          </h2>
          <div style={{ maxHeight: '75vh', overflow: 'auto', border: '1px solid #000' }}>
            <img
              src="/zep-notes.png"
              alt="Zep Memory Retrieval Notes"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main>
      <div className="header-row">
        <h1 style={{ fontSize: '1.5rem' }}>sofia bodnar</h1>
        <nav className="nav-links">
          <a href="/"><img src="/cute.svg" alt="" style={{ height: '80px', marginRight: '-20px' }} /></a>
          <a href="#projects">projects</a>
          <a href="#mindset">mindset</a>
        </nav>
      </div>
      <p style={{ fontSize: '0.95rem' }}>17 y/o high school student</p>

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
            if (n.id === 'Zep') {
              setShowNotes('zep')
            } else if (n.url) {
              window.open(n.url, '_blank')
            }
          }}
        />
      </div>

      <div style={{ marginTop: '300px' }}>
        <h2 id="experience" style={{ fontSize: '0.9rem', fontWeight: 700 }}>experience</h2>
        {experiences.map((exp, index) => (
          <div key={index} style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '0.95rem' }}>{exp.title}<span style={{ fontWeight: 300 }}>, {exp.company}</span>
              <img src="/sentra.svg" alt="Sentra" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
              <img src="/mit.svg" alt="MIT" style={{ height: '28px', marginLeft: '4px', verticalAlign: 'middle' }} />
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{exp.date}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
