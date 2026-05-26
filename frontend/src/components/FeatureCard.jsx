export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="glass rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 border-slate-200 bg-white/50 hover:border-emerald-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/20 shadow-sm dark:shadow-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 transition-colors duration-300">{icon}</div>
      <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-white/65 font-medium transition-colors duration-300">{description}</p>
    </div>
  )
}
