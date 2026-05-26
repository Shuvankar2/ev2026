import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useChartStyles from '../../hooks/useChartStyles'
import { V, Eq } from './HowItWorksShared'

export default function PlantTab() {
  const [soc, setSoc] = useState(85)
  const [temp, setTemp] = useState(25)
  const cs = useChartStyles()

  const maxKw = temp < 0 ? 30 : temp < 10 ? 44 : temp < 20 ? 56 : 74
  const socTaper = soc > 80 ? Math.max(0, 1 - (soc - 80) / 15) : 1
  const ocv = (3.2 + 0.8 * (soc / 100)) * 96
  const Rint = temp < 0 ? 0.22 : temp < 10 ? 0.18 : temp < 20 ? 0.12 : 0.08
  const regenCapA = ((maxKw * socTaper * 1000) / ocv)
  const danger = regenCapA < 30

  const chartData = Array.from({ length: 21 }, (_, i) => {
    const s = i * 5
    const t = s > 80 ? Math.max(0, 1 - (s - 80) / 15) : 1
    const o = (3.2 + 0.8 * (s / 100)) * 96
    return { soc: s, cap: parseFloat(((maxKw * t * 1000) / o).toFixed(1)) }
  })

  return (
    <div className="space-y-7">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600/70 mb-1 dark:text-emerald-500/70">Sub-system 01</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">Battery Plant Model</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Standard controllers assume infinite regenerative braking capacity.
          This engine models realistic electrochemical limits: as{' '}
          <V>SOC</V> approaches 100%, or <V color="blue">temperature</V>{' '}
          drops, charge acceptance falls to zero — forcing friction brakes.
        </p>
      </div>

      <Eq label="Terminal Voltage Model" lines={[
        { text: 'OCV(soc)       = (3.2 + 0.8·soc) × 96 cells', accent: true },
        { text: 'V_terminal     = OCV − I · R_internal' },
        { text: 'regen_cap_A    = (P_regen_kW × 1000) / V_term' },
        { text: '' , dim: true },
        { text: 'R_int: Healthy=0.08Ω  Degraded=0.12Ω  Cold=0.18Ω', dim: true },
      ]} />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-black/30 transition-colors duration-300">
        <div className="px-5 py-3 border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:border-slate-800 dark:text-slate-600">
          ⚡ Constraint Sandbox — drag to explore
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-5 space-y-5 border-r border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">State of Charge (SOC)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{soc}%</span>
              </div>
              <input type="range" min="0" max="100" value={soc} onChange={e => setSoc(+e.target.value)} className="w-full accent-emerald-500 cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-700"><span>0%</span><span>50%</span><span>100%</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Ambient Temperature</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{temp}°C</span>
              </div>
              <input type="range" min="-10" max="40" value={temp} onChange={e => setTemp(+e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-700"><span>-10°C</span><span>15°C</span><span>40°C</span></div>
            </div>
            <div className="pt-2 border-t border-slate-200 space-y-1.5 font-mono text-xs text-slate-500 dark:border-slate-800">
              <div className="flex justify-between"><span>OCV</span><span className="text-slate-700 dark:text-slate-300">{ocv.toFixed(1)} V</span></div>
              <div className="flex justify-between"><span>R_internal</span><span className="text-slate-700 dark:text-slate-300">{Rint} Ω</span></div>
              <div className="flex justify-between"><span>P_regen (cap)</span><span className="text-slate-700 dark:text-slate-300">{maxKw} kW</span></div>
            </div>
          </div>
          <div className="p-5 flex flex-col items-center justify-center gap-3">
            <div className="text-xs text-slate-400 uppercase tracking-widest dark:text-slate-600">Active regen limit</div>
            <motion.div key={Math.round(regenCapA)} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
              className={`text-5xl font-extrabold font-mono tabular-nums transition-colors ${danger ? 'text-rose-500 dark:text-rose-400' : regenCapA < 80 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {regenCapA.toFixed(1)} A
            </motion.div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden dark:bg-slate-800">
              <motion.div className={`h-full rounded-full ${danger ? 'bg-rose-500' : 'bg-emerald-500'}`}
                animate={{ width: `${Math.min(100, (regenCapA / 200) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-700">0A ─────────── 200A</div>
            {danger && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-rose-600 bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20">
                ⚠ Friction brakes required at this operating point
              </motion.div>
            )}
          </div>
        </div>
        <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 dark:text-slate-600">
            Regen cap vs SOC at current temperature ({temp}°C)
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                <CartesianGrid stroke={cs.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="soc" tick={{ fill: cs.tick, fontSize: 9 }} unit="%" />
                <YAxis tick={{ fill: cs.tick, fontSize: 9 }} unit="A" />
                <Tooltip {...cs.tooltip} formatter={v => [`${v} A`, 'Regen cap']} labelFormatter={v => `SOC ${v}%`} />
                <Line type="monotone" dataKey="cap" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
