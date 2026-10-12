import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/sections.css'
import Legal from './pages/Legal.jsx'

const page = document.documentElement.dataset.page

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Legal page={page} />
  </React.StrictMode>,
)
