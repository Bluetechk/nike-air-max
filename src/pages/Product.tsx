import { ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductGallery } from '../components/ProductGallery'
import { PurchasePanel } from '../components/PurchasePanel'
import { Reveal, RevealItem, Stagger } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { categoryLabel, getModel, listingHref, listings } from '../data/catalog'
import { getColorway, type ColorId } from '../data/products'
import { Link, useRouter, useSearchParams } from '../lib/router'
import NotFound from './NotFound'

export default function Product({ slug }: { slug: string }) {
  const model = getModel(slug)
  const params = useSearchParams()
  const { navigate } = useRouter()
  const requested = params.get('color') as ColorId | null
  const color = model?.variants.some((v) => v.color === requested) ? requested! : model?.variants[0].color

  useEffect(() => {
    if (model && color) document.title = `${model.name} ${getColorway(color).colorway} · ${model.label}`
  }, [model, color])

  if (!model || !color) return <NotFound />
  const colorway = getColorway(color)
  const related = listings.filter((l) => l.model.slug !== slug && l.variant.color === color).concat(listings.filter((l) => l.model.slug === slug && l.variant.color !== color))

  return (
    <div className="theme-light bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-24 sm:px-6 lg:px-10 lg:pt-28">
        <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-[color:var(--muted)]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-[color:var(--fg)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link to={`/${model.category}`} className="hover:text-[color:var(--fg)]">
                {categoryLabel[model.category]}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-[color:var(--fg)]">
              {model.name} · {colorway.colorway}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery key={color} colorway={colorway} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <PurchasePanel model={model} color={color} onColorChange={(c) => navigate(listingHref(slug, c), { replace: true, keepScroll: true })} />
            </div>
          </div>
        </div>

        <section aria-labelledby="about-product" className="mt-24 grid gap-10 border-t border-[color:var(--border)] pt-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 id="about-product" className="font-display text-5xl font-black uppercase leading-[0.9] [font-stretch:70%]">
              About this pair
            </h2>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal as="p" className="text-[18px] leading-relaxed">
              {model.description}
            </Reveal>
            <Stagger as="div" className="mt-8 grid gap-3 sm:grid-cols-2" gap={0.06}>
              {model.details.map((d) => (
                <RevealItem key={d} className="rounded-2xl border border-[color:var(--border)] px-5 py-4 text-[14px]">
                  {d}
                </RevealItem>
              ))}
            </Stagger>
            <details className="group mt-8 rounded-2xl border border-[color:var(--border)] px-5 py-4">
              <summary className="cursor-pointer list-none text-[14px] font-semibold marker:hidden">
                <span className="flex items-center justify-between">
                  Shipping and returns
                  <span className="transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--muted)]">
                This is a frontend demo store, so nothing ships and no orders are placed. See the{' '}
                <Link to="/help#shipping" className="underline underline-offset-4">
                  help page
                </Link>{' '}
                for how a live store would describe this.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-24">
          <SectionHeading kicker="Keep exploring" lines={['You might', 'also like']} size="md" />
          <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((l, i) => (
              <li key={l.id}>
                <ProductCard listing={l} index={i} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
