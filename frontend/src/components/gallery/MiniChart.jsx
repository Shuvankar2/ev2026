import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import useChartStyles from '../../hooks/useChartStyles'

const CHART_CONFIG = {
  gap: { mpc: 'gap_mpc', std: 'gap_std', unit: 'm', domain: [0, (dataMax) => Math.max(90, dataMax + 5)] },
  speed: { mpc: 'v_ego_mpc', std: 'v_ego_std', unit: 'm/s', domain: ['dataMin-2', 'dataMax+2'] },
  soc: { mpc: 'soc_mpc', std: 'soc_std', unit: '', domain: ['dataMin', 'dataMax'] },
  current: { mpc: 'current_mpc', std: 'current_std', unit: 'A', domain: ['auto', 'auto'] },
}

export default function MiniChart({ history, chartType, expanded, accentColor }) {
  const cs = useChartStyles()
  const c = CHART_CONFIG[chartType]
  const h = expanded ? 240 : 140

  return (
    <div style={{ height: h, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 4, right: 8, left: expanded ? -10 : -28, bottom: 0 }}>
          <CartesianGrid stroke={cs.grid} strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="t" stroke={cs.axis} tick={{ fill: cs.tick, fontSize: 10, fontFamily: 'monospace' }} hide={!expanded} />
          <YAxis domain={c.domain} stroke={cs.axis} tick={{ fill: cs.tick, fontSize: 10, fontFamily: 'monospace' }} unit={c.unit} hide={!expanded} />

          {expanded && <Tooltip {...cs.tooltip} />}

          {chartType === 'gap' && <ReferenceLine y={30} stroke={cs.refLine} strokeDasharray="4 2" />}
          {chartType === 'current' && <ReferenceLine y={0} stroke={cs.refLine} strokeWidth={1} />}

          <Line type="monotone" dataKey={c.std} stroke="#f43f5e" strokeWidth={expanded ? 1.5 : 1} dot={false} isAnimationActive={false} name="STD" />
          <Line type="monotone" dataKey={c.mpc} stroke={accentColor} strokeWidth={expanded ? 2 : 1.5} dot={false} isAnimationActive={false} name="MPC" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}