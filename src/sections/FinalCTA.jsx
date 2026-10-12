import { useState } from 'react'
import Reveal from '../components/Reveal'
import { siteConfig } from '../siteConfig'

export default function FinalCTA() {
  const [sent, setSent] = useState(false)

  // No backend: compose the message and hand it to the visitor's email app.
  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = `Project enquiry from ${f.get('name')}`
    const body =
      `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nCompany: ${f.get('company') || '-'}\n\n` +
      `${f.get('message')}`
    window.location.href =
      `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

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

          <form className="cta__form" onSubmit={onSubmit}>
            <div className="cta__row">
              <label>
                Name
                <input name="name" type="text" required autoComplete="name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
            </div>
            <label>
              Company <span className="cta__opt">(optional)</span>
              <input name="company" type="text" autoComplete="organization" />
            </label>
            <label>
              What problem do you want to solve?
              <textarea name="message" rows="4" required />
            </label>
            <button type="submit" className="btn btn--primary cta__btn">
              Send message
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            {sent && (
              <p className="cta__sent" role="status">
                Your email app should open with the message ready to send. If it
                didn't, write to {siteConfig.contactEmail}.
              </p>
            )}
          </form>

          <p className="cta__note">
            Prefer async? Email works — we reply within one business day.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
