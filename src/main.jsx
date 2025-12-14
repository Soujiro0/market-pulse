import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoute' // Import AppRoutes
import { GameProvider } from './contexts/GameContext'
import { BrowserRouter } from 'react-router-dom'

const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// Inject Google Analytics Script
if (GOOGLE_ANALYTICS_ID) {
  // Load gtag.js
  const gtagScript = document.createElement("script");
  gtagScript.setAttribute("async", "");
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(gtagScript);

  // Load gtag config
  const configScript = document.createElement("script");
  configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
  `;
  document.head.appendChild(configScript);
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GameProvider>
      <AppRoutes /> {/* Render AppRoutes */}
    </GameProvider>
  </BrowserRouter>
)
