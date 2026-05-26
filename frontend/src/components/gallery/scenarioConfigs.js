export const SCENARIO_CONFIGS = [
  {
    id: 'standard_commute',
    title: 'Standard Highway Baseline',
    tag: 'HEALTHY',
    tagColor: 'border-emerald-400/30 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    accentColor: '#10b981',
    params: { soc_initial: 0.85, cruise_speed_kmh: 100, battery_condition: 'Healthy', traffic_profile: 'standard' },
    desc: 'Normal highway dynamics. MPC extends following distance preemptively, keeping all braking within regenerative limits at moderate SOC.',
  },
  {
    id: 'high_soc_sprint',
    title: 'Full Charge Braking Penalty',
    tag: 'WORST CASE',
    tagColor: 'border-amber-400/30 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    accentColor: '#f59e0b',
    params: { soc_initial: 0.95, cruise_speed_kmh: 100, battery_condition: 'Healthy', traffic_profile: 'sprint' },
    desc: 'At 95% SOC, the regen ceiling approaches zero. MPC widens the gap by up to 30m to decelerate on aerodynamic drag alone — zero friction braking.',
    featured: true,
  },
  {
    id: 'cold_weather_panic',
    title: 'Cold Weather Regen Lockout',
    tag: 'COLD 0°C',
    tagColor: 'border-sky-400/30 bg-sky-100 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400',
    accentColor: '#38bdf8',
    params: { soc_initial: 0.80, cruise_speed_kmh: 120, battery_condition: 'Cold', traffic_profile: 'winter' },
    desc: 'Sub-zero temperatures severely restrict charge acceptance. MPC maps the reduced constraint boundary in real time via EKF and coasts earlier.',
  },
  {
    id: 'degraded_battery',
    title: 'Second-Life Voltage Sag',
    tag: 'DEGRADED',
    tagColor: 'border-violet-400/30 bg-violet-100 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400',
    accentColor: '#a78bfa',
    params: { soc_initial: 0.60, cruise_speed_kmh: 110, battery_condition: 'Degraded', traffic_profile: 'stop_go' },
    desc: 'High internal resistance forces premature voltage limits under regen loads. The EKF dynamically maps the degraded regen boundary each second.',
  },
]

export const CHART_TABS = [
  { key: 'gap', label: 'Gap' },
  { key: 'speed', label: 'Speed' },
  { key: 'soc', label: 'SOC' },
  { key: 'current', label: 'Current' },
]

export const FILTER_ITEMS = [
  { key: 'All', label: 'All' },
  { key: 'Healthy', label: 'Healthy' },
  { key: 'Cold', label: 'Cold' },
  { key: 'Degraded', label: 'Degraded' },
]

export const VIEW_ITEMS = [
  { key: 'gallery', label: 'Grid' },
  { key: 'compare', label: 'Compare' },
]

export const CMP_COLORS = {
  standard_commute: { mpc: '#10b981', std: '#f43f5e' },
  high_soc_sprint: { mpc: '#34d399', std: '#fb7185' },
  cold_weather_panic: { mpc: '#38bdf8', std: '#7dd3fc' },
  degraded_battery: { mpc: '#a78bfa', std: '#c4b5fd' },
}