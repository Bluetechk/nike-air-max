import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { inView, lineReveal, maskReveal, rise, settle, stagger } from '../../lib/motion'

/**
 * Reusable entrance primitives. Every scroll-triggered entrance on the site goes through
 * these, so timing, easing and reduced-motion handling stay in one place.
 */

/**
 * True once the element has entered the viewport, or has already been scrolled past.
 * The second check matters: a fast jump (End key, anchor link, full-page capture) can skip
 * an element without it ever intersecting, and it must not stay hidden as a blank gap.
 */
export function useReveal<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const seen = useInView(ref, inView)
  const [passed, setPassed] = useState(false)
  useEffect(() => {
    if (seen || passed) return
    const check = () => {
      const el = ref.current
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) setPassed(true)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [seen, passed])
  return [ref, seen || passed] as const
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span' | 'header' | 'article'
}

/** Fade and rise once when the element scrolls into view. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  const [ref, shown] = useReveal()
  return (
    <Comp ref={ref} className={className} variants={rise} initial="hidden" animate={shown ? 'show' : 'hidden'} custom={delay}>
      {children}
    </Comp>
  )
}

/** Parent that staggers any `RevealItem` children. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = 'div',
}: RevealProps & { gap?: number }) {
  const Comp = motion[as] as typeof motion.div
  const [ref, shown] = useReveal()
  return (
    <Comp ref={ref} className={className} variants={stagger(gap, delay)} initial="hidden" animate={shown ? 'show' : 'hidden'}>
      {children}
    </Comp>
  )
}

export function RevealItem({ children, className, as = 'div' }: Omit<RevealProps, 'delay'>) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp className={className} variants={rise}>
      {children}
    </Comp>
  )
}

/**
 * Headline that reveals line by line from behind a mask. Screen readers get the full
 * sentence once via aria-label; the animated spans are hidden from them.
 */
export function LineReveal({
  lines,
  className,
  lineClassName = '',
  delay = 0,
  step = 0.1,
  as: Tag = 'h2',
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  step?: number
  as?: ElementType
}) {
  const label = lines.map((l) => (typeof l === 'string' ? l : '')).join(' ')
  const [ref, shown] = useReveal<HTMLElement>()
  return (
    <Tag ref={ref} className={className} aria-label={label || undefined}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden={label ? true : undefined} className={`block overflow-hidden pb-[0.06em] ${lineClassName}`}>
          <motion.span
            className="block"
            variants={lineReveal}
            initial="hidden"
            animate={shown ? 'show' : 'hidden'}
            custom={delay + i * step}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Image that unmasks upward while settling from a slight zoom. Falls back to a fade with reduced motion. */
export function ImageReveal({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  imgClassName = '',
  delay = 0,
  width,
  height,
  priority = false,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  imgClassName?: string
  delay?: number
  width?: number
  height?: number
  priority?: boolean
}) {
  const reduced = useReducedMotion()
  const [ref, shown] = useReveal()
  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${imgClassName}`}
    />
  )
  if (reduced) {
    return (
      <motion.div ref={ref} className={`overflow-hidden ${className}`} initial={{ opacity: 0 }} animate={{ opacity: shown ? 1 : 0 }}>
        {img}
      </motion.div>
    )
  }
  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`} variants={maskReveal} initial="hidden" animate={shown ? 'show' : 'hidden'} custom={delay}>
      <motion.div className="h-full w-full" variants={settle} custom={delay}>
        {img}
      </motion.div>
    </motion.div>
  )
}

/** Scroll-linked drift for decorative layers. `amount` is in pixels across the element's pass through the viewport. */
export function useParallax(amount = 80) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [amount, -amount])
  return { ref, y, progress: scrollYProgress }
}

export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const { ref, y } = useParallax(amount)
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

export type { MotionValue }
