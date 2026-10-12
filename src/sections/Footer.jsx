import { siteConfig } from '../siteConfig'
import logo from '../assets/logo.png'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#top" className="nav__logo footer__logo">
            <img src={logo} alt={siteConfig.brand} className="nav__logo-img" />
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
          {siteConfig.pages.map((item) => (
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
        <span className="footer__legal">
          {siteConfig.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  )
}
