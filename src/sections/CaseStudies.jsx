import Reveal from '../components/Reveal'

// TODO: swap thumb gradients for real image/video thumbnails, and replace the
// placeholder metrics/names with your actual project details.
const studies = [
  {
    tag: 'AICines — AI video production',
    kind: 'Creative AI pipeline',
    problem:
      'Producing cinematic short-form video at scale meant slow, manual editing and inconsistent style across every render.',
    solution:
      'We built an end-to-end generation pipeline — prompt system, model orchestration, and an automated review-and-assembly stage.',
    result: 'Full spots produced in hours, not weeks',
    thumb: 'thumb--a',
    featured: true,
  },
  {
    tag: 'Operations — mid-market logistics',
    kind: 'Workflow automation',
    problem:
      'Order exceptions were triaged by hand across email and three systems, adding days to every escalation.',
    solution:
      'An agent that reads exceptions, pulls context from each system, and drafts or resolves the response automatically.',
    result: '82% of exceptions resolved without a human',
    thumb: 'thumb--b',
  },
  {
    tag: 'Revenue — B2B services',
    kind: 'Decision intelligence',
    problem:
      'Leadership had no single view of pipeline health and reacted to problems a quarter late.',
    solution:
      'We unified CRM, billing, and product data into one live model with plain-language alerts on the metrics that move revenue.',
    result: 'Forecast accuracy up, surprises down',
    thumb: 'thumb--c',
  },
]

export default function CaseStudies() {
  return (
    <section className="section section--bordered" id="work">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Proof of work</p>
          <h2 className="section__title">Systems in production, not slideware.</h2>
          <p className="section__lead">
            A sample of what we've built. Problem, approach, and the outcome that
            mattered — because that's the only part worth showing.
          </p>
        </Reveal>

        <div className="work__grid">
          {studies.map((c, i) => (
            <Reveal
              key={c.tag}
              className={`card work__card ${c.featured ? 'work__card--featured' : ''}`}
              delay={i * 90}
            >
              <div className={`work__thumb ${c.thumb}`} aria-hidden="true">
                <span className="work__kind">{c.kind}</span>
              </div>
              <div className="work__meta">
                <h3 className="work__name">{c.tag}</h3>
                <dl className="work__psr">
                  <div>
                    <dt>Problem</dt>
                    <dd>{c.problem}</dd>
                  </div>
                  <div>
                    <dt>Solution</dt>
                    <dd>{c.solution}</dd>
                  </div>
                </dl>
                <p className="work__result">
                  <span aria-hidden="true">↳</span> {c.result}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
