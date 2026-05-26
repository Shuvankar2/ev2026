function KPI({ label, value, sub, accent }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-xs text-slate-400 dark:text-slate-600">{label}</div>
      <div className={`text-sm font-bold tabular-nums leading-none ${accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white/80'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-700">{sub}</div>}
    </div>
  )
}

export default function SimKPIStrip({ state, frictionAvoided }) {
  if (!state) return null

  const socSavedPct = state.energy_std_kwh > 0.0001
    ? ((state.energy_std_kwh - state.energy_mpc_kwh) / state.energy_std_kwh * 100).toFixed(2)
    : '0.00'

  return (
    <div className="grid grid-cols-2 gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 transition-colors duration-300">
      <KPI label="Friction Avoided" value={frictionAvoided} sub="events this run" accent={true} />
      <KPI label="SOC Saved" value={`${socSavedPct}%`} sub="net energy" accent={false} />
      <KPI label="MPC SOC" value={`${(state.soc_mpc * 100).toFixed(1)}%`} accent={false} />
      <KPI label="Regen Cap" value={`${state.regen_cap_A?.toFixed(0) ?? '—'} A`} accent={false} />
    </div>
  )
}
