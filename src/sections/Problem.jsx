import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

const problems = [
  {
    icon: 'loop',
    title: 'Work that repeats itself',
    body: 'Re-keying data and chasing approvals scales headcount, not output.',
  },
  {
    icon: 'scatter',
    title: 'Data with no line of sight',
    body: 'Numbers scattered across tools — no simple question has a fast answer.',
  },
  {
    icon: 'clock',
    title: 'Responses that arrive too late',
    body: 'Leads wait hours for what a good system handles in seconds.',
  },
]

export default function Problem() {
  return (
    <section className="section section--bordered" id="problem">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">The reality</p>
          <h2 className="section__title">
            The problem isn't ambition. It's operational drag.
          </h2>
        </Reveal>

        <div className="problem__grid">
          {problems.map((p, i) => (
            <Reveal key={p.title} className="problem__item" delay={i * 90}>
              <span className="problem__icon">
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className="problem__title">{p.title}</h3>
              <p className="problem__body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
