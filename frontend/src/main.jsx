import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

// Disable pinch-to-zoom gestures globally
if (typeof window !== 'undefined') {
  document.addEventListener('gesturestart', (e) => e.preventDefault())
  document.addEventListener('gesturechange', (e) => e.preventDefault())
  document.addEventListener('gestureend', (e) => e.preventDefault())

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    },
    { passive: false }
  )

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    },
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
