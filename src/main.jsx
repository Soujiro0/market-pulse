import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoute' // Import AppRoutes
import { GameProvider } from './contexts/GameContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='market-pulse'>
    <GameProvider>
      <AppRoutes /> {/* Render AppRoutes */}
    </GameProvider>
  </BrowserRouter>
)
