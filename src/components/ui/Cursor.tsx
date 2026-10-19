import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../../lib/hooks'

/**
 * Desktop-only label that trails the pointer over elements marked `data-cursor="VIEW"` (or DRAG, EXPLORE).
 * The native cursor stays visible and the label never intercepts clicks.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!fine) return
    let frame = 0
    let last: PointerEvent | null = null
    const update = () => {
      frame = 0
      if (!last) return
      x.set(last.clientX)
      y.set(last.clientY)
      const el = (last.target as Element | null)?.closest?.('[data-cursor]')
      setLabel(el ? el.getAttribute('data-cursor') : null)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      last = e
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [fine, x, y])

  if (!fine) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={reduced ? { x, y } : { x: sx, y: sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="ml-4 mt-4 grid h-[68px] w-[68px] place-items-center rounded-full bg-[#111]/85 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
