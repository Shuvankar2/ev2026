import { useRef, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable liquid pill selector — same gooey physics as the navbar.
 * Supports light and dark themes.
 */
export default function LiquidPillSelector({
  items,
  activeKey,
  onChange,
  disabled = false,
  size = 'sm',
  filterId = 'liquid-pill',
}) {
  const containerRef = useRef(null)
  const tabRefs = useRef({})
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const tab = tabRefs.current[activeKey]
    if (!tab) return
    const cRect = containerRef.current.getBoundingClientRect()
    const tRect = tab.getBoundingClientRect()
    setPillStyle({
      left: tRect.left - cRect.left,
      width: tRect.width,
    })
  }, [activeKey, items])

  const pad = size === 'sm' ? 4 : 5

  return (
    <div
      ref={containerRef}
      className="relative flex items-center rounded-full border border-slate-300/60 bg-slate-200/70 p-1 dark:border-slate-700/40 dark:bg-slate-800/50 transition-colors duration-300"
    >
      {/* Liquid SVG filter — unique ID per instance */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Gooey pill background layer */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full overflow-hidden"
        style={{ filter: `url(#${filterId})` }}
      >
        <motion.div
          className="absolute rounded-full bg-emerald-500 dark:bg-emerald-400"
          animate={{
            left: pillStyle.left,
            width: pillStyle.width,
            top: pad,
            bottom: pad,
          }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
        />
      </div>

      {/* Clickable buttons — flex-1 for equal distribution */}
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            ref={(el) => { tabRefs.current[item.key] = el }}
            onClick={() => !disabled && onChange(item.key)}
            disabled={disabled}
            className={`relative z-10 flex-1 rounded-full text-center font-semibold transition-colors duration-200 ${
              size === 'sm'
                ? 'px-3.5 py-1.5 text-[11px]'
                : 'px-5 py-1.5 text-xs'
            } ${
              isActive
                ? 'text-white dark:text-emerald-950'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
