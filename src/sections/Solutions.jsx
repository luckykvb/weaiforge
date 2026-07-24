import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

const solutions = [
  {
    icon: 'workflow',
    title: 'Workflow Automation',
    body: 'We map the manual process, then rebuild it as a reliable pipeline — approvals, hand-offs, and data entry that run without a human babysitting them.',
  },
  {
    icon: 'agent',
    title: 'AI Agents & Chatbots',
    body: 'Assistants that actually take action against your tools and data — qualifying leads, answering support, and completing tasks, with guardrails you control.',
  },
  {
    icon: 'creative',
    title: 'Content & Creative AI Pipelines',
    body: 'Production systems for images, video, and copy at volume — brand-consistent output generated, reviewed, and shipped through one repeatable workflow.',
  },
  {
    icon: 'data',
    title: 'Data & Decision Intelligence',
    body: 'We unify scattered sources into one model of your business, then surface the metrics and alerts that let you decide fast and act early.',
  },
  {
    icon: 'model',
    title: 'Custom Model Integration',
    body: 'Fine-tuned and retrieval-backed models wired into your stack — private, evaluated, and tuned to your domain instead of a generic API call.',
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
            Every engagement starts from a real bottleneck and ends in a system
            your team owns — not a proof of concept that stalls.
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
