import './App.css'
import { useState, useEffect } from 'react'

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

interface Experience {
  title: string
  company: string
  date: string
}

const experiences: Experience[] = [
  {
    title: "Software Engineering Intern",
    company: "Shopify",
    date: "jun 2026 - current"
  },
  {
    title: "Research Engineer",
    company: "Sentra",
    date: "oct 2025 - current"
  },
  {
    title: "Software Engineer",
    company: "Omen",
    date: "sep 2025 - current"
  },
  {
    title: "Research Engineer",
    company: "Convictional",
    date: "july 2025 - aug 2025"
  }
]

const MODES = ['work', 'publications', 'random', 'mindset'] as const
type Mode = typeof MODES[number]

function App() {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('mode') as Mode | null
    return saved && MODES.includes(saved) ? saved : 'work'
  })

  useEffect(() => { localStorage.setItem('mode', mode) }, [mode])
  useEffect(() => { initAsciiRenderer() }, [])

  const navLinks = (
    <nav className="nav-links">
      <a href="https://www.linkedin.com/in/sofiia-bodnar/" target="_blank" rel="noopener noreferrer">
        <img src="/Linkedin.svg" alt="LinkedIn" style={{ height: '20px', filter: 'invert(1)' }} />
      </a>
      <a href="https://github.com/sofiabod" target="_blank" rel="noopener noreferrer">
        <img src="/github.svg" alt="GitHub" style={{ height: '20px', filter: 'invert(1)' }} />
      </a>
      <a href="https://x.com/sofiiabodnar" target="_blank" rel="noopener noreferrer">
        <img src="/x.svg" alt="X" style={{ height: '20px', filter: 'invert(1)' }} />
      </a>
    </nav>
  )

  return (
    <>
    <div id="ascii-widget"><div id="ascii"></div></div>
    <main>
      <div>
        <div className="header-row">
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 400, marginBottom: '0px', textAlign: 'left' }}>sofia bodnar</h1>
            <p style={{ fontSize: '0.72rem', marginTop: '-14px' }}>incoming <a href="https://cs.uwaterloo.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>@uwaterloo</a> cs</p>
          </div>
          {navLinks}
        </div>
        <div className="mode-nav">
          {MODES.map(m => (
            <div key={m} className={`nav-item ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)} data-mode={m}>{m}</div>
          ))}
        </div>
      </div>

      {mode === 'mindset' && (
        <>
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 500 }}>
              every waking hour is a working hour
            </p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '12px' }}>
              "I will figure it out"
            </p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>
              your maximum is someone's minimum
            </p>
            <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '12px' }}>
              go above and beyond, over prepare, be obsessed
            </p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>
              create your own opportunities
            </p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>
              your time is extremely precious
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '12px' }}>
              i think i can, therefore i can.
            </p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>
              "I work from the moment I wake up to the moment I<br />go to sleep" - Jensen Huang
            </p>
          </div>
        </>
      )}

      {mode === 'work' && (
        <div style={{ marginTop: '40px' }}>
        {experiences.map((exp, index) => (
          <div key={index} style={{ marginTop: index === 0 ? '0' : '20px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 500 }}>{exp.title}<span style={{ fontWeight: 500 }}>, {exp.company === 'Sentra' ? <a href="https://www.sentra.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Sentra</a> : exp.company === 'Convictional' ? <a href="https://get.convictional.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Convictional</a> : exp.company === 'Shopify' ? <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Shopify</a> : exp.company}</span>
              {exp.company === 'Shopify' && (
                <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer">
                  <img src="/shopify.svg" alt="Shopify" style={{ height: '17px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-5px' }} />
                </a>
              )}
              {exp.company === 'Sentra' && (
                <>
                  <a href="https://www.forbes.com/sites/charliefink/2026/02/02/sentra-raises-5-million-to-build-enterprise-general-intelligence/" target="_blank" rel="noopener noreferrer">
                    <img src="/a16z.png" alt="a16z" style={{ height: '16px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-3px' }} />
                  </a>
                  <img src="/mit.svg" alt="MIT" style={{ height: '16px', marginLeft: '4px', verticalAlign: 'middle', filter: 'invert(1)' }} />
                </>
              )}
              {exp.company === 'Omen' && (
                <a href="https://omen.trade/" target="_blank" rel="noopener noreferrer">
                  <img src="/omen.svg" alt="Omen" style={{ height: '15px', marginLeft: '8px', verticalAlign: 'middle' }} />
                </a>
              )}
              {exp.company === 'Convictional' && (
                <a href="https://www.ycombinator.com/companies/convictional" target="_blank" rel="noopener noreferrer">
                    <img src="/yc.svg" alt="Y Combinator" style={{ height: '13px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-5px' }} />
                  </a>
              )}
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.72rem' }}>{exp.date}</p>
            {exp.company === 'Shopify' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                incoming s26
              </p>
            )}
            {exp.company === 'Sentra' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                working with MIT prof across formal memory theory,<br />model compression, RL, and predictive world models
              </p>
            )}
            {exp.company === 'Omen' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                investment agents that automate trades
              </p>
            )}
            {exp.company === 'Convictional' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                applied research on late-interaction retrieval
              </p>
            )}
          </div>
        ))}
        </div>
      )}

      {mode === 'publications' && (
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap' }}>
          <a href="https://arxiv.org/abs/2603.27116v1" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            <img src="/price-of-meaning.png" alt="the price of meaning" style={{ width: '180px', height: 'auto', display: 'block' }} />
            <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '6px' }}>The Price of Meaning</p>
            <p style={{ fontSize: '0.68rem', fontStyle: 'italic', marginTop: '2px' }}>arXiv</p>
          </a>
          <a href="https://arxiv.org/abs/2604.06222" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            <img src="/geometry-of-forgetting.png" alt="the geometry of forgetting" style={{ width: '180px', height: 'auto', display: 'block' }} />
            <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '6px' }}>The Geometry of Forgetting</p>
            <p style={{ fontSize: '0.68rem', fontStyle: 'italic', marginTop: '2px' }}>arXiv</p>
          </a>
        </div>
      )}

      {mode === 'random' && (
        <div className="random-section" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '0.72rem' }}>research at <a href="https://www.csail.mit.edu/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>MIT CSAIL</a> at <a href="https://compbio.mit.edu/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>Kellis Lab</a></p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>created <a href="https://www.axiomstartups.ca/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>Axiom</a>, a startup competition for youth</p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>published by <a href="https://journal.stemfellowship.org/doi/epdf/10.17975/sfj-2026-002" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>Canadian Science Publishing</a></p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>founded 3 clubs in hs</p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>recently hosted <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>G Hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>Claude x Socratica</a> and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>PRISM</a></p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>generated over <a href="https://www.tiktok.com/@infinitybouquets.ca?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>150k views</a> and sold <a href="https://www.instagram.com/infinitybouquets.ca/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>100+ bouquets</a></p>
        </div>
      )}

    </main>
    </>
  )
}

export default App
