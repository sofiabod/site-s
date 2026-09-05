import './App.css'
import FltTree from './FltTree'
import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { EARTH } from './earth'

let _asciiLoaded = false
function initAsciiRenderer() {
  if (_asciiLoaded) return
  _asciiLoaded = true
  const s = document.createElement('script')
  s.src = '/ascii-renderer.umd.js'
  s.onload = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    const w = window as unknown as { AsciiRenderer: unknown }
    const AR = (typeof w.AsciiRenderer === 'function')
      ? w.AsciiRenderer as new (sel: string, opts: object) => unknown
      : (w.AsciiRenderer as { AsciiRenderer: new (sel: string, opts: object) => unknown }).AsciiRenderer
    new AR('#ascii', {
      videoSrc: '/butterfly.mp4',
      columns: 80,
      colored: true,
      charset: 'detailed',
      enableMouse: true,
      enableRipple: true,
      rippleSpeed: 60,
      blend: 20,
      brightness: 1.4,
      autoPlay: true,
      onError: (msg: string) => console.error('AsciiRenderer error:', msg),
    })
  }))
  s.onerror = () => console.error('failed to load ascii-renderer.umd.js')
  document.head.appendChild(s)
}

type Job = { company: string; role: string; url: string; logo: string; h: string; hov: string; description?: string; current?: boolean; round?: boolean }

const jobs: Job[] = [
  { company: "Shopify", role: "Software Engineering Intern", url: "https://www.shopify.com/ca", logo: "/shopify.svg", h: "15px", hov: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(/shopify-bg.jpeg) center 38%/100% auto", description: "built infrastructure for reliable AI agents across evaluation, memory, data pipelines, and dynamic workflows.", current: true },
  { company: "Sentra", role: "Research Engineer", url: "https://www.sentra.app/", logo: "/sentra.svg", h: "20px", hov: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(/sentra-bg.jpeg) center 45%/100% auto", description: "built memory, retrieval, and evaluation infrastructure for self-improving agents—spanning entity resolution, adaptive RAG, durable citations, bi-temporal memory, and hallucination defense—while researching RL and predictive world models.", current: true },
  { company: "CSS Lab", role: "Research Intern", url: "https://csslab.cs.toronto.edu/", logo: "/uoft.png", h: "20px", hov: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(/csslab-bg.jpeg) center 42%/auto 260% repeat", description: "worked with the team behind Maia, human-like chess models that predict how people play across skill levels; built a dynamic data-selection method that lets a teacher model choose which examples a student learns from.", current: true },
  { company: "Omen", role: "Software Engineer", url: "https://omen.trade/", logo: "/omen.svg", h: "14px", hov: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(/omen-bg2.jpeg) center 38%/100% auto", description: "built agent-driven financial workflows for an all-in-one trading platform spanning prediction markets, perpetual futures, crypto, and equities." },
  { company: "Convictional", role: "Software Engineering Intern", url: "https://www.linkedin.com/company/convictional/posts/?feedView=all", logo: "/convictional.png", h: "18px", hov: "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(/conv-bg.jpeg) center 38%/100% auto", description: "MUVERA and ColBERT v2 for late-interaction search.", round: true },
]

type Card = { title: string; desc?: ReactNode; slug?: string; meta?: string; img?: string; href?: string }

const photos = ["/photos/photo1.jpeg", "/photos/photo2.jpeg", "/photos/photo3.jpeg", "/photos/photo4.jpeg"]

const publications: Card[] = [
  { title: "The Price of Meaning", meta: "arXiv", img: "/price-of-meaning.png", href: "https://arxiv.org/abs/2603.27116v1" },
  { title: "The Geometry of Forgetting", meta: "arXiv", img: "/geometry-of-forgetting.png", href: "https://arxiv.org/abs/2604.06222" },
]


const FIGURE_GRID_STEP = 22
const GEOMETRY_FIGURE_WIDTH = FIGURE_GRID_STEP * 12 + 1
const GEOMETRY_FIGURE_HEIGHT = FIGURE_GRID_STEP * 11 + 1

function snapFigureToGrid(value: number) {
  return Math.max(0, Math.round(value / FIGURE_GRID_STEP) * FIGURE_GRID_STEP)
}

function useSnappedFigurePositions() {
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const waveWidth = Math.floor(viewport.width / FIGURE_GRID_STEP) * FIGURE_GRID_STEP + FIGURE_GRID_STEP * 8 + 1
  const waveHeight = FIGURE_GRID_STEP * 20 + 1

  return {
    wave: {
      left: Math.round(((viewport.width - waveWidth) / 2) / FIGURE_GRID_STEP) * FIGURE_GRID_STEP,
      top: snapFigureToGrid(viewport.height * 0.42 - waveHeight / 2),
      width: waveWidth,
      height: waveHeight,
    },
    geometry: {
      left: FIGURE_GRID_STEP,
      top: snapFigureToGrid(viewport.height - FIGURE_GRID_STEP - GEOMETRY_FIGURE_HEIGHT),
    },
  } satisfies Record<'wave' | 'geometry', CSSProperties>
}

function WaveMathFigure({ style }: { style: CSSProperties }) {
  const [focusY, setFocusY] = useState(0.5)

  useEffect(() => {
    let frame = 0
    let next = 0.5
    const reshape = (event: PointerEvent) => {
      next = Math.max(0, Math.min(1, event.clientY / window.innerHeight))
      if (frame) return
      frame = requestAnimationFrame(() => {
        setFocusY(next)
        frame = 0
      })
    }
    window.addEventListener('pointermove', reshape, { passive: true })
    return () => {
      window.removeEventListener('pointermove', reshape)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <figure className="floating-math-card math-card-one" style={style} aria-hidden="true">
      <div className="floating-math-inner">
        <div className="floating-math-art">
          <svg className="math-art math-wave" viewBox="0 0 240 160" preserveAspectRatio="none">
            {Array.from({ length: 46 }, (_, i) => {
              const startY = 6 + i * (148 / 45)
              const endY = 154 - i * (148 / 45)
              const emphasis = Math.max(0, 1 - Math.abs(i / 45 - focusY) * 5)
              return (
                <path
                  key={i}
                  d={`M 0 ${startY} C 48 ${startY}, 74 80, 90 80 L 150 80 C 166 80, 192 ${endY}, 240 ${endY}`}
                  style={{ strokeOpacity: 0.28 + emphasis * 0.12 }}
                />
              )
            })}
          </svg>
        </div>
      </div>
    </figure>
  )
}

function TriangleGeometryFigure({ style }: { style: CSSProperties }) {
  return (
    <figure className="floating-math-card math-card-geometry" style={style}>
      <svg className="geometry-art" viewBox="105 50 710 520" role="img" aria-label="Geometry construction for triangle BIC and the circle with diameter ST">
        <path className="geometry-triangle-fill" d="M 300.1 83 L 329.5 423 L 784.6 423 Z" />
        <circle className="geometry-circle geometry-circle-construction" cx="365.9" cy="196.9" r="131.4" />
        <circle className="geometry-circle geometry-circle-left" cx="306.6" cy="400" r="163" />
        <circle className="geometry-circle geometry-circle-right" cx="494.3" cy="314.2" r="125.6" />
        <circle className="geometry-circle geometry-circle-inner" cx="431.7" cy="311.6" r="111.5" />

        <path className="geometry-triangle" d="M 300.1 83 L 329.5 423 L 784.6 423 Z" />
        <path className="geometry-diagonal" d="M 144.9 422.8 L 495.4 220.1" />
        <path className="geometry-dashed-line" d="M 144.9 422.8 L 468.2 375" />
        <path className="geometry-construction-line" d="M 495.4 220.1 L 468.2 375" />
        <path className="geometry-bic-triangle" d="M 329.5 423 L 431.7 311.6 L 784.6 423 Z" />

        {[
          [300.1, 83], [329.5, 423], [784.6, 423], [144.9, 422.8], [321.1, 321.1], [495.4, 220.1],
          [431.7, 311.6], [468.2, 375], [380.8, 367.1], [608.1, 367.3], [557.3, 423],
        ].map(([cx, cy], index) => <circle className="geometry-point" key={index} cx={cx} cy={cy} r="4.8" />)}

        <g className="geometry-labels">
          <text x="276" y="82">A</text>
          <text x="317" y="449">B</text>
          <text x="773" y="449">C</text>
          <text x="119" y="441">T</text>
          <text x="297" y="322">F</text>
          <text x="500" y="216">E</text>
          <text x="413" y="315">I</text>
          <text x="451" y="400">S</text>
        </g>
      </svg>
      <a
        className="geometry-caption"
        href="https://web.evanchen.cc/problems.html"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the directory of cool geometry problems"
      >
        <span className="geometry-caption-copy">
          <span className="geometry-caption-title">directory of cool geometry problems</span>
          <span className="geometry-source">Problem source: Taiwan TST Quiz 2015</span>
        </span>
        <span className="geometry-caption-arrow" aria-hidden="true">↗</span>
      </a>
    </figure>
  )
}

function SideMathFigures() {
  const positions = useSnappedFigurePositions()

  return (
    <div className="side-math-figures">
      <WaveMathFigure style={positions.wave} />
      <TriangleGeometryFigure style={{ ...positions.geometry, width: GEOMETRY_FIGURE_WIDTH, height: GEOMETRY_FIGURE_HEIGHT }} />
    </div>
  )
}

const gjSections = [
  { id: "overview", label: "overview" },
  { id: "method", label: "method" },
  { id: "evaluations", label: "evaluations" },
  { id: "results", label: "results" },
  { id: "models", label: "pretrained models" },
  { id: "citation", label: "citation" },
]

const matrixRows = [
  ["BACI Gravity", "bilateral commodity trade", "7.03", "✓", "95.8%", "<10⁻³⁰ all seeds"],
  ["TGBN-Trade", "country-pair trade", "7.97", "✓", "77.3%", "<10⁻²⁶ all seeds"],
  ["ICIO", "sectoral input-output", "2.54", "✗", "98.5%", "<10⁻⁷ all seeds"],
  ["JODIE Reddit u-u", "social co-interaction", "11.44", "✗", "71.7%", "10⁻⁶⁵ to 2×10⁻³"],
  ["JODIE Wiki u-u", "wiki editing co-interaction", "3.44", "✗", "52.6%", "7×10⁻⁵⁹ to 0.95"],
  ["DBLP", "academic coauthorship", "8.31", "✓", "38% mean", "bimodal"],
  ["Enron", "corporate emails", "8.83", "✓", "44%", "losses w/ tight CI"],
  ["METR-LA", "highway traffic", "18.28 (seq=7.07)", "✗", "8%", "p=1 all seeds"],
]

const advantageRows = [
  ["BACI Gravity", "+0.198", "[+0.177, +0.224]", "95.8%", "1.1×10⁻³⁰", "1.00"],
  ["TGBN-Trade", "+0.084", "[+0.069, +0.103]", "77.3%", "3.8×10⁻²⁶", "1.00"],
  ["ICIO", "+0.038", "[+0.029, +0.046]", "98.5%", "6.0×10⁻⁸", "1.00"],
  ["JODIE Reddit u-u", "+0.105", "[+0.076, +0.130]", "71.7%", "8.3×10⁻⁶⁵", "1.00"],
  ["JODIE Wiki u-u", "+0.058", "[+0.041, +0.074]", "52.6%", "5.6×10⁻⁵⁸", "1.00"],
  ["DBLP", "−0.016", "[−0.137, +0.120]", "38.3%", "3.2×10⁻¹²⁸", "−0.20"],
  ["Enron", "−0.046", "[−0.084, −0.006]", "38.1%", "0.92", "−0.60"],
  ["METR-LA", "−0.004", "[−0.005, −0.003]", "7.8%", "1.0", "−1.00"],
]

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table className="post-table">
      <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>
  )
}

function Post({ title, subtitle, sections, onBack, children }: { title: string; subtitle?: string; sections: { id: string; label: string }[]; onBack: () => void; children: ReactNode }) {
  const [active, setActive] = useState(sections[0].id)
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-10% 0px -70% 0px' }
    )
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [sections])
  return (
    <div className="post">
      <aside className="post-nav">
        <button onClick={onBack} className="post-back">← back</button>
        <nav>
          {sections.map(s => <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>{s.label}</a>)}
        </nav>
      </aside>
      <article className="post-body">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 500 }}>{title}</h1>
        {subtitle && <p className="post-sub">{subtitle}</p>}
        {children}
      </article>
    </div>
  )
}

function VisitCount() {
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    fetch('https://abacus.jasoncameron.dev/hit/sofiabodnar-site/visits')
      .then(r => r.json())
      .then(d => setN(d.value))
      .catch(() => {})
  }, [])
  if (n === null) return null
  return <div className="visit-count">site visits: {n.toLocaleString()}</div>
}

function SocialLinks() {
  return (
    <nav className="nav-links">
      <a href="https://www.linkedin.com/in/sofiia-bodnar/" target="_blank" rel="noopener noreferrer">
        <img src="/Linkedin.svg" alt="LinkedIn" style={{ height: '20px' }} />
      </a>
      <a href="https://github.com/sofiabod" target="_blank" rel="noopener noreferrer">
        <img src="/github.svg" alt="GitHub" style={{ height: '20px' }} />
      </a>
      <a href="https://x.com/sofiiabodnar" target="_blank" rel="noopener noreferrer">
        <img src="/x.svg" alt="X" style={{ height: '20px' }} />
      </a>
      <a href="https://scholar.google.ca/citations?hl=en&user=Z9eQbAEAAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
        <svg height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v3.3l7 3.8 7-3.8v-3.3l-7 3.8-7-3.8z" /></svg>
      </a>
    </nav>
  )
}

function WebringWidget() {
  const webringUrl = 'https://cs.uwatering.com/#sofiabodnar.com'

  return (
    <nav className="webring-widget" aria-label="CS Webring navigation">
      <a className="webring-arrow" href={`${webringUrl}?nav=prev`} aria-label="Previous CS Webring site">{'<'}</a>
      <a href={webringUrl} target="_blank" rel="noopener noreferrer" aria-label="Open the CS Webring">
        <img src="https://cs.uwatering.com/icon.black.svg" alt="" />
      </a>
      <a className="webring-arrow" href={`${webringUrl}?nav=next`} aria-label="Next CS Webring site">{'>'}</a>
    </nav>
  )
}

function GraphJepaPost({ onBack }: { onBack: () => void }) {
  return (
    <Post title="Graph-JEPA" subtitle="Learning the Dynamics of Relational Worlds by Observation" sections={gjSections} onBack={onBack}>
        <section id="overview">
          <h2>overview</h2>
          <p>Graph-JEPA is a joint-embedding predictive architecture for temporal graphs at the node level: self-supervised learning of relational, temporal data. It is the first application of JEPA to this setting.</p>
        </section>

        <section id="method">
          <h2>method</h2>
          <p>At a high level, Graph-JEPA predicts the representation of one entity at one timestep — a node-at-time (v, τ) — from the representations of the rest of the temporal graph context. A scene is a graph snapshot; a video is the graph evolving.</p>
          <p>Notably, this approach learns relational dynamics:</p>
          <ul>
            <li>without relying on hand-crafted graph augmentations or pre-specified invariances, which tend to be biased for particular downstream tasks;</li>
            <li>and without having the model reconstruct edge-level details (e.g. bilateral flow magnitudes in a single year), which are dominated by reporting noise rather than signal.</li>
          </ul>
        </section>

        <section id="evaluations">
          <h2>evaluations</h2>
          <p>Action-free pretraining yields a substrate evaluated on two probe families; planning is not addressed. Across 8 datasets in 7 domains, two empirical signatures of learned dynamics emerge and dissociate cleanly.</p>
          <p>Compression to ~8 effective dimensions appears across three distinct domains; a graph-aware encoder beats a capacity-matched non-graph ablation on next-state prediction across three relation types. The two findings appear and disappear independently across the matrix.</p>
        </section>

        <section id="results">
          <h2>results</h2>
          <p><strong>8-dataset matrix.</strong></p>
          <Table headers={["dataset", "domain", "eff_rank", "d≈8?", "win rate", "per-seed p"]} rows={matrixRows} />
          <p><strong>Per-dataset prediction advantage.</strong> Δcos = graph − non-graph; 5 seeds, paired Wilcoxon, Bonferroni-corrected over the 8-dataset matrix.</p>
          <Table headers={["dataset", "Δcos (mean)", "95% CI", "win rate", "corrected p", "Cliff's δ"]} rows={advantageRows} />
        </section>

        <section id="models">
          <h2>pretrained models</h2>
          <p>Per-dataset, per-seed stamped outputs (git_sha + dataset SHA256 + deterministic flag) live under <code>paper_results/</code>, 5 seeds each across all 8 datasets. For the full reproduction protocol, see <code>REPRODUCE.md</code>.</p>
        </section>

        <section id="citation">
          <h2>citation</h2>
          <pre className="post-cite">{`@misc{bodnar2026graphjepa,
  title  = {Graph-JEPA: Learning the Dynamics of Relational Worlds
            by Observation},
  author = {Bodnar, Sofia},
  year   = {2026},
  note   = {Graph-JEPA-2 codebase}
}`}</pre>
        </section>
    </Post>
  )
}

const spexSections = [
  { id: "overview", label: "overview" },
  { id: "method", label: "method" },
  { id: "results", label: "results" },
  { id: "build", label: "build" },
]

function SpexPost({ onBack }: { onBack: () => void }) {
  return (
    <Post title="Spex" subtitle="Speculative Tool Execution for Agents" sections={spexSections} onBack={onBack}>
        <section id="overview">
          <h2>overview</h2>
          <p>Spex is a speculative execution layer for coding agents. Instead of waiting for each tool result before deciding the next step, Spex predicts likely upcoming tool calls and runs them ahead of time, so the results are already cached when the agent asks. It is the agent-tool-loop analogue of speculative decoding, and it is <span style={{ fontWeight: 600 }}>lossless</span>: it removes the wait without changing what the agent solves.</p>
        </section>

        <section id="method">
          <h2>method</h2>
          <p>The predictor is a zero-token lookup table, not an LLM. We mined 2,146 real agent trajectories with PrefixSpan to build a transition-probability matrix over tool chains, focused on the highest-value vertical: coding verification.</p>
          <div className="diagram">
            <span className="dbox">2,146 trajectories</span>
            <span className="darrow">→</span>
            <span className="dbox">PrefixSpan mining</span>
            <span className="darrow">→</span>
            <span className="dbox">transition matrix</span>
            <span className="darrow">→</span>
            <span className="dbox">shadow queue</span>
            <span className="darrow">→</span>
            <span className="dbox">cached result</span>
          </div>
          <p>At runtime a shadow queue speculatively executes up to 2 tools in parallel under local compute budgets. When a speculation matches the agent's actual next call, its cached result is promoted to the main queue; misses are discarded.</p>
          <div className="lanes">
            <div className="lane"><span className="lane-label">agent</span><div className="lane-track"><span className="seg">think</span><span className="seg">think</span></div></div>
            <div className="lane"><span className="lane-label">shadow</span><div className="lane-track"><span className="seg spec">spec tool A</span><span className="seg spec">spec tool B</span></div></div>
            <div className="lane"><span className="lane-label">on hit</span><div className="lane-track"><span className="seg hit">promote → cache</span></div></div>
          </div>
        </section>

        <section id="results">
          <h2>results</h2>
          <p>Evaluated on 42 SWE-bench Verified instances across 7 repositories, 84 sealed runs (baseline vs Spex).</p>
          <div className="bars">
            <div className="bar-row"><span className="bar-label">baseline</span><div className="bar" style={{ width: '100%' }}>2,715,988 ms</div></div>
            <div className="bar-row"><span className="bar-label">spex</span><div className="bar spex" style={{ width: '86.1%' }}>2,338,733 ms</div><span className="bar-saved">−13.9%</span></div>
          </div>
          <ul>
            <li>13.9% less trace wall time at identical resolution (2,338,733 ms vs 2,715,988 ms baseline)</li>
            <li>80% of verification calls served from cache (88 of 110)</li>
            <li>44,592 ms of verifier time hidden, up to 6.6 s per call</li>
            <li>resolution unchanged: 38 of 42 solved in both baseline and Spex (lossless)</li>
            <li>the agent verified 64% more often (110 vs 67 calls) while still finishing faster</li>
          </ul>
        </section>

        <section id="build">
          <h2>build</h2>
          <p>Built spec by spec: one Codex session per written specification implemented the core subsystems, with humans making the product decisions. Authoring and accelerated model: GPT-5.6. The repo splits into <code>speculator/</code> (daemon, tests, bench harness), <code>mining/</code> and <code>data/</code> (trajectory analysis and pattern tables), <code>documentation/</code> (specs), and <code>blog/</code> (this write-up). MIT licensed.</p>
        </section>
    </Post>
  )
}

const PI_DIGITS =
  '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067' +
  '9821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819' +
  '6442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127'

function PiFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const fontSize = 11
    const step = 22
    let raf = 0
    let last = 0
    let cols = 0
    let rows = 0
    let drops: number[] = []
    let mx = -1
    let my = -1
    let overRain = false

    // rain begins near the bottom mid-page and higher up toward the edges
    const startYAt = (x: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const edge = Math.abs(x - w / 2) / (w / 2)
      return h - 170 - h * 0.45 * Math.pow(edge, 2.2)
    }

    const drawGrid = () => {
      const g = gridRef.current!
      const w = window.innerWidth
      const h = window.innerHeight
      g.width = w
      g.height = h
      const gc = g.getContext('2d')!
      gc.strokeStyle = 'rgba(178, 190, 197, 0.14)'
      gc.lineWidth = 1
      gc.beginPath()
      for (let x = 0.5; x <= w; x += step) { gc.moveTo(x, 0); gc.lineTo(x, h) }
      for (let y = 0.5; y <= h; y += step) { gc.moveTo(0, y); gc.lineTo(w, y) }
      gc.stroke()

      const maskC = document.createElement('canvas')
      maskC.width = w
      maskC.height = h
      const mk = maskC.getContext('2d')!
      mk.filter = 'blur(26px)'
      mk.beginPath()
      mk.moveTo(0, startYAt(0))
      for (let x = 10; x <= w; x += 10) mk.lineTo(x, startYAt(x))
      mk.lineTo(w, h)
      mk.lineTo(0, h)
      mk.closePath()
      mk.fillStyle = '#000'
      mk.fill()
      gc.globalCompositeOperation = 'destination-in'
      gc.drawImage(maskC, 0, 0)
      const fade = gc.createLinearGradient(0, 0, 0, h)
      fade.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
      fade.addColorStop(0.6, 'rgba(0, 0, 0, 0.7)')
      fade.addColorStop(1, 'rgba(0, 0, 0, 1)')
      gc.fillStyle = fade
      gc.fillRect(0, 0, w, h)
      gc.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
      cols = canvas.width / step
      rows = Math.floor(canvas.height / step)
      drops = Array.from({ length: rows }, () => Math.random() * cols)
      ctx.font = `300 ${fontSize}px "Helvetica Neue", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 120) return
      last = t
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
      for (let r = 0; r < rows; r++) {
        const cell = Math.floor(drops[r])
        const x = cell * step + step / 2
        const y = r * step + 0.5
        const edge = Math.abs(x - canvas.width / 2) / (canvas.width / 2)
        // streams only show inside the grid region, middle stays clear
        if (edge >= 0.4 && y > startYAt(x)) {
          const alpha = 0.20 + Math.random() * 0.24
          ctx.fillStyle = `rgba(178, 190, 197, ${alpha})`
          const digit = PI_DIGITS[(r * 47 + cell) % PI_DIGITS.length]
          ctx.fillText(digit, x, y - 1)
        }
        if (drops[r] > cols) drops[r] = -Math.random() * 25
        drops[r] += 0.5
      }
      if (overRain) {
        const r = 90 + Math.sin(t / 300) * 12
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, r)
        g.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        g.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = g
        ctx.fillRect(mx - r, my - r, r * 2, r * 2)
      }
    }
    raf = requestAnimationFrame(draw)

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const edge = Math.abs(e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      overRain = edge >= 0.4 && e.clientY > startYAt(e.clientX)
    }
    window.addEventListener('mousemove', move)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <div className="pi-fall">
      <canvas ref={gridRef} />
      <canvas ref={canvasRef} />
    </div>
  )
}

const EARTH_ROWS = EARTH.split('\n').filter(r => r.length > 0)
const TEX_H = EARTH_ROWS.length
const TEX_W = Math.max(...EARTH_ROWS.map(r => r.length))

function AsciiGlobe() {
  const [frame, setFrame] = useState('')
  const yaw = useRef(0)
  const pitch = useRef(0.4)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const dirty = useRef(true)

  useEffect(() => {
    const W = 56, H = 28, cx = 28, cy = 14, rx = 22, ry = 13.2
    const MAP: Record<string, string> = { '.': '.', H: '+', g: '*', '@': '$' }
    let raf = 0
    const loop = () => {
      if (!dirty.current) { raf = requestAnimationFrame(loop); return }
      dirty.current = false
      const buf = new Array(W * H).fill(' ')
      const zb = new Array(W * H).fill(-Infinity)
      const cyw = Math.cos(yaw.current), syw = Math.sin(yaw.current)
      const cp = Math.cos(pitch.current), sp = Math.sin(pitch.current)
      for (let t = 0; t <= Math.PI; t += 0.02) {
        const st = Math.sin(t), ct = Math.cos(t)
        const trow = EARTH_ROWS[Math.min(TEX_H - 1, Math.floor(t / Math.PI * TEX_H))]
        for (let p = 0; p < Math.PI * 2; p += 0.012) {
          const x0 = st * Math.cos(p), y0 = ct, z0 = st * Math.sin(p)
          const tcol = Math.min(TEX_W - 1, Math.floor(p / (Math.PI * 2) * TEX_W))
          const ch = MAP[trow[tcol] ?? '.'] ?? '.'
          const x1 = x0 * cyw + z0 * syw
          const z1 = -x0 * syw + z0 * cyw
          const y2 = y0 * cp - z1 * sp
          const z2 = y0 * sp + z1 * cp
          const sxp = Math.round(cx + x1 * rx)
          const syp = Math.round(cy - y2 * ry)
          if (sxp < 0 || sxp >= W || syp < 0 || syp >= H) continue
          const idx = syp * W + sxp
          if (z2 > zb[idx]) { zb[idx] = z2; buf[idx] = ch }
        }
      }
      let out = ''
      for (let r = 0; r < H; r++) out += buf.slice(r * W, r * W + W).join('') + '\n'
      setFrame(out)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <pre
      onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); dirty.current = true }}
      onPointerMove={e => { if (!drag.current) return; yaw.current += (e.clientX - drag.current.x) * 0.012; pitch.current = Math.max(-1.4, Math.min(1.4, pitch.current + (e.clientY - drag.current.y) * 0.012)); drag.current = { x: e.clientX, y: e.clientY }; dirty.current = true }}
      onPointerUp={() => { drag.current = null }}
      onPointerLeave={() => { drag.current = null }}
      style={{ fontFamily: 'monospace', fontSize: '4.5px', lineHeight: '4.5px', color: 'var(--ink)', cursor: 'grab', userSelect: 'none', margin: '32px auto 0', width: 'fit-content' }}
    >{frame}</pre>
  )
}

const PRIMARY = ['work', 'mindset'] as const
type Primary = typeof PRIMARY[number]
const SUBS = ['experience', 'publications', 'community'] as const
type Sub = typeof SUBS[number]

function App() {
  const [tab, setTab] = useState<Primary>(() => {
    const saved = localStorage.getItem('tab') as Primary | null
    return saved && PRIMARY.includes(saved) ? saved : 'work'
  })
  const [sub, setSub] = useState<Sub>('experience')
  const [post, setPost] = useState<string | null>(null)
  useEffect(() => { localStorage.setItem('tab', tab) }, [tab])
  useEffect(() => { initAsciiRenderer() }, [])
  if (post === 'graph-jepa') return <GraphJepaPost onBack={() => setPost(null)} />
  if (post === 'spex') return <SpexPost onBack={() => setPost(null)} />

  const navLinks = <SocialLinks />

  const cardGrid = (list: Card[]) => (
    <div className="project-grid">
      {list.map(p => {
        const open = p.slug ? () => setPost(p.slug!) : undefined
        const thumbClass = `pcard-thumb${p.img ? ' pcard-thumb-img' : ' pcard-ph-box'}`
        const thumb = p.img ? <img src={p.img} alt={p.title} /> : <span className="pcard-ph">{p.title.split(':')[0]}</span>
        return (
          <div key={p.title} className="pcard">
            {p.href
              ? <a className={thumbClass} href={p.href} target="_blank" rel="noopener noreferrer">{thumb}</a>
              : <div className={thumbClass} onClick={open} style={{ cursor: open ? 'pointer' : 'default' }}>{thumb}</div>}
            <h3 className="pcard-title">
              {p.href
                ? <a href={p.href} target="_blank" rel="noopener noreferrer" className="hlink">{p.title}</a>
                : open
                  ? <span onClick={open} style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--muted)' }}>{p.title}</span>
                  : p.title}
            </h3>
            {p.meta && <p className="pcard-meta">{p.meta}</p>}
            {p.desc && <p className="pcard-desc">{p.desc}</p>}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
    <PiFall />
    <div id="ascii-widget"><div id="ascii"></div></div>
    <SideMathFigures />
    <FltTree />
    <main>
      <div>
        <div className="header-row">
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 400, marginBottom: '0px', textAlign: 'center', fontFamily: 'Lora, "Lora Fallback", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>Sofia Bodnar</h1>
          </div>
          {navLinks}
        </div>

        <div className="mode-nav">
          {PRIMARY.map(t => (
            <div key={t} className={`nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} data-mode={t}>{t}</div>
          ))}
        </div>
      </div>

      {tab === 'work' && (
        <>
          <div style={{ maxWidth: '520px', margin: '24px auto 0', textAlign: 'left', color: 'var(--muted)' }}>
            <p style={{ fontSize: '0.76rem', lineHeight: 1.8 }}>
              i am a first year cs student at the <img src="/uwaterloo.png" alt="University of Waterloo" style={{ height: '19px', verticalAlign: 'middle', marginRight: '5px', marginTop: '-3px' }} /><a href="https://cs.uwaterloo.ca/" target="_blank" rel="noopener noreferrer" className="hlink">University of Waterloo</a>. i view myself as extremely ambitious, obsessed, and resilient.
            </p>

            <p style={{ fontSize: '0.76rem', marginTop: '16px', marginBottom: '4px' }}>some wins:</p>
            <ul style={{ fontSize: '0.76rem', lineHeight: 1.9, margin: '0 0 0 20px' }}>
              <li>interned @ <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer" className="hlink">shopify</a><img src="/shopify.svg" alt="Shopify" style={{ height: '15px', verticalAlign: 'middle', marginLeft: '5px' }} /> at <span style={{ backgroundColor: 'rgba(103, 170, 249, 0.14)', padding: '1px 5px', borderRadius: '3px' }}>17 yrs old</span></li>
              <li>in high school, i worked as a software engineer across 3 yc / a16z startups and published 2 papers with an <img src="/mit.svg" alt="MIT" style={{ height: '19px', verticalAlign: 'middle', margin: '0 4px' }} /> prof</li>
              <li>started from complete, absolute zero after moving from ukraine, and i take great pride in that</li>
            </ul>
          </div>

          <div className="mode-nav" style={{ marginTop: '28px' }}>
            {SUBS.map(s => (
              <div key={s} className={`nav-item ${sub === s ? 'active' : ''}`} onClick={() => setSub(s)} data-mode={s}>{s}</div>
            ))}
          </div>

          {sub === 'experience' && (
            <div style={{ margin: '24px auto 0', maxWidth: '520px' }}>
              <div className="jobs">
                <div className="job-year-label">2026</div>
                {jobs.filter(j => j.current).map(j => (
                  <a key={j.company} href={j.url} target="_blank" rel="noopener noreferrer" className="job" style={{ ['--hov' as string]: j.hov }}>
                    <span className="job-logo">
                      <img src={j.logo} alt={j.company} style={j.round ? { height: j.h, width: j.h, borderRadius: '50%', objectFit: 'cover' } : { height: j.h }} />
                    </span>
                    <div className="job-main">
                      <div className="job-head">
                        <span className="hlink">{j.company}</span>
                        <span className="job-role">{j.role}</span>
                      </div>
                      {j.description && <p className="job-description">{j.description}</p>}
                    </div>
                  </a>
                ))}
                <div className="job-year-label">2025</div>
                {jobs.filter(j => !j.current).map(j => (
                  <a key={j.company} href={j.url} target="_blank" rel="noopener noreferrer" className="job" style={{ ['--hov' as string]: j.hov }}>
                    <span className="job-logo">
                      <img src={j.logo} alt={j.company} style={j.round ? { height: j.h, width: j.h, borderRadius: '50%', objectFit: 'cover' } : { height: j.h }} />
                    </span>
                    <div className="job-main">
                      <div className="job-head">
                        <span className="hlink">{j.company}</span>
                        <span className="job-role">{j.role}</span>
                      </div>
                      {j.description && <p className="job-description">{j.description}</p>}
                    </div>
                  </a>
                ))}
              </div>
              <div className="experience-notes">
                some things i've built recently:
                <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                  <li style={{ marginTop: '6px' }}><a href="https://github.com/sofiabod/spex" target="_blank" rel="noopener noreferrer" className="hlink">Speculative Tool Execution for Verification Tasks</a></li>
                  <li style={{ marginTop: '6px' }}><a href="https://github.com/sofiabod/GRAPH-JEPA" target="_blank" rel="noopener noreferrer" className="hlink">Graph-JEPA: Applying the JEPA Architecture to Temporal Graphs</a></li>
                </ul>
              </div>
            </div>
          )}

          {sub === 'publications' && (
            <div style={{ margin: '40px auto 0', maxWidth: '480px' }}>
              {cardGrid(publications)}
            </div>
          )}

          {sub === 'community' && (
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '0.76rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '560px', color: 'var(--muted)' }}>
                i love being around ambitious, like-minded people, so i help create spaces for them. i started <a href="https://luma.com/7epaq2w3" target="_blank" rel="noopener noreferrer" className="hlink">axiom</a>, a startup competition for youth, founded 3 clubs in high school, and helped host <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" className="hlink" style={{ whiteSpace: 'nowrap' }}>g hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" className="hlink">claude x socratica</a>, and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" className="hlink">prism</a>.
              </p>
              <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                {photos.map((src, i) => {
                  const href = i === 0 ? 'https://luma.com/7epaq2w3' : i === 1 ? 'https://luma.com/lob2kpxt' : 'https://lu.ma/ufdrjn3n'
                  return (
                    <a key={src} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                      <div className="photo-flip">
                        <img src={src} alt="" />
                        <img className="photo-flip-cover" src={src.replace('.jpeg', '-cover.jpeg')} alt="" />
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'mindset' && (
        <div className="mindset-page">
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', border: '1px solid var(--accent)', padding: '28px 34px', maxWidth: '400px' }}>
            <p style={{ fontSize: '0.72rem' }}>every waking hour is a working hour</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>your maximum is someone's minimum</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>patience + repetition</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>go above and beyond, over prepare, be obsessed</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>create your own opportunities</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>your time is extremely precious</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>don't make decisions you will regret</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>if i can breathe i can think, and if i can think i can win</p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>"I work from the moment I wake up to the moment I<br />go to sleep" - Jensen Huang</p>
            <p className="mindset-quote"><span style={{ backgroundColor: '#EDF9FF', padding: '1px 5px', borderRadius: '3px' }}>excellence is the capacity to take pain</span></p>
          </div>
        </div>
        <AsciiGlobe />
        <p style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: '10px', color: 'var(--muted)' }}>the world is yours</p>
        </div>
      )}

      {tab === 'mindset' && (
        <div className="footer-banner photo-flip">
          <img src="/photos/banner.jpeg" alt="" />
          <img className="photo-flip-cover" src="/photos/banner.png" alt="" />
        </div>
      )}
      <footer className="site-footer">
        <VisitCount />
        <WebringWidget />
      </footer>
    </main>
    </>
  )
}

export default App
