import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { ImageReveal, LineReveal, Reveal, RevealItem, Stagger, useReveal } from '../components/ui/Reveal'
import { Magnetic } from '../components/ui/Magnetic'
import { collections } from '../data/catalog'
import { getColorway } from '../data/products'
import { rise } from '../lib/motion'
import { Link } from '../lib/router'

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.04, 1.16])
  return (
    <section ref={ref} className="theme-dark relative h-[100svh] min-h-[620px] overflow-hidden bg-[#3a3835] text-white">
      <motion.img
        src="/campaign/trio-1000.webp"
        srcSet="/campaign/trio-1000.webp 1000w, /campaign/trio-2000.webp 2000w"
        sizes="100vw"
        alt="White, black and red Air Max on concrete plinths of rising height"
        fetchPriority="high"
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" aria-hidden="true" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          Collections · Season concept
        </Reveal>
        <LineReveal as="h1" lines={['One shape.', 'Three stories.']} className="font-display text-[clamp(3.8rem,12vw,11.5rem)] font-black uppercase leading-[0.82] [font-stretch:64%]" />
      </div>
    </section>
  )
}

export default function Collections() {
  const [catsRef, catsShown] = useReveal<HTMLUListElement>()
  const reduced = useReducedMotion()
  return (
    <div className="theme-light bg-[#f6f6f4] text-[color:var(--fg)]">
      <Hero />

      {/* Editorial intro */}
      <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-36">
        <Reveal as="p" className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] lg:col-span-3">
          The edit
        </Reveal>
        <div className="lg:col-span-8">
          <Reveal className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-black uppercase leading-[0.95] [font-stretch:70%]">
            We kept the shape and changed the light. Each collection pairs a colourway with its own studio, so the shoe reads differently every time.
          </Reveal>
          <Reveal className="mt-6 max-w-xl text-[16px] leading-relaxed text-[color:var(--muted)]" delay={0.15}>
            Every image on this page was rendered from the same product model used across the store.
          </Reveal>
        </div>
      </section>

      {/* Large cinematic panels, alternating sides. */}
      <section aria-label="Featured collections" className="mx-auto max-w-[1600px] space-y-24 px-4 pb-24 sm:px-6 lg:space-y-40 lg:px-10 lg:pb-40">
        {collections.map((c, i) => {
          const flip = i % 2 === 1
          return (
            <article key={c.slug} className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
              <Link to={c.href} data-cursor="EXPLORE" className={`group block lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`} aria-label={`Shop ${c.title}`}>
                <ImageReveal
                  src={c.image.src}
                  srcSet={c.image.srcSet}
                  sizes="(min-width: 1024px) 58vw, 92vw"
                  alt={c.image.alt}
                  className={`${i === 0 ? 'aspect-[3/2]' : 'aspect-[4/5] lg:aspect-[5/6]'} rounded-[28px]`}
                  imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </Link>
              <Stagger className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`} gap={0.1}>
                <RevealItem as="p" className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  {c.kicker}
                </RevealItem>
                <RevealItem>
                  <h2 className="mt-3 font-display text-[clamp(3.4rem,8vw,7rem)] font-black uppercase leading-[0.84] [font-stretch:64%]">{c.title}</h2>
                </RevealItem>
                <RevealItem as="p" className="mt-5 max-w-md text-[16px] leading-relaxed text-[color:var(--muted)]">
                  {c.blurb}
                </RevealItem>
                <RevealItem className="mt-7">
                  <Link to={c.href} className="group inline-flex items-center gap-3 text-[14px] font-semibold">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--fg)] text-[color:var(--btn-fg)] transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                    Shop {c.title}
                  </Link>
                </RevealItem>
              </Stagger>
            </article>
          )
        })}
      </section>

      {/* Full-width visual moment */}
      <section className="theme-dark relative overflow-hidden bg-[#0e0e0f] text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
          <LineReveal lines={['Visible', 'Air.']} className="font-display text-[clamp(4.4rem,16vw,15rem)] font-black uppercase leading-[0.8] [font-stretch:62%]" />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <ImageReveal
              src="/campaign/detail-1000.webp"
              srcSet="/campaign/detail-1000.webp 1000w, /campaign/detail-2000.webp 2000w"
              sizes="(min-width: 1024px) 66vw, 92vw"
              alt="Macro view of the visible Air window in a white Air Max heel"
              className="aspect-[16/9] rounded-[28px] lg:col-span-8"
            />
            <Reveal className="self-end text-[16px] leading-relaxed text-white/70 lg:col-span-3 lg:col-start-10" delay={0.2}>
              The detail every collection shares: a window into the Air unit at the heel. Read the story behind it.
              <Link to="/about" className="mt-5 flex items-center gap-2 font-semibold text-white">
                The Air Max story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Interactive cards into each category. */}
      <section className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <Reveal as="p" className="mb-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Shop by category
        </Reveal>
        <ul ref={catsRef} className="grid gap-4 md:grid-cols-3">
          {(
            [
              { label: 'Men', href: '/men', p: getColorway('black') },
              { label: 'Women', href: '/women', p: getColorway('lilac') },
              { label: 'Kids', href: '/kids', p: getColorway('sunset') },
            ] as const
          ).map((x, i) => (
            <motion.li key={x.label} variants={rise} initial="hidden" animate={catsShown ? 'show' : 'hidden'} custom={i * 0.08}>
              <Link
                to={x.href}
                data-cursor="VIEW"
                className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[28px] p-6"
                style={{ background: x.p.tile }}
              >
                <span className={`relative z-10 flex items-center justify-between font-display text-5xl font-black uppercase [font-stretch:66%] ${x.p.dark ? 'text-white' : 'text-[#111]'}`}>
                  {x.label}
                  <ArrowUpRight className="h-7 w-7 transition-transform duration-500 group-hover:rotate-45" />
                </span>
                <img
                  src={x.p.imageSmall}
                  alt=""
                  loading="lazy"
                  className={`absolute -bottom-[6%] -right-[8%] w-[86%] -rotate-12 object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${reduced ? '' : 'group-hover:-translate-x-[4%] group-hover:-translate-y-[6%] group-hover:-rotate-[16deg]'}`}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="mt-16 flex justify-center">
          <Magnetic>
            <Link to="/sale" className="inline-flex h-14 items-center rounded-full border border-[color:var(--fg)] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] transition hover:bg-[color:var(--fg)] hover:text-[color:var(--btn-fg)]">
              See what’s on sale
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
