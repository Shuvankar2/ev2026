import { useTheme } from '../context/ThemeContext'

export function useChartColors() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return isDark ? {
    bg: '#121212',
    cyan: '#34d399',      // emerald-400
    white: '#f1f5f9',     // slate-100
    orange: '#fb923c',    // orange-400
    lime: '#a3e635',      // lime-400
    accent: '#f87171',    // red-400
    grid: 'rgba(255,255,255,0.1)',
    tick: 'rgba(255,255,255,0.6)',
  } : {
    bg: '#f8fafc',        // slate-50
    cyan: '#059669',      // emerald-600
    white: '#64748b',     // slate-500
    orange: '#ea580c',    // orange-600
    lime: '#65a30d',      // lime-600
    accent: '#dc2626',    // red-600
    grid: 'rgba(0,0,0,0.1)',
    tick: 'rgba(0,0,0,0.6)',
  }
}
