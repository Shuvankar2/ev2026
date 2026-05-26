// Sky elements — Stars, Moon, Sun, Clouds — react to isDark prop
import { useMemo } from 'react'
import { motion } from 'framer-motion'

// ── Stars ──────────────────────────────────────────────────────────────────────
export function Stars({ visible }) {
  const stars = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      x: (i * 23 + 7) % 85 + 3,
      y: (i * 11 + 3) % 55 + 2,
      size: (i % 3 === 0) ? 2 : 1,
      delay: (i * 0.07) % 1.5,
      twinkle: i % 4 === 0,
    })), [])

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[1]" animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 1.2 }}>
      {stars.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={s.twinkle ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.6 }}
          transition={s.twinkle ? { duration: 2 + s.delay, repeat: Infinity, ease: 'easeInOut' } : {}}
        />
      ))}
    </motion.div>
  )
}

// ── Moon ────────────────────────────────────────────────────────────────────────
export function Moon({ visible }) {
  return (
    <motion.div className="pointer-events-none absolute z-[2]" style={{ right: '15%', width: 48, height: 48 }}
      animate={{ top: visible ? 20 : 220, opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
      <svg viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="22" fill="#fef3c7" opacity="0.08" />
        <circle cx="24" cy="24" r="16" fill="#fef3c7" opacity="0.12" />
        <circle cx="24" cy="24" r="12" fill="#fef9c3" />
        <circle cx="30" cy="20" r="10" fill="#fefce8" opacity="0.5" />
        <circle cx="20" cy="22" r="2" fill="#fde68a" opacity="0.6" />
        <circle cx="26" cy="28" r="1.5" fill="#fde68a" opacity="0.5" />
        <circle cx="18" cy="28" r="1" fill="#fde68a" opacity="0.4" />
      </svg>
    </motion.div>
  )
}

// ── Sun ─────────────────────────────────────────────────────────────────────────
export function Sun({ visible }) {
  return (
    <motion.div className="pointer-events-none absolute z-[2]" style={{ right: '18%', width: 64, height: 64 }}
      animate={{ top: visible ? 12 : 200, opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5, rotate: visible ? 0 : -90 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r="30" fill="#fbbf24" opacity="0.08" />
        <circle cx="32" cy="32" r="24" fill="#fbbf24" opacity="0.12" />
        <circle cx="32" cy="32" r="14" fill="#fbbf24" />
        <circle cx="32" cy="32" r="12" fill="#fcd34d" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.line key={angle}
            x1={32 + 18 * Math.cos(angle * Math.PI / 180)} y1={32 + 18 * Math.sin(angle * Math.PI / 180)}
            x2={32 + 24 * Math.cos(angle * Math.PI / 180)} y2={32 + 24 * Math.sin(angle * Math.PI / 180)}
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: angle * 0.003 }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

// ── Clouds ──────────────────────────────────────────────────────────────────────
export function Clouds({ visible }) {
  const clouds = useMemo(() => [
    { x: 8, y: 15, scale: 1 },
    { x: 35, y: 28, scale: 0.7 },
    { x: 55, y: 10, scale: 0.85 },
  ], [])

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[1]" animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 1.2 }}>
      {clouds.map((c, i) => (
        <motion.div key={i} className="absolute"
          style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `scale(${c.scale})` }}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="80" height="36" viewBox="0 0 80 36">
            <ellipse cx="40" cy="24" rx="36" ry="12" fill="white" opacity="0.7" />
            <ellipse cx="28" cy="18" rx="20" ry="14" fill="white" opacity="0.8" />
            <ellipse cx="52" cy="16" rx="18" ry="12" fill="white" opacity="0.75" />
            <ellipse cx="40" cy="14" rx="14" ry="10" fill="white" opacity="0.85" />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  )
}
