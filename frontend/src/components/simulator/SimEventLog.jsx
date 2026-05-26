import { motion, AnimatePresence } from 'framer-motion'

export default function SimEventLog({ events }) {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-700">
        Telemetry
      </div>
      <div className="h-[72px] overflow-hidden px-4 pb-3">
        {events.length === 0 ? (
          <p className="text-xs text-slate-300 dark:text-slate-800">Awaiting events...</p>
        ) : (
          <AnimatePresence initial={false}>
            {events.slice(0, 5).map(evt => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mb-0.5 font-mono text-xs text-rose-500/70 dark:text-rose-400/70"
              >
                <span className="text-slate-400 dark:text-slate-700">[{evt.t}s] </span>
                {evt.msg}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
