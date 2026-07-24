import Reveal from '../components/Reveal'

const steps = [
  {
    label: 'Discover',
    body: 'We audit the workflow, quantify the cost of the problem, and agree on what a win measurably looks like.',
  },
  {
    label: 'Design',
    body: 'You get a clear architecture — data flow, models, integrations, and guardrails — before a line of production code is written.',
  },
  {
    label: 'Build',
    body: 'We ship in short increments against your real data, so you see working software early and steer as it takes shape.',
  },
  {
    label: 'Deploy & Support',
    body: 'We roll it into your operation, train your team, and stay on to monitor, tune, and extend as needs change.',
  },
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
