// src/utils/telemetryExporter.js
// Standardized ML-ready CSV Telemetry Exporter for EV MPC Digital Twin

const BATTERY_PARAMS = {
  Healthy:  { capacityAh: 75, R: 0.08 },
  Degraded: { capacityAh: 60, R: 0.16 },
  Cold:     { capacityAh: 50, R: 0.22 },
}

/**
 * Converts simulation history into a feature-rich, normalized CSV file for ML training
 * @param {Array} history - Array of simulation tick objects
 * @param {Object} params - Simulation configuration { battery_condition, cruise_speed_kmh, max_time, soc_initial }
 * @returns {string} Clean CSV text
 */
export function formatTelemetryCSV(history, params = {}) {
  if (!history || history.length === 0) return ''

  const condition = params.battery_condition || 'Healthy'
  const packInfo = BATTERY_PARAMS[condition] || BATTERY_PARAMS.Healthy
  const capAh = packInfo.capacityAh
  const rPack = packInfo.R

  const headers = [
    'time_s',
    'lead_speed_kmh',
    'lead_speed_mps',
    'ego_speed_std_kmh',
    'ego_speed_mpc_kmh',
    'gap_std_m',
    'gap_mpc_m',
    'soc_actual_std_pct',
    'soc_actual_mpc_pct',
    'soc_ekf_std_pct',
    'soc_ekf_mpc_pct',
    'current_std_A',
    'current_mpc_A',
    'c_rate_std',
    'c_rate_mpc',
    'regen_capacity_limit_A',
    'friction_brake_std',
    'friction_brake_mpc',
    'joule_heating_std_w',
    'joule_heating_mpc_w',
    'cumulative_energy_std_kwh',
    'cumulative_energy_mpc_kwh',
    'ekf_innovation_std',
    'ekf_innovation_mpc'
  ]

  const rows = history.map(row => {
    const time = Number(row.t ?? 0).toFixed(1)
    const vLeadMps = Number(row.v_lead ?? 0)
    const vLeadKmh = (vLeadMps * 3.6).toFixed(2)
    const vStdKmh = (Number(row.v_ego_std ?? 0) * 3.6).toFixed(2)
    const vMpcKmh = (Number(row.v_ego_mpc ?? 0) * 3.6).toFixed(2)

    const gapStd = Number(row.gap_std ?? 0).toFixed(2)
    const gapMpc = Number(row.gap_mpc ?? 0).toFixed(2)

    const socStdPct = (Number(row.soc_std ?? 0) * 100).toFixed(3)
    const socMpcPct = (Number(row.soc_mpc ?? 0) * 100).toFixed(3)
    const socEkfStdPct = (Number(row.soc_ekf_std ?? 0) * 100).toFixed(3)
    const socEkfMpcPct = (Number(row.soc_ekf_mpc ?? 0) * 100).toFixed(3)

    const iStd = Number(row.current_std ?? 0)
    const iMpc = Number(row.current_mpc ?? 0)

    const cRateStd = (iStd / capAh).toFixed(3)
    const cRateMpc = (iMpc / capAh).toFixed(3)

    const regenCap = Number(row.regen_cap_A ?? 0).toFixed(2)
    const frictionStd = row.friction_std ? 1 : 0
    const frictionMpc = row.friction_mpc ? 1 : 0

    const jouleStd = (Math.pow(iStd, 2) * rPack).toFixed(2)
    const jouleMpc = (Math.pow(iMpc, 2) * rPack).toFixed(2)

    const energyStd = Number(row.energy_std_kwh ?? 0).toFixed(5)
    const energyMpc = Number(row.energy_mpc_kwh ?? 0).toFixed(5)

    const innovStd = Number(row.ekf_innovation_std ?? 0).toFixed(5)
    const innovMpc = Number(row.ekf_innovation_mpc ?? 0).toFixed(5)

    return [
      time,
      vLeadKmh,
      vLeadMps.toFixed(2),
      vStdKmh,
      vMpcKmh,
      gapStd,
      gapMpc,
      socStdPct,
      socMpcPct,
      socEkfStdPct,
      socEkfMpcPct,
      iStd.toFixed(2),
      iMpc.toFixed(2),
      cRateStd,
      cRateMpc,
      regenCap,
      frictionStd,
      frictionMpc,
      jouleStd,
      jouleMpc,
      energyStd,
      energyMpc,
      innovStd,
      innovMpc
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Triggers an instant download of the formatted CSV
 */
export function downloadTelemetryCSV(history, params = {}) {
  const csvContent = formatTelemetryCSV(history, params)
  if (!csvContent) return false

  const condition = (params.battery_condition || 'healthy').toLowerCase()
  const speed = params.cruise_speed_kmh || 100
  const duration = Math.round(history[history.length - 1]?.t ?? history.length)
  const filename = `ev_mpc_telemetry_${condition}_${speed}kmh_${duration}s.csv`

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}

