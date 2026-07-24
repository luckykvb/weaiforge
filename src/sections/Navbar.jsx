import { useEffect, useState } from 'react'
import { siteConfig } from '../siteConfig'

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" aria-label={`${siteConfig.brand} home`}>
          <span className="nav__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          {siteConfig.brand}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href={siteConfig.bookingUrl} className="btn btn--primary nav__cta">
          Book a Call
        </a>

        <button
          className="nav__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="nav__mobile" hidden={!open}>
        {siteConfig.nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a
          href={siteConfig.bookingUrl}
          className="btn btn--primary"
          onClick={() => setOpen(false)}
        >
          Book a Call
        </a>
      </div>
    </header>
  )
}
