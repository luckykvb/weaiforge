import { useState } from 'react'
import logo from './assets/logo.png'
import CalendlyBooking, { getCalendlyUrl } from './components/CalendlyBooking'
import OperationsShowcase from './components/OperationsShowcase'
import ThemeSwitcher from './components/ThemeSwitcher'
import WorkflowPreview from './components/WorkflowPreview'
import { siteConfig } from './siteConfig'

const Arrow = () => <span aria-hidden="true">↗</span>
function Mark() { return <a className="wordmark" href="/" aria-label="WeAIForge home"><img src={logo} alt="WeAIForge" /></a> }
const delivery = [
  ['Find the opportunity', 'We map one workflow, its bottlenecks, and what a useful result would look like.', 'Workflow map + success criteria'],
  ['Make it tangible', 'Try a focused prototype with an agreed data sample. See what works and where it needs a person.', 'Working prototype + feasibility review'],
  ['Build it into your business', 'Connect your tools, evaluate the system, and prepare a rollout your team can own.', 'Integrations + deployment + handover'],
]
const faqs = [
  ['Do we need a technical team to get started?', 'No. Start with a workflow your team knows well. We will help map the problem, identify the data and systems involved, and scope a useful first prototype.'],
  ['What can an AI agent actually do?', 'It can use business context and approved tools to work through a multi-step task: investigate an issue, extract information, draft an answer, or prepare an action. We define the boundaries and the points that need human review.'],
  ['Are these examples real client projects?', 'The examples on this site are local concept demonstrations with fictional records. The video is assembled from screenshots of the sample interface. They demonstrate workflows and review points, rather than a live AI service or a client deployment.'],
  ['Can you work with our existing tools?', 'We scope integrations around your current systems and available APIs. Discovery establishes what access is needed, what is feasible, and where the system should run.'],
  ['What happens after the prototype?', 'You receive feasibility findings and a separately scoped production plan. If we proceed, we agree integrations, evaluation, deployment, documentation, ownership, and any ongoing support before the build.'],
]
function Contact() {
  const [prepared, setPrepared] = useState(false)
  return <section id="contact" className="contact-section page-gutter">
    <div className="contact-copy"><p className="eyebrow">LET’S MAKE SOMETHING USEFUL</p><h2>What’s taking<br/>too much of<br/><span>your team’s time?</span></h2><p>Tell us about the work. We’ll help you find a practical place to start.</p><a className="text-link" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail} <Arrow/></a></div>
    <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`${f.get('interest')} enquiry from ${f.get('name')}`)}&body=${encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nInterest: ${f.get('interest')}\n\n${f.get('message')}`)}`; setPrepared(true) }}>
      <p className="form-heading">A good project starts with a conversation.</p><div className="form-pair"><label>Your name<input required name="name" autoComplete="name" placeholder="Alex Taylor"/></label><label>Work email<input required type="email" name="email" autoComplete="email" placeholder="alex@company.com"/></label></div><label>What are you looking for?<select name="interest"><option>Explore a workflow opportunity</option><option>Build an agentic solution</option><option>Embed an AI engineer</option></select></label><label>Tell us about the work<textarea required name="message" rows="4" placeholder="What does your team do manually today? Where does it get stuck?"/></label><button className="button primary" type="submit">Prepare project enquiry <Arrow/></button><p className="form-note" role="status">{prepared ? 'Your draft is ready in your email app. Send it there to contact us.' : 'Opens a draft in your email app. Send it there to get in touch.'}</p>
    </form>
  </section>
}
export default function App() {
  const [menu, setMenu] = useState(false)
  const detail = location.pathname.includes('forward-deployed') ? 'engineering' : location.pathname.includes('ai-agents') ? 'agents' : null
  const home = detail ? '/' : ''
  const hasCalendar = Boolean(getCalendlyUrl(siteConfig.calendlyUrl))
  const bookingTarget = hasCalendar ? '#book' : '#contact'
  return <div className="forge"><a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header page-gutter"><Mark/><nav className={menu ? 'open' : ''} aria-label="Primary">{[['What we build', '#possibilities'], ['See it in action', '#demo'], ['How we work', '#approach']].map(([label,url]) => <a key={url} href={home+url} onClick={() => setMenu(false)}>{label}</a>)}</nav><a className="header-cta" href={bookingTarget}>Let’s talk <Arrow/></a><ThemeSwitcher/><button className="menu-toggle" aria-expanded={menu} aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'} <span>{menu ? '−' : '+'}</span></button></header>
    <main id="main">
      <section className="hero-section page-gutter">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> AI SYSTEMS. BUILT AROUND YOUR BUSINESS.</p>
          <h1>{detail === 'engineering' ? <>Your next<br/>AI engineer.<br/><span>In your corner.</span></> : detail === 'agents' ? <>Turn the<br/>repetitive into<br/><span>remarkable.</span></> : <>Your people.<br/>Their potential.<br/><span>Less busywork.</span></>}</h1>
          <p className="hero-description">{detail === 'engineering' ? 'Hands-on AI engineering inside your team. From the first integration to the production rollout, we help move your roadmap forward.' : 'We build AI agents that help your team move work forward from customer requests to documents and decisions. Connected to your tools. Designed for human oversight.'}</p>
          <div className="hero-buttons"><a className="button primary" href={bookingTarget}>Find your first opportunity <Arrow/></a><a className="hero-secondary" href="#demo"><span className="play-circle" aria-hidden="true">▷</span> See what’s possible</a></div>
          <div className="hero-bottom-note"><span aria-hidden="true">↓</span><p>Start with one workflow.<br/>Build toward a different working day.</p></div>
        </div>
        <div className="hero-work"><div className="hero-work-label"><span>THE POSSIBILITIES, MADE TANGIBLE</span><span>01—03</span></div><WorkflowPreview/></div>
      </section>
      <div className="capability-strip page-gutter"><p>From the first <em>“what if”</em><br/>to something your team can use.</p><div><span>YOUR TOOLS</span><span>YOUR BUSINESS CONTEXT</span><span>YOUR TEAM IN CONTROL</span></div><a href="#solutions" className="text-link">Explore how we help <span aria-hidden="true">↓</span></a></div>
      <OperationsShowcase/>
      <section id="solutions" className="engagement-section page-gutter">
        <div className="section-kicker"><span>02 / WORKING TOGETHER</span><span>ONE PARTNER. TWO WAYS TO BUILD.</span></div>
        <div className="engagement-heading"><h2>The ambition is yours.<br/><span>Let’s build the way forward.</span></h2><p>A team to take an idea through delivery, or an engineer working alongside yours. Choose the support that fits where you are.</p></div>
        <div className="engagement-grid">
          <article className="engagement-card"><div className="engagement-card-top"><span>01 / BUILD WITH US</span><span aria-hidden="true">↗</span></div><h3>From an opportunity<br/>to a working system.</h3><p>We help define the right problem, build the agent, connect your systems, and prepare it for the way your business operates.</p><div className="engagement-deliverables"><span>Discover & prototype</span><span>Integrate & evaluate</span><span>Deploy & hand over</span></div><a className="text-link" href={detail === 'agents' ? '#contact' : '/ai-agents'}>{detail === 'agents' ? 'Discuss an agentic solution' : 'Explore agentic solutions'} <Arrow/></a></article>
          <article className="engagement-card engagement-card-embedded" id="engineering"><div className="engagement-card-top"><span>02 / BUILD ALONGSIDE US</span><span aria-hidden="true">↗</span></div><h3>Your roadmap.<br/>More hands on it.</h3><p>Embed AI engineering directly into your team. Work together on integrations, evaluations, and the delivery milestones that matter.</p><div className="engagement-deliverables"><span>Shared tools & priorities</span><span>Regular working demos</span><span>Knowledge transfer</span></div><a className="text-link" href={detail === 'engineering' ? '#contact' : '/forward-deployed-engineering'}>{detail === 'engineering' ? 'Discuss embedded engineering' : 'Explore embedded engineering'} <Arrow/></a></article>
        </div>
      </section>
      <section id="approach" className="approach-section page-gutter"><div className="approach-intro"><p className="eyebrow">03 / THE WAY WE WORK</p><h2>Think clearly.<br/>Build something.<br/><span>Learn from it.</span></h2><p>Progress you can see. Decisions you can understand. A useful deliverable at every stage.</p><a className="text-link" href="#contact">Talk through your idea <Arrow/></a></div><div className="delivery-list">{delivery.map(([title,body,output],i) => <article key={title}><span className="delivery-number">0{i+1}</span><div><h3>{title}</h3><p>{body}</p><span className="delivery-output">↳ {output}</span></div></article>)}<div className="production-note"><span aria-hidden="true">✳</span><p><strong>The foundations matter, too.</strong> Permissions, approval points, evaluation, and operating documentation are part of the build.</p></div></div></section>
      <section className="starter-section page-gutter"><span className="starter-mark" aria-hidden="true">↗</span><div><p className="eyebrow">A SMALLER FIRST STEP. A CLEARER NEXT MOVE.</p><h2>You don’t need an AI roadmap.<br/>You need a good place to start.</h2><p>Bring one workflow. We’ll scope a discovery and prototype to test the opportunity, surface the limitations, and shape the next step.</p></div><a className="button primary" href={bookingTarget}>Let’s find that workflow <Arrow/></a></section>
      <section className="faq-section page-gutter"><div><p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p><h2>Good questions.<br/><span>Clear answers.</span></h2></div><div>{faqs.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <CalendlyBooking/>
      <Contact/>
    </main>
    <footer className="site-footer page-gutter"><div><Mark/><p>Useful intelligence.<br/>Built around your business.</p></div><div><span className="footer-label">EXPLORE</span><a href="/ai-agents">Agentic solutions</a><a href="/forward-deployed-engineering">Embedded engineering</a><a href="/#demo">Concept demonstrations</a></div><div><span className="footer-label">GET IN TOUCH</span><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a><a href="#contact">Tell us about your project <Arrow/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} WeAIForge</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><span>Ideas → useful systems.</span></div></div></footer>
  </div>
}
