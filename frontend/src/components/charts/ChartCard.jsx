export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass flex flex-col rounded-[1.75rem] px-5 pt-5 pb-8 border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5 transition-colors duration-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white transition-colors duration-300">{title}</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-white/40 transition-colors duration-300">{subtitle}</p>
        </div>
        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse transition-colors duration-300" />
      </div>
      <div className="mt-4 h-[300px] w-full relative">{children}</div>
    </div>
  )
}
