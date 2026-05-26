import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MetricModal from './metrics/MetricModal'

export const METRIC_DETAILS = [
  {
    value: '293',
    suffix: '',
    accentColor: '#10b981',
    label: 'Friction events eliminated across 4 scenarios',
    plain: 'Every time standard ACC would have triggered friction brakes, MPC avoided it by maintaining a wider following gap — keeping braking within regenerative limits.',
    formula: 'Σ (standardFrictionEvents − mpcFrictionEvents) across all 4 scenarios',
    engine_keys: 'metrics.standardFrictionEvents − metrics.mpcFrictionEvents per scenario',
    breakdown: [
      { scenario: 'Standard Commute',  params: 'SOC 85% · 100 km/h · Healthy',  std: 68,  mpc: 0, avoided: 68  },
      { scenario: 'High SOC Sprint',   params: 'SOC 95% · 100 km/h · Healthy',  std: 130, mpc: 0, avoided: 130 },
      { scenario: 'Cold Weather',      params: 'SOC 80% · 120 km/h · Cold',     std: 73,  mpc: 0, avoided: 73  },
      { scenario: 'Degraded Battery',  params: 'SOC 75% · 120 km/h · Degraded', std: 22,  mpc: 0, avoided: 22  },
    ],
    colHeaders: ['STD Events', 'MPC Events', 'Avoided'],
    note: 'A friction event = 1 timestep (1 s) where required braking power P_brake = mass × |accel| × v_ms exceeds available regen power P_regen = regen_cap_A × V_terminal.',
  },
  {
    value: '9.91',
    suffix: '%',
    accentColor: '#34d399',
    label: 'SOC preserved by MPC',
    plain: 'On average across all 4 scenarios, MPC consumed 9.91% less net energy than standard ACC — directly translating to more range.',
    formula: 'avg[ (stdNetEnergy − mpcNetEnergy) / stdNetEnergy × 100 ] across 4 scenarios',
    engine_keys: 'metrics.socPreservedPct per scenario → averaged',
    breakdown: [
      { scenario: 'Standard Commute', params: 'SOC 85% · Healthy',  stdKwh: '0.312', mpcKwh: '0.278', saved: '10.9%' },
      { scenario: 'High SOC Sprint',  params: 'SOC 95% · Healthy',  stdKwh: '0.341', mpcKwh: '0.298', saved: '12.6%' },
      { scenario: 'Cold Weather',     params: 'SOC 80% · Cold',     stdKwh: '0.398', mpcKwh: '0.362', saved: '9.0%'  },
      { scenario: 'Degraded Battery', params: 'SOC 75% · Degraded', stdKwh: '0.367', mpcKwh: '0.341', saved: '7.1%'  },
    ],
    colHeaders: ['STD kWh', 'MPC kWh', 'Saved'],
    note: 'Net energy = traction_kWh − regen_recovered_kWh. MPC recovers more by decelerating earlier and softer, staying within the regen window.',
    isPercent: true,
  },
  {
    value: '3',
    suffix: '',
    accentColor: '#f59e0b',
    label: 'Battery profiles validated (74 / 56 / 44 kW)',
    plain: 'Three real-world battery degradation states were modelled — each with different regen power, charge efficiency, and voltage limits.',
    formula: 'BATTERY_PROFILES = { condition 0: Healthy, 1: Degraded, 2: Cold } — 3 discrete electrochemical states',
    engine_keys: 'BatteryProfile.regen_power_kw, regen_eff, regen_pinch per condition index',
    breakdown: [
      { scenario: 'Healthy (condition=0)',  params: 'New cell · 25°C',      regen: '74 kW', eff: '82%', pinch: '96%' },
      { scenario: 'Degraded (condition=1)', params: '70% SOH · aged cell',  regen: '56 kW', eff: '58%', pinch: '88%' },
      { scenario: 'Cold (condition=2)',     params: 'Sub-zero · 0°C',       regen: '44 kW', eff: '45%', pinch: '80%' },
    ],
    colHeaders: ['Regen Cap', 'Regen Eff', 'MPC Pinch'],
    note: 'regen_pinch is the MPC-mode safety factor applied on top of the base regen limit. Cold batteries receive the most conservative derating to prevent lithium plating.',
    isProfiles: true,
  },
  {
    value: '5',
    suffix: ' min',
    accentColor: '#818cf8',
    label: 'Simulated drive window per scenario',
    plain: 'Each scenario runs a 300-second highway drive at 1-second resolution — producing 301 data points per chart, per mode.',
    formula: 'HORIZON / 60 = 300 s ÷ 60 = 5 minutes per scenario',
    engine_keys: 'HORIZON = 300, DT = 1.0 (constants in simulation_engine.py)',
    breakdown: [
      { scenario: 'HORIZON',        params: 'Total simulation time',    value: '300 s' },
      { scenario: 'DT',             params: 'Timestep resolution',      value: '1.0 s' },
      { scenario: 'Data points',    params: 'Per scenario · per mode',  value: '301'   },
      { scenario: 'Scenarios × modes', params: '4 scenarios × 2 modes', value: '8 runs' },
      { scenario: 'Total data pts', params: 'Across full gallery',      value: '2,408' },
    ],
    colHeaders: ['Value'],
    note: 'STD and MPC run on identical traffic profiles (same seed) so differences are purely from control policy — not from different traffic patterns.',
    isTime: true,
  },
]

export function MetricCard({ metric, index }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -3 }}
        className="group relative text-center flex flex-col items-center rounded-2xl border border-transparent px-4 py-5 transition-all duration-200 hover:border-white/10 hover:bg-white/5 cursor-pointer"
        aria-label={`View breakdown for ${metric.label}`}
      >
        <div className="text-5xl md:text-6xl font-extrabold tabular-nums leading-none" style={{ color: metric.accentColor }}>
          {metric.value}{metric.suffix}
        </div>
        <div className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-white/60 transition-colors duration-300">
          {metric.label}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ color: metric.accentColor }}
        >
          View breakdown
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && <MetricModal metric={metric} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
