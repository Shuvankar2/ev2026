// Roadside trees — color adapts to day/night
import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function SceneTrees({ isDark }) {
  const trees = useMemo(() => [
    { x: 3, h: 55, w: 18 },  { x: 12, h: 45, w: 15 },
    { x: 22, h: 60, w: 20 }, { x: 42, h: 50, w: 16 },
    { x: 58, h: 58, w: 19 }, { x: 72, h: 42, w: 14 },
    { x: 82, h: 52, w: 17 }, { x: 92, h: 46, w: 15 },
  ], [])

  return (
    <div className="pointer-events-none absolute bottom-[100px] left-0 right-0 z-[3]" style={{ height: 80 }}>
      {trees.map((t, i) => (
        <motion.div key={i} className="absolute bottom-0" style={{ left: `${t.x}%` }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}>
          <svg width={t.w + 4} height={t.h + 10} viewBox={`0 0 ${t.w + 4} ${t.h + 10}`}>
            <rect x={t.w / 2} y={t.h - 10} width={4} height={20} rx={1} fill={isDark ? '#1e3a2a' : '#8B6914'} />
            <motion.ellipse cx={t.w / 2 + 2} cy={t.h - 20} rx={t.w / 2} ry={t.h * 0.35}
              fill={isDark ? '#0d3320' : '#22c55e'} opacity={isDark ? 0.7 : 0.85}
              animate={{ ry: [t.h * 0.35, t.h * 0.37, t.h * 0.35] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }} />
            <ellipse cx={t.w / 2 + 2} cy={t.h - 25} rx={t.w * 0.35} ry={t.h * 0.25}
              fill={isDark ? '#145230' : '#4ade80'} opacity={isDark ? 0.5 : 0.7} />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
