import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

// Check if zooming should be allowed (allowed in desktop mode on mobile and in simulator)
const isZoomPermitted = () => {
  if (typeof window === 'undefined') return false
  if (window.__allowZoom) return true
  if (window.location.pathname.includes('/simulator')) return true
  if (sessionStorage.getItem('ev_desktop_mode_active') === 'true') return true

  const ua = navigator.userAgent || ''
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isExplicitMobile = /Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  
  // If it's a touch device and NOT explicit mobile UA (meaning Desktop Mode is enabled on phone):
  if (isTouch && !isExplicitMobile) return true

  return false
}

// Disable accidental pinch-to-zoom on standard mobile pages, but allow when desktop mode is active
if (typeof window !== 'undefined') {
  document.addEventListener('gesturestart', (e) => {
    if (!isZoomPermitted()) e.preventDefault()
  })
  document.addEventListener('gesturechange', (e) => {
    if (!isZoomPermitted()) e.preventDefault()
  })
  document.addEventListener('gestureend', (e) => {
    if (!isZoomPermitted()) e.preventDefault()
  })

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length > 1 && !isZoomPermitted()) {
        e.preventDefault()
      }
    },
    { passive: false }
  )

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1 && !isZoomPermitted()) {
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
