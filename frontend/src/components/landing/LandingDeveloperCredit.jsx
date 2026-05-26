import { useState } from 'react'

export default function LandingDeveloperCredit() {
  const [hovered, setHovered] = useState(false)

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-[#0d1117] dark:to-[#080c14] transition-colors duration-500">
      {/* Decorative top border with animated gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 py-12 px-4 flex flex-col items-center gap-6">
        {/* Divider with diamond */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-500/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-emerald-500/60 dark:bg-emerald-400/60" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-emerald-500/40" />
        </div>

        {/* "Developed By" label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 transition-colors duration-300">
          Developed with ❤️ by
        </p>

        {/* Developer Name */}
        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent tracking-tight">
          Sagnik Kumar Nath & Shuvankar Debnath
        </h3>

        

        {/* Bottom copyright line */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400/60 dark:text-slate-600/80">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500/30" />
          <span><a href="https://github.com/Shuvankar2">Shuvankar2 Github</a></span>
        </div>
      </div>
    </footer>
  )
}
