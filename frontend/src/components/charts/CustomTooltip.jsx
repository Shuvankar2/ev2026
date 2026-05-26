export default function CustomTooltip({ active, payload, label, unit = '' }) {
  if (active && payload && payload.length) {
    const stdData = payload.find(p => p.name === 'STD')
    const mpcData = payload.find(p => p.name === 'MPC')
    
    const stdVal = stdData ? Number(stdData.value) : 0
    const mpcVal = mpcData ? Number(mpcData.value) : 0
    let diff = (mpcVal - stdVal)
    
    let diffText = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)
    if (Math.abs(diff) < 0.05) diffText = '0.0'

    return (
      <div className="rounded-xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#121212]/90">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">Time: {label}s</p>
        <div className="flex flex-col gap-2.5 relative z-10">
          {payload.map((entry, index) => {
            const val = Number(entry.value).toFixed(1)
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-6 font-mono text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shadow-[0_0_4px_inherit]" style={{ backgroundColor: entry.color, color: entry.color }} />
                  <span className="font-bold text-slate-700 dark:text-white/80">{entry.name}</span>
                </div>
                <span className="font-bold" style={{ color: entry.color }}>
                  {val} <span className="opacity-60">{unit}</span>
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500 dark:text-white/40 uppercase tracking-widest">Δ (MPC - STD)</span>
            <span className={`font-mono ${diff > 0.05 ? 'text-emerald-500 dark:text-emerald-400' : diff < -0.05 ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 dark:text-white/40'}`}>
              {diffText} {unit}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}
