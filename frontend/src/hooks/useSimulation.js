// src/hooks/useSimulation.js
import { useState, useRef, useCallback, useEffect } from 'react'
import { SimulationRunner } from '../engine/simulationEngine'

const DEFAULT_PARAMS = {
  soc_initial: 0.85,
  cruise_speed_kmh: 100,
  battery_condition: 'Healthy',
  max_time: 300,
}

function buildZeroState(params) {
  const spd = params.cruise_speed_kmh / 3.6
  return {
    t: 0,
    v_lead: spd,
    soc_std: params.soc_initial,   soc_ekf_std: params.soc_initial,
    soc_mpc: params.soc_initial,   soc_ekf_mpc: params.soc_initial,
    v_ego_std: spd,                v_ego_mpc: spd,
    gap_std: 30,                   gap_mpc: 30,
    current_std: 0,                current_mpc: 0,
    friction_std: false,           friction_mpc: false,
    energy_std_kwh: 0,             energy_mpc_kwh: 0,
    regen_cap_A: 0,
    is_regen_mpc: false,           is_regen_std: false,
  }
}

export function useSimulation(initialParams = DEFAULT_PARAMS) {
  const [params, setParamsState]       = useState(initialParams)
  const [isPlaying, setIsPlaying]      = useState(false)
  const [isComplete, setIsComplete]    = useState(false)
  const [speedMultiplier, setSpeed]    = useState(1)
  const [events, setEvents]            = useState([])
  const [ghostHistory, setGhostHistory] = useState([])
  const [currentState, setCurrentState] = useState(() => buildZeroState(initialParams))
  const [history, setHistory]          = useState(() => [buildZeroState(initialParams)])

  // Refs — never cause re-renders
  const runnerRef   = useRef(null)
  const rafRef      = useRef(null)
  const prevTimeRef = useRef(null)
  const accumRef    = useRef(0)
  const playingRef  = useRef(false)
  const speedRef    = useRef(1)
  const histRef     = useRef([buildZeroState(initialParams)])
  const eventsRef   = useRef([])

  useEffect(() => {
    runnerRef.current = new SimulationRunner(initialParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { playingRef.current = isPlaying }, [isPlaying])
  useEffect(() => { speedRef.current = speedMultiplier }, [speedMultiplier])

  const tick = useCallback(() => {
    if (!runnerRef.current || runnerRef.current.isDone()) return
    const next = runnerRef.current.tick()
    histRef.current = [...histRef.current, next]

    // Telemetry event — new friction event on STD
    const prev = histRef.current.at(-2)
    if (next.friction_std && !prev?.friction_std) {
      const evt = { id: Date.now(), t: next.t, msg: `STD friction at t=${next.t}s` }
      eventsRef.current = [evt, ...eventsRef.current].slice(0, 20)
      setEvents([...eventsRef.current])
    }

    setCurrentState(next)
    setHistory([...histRef.current])

    if (runnerRef.current.isDone()) {
      setIsPlaying(false)
      playingRef.current = false
      setIsComplete(true)
    }
  }, [])

  const loop = useCallback((time) => {
    if (prevTimeRef.current !== undefined) {
      accumRef.current += time - prevTimeRef.current
      const msPerTick = 1000 / speedRef.current
      while (accumRef.current >= msPerTick) {
        if (!runnerRef.current?.isDone()) tick()
        accumRef.current -= msPerTick
      }
    }
    prevTimeRef.current = time
    if (playingRef.current) rafRef.current = requestAnimationFrame(loop)
  }, [tick])

  useEffect(() => {
    if (isPlaying) {
      prevTimeRef.current = undefined
      accumRef.current = 0
      rafRef.current = requestAnimationFrame(loop)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, loop])

  const play  = useCallback(() => { if (!isComplete) setIsPlaying(true) }, [isComplete])
  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback((newParams) => {
    cancelAnimationFrame(rafRef.current)
    setIsPlaying(false)
    playingRef.current = false

    const p = newParams ?? params

    // Save current run as ghost
    if (histRef.current.length > 5) setGhostHistory([...histRef.current])

    runnerRef.current = new SimulationRunner(p)
    const zero = buildZeroState(p)
    histRef.current  = [zero]
    eventsRef.current = []
    accumRef.current  = 0
    prevTimeRef.current = undefined

    setCurrentState(zero)
    setHistory([zero])
    setEvents([])
    setIsComplete(false)
    if (newParams) setParamsState(newParams)
  }, [params])

  const setParams = useCallback((p) => setParamsState(p), [])

  return {
    currentState, history, ghostHistory,
    isPlaying, isComplete, events,
    speedMultiplier, params,
    play, pause, reset, setParams,
    setSpeedMultiplier: setSpeed,
  }
}
