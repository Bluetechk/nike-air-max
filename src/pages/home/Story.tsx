import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { LineReveal, Reveal, RevealItem, Stagger } from '../../components/ui/Reveal'

const details = [
  { n: '01', title: 'Visible Air', body: 'The cushioning unit sits on show in a window at the heel.' },
  { n: '02', title: 'Layered upper', body: 'Leather overlays frame breathable mesh panels.' },
  { n: '03', title: 'Waffle-inspired tread', body: 'A rubber outsole pattern that reads from every angle.' },
]

/** Section B: the editorial "Built to move" story that takes over from the hero. */
export function Story({ fromColor }: { fromColor: string }) {
  const ref = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // The page colour slides from the hero environment into charcoal as the story arrives.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] })
  const bg = useTransform(enter, [0, 1], [fromColor, '#0e0e0f'])

  // The macro shot opens from a rounded window to full bleed as it travels up the screen.
  const { scrollYProgress: img } = useScroll({ target: imageRef, offset: ['start end', 'center center'] })
  const clip = useTransform(img, [0, 1], reduced ? ['inset(0% 0% 0% 0% round 0px)', 'inset(0% 0% 0% 0% round 0px)'] : ['inset(18% 22% 18% 22% round 40px)', 'inset(0% 0% 0% 0% round 28px)'])
  const imgScale = useTransform(img, [0, 1], reduced ? [1, 1] : [1.25, 1])
  const watermarkX = useTransform(enter, [0, 1], reduced ? ['0%', '0%'] : ['12%', '-4%'])

  return (
    <motion.section id="story" ref={ref} aria-label="The Air Max story" className="theme-dark relative overflow-hidden text-[color:var(--fg)]" style={{ backgroundColor: bg }}>
      <motion.p
        aria-hidden="true"
        style={{ x: watermarkX }}
        className="pointer-events-none absolute -top-[2vw] left-0 select-none whitespace-nowrap font-display text-[28vw] font-black uppercase leading-none text-white/[0.035] [font-stretch:62%]"
      >
        Air · Air · Air
      </motion.p>

      <div className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pb-36 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal as="p" className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              The Air Max story
            </Reveal>
            <LineReveal
              lines={['Built', 'to move.']}
              step={0.14}
              className="font-display text-[clamp(4.2rem,16vw,15rem)] font-black uppercase leading-[0.8] tracking-[-0.015em] [font-stretch:66%]"
            />
          </div>
          <Stagger className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9 lg:pb-6" gap={0.12} delay={0.3}>
            <RevealItem as="p" className="text-[22px] font-medium leading-snug sm:text-[26px]">
              Distinctive design. Visible Air. A new perspective on everyday movement.
            </RevealItem>
            <RevealItem as="p" className="text-[15px] leading-relaxed text-[color:var(--muted)]">
              A shape you can pick out from across the street, with the cushioning left in plain sight. Built in three tonal colourways for everyday wear.
            </RevealItem>
          </Stagger>
        </div>

        <div ref={imageRef} className="mt-16 lg:mt-24">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]"
            style={{ clipPath: clip, WebkitClipPath: clip }}
            data-cursor="EXPLORE"
          >
            <motion.img
              src="/campaign/detail-1000.webp"
              srcSet="/campaign/detail-1000.webp 1000w, /campaign/detail-2000.webp 2000w"
              sizes="(min-width: 1600px) 1520px, 96vw"
              alt="Close-up of the heel of a white Air Max showing the visible Air window, leather overlays and mesh"
              loading="lazy"
              decoding="async"
              width={2000}
              height={1131}
              style={{ scale: imgScale }}
              className="h-full w-full object-cover object-[60%_center]"
            />
          </motion.div>
        </div>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--border)] sm:grid-cols-3 lg:mt-20" gap={0.14}>
          {details.map((d) => (
            <RevealItem key={d.n} as="article" className="bg-[#0e0e0f] p-6 lg:p-8">
              <p className="font-display text-sm font-bold tabular-nums text-[color:var(--muted)]">{d.n}</p>
              <h3 className="mt-6 font-display text-3xl font-black uppercase leading-none [font-stretch:75%] lg:text-4xl">{d.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--muted)]">{d.body}</p>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </motion.section>
  )
}
