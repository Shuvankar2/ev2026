import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadTelemetryCSV } from '../../utils/telemetryExporter'

const COLAB_URL = 'https://colab.research.google.com/github/Shuvankar2/ev2026/blob/main/notebooks/ev_mpc_battery_workbench.ipynb'

const PYTHON_SNIPPET = `# ── EV MPC Google Colab Telemetry Loader ──────────────────
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. Load exported telemetry (upload your ev_mpc_telemetry_*.csv file)
from google.colab import files
uploaded = files.upload()
filename = list(uploaded.keys())[0]
df = pd.read_csv(filename)

print(f"Loaded {len(df)} telemetry rows from {filename}")

# 2. Compare Joule Thermal Loss and Current Variance
joule_std = df['joule_heating_std_w'].sum() / 3600
joule_mpc = df['joule_heating_mpc_w'].sum() / 3600
print(f"Conventional Battery Heat: {joule_std:.2f} Wh")
print(f"MPC-Protected Battery Heat: {joule_mpc:.2f} Wh ({(joule_std - joule_mpc)/joule_std*100:.1f}% cooler)")
`

export default function ColabModal({ isOpen, onClose, history, params }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SNIPPET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleExportCSV = () => {
    downloadTelemetryCSV(history, params)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-800 dark:text-slate-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Google Colab ML Workbench
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Train machine learning models & analyze battery wear in the cloud
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <a
              href={COLAB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition active:scale-95"
            >
              <img
                src="https://colab.research.google.com/assets/colab-badge.svg"
                alt="Open In Colab"
                className="h-5"
              />
              <span>Open in Google Colab ↗</span>
            </a>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Telemetry ({history?.length ?? 0} ticks)</span>
            </button>
          </div>

          {/* Code Tasks Directory */}
          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Interactive Tasks in the Colab Notebook
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Task 1</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Load Telemetry & Verify Electrochemical Boundaries</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Upload exported CSV or use the built-in calibrated EV dataset.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Task 2</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Quantify Joule Heat & Current Spikes</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Calculate I²R losses, RMS current variance, and friction brake destruction.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Task 3</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Train Random Forest / Gradient Boosting Models</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Fit machine learning regressors to predict battery stress coefficients.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Task 4</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Long-Term SOH Capacity Fade Projections</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Plot 2,000-cycle battery retention curves showing the MPC longevity gain.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Task 5</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Researcher Coding Challenge</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Tune custom cost weights or build neural network policies to minimize cell degradation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quickstart Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Python Colab Starter Snippet
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? '✓ Copied to Clipboard!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
              <code>{PYTHON_SNIPPET}</code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Notebook hosted on GitHub: <code className="text-emerald-500">notebooks/ev_mpc_battery_workbench.ipynb</code></span>
            <button
              onClick={onClose}
              className="font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

