import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/nunito'
import '@fontsource-variable/baloo-2'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/archivo-black/400.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/intro.css'
import './styles/game.css'
import './styles/nasa.css'
import './styles/missions.css'
import './styles/minigames.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
