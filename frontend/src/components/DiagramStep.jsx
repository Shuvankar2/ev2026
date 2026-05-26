import { motion } from 'framer-motion'

export default function DiagramStep({ title, subtitle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="glass rounded-[1.75rem] p-6 border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5 transition-colors duration-300 shadow-sm dark:shadow-none"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300 transition-colors duration-300">
        0{index + 1}
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{title}</h3>
      <p className="mt-3 leading-7 font-medium text-slate-600 dark:text-white/65 transition-colors duration-300">{subtitle}</p>
    </motion.div>
  )
}
