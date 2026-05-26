// hooks/useElementWidth.js
// ResizeObserver-based width hook — used by AnimatedEVScene for responsive layout
import { useState, useEffect } from 'react'

export default function useElementWidth(ref) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}
