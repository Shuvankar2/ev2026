// Calibrated reference scenarios for accuracy verification
// Used by SimAccuracyPanel to validate the JS simulation engine
// Values calibrated from actual engine output (deterministic — EKF noise doesn't affect metrics)
export const REFERENCE_SCENARIOS = [
  {
    label:  'Standard Commute',
    sub:    'SOC 85% · 100 km/h · Healthy',
    params: { soc_initial: 0.85, cruise_speed_kmh: 100, battery_condition: 'Healthy', max_time: 300 },
    expected: { frictionAvoided: 16, socSavedPct: 10.54 },
    note: 'Moderate SOC, regen taper not active → MPC avoids all 16 STD friction events',
  },
  {
    label:  'High SOC Sprint',
    sub:    'SOC 95% · 100 km/h · Healthy',
    params: { soc_initial: 0.95, cruise_speed_kmh: 100, battery_condition: 'Healthy', max_time: 300 },
    expected: { frictionAvoided: 31, socSavedPct: 10.44 },
    note: 'SOC taper limits regen → STD triggers more friction, MPC avoids all',
  },
  {
    label:  'Cold Weather Panic',
    sub:    'SOC 80% · 120 km/h · Cold',
    params: { soc_initial: 0.80, cruise_speed_kmh: 120, battery_condition: 'Cold', max_time: 300 },
    expected: { frictionAvoided: 24, socSavedPct: 7.86 },
    note: 'Cold pack has lowest regen cap + higher speed = more energy use',
  },
  {
    label:  'Degraded Battery',
    sub:    'SOC 60% · 110 km/h · Degraded',
    params: { soc_initial: 0.60, cruise_speed_kmh: 110, battery_condition: 'Degraded', max_time: 300 },
    expected: { frictionAvoided: 20, socSavedPct: 9.12 },
    note: 'Low SOC = good regen headroom, degraded R = higher losses, MPC still avoids all friction',
  },
]

// Pass/fail tolerance threshold (±15% — tighter since engine is deterministic)
export const TOLERANCE = 0.15
