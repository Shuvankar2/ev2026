import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedEV from '../AnimatedEV'

export default function LandingHero() {
  return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-14 md:px-8 md:py-20 relative overflow-hidden">
        {/* subtle bg grain */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(16,185,129,0.08),transparent)]" />
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="w-full max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl sm:rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold tracking-[0.08em] sm:tracking-[0.14em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300 transition-colors duration-300 leading-normal max-w-full"
            >
              UNDERGRADUATE RESEARCH · IEM KOLKATA · ELECTRICAL ENGINEERING · 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-4 sm:mt-6 max-w-2xl text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight sm:leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300 break-words"
            >
              Battery-Constrained Model Predictive Adaptive Cruise Control for Electric Vehicles
              <span className="block mt-2 sm:mt-3 text-base sm:text-xl font-semibold text-slate-500 dark:text-white/50">
                using Kalman Filter State Estimation
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed sm:leading-8 font-medium text-slate-600 dark:text-white/65 transition-colors duration-300"
            >
              Standard cruise control wastes battery capacity by applying friction brakes at the wrong moments. This interactive digital twin visualizes exactly how predictive control fixes that.
            </motion.p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link to="/simulator" className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-6 py-3 text-center text-sm sm:text-base font-bold text-emerald-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20">
                Launch Simulator
              </Link>
              <Link to="/scenarios" className="rounded-full border border-slate-300/50 bg-white/40 px-6 py-3 text-center text-sm sm:text-base font-bold text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                View Scenario Gallery
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-end w-full overflow-hidden">
            <div className="w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[520px]">
              <AnimatedEV />
            </div>
          </div>
        </div>
      </section>
  )
}
