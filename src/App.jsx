import { useEffect, useMemo, useState } from 'react'

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

const scenarios = [
  { title: 'Support triage at scale', prompt: 'A customer wants every incoming ticket categorised, assigned, and summarised. The categories and assignment rules are well-defined; summaries must cite the ticket text.', choices: ['A fully autonomous multi-agent system', 'A deterministic workflow with an LLM classification/summarisation step', 'Fine-tune a model before doing anything'], answer: 1, why: 'The route is known. Keep routing deterministic, let the model handle language tasks, validate outputs, and add a human escalation path.' },
  { title: 'Partner knowledge copilot', prompt: 'Partner teams need answers from current integration guides, release notes, and pricing rules. Answers must show source links and respect user entitlements.', choices: ['A basic chatbot using only its training data', 'RAG with access-aware retrieval, citations, evaluation, and feedback capture', 'An agent that can browse public websites only'], answer: 1, why: 'This is a grounding and access-control problem. Retrieval, metadata filters, citations, and test questions are central—not optional.' },
  { title: 'Funnel anomaly response', prompt: 'Paid spend rises, lead-to-meeting conversion drops, and the team needs a Slack alert with the likely segment affected plus a recommended next check.', choices: ['A scheduled data workflow with thresholds plus an LLM-written summary', 'A broad agent with CRM write permission', 'A static monthly dashboard'], answer: 0, why: 'The calculation and trigger are deterministic. An LLM can summarise and suggest investigation; destructive actions should be explicitly approved.' },
]

const recall = [
  { q: 'RAG improves an LLM response by retrieving relevant external ______ before generation.', a: 'context', hint: 'It can be chunks, documents, or passages.' },
  { q: 'A webhook is an HTTP endpoint that is triggered by an ______.', a: 'event', hint: 'Think “something happened elsewhere.”' },
  { q: 'A good production agent needs bounded tool permissions, trace logs, and an ______ strategy.', a: 'evaluation', hint: 'How will you know it works reliably?' },
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

function PracticeLab({ done, finish }) {
  const [scenario, setScenario] = useState(0); const [pick, setPick] = useState(null); const [reveal, setReveal] = useState(false)
  const [recallIndex, setRecallIndex] = useState(0); const [answer, setAnswer] = useState(''); const [recallState, setRecallState] = useState('')
  const s = scenarios[scenario], card = recall[recallIndex]
  const choose = index => { setPick(index); setReveal(true) }
  const checkRecall = () => { const ok = answer.trim().toLowerCase() === card.a; setRecallState(ok ? 'correct' : 'wrong'); if (ok) finish(`recall-${recallIndex}`) }
  return <main className="page"><section className="page-intro"><p className="eyebrow">PRACTICE LAB</p><h1>Reason like a solution engineer.</h1><p>There are rarely magic-framework answers. Identify what is deterministic, what needs model judgment, and where safety or proof belongs.</p></section><div className="lab-grid"><article className="challenge-card"><div className="challenge-header"><span>ARCHITECTURE DETECTIVE</span><span>{scenario + 1} / {scenarios.length}</span></div><h2>{s.title}</h2><p className="scenario-prompt">“{s.prompt}”</p><div className="choices">{s.choices.map((choice, i) => <button disabled={reveal} onClick={() => choose(i)} className={reveal ? (i === s.answer ? 'right' : i === pick ? 'wrong' : '') : ''} key={choice}><b>{String.fromCharCode(65 + i)}</b>{choice}</button>)}</div>{reveal && <div className="explanation"><b>{pick === s.answer ? 'Exactly.' : 'Close—here’s the signal.'}</b><p>{s.why}</p><button className="text-button" onClick={() => { setScenario((scenario + 1) % scenarios.length); setPick(null); setReveal(false) }}>Next scenario →</button></div>}</article><article className="recall-card"><p className="eyebrow">ACTIVE RECALL</p><span className="recall-count">CARD {recallIndex + 1}/{recall.length}</span><h2>{card.q}</h2><p>Hint: {card.hint}</p><input aria-label="Your answer" value={answer} onChange={e => { setAnswer(e.target.value); setRecallState('') }} onKeyDown={e => e.key === 'Enter' && checkRecall()} placeholder="Type the missing word" /><button className="primary" onClick={checkRecall}>Check answer</button>{recallState && <p className={`answer-state ${recallState}`}>{recallState === 'correct' ? '✓ Nice. That is the right idea.' : `Not yet. The answer is “${card.a}”.`}</p>}<button className="text-button next-card" onClick={() => { setRecallIndex((recallIndex + 1) % recall.length); setAnswer(''); setRecallState('') }}>Next card →</button></article></div><section className="roleplay"><p className="eyebrow">SPEAKING REP</p><h2>Try this out loud — 90 seconds, no slides.</h2><blockquote>“A partner asks for an AI assistant that answers questions about their documentation. Walk me through your design, including how you would keep responses accurate, secure, and useful.”</blockquote><div className="roleplay-check"><span>□ clarify users & outcome</span><span>□ explain RAG + citations</span><span>□ name access control</span><span>□ describe eval / feedback</span><span>□ frame next pilot step</span></div></section></main>
}

function ResourceShelf({ filter, setFilter, items }) {
  return <main className="page"><section className="page-intro"><p className="eyebrow">FREE RESOURCE SHELF</p><h1>Watch less. Build more.</h1><p>Each link earns its place by helping you make or explain a real system. Course availability can change; all were free to access when added.</p></section><div className="filter-row"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>{modules.map(m => <button key={m.id} className={filter === m.id ? 'active' : ''} onClick={() => setFilter(m.id)}>{m.title}</button>)}</div><div className="resource-grid">{items.map(item => <a className="resource-card" href={item.url} target="_blank" rel="noreferrer" key={item.title}><span>{item.tag}</span><h2>{item.title}</h2><p>{item.text}</p><b>Open free resource ↗</b></a>)}</div><section className="build-ladder"><p className="eyebrow">THE 30-DAY BUILD LADDER</p><h2>What to make, not just what to consume.</h2><ol><li><b>Week 1:</b> API reader — fetch JSON from a public endpoint and explain each field.</li><li><b>Week 2:</b> RAG mini-demo — ingest a small document set, retrieve sources, and log failures.</li><li><b>Week 3:</b> Automation — use a webhook + branching workflow to route a mock customer request.</li><li><b>Week 4:</b> Capstone — record a five-minute demo and write a one-page architecture / decision brief.</li></ol></section></main>
}
