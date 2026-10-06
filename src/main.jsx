import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import './index.css'
import App from './App.jsx'
import { PrefsProvider } from './prefs.jsx'
import { setupPwa } from './pwa.js'

setupPwa() // faqat telefonda ishlaydi

// Rasmni sudrash va o'ng tugma menyusini ("Rasmni saqlash") o'chirish
for (const type of ['dragstart', 'contextmenu']) {
  document.addEventListener(type, (e) => { if (e.target instanceof HTMLImageElement) e.preventDefault() })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)

// Yuklash ekrani: ilova chizilgach yopiladi
requestAnimationFrame(() => window.__bootMounted?.())
