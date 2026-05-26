import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Counter } from './HowItWorksShared'

export default function ResultsTab() {
  const navigate = useNavigate()
  const scenarios = [
    { label: 'Standard Commute', sub: 'SOC 85% · 100km/h · Healthy', frictionStd: 68, frictionMpc: 0, socSaved: '10.9%' },
    { label: 'High SOC Sprint', sub: 'SOC 95% · 100km/h · Healthy', frictionStd: 130, frictionMpc: 0, socSaved: '12.6%' },
    { label: 'Cold Weather Panic', sub: 'SOC 80% · 120km/h · Cold 0°C', frictionStd: 62, frictionMpc: 0, socSaved: '9.1%' },
    { label: 'Degraded Battery', sub: 'SOC 60% · 110km/h · Degraded', frictionStd: 33, frictionMpc: 0, socSaved: '6.9%' },
  ]

  return (
    <div className="space-y-7">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600/70 mb-1 dark:text-emerald-500/70">Sub-system 04</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">Simulation Results</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Four scenarios ran STD and MPC on identical 300-second traffic profiles.
          Every difference in outcome is attributable purely to control policy.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Friction Events Eliminated', value: 293, decimals: 0, suffix: '', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Average SOC Preserved', value: 9.91, decimals: 2, suffix: '%', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Scenarios Tested', value: 4, decimals: 0, suffix: '', color: 'text-slate-800 dark:text-slate-300' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-white/5 dark:bg-white/[0.02] transition-colors duration-300">
            <div className={`text-3xl font-extrabold tabular-nums font-mono ${s.color}`}>
              <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[11px] text-slate-400 leading-tight dark:text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-white/5 transition-colors duration-300">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/[0.03]">
              <th className="px-4 py-3 text-left text-slate-400 font-bold uppercase tracking-widest dark:text-slate-600">Scenario</th>
              <th className="px-4 py-3 text-right text-rose-500/70 font-bold dark:text-rose-400/70">STD Friction</th>
              <th className="px-4 py-3 text-right text-emerald-600/70 font-bold dark:text-emerald-400/70">MPC Friction</th>
              <th className="px-4 py-3 text-right text-emerald-600 font-bold dark:text-emerald-400">SOC Saved</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((sc, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors dark:border-white/[0.03] dark:hover:bg-white/[0.02]">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-800 dark:text-white">{sc.label}</div>
                  <div className="text-slate-400 text-[10px] dark:text-slate-600">{sc.sub}</div>
                </td>
                <td className="px-4 py-3.5 text-right font-bold text-rose-500 dark:text-rose-400">{sc.frictionStd}</td>
                <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{sc.frictionMpc}</td>
                <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-300">{sc.socSaved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/simulator')}
        className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400 active:scale-95 dark:text-slate-950">
        ▶ Run These Scenarios Yourself in the Simulator
      </motion.button>
    </div>
  )
}
