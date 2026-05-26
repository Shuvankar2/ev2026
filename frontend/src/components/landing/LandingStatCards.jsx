import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATS = [
  {
    id: 'friction',
    value: '293',
    label: 'FRICTION EVENTS ELIMINATED ACROSS 4 SCENARIOS',
    summary:
      'Every time standard ACC would have triggered friction brakes, MPC avoided it by maintaining a wider following gap — keeping braking within regenerative limits.',
    formula: 'Σ (standardFrictionEvents − mpcFrictionEvents) across all 4 scenarios',
    engineKeys: 'metrics.standardFrictionEvents − metrics.mpcFrictionEvents per scenario',
    tableHeaders: ['SCENARIO', 'STD', 'MPC', 'AVOIDED'],
    tableData: [
      ['Standard Commute',   'SOC 85% · 100 km/h · Healthy',  '68',  '0', '68'],
      ['High SOC Sprint',    'SOC 95% · 100 km/h · Healthy',  '130', '0', '130'],
      ['Cold Weather Panic', 'SOC 80% · 120 km/h · Cold 0°C', '62',  '0', '62'],
      ['Degraded Battery',   'SOC 60% · 110 km/h · Degraded', '33',  '0', '33'],
    ],
    accentCol: 3,
  },
  {
    id: 'soc',
    value: '9.91%',
    label: 'SOC PRESERVED BY MPC',
    summary:
      'On average across all 4 scenarios, MPC consumed 9.91% less net energy than standard ACC — directly translating to more range.',
    formula: 'avg[ (stdNetEnergy − mpcNetEnergy) / stdNetEnergy × 100 ] across 4 scenarios',
    engineKeys: 'metrics.socPreservedPct per scenario → averaged',
    tableHeaders: ['SCENARIO', 'STD KWH', 'MPC KWH', 'SAVED'],
    tableData: [
      ['Standard Commute',   'SOC 85% · Healthy',  '0.312', '0.278', '10.9%'],
      ['High SOC Sprint',    'SOC 95% · Healthy',  '0.341', '0.298', '12.6%'],
      ['Cold Weather Panic', 'SOC 80% · Cold',     '0.298', '0.271', '9.1%'],
      ['Degraded Battery',   'SOC 60% · Degraded', '0.276', '0.258', '6.9%'],
    ],
    accentCol: 3,
  },
  {
    id: 'window',
    value: '5 min',
    label: 'SIMULATED DRIVE WINDOW PER SCENARIO',
    summary:
      'Each scenario runs a 300-second drive cycle with real traffic dynamics — sinusoidal speed oscillations plus two hard deceleration events — at 1-second resolution.',
    formula: 'HORIZON = 300 s, DT = 1 s → 300 timesteps × 2 modes × 4 scenarios = 2,400 total steps',
    engineKeys: 'HORIZON and DT constants in simulation_engine.py',
    tableHeaders: ['SCENARIO', 'TIMESTEPS', 'MODES', 'TOTAL STEPS'],
    tableData: [
      ['Standard Commute',   '300', 'STD + MPC', '600'],
      ['High SOC Sprint',    '300', 'STD + MPC', '600'],
      ['Cold Weather Panic', '300', 'STD + MPC', '600'],
      ['Degraded Battery',   '300', 'STD + MPC', '600'],
    ],
    accentCol: null,
  },
  {
    id: 'profiles',
    value: '3',
    label: 'BATTERY PROFILES VALIDATED (74 / 56 / 44 KW)',
    summary:
      'Three real-world battery degradation states were modelled — each with different regen power, charge efficiency, and voltage limits.',
    formula: 'BATTERY_PROFILES = { condition 0: Healthy, 1: Degraded, 2: Cold }',
    engineKeys: 'BatteryProfile.regen_power_kw, regen_eff, regen_pinch',
    tableHeaders: ['PROFILE', 'REGEN CAP', 'EFFICIENCY', 'MPC PINCH'],
    tableData: [
      ['Healthy',  'New cell · 25°C',      '74 kW', '82%', '96%'],
      ['Degraded', '70% SOH · aged cell',  '56 kW', '58%', '88%'],
      ['Cold',     'Sub-zero · 0°C',       '44 kW', '45%', '80%'],
    ],
    accentCol: 2,
  },
]

export default function LandingStatCards() {
  const [activeId, setActiveId] = useState(null)
  const active = STATS.find(s => s.id === activeId)

  return (
    <section className="border-y border-slate-200 bg-slate-100 px-4 py-16 md:px-8 dark:border-white/5 dark:bg-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(stat => (
            <motion.button
              key={stat.id}
              onClick={() => setActiveId(stat.id)}
              whileTap={{ scale: 0.97 }}
              className="group rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none"
            >
              <div className="text-5xl font-black tabular-nums text-emerald-600 transition-colors group-hover:text-emerald-500 md:text-6xl dark:text-emerald-400 dark:group-hover:text-emerald-300">
                {stat.value}
              </div>
              <div className="mt-3 text-xs font-bold uppercase leading-relaxed tracking-[0.18em] text-slate-500 dark:text-white/40">
                {stat.label}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600/50 transition-colors group-hover:text-emerald-500/80 dark:text-emerald-500/50 dark:group-hover:text-emerald-400/80">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                View breakdown
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── MODAL PORTAL ── */}
      <AnimatePresence>
        {activeId && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm dark:bg-black/75"
              onClick={() => setActiveId(null)}
            />

            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pb-16 pt-16">
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 transition-colors duration-300"
                onClick={e => e.stopPropagation()}
              >

                {/* ── MODAL HEADER ── */}
                <div className="flex items-start justify-between p-7 pb-0">
                  <div>
                    <div className="text-5xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                      {active?.value}
                    </div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                      {active?.label}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    aria-label="Close"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* ── MODAL BODY ── */}
                <div className="space-y-6 p-7">
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-white/8 dark:bg-white/5 dark:text-white/70 transition-colors duration-300">
                    {active?.summary}
                  </p>

                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                      Formula
                    </div>
                    <div className="rounded-xl border border-emerald-300/30 bg-emerald-50 px-5 py-3 font-mono text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300 transition-colors duration-300">
                      {active?.formula}
                    </div>
                    <div className="mt-2 font-mono text-xs text-slate-400 dark:text-white/25">
                      Engine keys: {active?.engineKeys}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                      Per-Scenario Breakdown
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/8 transition-colors duration-300">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-white/5">
                            {active?.tableHeaders.map((h, i) => (
                              <th
                                key={i}
                                className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] ${
                                  i === active.accentCol ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-white/30'
                                }`}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {active?.tableData.map((row, ri) => (
                            <tr
                              key={ri}
                              className="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
                            >
                              <td className="px-4 py-3.5">
                                <div className="font-medium text-slate-800 dark:text-white">{row[0]}</div>
                                <div className="text-xs text-slate-400 dark:text-white/35">{row[1]}</div>
                              </td>

                              {row.slice(2).map((cell, ci) => {
                                const colIndex = ci + 2
                                const isAccent = colIndex === active.accentCol
                                const isRed =
                                  active.accentCol !== null &&
                                  colIndex < active.accentCol &&
                                  colIndex >= 2
                                return (
                                  <td
                                    key={ci}
                                    className={`px-4 py-3.5 tabular-nums font-semibold ${
                                      isAccent
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : isRed
                                        ? 'text-rose-500 dark:text-red-400/75'
                                        : 'text-slate-600 dark:text-white/55'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
