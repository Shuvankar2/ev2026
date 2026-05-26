// src/engine/simulationEngine.js
// Fixed: numerical MPC gradient, voltage-based EKF with realistic noise, regen SOC taper, road load energy

class LeadVehicle {
  constructor(cruiseSpeedKmh) { this.cruiseSpeed = cruiseSpeedKmh }

  speed(t) {
    let v = this.cruiseSpeed + 5 * Math.sin(0.1 * t)
    if (t >= 60 && t < 65)        v -= 15 * (t - 60) / 5
    else if (t >= 65 && t < 70)   v -= 15 * (1 - (t - 65) / 5)
    if (t >= 180 && t < 185)      v -= 15 * (t - 180) / 5
    else if (t >= 185 && t < 190) v -= 15 * (1 - (t - 185) / 5)
    return Math.max(10, Math.min(130, v))
  }
}

class BatteryModel {
  constructor(capacityAh, R, regenPowerKw) {
    this.capacityAh = capacityAh
    this.R = R                    // pack internal resistance (Ω)
    this.regenPowerKw = regenPowerKw
    this.cellsSeries = 96
  }

  _ocvCell(soc) { return 3.2 + 0.8 * soc }

  terminalVoltage(soc, I) {
    return this._ocvCell(soc) * this.cellsSeries - I * this.R
  }

  // SOC taper — regen cap reduces to 0 as SOC → 100%
  regenCapCurrent(soc) {
    const taper = soc > 0.80 ? Math.max(0, (1.0 - soc) / 0.20) : 1.0
    const base  = (this.regenPowerKw * 1000) / this.terminalVoltage(soc, 0)
    return base * taper
  }

  // Inverse OCV for EKF voltage-based measurement
  estimateSOCFromVoltage(vTerminal, I) {
    const ocvCell = (vTerminal + I * this.R) / this.cellsSeries
    return Math.min(1, Math.max(0, (ocvCell - 3.2) / 0.8))
  }

  updateSOC(soc, I, dt) {
    return Math.min(1, Math.max(0, soc - (I * dt) / (this.capacityAh * 3600)))
  }

  // Road load model — aero drag + rolling resistance
  tractiveForce(accel, speed) {
    const mass   = 1500                          // kg
    const F_aero = 0.5 * 1.2 * 0.30 * 2.2 * speed * speed // ½ρCdAv²
    const F_roll = mass * 9.81 * 0.015          // Crr * m * g
    const F_acc  = mass * accel
    return F_acc + F_aero + F_roll               // N
  }

  electricalPower(accel, speed) {
    const F = this.tractiveForce(accel, speed)
    const P_wheel = F * speed                    // W (negative = regen)
    if (P_wheel > 0) return P_wheel / 0.90       // motoring: draw from battery
    else             return P_wheel * 0.70       // regen: recover to battery
  }
}

// Real 1D EKF using voltage-based independent measurement
class EKFFilter {
  constructor(capacityAh, Q = 0.0001, R_noise = 0.005) {
    this.capacityAh = capacityAh
    this.Q = Q               // process noise
    this.R_noise = R_noise   // measurement noise (larger = trust voltage less)
    this.x = 1.0             // SOC estimate
    this.P = 0.1             // error covariance
  }

  step(I, dt, socFromVoltage) {
    // Predict — Coulomb counting
    const u      = (I * dt) / (this.capacityAh * 3600)
    const x_pred = Math.min(1, Math.max(0, this.x - u))
    const P_pred = this.P + this.Q

    // Correct — voltage-based SOC estimate
    const innov  = socFromVoltage - x_pred
    const K      = P_pred / (P_pred + this.R_noise)
    this.x       = Math.min(1, Math.max(0, x_pred + K * innov))
    this.P       = (1 - K) * P_pred

    return { soc: this.x, innovation: innov, K }
  }

  reset(soc = 1.0) { this.x = soc; this.P = 0.1 }
}

class PIDController {
  constructor(kp = 0.5, ki = 0.01, kd = 0.1, dt = 1.0) {
    this.kp = kp; this.ki = ki; this.kd = kd; this.dt = dt
    this.integral = 0; this.prevError = 0
  }

  compute(gap, desiredGap = 30) {
    const err = gap - desiredGap
    this.integral += err * this.dt
    const d = (err - this.prevError) / this.dt
    this.prevError = err
    return Math.min(2, Math.max(-3,
      this.kp * err + this.ki * this.integral + this.kd * d
    ))
  }

  reset() { this.integral = 0; this.prevError = 0 }
}

// Numerical gradient (central differences) MPC Solver
class MPCSolver {
  constructor(N = 10, dt = 1, wGap = 1.0, wAccel = 0.1, iters = 30) {
    this.N = N; this.dt = dt
    this.wGap = wGap; this.wAccel = wAccel; this.iters = iters
  }

  _rollout(seq, gap, egoSpeed, leadSpeed, futureLeadSpeeds, regenCapA, voltage, mass) {
    let cost = 0
    let g = gap, v = egoSpeed
    for (let i = 0; i < this.N; i++) {
      const a    = seq[i]
      const vNew = Math.max(0, v + a * this.dt)
      const vL   = futureLeadSpeeds[i] ?? leadSpeed
      const gNew = Math.max(1, g + (vL - vNew) * this.dt)
      const gErr = gNew - 30

      cost += this.wGap * gErr * gErr + this.wAccel * a * a

      // Regen constraint penalty
      if (Math.abs(a) > 1e-6 && vNew > 0.1) {
        const eff  = a > 0 ? 0.9 : 0.7
        const I    = (mass * a * vNew) / (voltage * eff)
        const absI = Math.abs(I)
        if (absI > regenCapA) {
          const vio = absI - regenCapA
          cost += 100 * vio * vio
        }
      }
      v = vNew; g = gNew
    }
    return cost
  }

  solve(gap, egoSpeed, leadSpeed, futureLeadSpeeds, regenCapA, voltage, mass = 1500) {
    let seq = new Array(this.N).fill(0)
    const eps = 1e-3

    for (let iter = 0; iter < this.iters; iter++) {
      const baseCost = this._rollout(seq, gap, egoSpeed, leadSpeed,
                                      futureLeadSpeeds, regenCapA, voltage, mass)
      const grad = new Array(this.N).fill(0)

      for (let i = 0; i < this.N; i++) {
        seq[i] += eps
        const costPlus = this._rollout(seq, gap, egoSpeed, leadSpeed,
                                        futureLeadSpeeds, regenCapA, voltage, mass)
        seq[i] -= 2 * eps
        const costMinus = this._rollout(seq, gap, egoSpeed, leadSpeed,
                                         futureLeadSpeeds, regenCapA, voltage, mass)
        seq[i] += eps 
        grad[i] = (costPlus - costMinus) / (2 * eps)
      }

      const gradNorm = Math.sqrt(grad.reduce((s, g) => s + g * g, 0))
      const stepSize = gradNorm > 1e-6 ? Math.min(0.05, 0.5 / gradNorm) : 0.01

      for (let i = 0; i < this.N; i++) {
        seq[i] = Math.min(2, Math.max(-3, seq[i] - stepSize * grad[i]))
      }

      // Early convergence check to save CPU cycles
      const newCost = this._rollout(seq, gap, egoSpeed, leadSpeed,
                                     futureLeadSpeeds, regenCapA, voltage, mass)
      if (Math.abs(newCost - baseCost) / (Math.abs(baseCost) + 1e-8) < 1e-6) break
    }

    return seq[0]
  }
}

// ─── Battery profiles ─────────────────────────────────────────────────────────
export const BATTERY_PROFILES = {
  Healthy:  { capacityAh: 60, R: 0.08, regenKw: 74 },
  Degraded: { capacityAh: 45, R: 0.12, regenKw: 56 },
  Cold:     { capacityAh: 55, R: 0.18, regenKw: 44 },
}

// ─── Main runner ──────────────────────────────────────────────────────────────
export class SimulationRunner {
  constructor(params) {
    this._params = params
    this._init(params)
  }

  _init({ soc_initial = 0.85, cruise_speed_kmh = 100, battery_condition = 'Healthy', max_time = 300 }) {
    const prof = BATTERY_PROFILES[battery_condition]
    if (!prof) throw new Error(`Unknown condition: ${battery_condition}`)

    this.battery = new BatteryModel(prof.capacityAh, prof.R, prof.regenKw)
    
    // Dynamically adjust EKF measurement noise based on battery condition
    // Degraded/Cold batteries have more voltage sag, requiring heavier filtering
    const rNoise = battery_condition === 'Healthy' ? 0.005 : 0.015;
    
    this.ekfStd  = new EKFFilter(prof.capacityAh, 0.0001, rNoise)
    this.ekfMpc  = new EKFFilter(prof.capacityAh, 0.0001, rNoise)
    this.pid     = new PIDController(0.5, 0.01, 0.1, 1)
    this.mpc     = new MPCSolver(10, 1, 1.0, 0.1, 30)
    this.lead    = new LeadVehicle(cruise_speed_kmh)

    const spd = cruise_speed_kmh / 3.6
    this.t              = 0
    this.soc_std        = Math.min(1, Math.max(0, soc_initial))
    this.soc_mpc        = Math.min(1, Math.max(0, soc_initial))
    this.v_ego_std      = spd
    this.v_ego_mpc      = spd
    this.gap_std        = 30
    this.gap_mpc        = 30
    this.energy_std_kwh = 0
    this.energy_mpc_kwh = 0

    this.ekfStd.reset(this.soc_std)
    this.ekfMpc.reset(this.soc_mpc)
  }

  _current(accel, speed, voltage) {
    if (Math.abs(accel) < 1e-6 || speed < 0.1) return 0
    const F = this.battery.tractiveForce(accel, speed)
    const P = F * speed
    return P / (voltage * (P > 0 ? 0.9 : 0.7))
  }

  _futureLeads(t) {
    return Array.from({ length: 10 }, (_, i) =>
      this.lead.speed(t + i + 1) / 3.6
    )
  }

  tick() {
    const dt        = 1.0
    const vLead     = this.lead.speed(this.t) / 3.6
    const futureLeads = this._futureLeads(this.t)

    const vStd      = this.battery.terminalVoltage(this.soc_std, 0)
    const vMpc      = this.battery.terminalVoltage(this.soc_mpc, 0)
    
    // Regen cap floor to prevent 0-cap singularities at 100% SOC
    const capStd    = Math.max(this.battery.regenCapCurrent(this.soc_std), 1e-3)
    const capMpc    = Math.max(this.battery.regenCapCurrent(this.soc_mpc), 1e-3)

    // ── STD (PID) ──────────────────────────────────────────────────
    const aStd       = this.pid.compute(this.gap_std)
    const iStd       = this._current(aStd, this.v_ego_std, vStd)
    const frictionStd = aStd < 0 && Math.abs(iStd) > capStd

    const newVStd    = Math.max(0, this.v_ego_std + aStd * dt)
    const newGapStd  = Math.max(1, this.gap_std + (vLead - newVStd) * dt)
    const pElecStd   = this.battery.electricalPower(aStd, this.v_ego_std)
    this.energy_std_kwh += pElecStd * dt / 3.6e6

    const newSocStd  = this.battery.updateSOC(this.soc_std, iStd, dt)
    const vTermStd   = this.battery.terminalVoltage(newSocStd, iStd)
    
    // Inject realistic sensor noise (±0.05V) to make EKF actually filter something
    const noisyVTermStd = vTermStd + (Math.random() - 0.5) * 0.1
    const socVoltStd = this.battery.estimateSOCFromVoltage(noisyVTermStd, iStd)
    const ekfStd     = this.ekfStd.step(iStd, dt, socVoltStd)

    // ── MPC ────────────────────────────────────────────────────────
    const aMpc       = this.mpc.solve(
      this.gap_mpc, this.v_ego_mpc, vLead, futureLeads, capMpc, vMpc
    )
    const iMpc       = this._current(aMpc, this.v_ego_mpc, vMpc)
    const frictionMpc = aMpc < 0 && Math.abs(iMpc) > capMpc

    const newVMpc    = Math.max(0, this.v_ego_mpc + aMpc * dt)
    const newGapMpc  = Math.max(1, this.gap_mpc + (vLead - newVMpc) * dt)
    const pElecMpc   = this.battery.electricalPower(aMpc, this.v_ego_mpc)
    this.energy_mpc_kwh += pElecMpc * dt / 3.6e6

    const newSocMpc  = this.battery.updateSOC(this.soc_mpc, iMpc, dt)
    const vTermMpc   = this.battery.terminalVoltage(newSocMpc, iMpc)
    
    // Inject realistic sensor noise
    const noisyVTermMpc = vTermMpc + (Math.random() - 0.5) * 0.1
    const socVoltMpc = this.battery.estimateSOCFromVoltage(noisyVTermMpc, iMpc)
    const ekfMpc     = this.ekfMpc.step(iMpc, dt, socVoltMpc)

    // ── Commit ─────────────────────────────────────────────────────
    this.v_ego_std = newVStd; this.gap_std = newGapStd; this.soc_std = newSocStd
    this.v_ego_mpc = newVMpc; this.gap_mpc = newGapMpc; this.soc_mpc = newSocMpc
    this.t += dt

    return {
      t:              this.t,
      v_lead:         vLead,
      // STD
      soc_std:        this.soc_std,
      soc_ekf_std:    ekfStd.soc,
      ekf_innovation_std: ekfStd.innovation,
      ekf_K_std:      ekfStd.K,
      v_ego_std:      this.v_ego_std,
      gap_std:        this.gap_std,
      current_std:    iStd,
      friction_std:   frictionStd ? 1 : 0,
      energy_std_kwh: this.energy_std_kwh,
      // MPC
      soc_mpc:        this.soc_mpc,
      soc_ekf_mpc:    ekfMpc.soc,
      ekf_innovation_mpc: ekfMpc.innovation,
      ekf_K_mpc:      ekfMpc.K,
      v_ego_mpc:      this.v_ego_mpc,
      gap_mpc:        this.gap_mpc,
      current_mpc:    iMpc,
      friction_mpc:   frictionMpc ? 1 : 0,
      energy_mpc_kwh: this.energy_mpc_kwh,
      // Shared
      regen_cap_A:    (capStd + capMpc) / 2,
      is_regen_mpc:   pElecMpc < 0,
      is_regen_std:   pElecStd < 0,
    }
  }

  isDone() { return this.t >= (this._params?.max_time ?? 300) }

  reset(params) {
    this._params = params ?? this._params
    this._init(this._params)
  }
}
