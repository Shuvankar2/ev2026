// Aerodynamic car SVG with brake/regen indicators
export default function SceneCar({ accent, brakeLights, regenActive, label, isDark }) {
  return (
    <div className="relative" style={{ width: 120, height: 48 }}>
      <div className="absolute -top-6 left-0 right-0 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          {label}
        </span>
      </div>
      <svg viewBox="0 0 120 48" width="120" height="48" className="overflow-visible" aria-hidden="true">
        <ellipse cx="60" cy="44" rx="45" ry="4" fill="black" opacity="0.3" />
        <path d="M 10,28 C 10,22 18,16 28,15 L 45,10 C 55,5 75,5 90,10 L 110,18 C 116,20 118,24 118,30 L 118,36 C 118,38 116,40 114,40 L 12,40 C 10,40 8,38 8,36 Z"
          fill={accent} opacity="0.9" />
        <path d="M 30,16 C 45,12 70,12 85,16 L 70,20 L 35,20 Z" fill={isDark ? '#0f172a' : '#1e293b'} opacity="0.8" />
        <circle cx="28" cy="38" r="9" fill={isDark ? '#0f172a' : '#1e293b'} stroke="#334155" strokeWidth="2.5" />
        <circle cx="92" cy="38" r="9" fill={isDark ? '#0f172a' : '#1e293b'} stroke="#334155" strokeWidth="2.5" />
        <circle cx="28" cy="38" r="3" fill="#94a3b8" />
        <circle cx="92" cy="38" r="3" fill="#94a3b8" />
        <rect x="6" y="24" width="6" height="5" rx="1.5"
          fill={regenActive ? '#34d399' : brakeLights ? '#ef4444' : '#1e293b'}
          opacity={regenActive || brakeLights ? 1 : 0.4} />
        <path d="M 112,24 L 118,24 L 118,28 L 112,27 Z" fill="#fef3c7" opacity="0.9" />
        {regenActive && (
          <text x="60" y="32" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">↺</text>
        )}
      </svg>
    </div>
  )
}
