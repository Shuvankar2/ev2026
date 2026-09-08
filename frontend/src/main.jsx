import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

/**
 * GLOBAL PINCH-ZOOM PREVENTION
 * -----------------------------
 * By default, pinch-to-zoom and gesture events are blocked on all pages
 * to prevent accidental zooming on the site.
 *
 * The ONLY exception is when `window.__allowZoom = true`, which is set
 * exclusively by SimulatorPage when it detects a touch device running in
 * Desktop Site mode (touch device + non-phone-mobile UA).
 *
 * This means:
 *  - Normal mobile visitors: zoom blocked ✓
 *  - Desktop visitors: zoom irrelevant (no touch) ✓
 *  - Mobile in Desktop Site mode on /simulator: zoom allowed ✓
 *  - Mobile in Desktop Site mode on other pages: zoom blocked ✓
 */
if (typeof window !== 'undefined') {
  const canZoom = () => window.__allowZoom === true

  document.addEventListener('gesturestart',  (e) => { if (!canZoom()) e.preventDefault() })
  document.addEventListener('gesturechange', (e) => { if (!canZoom()) e.preventDefault() })
  document.addEventListener('gestureend',    (e) => { if (!canZoom()) e.preventDefault() })

  window.addEventListener(
    'touchstart',
    (e) => { if (e.touches.length > 1 && !canZoom()) e.preventDefault() },
    { passive: false }
  )

  window.addEventListener(
    'touchmove',
    (e) => { if (e.touches.length > 1 && !canZoom()) e.preventDefault() },
    { passive: false }
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
