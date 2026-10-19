import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { LineReveal, Reveal } from './ui/Reveal'

interface Props {
  kicker: string
  title: string[]
  intro?: ReactNode
  image: { src: string; srcSet: string; alt: string; position?: string }
  tone: 'dark' | 'light' | 'red'
  /** Image on the right (default) or left. */
  flip?: boolean
  children?: ReactNode
  as?: 'h1' | 'h2'
}

const tones = {
  dark: 'theme-dark bg-[#0e0e0f]',
  light: 'theme-light bg-[#ecebe7]',
  red: 'theme-dark bg-[#7a0910]',
}

/**
 * Split editorial banner: oversized type against a cinematic image that drifts with scroll.
 * Collection pages compose it differently so each keeps its own character.
 */
export function CampaignPanel({ kicker, title, intro, image, tone, flip = false, children, as = 'h1' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '16%'])
  // Fade the copy as it drifts so it never reads as clipped by the panel edge.
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], reduced ? [1, 1] : [1, 0])

  return (
    <section ref={ref} className={`${tones[tone]} relative overflow-hidden text-[color:var(--fg)]`}>
      <div className={`mx-auto grid min-h-[min(92svh,980px)] max-w-[1600px] lg:grid-cols-2 ${flip ? '' : ''}`}>
        <motion.div style={{ y: textY, opacity: textOpacity }} className={`relative z-10 flex flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:px-10 lg:pb-16 ${flip ? 'lg:order-2' : ''}`}>
          <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {kicker}
          </Reveal>
          <LineReveal as={as} lines={title} step={0.1} className="font-display text-[clamp(4.4rem,14vw,12.5rem)] font-black uppercase leading-[0.8] tracking-[-0.01em] [font-stretch:64%]" />
          {intro && (
            <Reveal className="mt-6 max-w-md text-[16px] leading-relaxed text-[color:var(--muted)]" delay={0.25}>
              {intro}
            </Reveal>
          )}
          {children}
        </motion.div>
        <div className={`relative h-[62svh] overflow-hidden lg:h-auto ${flip ? 'lg:order-1' : ''}`}>
          <motion.div
            className="absolute inset-0"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <motion.img
              src={image.src}
              srcSet={image.srcSet}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={image.alt}
              fetchPriority="high"
              decoding="async"
              style={{ y }}
              initial={reduced ? false : { scale: 1.18 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className={`h-full w-full object-cover ${image.position ?? 'object-center'}`}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
