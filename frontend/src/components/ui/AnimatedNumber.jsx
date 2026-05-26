// Scroll-triggered animated number component
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedNumber({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    const target = parseFloat(value) || 0
    const dur = 900; const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1)
      setDisplay(+(target * (1 - Math.pow(1 - p, 3))).toFixed(suffix === '%' ? 1 : 0))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value, suffix])
  return <span ref={ref}>{display}{suffix}</span>
}
