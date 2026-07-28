import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

const solutions = [
  {
    icon: 'workflow',
    title: 'Workflow Automation',
    body: 'Manual processes rebuilt as reliable pipelines — no human babysitting.',
  },
  {
    icon: 'agent',
    title: 'AI Agents & Chatbots',
    body: 'Assistants that take real action on your tools and data, with guardrails.',
  },
  {
    icon: 'creative',
    title: 'Content & Creative AI Pipelines',
    body: 'Brand-consistent images, video, and copy at volume, one workflow.',
  },
  {
    icon: 'data',
    title: 'Data & Decision Intelligence',
    body: 'One model of your business, with alerts on the metrics that matter.',
  },
  {
    icon: 'model',
    title: 'Custom Model Integration',
    body: 'Private, fine-tuned models wired into your stack — not a generic API.',
  },
]

export default function Solutions() {
  return (
    <section className="section section--bordered" id="solutions">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">What we build</p>
          <h2 className="section__title">Five ways we put AI to work.</h2>
          <p className="section__lead">
            Every engagement starts from a real bottleneck and ends in a system you own.
          </p>
        </Reveal>

        <div className="solutions__grid">
          {solutions.map((s, i) => (
            <Reveal key={s.title} className="card solutions__card" delay={(i % 3) * 80}>
              <span className="solutions__icon">
                <Icon name={s.icon} size={24} />
              </span>
              <h3 className="solutions__title">{s.title}</h3>
              <p className="solutions__body">{s.body}</p>
            </Reveal>
          ))}
          <Reveal className="solutions__cta" delay={160}>
            <p>Not sure which one you need?</p>
            <a href="#contact" className="solutions__link">
              Start with a discovery call
              <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
