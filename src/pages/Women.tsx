import { CollectionBrowser } from '../components/CollectionBrowser'
import { ImageReveal, LineReveal, Reveal, RevealItem, Stagger } from '../components/ui/Reveal'
import { listings } from '../data/catalog'
import { getColorway } from '../data/products'

const items = listings.filter((l) => l.model.category === 'women')

export default function Women() {
  const lilac = getColorway('lilac')
  return (
    <div className="theme-light bg-[#f6f6f4] text-[color:var(--fg)]">
      {/* Campaign banner: daylight studio, type set over the image edge. */}
      <section className="relative mx-auto max-w-[1600px] px-4 pt-24 sm:px-6 lg:px-10 lg:pt-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="relative z-10 flex flex-col justify-between lg:col-span-5 lg:py-10">
            <div>
              <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                Air Max · Women
              </Reveal>
              <LineReveal
                as="h1"
                lines={['Light', 'on your', 'feet.']}
                className="font-display text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.82] [font-stretch:64%] lg:-mr-[40%]"
              />
            </div>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1" gap={0.12} delay={0.3}>
              <RevealItem as="p" className="max-w-sm text-[17px] leading-relaxed">
                The Air Max 270: a sock-like knit upper and a tall Air unit at the heel, in sizes W5 to W11.
              </RevealItem>
              <RevealItem className="flex items-center gap-4">
                <span className="grid h-20 w-24 place-items-center rounded-2xl" style={{ background: lilac.tile }}>
                  <img src={lilac.thumb} alt="" className="w-[88%] -rotate-6 object-contain" />
                </span>
                <p className="text-[14px] leading-snug text-[color:var(--muted)]">
                  <span className="block font-semibold text-[color:var(--fg)]">Lilac Bloom on sale</span>
                  Air Max 270, sample markdown for this demo.
                </p>
              </RevealItem>
            </Stagger>
          </div>
          <div className="lg:col-span-7">
            <ImageReveal
              src="/campaign/women-pastel-896.webp"
              srcSet="/campaign/women-pastel-560.webp 560w, /campaign/women-pastel-896.webp 896w"
              sizes="(min-width: 1024px) 55vw, 92vw"
              alt="Lilac and pink Air Max 270 sneakers on pastel plaster blocks with dried flowers"
              className="aspect-[4/5] rounded-[32px] lg:aspect-[5/6]"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-6 lg:mt-32 lg:px-10">
        <div className="grid gap-6 border-t border-[color:var(--border)] pt-10 lg:grid-cols-12">
          <Reveal as="p" className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] lg:col-span-3">
            The collection
          </Reveal>
          <Reveal className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-black uppercase leading-[0.95] [font-stretch:72%] lg:col-span-8" delay={0.1}>
            Soft pink, lilac and sail. Three easy colours built around one big Air unit.
          </Reveal>
        </div>
      </section>

      <div className="pb-28 pt-14">
        <CollectionBrowser items={items} />
      </div>
    </div>
  )
}
