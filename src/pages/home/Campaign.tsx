import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ImageReveal, LineReveal, Parallax, Reveal, useParallax } from '../../components/ui/Reveal'
import { Magnetic } from '../../components/ui/Magnetic'
import { getColorway } from '../../data/products'
import { Link } from '../../lib/router'

/** Section E: asymmetric editorial spread built from the Higgsfield campaign renders. */
export function Campaign() {
  const banner = useParallax(40)
  return (
    <section aria-label="Campaign" className="theme-light overflow-hidden bg-[#ecebe7] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-24 sm:px-6 lg:px-10 lg:pt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-8">
            <LineReveal
              lines={['Made for', 'the city.']}
              className="font-display text-[clamp(3.6rem,12vw,11rem)] font-black uppercase leading-[0.82] [font-stretch:66%]"
            />
          </div>
          <Reveal className="self-end text-[16px] leading-relaxed text-[color:var(--muted)] lg:col-span-3 lg:col-start-10 lg:pb-4" delay={0.25}>
            From wet asphalt at rush hour to a gallery opening, the same pair carries the whole day. Pick your colour and go.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Parallax amount={30} className="overflow-hidden rounded-[28px]">
              <ImageReveal
                src="/campaign/street-1000.webp"
                srcSet="/campaign/street-1000.webp 1000w, /campaign/street-2000.webp 2000w"
                sizes="(min-width: 1024px) 64vw, 92vw"
                alt="Red Air Max sneakers mid-stride on a wet city street at dusk"
                className="aspect-[3/2] scale-[1.06]"
              />
            </Parallax>
            {/* Caption and colour strip balance the taller right-hand column, so the spread has no dead corner. */}
            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <Reveal delay={0.1}>
                <p className="font-display text-4xl font-black uppercase leading-none [font-stretch:70%]">Rush hour</p>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[color:var(--muted)]">
                  University Red on wet asphalt, with the Air window catching every street light.
                </p>
                <Link to="/men?color=red" className="group mt-4 inline-flex items-center gap-2 text-[14px] font-semibold">
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                    Shop University Red
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
              <Reveal delay={0.2} className="flex gap-3">
                {(['white', 'black', 'red'] as const).map((id) => {
                  const c = getColorway(id)
                  return (
                    <Link
                      key={id}
                      to={`/men?color=${id}`}
                      aria-label={`Shop ${c.colorway}`}
                      data-cursor="VIEW"
                      className="group grid h-20 w-24 place-items-center rounded-2xl ring-1 ring-black/10 transition-transform duration-500 hover:-translate-y-1"
                      style={{ background: c.tile }}
                    >
                      <img src={c.thumb} alt="" loading="lazy" className="w-[86%] -rotate-6 object-contain transition-transform duration-500 group-hover:-rotate-12" />
                    </Link>
                  )
                })}
              </Reveal>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:mt-48">
            <ImageReveal
              src="/campaign/blackout-800.webp"
              srcSet="/campaign/blackout-800.webp 800w, /campaign/blackout-1400.webp 1400w"
              sizes="(min-width: 1024px) 30vw, 92vw"
              alt="Black Air Max on a dark concrete block under a single rim light"
              className="aspect-[4/5] rounded-[28px]"
              delay={0.1}
            />
            <Reveal delay={0.15}>
              <p className="font-display text-4xl font-black uppercase leading-none [font-stretch:70%]">After dark</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--muted)]">Triple black, lit by one hard light. The quiet one in the line-up.</p>
              <Link to="/men?color=black" className="group mt-4 inline-flex items-center gap-2 text-[14px] font-semibold">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                  Shop Blackout
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Full-bleed visual moment. */}
      <div ref={banner.ref} className="relative mt-16 overflow-hidden bg-[#2a0204] lg:mt-24">
        <motion.img
          src="/campaign/crimson-1000.webp"
          srcSet="/campaign/crimson-1000.webp 1000w, /campaign/crimson-2000.webp 2000w"
          sizes="100vw"
          alt="Red Air Max floating in a crimson studio with haze and a warm glow"
          loading="lazy"
          decoding="async"
          style={{ y: banner.y }}
          className="h-[78svh] min-h-[460px] w-full scale-[1.15] object-cover object-[72%_center] lg:h-[86svh]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a0204]/80 via-[#2a0204]/20 to-transparent" aria-hidden="true" />
        <div className="theme-dark absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-4 pb-12 text-white sm:px-6 lg:justify-center lg:px-10 lg:pb-0">
          <LineReveal
            lines={['All eyes', 'on red.']}
            className="font-display text-[clamp(3.4rem,10vw,9rem)] font-black uppercase leading-[0.84] [font-stretch:66%]"
          />
          <Reveal className="mt-5 max-w-sm text-[16px] leading-relaxed text-white/80" delay={0.2}>
            University Red with a white swoosh. Built to be seen.
          </Reveal>
          <Reveal className="mt-8" delay={0.3}>
            <Magnetic>
              <Link
                to="/collections"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-7 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#a10f17] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]"
              >
                Explore collections
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#a10f17] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
