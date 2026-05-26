import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import SimulatorPage from './pages/SimulatorPage'
import HowItWorksPage from './pages/HowItWorksPage'
import ScenarioGalleryPage from './pages/ScenarioGalleryPage'
import SettingsPage from './pages/SettingsPage'
import { ThemeProvider } from './context/ThemeContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/scenarios" element={<ScenarioGalleryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </ThemeProvider>
  )
}

