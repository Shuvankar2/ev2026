// Full-screen metric modal with formula, breakdown table, and physics note
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricBreakdownTable from './MetricBreakdownTable'

export default function MetricModal({ metric, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 32 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2rem] md:rounded-[1.75rem] border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-4xl font-extrabold tabular-nums leading-none" style={{ color: metric.accentColor }}>
                {metric.value}{metric.suffix}
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/40 max-w-xs">
                {metric.label}
              </p>
            </div>
            <button onClick={onClose} aria-label="Close breakdown"
              className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2.5 text-white/40 transition hover:bg-white/10 hover:text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Plain English */}
          <div className="mb-5 rounded-xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm font-medium leading-relaxed text-white/70">
            {metric.plain}
          </div>

          {/* Formula */}
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Formula</div>
            <code className="block rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap break-words">
              {metric.formula}
            </code>
            <p className="mt-2 text-xs text-white/30 font-mono">
              Engine keys: <span className="text-white/45">{metric.engine_keys}</span>
            </p>
          </div>

          {/* Table */}
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Per-Scenario Breakdown</div>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <MetricBreakdownTable metric={metric} />
            </div>
          </div>

          {/* Note */}
          <div className="rounded-lg border border-white/5 bg-white/3 px-4 py-3 text-xs leading-relaxed text-white/35">
            <span className="font-bold text-white/50">Physics note: </span>{metric.note}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
