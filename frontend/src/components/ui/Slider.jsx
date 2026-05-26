export default function Slider({ label, value, min, max, valueNum, onChange }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-white/70 transition-colors duration-300">
        <span>{label}</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={valueNum}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600 dark:accent-emerald-400 transition-colors duration-300"
      />
    </div>
  )
}
