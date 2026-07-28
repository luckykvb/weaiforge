import Reveal from '../components/Reveal'
import thumbVideo from '../assets/thumb-video.jpg'
import thumbLogistics from '../assets/thumb-logistics.jpg'
import thumbIntelligence from '../assets/thumb-intelligence.jpg'

const studies = [
  {
    tag: 'AICines — AI video production',
    kind: 'Creative AI pipeline',
    problem: 'Cinematic video at scale meant slow edits and inconsistent style.',
    solution: 'An end-to-end pipeline — prompting, orchestration, automated assembly.',
    result: 'Full spots produced in hours, not weeks',
    thumb: thumbVideo,
    featured: true,
  },
  {
    tag: 'Operations — mid-market logistics',
    kind: 'Workflow automation',
    problem: 'Order exceptions were triaged by hand across email and three systems.',
    solution: 'An agent that reads exceptions and drafts or resolves them automatically.',
    result: '82% of exceptions resolved without a human',
    thumb: thumbLogistics,
  },
  {
    tag: 'Revenue — B2B services',
    kind: 'Decision intelligence',
    problem: 'No single view of pipeline health — problems surfaced a quarter late.',
    solution: 'One live model of CRM, billing, and product data with plain-language alerts.',
    result: 'Forecast accuracy up, surprises down',
    thumb: thumbIntelligence,
  },
]

export default function CaseStudies() {
  return (
    <section className="section section--bordered" id="work">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Proof of work</p>
          <h2 className="section__title">Systems in production, not slideware.</h2>
        </Reveal>

        <div className="work__grid">
          {studies.map((c, i) => (
            <Reveal
              key={c.tag}
              className={`card work__card ${c.featured ? 'work__card--featured' : ''}`}
              delay={i * 90}
            >
              <div className="work__thumb">
                <img src={c.thumb} alt="" />
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
