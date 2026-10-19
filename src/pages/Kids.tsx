import { AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { CollectionBrowser } from '../components/CollectionBrowser'
import { LineReveal, Reveal, useReveal } from '../components/ui/Reveal'
import { listings } from '../data/catalog'
import { getColorway, type Colorway } from '../data/products'
import { useFinePointer } from '../lib/hooks'
import { Link } from '../lib/router'

const items = listings.filter((l) => l.model.category === 'kids')
const kidsColorways = items.map((l) => getColorway(l.variant.color))

const tilts = [-8, 5, -4]

/** Headline: letters spring up into place, then hop when the pointer runs over them. */
function BounceHeadline({ lines }: { lines: string[] }) {
  const reduced = useReducedMotion()
  const [ref, shown] = useReveal<HTMLHeadingElement>()
  let n = 0
  return (
    <h1
      ref={ref}
      aria-label={lines.join(' ')}
      className="font-display text-[clamp(4.2rem,14vw,12rem)] font-black uppercase leading-[0.82] [font-stretch:64%]"
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block w-fit whitespace-nowrap">
          {[...line].map((ch, ci) => {
            const i = n++
            return (
              <motion.span
                key={ci}
                className="inline-block will-change-transform"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: '60%', rotate: i % 2 ? 12 : -12 }}
                animate={shown ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                transition={reduced ? { duration: 0.3 } : { type: 'spring', stiffness: 380, damping: 14, delay: 0.05 + i * 0.035 }}
                whileHover={reduced ? undefined : { y: -24, rotate: i % 2 ? 9 : -9, transition: { type: 'spring', stiffness: 520, damping: 8 } }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

const bubbleSeeds = Array.from({ length: 12 }, (_, i) => ({
  left: 3 + ((i * 37) % 94),
  size: 26 + ((i * 53) % 54),
  duration: 11 + ((i * 7) % 9),
  delay: -((i * 2.3) % 14),
}))

/** "Air" bubbles drifting up behind the hero. Hovering or tapping one pops it, and a fresh one rises from the bottom. */
function Bubbles() {
  const reduced = useReducedMotion()
  const [popped, setPopped] = useState<Record<number, number>>({})
  if (reduced) return null
  const pop = (i: number) => setPopped((p) => ({ ...p, [i]: (p[i] ?? 0) + 1 }))
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {bubbleSeeds.map((b, i) => (
        <AnimatePresence key={i} initial={false}>
          <span
            key={popped[i] ?? 0}
            className="kid-bubble absolute bottom-[-100px] block"
            style={{ left: `${b.left}%`, animationDuration: `${b.duration}s`, animationDelay: popped[i] ? '0.4s' : `${b.delay}s` }}
          >
            <motion.span
              onPointerEnter={() => pop(i)}
              onPointerDown={() => pop(i)}
              className="block cursor-pointer rounded-full border border-black/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.3)_45%,rgba(212,245,60,0.3)_100%)] shadow-[inset_0_-6px_12px_rgba(31,85,224,0.14)]"
              style={{ width: b.size, height: b.size }}
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 300, damping: 12 } }}
              exit={{ scale: 1.9, opacity: 0, transition: { duration: 0.22 } }}
            />
          </span>
        </AnimatePresence>
      ))}
    </div>
  )
}

/** Colour tile that tilts in 3D toward the pointer, with the shoe floating on a nearer plane. */
function KidsTile({ p, i, shown }: { p: Colorway; i: number; shown: boolean }) {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 180, damping: 15 })
  const sy = useSpring(py, { stiffness: 180, damping: 15 })
  const rotateY = useTransform(sx, (v) => v * 14)
  const rotateX = useTransform(sy, (v) => v * -12)
  const shoeX = useTransform(sx, (v) => v * 18)
  const shoeY = useTransform(sy, (v) => v * 12)
  const glare = useTransform(
    [sx, sy],
    ([x, y]: number[]) =>
      `radial-gradient(70% 55% at ${50 + x * 30}% ${35 + y * 25}%, rgba(255,255,255,${p.dark ? 0.2 : 0.8}), transparent 70%), ${p.tile}`,
  )

  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    if (!fine || reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.li
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80, rotate: tilts[i] * 2 }}
      animate={shown ? { opacity: 1, y: 0, rotate: tilts[i] } : undefined}
      transition={reduced ? { duration: 0.3 } : { type: 'spring', stiffness: 140, damping: 14, delay: 0.15 + i * 0.12 }}
      whileHover={reduced ? undefined : { rotate: 0, scale: 1.04, zIndex: 2 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      style={{ perspective: 900 }}
    >
      <Link to={`/kids?color=${p.id}`} data-cursor="VIEW" className="group block" aria-label={`Shop big kids’ ${p.colorway}`}>
        <motion.span
          className="relative block aspect-[4/5] overflow-hidden rounded-[22px] sm:rounded-[32px]"
          style={{ rotateX, rotateY, background: glare }}
        >
          <motion.span className="absolute inset-x-[6%] top-[22%] block" style={{ x: shoeX, y: shoeY }}>
            <span className="bob block" style={{ '--r': `${-tilts[i] - 6}deg`, animationDelay: `${i * -1.3}s` } as CSSProperties}>
              <img
                src={p.imageSmall}
                alt=""
                loading="lazy"
                className="w-full object-contain drop-shadow-[0_22px_20px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
              />
            </span>
          </motion.span>
          <span
            className={`absolute inset-x-3 bottom-3 flex items-center justify-between font-display text-sm font-black uppercase [font-stretch:80%] sm:inset-x-5 sm:bottom-5 sm:text-2xl ${p.dark ? 'text-white' : 'text-[#111]'}`}
          >
            {p.colorway.split(' ').pop()}
            <span className="hidden h-9 w-9 place-items-center rounded-full bg-current transition-transform duration-500 group-hover:rotate-45 sm:grid" aria-hidden="true">
              <span className={p.dark ? 'text-[#111]' : 'text-white'}>↗</span>
            </span>
          </span>
        </motion.span>
      </Link>
    </motion.li>
  )
}

const throwStarts = [
  { left: '4%', top: '32%', rotate: -14 },
  { left: '34%', top: '8%', rotate: 8 },
  { left: '62%', top: '40%', rotate: -6 },
]

/** A shoe that can be dragged and thrown around the playground, and flips when tapped. */
function ThrowShoe({ p, i, bounds, resetKey }: { p: Colorway; i: number; bounds: RefObject<HTMLDivElement | null>; resetKey: number }) {
  const reduced = useReducedMotion()
  const controls = useAnimationControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const start = throwStarts[i % throwStarts.length]
  const rotate = useMotionValue(start.rotate)
  const dragged = useRef(false)

  useEffect(() => {
    if (resetKey === 0) return
    controls.start({ x: 0, y: 0, rotate: start.rotate, transition: reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 14 } })
  }, [resetKey, controls, start.rotate, reduced])

  return (
    <motion.button
      type="button"
      drag
      dragConstraints={bounds}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 420, bounceDamping: 12, power: reduced ? 0 : 0.35 }}
      animate={controls}
      onDragStart={() => (dragged.current = true)}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false
          return
        }
        if (reduced) return
        controls.start({
          y: [y.get(), y.get() - 80, y.get()],
          rotate: [start.rotate, start.rotate + 360],
          transition: { duration: 0.8, ease: [0.34, 1.3, 0.64, 1] },
        })
      }}
      whileDrag={{ scale: 1.12, zIndex: 5, cursor: 'grabbing' }}
      whileHover={reduced ? undefined : { scale: 1.05 }}
      aria-label={`${p.colorway}. Drag it around, or press to flip it.`}
      className="absolute w-[38%] max-w-[340px] cursor-grab touch-none select-none rounded-3xl"
      style={{ left: start.left, top: start.top, x, y, rotate }}
    >
      <img src={p.imageSmall} alt="" draggable={false} className="pointer-events-none w-full drop-shadow-[0_30px_24px_rgba(0,0,0,0.3)]" />
    </motion.button>
  )
}

function Playground() {
  const bounds = useRef<HTMLDivElement>(null)
  const [resetKey, setResetKey] = useState(0)
  return (
    <section aria-label="Playground" className="mx-auto max-w-[1600px] px-4 pb-24 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Playground
          </Reveal>
          <LineReveal as="h2" lines={['Kick them', 'around.']} className="font-display text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.85] [font-stretch:66%]" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="max-w-[16rem] text-[14px] leading-relaxed text-[color:var(--muted)]">Grab a pair and throw it. Tap one to make it flip.</p>
          <button
            type="button"
            onClick={() => setResetKey((k) => k + 1)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[color:var(--border)] px-5 text-[13px] font-semibold transition hover:border-[color:var(--fg)] active:scale-95"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Tidy up
          </button>
        </div>
      </div>
      <div
        ref={bounds}
        className="relative mt-10 h-[360px] overflow-hidden rounded-[32px] bg-[radial-gradient(70%_60%_at_50%_40%,#ffffff_0%,#eef2dc_55%,#dfe8f8_100%)] ring-1 ring-black/5 sm:h-[520px]"
      >
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-3 select-none text-center font-display text-[17vw] font-black uppercase leading-none text-black/[0.05] [font-stretch:62%] lg:text-[13rem]"
        >
          Air Max 97
        </p>
        {kidsColorways.map((p, i) => (
          <ThrowShoe key={p.id} p={p} i={i} bounds={bounds} resetKey={resetKey} />
        ))}
      </div>
    </section>
  )
}

export default function Kids() {
  const reduced = useReducedMotion()
  const [tilesRef, tilesShown] = useReveal<HTMLUListElement>()
  return (
    <div className="theme-light bg-[#f6f6f4] text-[color:var(--fg)]">
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pb-24 lg:pt-32">
        {/* Outlined background type drifts slowly for a bit of energy without noise. */}
        <motion.p
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-24 select-none whitespace-nowrap font-display text-[30vw] font-black uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(17,17,17,0.08)] [font-stretch:62%]"
          animate={reduced ? undefined : { x: ['0%', '-20%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
        >
          Play in Air · Play in Air
        </motion.p>
        <Bubbles />

        <div className="pointer-events-none relative mx-auto max-w-[1600px] [&_a]:pointer-events-auto [&_h1]:pointer-events-auto [&_li]:pointer-events-auto">
          <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Air Max · Big kids
          </Reveal>
          <BounceHeadline lines={['Big kids.', 'Big Air.']} />
          <Reveal className="mt-6 max-w-md text-[17px] leading-relaxed text-[color:var(--muted)]" delay={0.2}>
            The Air Max 97, with wave lines nose to tail and Air along the whole sole. Big kids’ sizes 3.5Y to 7Y, in three loud colourways. Go on, pop a bubble.
          </Reveal>

          <ul ref={tilesRef} className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 lg:mt-20">
            {kidsColorways.map((p, i) => (
              <KidsTile key={p.id} p={p} i={i} shown={tilesShown} />
            ))}
          </ul>
        </div>
      </section>

      <Playground />

      <div className="pb-28">
        <CollectionBrowser items={items} />
      </div>
    </div>
  )
}
