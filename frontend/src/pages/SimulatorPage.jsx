import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulation }     from '../hooks/useSimulation'
import SimControlRail        from '../components/simulator/SimControlRail'
import SimKPIStrip           from '../components/simulator/SimKPIStrip'
import SimEventLog           from '../components/simulator/SimEventLog'
import SimRoadView           from '../components/simulator/SimRoadView'
import SimChartPanel         from '../components/simulator/SimChartPanel'
import SimMathDisplay        from '../components/simulator/SimMathDisplay'
import SimAccuracyPanel      from '../components/simulator/SimAccuracyPanel'
import LiquidPillSelector    from '../components/ui/LiquidPillSelector'

const BOTTOM_TABS = [
  { key: 'charts', label: 'Charts' },
  { key: 'math',   label: 'Math'   },
]

export default function SimulatorPage() {
  const sim = useSimulation({
    soc_initial: 0.85,
    cruise_speed_kmh: 100,
    battery_condition: 'Healthy',
    max_time: 300,
  })

  const [bottomTab, setBottomTab]       = useState('charts')
  const [showAccuracy, setShowAccuracy] = useState(false)

  const frictionAvoided = sim.history.reduce((n, s) =>
    n + (s.friction_std && !s.friction_mpc ? 1 : 0), 0
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-700 font-mono dark:bg-slate-950 dark:text-slate-300 transition-colors duration-300">

      {/* ── LEFT RAIL ── */}
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/40 transition-colors duration-300">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 transition-colors duration-300">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-500">
              MPC-ACC
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-600">Live Simulation Engine</div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                sim.isPlaying  ? 'animate-pulse bg-emerald-500 dark:bg-emerald-400' :
                sim.isComplete ? 'bg-amber-500 dark:bg-amber-400'                   :
                                 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-600">
              {sim.isPlaying ? 'RUNNING' : sim.isComplete ? 'DONE' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Controls (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <SimControlRail sim={sim} />
        </div>

        {/* KPI strip */}
        <SimKPIStrip state={sim.currentState} frictionAvoided={frictionAvoided} />

        {/* Event log */}
        <SimEventLog events={sim.events} />
      </aside>

      {/* ── RIGHT PANE ── */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Page Title */}
        <div className="shrink-0 border-b border-slate-200 bg-white/40 px-6 py-6 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/30 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-emerald-500/80">
              Interactive Digital Twin
            </p>
            <h1 className="text-3xl font-black text-slate-900 transition-colors dark:text-white md:text-4xl">
              Live Simulator
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-3xl">
              Test Battery-Aware Model Predictive Control against standard PID in real-time. 
              Adjust conditions, inject friction events, and monitor predictive energy savings.
            </p>
          </motion.div>
        </div>

        {/* Road view */}
        <section
          className="relative shrink-0 border-b border-slate-200 transition-colors duration-300 dark:border-slate-800"
          style={{ height: '28vh', minHeight: 180 }}
        >
          <SimRoadView
            gapMpc={sim.currentState?.gap_mpc ?? 30}
            gapStd={sim.currentState?.gap_std ?? 30}
            vLead={sim.currentState?.v_lead ?? 0}
            isFrictionStd={sim.currentState?.friction_std ?? false}
            isRegenMpc={sim.currentState?.is_regen_mpc ?? false}
            isPlaying={sim.isPlaying}
          />

          <AnimatePresence>
            {sim.isComplete && (
              <CompletionOverlay
                state={sim.currentState}
                frictionAvoided={frictionAvoided}
                onReset={sim.reset}
              />
            )}
          </AnimatePresence>
        </section>

        {/* Bottom panel — Charts / Math */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">

          {/* Tab bar */}
          <div className="mb-3 flex items-center gap-3">
            <LiquidPillSelector
              items={BOTTOM_TABS}
              activeKey={bottomTab}
              onChange={setBottomTab}
              size="md"
              filterId="liquid-bottom-tabs"
            />

            <button
              onClick={() => setShowAccuracy(true)}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-blue-300/40 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-500 transition hover:border-blue-400/50 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400/70 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
              Accuracy Test
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {bottomTab === 'charts' && (
              <SimChartPanel
                history={sim.history}
                ghostHistory={sim.ghostHistory}
                maxTime={sim.params.max_time}
              />
            )}
            {bottomTab === 'math' && (
              <SimMathDisplay
                state={sim.currentState}
                params={sim.params}
              />
            )}
          </div>
        </section>

      </main>

      <AnimatePresence>
        {showAccuracy && (
          <SimAccuracyPanel onClose={() => setShowAccuracy(false)} />
        )}
      </AnimatePresence>

    </div>
  )
}

// ── Completion overlay ──────────────────────────────────────────────────────
function CompletionOverlay({ state, frictionAvoided, onReset }) {
  if (!state) return null

  const energySaved = Math.max(0, state.energy_std_kwh - state.energy_mpc_kwh)
  const socSaved    = state.energy_std_kwh > 0.0001
    ? (energySaved / state.energy_std_kwh * 100).toFixed(2)
    : '0.00'

  const rows = [
    { label: 'Friction Events Avoided', value: frictionAvoided,                          accent: true  },
    { label: 'SOC Preserved',           value: `${socSaved}%`,                           accent: true  },
    { label: 'Energy Saved',            value: `${energySaved.toFixed(4)} kWh`,          accent: false },
    { label: 'STD Energy Used',         value: `${state.energy_std_kwh.toFixed(4)} kWh`, accent: false },
    { label: 'MPC Energy Used',         value: `${state.energy_mpc_kwh.toFixed(4)} kWh`, accent: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(2,6,23,0.88)' }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 240, damping: 22 }}
        className="w-[340px] rounded-2xl border border-emerald-500/15 bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600/60 dark:text-emerald-500/60">
            Simulation Complete · t = {state.t?.toFixed(0) ?? '?'}s
          </div>
          <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
            MPC-ACC Performance Summary
          </div>
        </div>

        <div className="space-y-2.5 px-6 py-4">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className={`text-sm font-bold tabular-nums ${r.accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-white/70'}`}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 px-6 py-4 dark:border-white/5">
          <button
            onClick={() => onReset()}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400 active:scale-95 dark:text-slate-950"
          >
            ↺ Reset & Run Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
