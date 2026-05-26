import { useState, useEffect, useMemo } from 'react'
import LiquidPillSelector from '../ui/LiquidPillSelector'

const BATTERY_CONDITIONS = ['Healthy', 'Degraded', 'Cold']
const REGEN_LABELS = { Healthy: '74 kW', Degraded: '56 kW', Cold: '44 kW (0°C)' }

export default function SimControlRail({ sim }) {
  const { params, setParams, reset, play, pause,
          isPlaying, isComplete, speedMultiplier, setSpeedMultiplier,
          currentState } = sim

  const [local, setLocal] = useState(params)
  const isDirty   = JSON.stringify(local) !== JSON.stringify(params)
  const isRunning = isPlaying || ((currentState?.t ?? 0) > 0 && !isComplete)
  
  const activeSpeeds = useMemo(() => {
    const t = params.max_time ?? 300
    if (t >= 3000) return [1, 15, 30]
    if (t >= 500) return [1, 10, 20]
    return [1, 5, 10]
  }, [params.max_time])

  useEffect(() => {
    if (!activeSpeeds.includes(speedMultiplier)) {
      setSpeedMultiplier(1)
    }
  }, [activeSpeeds, speedMultiplier, setSpeedMultiplier])

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }))
  const handleReset = () => reset(local)

  return (
    <div className="space-y-5 p-4">

      {/* Parameter lock wrapper */}
      <div className={`relative space-y-5 transition-opacity ${isRunning ? 'opacity-50' : ''}`}>
        {isRunning && (
          <div
            className="absolute inset-0 z-10 cursor-not-allowed"
            title="Pause or reset to edit parameters"
          />
        )}

        {/* SOC slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Initial SOC
            </label>
            <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {Math.round(local.soc_initial * 100)}%
            </span>
          </div>
          <input
            type="range" min="0.1" max="1.0" step="0.05"
            value={local.soc_initial}
            onChange={e => set('soc_initial', parseFloat(e.target.value))}
            className="w-full cursor-pointer accent-emerald-500"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-700">
            <span>10%</span><span>50%</span><span>100%</span>
          </div>
        </div>

        {/* Cruise speed */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Cruise Speed
            </label>
            <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {local.cruise_speed_kmh} km/h
            </span>
          </div>
          <input
            type="range" min="60" max="130" step="5"
            value={local.cruise_speed_kmh}
            onChange={e => set('cruise_speed_kmh', parseInt(e.target.value))}
            className="w-full cursor-pointer accent-emerald-500"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-700">
            <span>60</span><span>100</span><span>130</span>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500" title="Can be manually overridden up to 3 hours (10800s)">
              Duration (max 3h)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="30" max="10800"
                value={local.max_time ?? 300}
                onChange={e => {
                   let val = parseInt(e.target.value, 10)
                   if (isNaN(val)) val = 300
                   set('max_time', Math.min(10800, Math.max(30, val)))
                }}
                disabled={isRunning}
                className="w-16 rounded border border-slate-200 bg-white px-1 py-0.5 text-right text-sm font-bold tabular-nums text-emerald-600 outline-none transition focus:border-emerald-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-emerald-400"
              />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">s</span>
            </div>
          </div>
          <input
            type="range" min="30" max="10800" step="30"
            value={local.max_time ?? 300}
            onChange={e => set('max_time', parseInt(e.target.value))}
            className="w-full cursor-pointer accent-emerald-500"
            disabled={isRunning}
          />
          <div className="flex justify-between pointer-events-none text-xs text-slate-400 dark:text-slate-700">
            <span>30s</span><span>1.5h</span><span>3h</span>
          </div>
        </div>

        {/* Battery condition */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Battery Condition
          </label>
          <LiquidPillSelector
            items={BATTERY_CONDITIONS.map(c => ({ key: c, label: c }))}
            activeKey={local.battery_condition}
            onChange={(k) => set('battery_condition', k)}
            disabled={isRunning}
            filterId="liquid-battery"
          />
          <div className="text-xs text-slate-400 dark:text-slate-700">
            Regen cap: {REGEN_LABELS[local.battery_condition]}
          </div>
        </div>
      </div>

      {/* Dirty state — apply button */}
      {isDirty && (
        <button
          onClick={handleReset}
          className="w-full rounded-xl border border-amber-400/30 bg-amber-50 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-100 active:scale-95 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
        >
          ↺ Apply & Reset with New Parameters
        </button>
      )}

      <div className="border-t border-slate-200 dark:border-slate-800 transition-colors duration-300" />

      {/* Sim speed */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Playback Speed
        </label>
        <LiquidPillSelector
          items={activeSpeeds.map(s => ({ key: s, label: `${s}×` }))}
          activeKey={speedMultiplier}
          onChange={(k) => setSpeedMultiplier(k)}
          filterId="liquid-speed"
        />
      </div>

      {/* Play controls */}
      <div className="flex gap-2">
        {isPlaying ? (
          <button
            onClick={pause}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300 active:scale-95 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
            </svg>
            Pause
          </button>
        ) : (
          <button
            onClick={play}
            disabled={isComplete}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 active:scale-95 disabled:opacity-40 dark:text-slate-950"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            {isComplete ? 'Complete' : 'Run'}
          </button>
        )}
        <button
          onClick={() => { setLocal(params); reset() }}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-400 transition hover:border-slate-400 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-white"
        >
          ↺
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-700">
          <span>t = {currentState?.t?.toFixed(0) ?? 0}s</span>
          <span>{params.max_time ?? 300}s</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 transition-colors duration-300">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((currentState?.t ?? 0) / (params.max_time ?? 300)) * 100}%` }}
          />
        </div>
      </div>

    </div>
  )
}
