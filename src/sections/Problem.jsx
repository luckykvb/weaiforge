import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

const problems = [
  {
    icon: 'loop',
    title: 'Work that repeats itself',
    body: 'Your team re-keys data, chases approvals, and copies information between tools all day. It scales headcount, not output.',
  },
  {
    icon: 'scatter',
    title: 'Data with no line of sight',
    body: 'Numbers live in spreadsheets, inboxes, and five SaaS dashboards. Nobody can answer a simple question without a fire drill.',
  },
  {
    icon: 'clock',
    title: 'Responses that arrive too late',
    body: 'Customers and leads wait hours for a reply that a well-built system could have handled correctly in seconds.',
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
