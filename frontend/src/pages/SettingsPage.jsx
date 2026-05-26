import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const options = [
    { id: 'light', label: 'Light Mode', icon: '☀️' },
    { id: 'dark', label: 'Dark Mode', icon: '🌙' },
    { id: 'system', label: 'System Default', icon: '💻' }
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-white/55">
          Customize your dashboard preferences and appearance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6 md:p-8 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10"
      >
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-gray-100 border-b border-slate-200 dark:border-white/10 pb-4">
          Appearance
        </h2>
        
        <div className="space-y-4 max-w-lg">
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Theme Preference</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  theme === option.id
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-400/50 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="text-sm font-bold">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
