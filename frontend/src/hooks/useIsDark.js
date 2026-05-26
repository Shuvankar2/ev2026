// hooks/useIsDark.js
// Reactive dark-mode detection hook — shared across AnimatedEVScene and any component needing JS-level theme awareness
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function useIsDark() {
  const { theme } = useTheme()
  const [sys, setSys] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSys(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return theme === 'dark' || (theme === 'system' && sys)
}
