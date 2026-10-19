import type { Transition, Variants } from 'framer-motion'

/** Signature ease: fast start, long weighted settle. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const
/** Softer settle used for the hero product so it lands with weight. */
export const easeProduct = [0.22, 1, 0.36, 1] as const
export const easeInQuart = [0.5, 0, 0.75, 0] as const

/** Master timeline (seconds) for the first-load entrance. */
export const timeline = {
  background: 0,
  watermark: 0.15,
  nav: 0.1,
  heading: 0.3,
  shoe: 0.45,
  tagline: 0.75,
  button: 0.9,
  cards: 1.05,
  social: 1.2,
} as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutExpo, delay },
  }),
}

export const lineReveal: Variants = {
  hidden: { y: '105%' },
  show: (delay: number = 0) => ({
    y: '0%',
    transition: { duration: 1.05, ease: easeOutExpo, delay },
  }),
}

export const staggerContainer = (delayChildren: number, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo } },
}

export interface ShoeCustom {
  /** +1 when moving forward through the list, -1 backward. */
  dir: number
  /** True only for the very first page-load reveal. */
  intro: boolean
  /** Smaller travel distances on narrow screens. */
  compact: boolean
  reduced: boolean
}

const switchIn: Transition = {
  x: { duration: 1.0, ease: easeProduct },
  y: { duration: 1.0, ease: easeProduct },
  rotate: { duration: 1.1, ease: easeProduct },
  scale: { duration: 1.0, ease: easeProduct },
  opacity: { duration: 0.45, ease: 'easeOut' },
}

export const shoeVariants: Variants = {
  enter: ({ dir, intro, compact, reduced }: ShoeCustom) => {
    if (reduced) return { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }
    const k = compact ? 0.55 : 1
    if (intro) return { opacity: 0, x: `${34 * k}%`, y: `${10 * k}%`, rotate: 16, scale: 0.78 }
    return { opacity: 0, x: `${dir * 26 * k}%`, y: `${-4 * k}%`, rotate: dir * 12, scale: 0.86 }
  },
  center: ({ intro, reduced }: ShoeCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: reduced
      ? { duration: 0.35 }
      : intro
        ? {
            x: { duration: 1.6, ease: easeProduct, delay: 0.45 },
            y: { duration: 1.6, ease: easeProduct, delay: 0.45 },
            rotate: { duration: 1.75, ease: easeProduct, delay: 0.45 },
            scale: { duration: 1.6, ease: easeProduct, delay: 0.45 },
            opacity: { duration: 0.7, ease: 'easeOut', delay: 0.45 },
          }
        : switchIn,
  }),
  exit: ({ dir, compact, reduced }: ShoeCustom) => {
    if (reduced) return { opacity: 0, transition: { duration: 0.2 } }
    const k = compact ? 0.55 : 1
    return {
      opacity: 0,
      x: `${dir * -22 * k}%`,
      y: `${3 * k}%`,
      rotate: dir * -8,
      scale: 0.9,
      transition: {
        x: { duration: 0.55, ease: easeInQuart },
        y: { duration: 0.55, ease: easeInQuart },
        rotate: { duration: 0.55, ease: easeInQuart },
        scale: { duration: 0.55, ease: easeInQuart },
        opacity: { duration: 0.38, ease: 'easeIn', delay: 0.08 },
      },
    }
  },
}

/* ------------------------------------------------------------------ */
/* Site-wide motion tokens. Every page reads from these so pacing stays */
/* consistent from the hero to the footer.                              */
/* ------------------------------------------------------------------ */

export const duration = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
  reveal: 1.05,
} as const

/** Viewport settings for entrance animations: play once, a little before the element is fully in view. */
export const inView = { once: true, margin: '0px 0px -12% 0px' } as const

export const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutExpo, delay },
  }),
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Image unmask: the frame opens from the bottom edge while the picture settles from a slight zoom. */
export const maskReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: (delay: number = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.2, ease: easeOutExpo, delay },
  }),
}

export const settle: Variants = {
  hidden: { scale: 1.12 },
  show: (delay: number = 0) => ({ scale: 1, transition: { duration: 1.6, ease: easeOutExpo, delay } }),
}

/** Route change: quick fade out, slightly longer settle in. */
export const page: Variants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}
