import { motion } from 'framer-motion'
import { ArrowUpRight, Eye, Heart } from 'lucide-react'
import { onSale, type Listing } from '../data/catalog'
import { rise } from '../lib/motion'
import { Link } from '../lib/router'
import { useShop } from '../state/shop'
import { Price } from './ui/Price'
import { useReveal } from './ui/Reveal'

/** Tile background for a colourway: a soft studio light over the colourway tint. */
export const tileBackground = (tile: string, light = 'rgba(255,255,255,0.35)') =>
  `radial-gradient(90% 70% at 50% 38%, ${light} 0%, transparent 70%), ${tile}`

export function ProductCard({ listing, index = 0, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw' }: { listing: Listing; index?: number; sizes?: string }) {
  const { isWished, toggleWish, openQuickView } = useShop()
  const { model, variant, colorway } = listing
  const wished = isWished(model.slug, variant.color)
  const alt = colorway.angles[0]
  const isNew = variant.release === 1
  const dark = colorway.dark
  const [revealRef, shown] = useReveal<HTMLElement>()

  return (
    <motion.article
      ref={revealRef}
      className="group relative flex flex-col"
      variants={rise}
      initial="hidden"
      animate={shown ? 'show' : 'hidden'}
      custom={(index % 3) * 0.07}
    >
      <div
        data-cursor="VIEW"
        className="relative aspect-[4/5] overflow-hidden rounded-[22px] transition-[border-radius] duration-500"
        style={{ background: tileBackground(colorway.tile, dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)') }}
      >
        {/* Primary render, swapped for the heel angle on hover. Both stay mounted so the tile never changes size. */}
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
          <img
            src={colorway.imageSmall}
            alt={colorway.alt}
            width={900}
            height={616}
            loading="lazy"
            decoding="async"
            sizes={sizes}
            className={`w-full -rotate-[8deg] object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.28)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[3%] group-hover:scale-[1.06] group-hover:-rotate-[11deg] ${alt ? '[@media(hover:hover)]:group-hover:opacity-0' : ''}`}
          />
          {alt && (
            <img
              src={alt.src}
              alt=""
              width={1200}
              height={840}
              loading="lazy"
              decoding="async"
              className="absolute inset-[8%] m-auto hidden w-[84%] scale-95 object-contain opacity-0 drop-shadow-[0_24px_24px_rgba(0,0,0,0.28)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)]:block"
            />
          )}
        </div>

        <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
          {onSale(listing) && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a10f17] shadow-sm">
              Sale
            </span>
          )}
          {isNew && (
            <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">
              Just in
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWish(model.slug, variant.color)}
          aria-pressed={wished}
          aria-label={`${wished ? 'Remove' : 'Save'} ${model.name} ${colorway.colorway} ${wished ? 'from' : 'to'} wishlist`}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#111] shadow-sm backdrop-blur transition hover:scale-105 active:scale-95"
        >
          <motion.span key={String(wished)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart className={`h-[18px] w-[18px] ${wished ? 'fill-[#c3121c] text-[#c3121c]' : ''}`} strokeWidth={1.8} />
          </motion.span>
        </button>

        <button
          type="button"
          onClick={() => openQuickView(listing)}
          className="absolute inset-x-3 bottom-3 z-10 flex h-11 items-center justify-center gap-2 rounded-full bg-white/95 text-[13px] font-semibold text-[#111] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" strokeWidth={1.8} />
          Quick view
          <span className="sr-only">
            {model.name} {colorway.colorway}
          </span>
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-tight">
            {/* The stretched link makes the whole card clickable while the buttons above stay independent. */}
            <Link to={listing.href} className="rounded after:absolute after:inset-0 after:rounded-[22px] after:content-['']">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
                {model.name}
              </span>
            </Link>
          </h3>
          <p className="mt-1 text-[13px] text-[color:var(--muted)]">{model.label}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[color:var(--muted)]">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: colorway.swatch }} />
            {colorway.colorway}
          </p>
          <Price listing={listing} className="mt-2" />
        </div>
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--border)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-[color:var(--fg)] group-hover:text-[color:var(--btn-fg)]"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.article>
  )
}
