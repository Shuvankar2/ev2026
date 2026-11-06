import { useState, useEffect, useMemo } from 'react'
import LiquidPillSelector from '../ui/LiquidPillSelector'
import { downloadTelemetryCSV } from '../../utils/telemetryExporter'

const BATTERY_CONDITIONS = ['Healthy', 'Degraded', 'Cold']
const REGEN_LABELS = { Healthy: '74 kW', Degraded: '56 kW', Cold: '44 kW (0°C)' }

export default function SimControlRail({ sim, onOpenColabModal }) {
  const { params, setParams, reset, play, pause,
          isPlaying, isComplete, speedMultiplier, setSpeedMultiplier,
          currentState, history } = sim

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

  const handleExport = () => {
    downloadTelemetryCSV(history, params)
  }

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
            type="range"
            min="0.10"
            max="1.0"
            step="0.05"
            value={local.soc_initial}
            disabled={isRunning}
            onChange={e => set('soc_initial', parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Cruise speed slider */}
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
            type="range"
            min="60"
            max="130"
            step="5"
            value={local.cruise_speed_kmh}
            disabled={isRunning}
            onChange={e => set('cruise_speed_kmh', parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600">
            <span>60 km/h</span>
            <span>95 km/h</span>
            <span>130 km/h</span>
          </div>
        </div>

        {/* Battery condition selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Battery Condition
            </label>
            <span className="text-xs font-bold text-slate-400">
              {REGEN_LABELS[local.battery_condition]}
            </span>
          </div>
          <LiquidPillSelector
            items={BATTERY_CONDITIONS.map(c => ({ key: c, label: c }))}
            activeKey={local.battery_condition}
            onChange={k => !isRunning && set('battery_condition', k)}
            filterId="liquid-battery"
          />
        </div>

        {/* Duration selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Duration
            </label>
            <span className="text-xs font-bold text-slate-400">
              {(local.max_time ?? 300) >= 3600
                ? `${(local.max_time / 3600).toFixed(0)}h`
                : `${((local.max_time ?? 300) / 60).toFixed(0)} min`}
            </span>
          </div>
          <LiquidPillSelector
            items={[
              { key: 30,    label: '30s' },
              { key: 300,   label: '5m' },
              { key: 900,   label: '15m' },
              { key: 1800,  label: '30m' },
              { key: 3600,  label: '1h' },
              { key: 10800, label: '3h' },
            ]}
            activeKey={local.max_time ?? 300}
            onChange={k => !isRunning && set('max_time', k)}
            filterId="liquid-duration"
          />
        </div>

        {/* Apply changes button */}
        {isDirty && !isRunning && (
          <button
            onClick={() => setParams(local)}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Apply Changes
          </button>
        )}

      </div>

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

      {/* Data Export & Colab Workbench */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            ML & Cloud Workbench
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {history?.length ?? 0} rows
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            disabled={!history || history.length <= 1}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 py-2.5 px-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition active:scale-95 disabled:opacity-40"
            title="Download full telemetry dataset in CSV format"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={onOpenColabModal}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 py-2.5 px-2 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition active:scale-95"
            title="Open interactive ML workbook in Google Colab"
          >
            <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Colab" className="h-3" />
            Colab Tasks
          </button>
        </div>
      </div>

    </div>
  )
}
