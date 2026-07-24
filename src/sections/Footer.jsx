import { siteConfig } from '../siteConfig'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#top" className="nav__logo footer__logo">
            <span className="nav__mark" aria-hidden="true">
              <span />
              <span />
            </span>
            {siteConfig.brand}
          </a>
          <p className="footer__tag">
            AI systems that solve real business problems. Founder-led, custom-built.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <span className="footer__heading">Navigate</span>
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer__connect">
          <span className="footer__heading">Connect</span>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <div className="footer__social">
            {siteConfig.social.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {year} {siteConfig.brand}. All rights reserved.
        </span>
        <span className="footer__signoff">Built for operators.</span>
      </div>
    </footer>
  )
}
