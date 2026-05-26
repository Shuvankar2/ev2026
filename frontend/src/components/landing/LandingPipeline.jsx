import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FlowArrow() {
  return (
    <div className="hidden h-full items-center justify-center md:flex pt-10">
      <motion.svg
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="text-emerald-500/50"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </motion.svg>
    </div>
  )
}

function PipelineNode({ label, desc, theme = 'slate', strong = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const themes = {
    slate: {
      idle: 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10',
      active: 'border-slate-300 bg-slate-100 text-slate-800 dark:border-white/30 dark:bg-white/10 dark:text-white',
      accent: 'text-slate-400',
    },
    emerald: {
      idle: 'border-emerald-300/30 bg-emerald-50 text-emerald-700 hover:border-emerald-400/50 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10',
      active: 'border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300',
      accent: 'text-emerald-500',
    },
  }

  const t = themes[theme]
  const elevated = strong
    ? 'border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.15)] bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.2)] dark:bg-emerald-500/10 dark:text-emerald-300'
    : (isOpen ? t.active : t.idle)

  return (
    <div className="flex flex-col">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left font-bold transition-all duration-300 ${elevated}`}
      >
        <span>{label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className={t.accent}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-600 shadow-inner dark:border-white/5 dark:bg-black/40 dark:text-slate-400 transition-colors duration-300">
              {desc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LandingPipeline() {
  return (
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-24 md:px-8 relative overflow-hidden dark:border-white/5 dark:bg-slate-950 transition-colors duration-300">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl relative z-10">

          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-500">
              System Architecture
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white transition-colors duration-300">
              How MPC-ACC Processes Each Drive Cycle
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4 items-start">

            {/* INPUT */}
            <div className="space-y-4">
              <div className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">Input</div>
              <PipelineNode
                label="State of Charge (SOC)"
                desc="State of Charge (0–100%) estimated via Coulomb counting and EKF. Used to compute terminal voltage V_terminal = 360 + 0.42×(SOC−50) clamped to 330–410 V. High SOC is the primary MPC constraint trigger. Engine ref: terminal_voltage(soc) in simulation_engine.py"
              />
              <PipelineNode
                label="Cruise Speed Target"
                desc="Reference speed (km/h) for the ACC controller. The lead vehicle speed profile is generated with sinusoidal oscillations and ramp deceleration events to mimic real highway traffic. Engine ref: _traffic_profile() generates lead_speed; target_speed is derived from PID (STD) or MPC logic."
              />
              <PipelineNode
                label="Battery Condition (SOH)"
                desc="Three profiles: Healthy (74 kW regen, 82% eff), Degraded (56 kW, 58% eff, 30% reduction), Cold (44 kW, 45% eff, temperature-limited). Regen power factor decreases linearly from SOC 70–90%. Engine ref: BATTERY_PROFILES dictionary; get_max_regen_power() applies SOC scaling."
              />
            </div>

            <FlowArrow />

            {/* PROCESS */}
            <div className="space-y-4">
              <div className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-600">Process</div>
              <PipelineNode
                label="EKF State Estimator"
                desc="Extended Kalman Filter with state [SOC, V_RC]. Battery model: V_t = OCV(SOC) − V_RC − I·R₀. Uses Jacobians and covariance updates to fuse current and voltage measurements, removing sensor noise before regen cap calculation. Currently approximated by first-order lag (est_lag = 0.22) for real-time performance."
                theme="emerald"
              />
              <PipelineNode
                label="Dynamic Regen Cap"
                desc="P_regen_max = profile.regen_power_kw × f(SOC), where f(SOC) = 1 for SOC ≤ 70%, linear to 0 at SOC = 90%. Converted to current: I_regen_max = P_regen_max × 1000 / V_terminal. This is the hard constraint passed to the MPC solver. Engine ref: get_max_regen_power() and _regen_cap_current_a()."
                theme="emerald"
              />
              <PipelineNode
                label="MPC Solver (5-min Horizon)"
                desc="Model Predictive Control over HORIZON = 300 s at DT = 1 s. Minimises cost J = Σ(speed_error² + α·accel²) subject to |I_battery| ≤ I_regen_max. When P_brake_req = mass×|accel|×v_ms would exceed P_regen_max, the solver caps deceleration and widens following distance preemptively — eliminating friction events entirely."
                theme="emerald"
                strong={true}
              />
            </div>

            <FlowArrow />

            {/* OUTPUT */}
            <div className="space-y-4">
              <div className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">Output</div>
              <PipelineNode
                label="Friction Events Avoided"
                desc="Count of 1-second timesteps where STD ACC required P_brake_req > P_regen_max, triggering mechanical brakes. MPC caps deceleration to stay within regen limits, reducing this count to zero. Calculated as: stdFrictionEventCount − mpcFrictionEventCount. Engine ref: metrics.frictionEventsAvoided."
              />
              <PipelineNode
                label="Total SOC Preserved"
                desc="ΔSOC = SOC_mpc_final − SOC_std_final (percentage points). Derived from energy savings: socPreservedPct = (stdNetEnergy − mpcNetEnergy) / stdNetEnergy × 100. Typical range: 7–13% across all 4 scenarios. Engine ref: metrics.socDiff and metrics.socPreservedPct."
              />
              <PipelineNode
                label="Range Extended"
                desc="Extra range (km) = energy_saved_kWh / 0.16 kWh·km⁻¹, where energy_saved = stdNetEnergy − mpcNetEnergy and BASE_CONSUMPTION = 0.16 kWh/km for a 60 kWh pack. Engine ref: metrics.extraRangeKm in simulate_case()."
              />
            </div>

          </div>

          {/* Status bar */}
          <div className="mt-20 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/5 transition-colors duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                All 4 scenarios pre-calculated · STD and MPC run on identical traffic profiles
              </span>
            </div>
          </div>

        </div>
      </section>
  )
}
