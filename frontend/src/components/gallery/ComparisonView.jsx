import { useState, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import useChartStyles from '../../hooks/useChartStyles'
import LiquidPillSelector from '../ui/LiquidPillSelector'
import { CHART_TABS, CMP_COLORS } from './scenarioConfigs'

const CHART_CFG = {
  gap: { keys: ['gap_mpc', 'gap_std'], unit: 'm', domain: [0, (dataMax) => Math.max(90, dataMax + 5)] },
  speed: { keys: ['v_ego_mpc', 'v_ego_std'], unit: 'm/s', domain: ['auto', 'auto'] },
  soc: { keys: ['soc_mpc', 'soc_std'], unit: '', domain: ['auto', 'auto'] },
  current: { keys: ['current_mpc', 'current_std'], unit: 'A', domain: ['auto', 'auto'] },
}

const TITLES = { gap: 'Gap Distance', speed: 'Vehicle Speed', soc: 'Battery SOC', current: 'Battery Current' }

export default function ComparisonView({ scenarios }) {
  const [tab, setTab] = useState('gap')
  const cs = useChartStyles()

  const mergedData = useMemo(() => {
    const base = scenarios[0]?.history ?? []
    return base.map((tick, i) => {
      const point = { t: tick.t }
      scenarios.forEach(sc => {
        const t = sc.history[i]; if (!t) return
        CHART_CFG[tab]?.keys.forEach(k => { point[`${sc.id}__${k}`] = t[k] })
      })
      return point
    })
  }, [scenarios, tab])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">All 4 Scenarios</div>
          <div className="mt-0.5 text-base font-bold text-slate-800 dark:text-white">
            {TITLES[tab]} — MPC vs STD
          </div>
        </div>
        <LiquidPillSelector items={CHART_TABS} activeKey={tab} onChange={setTab} size="sm" filterId="liquid-cmp-tabs" />
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={cs.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="t" stroke={cs.axis} tick={{ fill: cs.tick, fontSize: 10, fontFamily: 'monospace' }} />

            <YAxis domain={CHART_CFG[tab]?.domain} stroke={cs.axis} tick={{ fill: cs.tick, fontSize: 10, fontFamily: 'monospace' }} unit={CHART_CFG[tab]?.unit} />

            <Tooltip {...cs.tooltip} />
            {tab === 'gap' && <ReferenceLine y={30} stroke={cs.refLine} strokeDasharray="4 2" />}
            {tab === 'current' && <ReferenceLine y={0} stroke={cs.refLine} />}
            {scenarios.map(sc =>
              CHART_CFG[tab]?.keys.map(k => (
                <Line key={`${sc.id}__${k}`} type="monotone" dataKey={`${sc.id}__${k}`}
                  stroke={CMP_COLORS[sc.id]?.[k.includes('mpc') ? 'mpc' : 'std']}
                  strokeWidth={k.includes('mpc') ? 1.5 : 1}
                  strokeDasharray={k.includes('std') ? '3 2' : undefined}
                  dot={false} isAnimationActive={false}
                  name={`${sc.title.split(' ').slice(0, 2).join(' ')} ${k.includes('mpc') ? 'MPC' : 'STD'}`}
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {scenarios.map(sc => (
          <div key={sc.id} className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-2 w-4 rounded-full" style={{ background: CMP_COLORS[sc.id]?.mpc }} />
            {sc.tag}
          </div>
        ))}
      </div>
    </div>
  )
}