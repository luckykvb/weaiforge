import { useState } from 'react'
import logo from './assets/logo.png'
import CalendlyBooking, { getCalendlyUrl } from './components/CalendlyBooking'
import JevSection from './components/JevSection'
import OperationsShowcase from './components/OperationsShowcase'
import ThemeSwitcher from './components/ThemeSwitcher'
import { siteConfig } from './siteConfig'

function Mark() {
  return <a className="wordmark" href="/" aria-label="WeAIForge home"><img src={logo} alt="WeAIForge" /></a>
}

const faqs = [
  ['Do we need a technical team to start?', 'No. Bring someone who knows the workflow well. We will work through the current process, the information it depends on, and what a useful prototype should demonstrate.'],
  ['Can you use our existing tools?', 'Discovery establishes which systems and APIs are available, what access is required, and where the workflow can run. Integration scope is agreed before a production build.'],
  ['Is the demonstration a client project?', 'It is a concept demonstration using fictional customer, order, and shipment records. The steps run in your browser. It does not call a model, connect to business systems, or send messages.'],
  ['What happens after the prototype?', 'You receive the prototype, feasibility findings, and a separately scoped production proposal. You can decide whether to proceed after reviewing the results and limitations.'],
  ['Who owns the code, and what about support?', 'Code ownership, infrastructure access, documentation, and handover are agreed in writing before work begins. Production support and ongoing improvements are scoped separately.'],
]

function Contact() {
  const [status, setStatus] = useState('idle')
  const enabled = import.meta.env.VITE_CONTACT_ENABLED === 'true'
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('sent')
      form.reset()
    } catch { setStatus('error') }
  }
  return <section id="contact" className="contact-section page-gutter">
    <div className="contact-copy"><p className="eyebrow">START A CONVERSATION</p><h2>Where does your<br/>team get stuck?</h2><p>Bring one recurring request, the tools your team checks, and the part that takes too long. We’ll discuss whether a scoped prototype makes sense.</p><a className="contact-email" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></div>
    <div className="contact-options"><CalendlyBooking compact/>
      {enabled ? <form onSubmit={submit} aria-busy={status === 'sending'}><h3>Send an enquiry</h3><div className="form-pair"><label>Your name<input required maxLength="100" name="name" autoComplete="name"/></label><label>Work email<input required type="email" maxLength="254" name="email" autoComplete="email"/></label></div><label>What do you need?<select name="interest"><option>Discovery and prototype</option><option>Workflow development</option><option>Embedded AI engineering</option></select></label><label>Describe the workflow<textarea required minLength="10" maxLength="5000" name="message" rows="4"/></label><label className="contact-trap" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="button primary" disabled={status === 'sending'} type="submit">{status === 'sending' ? 'Sending…' : 'Send enquiry'}</button><p className="form-note" role="status">{status === 'sent' ? 'Enquiry received. Thank you for sharing your workflow.' : status === 'error' ? 'Your enquiry was not sent. Please try again or email us directly.' : 'Please omit passwords, customer records and confidential information.'}</p></form> : <div className="email-invitation"><h3>Prefer to write?</h3><p>Email a short description of the process and the systems involved. No presentation needed.</p><a className="text-link" href={`mailto:${siteConfig.contactEmail}?subject=Workflow%20enquiry`}>Email WeAIForge ↗</a><p className="email-invitation-note">Opens your email app. You review and send the message there.</p></div>}
    </div>
  </section>
}

function StartingEngagement({ bookingTarget }) {
  return <section id="start" className="starting-section page-gutter">
    <div className="starting-intro"><p className="eyebrow">DISCOVERY & PROTOTYPE</p><h2>Start with<br/>one workflow.</h2><p>For operations teams with one repeatable process to improve. We agree the task, sample data and success criteria before building.</p><a className="button primary" href={bookingTarget}>Discuss your workflow</a><p className="engagement-note">First conversation: understand the process, check fit, and agree what a useful test would show. Scope, fee and timing follow in a written proposal.</p></div>
    <div className="deliverables-panel"><h3>A defined first engagement</h3><ol className="deliverables-list">
      <li><h4>A map of the current process</h4><p>Steps, systems, bottlenecks, and the points that need human judgement.</p></li>
      <li><h4>A working prototype</h4><p>One scoped workflow using an agreed sample of data.</p></li>
      <li><h4>A feasibility assessment</h4><p>Findings on quality, limitations, integration requirements, and estimated operating cost.</p></li>
      <li><h4>A production proposal</h4><p>A separate scope for integrations, evaluation, deployment and support. Production rollout is a separate decision.</p></li>
    </ol><p className="prototype-inputs"><strong>What we need from you:</strong> a workflow owner, a walkthrough of the current process, and representative sample data you are able to share.</p></div>
  </section>
}

function AgentDetails({ bookingTarget }) {
  return <section className="engineering-detail page-gutter"><div><p className="eyebrow">WORKFLOW DEVELOPMENT</p><h2>What a production<br/>build includes</h2><p>A prototype tests the idea. A production scope defines how it connects to your business and how your team will operate it.</p><a className="button primary" href={bookingTarget}>Discuss your workflow</a></div><div className="engineering-scope"><h3>Scope the system around the task</h3><dl><div><dt>Inputs and integrations</dt><dd>Source systems, data formats, APIs, identity, and access permissions.</dd></div><div><dt>Quality checks</dt><dd>Representative cases, expected outputs, failure handling, and review criteria.</dd></div><div><dt>Action boundaries</dt><dd>Permitted actions, approval gates, escalation routes, and an action history.</dd></div><div><dt>Operation</dt><dd>Deployment, monitoring, operating costs, recovery, documentation, and support.</dd></div></dl></div></section>
}

function EngineeringDetails({ bookingTarget }) {
  return <>
    <section className="engineering-detail page-gutter"><div><p className="eyebrow">EMBEDDED AI ENGINEERING</p><h2>Engineering support<br/>inside your team.</h2><p>For teams with an existing roadmap and delivery process. We agree priorities with your engineers and operators, then work directly on implementation.</p><a className="button primary" href={bookingTarget}>Discuss engineering support</a></div><div className="engineering-scope"><h3>Define the engagement before work starts</h3><dl><div><dt>Focus</dt><dd>Agent workflows, tool integrations, evaluation, or production readiness.</dd></div><div><dt>Working arrangement</dt><dd>Allocation, working hours, tools, access, and remote or on-site requirements.</dd></div><div><dt>Delivery</dt><dd>Agreed milestones, regular working demos, and documented decisions.</dd></div><div><dt>Handover</dt><dd>Code ownership, operating notes, knowledge transfer, and any ongoing support.</dd></div></dl></div></section>
  </>
}

function PrototypeEvidence() {
  return <section id="work" className="prototype-evidence page-gutter"><div><p className="eyebrow">INSIDE THE EXAMPLE</p><h2>What this prototype<br/>actually demonstrates.</h2><p>An original browser prototype using fictional operations records. A small, inspectable example of the decisions an implementation needs to handle.</p><span className="project-kind">Self-directed concept · No client deployment</span></div><div className="prototype-findings"><article><h3>One request, different routes</h3><p>A delivery estimate supports a customer update. Missing tracking produces an investigation request. A refund request goes to a person without promising eligibility.</p></article><article><h3>Approval is a separate action</h3><p>Opening the final stage does not approve anything. Editing the proposed action clears its approval; switching scenarios starts a fresh sample.</p></article><details><summary>Implementation choices and limits</summary><p>React manages the scenario, draft and approval state. Decisions and text are predefined, not model-generated. This tests the interaction and proposed rules; it does not measure AI accuracy or prove production integration.</p><p>A production evaluation would need representative cases, expected routes, failure handling, access controls, integration tests and measured operating cost.</p></details></div></section>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const detail = location.pathname.includes('forward-deployed') ? 'engineering' : location.pathname.includes('ai-agents') ? 'agents' : null
  const home = detail ? '/' : ''
  const bookingTarget = getCalendlyUrl(siteConfig.calendlyUrl) ? '#book' : '#contact'
  return <div className="forge"><a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header page-gutter"><Mark/><nav className={menu ? 'open' : ''} aria-label="Primary">{[['Example workflow', '#demo'], ['Start a project', '#start'], ['Our approach', '#approach']].map(([label,url]) => <a key={url} href={home+url} onClick={() => setMenu(false)}>{label}</a>)}</nav><a className="header-cta" href={bookingTarget}>Discuss your workflow</a><ThemeSwitcher/><button className="menu-toggle" aria-expanded={menu} aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'} <span>{menu ? '−' : '+'}</span></button></header>
    <main id="main">
      <section className="studio-hero page-gutter">
        <div className="studio-hero-copy"><p className="eyebrow studio-hero-brand">WeAIForge / AI engineering studio</p>
          <h1>{detail === 'engineering' ? <>AI engineering<br/>for your<br/><span>existing team.</span></> : detail === 'agents' ? <>AI agents for<br/>the work between<br/><span>your tools.</span></> : <>Customer requests.<br/>Connected records.<br/><span>Less chasing.</span></>}</h1>
          <p>{detail === 'engineering' ? 'Add hands-on support for agent development, integrations, and evaluation. Work within your tools, priorities, and delivery process.' : 'We help operations teams turn customer requests into informed replies and clear handoffs by connecting the records scattered across their tools.'}</p>
          <div className="studio-hero-actions"><a className="button primary" href={bookingTarget}>Discuss your workflow</a><a className="text-link" href="#demo">Explore an example <span aria-hidden="true">↓</span></a></div>
        </div>
        <aside className="workflow-starts" aria-label="Examples of work we can help with"><p className="eyebrow">BUILT AROUND YOUR OPERATIONS</p><div><h2>Request handling</h2><p>Bring order, account and shipment context together before preparing a reply.</p></div><div><h2>Documents and exceptions</h2><p>Check incoming details against your records and surface missing information.</p></div><div><h2>Answers with sources</h2><p>Find the relevant policy or record so your team can check the recommendation.</p></div></aside>
      </section>
      {detail === 'engineering' && <EngineeringDetails bookingTarget={bookingTarget}/>}
      {detail === 'agents' && <AgentDetails bookingTarget={bookingTarget}/>}
      <StartingEngagement bookingTarget={bookingTarget}/>
      <OperationsShowcase/>
      <JevSection/>
      <PrototypeEvidence/>
      <section id="approach" className="working-section page-gutter"><div><p className="eyebrow">HOW WE WORK</p><h2>Agree what good looks like.<br/>Then test against it.</h2><p>Useful automation needs clear boundaries and a way to check the results. These are part of the scope.</p></div><div className="working-practices"><article><h3>Test on representative cases</h3><p>Agree the inputs, expected outputs, and failure cases. Review quality and estimated cost before expanding the workflow.</p></article><article><h3>Keep actions within agreed limits</h3><p>Define what the system can access, what it can propose, and which actions need approval or escalation.</p></article><article><h3>Make the system maintainable</h3><p>Agree deployment, code ownership, operating documentation, and handover so your team understands what it receives.</p></article></div></section>
      {detail !== 'engineering' && <section id="engineering" className="embedded-note page-gutter"><div><h2>Already have a technical team?</h2><p>We also provide embedded AI engineering for teams that need help implementing an existing roadmap.</p></div><a className="text-link" href="/forward-deployed-engineering">About embedded engineering <span aria-hidden="true">↗</span></a></section>}
      <section className="faq-section page-gutter"><div><p className="eyebrow">BEFORE YOU START</p><h2>Common questions</h2></div><div>{faqs.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <Contact/>
    </main>
    <footer className="site-footer page-gutter"><div><Mark/><p>Custom AI workflows and engineering.</p></div><div><span className="footer-label">SERVICES</span><a href="/ai-agents">Workflow development</a><a href="/forward-deployed-engineering">Embedded engineering</a><a href="/#demo">Concept demonstration</a></div><div><span className="footer-label">CONTACT</span><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a><a href="#contact">Discuss your workflow</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} WeAIForge</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div></footer>
  </div>
}
