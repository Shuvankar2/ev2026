import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LiquidSvgFilter from './LiquidSvgFilter'
import ThemeToggle from './ui/ThemeToggle'

function NavPill({ links, location }) {
  const containerRef = useRef(null)
  const tabRefs = useRef({})
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })
  const activeIndex = links.findIndex(l => l.to === location.pathname)

  useLayoutEffect(() => {
    const activeLink = links[activeIndex]
    if (!activeLink || !containerRef.current) return
    const tab = tabRefs.current[activeLink.to]
    if (!tab) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    setPillStyle({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    })
  }, [activeIndex, links])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center p-1.5 rounded-full bg-slate-200/70 dark:bg-[#111614] shadow-inner dark:shadow-none border border-transparent dark:border-white/5"
    >
      <LiquidSvgFilter />
      <div className="absolute inset-0 pointer-events-none p-1.5" style={{ filter: 'url(#liquid-filter)' }}>
        <motion.div
          className="absolute rounded-full bg-emerald-500 dark:bg-emerald-400"
          animate={{ left: pillStyle.left, width: pillStyle.width, top: 6, bottom: 6 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
        />
      </div>
      <div className="relative z-10 flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              ref={el => { tabRefs.current[link.to] = el }}
              className={`relative flex items-center justify-center h-[34px] rounded-full px-4 text-sm font-semibold transition-colors duration-300 ${
                isActive
                  ? 'text-white dark:text-emerald-950'
                  : 'text-slate-600 hover:text-emerald-800 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/scenarios', label: 'Scenario Gallery' },
  { to: '/settings', label: 'Settings' },
]

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 15)
      
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false) // Scrolling down
        } else {
          setIsVisible(true)  // Scrolling up
        }
      } else {
        setIsVisible(true)    // Always show at top
      }
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          !isVisible && !isMobileMenuOpen ? 'md:-translate-y-[100%] md:opacity-0' : 'translate-y-0 opacity-100'
        } ${
          isScrolled || isMobileMenuOpen
            ? 'border-b border-emerald-200 dark:border-white/10 bg-emerald-50/85 dark:bg-[#121212]/85 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-emerald-700 dark:text-emerald-300 font-bold shadow-glow transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'border-emerald-500/30 dark:border-emerald-400/20 bg-emerald-500/10 dark:bg-emerald-400/10' : 'border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/10 dark:bg-emerald-400/5 hover:border-emerald-500/40 hover:bg-emerald-500/20'}`}>
              EV
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            <NavPill links={links} location={location} />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center p-2 text-slate-700 hover:text-emerald-700 dark:text-white/80 dark:hover:text-emerald-300 transition-colors md:hidden focus:outline-none"
            aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drop-down menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[73px] z-30 md:hidden border-b border-emerald-200 dark:border-white/10 bg-emerald-50/95 dark:bg-[#121212]/95 backdrop-blur-2xl shadow-lg">
            <nav className="flex flex-col gap-1 p-4">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                        : 'text-slate-600 hover:bg-emerald-100/50 hover:text-emerald-900 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
                    }`
                  }>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
