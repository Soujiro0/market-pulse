import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoute' // Import AppRoutes
import { GameProvider } from './contexts/GameContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>
      <AppRoutes /> {/* Render AppRoutes */}
    </GameProvider>
  </StrictMode>,
)
