import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LiquidPillSelector from '../components/ui/LiquidPillSelector'
import ScenarioCard from '../components/gallery/ScenarioCard'
import ComparisonView from '../components/gallery/ComparisonView'
import SummaryTable from '../components/gallery/SummaryTable'
import { SCENARIO_CONFIGS, FILTER_ITEMS, VIEW_ITEMS } from '../components/gallery/scenarioConfigs'
import { SimulationRunner } from '../engine/simulationEngine'

export default function ScenarioGalleryPage() {
  const [scenarios, setScenarios] = useState([])
  const [computing, setComputing] = useState(true)
  const [filterCond, setFilterCond] = useState('All')
  const [sortBy, setSortBy] = useState('friction')
  const [expandedId, setExpandedId] = useState(null)
  const [viewMode, setViewMode] = useState('gallery')

  useEffect(() => {
    const timer = setTimeout(() => {
      const compiled = SCENARIO_CONFIGS.map(config => {
        const runner = new SimulationRunner(config.params)
        const history = []; let stdFriction = 0, mpcFriction = 0
        for (let i = 0; i < 300; i++) {
          const tick = runner.tick(); history.push(tick)
          if (tick.friction_std) stdFriction++
          if (tick.friction_mpc) mpcFriction++
        }
        const last = history[299]
        const energySaved = Math.max(0, last.energy_std_kwh - last.energy_mpc_kwh)
        const socSavedPct = last.energy_std_kwh > 0.0001 ? ((energySaved / last.energy_std_kwh) * 100).toFixed(1) : '0.0'
        return { ...config, history, metrics: { frictionAvoided: stdFriction - mpcFriction, socSavedPct, energySavedKwh: energySaved.toFixed(4) } }
      })
      setScenarios(compiled); setComputing(false)
    }, 60)
    return () => clearTimeout(timer)
  }, [])

  const displayed = useMemo(() => {
    let list = [...scenarios]
    if (filterCond !== 'All') list = list.filter(s => s.params.battery_condition === filterCond)
    list.sort((a, b) => sortBy === 'soc'
      ? parseFloat(b.metrics.socSavedPct) - parseFloat(a.metrics.socSavedPct)
      : b.metrics.frictionAvoided - a.metrics.frictionAvoided
    )
    return list
  }, [scenarios, filterCond, sortBy])

  const totals = useMemo(() => ({
    friction: scenarios.reduce((n, s) => n + (s.metrics?.frictionAvoided ?? 0), 0),
    avgSOC: scenarios.length ? (scenarios.reduce((n, s) => n + parseFloat(s.metrics?.socSavedPct ?? 0), 0) / scenarios.length).toFixed(2) : '0.00',
  }), [scenarios])

  if (computing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            {[0, 150, 300].map(d => <div key={d} className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: `${d}ms` }} />)}
          </div>
          <div className="font-mono text-xs text-slate-400 dark:text-slate-600">Computing 4 × 300 simulation ticks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">Pre-Computed · 4 Scenarios · 1,200 Ticks</p>
              <h1 className="text-3xl font-black text-slate-900 md:text-4xl dark:text-white transition-colors">Scenario Gallery</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                Battery-Aware MPC vs Standard PID across extreme electrochemical boundaries. All simulations run live in your browser — no server required.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-50 px-5 py-3 text-center dark:border-emerald-500/15 dark:bg-emerald-500/5 transition-colors">
                <div className="text-2xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">{totals.friction}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">Total Friction Eliminated</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center dark:border-white/5 dark:bg-white/[0.02] transition-colors">
                <div className="text-2xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">{totals.avgSOC}%</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">Avg SOC Preserved</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <LiquidPillSelector items={FILTER_ITEMS} activeKey={filterCond} onChange={setFilterCond} size="md" filterId="liquid-filter" />
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 outline-none transition focus:border-emerald-500/40 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <option value="friction">↓ Friction Avoided</option>
              <option value="soc">↓ SOC Saved</option>
            </select>
            <LiquidPillSelector items={VIEW_ITEMS} activeKey={viewMode} onChange={setViewMode} size="md" filterId="liquid-view" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {displayed.map(sc => (
                  <ScenarioCard key={sc.id} scenario={sc} expanded={expandedId === sc.id}
                    onToggle={() => setExpandedId(expandedId === sc.id ? null : sc.id)} />
                ))}
              </motion.div>
            </motion.div>
          )}
          {viewMode === 'compare' && (
            <motion.div key="compare" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
              <ComparisonView scenarios={displayed} />
              <SummaryTable scenarios={displayed} />
            </motion.div>
          )}
        </AnimatePresence>

        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-3 text-2xl text-slate-300 dark:text-slate-700">◈</div>
            <div className="text-sm font-bold text-slate-400 dark:text-slate-600">No scenarios match this filter</div>
            <button onClick={() => setFilterCond('All')} className="mt-3 text-xs font-bold text-emerald-500 hover:underline">Clear filter</button>
          </div>
        )}
      </div>
    </div>
  )
}