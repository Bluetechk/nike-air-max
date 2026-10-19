import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { PointerEvent } from 'react'
import { ImageReveal, Reveal, RevealItem, Stagger, useReveal } from '../../components/ui/Reveal'
import { Price } from '../../components/ui/Price'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { getListing } from '../../data/catalog'
import type { ProductId } from '../../data/products'
import { useFinePointer } from '../../lib/hooks'
import { maskReveal } from '../../lib/motion'
import { Link } from '../../lib/router'

const featured: { color: ProductId; blurb: string; layout: string }[] = [
  { color: 'red', blurb: 'Crimson leather, a crisp white swoosh and nothing held back.', layout: 'lg:col-span-7' },
  { color: 'black', blurb: 'Tonal from laces to outsole, with a smoked Air window.', layout: 'lg:col-span-5 lg:mt-40' },
  { color: 'white', blurb: 'Clean white leather and mesh. The studio original.', layout: 'lg:col-span-6 lg:col-start-4 lg:-mt-10' },
]

function FeatureCard({ color, blurb, layout, index }: (typeof featured)[number] & { index: number }) {
  const listing = getListing('air-max-men', color)!
  const { colorway } = listing
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [tileRef, tileShown] = useReveal()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  const shoeX = useTransform(sx, (v) => v * 22)
  const shoeY = useTransform(sy, (v) => v * 14)
  const rotate = useTransform(sx, (v) => -8 + v * 3)
  const lightX = useTransform(sx, (v) => `${50 + v * 12}%`)
  const lightY = useTransform(sy, (v) => `${40 + v * 10}%`)
  const light = useTransform([lightX, lightY], ([x, y]) => `radial-gradient(60% 55% at ${x} ${y}, rgba(255,255,255,${color === 'white' ? 0.8 : 0.16}), transparent 70%)`)

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
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
    <article className={layout}>
      <Link to={listing.href} onPointerMove={onMove} onPointerLeave={reset} data-cursor="VIEW" className="group block" aria-label={`${listing.model.name} ${colorway.colorway}, view product`}>
        <motion.div
          ref={tileRef}
          className="relative aspect-[4/3] overflow-hidden rounded-[28px]"
          style={{ background: colorway.tile }}
          variants={reduced ? undefined : maskReveal}
          initial="hidden"
          animate={tileShown ? 'show' : 'hidden'}
          custom={index * 0.05}
        >
          <motion.div aria-hidden="true" className="absolute inset-0" style={{ background: light }} />
          <span
            aria-hidden="true"
            className={`absolute left-6 top-5 font-display text-[18vw] font-black uppercase leading-none [font-stretch:62%] sm:text-[9rem] ${color === 'white' ? 'text-black/[0.05]' : 'text-white/[0.07]'}`}
          >
            0{index + 1}
          </span>
          <motion.img
            src={colorway.imageSmall}
            srcSet={`${colorway.imageSmall} 900w, ${colorway.image} 1600w`}
            sizes="(min-width: 1024px) 50vw, 92vw"
            alt={colorway.alt}
            loading="lazy"
            decoding="async"
            width={900}
            height={616}
            style={{ x: shoeX, y: shoeY, rotate }}
            className="absolute inset-[10%] m-auto w-[80%] object-contain drop-shadow-[0_36px_36px_rgba(0,0,0,0.35)] transition-[scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </motion.div>
        <Stagger className="mt-5 flex items-start justify-between gap-6 px-1" gap={0.08}>
          <div>
            <RevealItem as="p" className="flex items-center gap-2 text-[13px] text-[color:var(--muted)]">
              <span className="h-3 w-3 rounded-full ring-1 ring-black/15" style={{ background: colorway.swatch }} aria-hidden="true" />
              {colorway.colorway}
            </RevealItem>
            <RevealItem>
              <h3 className="mt-1 font-display text-4xl font-black uppercase leading-none [font-stretch:72%] sm:text-5xl">{listing.model.name}</h3>
            </RevealItem>
            <RevealItem as="p" className="mt-2 max-w-sm text-[15px] leading-relaxed text-[color:var(--muted)]">
              {blurb}
            </RevealItem>
            <RevealItem>
              <Price listing={listing} className="mt-3" />
            </RevealItem>
          </div>
          <RevealItem className="shrink-0">
            <span className="mt-1 flex items-center gap-2 text-[13px] font-semibold">
              <span className="hidden bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] sm:inline">
                View product
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--fg)] text-[color:var(--btn-fg)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </span>
          </RevealItem>
        </Stagger>
      </Link>
    </article>
  )
}

/** Section C: three large product presentations in an editorial grid. */
export function Featured() {
  return (
    <section aria-label="Featured colourways" className="theme-light bg-[#f2f2ef] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading kicker="Featured" lines={['The line-up']} />
          <Reveal className="max-w-sm text-[15px] leading-relaxed text-[color:var(--muted)]" delay={0.2}>
            One silhouette, three moods. Every pair carries the same visible Air window and layered upper.
          </Reveal>
        </div>
        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {featured.map((f, i) => (
            <FeatureCard key={f.color} {...f} index={i} />
          ))}
        </div>
        <div className="mt-20 hidden lg:block">
          <ImageReveal
            src="/campaign/trio-1000.webp"
            srcSet="/campaign/trio-1000.webp 1000w, /campaign/trio-2000.webp 2000w"
            sizes="96vw"
            alt="White, black and red Air Max sneakers on three concrete plinths of rising height"
            className="aspect-[21/9] rounded-[28px]"
          />
        </div>
      </div>
    </section>
  )
}
