import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/archivo-black/400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/intro.css'
import './styles/game.css'
import './styles/missions.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
