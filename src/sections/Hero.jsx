import { useEffect, useState } from 'react'
import HeroCanvas from '../components/HeroCanvas'
import ProductShowcase from '../components/ProductShowcase'
import { Spotlight } from '../components/Spotlight'
import { siteConfig } from '../siteConfig'
import { getAccentRgb, getStoredTheme, THEME_EVENT } from '../theme'

export default function Hero() {
  const [accentRgb, setAccentRgb] = useState(() => getAccentRgb(getStoredTheme()))

  useEffect(() => {
    const onThemeChange = (e) => setAccentRgb(getAccentRgb(e.detail.theme))
    window.addEventListener(THEME_EVENT, onThemeChange)
    return () => window.removeEventListener(THEME_EVENT, onThemeChange)
  }, [])

  return (
    <section className="hero" id="top">
      <HeroCanvas />
      <Spotlight size={420} color={`rgba(${accentRgb}, 0.22)`} />
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
            Automation, agents, and data intelligence — built for operators who
            want results, not another dashboard.
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
          <ProductShowcase />
        </div>
      </div>

      <a href="#solutions" className="hero__scroll" aria-label="Scroll to solutions">
        <span className="hero__scroll-line" />
        Scroll
      </a>
    </section>
  )
}
