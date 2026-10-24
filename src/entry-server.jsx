import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import Legal from './pages/Legal.jsx'

// Build-time only (scripts/prerender.mjs). App reads location.pathname to pick
// the page variant, so the caller sets it before rendering.
export const renderApp = () => renderToString(<App />)
export const renderLegal = (page) => renderToString(<Legal page={page} />)
