import { useEffect, useState } from 'react'
import { applyTheme, applyMode, getStoredTheme, getStoredMode, getModePreference, MODE_EVENT, themes } from '../theme'

export default function ThemeSwitcher() {
  const [active, setActive] = useState(getStoredTheme())
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(getStoredMode)
  const [preference, setPreference] = useState(getModePreference)
  const [modeOpen, setModeOpen] = useState(false)

  useEffect(() => {
    applyTheme(active)
    applyMode(preference)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => { if (preference === 'system') applyMode('system') }
    const onModeChange = event => { setMode(event.detail.mode); setPreference(event.detail.preference) }
    query.addEventListener('change', onSystemChange)
    window.addEventListener(MODE_EVENT, onModeChange)
    return () => {
      query.removeEventListener('change', onSystemChange)
      window.removeEventListener(MODE_EVENT, onModeChange)
    }
  }, [preference])

  function select(id) {
    setActive(id)
    applyTheme(id)
    setOpen(false)
  }

  return (
    <div className="appearance-controls">
    <div className="mode-picker" onKeyDown={e => { if (e.key === 'Escape') { setModeOpen(false); e.currentTarget.querySelector('button').focus() } }}>
    <button type="button" className="mode-toggle" aria-label="Choose light, dark, or system appearance" title={`Appearance: ${preference}`} aria-expanded={modeOpen} aria-haspopup="menu" onClick={() => { setModeOpen(v => !v); setOpen(false) }}>
      {mode === 'dark' ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg> : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg>}
    </button>
    <div className="theme-switcher__panel" role="menu" aria-label="Appearance" hidden={!modeOpen}>
      <p className="theme-switcher__label">Appearance</p>
      {['light', 'dark', 'system'].map(value => <button key={value} type="button" role="menuitemradio" aria-checked={preference === value} className={`theme-switcher__option ${preference === value ? 'is-active' : ''}`} onClick={() => {
        setPreference(value)
        applyMode(value)
        setModeOpen(false)
      }}>{value === 'system' ? 'System' : value === 'dark' ? 'Dark' : 'Light'}<span className="appearance-check" aria-hidden="true">{preference === value ? '✓' : ''}</span></button>)}
    </div>
    </div>
    <div className={`theme-switcher ${open ? 'theme-switcher--open' : ''}`} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); e.currentTarget.querySelector('button').focus() } }}>
      <button
        type="button"
        className="theme-switcher__toggle"
        aria-label="Change color theme"
        aria-expanded={open}
        onClick={() => { setOpen(v => !v); setModeOpen(false) }}
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
    </div>
  )
}
