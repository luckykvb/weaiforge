import Reveal from '../components/Reveal'
import { siteConfig } from '../siteConfig'

const tiers = [
  {
    name: 'Project-Based',
    for: 'One clear problem, one system',
    body: 'Fixed scope, defined outcome and timeline, solved end to end.',
    points: ['Scoped deliverable', 'Fixed timeline', 'Full handover & docs'],
  },
  {
    name: 'Retainer',
    for: 'Ongoing build & improvement',
    body: 'A monthly engagement to ship and expand AI systems as priorities shift.',
    points: ['Continuous delivery', 'Priority support', 'Roadmap partnership'],
    featured: true,
  },
  {
    name: 'Enterprise / Custom',
    for: 'Complex or regulated environments',
    body: 'Deeper integration, security review, and bespoke model work.',
    points: ['Security & compliance', 'Private model hosting', 'Dedicated capacity'],
  },
]

export default function Engagement() {
  return (
    <section className="section section--bordered" id="pricing">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Engagement</p>
          <h2 className="section__title">Ways to work together.</h2>
          <p className="section__lead">
            Pricing scoped to the outcome, not a headcount.
          </p>
        </Reveal>

        <div className="pricing__grid">
          {tiers.map((t, i) => (
            <Reveal
              key={t.name}
              className={`card pricing__card ${t.featured ? 'pricing__card--featured' : ''}`}
              delay={i * 90}
            >
              {t.featured && <span className="pricing__badge">Most common</span>}
              <h3 className="pricing__name">{t.name}</h3>
              <p className="pricing__for">{t.for}</p>
              <p className="pricing__body">{t.body}</p>
              <ul className="pricing__points">
                {t.points.map((p) => (
                  <li key={p}>
                    <span aria-hidden="true">—</span>
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={siteConfig.bookingUrl}
                className={`btn ${t.featured ? 'btn--primary' : 'btn--ghost'} pricing__cta`}
              >
                Contact Us
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
