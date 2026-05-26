import { motion } from 'framer-motion'

export default function AnimatedEV() {
  return (
    <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <svg viewBox="0 0 760 460" className="w-full drop-shadow-[0_0_35px_rgba(16,185,129,0.12)]">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f1f1f" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </linearGradient>
            <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="75" y="165" width="610" height="150" rx="54" fill="url(#bodyGrad)" stroke="rgba(255,255,255,0.10)" />
          <path d="M145 165 Q220 95 330 95 H460 Q558 95 615 165" fill="none" stroke="url(#cyanLine)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="190" cy="320" r="52" fill="#161616" stroke="rgba(16,185,129,0.28)" strokeWidth="8" />
          <circle cx="570" cy="320" r="52" fill="#161616" stroke="rgba(16,185,129,0.28)" strokeWidth="8" />
          <circle cx="190" cy="320" r="18" fill="#10B981" opacity="0.9" />
          <circle cx="570" cy="320" r="18" fill="#10B981" opacity="0.9" />
          <rect x="292" y="126" width="176" height="63" rx="20" fill="#111" stroke="rgba(16,185,129,0.32)" />
          <path d="M327 157 h28 l10 -16 l10 32 l10 -16 h28" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M119 258 H250" stroke="#fff" strokeOpacity="0.38" strokeWidth="7" strokeLinecap="round" />
          <path d="M510 258 H641" stroke="#fff" strokeOpacity="0.38" strokeWidth="7" strokeLinecap="round" />
          <motion.path
            d="M228 112 C270 70, 335 55, 380 55 C430 55, 486 72, 534 118"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 10"
            animate={{ pathLength: [0.2, 1, 0.2] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle cx="380" cy="55" r="7" fill="#10B981" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </svg>
      </motion.div>
    </div>
  )
}
