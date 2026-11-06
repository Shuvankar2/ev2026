import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { evaluateBatteryTelemetry } from '../../engine/batteryMLEngine'
import { downloadTelemetryCSV } from '../../utils/telemetryExporter'

const COLAB_URL = 'https://colab.research.google.com/github/Shuvankar2/ev2026/blob/main/notebooks/ev_mpc_battery_ml.ipynb'

export default function SimMLDiagnosticsPanel({ history, params, onOpenColabModal }) {
  const ml = useMemo(() => {
    return evaluateBatteryTelemetry(history, params)
  }, [history, params])

  const handleExportCSV = () => {
    downloadTelemetryCSV(history, params)
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 p-4 text-xs font-mono text-slate-700 dark:text-slate-300">
      
      {/* Top Banner: SOH Lifespan & ML Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Lifespan Extension Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Projected Battery Lifespan
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-300">
              +{ml.cycleLifeGainPct}% Gain
            </span>
          </div>
          <div className="flex items-baseline gap-3 my-1">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {ml.projectedCyclesMpc} <span className="text-xs font-normal text-slate-400">cycles</span>
            </div>
            <div className="text-xs text-slate-400 line-through">
              {ml.projectedCyclesStd} cycles (STD)
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Cycles until 80% State of Health (SOH) End-of-Life threshold based on Arrhenius degradation model.
          </p>
        </div>

        {/* Electrochemical Stress Index (ESI) Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Electrochemical Stress Index
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">
              -{(ml.esiStd - ml.esiMpc)} pts lower
            </span>
          </div>
          <div className="space-y-2 my-1">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-emerald-500 font-bold">MPC Control</span>
                <span className="font-bold text-slate-900 dark:text-white">{ml.esiMpc}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ml.esiMpc}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-red-400 font-bold">Conventional PID</span>
                <span className="font-bold text-slate-900 dark:text-white">{ml.esiStd}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${ml.esiStd}%` }} />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Current variance, micro-cycles & high-SOC plating risk.
          </p>
        </div>

        {/* Thermal & Range Gain Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Thermal & Range Efficiency
            </span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">
              +{ml.rangeExtensionKm} km
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 my-1">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block">Joule Heat Saved</span>
              <span className="text-base font-bold text-emerald-500">+{ml.thermalLossSavedPct}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block">Friction Avoided</span>
              <span className="text-base font-bold text-emerald-500">{ml.frictionAvoided} events</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Recuperated energy that would have been dissipated as thermal brake heat.
          </p>
        </div>
      </div>

      {/* Feature Attribution: Why MPC Outperforms Conventional Battery Management */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
            Explainable AI: Battery Degradation Drivers
          </h4>
          <span className="text-[10px] text-slate-400">
            Physics-Informed Feature Importance
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ml.featureDrivers.map((driver, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{driver.name}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{driver.status}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1.5">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${driver.impactPct}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{driver.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Diagnostic Verdict & Action Footer */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900/10 to-slate-900/20 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              AI Diagnostic Verdict
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
            {ml.verdict}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition active:scale-95 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV ({history?.length ?? 0} rows)
          </button>

          <button
            onClick={onOpenColabModal}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Colab" className="h-3.5" />
            Google Colab Tasks ↗
          </button>
        </div>
      </div>

    </div>
  )
}
