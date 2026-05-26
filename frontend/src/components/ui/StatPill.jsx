export default function StatPill({ label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5 p-4 transition-colors duration-300">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-white/40">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-800 dark:text-white/80">{value}</div>
      <div className="mt-3 h-1 w-20 rounded-full" style={{ background: tone }} />
    </div>
  )
}
