import Reveal from '../components/Reveal'
import { siteConfig } from '../siteConfig'

export default function FinalCTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta__glow" aria-hidden="true" />
      <div className="container cta__inner">
        <Reveal>
          <p className="eyebrow cta__eyebrow">Start here</p>
          <h2 className="cta__title">Let's build something.</h2>
          <p className="cta__sub">
            Bring one real problem. In 30 minutes we'll tell you whether AI is the
            right tool — and how we'd approach it.
          </p>

          <div className="cta__actions">
            <a href={siteConfig.bookingUrl} className="btn btn--primary cta__btn">
              Book a Discovery Call
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href={`mailto:${siteConfig.contactEmail}`} className="btn btn--ghost">
              {siteConfig.contactEmail}
            </a>
          </div>

          <p className="cta__note">
            Prefer async? Email works — we reply within one business day.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
