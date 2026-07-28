import Reveal from '../components/Reveal'
import aboutPhoto from '../assets/about.jpg'

export default function About() {
  return (
    <section className="section section--bordered" id="about">
      <div className="container about__grid">
        <Reveal className="about__portrait">
          <div className="about__photo">
            <img src={aboutPhoto} alt="" />
          </div>
          <p className="about__caption">Founder &amp; principal engineer</p>
        </Reveal>

        <Reveal className="about__body" delay={100}>
          <p className="eyebrow">About</p>
          <h2 className="about__title">
            Built by someone who's shipped the hard part.
          </h2>
          <p className="about__text">
            Founder-led. I've spent years building AI systems in production —
            video pipelines, agents, real operational workflows — for teams who
            needed results, not research. You deal with me directly, start to
            deploy.
          </p>
          <a href="#contact" className="about__link">
            Let's talk about your problem
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
