// Shared UI primitives for the How It Works page
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

// Styled variable pill for inline code/variable references
export function V({ children, color = 'emerald' }) {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10',
    rose:    'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10',
    amber:   'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10',
    blue:    'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10',
    slate:   'text-slate-600 bg-slate-200 dark:text-slate-300 dark:bg-slate-700/40',
  }
  return (
    <span className={`font-mono text-[0.8em] px-1.5 py-0.5 rounded transition-colors duration-300 ${colors[color]}`}>
      {children}
    </span>
  )
}

// Equation block with label header and styled lines
export function Eq({ label, lines }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-800 dark:bg-slate-950 transition-colors duration-300">
      {label && (
        <div className="px-4 py-2 border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:border-slate-800 dark:text-slate-600">
          {label}
        </div>
      )}
      <div className="px-5 py-4 space-y-2 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i} className={
            line.dim ? 'text-slate-400 dark:text-slate-600' :
            line.accent ? 'text-emerald-700 dark:text-emerald-300' :
            line.warn ? 'text-rose-500 dark:text-rose-400' :
            'text-slate-700 dark:text-slate-300'
          }>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}

// Animated counter that counts up when scrolled into view
export function Counter({ to, decimals = 0, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const steps = 40
    let i = 0
    const id = setInterval(() => {
      i++
      setVal(parseFloat((to * (i / steps)).toFixed(decimals)))
      if (i >= steps) { setVal(to); clearInterval(id) }
    }, 30)
    return () => clearInterval(id)
  }, [inView, to, decimals])
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}
