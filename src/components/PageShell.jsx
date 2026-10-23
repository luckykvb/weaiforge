import { siteConfig } from '../siteConfig'
import logo from '../assets/logo.png'
import ThemeSwitcher from './ThemeSwitcher'

// Header + footer for standalone pages (legal, services) that live outside the
// single-page homepage.
export default function PageShell({ children }) {
  return (
    <>
      <header className="legal__bar">
        <div className="container legal__bar-inner">
          <a href="/" className="nav__logo" aria-label={`${siteConfig.brand} home`}>
            <img src={logo} alt={siteConfig.brand} className="nav__logo-img" />
          </a>
          <ThemeSwitcher/>
          <a href="/" className="legal__back">
            ← Back to site
          </a>
        </div>
      </header>

      {children}

      <footer className="container footer__bottom legal__footer">
        <span>
          © {new Date().getFullYear()} {siteConfig.brand}. All rights reserved.
        </span>
        <span className="footer__legal">
          {siteConfig.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </span>
      </footer>
    </>
  )
}
