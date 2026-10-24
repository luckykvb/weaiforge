// Theme registry: id must match the [data-theme] selectors in tokens.css.
// accentRgb drives canvas/spotlight colors that can't read CSS vars directly.
export const themes = [
  { id: 'terracotta', label: 'Terracotta', swatch: '#b5522e', accentRgb: '181, 82, 46' },
  { id: 'slate', label: 'Slate Indigo', swatch: '#3454d1', accentRgb: '52, 84, 209' },
  { id: 'forest', label: 'Forest Emerald', swatch: '#2f7a53', accentRgb: '47, 122, 83' },
  { id: 'amber', label: 'Amber Stone', swatch: '#c8791f', accentRgb: '200, 121, 31' },
]

export const DEFAULT_THEME = 'terracotta'
export const THEME_EVENT = 'themechange'
export const THEME_STORAGE_KEY = 'weaiforge-theme'
export const MODE_STORAGE_KEY = 'weaiforge-mode'
export const MODE_EVENT = 'modechange'

function readPreference(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

function savePreference(key, value) {
  try { localStorage.setItem(key, value) } catch { /* The toggle still works without storage. */ }
}

export function getAccentRgb(themeId) {
  return themes.find((t) => t.id === themeId)?.accentRgb ?? themes[0].accentRgb
}

export function applyTheme(themeId) {
  const id = themes.some((t) => t.id === themeId) ? themeId : DEFAULT_THEME
  if (id === DEFAULT_THEME) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', id)
  }
  savePreference(THEME_STORAGE_KEY, id)
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: id } }))
}

export function getStoredTheme() {
  const id = readPreference(THEME_STORAGE_KEY)
  return themes.some(t => t.id === id) ? id : DEFAULT_THEME
}

export function getStoredMode() {
  return resolveMode(getModePreference())
}

export function getModePreference() {
  const value = readPreference(MODE_STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : 'system'
}

export function resolveMode(preference) {
  if (preference === 'light' || preference === 'dark') return preference
  if (typeof window === 'undefined') return 'light' // build-time prerender
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyMode(value) {
  const preference = value === 'light' || value === 'dark' ? value : 'system'
  const mode = resolveMode(preference)
  document.documentElement.dataset.mode = mode
  document.documentElement.dataset.modePreference = preference
  savePreference(MODE_STORAGE_KEY, preference)
  window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: { mode, preference } }))
}
