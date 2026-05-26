import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import useIsDark from '../hooks/useIsDark'
import useElementWidth from '../hooks/useElementWidth'
import { Stars, Moon, Sun, Clouds } from './scene/SceneSky'
import SceneTrees from './scene/SceneTrees'
import SceneCar from './scene/SceneCar'
import SceneRoad from './scene/SceneRoad'

function clamp(v, min, max) { return Math.min(Math.max(v, min), max) }

export default function AnimatedEVScene() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.45 })
  const containerWidth = useElementWidth(ref)
  const isDark = useIsDark()

  const [phase, setPhase] = useState('idle')
  const [brake, setBrake] = useState(false)

  const timersRef    = useRef([])
  const runIdRef     = useRef(0)
  const activeRunRef = useRef(false)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(id => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const resetScene = useCallback(() => {
    clearTimers()
    activeRunRef.current = false
    setPhase('idle')
    setBrake(false)
  }, [clearTimers])

  useEffect(() => {
    if (!inView) { resetScene(); return }
    if (activeRunRef.current) return

    activeRunRef.current = true
    const runId = ++runIdRef.current

    const schedule = (delay, fn) => {
      const id = window.setTimeout(() => {
        if (runIdRef.current !== runId) return
        fn()
      }, delay)
      timersRef.current.push(id)
    }

    schedule(500,  () => setPhase('std'))
    schedule(1800, () => setBrake(true))
    schedule(3800, () => { setBrake(false); setPhase('pause') })
    schedule(5400, () => setPhase('mpc'))

    return () => { clearTimers(); activeRunRef.current = false }
  }, [inView, clearTimers, resetScene])

  const isStd       = phase === 'std' || phase === 'pause'
  const isMpc       = phase === 'mpc'
  const showFriction = (brake && phase === 'std') || phase === 'pause'

  const sceneWidth = Math.max(containerWidth || 0, 320)
  const carWidth   = 120
  const maxCarX    = sceneWidth - carWidth - 88

  const evX   = clamp(sceneWidth * (isMpc ? 0.14 : isStd ? 0.28 : 0.20) - carWidth / 2, 12, maxCarX)
  const leadX = clamp(sceneWidth * (isMpc ? 0.52 : isStd ? 0.46 : 0.62) - carWidth / 2, evX + 130, maxCarX)

  const gapLeft  = evX + carWidth + 2
  const gapWidth = Math.max(leadX - gapLeft - 6, 0)

  const skyGradient = isDark
    ? 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e293b 100%)'
    : 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 35%, #e0f2fe 70%, #f0f9ff 100%)'

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 pb-0 pt-2 md:px-8">

      {/* Status badge */}
      <div className="mb-5 text-center">
        <motion.span
          animate={{
            backgroundColor: isMpc ? 'rgba(16,185,129,0.12)' : isStd ? 'rgba(239,68,68,0.12)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isMpc ? '#34d399' : isStd ? '#f87171' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
          }}
          transition={{ duration: 0.5 }}
          className="inline-flex rounded-full border border-slate-300/30 px-4 py-1.5 text-xs font-bold tracking-[0.2em] dark:border-white/10"
        >
          {isMpc ? 'MPC-ACC ACTIVE — REGEN PRESERVED' : isStd ? 'STANDARD ACC — WATCH WHAT HAPPENS' : 'SCROLL TO SEE ADAS IN ACTION ↓'}
        </motion.span>
      </div>

      {/* Scene container */}
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-slate-200/50 dark:border-white/10"
        animate={{
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 25px 50px -12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
        transition={{ duration: 1 }}
        style={{ height: 320, background: skyGradient }}
      >
        {/* Sky */}
        <Stars visible={isDark} />
        <Moon visible={isDark} />
        <Sun visible={!isDark} />
        <Clouds visible={!isDark} />

        {/* Trees */}
        <SceneTrees isDark={isDark} />

        {/* Grass strip */}
        <motion.div className="absolute left-0 right-0 z-[2]" style={{ bottom: 100, height: 10 }}
          animate={{ background: isDark ? 'linear-gradient(180deg, transparent, #0d3320)' : 'linear-gradient(180deg, transparent, #22c55e)' }}
          transition={{ duration: 1 }} />

        {/* Road */}
        <SceneRoad isDark={isDark} />

        {/* Gap indicator */}
        <AnimatePresence>
          {(isStd || isMpc) && (
            <motion.div key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="pointer-events-none absolute z-[5]" style={{ bottom: 134, height: 20, left: 0, right: 0 }}>
              <motion.div className="absolute border-b-2 border-dashed"
                animate={{ left: gapLeft, width: gapWidth, borderColor: isMpc ? '#34d399' : brake ? '#ef4444' : '#94a3b8' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: 0, height: '100%' }}>
                <motion.span animate={{ color: isMpc ? '#34d399' : '#94a3b8' }}
                  className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm"
                  style={{ background: isDark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.7)' }}>
                  {isMpc ? 'Gap 27m · MPC' : 'Gap 18m · STD'}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cars */}
        <motion.div className="absolute z-[5]" style={{ bottom: 98 }} animate={{ x: leadX }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <SceneCar accent="#64748b" brakeLights={brake} regenActive={false} label="Lead Vehicle" isDark={isDark} />
        </motion.div>
        <motion.div className="absolute z-[5]" style={{ bottom: 98 }} animate={{ x: evX }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
          <SceneCar accent="#10b981" brakeLights={brake && phase === 'std'} regenActive={isMpc} label="EV · MPC-ACC" isDark={isDark} />
        </motion.div>

        {/* Red flash */}
        <AnimatePresence>
          {brake && phase === 'std' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.28, 0.08, 0.22, 0] }} exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }} className="pointer-events-none absolute inset-0 z-[6] rounded-[2rem] bg-rose-500" />
          )}
        </AnimatePresence>

        {/* Event labels */}
        <AnimatePresence mode="wait">
          {showFriction && (
            <motion.div key="friction" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="absolute right-24 top-5 z-[7] rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-500 backdrop-blur-sm dark:text-rose-400">
              ⚠ FRICTION BRAKE · Energy Lost as Friction Heat
            </motion.div>
          )}
          {isMpc && (
            <motion.div key="regen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="absolute right-24 top-5 z-[7] rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-600 backdrop-blur-sm dark:text-emerald-400">
              ✓ REGEN ACTIVE · Kinetic Energy Recovered via Regeneration
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode badge */}
        <AnimatePresence mode="wait">
          {isStd && (
            <motion.div key="std" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="absolute bottom-4 left-5 z-[7] rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 backdrop-blur-sm dark:text-rose-400">
              STD ACC · PID · No battery awareness
            </motion.div>
          )}
          {isMpc && (
            <motion.div key="mpc" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="absolute bottom-4 left-5 z-[7] rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 backdrop-blur-sm dark:text-emerald-400">
              MPC ACC · Predictive · EKF battery-aware
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOC gauge */}
        <div className="absolute bottom-5 right-5 top-5 z-[8] flex w-14 flex-col items-center justify-end rounded-xl border border-white/10 p-2 backdrop-blur-md"
          style={{ background: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(30,41,59,0.75)' }}>
          <span className="mb-2 text-[9px] font-bold tracking-widest text-white/40">SOC</span>
          <div className="relative w-full flex-1 overflow-hidden rounded-lg border border-black/50 bg-slate-950 shadow-inner">
            <motion.div className="absolute bottom-0 left-0 right-0"
              animate={{
                height: isMpc ? '88%' : isStd ? '82%' : '85%',
                backgroundColor: isMpc ? '#34d399' : isStd ? '#ef4444' : '#475569',
                boxShadow: isMpc ? '0 -4px 15px rgba(52,211,153,0.3)' : 'none',
              }}
              transition={{ duration: 2.2, ease: 'easeOut' }} />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute h-px w-full bg-white/15" style={{ bottom: `${(i + 1) * 20}%` }} />
            ))}
          </div>
          <motion.span animate={{ color: isMpc ? '#34d399' : isStd ? '#f87171' : '#94a3b8' }}
            className="mt-2 text-sm font-black tabular-nums">
            {isMpc ? '88%' : isStd ? '82%' : '85%'}
          </motion.span>
        </div>
      </motion.div>
    </section>
  )
}
