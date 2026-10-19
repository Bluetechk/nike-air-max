import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'
import { useFinePointer } from '../../lib/hooks'

/**
 * Pulls its child a few pixels toward the pointer and springs back on leave.
 * Reserved for a handful of primary calls to action.
 */
export function Magnetic({ children, strength = 0.28, max = 10, className = '' }: { children: ReactNode; strength?: number; max?: number; className?: string }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const active = fine && !reduced

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!active || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const clamp = (v: number) => Math.max(-max, Math.min(max, v))
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength))
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span className={`inline-block ${className}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}
