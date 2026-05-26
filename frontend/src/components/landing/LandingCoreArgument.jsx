import { motion } from 'framer-motion'

export default function LandingCoreArgument() {
  return (
      <section className="mx-auto max-w-5xl px-4 py-24 md:py-40 text-center md:px-8">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Standard PID ACC has no knowledge of battery state. <br className="hidden md:block"/>
            <span className="text-emerald-600 dark:text-emerald-400">MPC does.</span>
          </h2>
          <p className="mt-8 text-xl md:text-2xl font-medium text-slate-600 dark:text-white/70">
            The difference in energy efficiency is measurable — <br className="hidden md:block"/>and this tool measures it.
          </p>
          <p className="mt-8 text-xl md:text-2xl font-medium text-slate-600 dark:text-white/70">
            “PID ACC (Proportional–Integral–Derivative Adaptive Cruise Control) reacts to speed error without considering battery state, whereas Model Predictive Control (MPC) predicts future conditions and optimizes control actions for improved energy efficiency.”
          </p>
        </motion.div>
      </section>
  )
}
