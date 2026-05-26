export default function MetricBar({ metrics }) {
  const frictionAvoided = Number(metrics.frictionEventsAvoided ?? 0)
  const avgStdDist = Number(metrics.avgStdDist ?? 0)
  const avgMpcDist = Number(metrics.avgMpcDist ?? 0)
  const socDiff = Number(metrics.socDiff ?? metrics.socPreservedPct ?? 0)

  const items = [
    {
      label: 'Friction Events Avoided',
      value: `${frictionAvoided}`,
      tone: 'text-emerald-700 dark:text-emerald-400',
      ring: 'border-emerald-300 bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10',
    },
    {
      label: 'Extra Distance Buffered',
      value: `+${(avgMpcDist - avgStdDist).toFixed(1)}m`,
      tone: 'text-slate-800 dark:text-white',
      ring: 'border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5',
    },
    {
      label: 'SOC Preserved',
      value: `+${socDiff.toFixed(2)}%`,
      tone: 'text-teal-700 dark:text-teal-400',
      ring: 'border-teal-300 bg-teal-100 dark:border-teal-400/20 dark:bg-teal-400/10',
    },
  ]

  const badge = frictionAvoided === 0
    ? { label: 'MPC Passive — No Constraint Active', tone: 'border-slate-200 bg-white/50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/55' }
    : { label: 'MPC Active ✓', tone: 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400' }

  return (
    <div className="glass rounded-[1.75rem] p-4 border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/40 font-bold">Summary Stats</div>
        <div className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.tone}`}>{badge.label}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className={`rounded-2xl border p-4 text-center transition-colors duration-300 ${item.ring}`}>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/45 font-bold">{item.label}</div>
            <div className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
