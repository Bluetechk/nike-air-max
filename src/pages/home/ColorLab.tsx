import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { Backdrop } from '../../components/Backdrop'
import { ShoeStage } from '../../components/ShoeStage'
import { Magnetic } from '../../components/ui/Magnetic'
import { Price } from '../../components/ui/Price'
import { getListing } from '../../data/catalog'
import { products } from '../../data/products'
import { useFinePointer, useMediaQuery } from '../../lib/hooks'
import { easeOutExpo } from '../../lib/motion'
import { Link } from '../../lib/router'

const environments: Record<string, { label: string; note: string }> = {
  white: { label: 'Studio white', note: 'Bright, diffused daylight. Every stitch in view.' },
  black: { label: 'Charcoal room', note: 'Low light and controlled highlights tracing the silhouette.' },
  red: { label: 'Crimson stage', note: 'Radial heat behind the shoe and soft atmospheric falloff.' },
}

/** Section D: the interactive colour installation. Reuses the hero's stage and backdrop so the shoe behaves the same way. */
export function ColorLab() {
  const [index, setIndex] = useState(2)
  const [dir, setDir] = useState(1)
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion() ?? false
  const compact = !useMediaQuery('(min-width: 1024px)')
  const fine = useFinePointer()
  const product = products[index]
  const listing = getListing('air-max-men', product.id)!
  const env = environments[product.id]
  const t = product.theme

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })
  const bgX = useTransform(mx, (v) => v * -10)
  const bgY = useTransform(my, (v) => v * -8)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const select = (next: number) => {
    const target = (next + products.length) % products.length
    if (target === index) return
    setDir((target - index + products.length) % products.length === 1 ? 1 : -1)
    setIndex(target)
  }

  // Roving radio group: arrows move the selection, as with native radio buttons.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + products.length) % products.length
    select(next)
    ;(e.currentTarget.querySelectorAll('[role="radio"]')[next] as HTMLElement | undefined)?.focus()
  }

  const vars = {
    '--fg': t.fg,
    '--muted': t.muted,
    '--border': t.border,
    '--card': t.card,
    '--card-active': t.cardActive,
    '--btn-bg': t.btnBg,
    '--btn-fg': t.btnFg,
    '--watermark': t.watermark,
  } as CSSProperties

  return (
    <section
      ref={ref}
      aria-label="Colour lab"
      style={vars}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="theme-transition relative isolate flex min-h-[100svh] flex-col overflow-hidden text-[color:var(--fg)]"
    >
      <motion.div className="absolute -inset-6" style={{ x: bgX, y: bgY }} aria-hidden="true">
        <Backdrop active={product.id} />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-24">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Colour lab
            </p>
            <div className="relative mt-4 h-[clamp(3.4rem,11vw,9.5rem)] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.h2
                  key={product.id}
                  custom={dir}
                  initial={reduced ? { opacity: 0 } : { y: '100%' }}
                  animate={reduced ? { opacity: 1 } : { y: '0%' }}
                  exit={reduced ? { opacity: 0 } : { y: '-100%' }}
                  transition={{ duration: 0.7, ease: easeOutExpo }}
                  className="font-display text-[clamp(3.2rem,10.5vw,9rem)] font-black uppercase leading-[0.95] [font-stretch:66%]"
                >
                  {product.colorway}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>
          <p className="hidden max-w-[16rem] pt-1 text-right text-[13px] leading-relaxed text-[color:var(--muted)] md:block">
            Pick a colourway to change the shoe, the light and the room around it.
          </p>
        </div>

        <div className="relative mx-auto my-6 aspect-[16/11] w-full max-w-[min(1040px,calc((100svh-420px)*1.45))] lg:my-2" data-cursor="EXPLORE">
          {seen && <ShoeStage product={product} custom={{ dir, intro: false, compact, reduced }} mx={mx} my={my} />}
        </div>

        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="order-2 lg:order-1"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">{env.label}</p>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed">{env.note}</p>
            </motion.div>
          </AnimatePresence>

          <div role="radiogroup" aria-label="Choose a colourway" onKeyDown={onKey} className="order-1 flex justify-center gap-4 sm:gap-6 lg:order-2">
            {products.map((p, i) => {
              const on = i === index
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className="group flex flex-col items-center gap-3"
                >
                  <span className="relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20">
                    {on && (
                      <motion.span
                        layoutId="lab-ring"
                        className="absolute inset-0 rounded-full border-2 border-[color:var(--fg)]"
                        transition={{ duration: 0.6, ease: easeOutExpo }}
                      />
                    )}
                    <span
                      className="h-11 w-11 rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.25),0_10px_24px_-10px_rgba(0,0,0,0.6)] ring-1 ring-black/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 sm:h-14 sm:w-14"
                      style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), transparent 55%), ${p.swatch}` }}
                    />
                  </span>
                  <span className={`text-[12px] font-semibold uppercase tracking-[0.12em] transition-opacity ${on ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {p.colorway.split(' ')[1] ?? p.colorway}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="order-3 flex items-center justify-between gap-4 lg:justify-end">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Price listing={listing} large />
              </motion.div>
            </AnimatePresence>
            <Magnetic>
              <Link
                to={listing.href}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[color:var(--btn-bg)] pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[color:var(--btn-fg)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
              >
                View product
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--btn-fg)] text-[color:var(--btn-bg)] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
