import Reveal from '../components/Reveal'

export default function About() {
  return (
    <section className="section section--bordered" id="about">
      <div className="container about__grid">
        <Reveal className="about__portrait">
          {/* TODO: replace with founder photo — <img src="/founder.jpg" alt="..." /> */}
          <div className="about__photo" aria-hidden="true">
            <span className="about__initials">AX</span>
          </div>
          <p className="about__caption">Founder &amp; principal engineer</p>
        </Reveal>

        <Reveal className="about__body" delay={100}>
          <p className="eyebrow">About</p>
          <h2 className="about__title">
            Built by someone who's shipped the hard part.
          </h2>
          {/* TODO: replace with the real founder narrative. */}
          <p className="about__text">
            Axon is a founder-led studio. I've spent the last several years
            building AI systems in production — from automated video pipelines to
            agents that run real operational workflows — for teams who needed
            results, not research.
          </p>
          <p className="about__text">
            That means I sweat the parts most vendors skip: how the system behaves
            on messy real-world data, how it fails safely, and how your team keeps
            it running once the engagement ends. If we work together, you deal with
            me directly from first call to deploy.
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
