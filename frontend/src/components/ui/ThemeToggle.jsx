// Theme toggle component with liquid gooey animation (sun/system/moon)
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const SunIcon = () => (
   <svg className="w-[18px] h-[18px] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
     <circle cx="12" cy="12" r="5" />
     <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
   </svg>
)

const MoonIcon = () => (
   <svg className="w-[18px] h-[18px] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
   </svg>
)

const SystemIcon = () => (
   <svg className="w-[18px] h-[18px] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
     <rect x="3" y="4" width="18" height="12" rx="2" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8m-4-4v4" />
   </svg>
)

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  const options = [
    { id: 'light', icon: <SunIcon /> },
    { id: 'system', icon: <SystemIcon /> },
    { id: 'dark', icon: <MoonIcon /> }
  ]

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center p-1.5 rounded-full bg-slate-200/70 dark:bg-[#111614] shadow-inner dark:shadow-none border border-transparent dark:border-white/5 shrink-0"
    >
      <div className="absolute inset-0 pointer-events-none p-1.5" style={{ filter: 'url(#liquid-filter)' }}>
        <div className="flex h-full items-center gap-1">
          <AnimatePresence initial={false}>
            {options.map(opt => {
              const isSelected = theme === opt.id
              if (!isHovered && !isSelected) return null
              return (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, width: 0, scale: 0.5 }}
                  animate={{ opacity: 1, width: 34, scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.5 }}
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                  className="relative flex items-center justify-center h-[34px] shrink-0"
                >
                  <div className="text-transparent">{opt.icon}</div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                        className="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex h-full items-center gap-1">
        <AnimatePresence initial={false}>
          {options.map(opt => {
            const isSelected = theme === opt.id
            if (!isHovered && !isSelected) return null
            return (
               <motion.button
                 key={opt.id}
                 initial={{ opacity: 0, width: 0, scale: 0.5 }}
                 animate={{ opacity: 1, width: 34, scale: 1 }}
                 exit={{ opacity: 0, width: 0, scale: 0.5 }}
                 transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                 onClick={() => setTheme(opt.id)}
                 className={`relative flex items-center justify-center h-[34px] shrink-0 rounded-full transition-colors duration-300 focus:outline-none ${
                   isSelected ? 'text-white dark:text-emerald-950' : 'text-slate-500 hover:text-emerald-700 dark:text-white/50 dark:hover:text-white'
                 }`}
               >
                 {opt.icon}
               </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
