import './App.css'
import { useRef, useCallback } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'

const topics = [
  "ML", "Neural Networks", "Python", "Research", "Deep Learning", "NLP",
  "Computer Vision", "Transformers", "GPT", "BERT", "LLMs", "Attention",
  "CNN", "RNN", "LSTM", "GAN", "Diffusion", "Reinforcement Learning",
  "Q-Learning", "Policy Gradient", "PyTorch", "TensorFlow", "JAX",
  "NumPy", "Pandas", "Scikit-learn", "Keras", "HuggingFace", "OpenAI",
  "Anthropic", "Graph Neural Networks", "Embeddings", "Vector DB",
  "RAG", "Fine-tuning", "Prompt Engineering", "RLHF", "DPO",
  "Tokenization", "Word2Vec", "CLIP", "Stable Diffusion", "Midjourney",
  "Data Science", "Statistics", "Linear Algebra", "Calculus", "Probability",
  "Optimization", "Gradient Descent", "Backpropagation", "Loss Functions",
  "Activation Functions", "Dropout", "Batch Norm", "Layer Norm",
  "Residual Connections", "Self-Attention", "Multi-Head Attention",
  "Positional Encoding", "Beam Search", "Sampling", "Temperature",
  "Top-K", "Top-P", "Chain of Thought", "Few-Shot Learning",
  "Zero-Shot Learning", "Transfer Learning", "Pre-training", "MNIST",
  "ImageNet", "CIFAR", "Sentiment Analysis", "Named Entity Recognition",
  "Machine Translation", "Summarization", "Question Answering",
  "Text Generation", "Image Classification", "Object Detection",
  "Segmentation", "Autoencoders", "VAE", "Contrastive Learning",
  "SimCLR", "BYOL", "Knowledge Distillation", "Pruning", "Quantization",
  "Edge AI", "MLOps", "Weights & Biases", "MLflow", "Kubeflow",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "GPU", "TPU", "CUDA"
]

const nodes = topics.map((topic, i) => ({
  id: topic,
  gray: Math.floor(Math.random() * 200) + 30,
  url: `https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`
}))

const links: { source: string; target: string }[] = []
for (let i = 0; i < nodes.length; i++) {
  const numLinks = Math.floor(Math.random() * 3) + 1
  for (let j = 0; j < numLinks; j++) {
    const target = Math.floor(Math.random() * nodes.length)
    if (target !== i) {
      links.push({ source: nodes[i].id, target: nodes[target].id })
    }
  }
}

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
  const fgRef = useRef<any>()
  const spritesRef = useRef<Map<string, any>>(new Map())

  const updateLabelVisibility = useCallback(() => {
    if (!fgRef.current) return
    const camera = fgRef.current.camera()
    const distance = camera.position.length()
    const showLabels = distance < 1500

    spritesRef.current.forEach((sprite) => {
      sprite.visible = showLabels
    })
  }, [])

  return (
    <main>
      <h1 style={{ marginTop: '100px', fontSize: '1.5rem' }}>sofia bodnar</h1>
      <p style={{ fontSize: '0.95rem' }}>17 y/o high school student</p>

      <div style={{ position: 'absolute', right: '150px' }}>
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
          nodeThreeObject={(node) => {
            const n = node as { id?: string }
            const sprite = new SpriteText(n.id || '') as any
            sprite.fontFace = 'Manrope'
            sprite.fontWeight = '300'
            sprite.textHeight = 2
            sprite.color = '#000000'
            sprite.position.y = 6
            sprite.visible = false
            spritesRef.current.set(n.id || '', sprite)
            return sprite
          }}
          onEngineTick={updateLabelVisibility}
          onNodeClick={(node) => {
            const n = node as { url?: string }
            if (n.url) window.open(n.url, '_blank')
          }}
        />
      </div>

      <div style={{ marginTop: '300px' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700 }}>experience</h2>
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
