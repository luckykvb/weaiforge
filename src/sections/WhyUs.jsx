import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

const points = [
  {
    icon: 'founder',
    title: 'Founder-led, hands-on delivery',
    body: 'The person who scopes your project is the person who builds it. No account managers, no hand-offs to a junior bench.',
  },
  {
    icon: 'bespoke',
    title: 'Custom-built, not off-the-shelf',
    body: 'We architect around your data and workflow. You own the system and the code — there is no platform lock-in.',
  },
  {
    icon: 'studio',
    title: 'Creative and technical under one roof',
    body: 'Real production experience in AI video and content, backed by engineering rigor. Rare to find both in one team.',
  },
  {
    icon: 'ship',
    title: 'Built to ship, then to last',
    body: 'We optimize for something working in your hands quickly — and for it staying reliable long after launch.',
  },
]

export default function WhyUs() {
  return (
    <section className="section section--bordered" id="why">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">Why Axon</p>
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
