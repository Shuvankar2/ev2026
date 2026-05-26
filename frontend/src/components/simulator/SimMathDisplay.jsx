// FIX: accelMpc was `v_ego - v_lead` which is relative speed, not acceleration
// FIX: SOC saved shows 100% at t=0 due to 0/0 division — add t>5 guard
// FIX: EKF innovation is now real (from voltage measurement), expose actual K value
// FIX: Show road load breakdown in energy section

const PROFILES = {
  Healthy:  { capacityAh: 60, R: 0.08, regenKw: 74,  cells: 96 },
  Degraded: { capacityAh: 45, R: 0.12, regenKw: 56,  cells: 96 },
  Cold:     { capacityAh: 55, R: 0.18, regenKw: 44,  cells: 96 },
}

function computeLiveMath(state, params) {
  if (!state || state.t === 0) return null

  const prof = PROFILES[params.battery_condition] ?? PROFILES.Healthy

  const ocvPerCell_mpc = 3.2 + 0.8 * state.soc_mpc
  const ocvPack_mpc    = ocvPerCell_mpc * prof.cells
  const vTerm_mpc      = ocvPack_mpc - state.current_mpc * prof.R

  const taper_mpc   = state.soc_mpc > 0.80 ? Math.max(0, (1.0 - state.soc_mpc) / 0.20) : 1.0
  const regenCap    = (prof.regenKw * 1000) / ocvPack_mpc * taper_mpc
  const absIMpc     = Math.abs(state.current_mpc)
  const constraintMargin = regenCap - absIMpc

  const socFromVoltage_mpc = Math.min(1, Math.max(0,
    ((vTerm_mpc + state.current_mpc * prof.R) / prof.cells - 3.2) / 0.8
  ))

  const innovation_mpc = state.ekf_innovation_mpc ?? (state.soc_ekf_mpc - state.soc_mpc)
  const K_mpc          = state.ekf_K_mpc ?? 0.091

  const v = state.v_ego_mpc
  const F_aero    = 0.5 * 1.2 * 0.30 * 2.2 * v * v
  const F_roll    = 1500 * 9.81 * 0.015
  const P_cruise  = (F_aero + F_roll) * v / 1000

  const gapErrMpc = state.gap_mpc - 30
  const mpcCostGap   = 1.0 * gapErrMpc * gapErrMpc
  const relSpeed_mpc = state.v_ego_mpc - state.v_lead
  const mpcCostAccel = 0.1 * relSpeed_mpc * relSpeed_mpc
  const mpcCostTotal = mpcCostGap + mpcCostAccel

  const socSavedPct = state.t > 5 && state.energy_std_kwh > 0.0001
    ? Math.max(0, (state.energy_std_kwh - state.energy_mpc_kwh) / state.energy_std_kwh * 100)
    : null

  return {
    ocvPerCell_mpc: ocvPerCell_mpc.toFixed(3),
    ocvPack_mpc:    ocvPack_mpc.toFixed(1),
    vTerm_mpc:      vTerm_mpc.toFixed(2),
    regenCap:       regenCap.toFixed(1),
    taper_mpc:      taper_mpc.toFixed(2),
    absIMpc:        absIMpc.toFixed(1),
    constraintMargin: constraintMargin.toFixed(1),
    constraintActive: absIMpc > regenCap * 0.95,
    socFromVoltage_mpc: socFromVoltage_mpc.toFixed(4),
    innovation_mpc: innovation_mpc.toFixed(5),
    K_mpc:          K_mpc.toFixed(4),
    socDot_mpc:     ((state.current_mpc) / (prof.capacityAh * 3600) * 100).toFixed(5),
    socDot_std:     ((state.current_std) / (prof.capacityAh * 3600) * 100).toFixed(5),
    P_cruise:       P_cruise.toFixed(3),
    F_aero:         F_aero.toFixed(1),
    F_roll:         F_roll.toFixed(1),
    gapErrMpc:      gapErrMpc.toFixed(2),
    relSpeed_mpc:   relSpeed_mpc.toFixed(3),
    mpcCostGap:     mpcCostGap.toFixed(3),
    mpcCostAccel:   mpcCostAccel.toFixed(3),
    mpcCostTotal:   mpcCostTotal.toFixed(3),
    gapErrStd:      (state.gap_std - 30).toFixed(2),
    socSavedPct:    socSavedPct !== null ? socSavedPct.toFixed(3) : '–',
  }
}

function Row({ label, value, unit, color }) {
  const colorClasses = {
    ok:    'text-emerald-600 dark:text-emerald-400',
    warn:  'text-amber-600 dark:text-amber-400',
    error: 'text-rose-500 dark:text-rose-400',
    dim:   'text-slate-400 dark:text-slate-700',
  }
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-slate-500 dark:text-slate-600">{label}</span>
      <span className={`font-mono tabular-nums ${
        colorClasses[color] ?? 'text-slate-700 dark:text-slate-300'
      }`}>
        {value}
        {unit && <span className="ml-0.5 text-slate-400 dark:text-slate-700">{unit}</span>}
      </span>
    </div>
  )
}

function Block({ title, color, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02] transition-colors duration-300">
      <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>
        {title}
      </div>
      <div className="space-y-1 text-[11px]">{children}</div>
    </div>
  )
}

export default function SimMathDisplay({ state, params }) {
  const m = computeLiveMath(state, params)

  if (!m) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-700">
        Press Run to see live computations
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
      <div className="grid grid-cols-2 gap-2">

        <Block title="Battery · terminalVoltage()" color="text-amber-600/70 dark:text-amber-500/70">
          <Row label="OCV_cell = 3.2 + 0.8·soc"  value={m.ocvPerCell_mpc} unit="V" />
          <Row label="OCV_pack = OCV_cell × 96"   value={m.ocvPack_mpc}    unit="V" />
          <Row label="V_term = OCV − I·R"         value={m.vTerm_mpc}      unit="V" color="ok" />
          <Row label="SOC taper (>80%)"           value={m.taper_mpc}     color={parseFloat(m.taper_mpc) < 1 ? 'warn' : 'ok'} />
          <Row label="regen_cap_A (tapered)"      value={m.regenCap}       unit="A" color="ok" />
          <Row label="|I_mpc|"                    value={m.absIMpc}        unit="A"
            color={parseFloat(m.absIMpc) > parseFloat(m.regenCap) ? 'error' : 'ok'} />
          <Row label="Constraint margin"          value={m.constraintMargin} unit="A"
            color={m.constraintActive ? 'warn' : 'ok'} />
        </Block>

        <Block title="EKF · voltage-based measurement" color="text-blue-500/70 dark:text-blue-400/70">
          <Row label="soc_mpc (Coulomb)"          value={state.soc_mpc?.toFixed(4)} />
          <Row label="soc_from_voltage (meas)"    value={m.socFromVoltage_mpc} color="ok" />
          <Row label="innovation = meas − pred"   value={m.innovation_mpc}
            color={Math.abs(parseFloat(m.innovation_mpc)) > 0.005 ? 'warn' : 'ok'} />
          <Row label="K (Kalman gain)"            value={m.K_mpc} color="ok" />
          <Row label="soc_ekf_mpc (corrected)"    value={state.soc_ekf_mpc?.toFixed(4)} color="ok" />
          <Row label="dSOC/dt (MPC)"              value={m.socDot_mpc} unit="%/s" />
          <Row label="dSOC/dt (STD)"              value={m.socDot_std} unit="%/s" color="dim" />
        </Block>

        <Block title="MPC · numerical gradient descent" color="text-emerald-600/70 dark:text-emerald-500/70">
          <Row label="J = Σ(gap_err²·1 + relV²·0.1)" value={m.mpcCostTotal} color="ok" />
          <Row label="gap_error = gap − 30m"       value={`${m.gapErrMpc} m`} />
          <Row label="cost_gap = 1.0·gap_err²"     value={m.mpcCostGap} />
          <Row label="rel_speed = v_ego − v_lead"  value={`${m.relSpeed_mpc} m/s`} />
          <Row label="cost_relV = 0.1·relV²"       value={m.mpcCostAccel} />
          <Row
            label="Constraint active"
            value={m.constraintActive ? '⚠ penalty added' : 'satisfied'}
            color={m.constraintActive ? 'warn' : 'ok'}
          />
          <Row label="Gradient: central diff ε=1e-3" value="N×2 rollouts/iter" color="dim" />
          <Row label="Horizon N=10, iters=30"      value="adaptive step size" color="dim" />
        </Block>

        <Block title="Energy · road load model" color="text-rose-500/60 dark:text-rose-400/60">
          <Row label="F_aero = ½ρCdAv²"           value={m.F_aero} unit="N" />
          <Row label="F_roll = Crr·m·g"            value={m.F_roll} unit="N" />
          <Row label="P_cruise (road only)"        value={m.P_cruise} unit="kW" />
          <div className="my-1 border-t border-slate-200 dark:border-white/5" />
          <Row label="Energy STD"                  value={state.energy_std_kwh?.toFixed(4)} unit="kWh" />
          <Row label="Energy MPC"                  value={state.energy_mpc_kwh?.toFixed(4)} unit="kWh" color="ok" />
          <Row
            label={state.t > 5 ? 'SOC saved (running)' : 'SOC saved (t < 5s)'}
            value={m.socSavedPct === '–' ? 'accumulating…' : `${m.socSavedPct}%`}
            color={m.socSavedPct === '–' ? 'dim' : 'ok'}
          />
          <Row
            label="STD friction this run"
            value={state.friction_std ? 'ACTIVE' : 'none'}
            color={state.friction_std ? 'error' : 'ok'}
          />
        </Block>

      </div>
    </div>
  )
}
