import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { LineReveal, Reveal, useReveal } from '../../components/ui/Reveal'
import { Magnetic } from '../../components/ui/Magnetic'
import { getColorway } from '../../data/products'
import { easeProduct } from '../../lib/motion'
import { Link } from '../../lib/router'

/** Section F: the closing call to action. */
export function FinalCta() {
  const reduced = useReducedMotion()
  const [shoeRef, shoeShown] = useReveal()
  const shoe = getColorway('white')
  return (
    <section aria-label="Find your Air" className="theme-dark relative isolate overflow-hidden bg-[#8e0b12] text-white">
      {/* Ambient light: two slow radial blooms drifting out of phase. */}
      <div aria-hidden="true" className="ambient-a absolute left-[55%] top-[40%] -z-10 aspect-square w-[min(1200px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,96,72,0.55),transparent)]" />
      <div aria-hidden="true" className="ambient-b absolute left-[20%] top-[80%] -z-10 aspect-square w-[min(900px,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(40,0,3,0.7),transparent)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(140%_100%_at_60%_40%,transparent_50%,rgba(20,0,2,0.55)_100%)]" />

      <div className="mx-auto grid max-w-[1600px] items-center gap-6 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-32">
        <div className="relative z-10 lg:col-span-6">
          <LineReveal
            lines={['Find', 'your Air.']}
            step={0.12}
            className="font-display text-[clamp(4.4rem,15vw,13rem)] font-black uppercase leading-[0.8] [font-stretch:64%]"
          />
          <Reveal className="mt-6 max-w-md text-[17px] leading-relaxed text-white/80" delay={0.25}>
            Three colourways, men’s, women’s and big kids’ sizing. Start with the one that feels like you.
          </Reveal>
          <Reveal className="mt-9" delay={0.35}>
            <Magnetic>
              <Link
                to="/collections"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-7 pr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8e0b12] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] transition-shadow hover:shadow-[0_24px_50px_-14px_rgba(0,0,0,0.7)]"
              >
                Shop the collections
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#8e0b12] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
        <motion.div
          ref={shoeRef}
          className="relative lg:col-span-6"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: '18%', rotate: 14, scale: 0.85 }}
          animate={shoeShown ? { opacity: 1, x: 0, rotate: 0, scale: 1 } : undefined}
          transition={{ duration: 1.5, ease: easeProduct, delay: 0.15 }}
        >
          <div className="shoe-float">
            <img
              src={shoe.imageSmall}
              srcSet={`${shoe.imageSmall} 900w, ${shoe.image} 1600w`}
              sizes="(min-width: 1024px) 48vw, 92vw"
              alt="White Air Max floating against a crimson background"
              loading="lazy"
              decoding="async"
              width={1600}
              height={1095}
              className="w-full -rotate-6 drop-shadow-[0_40px_40px_rgba(40,0,2,0.6)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
