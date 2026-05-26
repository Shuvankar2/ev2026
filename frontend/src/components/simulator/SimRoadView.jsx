import { motion } from 'framer-motion'

const PPM = 3.2
const LEAD_X = 700

function Car({ color, glow, label, labelColor }) {
  return (
    <div className="relative select-none">
      <span className={`absolute -top-5 left-0 text-[10px] font-bold tracking-wider ${labelColor}`}>
        {label}
      </span>
      <svg width="52" height="26" viewBox="0 0 52 26" fill="none">
        <rect x="2" y="9" width="46" height="13" rx="3" fill={color} opacity="0.85" />
        <rect x="11" y="3" width="27" height="10" rx="2.5" fill={color} opacity="0.65" />
        <circle cx="13" cy="22" r="4" fill="#0f172a" />
        <circle cx="13" cy="22" r="1.8" fill="#334155" />
        <circle cx="39" cy="22" r="4" fill="#0f172a" />
        <circle cx="39" cy="22" r="1.8" fill="#334155" />
        <rect x="46" y="12" width="4" height="5" rx="1" fill="white" opacity="0.9" />
        <rect x="2" y="12" width="3" height="5" rx="1" fill="#f43f5e" opacity="0.7" />
        {glow && (
          <ellipse cx="26" cy="26" rx="20" ry="4" fill={color} opacity="0.15" />
        )}
      </svg>
    </div>
  )
}

export default function SimRoadView({ gapMpc, gapStd, vLead, isFrictionStd, isRegenMpc, isPlaying }) {
  const mpcX = Math.max(20, LEAD_X - gapMpc * PPM)
  const stdX = Math.max(20, LEAD_X - gapStd * PPM)
  const scrollDur = vLead > 1 ? Math.max(0.8, 25 / vLead) : 8

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-[#030712] transition-colors duration-300">

      {/* Road surface gradient */}
      <div
        className="absolute inset-x-0"
        style={{
          top: '30%', bottom: '30%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(100,116,139,0.12) 40%, rgba(100,116,139,0.12) 60%, transparent 100%)',
        }}
      />
      {/* Dark mode road surface */}
      <div
        className="absolute inset-x-0 hidden dark:block"
        style={{
          top: '30%', bottom: '30%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.4) 40%, rgba(15,23,42,0.4) 60%, transparent 100%)',
        }}
      />

      {/* Road edge lines */}
      <div className="absolute inset-x-0 h-px bg-slate-300/40 dark:bg-slate-700/20" style={{ top: '28%' }} />
      <div className="absolute inset-x-0 h-px bg-slate-300/40 dark:bg-slate-700/20" style={{ bottom: '28%' }} />

      {/* Scrolling center line */}
      {isPlaying ? (
        <motion.div
          className="absolute flex gap-10"
          style={{ top: 'calc(50% - 1px)', height: 2 }}
          animate={{ x: [0, -160] }}
          transition={{ duration: scrollDur, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-full w-14 shrink-0 rounded-full bg-slate-400/25 dark:bg-slate-600/25" />
          ))}
        </motion.div>
      ) : (
        <div className="absolute flex gap-10" style={{ top: 'calc(50% - 1px)', height: 2, left: 0, right: 0 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-full w-14 shrink-0 rounded-full bg-slate-300/25 dark:bg-slate-600/15" />
          ))}
        </div>
      )}

      {/* LEAD */}
      <div className="absolute" style={{ left: LEAD_X, top: '50%', transform: 'translateY(-50%)' }}>
        <Car color="#94a3b8" label="LEAD" labelColor="text-slate-500 dark:text-slate-400" />
      </div>

      {/* STD ACC */}
      <motion.div
        className="absolute"
        animate={{ x: stdX }}
        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
        style={{ top: 'calc(50% - 48px)' }}
      >
        <div className="relative">
          {isFrictionStd && (
            <motion.div
              className="absolute inset-0 z-10 rounded-md bg-rose-500/60"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
          <Car color="#f43f5e" label="STD" labelColor="text-rose-500 dark:text-rose-400" />
        </div>
      </motion.div>

      {/* MPC ACC */}
      <motion.div
        className="absolute"
        animate={{
          x: mpcX,
          filter: isRegenMpc
            ? 'drop-shadow(0 0 10px rgba(16,185,129,0.9))'
            : 'drop-shadow(0 0 3px rgba(16,185,129,0.25))',
        }}
        transition={{
          x: { type: 'spring', stiffness: 90, damping: 22 },
          filter: { duration: 0.25 },
        }}
        style={{ top: 'calc(50% + 10px)' }}
      >
        <div className="relative">
          {isRegenMpc && (
            <div className="absolute -right-0.5 -top-5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black text-white dark:text-slate-950">
              REGEN ↑
            </div>
          )}
          <Car color="#10b981" glow={isRegenMpc} label="MPC" labelColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </motion.div>

      {/* Legend */}
      <div className="absolute left-3 top-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="font-mono text-[10px] text-rose-500/80 dark:text-rose-500/60">STD ACC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] text-emerald-600/80 dark:text-emerald-500/60">MPC ACC</span>
        </div>
      </div>

      {/* Speed readout */}
      <div className="absolute right-3 top-3 text-right font-mono">
        <div className="text-[10px] text-slate-500 dark:text-slate-600">
          LEAD {(vLead * 3.6).toFixed(1)} km/h
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-700">
          GAP MPC {gapMpc.toFixed(1)}m · STD {gapStd.toFixed(1)}m
        </div>
      </div>

    </div>
  )
}
