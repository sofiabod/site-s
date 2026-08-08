import './App.css'
import { useState, useEffect, useRef, type ReactNode } from 'react'

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

type Job = { company: string; role: string; url: string; logo: string; h: string; when: string; blurb: string; current?: boolean; round?: boolean }

const jobs: Job[] = [
  { company: "Shopify", role: "Software Engineering Intern", url: "https://www.shopify.com/ca", logo: "/shopify.svg", h: "15px", when: "jun 2026 — now", blurb: "building our river agent", current: true },
  { company: "Sentra", role: "Research Engineer", url: "https://www.sentra.app/", logo: "/sentra.svg", h: "14px", when: "oct 2025 — now", blurb: "memory theory, model compression, RL, and world models", current: true },
  { company: "CSS Lab", role: "Research Intern", url: "https://csslab.cs.toronto.edu/", logo: "/uoft.png", h: "20px", when: "may 2026 — now", blurb: "llm chess reasoning", current: true },
  { company: "Omen", role: "Software Engineer", url: "https://omen.trade/", logo: "/omen.svg", h: "14px", when: "9 months", blurb: "investment agents that automate trades" },
  { company: "Convictional", role: "Research Intern", url: "https://www.ycombinator.com/companies/convictional", logo: "/convictional.png", h: "18px", when: "3 months", blurb: "late-interaction retrieval", round: true },
]

type Card = { title: string; desc?: ReactNode; slug?: string; meta?: string; img?: string; href?: string }

const photos = ["/photos/photo1.jpeg", "/photos/photo2.jpeg", "/photos/photo3.jpeg", "/photos/photo4.jpeg"]

const publications: Card[] = [
  { title: "The Price of Meaning", meta: "arXiv", img: "/price-of-meaning.png", href: "https://arxiv.org/abs/2603.27116v1" },
  { title: "The Geometry of Forgetting", meta: "arXiv", img: "/geometry-of-forgetting.png", href: "https://arxiv.org/abs/2604.06222" },
]

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
      gc.strokeStyle = 'rgba(150, 150, 150, 0.16)'
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
      ctx.font = `100 ${fontSize}px "Helvetica Neue", monospace`
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
          const shade = 165 + Math.floor(Math.random() * 55)
          ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
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

  const navLinks = (
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
        <svg height="20" viewBox="0 0 24 24" fill="#000"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v3.3l7 3.8 7-3.8v-3.3l-7 3.8-7-3.8z" /></svg>
      </a>
    </nav>
  )

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
                  ? <span onClick={open} style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: '#999' }}>{p.title}</span>
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
          <div style={{ maxWidth: '520px', margin: '24px auto 0', textAlign: 'left', color: '#5a5a5a' }}>
            <p style={{ fontSize: '0.76rem', lineHeight: 1.8 }}>
              i am an incoming cs student @ <a href="https://cs.uwaterloo.ca/" target="_blank" rel="noopener noreferrer" className="hlink">uwaterloo</a>. i view myself as extremely ambitious, obsessed, and resilient.
            </p>

            <p style={{ fontSize: '0.76rem', marginTop: '16px', marginBottom: '4px' }}>some wins:</p>
            <ul style={{ fontSize: '0.76rem', lineHeight: 1.9, margin: '0 0 0 20px' }}>
              <li><span style={{ backgroundColor: '#e9f7ec', padding: '1px 5px', borderRadius: '3px' }}>the youngest intern</span> at <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer" className="hlink">shopify</a><img src="/shopify.svg" alt="Shopify" style={{ height: '15px', verticalAlign: 'middle', marginLeft: '5px' }} /> at 17</li>
              <li>in high school, worked as a software engineer across <span style={{ color: '#14532d', fontWeight: 600 }}>3 yc / a16z startups</span> + published 2 papers with an <img src="/mit.svg" alt="MIT" style={{ height: '19px', verticalAlign: 'middle', margin: '0 4px' }} /> prof</li>
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
                {jobs.map(j => (
                  <div key={j.company} className="job">
                    <span className="job-logo">
                      <img src={j.logo} alt={j.company} style={j.round ? { height: j.h, width: j.h, borderRadius: '50%', objectFit: 'cover' } : { height: j.h }} />
                    </span>
                    <div>
                      <div className="job-head">
                        <a href={j.url} target="_blank" rel="noopener noreferrer" className="hlink">{j.company}</a>
                        <span className="job-role">{j.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.76rem', lineHeight: 1.8, margin: '32px auto 0', maxWidth: '560px', color: '#5a5a5a' }}>
                in the past years, i've been pulled toward math and numbers, but early on it was business and finance that were ingrained in me. that looked like small side hustles, reselling books or running a <a href="https://www.instagram.com/infinitybouquets.ca/" target="_blank" rel="noopener noreferrer" className="hlink">small business</a> that sold <a href="https://www.tiktok.com/@infinitybouquets.ca" target="_blank" rel="noopener noreferrer" className="hlink">100+ bouquets</a>, until i realized the real leverage is what my mind can build, not just what i trade my time for.
              </p>
              <p style={{ fontSize: '0.76rem', lineHeight: 1.8, margin: '24px auto 0', maxWidth: '560px', color: '#5a5a5a' }}>
                some things i've built recently: <a href="https://github.com/cchang3906/spex" target="_blank" rel="noopener noreferrer" className="hlink">speculative tool execution that cuts coding-agent latency</a>, and the <a href="https://github.com/sofiabod/GRAPH-JEPA" target="_blank" rel="noopener noreferrer" className="hlink">first ever architecture of JEPA applied to temporal graphs</a>.
              </p>
            </div>
          )}

          {sub === 'publications' && (
            <div style={{ margin: '40px auto 0', maxWidth: '480px' }}>
              {cardGrid(publications)}
            </div>
          )}

          {sub === 'community' && (
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '0.76rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '560px', color: '#5a5a5a' }}>
                i love being around ambitious, like-minded people, so i help create spaces for them. i started <a href="https://www.axiomstartups.ca/" target="_blank" rel="noopener noreferrer" className="hlink">axiom</a>, a startup competition for youth, founded 3 clubs in high school, and helped host <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" className="hlink">g hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" className="hlink">claude x socratica</a>, and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" className="hlink">prism</a>.
              </p>
              <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
                {photos.map(src => (
                  <img key={src} src={src} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'mindset' && (
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', border: '1px solid #2f6fed', padding: '28px 34px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 500 }}>every waking hour is a working hour</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>your maximum is someone's minimum</p>
            <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '12px' }}>go above and beyond, over prepare, be obsessed</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>create your own opportunities</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>your time is extremely precious</p>
            <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '12px' }}>tired = weak</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '12px' }}>i think i can, therefore i can.</p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>"I work from the moment I wake up to the moment I<br />go to sleep" - Jensen Huang</p>
            <p style={{ fontSize: '0.85rem', marginTop: '12px' }}>
              <span style={{ backgroundColor: '#e6f0ff', padding: '1px 5px', borderRadius: '3px' }}>excellence is the capacity to take pain</span>
            </p>
          </div>
        </div>
      )}

    </main>
    </>
  )
}

export default App
