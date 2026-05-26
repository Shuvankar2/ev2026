import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useChartStyles from '../../hooks/useChartStyles'
import { V, Eq } from './HowItWorksShared'

export default function MPCTab() {
  const [wGap, setWGap] = useState(1.0)
  const [wAccel, setWAccel] = useState(0.1)
  const cs = useChartStyles()

  const trajectoryData = Array.from({ length: 20 }, (_, i) => {
    const t = i * 0.5
    const aggressiveness = wGap / (wGap + wAccel * 10)
    const gap = 30 + (10 * Math.exp(-aggressiveness * 1.5 * t) * Math.sin(2 * t))
    return { t: t.toFixed(1), gap: parseFloat(Math.max(10, gap).toFixed(2)) }
  })

  return (
    <div className="space-y-7">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600/70 mb-1 dark:text-emerald-500/70">Sub-system 03</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">Model Predictive Control</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Instead of reacting to the current gap error like a PID, the MPC rolls out a{' '}
          <V>N=10 step</V> prediction horizon each tick. It solves a constrained
          quadratic optimisation, explicitly passing the{' '}
          <V color="rose">regen_cap_A</V> from the battery plant as a hard constraint.
        </p>
      </div>

      <Eq label="Finite Horizon Optimisation Problem" lines={[
        { text: 'min  J = Σₖ [ w_gap·(gapₖ − 30)² + w_accel·(uₖ)² ]', accent: true },
        { text: '', dim: true },
        { text: 'subject to:', dim: true },
        { text: '  |I_battery(uₖ, vₖ)| ≤ regen_cap_A(SOC, cond)', warn: true },
        { text: '  v_min ≤ vₖ ≤ v_max' },
        { text: '  a_min = −3 m/s² ≤ uₖ ≤ 2 m/s² = a_max' },
        { text: '', dim: true },
        { text: 'Solver: gradient descent, lr=0.01, iters=20, N=10, dt=1s', dim: true },
      ]} />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-black/30 transition-colors duration-300">
        <div className="px-5 py-3 border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:border-slate-800 dark:text-slate-600">
          ⚖ Cost Weight Balancer — see how w_gap vs w_accel changes behaviour
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-5 space-y-5 border-r border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400"><V>w_gap</V> — gap tracking weight</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{wGap.toFixed(2)}</span>
              </div>
              <input type="range" min="0.1" max="5" step="0.1" value={wGap} onChange={e => setWGap(+e.target.value)} className="w-full accent-emerald-500 cursor-pointer" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400"><V>w_accel</V> — comfort weight</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{wAccel.toFixed(2)}</span>
              </div>
              <input type="range" min="0.01" max="1" step="0.01" value={wAccel} onChange={e => setWAccel(+e.target.value)} className="w-full accent-amber-500 cursor-pointer" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-400 mb-1 dark:text-slate-600">Aggressiveness ratio</div>
              <div className="text-3xl font-extrabold font-mono text-slate-800 tabular-nums dark:text-white">
                {(wGap / (wGap + wAccel * 10)).toFixed(2)}
              </div>
              <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">
                {wGap / (wGap + wAccel * 10) > 0.5
                  ? 'Gap-dominant: aggressive gap closure, jerky ride'
                  : 'Comfort-dominant: smooth ride, larger gap tolerance'}
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 dark:text-slate-600">Predicted gap trajectory (first 10s)</div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid stroke={cs.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: cs.tick, fontSize: 9 }} unit="s" />
                  <YAxis tick={{ fill: cs.tick, fontSize: 9 }} unit="m" domain={[10, 50]} />
                  <Tooltip {...cs.tooltip} formatter={v => [`${v} m`, 'gap']} />
                  <Line type="monotone" dataKey="gap" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-700">
              High w_gap → faster return to 30m target but more jerk. High w_accel → smooth but longer deviation.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 mb-3 dark:text-slate-600">MPC vs PID — Why PID Fails Here</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Horizon', mpc: 'N = 10 steps (10s ahead)', pid: 'Reactive — t=0 only' },
            { label: 'Battery Awareness', mpc: '✓ regen_cap_A constraint', pid: '✗ None' },
            { label: 'Cost Function', mpc: 'Quadratic J with α weights', pid: 'Implicit — Kp·e only' },
            { label: 'Friction Events', mpc: '0 events across all runs', pid: '68–130 events/run' },
          ].map((row, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-white/5 dark:bg-white/[0.02]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-600">{row.label}</div>
              <div className="text-xs font-bold text-emerald-600 mb-1 dark:text-emerald-400">{row.mpc}</div>
              <div className="text-xs text-rose-500/70 dark:text-rose-400/70">{row.pid}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
