import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import LiquidPillSelector from '../ui/LiquidPillSelector'
import AnimatedNumber from '../ui/AnimatedNumber'
import MiniChart from './MiniChart'
import downloadCSV from '../../utils/downloadCSV'
import { CHART_TABS } from './scenarioConfigs'

export default function ScenarioCard({ scenario, expanded, onToggle }) {
  const navigate = useNavigate()
  const [chartTab, setChartTab] = useState('gap')
  const { id, title, tag, tagColor, accentColor, desc, metrics, history, featured } = scenario

  return (
    <motion.article
      layout
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl border overflow-hidden flex flex-col transition-colors duration-300 ${expanded
        ? 'border-emerald-400/30 bg-white shadow-lg dark:border-emerald-500/30 dark:bg-slate-900/70 dark:shadow-none'
        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700'
        } ${featured ? 'ring-1 ring-amber-300/30 dark:ring-amber-500/20' : ''}`}
    >
      <div className="p-5 space-y-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${tagColor}`}>
            {tag}
          </span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => downloadCSV(id, history)} aria-label="Download CSV"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
            </svg>
          </motion.button>
        </div>

        <div>
          <h2 className="text-base font-bold leading-snug text-slate-800 dark:text-white transition-colors">{title}</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{desc}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Friction Avoided', value: metrics.frictionAvoided, suffix: '' },
            { label: 'SOC Saved', value: metrics.socSavedPct, suffix: '%' },
            { label: 'Energy Saved', value: metrics.energySavedKwh, suffix: ' kWh' },
          ].map(k => (
            <div key={k.label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center dark:border-white/5 dark:bg-white/[0.03] transition-colors">
              <div className="text-lg font-black tabular-nums leading-none" style={{ color: accentColor }}>
                <AnimatedNumber value={k.value} suffix={k.suffix} />
              </div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-600">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/simulator?soc=${scenario.params.soc_initial}&speed=${scenario.params.cruise_speed_kmh}&cond=${scenario.params.battery_condition}`)}
            className="flex-1 rounded-xl py-2 text-xs font-bold transition-all active:scale-95"
            style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }}
          >
            Run in Simulator →
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onToggle}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800 active:scale-95 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white">
            {expanded ? 'Collapse' : 'Expand'}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 px-4 py-4 dark:bg-[#020617] transition-colors duration-300">
        <div className="mb-3 flex items-center justify-between">
          <LiquidPillSelector items={CHART_TABS} activeKey={chartTab} onChange={setChartTab} size="sm" filterId={`liquid-chart-${id}`} />
          <div className="flex gap-3">
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
              <div className="h-1.5 w-3 rounded-full bg-rose-500" />STD
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: accentColor }}>
              <div className="h-1.5 w-3 rounded-full" style={{ background: accentColor }} />MPC
            </span>
          </div>
        </div>
        {history?.length > 0 ? (
          <MiniChart history={history} chartType={chartTab} expanded={expanded} accentColor={accentColor} />
        ) : (
          <div className="flex items-center justify-center h-32 text-xs text-slate-400 font-mono dark:text-slate-700">No data</div>
        )}
      </div>
    </motion.article>
  )
}