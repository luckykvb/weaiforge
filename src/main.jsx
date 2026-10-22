import React from 'react'
import ReactDOM from 'react-dom/client'
// Load order matters: tokens define variables, global sets base + shared
// component rules (.btn/.card), sections override last so their media queries win.
import './styles/tokens.css'
import './styles/global.css'
import './styles/sections.css'
import './styles/forge.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
