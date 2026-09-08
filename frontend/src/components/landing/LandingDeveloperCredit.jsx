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

        {/* Label */}
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-600/90 dark:text-emerald-400/90 transition-colors duration-300">
          Research Initiative
        </p>

        {/* Brand / Project Name */}
        <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent tracking-tight">
          ev2026
        </h3>

        {/* Prominently Highlighted Copyright & Github Badge */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full border border-emerald-500/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_4px_24px_rgba(16,185,129,0.18)] transition-all hover:border-emerald-500 hover:shadow-[0_6px_28px_rgba(16,185,129,0.25)]">
          <span className="text-xs md:text-sm font-black text-slate-800 dark:text-white tracking-wider">
            ©2026
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <a
            href="https://github.com/Shuvankar2"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-all duration-300"
          >
            <svg className="w-4 h-4 fill-current transition-transform group-hover:rotate-6" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="underline decoration-emerald-500/60 underline-offset-2">Shuvankar2 Github</span>
            <span className="text-emerald-500 font-bold transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
