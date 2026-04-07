import './App.css'
import { useState } from 'react'

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
  const [showMindset, setShowMindset] = useState(false)

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
