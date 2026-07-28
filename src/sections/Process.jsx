import Reveal from '../components/Reveal'

const steps = [
  { label: 'Discover', body: 'Audit the workflow and agree what a win looks like.' },
  { label: 'Design', body: 'Architecture, models, and guardrails — before code.' },
  { label: 'Build', body: 'Short increments against real data, steered as it takes shape.' },
  { label: 'Deploy & Support', body: 'Rolled into your operation. We stay on to tune and extend.' },
]

export default function Process() {
  return (
    <section className="section section--bordered" id="process">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">How we work</p>
          <h2 className="section__title">A short path from problem to production.</h2>
        </Reveal>

        <ol className="process__track">
          <div className="process__line" aria-hidden="true" />
          {steps.map((s, i) => (
            <Reveal key={s.label} as="li" className="process__step" delay={i * 120}>
              <span className="process__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="process__dot" aria-hidden="true" />
              <h3 className="process__label">{s.label}</h3>
              <p className="process__body">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
