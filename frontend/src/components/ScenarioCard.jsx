const conditionLabel = { 0: 'Healthy', 1: 'Degraded', 2: 'Cold' }

export default function ScenarioCard({ title, description, active, onClick, input }) {
  return (
    <button
      onClick={onClick}
      className={`glass w-full rounded-[1.5rem] p-5 text-left transition duration-300 hover:-translate-y-0.5 shadow-sm dark:shadow-none ${active ? 'border-emerald-400/60 bg-emerald-100 dark:border-emerald-400/40 dark:bg-emerald-400/10' : 'border-slate-200 bg-white/50 hover:border-emerald-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/20'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 font-medium dark:text-white/60 transition-colors duration-300">{description}</p>
        </div>
        {active && <div className="rounded-full border border-emerald-400/40 bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 transition-colors duration-300">Selected</div>}
      </div>
      {input && (
        <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-white/45 transition-colors duration-300">
          SOC {input.soc}% · Speed {input.speed} km/h · Condition {conditionLabel[input.condition] || input.condition}
        </div>
      )}
    </button>
  )
}
