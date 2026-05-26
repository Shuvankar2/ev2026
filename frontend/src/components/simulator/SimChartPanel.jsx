import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LiquidPillSelector from '../ui/LiquidPillSelector'
import { useTheme } from '../../context/ThemeContext'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts'

const C = {
  lead:  '#64748b',
  mpc:   '#10b981',
  std:   '#f43f5e',
  ekf:   '#34d399',
  ref:   '#f59e0b',
}

function useChartTheme() {
  const { theme } = useTheme()
  const sys = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && sys)

  return {
    GRID:   { stroke: isDark ? '#1e293b' : '#e2e8f0', strokeDasharray: '3 3' },
    AXIS:   { stroke: isDark ? '#1e293b' : '#e2e8f0', tick: { fill: isDark ? '#475569' : '#64748b', fontSize: 10, fontFamily: 'monospace' } },
    TTIP:   {
      contentStyle: {
        background: isDark ? '#0f172a' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderRadius: 6, fontSize: 11, fontFamily: 'monospace',
        color: isDark ? '#e2e8f0' : '#334155',
      },
      itemStyle: { fontWeight: 700 },
      labelStyle: { color: isDark ? '#475569' : '#94a3b8', marginBottom: 4 },
    },
    LEGEND: { wrapperStyle: { paddingTop: 8, fontSize: 10, fontFamily: 'monospace', color: isDark ? '#94a3b8' : '#475569' } },
    refLine: isDark ? '#334155' : '#cbd5e1',
  }
}

// Downsample array to maxPts by picking evenly spaced indices (always keep last point)
function downsample(arr, maxPts) {
  if (!arr || arr.length <= maxPts) return arr
  const step = (arr.length - 1) / (maxPts - 1)
  const out = []
  for (let i = 0; i < maxPts - 1; i++) {
    out.push(arr[Math.round(i * step)])
  }
  out.push(arr[arr.length - 1])
  return out
}

function ghostLines(ghostData, keys) {
  if (!ghostData || ghostData.length < 5) return null
  return keys.map(({ key, color }) => (
    <Line
      key={`ghost-${key}`}
      data={ghostData}
      type="monotone"
      dataKey={key}
      stroke={color}
      strokeWidth={1}
      strokeDasharray="2 5"
      strokeOpacity={0.18}
      dot={false}
      isAnimationActive={false}
      legendType="none"
      name={undefined}
    />
  ))
}

// Format time nicely for X axis
function formatTime(t) {
  if (t < 600) return `${Math.round(t)}s`
  const m = Math.floor(t / 60)
  const s = Math.round(t % 60)
  if (m < 60) return s > 0 ? `${m}m${s}s` : `${m}m`
  const h = Math.floor(m / 60)
  const rm = m % 60
  return rm > 0 ? `${h}h${rm}m` : `${h}h`
}

const CHART_MARGIN = { top: 8, right: 16, left: 8, bottom: 0 }

function SpeedChart({ data, ghost, ct }) {
  const mappedData = useMemo(() =>
    data.map(d => ({ ...d, v_lead: d.v_lead * 3.6, v_ego_mpc: d.v_ego_mpc * 3.6, v_ego_std: d.v_ego_std * 3.6 })),
    [data]
  )
  const mappedGhost = useMemo(() =>
    ghost && ghost.length > 0 ? ghost.map(d => ({ ...d, v_lead: d.v_lead * 3.6, v_ego_mpc: d.v_ego_mpc * 3.6, v_ego_std: d.v_ego_std * 3.6 })) : [],
    [ghost]
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mappedData} margin={CHART_MARGIN}>
        <CartesianGrid {...ct.GRID} vertical={false} />
        <XAxis dataKey="t" {...ct.AXIS} type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} />
        <YAxis {...ct.AXIS} unit=" km/h" width={60} />
        <Tooltip {...ct.TTIP} labelFormatter={v => `t = ${formatTime(v)}`} formatter={(v) => `${v.toFixed(1)} km/h`} />
        <Legend {...ct.LEGEND} />
        {ghostLines(mappedGhost, [{ key: 'v_lead', color: C.lead }, { key: 'v_ego_mpc', color: C.mpc }, { key: 'v_ego_std', color: C.std }])}
        <Line type="monotone" dataKey="v_lead"    stroke={C.lead} strokeWidth={1.5} dot={false} isAnimationActive={false} name="Lead" />
        <Line type="monotone" dataKey="v_ego_mpc" stroke={C.mpc}  strokeWidth={2}   dot={false} isAnimationActive={false} name="MPC" />
        <Line type="monotone" dataKey="v_ego_std" stroke={C.std}  strokeWidth={1.5} dot={false} isAnimationActive={false} name="STD" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function SOCChart({ data, ghost, ct }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...ct.GRID} vertical={false} />
        <XAxis dataKey="t" {...ct.AXIS} type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} />
        <YAxis {...ct.AXIS} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} width={50} />
        <Tooltip {...ct.TTIP} labelFormatter={v => `t = ${formatTime(v)}`} formatter={(v) => `${(v * 100).toFixed(2)}%`} />
        <Legend {...ct.LEGEND} />
        {ghostLines(ghost, [{ key: 'soc_mpc', color: C.mpc }, { key: 'soc_std', color: C.std }])}
        <Line type="monotone" dataKey="soc_mpc"     stroke={C.mpc} strokeWidth={2}   dot={false} isAnimationActive={false} name="MPC SOC" />
        <Line type="monotone" dataKey="soc_ekf_mpc" stroke={C.ekf} strokeWidth={1}   dot={false} isAnimationActive={false} name="MPC EKF" strokeDasharray="4 2" />
        <Line type="monotone" dataKey="soc_std"     stroke={C.std} strokeWidth={1.5} dot={false} isAnimationActive={false} name="STD SOC" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function GapChart({ data, ghost, ct }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...ct.GRID} vertical={false} />
        <XAxis dataKey="t" {...ct.AXIS} type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} />
        <YAxis {...ct.AXIS} unit=" m" width={50} />
        <Tooltip {...ct.TTIP} labelFormatter={v => `t = ${formatTime(v)}`} formatter={(v) => `${v.toFixed(1)} m`} />
        <Legend {...ct.LEGEND} />
        <ReferenceLine y={30} stroke={C.ref} strokeDasharray="4 2" strokeOpacity={0.5}
          label={{ value: '30m', fill: C.ref, fontSize: 9, fontFamily: 'monospace' }} />
        {ghostLines(ghost, [{ key: 'gap_mpc', color: C.mpc }, { key: 'gap_std', color: C.std }])}
        <Line type="monotone" dataKey="gap_mpc" stroke={C.mpc} strokeWidth={2}   dot={false} isAnimationActive={false} name="MPC Gap" />
        <Line type="monotone" dataKey="gap_std" stroke={C.std} strokeWidth={1.5} dot={false} isAnimationActive={false} name="STD Gap" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function CurrentChart({ data, ghost, ct }) {
  const cap = data.at(-1)?.regen_cap_A ?? 0
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...ct.GRID} vertical={false} />
        <XAxis dataKey="t" {...ct.AXIS} type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} />
        <YAxis {...ct.AXIS} unit=" A" width={60} />
        <Tooltip {...ct.TTIP} labelFormatter={v => `t = ${formatTime(v)}`} formatter={(v) => `${v.toFixed(1)} A`} />
        <Legend {...ct.LEGEND} />
        <ReferenceLine y={0}    stroke={ct.refLine} strokeWidth={1} />
        {cap > 0 && (
          <ReferenceLine y={-cap} stroke={C.ref} strokeDasharray="3 2" strokeOpacity={0.5}
            label={{ value: `cap ${cap.toFixed(0)}A`, fill: C.ref, fontSize: 9, fontFamily: 'monospace' }} />
        )}
        {ghostLines(ghost, [{ key: 'current_mpc', color: C.mpc }])}
        <Line type="monotone" dataKey="current_mpc" stroke={C.mpc} strokeWidth={2}   dot={false} isAnimationActive={false} name="MPC I" />
        <Line type="monotone" dataKey="current_std" stroke={C.std} strokeWidth={1.5} dot={false} isAnimationActive={false} name="STD I" />
      </LineChart>
    </ResponsiveContainer>
  )
}

const TABS = [
  { id: 'speed',   label: 'Speed'   },
  { id: 'soc',     label: 'SOC'     },
  { id: 'gap',     label: 'Gap'     },
  { id: 'current', label: 'Current' },
]

// Max points to render at once (keeps Recharts performant)
const MAX_CHART_PTS = 300

function renderChart(tab, data, ghost, ct) {
  if (!data || data.length < 2) return null
  switch (tab) {
    case 'speed':   return <SpeedChart   data={data} ghost={ghost} ct={ct} />
    case 'soc':     return <SOCChart     data={data} ghost={ghost} ct={ct} />
    case 'gap':     return <GapChart     data={data} ghost={ghost} ct={ct} />
    case 'current': return <CurrentChart data={data} ghost={ghost} ct={ct} />
    default:        return null
  }
}

export default function SimChartPanel({ history, ghostHistory, maxTime }) {
  const [tab, setTab] = useState('speed')
  const [isExpanded, setIsExpanded] = useState(false)
  const ct = useChartTheme()
  const timeLimit = maxTime ?? 300

  // Sliding window = 10% of total duration, min 30
  const winSize = Math.max(30, Math.floor(timeLimit * 0.1))

  // Inline chart data: last `winSize` points, downsampled to MAX_CHART_PTS
  const inlineData = useMemo(() =>
    downsample(history.slice(-winSize), MAX_CHART_PTS),
    [history, winSize]
  )
  const inlineGhost = useMemo(() =>
    downsample((ghostHistory || []).slice(-winSize), MAX_CHART_PTS),
    [ghostHistory, winSize]
  )

  // Expanded chart data: full history, downsampled
  const expandedData = useMemo(() =>
    downsample(history, MAX_CHART_PTS),
    [history]
  )
  const expandedGhost = useMemo(() =>
    downsample(ghostHistory || [], MAX_CHART_PTS),
    [ghostHistory]
  )

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Tab bar */}
        <div className="mb-2 flex items-center gap-3 border-b border-slate-200 pb-2 transition-colors duration-300 dark:border-slate-800">
          <LiquidPillSelector
            items={TABS.map(t => ({ key: t.id, label: t.label }))}
            activeKey={tab}
            onChange={(k) => setTab(k)}
            size="md"
            filterId="liquid-chart-tabs"
          />
          <div className="ml-auto flex items-center gap-3">
            <div className="font-mono text-[10px] text-slate-400 dark:text-slate-700">
              {history.length} pts · {winSize}s window
              {ghostHistory && ghostHistory.length > 5 && ' · ghost on'}
            </div>
            <button onClick={() => setIsExpanded(true)} className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400" title="Expand Graph">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </button>
          </div>
        </div>

        {/* Chart — inline */}
        <div className="min-h-0 flex-1">
          {renderChart(tab, inlineData, inlineGhost, ct)}
        </div>
      </div>

      {/* Expanded popup */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md sm:p-6"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="flex h-[85vh] w-full max-w-6xl flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Expanded Telemetry</h3>
                  <LiquidPillSelector
                    items={TABS.map(t => ({ key: t.id, label: t.label }))}
                    activeKey={tab}
                    onChange={(k) => setTab(k)}
                    size="md"
                    filterId="liquid-chart-tabs-expanded"
                  />
                  <div className="hidden font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-600 sm:block">
                    {history.length} pts · Full Horizon
                    {ghostHistory && ghostHistory.length > 5 && ' · ghost on'}
                  </div>
                </div>
                <button onClick={() => setIsExpanded(false)} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="min-h-0 flex-1">
                {renderChart(tab, expandedData, expandedGhost, ct)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
