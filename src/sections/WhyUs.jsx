import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import { siteConfig } from '../siteConfig'

const points = [
  {
    icon: 'founder',
    title: 'Founder-led, hands-on delivery',
    body: 'The person who scopes your project builds it. No hand-offs.',
  },
  {
    icon: 'bespoke',
    title: 'Custom-built, not off-the-shelf',
    body: 'Architected around your data. You own the system, no lock-in.',
  },
  {
    icon: 'studio',
    title: 'Creative and technical under one roof',
    body: 'Real production experience in AI video, backed by engineering rigor.',
  },
  {
    icon: 'ship',
    title: 'Built to ship, then to last',
    body: 'Working in your hands quickly — and reliable long after launch.',
  },
]

export default function WhyUs() {
  return (
    <section className="section section--bordered" id="why">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Why {siteConfig.brand}</p>
          <h2 className="section__title">A studio, not a vendor.</h2>
        </Reveal>

        <div className="why__grid">
          {points.map((p, i) => (
            <Reveal key={p.title} className="why__item" delay={(i % 2) * 90}>
              <span className="why__icon">
                <Icon name={p.icon} size={22} />
              </span>
              <div>
                <h3 className="why__title">{p.title}</h3>
                <p className="why__body">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
