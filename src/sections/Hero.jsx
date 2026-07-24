import HeroCanvas from '../components/HeroCanvas'
import { SplineScene } from '../components/SplineScene'
import { Spotlight } from '../components/Spotlight'
import { siteConfig } from '../siteConfig'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <HeroCanvas />
      <Spotlight size={420} color="rgba(120, 150, 255, 0.28)" />
      <div className="hero__fade" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">
            {siteConfig.brand} — {siteConfig.tagline}
          </p>

          <h1 className="hero__title">
            Engineering-grade{' '}
            <span className="hero__accent">AI solutions.</span>
          </h1>

          <p className="hero__sub">
            Custom automation, agents, and data intelligence engineered end-to-end
            for operators who want measurable outcomes — not another dashboard.
          </p>

          <div className="hero__actions">
            <a href={siteConfig.bookingUrl} className="btn btn--primary">
              Book a Discovery Call
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href="#work" className="btn btn--ghost">
              See Our Work
            </a>
          </div>

          <dl className="hero__stats">
            <div>
              <dt>Systems shipped</dt>
              <dd>40<span>+</span></dd>
            </div>
            <div>
              <dt>Avg. time to first deploy</dt>
              <dd>3<span> wks</span></dd>
            </div>
            <div>
              <dt>Founder-led delivery</dt>
              <dd>100<span>%</span></dd>
            </div>
          </dl>
        </div>

        <div className="hero__scene">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="hero__spline"
          />
        </div>
      </div>

      <a href="#solutions" className="hero__scroll" aria-label="Scroll to solutions">
        <span className="hero__scroll-line" />
        Scroll
      </a>
    </section>
  )
}
