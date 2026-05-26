import NavBar from './NavBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 dark:bg-[#121212] dark:text-white transition-colors duration-500">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-0 dark:opacity-20" />
        <div className="absolute inset-0 opacity-30 dark:opacity-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute left-[-8rem] top-12 h-96 w-96 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-3xl animate-pulseLine" />
        <div className="absolute right-[-8rem] top-40 h-96 w-96 rounded-full bg-teal-500/20 dark:bg-teal-500/10 blur-3xl animate-pulseLine delay-700" />
        <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />
      </div>
      <NavBar />
      <main>{children}</main>
    </div>
  )
}
