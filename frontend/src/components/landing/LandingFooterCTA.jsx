import { Link } from 'react-router-dom'

export default function LandingFooterCTA() {
  return (
      <section className="w-full bg-slate-100 border-t border-slate-200 py-24 text-center px-4 dark:bg-slate-900 dark:border-emerald-900/50 transition-colors duration-300">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-10 max-w-3xl mx-auto leading-tight dark:text-white transition-colors duration-300">
          See how battery physics changes every braking decision.
        </h2>
        <Link to="/simulator" className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/15 px-10 py-4 font-extrabold tracking-wide text-emerald-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500/25 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/40 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          Launch Simulator
        </Link>
      </section>
  )
}
