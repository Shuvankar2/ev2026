import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LiquidPillSelector from '../components/ui/LiquidPillSelector'
import PlantTab from '../components/howitworks/PlantTab'
import EKFTab from '../components/howitworks/EKFTab'
import MPCTab from '../components/howitworks/MPCTab'
import ResultsTab from '../components/howitworks/ResultsTab'

const TABS = [
  { key: 'plant',   label: '01 · Battery Plant' },
  { key: 'ekf',     label: '02 · EKF Estimator' },
  { key: 'mpc',     label: '03 · MPC Controller' },
  { key: 'results', label: '04 · Results' },
]

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('plant')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800 transition-colors duration-300"
        >
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600/70 mb-2 dark:text-emerald-500/70">
            Technical Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white transition-colors">
            How MPC-ACC Works
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Interactive breakdown of the three-layer control pipeline: battery plant model,
            Extended Kalman Filter state estimator, and Model Predictive Controller.
            Click any sub-system to explore its formulation.
          </p>
        </motion.div>

        {/* Horizontal liquid pill nav */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <LiquidPillSelector
            items={TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
            size="md"
            filterId="liquid-hiw-tabs"
          />
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px]">
            {['Sensor', '→ EKF', '→ Cap', '→ MPC', '→ Out'].map((s, i) => (
              <span key={i} className={s.startsWith('→') ? 'text-slate-400 dark:text-slate-600' : 'text-emerald-600 dark:text-emerald-400'}>{s}</span>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none dark:backdrop-blur-sm transition-colors duration-300"
          >
            {activeTab === 'plant' && <PlantTab />}
            {activeTab === 'ekf' && <EKFTab />}
            {activeTab === 'mpc' && <MPCTab />}
            {activeTab === 'results' && <ResultsTab />}
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next nav */}
        <div className="mt-4 flex gap-3">
          {TABS.map((tab, i) => {
            const idx = TABS.findIndex(t => t.key === activeTab)
            if (i === idx - 1) return (
              <motion.button key={tab.key} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition active:scale-95 dark:border-white/5 dark:bg-white/[0.03] dark:hover:text-white dark:hover:border-white/10">
                ← {tab.label}
              </motion.button>
            )
            if (i === idx + 1) return (
              <motion.button key={tab.key} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(tab.key)}
                className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition active:scale-95 dark:border-white/5 dark:bg-white/[0.03] dark:hover:text-white dark:hover:border-white/10">
                {tab.label} →
              </motion.button>
            )
            return null
          })}
        </div>

      </div>
    </div>
  )
}