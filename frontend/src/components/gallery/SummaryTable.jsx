// Tabular summary of all scenario results
export default function SummaryTable({ scenarios }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
            {['Scenario', 'SOC / Speed', 'Battery', 'Friction Avoided', 'SOC Saved', 'Energy Saved'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarios.map(sc => (
            <tr key={sc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors dark:border-slate-800/50 dark:hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="font-bold text-slate-800 dark:text-white">{sc.title}</div>
                <span className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${sc.tagColor}`}>{sc.tag}</span>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{Math.round(sc.params.soc_initial * 100)}% · {sc.params.cruise_speed_kmh} km/h</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{sc.params.battery_condition}</td>
              <td className="px-4 py-3 text-emerald-600 font-bold tabular-nums dark:text-emerald-400">{sc.metrics.frictionAvoided}</td>
              <td className="px-4 py-3 text-emerald-600 font-bold tabular-nums dark:text-emerald-400">{sc.metrics.socSavedPct}%</td>
              <td className="px-4 py-3 text-emerald-600 font-bold tabular-nums dark:text-emerald-400">{sc.metrics.energySavedKwh} kWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
