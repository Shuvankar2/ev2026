// Breakdown table variants for MetricModal — renders different column layouts based on metric type
export default function MetricBreakdownTable({ metric }) {
  if (metric.isProfiles) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="py-2.5 px-4 text-left text-xs font-bold uppercase tracking-wider text-white/40">Profile</th>
            {metric.colHeaders.map(h => (
              <th key={h} className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-white/40">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metric.breakdown.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4">
                <div className="text-xs font-bold text-white/80">{row.scenario}</div>
                <div className="text-xs text-white/35">{row.params}</div>
              </td>
              <td className="py-3 px-4 text-right text-xs font-bold tabular-nums" style={{ color: metric.accentColor }}>{row.regen}</td>
              <td className="py-3 px-4 text-right text-xs font-mono text-white/60">{row.eff}</td>
              <td className="py-3 px-4 text-right text-xs font-mono text-white/60">{row.pinch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (metric.isTime) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="py-2.5 px-4 text-left text-xs font-bold uppercase tracking-wider text-white/40">Parameter</th>
            <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-white/40">Value</th>
          </tr>
        </thead>
        <tbody>
          {metric.breakdown.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4">
                <div className="text-xs font-bold text-white/80">{row.scenario}</div>
                <div className="text-xs text-white/35">{row.params}</div>
              </td>
              <td className="py-3 px-4 text-right text-xs font-bold tabular-nums" style={{ color: metric.accentColor }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (metric.isPercent) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="py-2.5 px-4 text-left text-xs font-bold uppercase tracking-wider text-white/40">Scenario</th>
            <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-rose-400/60">STD kWh</th>
            <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-emerald-400/60">MPC kWh</th>
            <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-white/40">Saved</th>
          </tr>
        </thead>
        <tbody>
          {metric.breakdown.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4">
                <div className="text-xs font-bold text-white/80">{row.scenario}</div>
                <div className="text-xs text-white/35">{row.params}</div>
              </td>
              <td className="py-3 px-4 text-right text-xs font-mono tabular-nums text-rose-400">{row.stdKwh}</td>
              <td className="py-3 px-4 text-right text-xs font-mono tabular-nums text-emerald-400">{row.mpcKwh}</td>
              <td className="py-3 px-4 text-right text-xs font-bold tabular-nums text-white/80">{row.saved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  // Default: friction events
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10 bg-white/5">
          <th className="py-2.5 px-4 text-left text-xs font-bold uppercase tracking-wider text-white/40">Scenario</th>
          <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-rose-400/60">STD</th>
          <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-emerald-400/60">MPC</th>
          <th className="py-2.5 px-4 text-right text-xs font-bold uppercase tracking-wider text-white/40">Avoided</th>
        </tr>
      </thead>
      <tbody>
        {metric.breakdown.map((row, i) => (
          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            <td className="py-3 px-4">
              <div className="text-xs font-bold text-white/80">{row.scenario}</div>
              <div className="text-xs text-white/35">{row.params}</div>
            </td>
            <td className="py-3 px-4 text-right text-xs font-mono tabular-nums text-rose-400">{row.std}</td>
            <td className="py-3 px-4 text-right text-xs font-mono tabular-nums text-emerald-400">{row.mpc}</td>
            <td className="py-3 px-4 text-right text-xs font-bold tabular-nums" style={{ color: metric.accentColor }}>{row.avoided}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
