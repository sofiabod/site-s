import { useState, useEffect, type ReactNode } from 'react'

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

export function GraphJepaPost({ onBack }: { onBack: () => void }) {
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

export function SpexPost({ onBack }: { onBack: () => void }) {
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
