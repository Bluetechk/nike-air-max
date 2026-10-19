import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, Eye } from 'lucide-react'
import type { PointerEvent } from 'react'
import { CollectionBrowser } from '../components/CollectionBrowser'
import { tileBackground } from '../components/ProductCard'
import { Magnetic } from '../components/ui/Magnetic'
import { LineReveal, Reveal, useReveal } from '../components/ui/Reveal'
import { categoryLabel, listings, onSale, percentOff, type Listing } from '../data/catalog'
import { formatPrice } from '../data/products'
import { easeOutExpo } from '../lib/motion'
import { useFinePointer } from '../lib/hooks'
import { Link } from '../lib/router'
import { useShop } from '../state/shop'

const items = listings.filter(onSale)
const bestOff = Math.max(...items.map(percentOff))

/** Circular label that spins slowly; purely decorative, the same text is in the intro. */
function SpinBadge() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      className="relative grid h-32 w-32 place-items-center sm:h-40 sm:w-40"
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
      whileHover={reduced ? undefined : { scale: 1.08 }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="sale-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-white text-[19px] font-semibold uppercase tracking-[0.32em]">
          <textPath href="#sale-ring">Sample markdowns · Up to {bestOff}% off ·</textPath>
        </text>
      </svg>
      <span className="font-display text-4xl font-black text-white [font-stretch:70%] sm:text-5xl">-{bestOff}%</span>
    </motion.div>
  )
}

/** A sale shoe floating in the hero, drifting with the pointer at its own depth. */
function FloatingShoe({ listing, depth, mx, my, className, rotate, delay }: { listing: Listing; depth: number; mx: MotionValue<number>; my: MotionValue<number>; className: string; rotate: number; delay: number }) {
  const reduced = useReducedMotion()
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth * 0.7)
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80, rotate: rotate + 18 }}
        animate={{ opacity: 1, y: 0, rotate }}
        transition={{ duration: 1.3, ease: easeOutExpo, delay }}
      >
        <Link to={listing.href} data-cursor="VIEW" aria-label={`${listing.model.name} ${listing.colorway.colorway}, on sale`} className="group block">
          <img
            src={listing.colorway.imageSmall}
            alt=""
            className="w-full object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
          />
          <span className="absolute right-[8%] top-[6%] rotate-[8deg] rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-[#a10f17] shadow-lg transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110">
            -{percentOff(listing)}%
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function SaleHero() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 16 })
  const my = useSpring(rawY, { stiffness: 60, damping: 16 })
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const spots = ['left-[2%] top-[4%] w-[78%]', 'right-0 bottom-[2%] w-[72%]']
  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={() => {
        rawX.set(0)
        rawY.set(0)
      }}
      className="theme-dark relative overflow-hidden bg-[radial-gradient(90%_80%_at_75%_40%,#c0141d_0%,#6d060c_45%,#2a0204_100%)] text-white"
    >
      <motion.p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[4vw] left-0 select-none whitespace-nowrap font-display text-[34vw] font-black uppercase leading-none text-white/[0.05] [font-stretch:62%]"
        animate={reduced ? undefined : { x: ['0%', '-12%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
      >
        Sale · Sale
      </motion.p>

      <div className="relative mx-auto grid min-h-[min(88svh,900px)] max-w-[1600px] items-end gap-10 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10 lg:pb-16">
        <div className="lg:col-span-6">
          <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Sale · Sample markdowns
          </Reveal>
          <LineReveal as="h1" lines={['Sale']} className="font-display text-[clamp(6rem,24vw,20rem)] font-black uppercase leading-[0.8] [font-stretch:62%]" />
          <Reveal className="mt-6 max-w-md text-[17px] leading-relaxed text-white/80" delay={0.2}>
            Up to {bestOff}% off selected Air Max colourways. Only pairs with a previous price set in the sample data appear here, and every price is a demo value.
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap items-center gap-6" delay={0.3}>
            <Magnetic>
              <a
                href="#sale-picks"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-7 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#a10f17] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]"
              >
                See the deals
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#a10f17] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </Magnetic>
            <SpinBadge />
          </Reveal>
        </div>
        <div className="relative aspect-[5/4] w-full lg:col-span-6">
          {items.slice(0, 2).map((l, i) => (
            <FloatingShoe key={l.id} listing={l} depth={i ? -26 : 18} mx={mx} my={my} className={spots[i]} rotate={i ? 6 : -10} delay={0.25 + i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Endless strip of the current markdowns. Duplicated once so the loop is seamless. */
function Ticker() {
  const words = items.flatMap((l) => [`${percentOff(l)}% off ${l.colorway.colorway}`, `${l.model.name}`])
  const row = [...words, 'Sample prices for this demo']
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-black/10 bg-[#111] py-4 text-white">
      <div className="ticker flex w-max gap-10 whitespace-nowrap font-display text-2xl font-black uppercase [font-stretch:72%] sm:text-3xl">
        {[0, 1].map((k) => (
          <span key={k} className="flex gap-10">
            {row.concat(row).map((w, i) => (
              <span key={i} className="flex items-center gap-10">
                {w}
                <span className="text-[#e5242c]">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/** One large markdown card: pointer-tilted product, old and new price, and an animated savings bar. */
function SpotlightCard({ listing, index }: { listing: Listing; index: number }) {
  const { openQuickView } = useShop()
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [ref, shown] = useReveal<HTMLElement>()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 16 })
  const sy = useSpring(py, { stiffness: 140, damping: 16 })
  const rotateY = useTransform(sx, (v) => v * 10)
  const rotateX = useTransform(sy, (v) => v * -8)
  const shoeX = useTransform(sx, (v) => v * 24)
  const { colorway, variant, model } = listing
  const saved = (variant.compareAt ?? variant.price) - variant.price
  const flip = index % 2 === 1

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: easeOutExpo }}
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={() => {
          px.set(0)
          py.set(0)
        }}
        style={{ rotateX, rotateY, transformPerspective: 1000, background: tileBackground(colorway.tile, colorway.dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.75)') }}
        data-cursor="VIEW"
        className={`relative aspect-[4/3] overflow-hidden rounded-[32px] lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
      >
        <span aria-hidden="true" className={`absolute left-6 top-4 font-display text-[9rem] font-black leading-none [font-stretch:62%] ${colorway.dark ? 'text-white/10' : 'text-black/[0.06]'}`}>
          -{percentOff(listing)}%
        </span>
        <motion.img
          src={colorway.imageSmall}
          srcSet={`${colorway.imageSmall} 900w, ${colorway.image} 1600w`}
          sizes="(min-width: 1024px) 55vw, 92vw"
          alt={colorway.alt}
          loading="lazy"
          style={{ x: shoeX }}
          className="absolute inset-[8%] m-auto w-[84%] -rotate-[8deg] object-contain drop-shadow-[0_36px_36px_rgba(0,0,0,0.35)]"
        />
      </motion.div>

      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {categoryLabel[model.category]} · {model.label}
        </p>
        <h3 className="mt-3 font-display text-[clamp(2.8rem,6vw,5rem)] font-black uppercase leading-[0.9] [font-stretch:68%]">{model.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-[15px]">
          <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: colorway.swatch }} aria-hidden="true" />
          {colorway.colorway}
        </p>
        <p className="mt-6 flex items-baseline gap-3 tabular-nums">
          <span className="text-4xl font-semibold">
            <span className="sr-only">Sale price </span>
            {formatPrice(variant.price)}
          </span>
          <s className="text-lg text-[color:var(--muted)]">
            <span className="sr-only">Previous price </span>
            {formatPrice(variant.compareAt!)}
          </s>
        </p>
        <div className="mt-4 max-w-sm">
          <div className="flex justify-between text-[13px] font-semibold">
            <span className="text-[#c3121c]">You save {formatPrice(saved)}</span>
            <span className="text-[color:var(--muted)]">{percentOff(listing)}% off</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.07]" aria-hidden="true">
            <motion.div
              className="h-full rounded-full bg-[#c3121c]"
              initial={{ width: '0%' }}
              animate={shown ? { width: `${percentOff(listing)}%` } : undefined}
              transition={{ duration: 1.4, ease: easeOutExpo, delay: 0.3 }}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <Link
              to={listing.href}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#111] pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              Shop this pair
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#111] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Magnetic>
          <button
            type="button"
            onClick={() => openQuickView(listing)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[color:var(--border)] px-5 text-[13px] font-semibold transition hover:border-[color:var(--fg)]"
          >
            <Eye className="h-4 w-4" /> Quick view
          </button>
        </div>
        <p className="mt-4 text-[12px] text-[color:var(--muted)]">Sample markdown for this demo store.</p>
      </div>
    </motion.article>
  )
}

export default function Sale() {
  // The deal cards always show every markdown. Only the grid below reacts to the filters, so clicking a
  // filter never changes the height of the page above it and the buttons stay where they were.
  return (
    <>
      <SaleHero />
      <Ticker />
      <div className="theme-light bg-[#f6f6f4] text-[color:var(--fg)]">
        <section id="sale-picks" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <Reveal as="p" className="mb-12 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] lg:mb-16">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            The markdowns
          </Reveal>
          <div className="space-y-20 lg:space-y-28">
            {items.map((l, i) => (
              <SpotlightCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        </section>
        <div className="border-t border-[color:var(--border)] pb-28 pt-14">
          <CollectionBrowser items={items} categoryFilter emptyHint="Nothing on sale matches those filters." />
        </div>
      </div>
    </>
  )
}
