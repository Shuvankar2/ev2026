import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useChartStyles from '../../hooks/useChartStyles'
import { V, Eq } from './HowItWorksShared'

export default function EKFTab() {
  const [Q, setQ] = useState(0.0001)
  const [R, setR] = useState(0.001)
  const cs = useChartStyles()
  const K = Q / (Q + R)

  const convergenceData = Array.from({ length: 40 }, (_, i) => {
    let P = 0.1
    for (let j = 0; j < i; j++) { P = P + Q; const Kj = P / (P + R); P = (1 - Kj) * P }
    return { step: i, K: parseFloat((P / (P + R)).toFixed(5)) }
  })

  return (
    <div className="space-y-7">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600/70 mb-1 dark:text-emerald-500/70">Sub-system 02</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">EKF State Estimator</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Raw BMS telemetry is corrupted by current sensor noise, quantisation error,
          and temperature drift. The Extended Kalman Filter runs a recursive{' '}
          <V>predict → correct</V> cycle to recover the true{' '}
          <V>SOC</V> trajectory, balancing process model confidence
          against measurement trust via the gain <V>K</V>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Eq label="Prediction Step" lines={[
          { text: 'u  = (I · dt) / (capacity · 3600)', dim: true },
          { text: 'x̂⁻ = x̂ − u', accent: true },
          { text: 'P⁻  = P + Q', accent: true },
        ]} />
        <Eq label="Update (Correction) Step" lines={[
          { text: 'K   = P⁻ / (P⁻ + R)', accent: true },
          { text: 'x̂  = x̂⁻ + K · (y − x̂⁻)' },
          { text: 'P   = (1 − K) · P⁻' },
        ]} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-black/30 transition-colors duration-300">
        <div className="px-5 py-3 border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:border-slate-800 dark:text-slate-600">
          🎚 Kalman Gain Tuner — adjust Q and R to see K and its convergence
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-5 space-y-5 border-r border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400"><V>Q</V> — Process noise</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{Q.toExponential(1)}</span>
              </div>
              <input type="range" min="-5" max="-2" step="0.1" value={Math.log10(Q)}
                onChange={e => setQ(parseFloat((10 ** +e.target.value).toFixed(6)))} className="w-full accent-amber-500 cursor-pointer" />
              <p className="text-[10px] text-slate-400 dark:text-slate-700">High Q → less trust in model → K increases → trusts sensor more</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400"><V>R</V> — Measurement noise</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{R.toExponential(1)}</span>
              </div>
              <input type="range" min="-4" max="-1" step="0.1" value={Math.log10(R)}
                onChange={e => setR(parseFloat((10 ** +e.target.value).toFixed(5)))} className="w-full accent-blue-500 cursor-pointer" />
              <p className="text-[10px] text-slate-400 dark:text-slate-700">High R → distrust sensor → K decreases → trusts model more</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-400 mb-1 dark:text-slate-600">Kalman Gain K = Q/(Q+R)</div>
              <div className="text-4xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{K.toFixed(4)}</div>
              <div className="mt-2 text-xs text-slate-400 dark:text-slate-600">
                {K > 0.05 ? 'Sensor-dominant: filter tracks measurements closely' : 'Model-dominant: filter relies on physics prediction'}
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 dark:text-slate-600">K converging over simulation steps</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convergenceData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid stroke={cs.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="step" tick={{ fill: cs.tick, fontSize: 9 }} />
                  <YAxis tick={{ fill: cs.tick, fontSize: 9 }} domain={[0, 'auto']} />
                  <Tooltip {...cs.tooltip} formatter={v => [v.toFixed(5), 'K']} />
                  <Line type="monotone" dataKey="K" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-700">
              K converges as P stabilises. Steady-state K ≈ {K.toFixed(4)} for Q={Q.toExponential(1)}, R={R.toExponential(1)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
