import './App.css'
import { useState } from 'react'

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
    title: "Machine Learning Intern",
    company: "Convictional",
    date: "july 2025 - aug 2025"
  }
]

function App() {
  const [showMindset, setShowMindset] = useState(false)

  const navLinks = (
    <nav className="nav-links" style={{ position: 'absolute', left: '540px' }}>
      <a onClick={() => setShowMindset(!showMindset)} style={{ cursor: 'pointer' }}>
        <img src="/penguin.svg" alt={showMindset ? "Back" : "Mindset"} style={{ height: '65px', marginRight: '-25px', marginTop: '-2px' }} />
      </a>
      <a href="https://www.linkedin.com/in/sofiia-bodnar/" target="_blank" rel="noopener noreferrer">
        <img src="/Linkedin.svg" alt="LinkedIn" style={{ height: '20px' }} />
      </a>
      <a href="https://github.com/sofiabod" target="_blank" rel="noopener noreferrer">
        <img src="/github.svg" alt="GitHub" style={{ height: '20px' }} />
      </a>
      <a href="https://x.com/sofiiabodnar" target="_blank" rel="noopener noreferrer">
        <img src="/x.svg" alt="X" style={{ height: '20px' }} />
      </a>
    </nav>
  )

  if (showMindset) {
    return (
      <main>
        <div>
          <div className="header-row">
            <h1 style={{ fontSize: '1.35rem' }}>mindset</h1>
            {navLinks}
          </div>
        </div>

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
          <p style={{ fontSize: '0.72rem', marginTop: '30px' }}>
            fav quote:
          </p>
          <p style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '8px' }}>
            "I work from the moment I wake up to the moment I go<br />to sleep" - Jensen Huang
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 500 }}>
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
          <h1 style={{ fontSize: '1.35rem', fontWeight: 400 }}>sofia bodnar</h1>
          {navLinks}
        </div>
      </div>


      <div>

        <div style={{ marginTop: '40px' }}>
          <h2 id="experience" style={{ fontSize: '1.15rem', fontWeight: 500 }}>experience</h2>
        {experiences.map((exp, index) => (
          <div key={index} style={{ marginTop: index === 0 ? '20px' : '40px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 500 }}>{exp.title}<span style={{ fontWeight: 500 }}>, {exp.company === 'Sentra' ? <a href="https://www.sentra.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Sentra</a> : exp.company === 'Convictional' ? <a href="https://get.convictional.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Convictional</a> : exp.company === 'Shopify' ? <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Shopify</a> : exp.company}</span>
              {exp.company === 'Shopify' && (
                <a href="https://www.shopify.com/ca" target="_blank" rel="noopener noreferrer">
                  <img src="/shopify.svg" alt="Shopify" style={{ height: '24px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-7px' }} />
                </a>
              )}
              {exp.company === 'Sentra' && (
                <>
                  <a href="https://www.forbes.com/sites/charliefink/2026/02/02/sentra-raises-5-million-to-build-enterprise-general-intelligence/" target="_blank" rel="noopener noreferrer">
                    <img src="/a16z.png" alt="a16z" style={{ height: '22px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-4px' }} />
                  </a>
                  <img src="/mit.svg" alt="MIT" style={{ height: '22px', marginLeft: '4px', verticalAlign: 'middle' }} />
                </>
              )}
              {exp.company === 'Omen' && (
                <a href="https://omen.trade/" target="_blank" rel="noopener noreferrer">
                  <img src="/omen.svg" alt="Omen" style={{ height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
                </a>
              )}
              {exp.company === 'Convictional' && (
                <a href="https://www.ycombinator.com/companies/convictional" target="_blank" rel="noopener noreferrer">
                    <img src="/yc.svg" alt="Y Combinator" style={{ height: '18px', marginLeft: '8px', verticalAlign: 'middle', marginTop: '-7px' }} />
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
              <>
                <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                  developing self-optimizing memory systems, working with MIT prof across<br />formal memory theory, model compression, RL, and predictive world models
                </p>
                <p style={{ fontSize: '0.72rem', fontWeight: 500, marginTop: '14px' }}>recent publications</p>
                <div className="pub-branch-wrapper" style={{ marginLeft: '2px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div className="pub-branch" style={{ borderLeft: '1px solid black', borderBottom: '1px solid black', width: '20px', height: '20px', flexShrink: 0 }} />
                    <a href="https://arxiv.org/abs/2603.27116v1" target="_blank" rel="noopener noreferrer" className="pub-title" style={{ fontSize: '0.72rem', fontWeight: 500, display: 'inline-block', marginLeft: '6px', color: 'inherit' }}>interference is structural</a>
                  </div>
                  <p style={{ fontSize: '0.68rem', marginTop: '2px', marginLeft: '26px' }}>proved interference, forgetting, and false recall are structural<br />consequences of finite effective rank in semantic embedding spaces</p>
                </div>
              </>
            )}
            {exp.company === 'Omen' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                building automation infra to tokenize everything
              </p>
            )}
            {exp.company === 'Convictional' && (
              <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                research in multi-vector retrieval, <a href="https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>MUVERA</a> + <a href="https://arxiv.org/pdf/2112.01488" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>ColBERT v2</a>
              </p>
            )}
          </div>
        ))}
        </div>

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 500 }}>sidequests</h2>

          <p style={{ fontSize: '0.72rem', marginTop: '20px' }}>created <a href="https://www.axiomstartups.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>Axiom</a>, a startup competition for youth</p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>predicted forecast failures using LISA and ensemble ML,<br /><span style={{ fontStyle: 'italic' }}>published by <a href="https://journal.stemfellowship.org/doi/epdf/10.17975/sfj-2026-002" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>Canadian Science Publishing</a></span></p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>created first ML and math community at my hs</p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>recently hosted <a href="https://www.goonhacks.ca" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>G Hacks</a>, <a href="https://lu.ma/ufdrjn3n" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>Claude x Socratica</a> and <a href="https://luma.com/lob2kpxt" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>PRISM</a></p>
          <p style={{ fontSize: '0.72rem', marginTop: '12px' }}>generated over <a href="https://www.tiktok.com/@infinitybouquets.ca?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>150k views</a> and sold <a href="https://www.instagram.com/infinitybouquets.ca/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 500 }}>100+ bouquets</a></p>
        </div>
      </div>

      <footer style={{ marginTop: '80px', fontSize: '0.68rem', color: '#666' }}>
        <span>2026 © Sofia Bodnar</span>
        <span style={{ marginLeft: '100px' }}>sofiabodnar1729 [at] gmail [dot] com</span>
      </footer>
    </main>
  )
}

export default App
