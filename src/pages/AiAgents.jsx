import PageShell from '../components/PageShell'
import { siteConfig } from '../siteConfig'

export const AI_AGENTS_FAQ = [
  {
    q: 'What is the difference between an AI agent and a chatbot?',
    a: 'A chatbot answers questions. An agent takes action: it reads from your systems, decides what to do within rules you set, and does it, such as drafting a reply, updating a record or routing a case. We build both, and many projects start as a chatbot and grow into an agent.',
  },
  {
    q: 'Can an agent work with the tools we already use?',
    a: 'Yes. We connect agents to your existing email, CRM, databases, ticketing and internal tools, rather than asking you to move to something new. During discovery we map which systems the agent needs and what access it should have.',
  },
  {
    q: 'How do you keep an agent from making costly mistakes?',
    a: 'Guardrails are designed before any code is written. Typical controls include limited permissions, human approval for sensitive actions, full logging of what the agent did and why, and a clear hand-off to a person when it is unsure. We test against your real cases before it goes live.',
  },
  {
    q: 'Who owns the system you build?',
    a: 'Every engagement is aimed at ending in a system you own. Ownership, documentation and hand-over terms are set out in the written agreement for your project.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a 30-minute discovery call and bring one real problem. We will tell you whether an agent is the right tool and how we would approach it.',
  },
]

const builds = [
  {
    t: 'Operations agents',
    d: 'Read incoming exceptions, orders or requests across email and internal systems, then draft or resolve them automatically.',
  },
  {
    t: 'Support and internal assistants',
    d: 'Answer customer or staff questions from your own documents and data, and take simple actions on their behalf.',
  },
  {
    t: 'Research and data agents',
    d: 'Gather, check and summarise information from many sources into a form your team can act on.',
  },
  {
    t: 'Multi-step workflow agents',
    d: 'Handle a process end to end, with checkpoints where a person approves before anything irreversible happens.',
  },
]

const guardrails = [
  'Scoped permissions: the agent can only touch what it needs to',
  'Human approval for sensitive or irreversible actions',
  'A full log of every action and the reasoning behind it',
  'Clear fallback to a person when confidence is low',
  'Testing against your real cases before launch',
]

const steps = [
  ['Discover', 'Audit the workflow and agree what a win looks like.'],
  ['Design', 'Architecture, models and guardrails, before code.'],
  ['Build', 'Short increments against real data, steered as it takes shape.'],
  ['Deploy & Support', 'Rolled into your operation. We stay on to tune and extend.'],
]

export default function AiAgents() {
  return (
    <PageShell>
      <main className="container svc">
        <p className="eyebrow">AI Agents &amp; Chatbots</p>
        <h1 className="svc__title">Custom AI agents that take real action on your tools and data.</h1>
        <p className="svc__lead">
          {siteConfig.brand} designs and builds AI agents and chatbots for businesses that
          want results, not another dashboard. Every agent is built around a real bottleneck,
          wired into the tools you already use, and shipped with guardrails.
        </p>
        <div className="svc__actions">
          <a href={siteConfig.bookingUrl} className="btn btn--primary">
            Book a Discovery Call <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a href="/#work" className="btn btn--ghost">
            See our work
          </a>
        </div>

        <section className="svc__section">
          <h2>What we build</h2>
          <div className="svc__grid">
            {builds.map((b) => (
              <div key={b.t} className="card svc__card">
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="svc__section">
          <h2>Guardrails, built in from day one</h2>
          <p className="svc__text">
            An agent is only useful if you can trust it. We design the limits before the
            code, so it acts confidently where it should and stops where it must.
          </p>
          <ul className="svc__list">
            {guardrails.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>

        <section className="svc__section">
          <h2>How an engagement works</h2>
          <ol className="svc__steps">
            {steps.map(([t, d], i) => (
              <li key={t}>
                <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="svc__text">
            Work is available as a fixed-scope project, an ongoing retainer, or a custom
            enterprise engagement for complex or regulated environments.
          </p>
        </section>

        <section className="svc__section">
          <h2>Frequently asked questions</h2>
          {AI_AGENTS_FAQ.map((f) => (
            <details key={f.q} className="svc__faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section className="svc__cta">
          <h2>Bring one real problem.</h2>
          <p>
            In 30 minutes we will tell you whether an AI agent is the right tool, and how
            we would approach it.
          </p>
          <a href={siteConfig.bookingUrl} className="btn btn--primary">
            Book a Discovery Call <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </section>
      </main>
    </PageShell>
  )
}
