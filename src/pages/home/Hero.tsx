import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Backdrop } from '../../components/Backdrop'
import { ProductSelector } from '../../components/ProductSelector'
import { ShoeStage } from '../../components/ShoeStage'
import { SocialRail } from '../../components/SocialRail'
import { listingHref } from '../../data/catalog'
import { formatPrice, products, type ProductId } from '../../data/products'
import { useFinePointer, useMediaQuery } from '../../lib/hooks'
import { easeOutExpo, fadeUp, lineReveal, timeline, type ShoeCustom } from '../../lib/motion'
import { Link } from '../../lib/router'
import { applyTheme } from '../../lib/theme'

const thumbBg: Record<ProductId, string> = {
  white: 'rgba(17,17,17,0.04)',
  black: 'rgba(255,255,255,0.05)',
  red: 'rgba(40,0,3,0.18)',
}

/** The original campaign hero, kept exactly as first built. It also owns the page theme while it is on screen. */
export function Hero({ index, onIndexChange }: { index: number; onIndexChange: (i: number) => void }) {
  const [dir, setDir] = useState<1 | -1>(1)
  const [userChanged, setUserChanged] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const heroVisible = useInView(heroRef, { amount: 0.4 })

  const reduced = useReducedMotion() ?? false
  const compact = !useMediaQuery('(min-width: 1024px)')
  const finePointer = useFinePointer()

  // Hold the choreographed entrance until the hero render is decoded, so the shoe never pops in mid-animation.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const go = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    const img = new Image()
    img.sizes = '(min-width: 1024px) 60vw, 92vw'
    img.srcset = `${products[0].imageSmall} 900w, ${products[0].image} 1600w`
    img.src = products[0].image
    img.decode().then(go, go)
    const fallback = window.setTimeout(go, 1400)
    return () => window.clearTimeout(fallback)
  }, [])

  const product = products[index]
  const theme = product.theme

  const select = useCallback(
    (next: number) => {
      const target = (next + products.length) % products.length
      if (target === index) return
      // Direction follows the shortest visual path so wrap-around still reads as "next".
      const forward = (target - index + products.length) % products.length === 1
      setDir(forward ? 1 : -1)
      onIndexChange(target)
      setUserChanged(true)
    },
    [index, onIndexChange],
  )
  const step = useCallback((d: 1 | -1) => select(index + d), [index, select])

  // Keyboard: arrow keys move through colourways while the hero is on screen, unless the user is typing.
  useEffect(() => {
    if (!heroVisible) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, select, [role="dialog"], [role="radiogroup"]')) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, heroVisible])

  // Warm the cache so the first switch never shows an empty frame.
  useEffect(() => {
    const t = window.setTimeout(() => {
      products.forEach((p) => {
        const img = new Image()
        img.src = compact ? p.imageSmall : p.image
      })
    }, 1200)
    return () => window.clearTimeout(t)
  }, [compact])

  // Pause ambient motion when the tab is hidden.
  useEffect(() => {
    const onVis = () => document.documentElement.toggleAttribute('data-hidden', document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Keep the browser chrome, page edge and shared navigation in the current environment colour.
  useEffect(() => {
    applyTheme(theme, thumbBg[product.id])
  }, [theme, product.id])


  // Pointer parallax, springs keep it smooth and jitter-free.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })
  const parallax = finePointer && !reduced
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!parallax || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }
  const wmX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })
  useEffect(() => mx.on('change', (v) => wmX.set(v * -14)), [mx, wmX])

  const custom: ShoeCustom = { dir, intro: !userChanged, compact, reduced }
  const productHref = listingHref('air-max-men', product.id)

  return (
    <section
      ref={heroRef}
      aria-label="Nike Air Max campaign"
      className="relative flex min-h-[100svh] flex-col overflow-hidden text-[color:var(--fg)] lg:h-[100svh] lg:min-h-[660px]"
    >
      <Backdrop active={product.id} />
      {ready && (
        <div className="relative flex flex-1 flex-col">
          <>
            {/* Space for the fixed site header, which used to sit in this flow. */}
            <div aria-hidden="true" className="h-16 shrink-0 lg:h-20" />
            {/* Oversized watermark sits behind the product and drifts against the pointer. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[56%] z-0 flex -translate-y-1/2 select-none justify-center lg:inset-x-auto lg:right-[1%] lg:top-[45%]"
            >
              <motion.div
                style={{ x: wmX }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.7, ease: easeOutExpo, delay: timeline.watermark }}
              >
                <span className="watermark block whitespace-nowrap font-display font-black uppercase leading-[0.8] text-[color:var(--watermark)]">
                  Air Max
                </span>
              </motion.div>
            </div>

            <div
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 pb-6 sm:px-6 lg:block lg:px-10 lg:pb-0"
            >
              <div className="relative z-20 pt-3 sm:pt-6 lg:max-w-[44%] lg:pt-[5.5vh]">
                <h1 className="hero-title font-display font-black uppercase leading-[0.86] tracking-[-0.01em]">
                  <span className="block overflow-hidden pb-[0.04em]">
                    <motion.span className="block" variants={lineReveal} initial="hidden" animate="show" custom={timeline.heading}>
                      Nike
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden pb-[0.04em]">
                    <motion.span className="block" variants={lineReveal} initial="hidden" animate="show" custom={timeline.heading + 0.1}>
                      Air Max
                    </motion.span>
                  </span>
                </h1>

                <motion.p
                  className="mt-4 text-[15px] font-medium leading-snug text-[color:var(--muted)] sm:text-base lg:mt-6 lg:text-lg"
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={timeline.tagline}
                >
                  Feel the future.
                  <br />
                  Move with Air.
                </motion.p>

                <motion.div
                  className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-8"
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={timeline.button}
                >
                  <Link
                    to={productHref}
                    className="group inline-flex h-12 items-center gap-3 rounded-full bg-[color:var(--btn-bg)] pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[color:var(--btn-fg)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.98]"
                  >
                    Shop now
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--btn-fg)] text-[color:var(--btn-bg)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-px" strokeWidth={2.2} />
                    </span>
                  </Link>

                  <div className="h-5 overflow-hidden" aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={product.id}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easeOutExpo }}
                        className="flex items-center gap-2 text-[13px] font-medium"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full ring-1 ring-[color:var(--border)]"
                          style={{ background: product.swatch }}
                        />
                        {product.colorway}
                        <span className="text-[color:var(--muted)]">·</span>
                        <span className="tabular-nums">{formatPrice(product.price)}</span>
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <div className="relative z-10 mx-auto my-2 aspect-[16/11] w-full max-w-[640px] flex-1 sm:my-4 lg:absolute lg:right-[4%] lg:top-[3%] lg:m-0 lg:aspect-auto lg:h-[68%] lg:w-[60%] lg:max-w-[1000px]">
                <ShoeStage product={product} custom={custom} mx={mx} my={my} />

                {/* Touch-size arrows on small screens; desktop uses the selector arrows. */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between sm:hidden">
                  <button
                    type="button"
                    aria-label="Previous colorway"
                    onClick={() => step(-1)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] backdrop-blur-md active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next colorway"
                    onClick={() => step(1)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] backdrop-blur-md active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Pagination dots mirror the selection near the product. */}
              <motion.div
                aria-hidden="true"
                className="absolute bottom-[25%] right-[8%] z-20 hidden items-center gap-3 lg:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: timeline.cards + 0.3, duration: 0.8 }}
              >
                <span className="font-display text-sm font-bold tabular-nums">0{index + 1}</span>
                <span className="flex gap-1.5">
                  {products.map((p, i) => (
                    <motion.span
                      key={p.id}
                      className="block h-1.5 rounded-full bg-[color:var(--fg)]"
                      animate={{ width: i === index ? 22 : 6, opacity: i === index ? 1 : 0.3 }}
                      transition={{ duration: 0.5, ease: easeOutExpo }}
                    />
                  ))}
                </span>
                <span className="font-display text-sm font-bold tabular-nums text-[color:var(--muted)]">0{products.length}</span>
              </motion.div>

              <div className="relative z-20 lg:absolute lg:bottom-8 lg:left-10 xl:bottom-10">
                <ProductSelector activeIndex={index} onSelect={select} onStep={step} userChanged={userChanged} />
              </div>
            </div>

            <SocialRail />
          </>
        </div>
      )}


    </section>
  )
}
