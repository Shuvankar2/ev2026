import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSimulation }     from '../hooks/useSimulation'
import SimControlRail        from '../components/simulator/SimControlRail'
import SimKPIStrip           from '../components/simulator/SimKPIStrip'
import SimEventLog           from '../components/simulator/SimEventLog'
import SimRoadView           from '../components/simulator/SimRoadView'
import SimChartPanel         from '../components/simulator/SimChartPanel'
import SimMathDisplay        from '../components/simulator/SimMathDisplay'
import SimAccuracyPanel      from '../components/simulator/SimAccuracyPanel'
import SimMLDiagnosticsPanel from '../components/simulator/SimMLDiagnosticsPanel'
import ColabModal            from '../components/simulator/ColabModal'
import { downloadTelemetryCSV } from '../utils/telemetryExporter'
import LiquidPillSelector    from '../components/ui/LiquidPillSelector'

const BOTTOM_TABS = [
  { key: 'charts', label: 'Charts' },
  { key: 'math',   label: 'Math'   },
  { key: 'ai',     label: 'AI Battery Diagnostics' },
]

/**
 * MOBILE PHONE DETECTION
 * ----------------------
 * We check for UA tokens that are EXCLUSIVELY present on phones in mobile browsing mode
 * and are REMOVED by the browser when "Desktop Site" is enabled:
 *
 * - "iPhone" / "iPod" → iOS Safari in mobile mode. When Desktop Site is on, UA changes to
 *   "Macintosh; Intel Mac OS X ..." — neither string remains.
 * - "Android" + "Mobile" together → Chrome/Firefox on Android phone in mobile mode.
 *   When Desktop Site is on, Chrome removes "Mobile" and switches to a Linux/x86_64 UA.
 *
 * We do NOT check plain "Mobile" or "Android" alone — those can persist in edge cases.
 * Width check < 900px is a secondary guard ONLY; the UA is the primary truth.
 *
 * sessionStorage key 'ev_desktop_mode_active' = 'true' is set when the user clicks
 * "I've Turned On Desktop Mode" as a manual fallback (for browsers that don't reload on UA switch).
 */
const isPhoneInMobileMode = () => {
  if (typeof window === 'undefined') return false
  // Manual bypass: user confirmed desktop mode via the button
  if (sessionStorage.getItem('ev_desktop_mode_active') === 'true') return false

  const ua = navigator.userAgent || ''
  // iPhone/iPod in mobile Safari
  const isIOS = /\b(iPhone|iPod)\b/.test(ua)
  // Android Chrome/Firefox on phone (not tablet) in mobile mode
  const isAndroidPhone = /Android/.test(ua) && /Mobile/.test(ua)

  return isIOS || isAndroidPhone
}

/**
 * DESKTOP MODE ON MOBILE DETECTION
 * ---------------------------------
 * Detects when a touch device is operating in desktop UA mode
 * (user enabled "Desktop Site"). Used to unlock zooming only in this case.
 */
const isDesktopModeOnMobile = () => {
  if (typeof window === 'undefined') return false
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const ua = navigator.userAgent || ''
  const isPhoneMobileUA = /\b(iPhone|iPod)\b/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua))
  // Touch device whose UA is now NOT a mobile phone UA = Desktop mode on phone
  return hasTouch && !isPhoneMobileUA
}

export default function SimulatorPage() {
  const [isMobile, setIsMobile] = useState(isPhoneInMobileMode)

  useEffect(() => {
    // Re-evaluate on resize (e.g. when desktop site is enabled and page reflowed)
    const handleResize = () => setIsMobile(isPhoneInMobileMode())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Viewport & zoom management — runs once on mount
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    const prevContent = meta?.getAttribute('content')
    const desktopMobileMode = isDesktopModeOnMobile()
    const bypassConfirmed = sessionStorage.getItem('ev_desktop_mode_active') === 'true'

    if (meta) {
      if (desktopMobileMode || bypassConfirmed) {
        // Touch device in Desktop mode: render full 1024px layout, allow pinch-zoom
        // This is the ONLY case where zooming is permitted
        window.__allowZoom = true
        meta.setAttribute(
          'content',
          'width=1024, initial-scale=0.35, minimum-scale=0.2, maximum-scale=5.0, user-scalable=yes'
        )
      } else {
        // Real desktop or phone in normal mobile mode: fixed viewport, no user zoom
        window.__allowZoom = false
        meta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        )
      }
    }

    return () => {
      window.__allowZoom = false
      if (meta && prevContent) meta.setAttribute('content', prevContent)
    }
  }, [])

  const sim = useSimulation({
    soc_initial: 0.85,
    cruise_speed_kmh: 100,
    battery_condition: 'Healthy',
    max_time: 300,
  })

  const [bottomTab, setBottomTab]       = useState('charts')
  const [showAccuracy, setShowAccuracy] = useState(false)
  const [showColab, setShowColab]       = useState(false)

  const frictionAvoided = sim.history.reduce((n, s) =>
    n + (s.friction_std && !s.friction_mpc ? 1 : 0), 0
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-700 font-mono dark:bg-slate-950 dark:text-slate-300 transition-colors duration-300 relative">
      <Helmet>
        <title>Live EV MPC Simulator · IEM Kolkata | ev2026 Digital Twin</title>
        <meta name="description" content="Launch the live EV MPC simulator. Research digital twin developed at IEM Kolkata by Shuvankar Debnath (suvnkr) comparing Model Predictive Control against standard PID." />
        <meta name="keywords" content="ev mpc shuvankar, ev mpc, ev mpc suvnkr, suvnkr, ev mpc iem kolkata, ev mpc iem, live ev simulator, ev2026, ev.suvnkr.in, shuvankar debnath, SUVNKR, model predictive control, battery degradation cruise control" />
        <meta name="author" content="Shuvankar Debnath (SUVNKR)" />
        <link rel="canonical" href="https://ev.suvnkr.in/simulator" />
        <meta property="og:title" content="Live EV MPC Simulator · IEM Kolkata | ev2026 Digital Twin" />
        <meta property="og:description" content="Simulate Battery-Aware EV MPC vs PID in real-time. Research digital twin developed at IEM Kolkata by Shuvankar Debnath (suvnkr)." />
        <meta property="og:url" content="https://ev.suvnkr.in/simulator" />
      </Helmet>

      {/* ── MOBILE DESKTOP-ONLY GUARD OVERLAY ── */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/95 backdrop-blur-xl text-slate-100 touch-pan-y"
          >
            <div className="flex min-h-full items-center justify-center p-4 py-6 sm:py-10">
              <motion.div
                initial={{ scale: 0.92, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-md w-full my-auto rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-5 sm:p-6 shadow-2xl text-center flex flex-col items-center"
              >
                {/* Hardware monitor icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400/80 mb-1">
                  Desktop Interface Required
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
                  Simulator Workspace
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
                  The EV MPC simulation engine runs real-time matrix solvers and multi-channel telemetry streams optimized for wider displays.
                </p>

                {/* Instructions card */}
                <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-left mb-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">✓</span>
                    To launch on this phone:
                  </div>
                  <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside pl-1">
                    <li>Open browser menu (<strong className="text-white">⋮</strong> or <strong className="text-white">Share</strong>)</li>
                    <li>Enable <strong className="text-emerald-300">Desktop Site</strong> / <strong className="text-emerald-300">Request Desktop Website</strong></li>
                    <li>The simulator unlocks automatically</li>
                  </ol>
                </div>

                {/* Return home button */}
                <Link
                  to="/"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition active:scale-95 text-center"
                >
                  ← Return to Home Overview
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT PANE: CONTROLS & MONITORING ── */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white/50 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/50">

        {/* Brand header */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold tracking-wider text-slate-800 dark:text-white">
              EV MPC · 2026
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              sim.isPlaying
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse'
                : sim.isComplete
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {sim.isPlaying ? 'RUNNING' : sim.isComplete ? 'DONE' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Controls (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <SimControlRail sim={sim} onOpenColabModal={() => setShowColab(true)} />
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
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Live MPC Simulator
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
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

        {/* Bottom panel — Charts / Math / AI Battery Diagnostics */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">

          {/* Tab bar */}
          <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
            <LiquidPillSelector
              items={BOTTOM_TABS}
              activeKey={bottomTab}
              onChange={setBottomTab}
              size="md"
              filterId="liquid-bottom-tabs"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadTelemetryCSV(sim.history, sim.params)}
                disabled={!sim.history || sim.history.length <= 1}
                className="flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400/80 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300 disabled:opacity-40"
                title="Download CSV dataset"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV ({sim.history?.length ?? 0})
              </button>

              <button
                onClick={() => setShowColab(true)}
                className="flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 transition hover:border-amber-400 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                title="Open interactive ML workbook in Google Colab"
              >
                <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Colab" className="h-3" />
                Colab Tasks
              </button>

              <button
                onClick={() => setShowAccuracy(true)}
                className="flex items-center gap-1.5 rounded-full border border-blue-300/40 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-500 transition hover:border-blue-400/50 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400/70 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                Accuracy Test
              </button>
            </div>
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
            {bottomTab === 'ai' && (
              <SimMLDiagnosticsPanel
                history={sim.history}
                params={sim.params}
                onOpenColabModal={() => setShowColab(true)}
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

      <AnimatePresence>
        {showColab && (
          <ColabModal
            isOpen={showColab}
            onClose={() => setShowColab(false)}
            history={sim.history}
            params={sim.params}
          />
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
