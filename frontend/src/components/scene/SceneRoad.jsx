// Road surface with animated lane dashes
import { motion } from 'framer-motion'

function AnimatedLaneDashes({ isDark }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div className="absolute top-1/2 flex -translate-y-1/2 gap-8"
        animate={{ x: [0, -96] }}
        transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-0.5 w-12 shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)' }} />
        ))}
      </motion.div>
    </div>
  )
}

export default function SceneRoad({ isDark }) {
  const roadGradient = isDark
    ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
    : 'linear-gradient(180deg, #475569 0%, #334155 100%)'
  const roadEdgeTop = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)'
  const roadEdgeBot = isDark ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.35)'

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[4]" style={{ height: 110 }}>
      <motion.div className="absolute inset-0 rounded-b-[2rem]" animate={{ background: roadGradient }} transition={{ duration: 1 }} />
      <motion.div className="absolute left-0 right-0 top-0 h-px" animate={{ background: roadEdgeTop }} transition={{ duration: 1 }} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-px" animate={{ background: roadEdgeBot }} transition={{ duration: 1 }} />
      <AnimatedLaneDashes isDark={isDark} />
    </div>
  )
}
