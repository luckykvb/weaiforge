import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/sections.css'
import AiAgents from './pages/AiAgents.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AiAgents />
  </React.StrictMode>,
)
