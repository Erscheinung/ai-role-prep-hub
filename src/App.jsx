import { useEffect, useMemo, useState } from 'react'
import { categories, flashcards, matchPairs, scenarios as practiceScenarios } from './data/practiceBank'

const modules = [
  { id: 'llm', icon: '✦', title: 'LLM fluency', time: '2–3 hrs', level: 'Foundation', blurb: 'Explain tokens, context, prompting, structured output, latency, and cost without hand-waving.', skills: ['Prompt anatomy', 'JSON outputs', 'Cost × latency'], quest: 'Turn a fuzzy customer ask into a tight system prompt and JSON schema.', output: 'A one-page prompt + schema for a customer-request classifier.', rep: 'Explain why structured output makes a demo more reliable.' },
  { id: 'rag', icon: '⌁', title: 'RAG systems', time: '4–6 hrs', level: 'Core', blurb: 'Design a grounded knowledge assistant and diagnose what broke when its answer is wrong.', skills: ['Embeddings', 'Chunking', 'Hybrid retrieval', 'Evaluation'], quest: 'Build the reference architecture and defend each retrieval decision.', output: 'A cited knowledge-assistant architecture with an evaluation checklist.', rep: 'Describe how you would debug an incorrect answer—retrieval before model blame.' },
  { id: 'agents', icon: '◈', title: 'Agents & workflows', time: '4–6 hrs', level: 'Core', blurb: 'Know when to automate deterministically and when a bounded agent adds real value.', skills: ['Tool calling', 'State', 'Human approval', 'Guardrails'], quest: 'Choose the right control flow for a support-triage scenario.', output: 'A decision tree showing deterministic steps, agent choices, and approval gates.', rep: 'Defend “workflow first” to a stakeholder asking for an agent everywhere.' },
  { id: 'ship', icon: '⬡', title: 'Production AI', time: '3–4 hrs', level: 'Core', blurb: 'Make systems observable, evaluable, governed, secure, and safe to operate.', skills: ['Evals', 'Tracing', 'Prompt injection', 'Reliability'], quest: 'Write the go/no-go rubric for a customer-facing agent.', output: 'A launch scorecard: quality, safety, latency, cost, and escalation checks.', rep: 'Name the three signals you would monitor in week one of a pilot.' },
  { id: 'api', icon: '↔', title: 'APIs & automation', time: '4–6 hrs', level: 'Builder', blurb: 'Read JSON, call APIs, understand webhooks, and model automations in n8n.', skills: ['REST', 'Auth', 'Webhooks', 'Branches & retries'], quest: 'Map a lead-to-demo workflow from event to CRM update.', output: 'A webhook-to-CRM workflow diagram with retries and an error path.', rep: 'Walk through an API request, authentication choice, and JSON response.' },
  { id: 'presales', icon: '◎', title: 'Solutions storytelling', time: '3–5 hrs', level: 'Primary track', blurb: 'Lead discovery, build compelling demos, and connect architecture choices to business outcomes.', skills: ['Discovery', 'Demo arc', 'POC scope', 'Partner enablement'], quest: 'Deliver a two-minute executive explanation of your design.', output: 'A demo script, discovery checklist, and one-slide reference architecture.', rep: 'Open a customer conversation with outcome, constraints, and proof—not features.' },
  { id: 'gtm', icon: '↗', title: 'GTM systems', time: '3–5 hrs', level: 'Optional track', blurb: 'Engineer the path from campaign signal to pipeline with measurement and automation.', skills: ['Routing', 'Enrichment', 'Funnel metrics', 'Experiments'], quest: 'Design an alert that turns falling conversion into an action.', output: 'A funnel-alert workflow with owner, threshold, and recommended next action.', rep: 'Connect an automation to CAC, velocity, or pipeline—not just activity.' },
]

const resources = [
  { tag: 'VIDEO · 60 min', title: 'RAG Crash Course for Beginners', text: 'Hands-on overview of embeddings, vector databases, chunking, and an end-to-end RAG build.', url: 'https://www.youtube.com/watch?v=swvzKSOEluc', module: 'rag' },
  { tag: 'FREE COURSE · 1.5 hrs', title: 'AI Agents in LangGraph', text: 'Build an agent, add search, persistence, and human-in-the-loop controls.', url: 'https://www.deeplearning.ai/alpha/short-courses/ai-agents-in-langgraph', module: 'agents' },
  { tag: 'FREE COURSE', title: 'Hugging Face Agents Course', text: 'A structured, practical route from agent fundamentals to frameworks and use cases.', url: 'https://huggingface.co/learn/agents-course/unit0/introduction', module: 'agents' },
  { tag: 'FREE COURSE', title: 'LangGraph Academy: Introduction', text: 'Use graphs to build controllable, stateful AI workflows.', url: 'https://academy.langchain.com/courses/intro-to-langgraph', module: 'agents' },
  { tag: 'OFFICIAL DOCS', title: 'n8n: Webhook workflow development', text: 'Understand test vs. production URLs, publishing, and debugging webhooks.', url: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/', module: 'api' },
  { tag: 'VIDEO COURSE · 12 hrs', title: 'n8n Full Course: AI automations', text: 'A no-cost, beginner-friendly course covering APIs, workflow logic, error handling, and AI integrations.', url: 'https://www.classcentral.com/course/youtube-n8n-full-course-build-ai-automations-in-2025-for-beginners-496974', module: 'api' },
  { tag: 'FREE COURSE + LABS', title: 'Microsoft AI Agents for Beginners', text: 'Twelve lessons with examples across agents, RAG, tool use, planning, and deployment.', url: 'https://github.com/microsoft/ai-agents-for-beginners', module: 'llm' },
  { tag: 'FREE VIDEO SERIES', title: 'Prompt Engineering Guide', text: 'Practical prompt patterns, structured output, and evaluation-friendly prompting reference.', url: 'https://www.promptingguide.ai/', module: 'llm' },
  { tag: 'REFERENCE', title: 'AgentEvals', text: 'A concise practical reference for evaluating an agent’s tool-use trajectory—not just its final answer.', url: 'https://github.com/langchain-ai/agentevals', module: 'ship' },
  { tag: 'VIDEO', title: 'Consuming APIs: GET and POST', text: 'Quick introduction to API requests, responses, and JSON in Python.', url: 'https://realpython.com/videos/consuming-apis-get-post/', module: 'api' },
  { tag: 'FREE GUIDE', title: 'AWS Prescriptive Guidance: Generative AI', text: 'Enterprise-oriented architecture and governance guidance useful for technical conversations.', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-gen-ai-implementation-plan/welcome.html', module: 'presales' },
  { tag: 'OFFICIAL ACADEMY', title: 'HubSpot Academy: Revenue Operations', text: 'Free lessons on connecting marketing, sales, service, and reporting around measurable growth.', url: 'https://academy.hubspot.com/courses/revenue-operations', module: 'gtm' },
]

const trackData = {
  solutions: { title: 'AI Solutions / Partner Engineer', color: 'violet', description: 'Your primary path: turn enterprise needs into credible agentic demos, POCs, architectures, and enablement.', route: ['llm', 'rag', 'agents', 'ship', 'api', 'presales'], capstone: 'Enterprise Knowledge Copilot + partner enablement pack' },
  gtm: { title: 'AI GTM Engineer', color: 'cyan', description: 'Your systems path: connect campaign signals, CRM, enrichment, automation, and revenue measurement.', route: ['llm', 'api', 'agents', 'gtm', 'ship'], capstone: 'Signal-to-pipeline automation with dashboard and runbook' },
  interview: { title: 'Interview & Portfolio Sprint', color: 'orange', description: 'Your synthesis path: build proof, communicate trade-offs, and practise customer-facing answers.', route: ['rag', 'agents', 'ship', 'presales', 'gtm'], capstone: 'Portfolio case study + demo + architecture defence' },
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem('ai-prep-progress')) || {} } catch { return {} }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [track, setTrack] = useState(() => localStorage.getItem('ai-prep-track') || 'solutions')
  const [done, setDone] = useState(getProgress)
  const [theme, setTheme] = useState(() => localStorage.getItem('ai-prep-theme') || 'dark')
  const [resourceFilter, setResourceFilter] = useState('all')

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('ai-prep-theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('ai-prep-progress', JSON.stringify(done)) }, [done])
  useEffect(() => { localStorage.setItem('ai-prep-track', track) }, [track])
  const selected = trackData[track]
  const route = selected.route.map(id => modules.find(m => m.id === id))
  const completed = Object.keys(done).filter(k => done[k]).length
  const xp = completed * 120
  const visibleResources = useMemo(() => resourceFilter === 'all' ? resources : resources.filter(r => r.module === resourceFilter), [resourceFilter])
  const finish = id => setDone(value => ({ ...value, [id]: !value[id] }))

  return <div className="app-shell">
    <header className="nav">
      <button className="brand" onClick={() => setScreen('home')} aria-label="AI Role Prep Hub home"><span className="brand-mark">✦</span> AI Role Prep Hub</button>
      <nav>
        <button className={screen === 'map' ? 'active' : ''} onClick={() => setScreen('map')}>Learning map</button>
        <button className={screen === 'lab' ? 'active' : ''} onClick={() => setScreen('lab')}>Practice lab</button>
        <button className={screen === 'resources' ? 'active' : ''} onClick={() => setScreen('resources')}>Free resources</button>
      </nav>
      <div className="nav-right"><span className="xp">⚡ {xp} XP</span><button className="theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle colour theme">{theme === 'dark' ? '☼' : '☾'}</button></div>
    </header>

    {screen === 'home' && <Home track={track} setTrack={setTrack} selected={selected} route={route} xp={xp} completed={completed} setScreen={setScreen} />}
    {screen === 'map' && <LearningMap selected={selected} route={route} done={done} finish={finish} setScreen={setScreen} setResourceFilter={setResourceFilter} />}
    {screen === 'lab' && <PracticeLab done={done} finish={finish} />}
    {screen === 'resources' && <ResourceShelf filter={resourceFilter} setFilter={setResourceFilter} items={visibleResources} />}
    <footer>Built for learning in public, not collecting personal information. Progress stays in this browser.</footer>
  </div>
}

function Home({ track, setTrack, selected, route, xp, completed, setScreen }) {
  return <main>
    <section className="hero grid-bg">
      <div className="hero-copy"><p className="eyebrow">PREP FOR AI ROLES · ONE QUEST AT A TIME</p><h1>Become the person who can <em>explain, design, and ship</em> useful AI.</h1><p className="lede">A practical prep game for AI Solutions, Partner Engineering, and GTM systems roles. No computer-science degree assumed—only curiosity and a willingness to build.</p><div className="hero-actions"><button className="primary" onClick={() => setScreen('map')}>Start the next quest <span>→</span></button><button className="ghost" onClick={() => setScreen('lab')}>Try a scenario</button></div><div className="proof"><span>◉ Learn by doing</span><span>◌ Explain trade-offs</span><span>◎ Build portfolio proof</span></div></div>
      <div className="hero-orbit" aria-hidden="true"><div className="core">AI<br/><small>role prep</small></div><i className="orbit a">RAG</i><i className="orbit b">Agents</i><i className="orbit c">APIs</i><i className="orbit d">GTM</i><i className="orbit e">Cloud</i></div>
    </section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR CHARACTER CLASS</p><h2>Three routes, one transferable foundation.</h2></div><p>Start with the one closest to the job you want. You can change route at any time.</p></div>
      <div className="track-grid">{Object.entries(trackData).map(([id, item]) => <button key={id} className={`track-card ${item.color} ${track === id ? 'selected' : ''}`} onClick={() => setTrack(id)}><span className="track-icon">{id === 'solutions' ? '◎' : id === 'gtm' ? '↗' : '◈'}</span><span className="track-title">{item.title}</span><span>{item.description}</span><b>{track === id ? 'Selected ✓' : 'Choose route →'}</b></button>)}</div>
    </section>
    <section className="dashboard"><div><p className="eyebrow">YOUR CURRENT ROUTE</p><h2>{selected.title}</h2><p>{selected.description}</p></div><div className="progress-wrap"><div className="progress-label"><span>Quest progress</span><b>{completed}/{modules.length} complete</b></div><div className="progress"><span style={{ width: `${(completed / modules.length) * 100}%` }} /></div><small>{xp ? `${xp} XP earned. Keep the streak alive.` : 'Complete your first module to unlock 120 XP.'}</small></div><div className="capstone"><span>FINAL BOSS</span><strong>{selected.capstone}</strong></div></section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">YOUR MISSION SEQUENCE</p><h2>Small wins → credible portfolio.</h2></div><button className="text-button" onClick={() => setScreen('map')}>Open full map →</button></div><div className="mini-route">{route.map((m, i) => <div className="mini-node" key={m.id}><span>{m.icon}</span><b>{m.title}</b>{i < route.length - 1 && <i>→</i>}</div>)}</div></section>
  </main>
}

function LearningMap({ selected, route, done, finish, setScreen, setResourceFilter }) {
  const [open, setOpen] = useState(route[0]?.id)
  const active = modules.find(m => m.id === open)
  const moduleResources = resources.filter(resource => resource.module === active.id)
  const primaryResource = moduleResources[0]
  const openResources = () => { setResourceFilter(active.id); setScreen('resources') }
  return <main className="page"><section className="page-intro"><p className="eyebrow">{selected.title.toUpperCase()}</p><h1>The learning map</h1><p>Every mission leaves you with proof: learn a focused concept, make a small artifact, then explain your choices as if you were in a customer or interview conversation.</p></section><section className="map-layout"><div className="mission-list">{route.map((m, i) => <button key={m.id} className={`mission ${open === m.id ? 'open' : ''} ${done[m.id] ? 'done' : ''}`} onClick={() => setOpen(m.id)}><span className="mission-number">{done[m.id] ? '✓' : String(i + 1).padStart(2, '0')}</span><span className="mission-icon">{m.icon}</span><span><b>{m.title}</b><small>{m.time} · {m.level}</small></span><span>›</span></button>)}</div><article className="mission-detail" key={active.id}><div className="detail-top"><span className="big-icon">{active.icon}</span><div><p className="eyebrow">MISSION {route.findIndex(m => m.id === active.id) + 1} · {active.time}</p><h2>{active.title}</h2><p>{active.blurb}</p></div></div><div className="skill-pills">{active.skills.map(s => <span key={s}>{s}</span>)}</div><div className="mission-plan"><div className="plan-step"><span>01</span><div><b>Learn the minimum useful theory</b><p>{primaryResource ? primaryResource.title : 'Open the filtered resource shelf for this mission.'}</p>{primaryResource && <a href={primaryResource.url} target="_blank" rel="noreferrer">Start this free resource ↗</a>}</div></div><div className="plan-step"><span>02</span><div><b>Make a small, shareable artifact</b><p>{active.output}</p></div></div><div className="plan-step"><span>03</span><div><b>Rehearse the explanation</b><p>{active.rep}</p><button className="text-button" onClick={() => setScreen('lab')}>Open practice lab →</button></div></div></div><div className="quest-box"><span>QUEST BRIEF</span><p>{active.quest}</p></div><div className="detail-actions"><button className="primary" onClick={openResources}>See {moduleResources.length || 'all'} free {moduleResources.length === 1 ? 'resource' : 'resources'} for this mission <span>→</span></button><button className={done[active.id] ? 'completed' : 'quiet-complete'} onClick={() => finish(active.id)}>{done[active.id] ? 'Completed — undo' : 'I made it — mark complete +120 XP'}</button></div><p className="coach-note"><b>Completion rule:</b> tick this only after you can show the artifact and talk through one design trade-off. The button is a record of your work, not the work itself.</p></article></section></main>
}

function PracticeLab({ finish }) {
  const [mode, setMode] = useState('arena'); const [filter, setFilter] = useState('all'); const [scenarioIndex, setScenarioIndex] = useState(0)
  const [pick, setPick] = useState(null); const [reveal, setReveal] = useState(false); const [cardIndex, setCardIndex] = useState(0); const [flipped, setFlipped] = useState(false)
  const filteredScenarios = practiceScenarios.filter(s => filter === 'all' || s.category === filter)
  const filteredCards = flashcards.filter(c => filter === 'all' || c.category === filter)
  const safeScenarioIndex = scenarioIndex % filteredScenarios.length; const activeScenario = filteredScenarios[safeScenarioIndex]
  const safeCardIndex = cardIndex % filteredCards.length; const activeCard = filteredCards[safeCardIndex]
  const choose = index => { setPick(index); setReveal(true); if (index === activeScenario.answer) finish(`scenario-${activeScenario.id}`) }
  const nextScenario = () => { setScenarioIndex(scenarioIndex + 1); setPick(null); setReveal(false) }
  const nextCard = () => { setCardIndex(cardIndex + 1); setFlipped(false) }
  const changeFilter = value => { setFilter(value); setScenarioIndex(0); setCardIndex(0); setPick(null); setReveal(false); setFlipped(false) }
  return <main className="page"><section className="page-intro"><p className="eyebrow">PRACTICE ARCADE · {practiceScenarios.length} SCENARIOS · {flashcards.length} CARDS</p><h1>Learn it. Match it. Defend it.</h1><p>Inspired by the AWS hub’s multi-game approach: pick a mode, choose a topic, and build pattern recognition through short repeatable rounds—not passive reading.</p></section><div className="arcade-tabs"><button className={mode === 'arena' ? 'active' : ''} onClick={() => setMode('arena')}>◈ Architecture Arena <span>{practiceScenarios.length}</span></button><button className={mode === 'flash' ? 'active' : ''} onClick={() => setMode('flash')}>✦ Flip Deck <span>{flashcards.length}</span></button><button className={mode === 'match' ? 'active' : ''} onClick={() => setMode('match')}>↔ Match Rush <span>{matchPairs.length}</span></button></div><div className="filter-row practice-filter">{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => changeFilter(category)}>{category === 'all' ? 'All topics' : category}</button>)}</div>{mode === 'arena' && <section className="game-stage"><article className="challenge-card"><div className="challenge-header"><span>ARCHITECTURE ARENA · {activeScenario.level.toUpperCase()}</span><span>{safeScenarioIndex + 1} / {filteredScenarios.length}</span></div><h2>{activeScenario.title}</h2><p className="scenario-prompt">“{activeScenario.prompt}”</p><div className="choices">{activeScenario.choices.map((choice, i) => <button disabled={reveal} onClick={() => choose(i)} className={reveal ? (i === activeScenario.answer ? 'right' : i === pick ? 'wrong' : '') : ''} key={choice}><b>{String.fromCharCode(65 + i)}</b>{choice}</button>)}</div>{reveal && <div className="explanation"><b>{pick === activeScenario.answer ? 'Exactly.' : 'Not this time—spot the constraint.'}</b><p>{activeScenario.why}</p><button className="primary" onClick={nextScenario}>Next decision →</button></div>}</article><aside className="game-sidebar"><p className="eyebrow">HOW TO WIN</p><h2>Read for constraints.</h2><p>Before choosing, name: what is deterministic, where an LLM adds judgment, and which action needs proof or approval.</p><div className="score-chip">✓ Correct answers save as progress</div></aside></section>}{mode === 'flash' && <section className="game-stage"><article className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} role="button" tabIndex="0" onKeyDown={e => e.key === 'Enter' && setFlipped(!flipped)}><div className="flip-inner"><div className="flip-face"><span>{activeCard.category.toUpperCase()} · CARD {safeCardIndex + 1}/{filteredCards.length}</span><h2>{activeCard.term}</h2><p>Say the definition out loud before flipping.</p><b>Click to reveal →</b></div><div className="flip-face flip-back"><span>THE ANSWER</span><h2>{activeCard.term}</h2><p>{activeCard.definition}</p><b>Click to flip back</b></div></div></article><aside className="game-sidebar"><p className="eyebrow">FLIP DECK</p><h2>Recognition → recall.</h2><p>Start by defining the term in your own words. Then flip and compare. Use the definition to sharpen—not replace—your explanation.</p><button className="primary" onClick={nextCard}>Next card →</button></aside></section>}{mode === 'match' && <MatchRush key={filter} pairs={matchPairs.filter(pair => filter === 'all' || pair.category === filter)} finish={finish} />}</main>
}

function MatchRush({ pairs, finish }) {
  const [round, setRound] = useState(0); const [selected, setSelected] = useState(null); const [status, setStatus] = useState(''); const [score, setScore] = useState(0)
  const deck = useMemo(() => pairs.slice(round * 6, round * 6 + 6), [pairs, round]); const current = deck[selected ?? 0]
  if (!deck.length) return <section className="game-stage"><article className="challenge-card"><h2>Nothing in this filter yet.</h2></article></section>
  const choices = [...deck].sort((a, b) => (a.id > b.id ? 1 : -1))
  const check = id => { if (selected === null) { setStatus('Pick a term first.'); return } if (id === current.id) { setStatus('correct'); setScore(score + 1); finish(`match-${current.id}`) } else setStatus('wrong') }
  const next = () => { if (selected === null) return; if (selected >= deck.length - 1) { setRound(round + 1); setSelected(null); setStatus('') } else { setSelected(selected + 1); setStatus('') } }
  return <section className="game-stage"><article className="match-card"><div className="challenge-header"><span>MATCH RUSH · ROUND {round + 1}</span><span>{score} MATCHES</span></div><h2>Connect the concept to its definition.</h2><div className="match-layout"><div className="term-stack">{deck.map((pair, index) => <button className={selected === index ? 'selected' : ''} onClick={() => { setSelected(index); setStatus('') }} key={pair.id}><b>{String(index + 1).padStart(2, '0')}</b>{pair.term}</button>)}</div><div className="definition-stack">{choices.map(pair => <button onClick={() => check(pair.id)} key={pair.id}>{pair.definition}</button>)}</div></div><div className={`match-feedback ${status}`}>{status === 'correct' ? '✓ Matched. Lock it in, then move on.' : status === 'wrong' ? 'Try again—the definition belongs to another term in this round.' : status}</div><button className="primary" onClick={next}>{selected === deck.length - 1 ? 'Next round →' : 'Next term →'}</button></article><aside className="game-sidebar"><p className="eyebrow">MATCH RUSH</p><h2>Six concepts per round.</h2><p>Select a term first, then choose its definition. Each topic contains multiple rounds, so repeat with a new lens instead of cramming one long list.</p></aside></section>
}

function ResourceShelf({ filter, setFilter, items }) {
  return <main className="page"><section className="page-intro"><p className="eyebrow">FREE RESOURCE SHELF</p><h1>Watch less. Build more.</h1><p>Each link earns its place by helping you make or explain a real system. Course availability can change; all were free to access when added.</p></section><div className="filter-row"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>{modules.map(m => <button key={m.id} className={filter === m.id ? 'active' : ''} onClick={() => setFilter(m.id)}>{m.title}</button>)}</div><div className="resource-grid">{items.map(item => <a className="resource-card" href={item.url} target="_blank" rel="noreferrer" key={item.title}><span>{item.tag}</span><h2>{item.title}</h2><p>{item.text}</p><b>Open free resource ↗</b></a>)}</div><section className="build-ladder"><p className="eyebrow">THE 30-DAY BUILD LADDER</p><h2>What to make, not just what to consume.</h2><ol><li><b>Week 1:</b> API reader — fetch JSON from a public endpoint and explain each field.</li><li><b>Week 2:</b> RAG mini-demo — ingest a small document set, retrieve sources, and log failures.</li><li><b>Week 3:</b> Automation — use a webhook + branching workflow to route a mock customer request.</li><li><b>Week 4:</b> Capstone — record a five-minute demo and write a one-page architecture / decision brief.</li></ol></section></main>
}
