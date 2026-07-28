import { useEffect, useState } from 'react'
import { applyTheme, getStoredTheme, themes } from '../theme'

export default function ThemeSwitcher() {
  const [active, setActive] = useState(getStoredTheme())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    applyTheme(active)
  }, [])

  function select(id) {
    setActive(id)
    applyTheme(id)
    setOpen(false)
  }

  return (
    <div className={`theme-switcher ${open ? 'theme-switcher--open' : ''}`}>
      <button
        type="button"
        className="theme-switcher__toggle"
        aria-label="Change color theme"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="theme-switcher__dot" style={{ background: themes.find((t) => t.id === active)?.swatch }} />
      </button>

      <div className="theme-switcher__panel" role="menu" hidden={!open}>
        <p className="theme-switcher__label">Theme</p>
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            role="menuitemradio"
            aria-checked={active === t.id}
            className={`theme-switcher__option ${active === t.id ? 'is-active' : ''}`}
            onClick={() => select(t.id)}
          >
            <span className="theme-switcher__dot" style={{ background: t.swatch }} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
