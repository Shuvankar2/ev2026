// hooks/useChartStyles.js
// Theme-aware Recharts configuration — shared across HowItWorks, ScenarioGallery, SimChartPanel
import { useTheme } from '../context/ThemeContext'

export default function useChartStyles() {
  const { theme } = useTheme()
  const sys = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && sys)
  return {
    isDark,
    grid: isDark ? '#1e293b' : '#e2e8f0',
    tick: isDark ? '#475569' : '#64748b',
    axis: isDark ? '#1e293b' : '#e2e8f0',
    refLine: isDark ? '#334155' : '#cbd5e1',
    tooltip: {
      contentStyle: {
        background: isDark ? '#0f172a' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
        color: isDark ? '#e2e8f0' : '#334155',
      },
      itemStyle: { fontWeight: 700 },
      labelStyle: { color: isDark ? '#94a3b8' : '#64748b', marginBottom: 4 },
    },
  }
}
