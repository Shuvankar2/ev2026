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
import LiquidPillSelector    from '../components/ui/LiquidPillSelector'

const BOTTOM_TABS = [
  { key: 'charts', label: 'Charts' },
  { key: 'math',   label: 'Math'   },
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

  const frictionAvoided = sim.history.reduce((n, s) =>
    n + (s.friction_std && !s.friction_mpc ? 1 : 0), 0
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-700 font-mono dark:bg-slate-950 dark:text-slate-300 transition-colors duration-300 relative">
      <Helmet>
        <title>Live EV MPC Simulator · ev2026 | IEM Kolkata Digital Twin</title>
        <meta name="description" content="Launch the ev2026 live EV MPC (Electric Vehicle Model Predictive Control) simulator. Test predictive EV cruise control vs standard PID in real-time. IEM Kolkata research digital twin by suvnkr (Shuvankar Debnath)." />
        <meta name="keywords" content="EV MPC, EV MPC IEM Kolkata, live EV simulator, ev2026, ev2026 simulator, shuvankar debnath, suvnkr, model predictive control, battery degradation cruise control" />
        <link rel="canonical" href="https://ev.shuvankar.qzz.io/simulator" />
        <meta property="og:title" content="Live EV MPC Simulator · ev2026 | IEM Kolkata Digital Twin" />
        <meta property="og:description" content="Simulate Battery-Aware EV MPC vs PID in real-time. Research digital twin developed at IEM Kolkata by Shuvankar Debnath (suvnkr)." />
        <meta property="og:url" content="https://ev.shuvankar.qzz.io/simulator" />
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
                {/* Monitor Device Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 sm:mb-4 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-emerald-400 mb-1">
                  Desktop View Recommended
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Please Turn On Desktop Mode
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 sm:mb-5">
                  The live MPC-ACC simulator contains high-density telemetry, multi-curve state charts, and dynamic road visualization engineered for desktop viewports.
                </p>

                {/* Instructions Box */}
                <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-left mb-4 sm:mb-5 text-xs text-slate-300 space-y-1.5 sm:space-y-2">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <span>⚙️</span> How to enable on mobile:
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span>Tap your browser menu (<strong className="text-white">⋮</strong> in Chrome, <strong className="text-white">aA</strong> in Safari, <strong className="text-white">⋯</strong> in Edge).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span>Enable <strong className="text-white">"Desktop site"</strong> or <strong className="text-white">"Request Desktop Website"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span>The simulator will automatically unlock, allowing you to pinch-zoom into any chart!</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                  <button
                    onClick={() => {
                      sessionStorage.setItem('ev_desktop_mode_active', 'true')
                      setIsMobile(false)
                    }}
                    className="flex-1 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    ✓ I've Turned On Desktop Mode
                  </button>
                  <Link
                    to="/"
                    className="rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-slate-100 transition active:scale-95 text-center flex items-center justify-center"
                  >
                    ← Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
