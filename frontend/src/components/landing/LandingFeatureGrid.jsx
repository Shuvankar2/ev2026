import { motion } from 'framer-motion'

const features = [
  {
    title: 'EKF State Estimation',
    description: 'An Extended Kalman Filter processes noisy sensor data to estimate true SOC and SOH, isolating the electrochemical boundaries required for safe regenerative braking.',
    icon: '⚡',
  },
  {
    title: 'MPC Constraint Optimization',
    description: 'The MPC solver looks ahead over a 10-second trajectory window, enforcing dynamic battery constraints and preemptively adjusting following distance to maximize regen recovery.',
    icon: '🔋',
  },
  {
    title: 'Side-by-Side Comparison',
    description: 'Run identical drive cycles under both standard PID and battery-constrained MPC. Visualize exactly when standard control triggers friction brakes while MPC glides safely.',
    icon: '🧭',
  },
]

export default function LandingFeatureGrid() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-white/10 pb-4">Where Standard Controllers Fail</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'The Full-Charge Braking Penalty', desc: 'Standard PID controllers lack awareness of battery SOC. When a pack is nearly full, regen is disabled to prevent overvoltage, forcing the vehicle to rely entirely on inefficient friction brakes.' },
            { title: 'Cold Weather Regen Lockout', desc: 'Low temperatures restrict lithium-ion charge acceptance to prevent lithium plating. Traditional cruise control fails to anticipate this, resulting in kinetic energy lost as heat.' },
            { title: 'Unmapped Voltage Sag in Aging Cells', desc: 'Degraded batteries hit premature voltage limits under braking demand. Standard controllers cannot adapt following distance to these shrinking electrochemical boundaries.' },
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass p-8 rounded-tr-[1.5rem] rounded-br-[1.5rem] rounded-l-md border-y border-r border-l-4 border-l-rose-500 border-y-slate-200 border-r-slate-200 bg-white/50 dark:border-y-white/10 dark:border-r-white/10 dark:bg-white/5"
            >
              <h4 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{card.title}</h4>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-white/60">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-white/10 pb-4">How This System Solves It</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[1.75rem] p-8 border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-bold text-teal-600 dark:text-teal-400 leading-tight">{feature.title}</h4>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-white/65">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 mb-24">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-white/10 pb-4">Battery Profiles Tested</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { profile: 'Healthy', cap: '74 kW', effect: 'Full regen headroom — MPC constraint rarely active' },
            { profile: 'Degraded', cap: '56 kW', effect: 'Reduced regen forces earlier gap widening' },
            { profile: 'Cold', cap: '44 kW', effect: 'Severe regen restriction — friction braking most likely' },
          ].map((item, i) => (
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                key={i} 
                className="glass p-6 rounded-[1.5rem] flex items-center gap-5 border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/5"
             >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-900 dark:bg-white/10 text-white border border-slate-700 dark:border-white/10">
                  <span className="text-lg font-bold">{item.cap.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">{item.cap.split(' ')[1]}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.profile}</h4>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 dark:text-white/60">{item.effect}</p>
                </div>
             </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
