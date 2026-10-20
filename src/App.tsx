import './App.css'
import { eventsByYear } from './events'
import ResponsiveImage from './ResponsiveImage'
import { useStoredTab } from './useStoredTab'
import { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from 'react'

const GraphJepaPost = lazy(() => import('./Posts').then(module => ({ default: module.GraphJepaPost })))
const SpexPost = lazy(() => import('./Posts').then(module => ({ default: module.SpexPost })))

type Job = { company: string; role: string; url: string; logo: string; h: string; hov: string; description?: string; current?: boolean; round?: boolean }

const jobs: Job[] = [
  { company: "Shopify", role: "Software Engineering Intern", url: "https://www.shopify.com/ca", logo: "/shopify.svg", h: "15px", hov: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/shopify-bg.jpeg) center 38%/100% auto", description: "built infrastructure for reliable AI agents across evaluation, memory, data pipelines, and dynamic workflows.", current: true },
  { company: "Sentra", role: "Research Engineer", url: "https://www.sentra.app/", logo: "/sentra.svg", h: "20px", hov: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/sentra-bg.jpeg) center 45%/100% auto", description: "built memory, retrieval, and evaluation infrastructure for self-improving agents—spanning entity resolution, adaptive RAG, durable citations, bi-temporal memory, and hallucination defense—while researching RL and predictive world models.", current: true },
  { company: "CSS Lab", role: "Research Intern", url: "https://csslab.cs.toronto.edu/", logo: "/uoft.png", h: "20px", hov: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/csslab-bg.jpeg) center 42%/auto 260% repeat", description: "worked with the team behind Maia, human-like chess models that predict how people play across skill levels; built a dynamic data-selection method that lets a teacher model choose which examples a student learns from.", current: true },
  { company: "Omen", role: "Software Engineer", url: "https://omen.trade/", logo: "/omen.svg", h: "14px", hov: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/omen-bg2.jpeg) center 38%/100% auto", description: "built agent-driven financial workflows for an all-in-one trading platform spanning prediction markets, perpetual futures, crypto, and equities." },
  { company: "Convictional", role: "Software Engineering Intern", url: "https://www.linkedin.com/company/convictional/posts/?feedView=all", logo: "/convictional.png", h: "18px", hov: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/conv-bg.jpeg) center 38%/100% auto", description: "MUVERA and ColBERT v2 for late-interaction search.", round: true },
]

type Card = { title: string; desc?: ReactNode; slug?: string; meta?: string; img?: string; href?: string }

const publications: Card[] = [
  { title: "The Price of Meaning", meta: "arXiv", img: "/price-of-meaning.png", href: "https://arxiv.org/abs/2603.27116v1" },
  { title: "The Geometry of Forgetting", meta: "arXiv", img: "/geometry-of-forgetting.png", href: "https://arxiv.org/abs/2604.06222" },
]


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
        <img src="/Linkedin.svg" alt="LinkedIn" width="20" height="20" style={{ height: '20px' }} />
      </a>
      <a href="https://github.com/sofiabod" target="_blank" rel="noopener noreferrer">
        <img src="/github.svg" alt="GitHub" width="20" height="20" style={{ height: '20px' }} />
      </a>
      <a href="https://x.com/sofiiabodnar" target="_blank" rel="noopener noreferrer">
        <img src="/x.svg" alt="X" width="20" height="20" style={{ height: '20px' }} />
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
        <img src="/webring.svg" alt="" width="926" height="791" loading="lazy" decoding="async" />
      </a>
      <a className="webring-arrow" href={`${webringUrl}?nav=next`} aria-label="Next CS Webring site">{'>'}</a>
    </nav>
  )
}

function BackgroundGrid() {
  const gridRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1101px) and (prefers-reduced-motion: no-preference)')
    const step = 22

    // The grid begins near the bottom mid-page and higher toward the edges.
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
      gc.strokeStyle = 'rgba(211, 211, 211, 0.05)'
      gc.lineWidth = 0.5
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

    let frame = 0
    const scheduleDraw = () => {
      cancelAnimationFrame(frame)
      if (media.matches) frame = requestAnimationFrame(drawGrid)
    }
    scheduleDraw()
    window.addEventListener('resize', scheduleDraw)
    media.addEventListener('change', scheduleDraw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleDraw)
      media.removeEventListener('change', scheduleDraw)
    }
  }, [])

  return (
    <div className="background-grid" aria-hidden="true">
      <canvas ref={gridRef} />
    </div>
  )
}



const PRIMARY = ['work', 'mindset'] as const
const SUBS = ['experience', 'publications', 'community'] as const
type Sub = typeof SUBS[number]

function App() {
  const [tab, setTab] = useStoredTab()
  const [sub, setSub] = useState<Sub>('experience')
  const [post, setPost] = useState<string | null>(null)
  if (post === 'graph-jepa') return <Suspense fallback={<p role="status">Loading…</p>}><GraphJepaPost onBack={() => setPost(null)} /></Suspense>
  if (post === 'spex') return <Suspense fallback={<p role="status">Loading…</p>}><SpexPost onBack={() => setPost(null)} /></Suspense>

  const navLinks = <SocialLinks />

  const cardGrid = (list: Card[]) => (
    <div className="project-grid">
      {list.map(p => {
        const open = p.slug ? () => setPost(p.slug!) : undefined
        const thumbClass = `pcard-thumb${p.img ? ' pcard-thumb-img' : ' pcard-ph-box'}`
        const thumb = p.img ? <ResponsiveImage src={p.img} alt={p.title} sizes="170px" /> : <span className="pcard-ph">{p.title.split(':')[0]}</span>
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
    <BackgroundGrid />
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
              i am a cs student at the <ResponsiveImage src="/uwaterloo.png" alt="University of Waterloo" style={{ height: '19px', width: 'auto', verticalAlign: 'middle', marginRight: '5px', marginTop: '-3px' }} /><a href="https://cs.uwaterloo.ca/" target="_blank" rel="noopener noreferrer" className="hlink">University of Waterloo</a>. i view myself as extremely ambitious, obsessed, and resilient.
            </p>

            <p style={{ fontSize: '0.76rem', marginTop: '16px', marginBottom: '4px' }}>some wins:</p>
            <ul style={{ fontSize: '0.76rem', lineHeight: 1.9, margin: '0 0 0 20px' }}>
              <li>interned @ <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer" className="hlink">shopify</a><img src="/shopify.svg" alt="Shopify" width="160" height="180" style={{ height: '15px', width: 'auto', verticalAlign: 'middle', marginLeft: '5px' }} /> at 17 yrs old</li>
              <li>in high school, i worked as a software engineer across 3 yc / a16z startups and published 2 papers with an <img src="/mit.svg" alt="MIT" width="19" height="19" style={{ height: '19px', width: 'auto', verticalAlign: 'middle', margin: '0 4px' }} /> prof</li>
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
                      <ResponsiveImage src={j.logo} alt={j.company} style={j.round ? { height: j.h, width: j.h, borderRadius: '50%', objectFit: 'cover' } : { height: j.h, width: 'auto' }} />
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
                      <ResponsiveImage src={j.logo} alt={j.company} style={j.round ? { height: j.h, width: j.h, borderRadius: '50%', objectFit: 'cover' } : { height: j.h, width: 'auto' }} />
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
                  <li style={{ marginTop: '6px' }}><a href="https://github.com/sofiabod/spex" target="_blank" rel="noopener noreferrer" className="hlink">Speculative Tool Execution for Verification Tasks</a>{' · '}<a href="https://github.com/sofiabod/sfx" target="_blank" rel="noopener noreferrer" className="hlink">SFX</a></li>
                  <li style={{ marginTop: '6px' }}><a href="https://github.com/sofiabod/GRAPH-JEPA" target="_blank" rel="noopener noreferrer" className="hlink">Graph-JEPA: Applying the JEPA Architecture to Temporal Graphs</a></li>
                </ul>
              </div>
            </div>
          )}

          {sub === 'publications' && (
            <div className="publications">
              {cardGrid(publications)}
            </div>
          )}

          {sub === 'community' && (
            <div className="event-years">
              {eventsByYear.map(({ year, photos, events }) => (
                <section key={year} className="event-year" aria-labelledby={`events-${year}`}>
                  <h2 id={`events-${year}`} className="event-year-label">{year}</h2>
                  {events?.map(event => (
                    <article key={event.id} className="community-event" aria-labelledby={event.id}>
                      <header className="community-event-header">
                        <div className="community-event-heading">
                          <h3 id={event.id}>
                            {event.href
                              ? <a href={event.href} target="_blank" rel="noopener noreferrer" className="hlink">{event.title}</a>
                              : event.title}
                          </h3>
                          {event.people?.length ? (
                            <p className="community-event-subtitle">
                              with{' '}
                              {event.people.map((person, index, people) => (
                                <span key={person.href}>
                                  {index > 0 && (index === people.length - 1 ? (people.length > 2 ? ', and ' : ' and ') : ', ')}
                                  <a href={person.href} target="_blank" rel="noopener noreferrer" className="hlink">{person.name}</a>
                                </span>
                              ))}
                            </p>
                          ) : event.subtitle && <p className="community-event-subtitle">{event.subtitle}</p>}
                        </div>
                      </header>
                      <div className="community-event-gallery">
                        {event.photos.map(photo => {
                          const href = photo.href
                          const Photo = href ? 'a' : 'div'
                          return (
                            <Photo key={photo.src} href={href} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined} tabIndex={photo.cover && !href ? 0 : undefined} className={`community-event-photo${photo.portrait ? ' community-event-photo-portrait' : ''}${photo.cover ? ' photo-flip' : ''}`} style={{ aspectRatio: photo.aspectRatio }}>
                              <ResponsiveImage className="photo-flip-base" src={photo.src} alt={photo.alt} loading="lazy" sizes="(max-width: 480px) calc((100vw - 38px) / 2), (max-width: 592px) calc((100vw - 42px) / 2), 275px" />
                              {photo.cover && <ResponsiveImage className="photo-flip-cover" src={photo.cover} alt="" loading="lazy" sizes="(max-width: 480px) calc((100vw - 38px) / 2), (max-width: 592px) calc((100vw - 42px) / 2), 275px" />}
                            </Photo>
                          )
                        })}
                        {Array.from({ length: event.pendingPhotos ?? 0 }, (_, index) => (
                          <div key={index} className="community-event-placeholder">
                            <span>photo coming soon</span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                  {year === 2025 && (
                    <p className="event-year-description">
                      i love being around ambitious, like-minded people, so i help create spaces for them. i started <a href="https://luma.com/7epaq2w3" target="_blank" rel="noopener noreferrer" className="hlink">axiom</a>, a startup competition for youth, founded 3 clubs in high school, and helped host <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" className="hlink" style={{ whiteSpace: 'nowrap' }}>g hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" className="hlink">claude x socratica</a>, and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" className="hlink">prism</a>.
                    </p>
                  )}
                  {photos.length > 0 ? (
                    <div className="event-photo-grid">
                      {photos.map(photo => (
                        <a key={photo.src} href={photo.href} target="_blank" rel="noopener noreferrer" className={`event-photo${photo.cover ? ' photo-flip' : ''}`}>
                          <ResponsiveImage className="photo-flip-base" src={photo.src} alt={photo.alt} loading="lazy" sizes="(max-width: 480px) calc((100vw - 38px) / 2), (max-width: 592px) calc((100vw - 42px) / 2), 275px" />
                          {photo.cover && <ResponsiveImage className="photo-flip-cover" src={photo.cover} alt="" loading="lazy" sizes="(max-width: 480px) calc((100vw - 38px) / 2), (max-width: 592px) calc((100vw - 42px) / 2), 275px" />}
                        </a>
                      ))}
                    </div>
                  ) : !events?.length && (
                    <p className="event-year-empty">more photos soon.</p>
                  )}
                </section>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'mindset' && (
        <div className="mindset-page">
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'left', border: '1px solid var(--accent)', padding: '28px 34px', maxWidth: '400px' }}>
            <p className="mindset-quote" style={{ marginTop: 0 }}><span style={{ backgroundColor: 'rgba(255,255,255,0.09)', padding: '1px 5px', borderRadius: '3px' }}>excellence is the capacity to take pain</span></p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>patience + repetition</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>go above and beyond, over prepare, be obsessed</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>create your own opportunities</p>
            <p style={{ fontSize: '0.72rem', marginTop: '16px' }}>the pain is the only reminder it was real</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>immer vorne nie zurück</p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>"your time is extremely precious" - Shayaan Azeem</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>every waking hour is a working hour</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>you don't lose anything by showing up</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>your maximum is someone's minimum</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>don't make decisions you will regret</p>
            <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>if i can breathe i can think, and if i can think i can win</p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>"I work from the moment I wake up to the moment I<br />go to sleep" - Jensen Huang</p>
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '16px' }}>"Go down deep enough into anything and you will find mathematics" - Dean Schlicter</p>
          </div>
        </div>
        </div>
      )}

      {tab === 'mindset' && (
        <>
        </>
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
