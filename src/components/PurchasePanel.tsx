import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, ShoppingBag } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { getListing, type Model } from '../data/catalog'
import { getColorway, type ColorId } from '../data/products'
import { easeOutExpo } from '../lib/motion'
import { useShop } from '../state/shop'
import { Price } from './ui/Price'

interface Props {
  model: Model
  color: ColorId
  onColorChange: (color: ColorId) => void
  /** Heading level and size differ between the product page and the quick view. */
  compact?: boolean
}

/** Name, price, colour and size selection, add to bag and wishlist. Shared by the product page and quick view. */
export function PurchasePanel({ model, color, onColorChange, compact = false }: Props) {
  const { addToBag, isWished, toggleWish } = useShop()
  const listing = getListing(model.slug, color)!
  const colorway = getColorway(color)
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(0)
  const sizeHeading = useId()
  const errorId = useId()
  const wished = isWished(model.slug, color)

  // A size sold out in the new colour can't stay selected.
  useEffect(() => {
    if (size && listing.variant.soldOut.includes(size)) setSize(null)
  }, [listing, size])

  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(0), 1800)
    return () => window.clearTimeout(t)
  }, [added])

  const soldOutCount = listing.variant.soldOut.length
  const availability =
    soldOutCount === 0
      ? 'In stock in all sizes'
      : soldOutCount >= model.sizes.length
        ? 'Sold out'
        : `In stock. ${soldOutCount} ${soldOutCount === 1 ? 'size is' : 'sizes are'} sold out`

  const add = () => {
    if (!size) {
      setError(true)
      document.getElementById(sizeHeading)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    addToBag(model.slug, color, size)
    setAdded(Date.now())
  }

  const Heading = compact ? 'h2' : 'h1'

  return (
    <div className="flex flex-col">
      <p className="text-[13px] font-medium text-[color:var(--muted)]">{model.label}</p>
      <Heading className={`mt-1 font-display font-black uppercase leading-[0.9] [font-stretch:75%] ${compact ? 'text-4xl' : 'text-5xl sm:text-6xl'}`}>
        {model.name}
      </Heading>
      <p className="mt-2 text-[15px] font-medium">{colorway.colorway}</p>
      <Price listing={listing} large className="mt-4" />
      <p className="mt-1 text-[12px] text-[color:var(--muted)]">Sample price for this demo store.</p>

      <fieldset className="mt-7">
        <legend className="text-[13px] font-semibold">Colour</legend>
        <div className="mt-3 flex gap-2.5" role="radiogroup" aria-label="Colour">
          {model.variants.map((v) => {
            const c = getColorway(v.color)
            const on = v.color === color
            return (
              <button
                key={v.color}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={c.colorway}
                onClick={() => onColorChange(v.color)}
                className={`relative grid h-[68px] w-[84px] place-items-center rounded-2xl border-2 transition duration-300 ${
                  on ? 'border-[color:var(--fg)]' : 'border-transparent hover:border-[color:var(--border)]'
                }`}
                style={{ background: c.tile }}
              >
                <img src={c.thumb} alt="" className="w-[84%] -rotate-6 object-contain" />
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7" aria-describedby={error ? errorId : undefined}>
        <legend id={sizeHeading} className="flex w-full items-center justify-between text-[13px] font-semibold">
          Select size <span className="font-normal text-[color:var(--muted)]">US sizing</span>
        </legend>
        <div className={`mt-3 grid gap-2 ${compact ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`} role="radiogroup" aria-labelledby={sizeHeading}>
          {model.sizes.map((s) => {
            const out = listing.variant.soldOut.includes(s)
            const on = size === s
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={out}
                aria-label={`Size ${s}${out ? ', sold out' : ''}`}
                onClick={() => {
                  setSize(s)
                  setError(false)
                }}
                className={`h-12 rounded-xl border text-[14px] font-medium tabular-nums transition duration-200 ${
                  out
                    ? 'cursor-not-allowed border-[color:var(--border)] text-[color:var(--muted)] line-through opacity-50'
                    : on
                      ? 'border-[color:var(--fg)] bg-[color:var(--fg)] text-[color:var(--btn-fg)]'
                      : error
                        ? 'border-[#c3121c]/60 hover:border-[color:var(--fg)]'
                        : 'border-[color:var(--border)] hover:border-[color:var(--fg)]'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[13px] font-medium text-[#c3121c]"
            >
              Please select a size.
            </motion.p>
          )}
        </AnimatePresence>
      </fieldset>

      <p className="mt-4 flex items-center gap-2 text-[13px]">
        <span className={`h-2 w-2 rounded-full ${soldOutCount ? 'bg-amber-500' : 'bg-emerald-500'}`} aria-hidden="true" />
        {availability}
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={add}
          className="relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--fg)] text-[14px] font-semibold text-[color:var(--btn-fg)] transition duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                className="flex items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <Check className="h-5 w-5" /> Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                className="flex items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} /> Add to bag
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          type="button"
          onClick={() => toggleWish(model.slug, color)}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          className="grid h-14 w-14 place-items-center rounded-full border border-[color:var(--border)] transition duration-300 hover:border-[color:var(--fg)] active:scale-95"
        >
          <motion.span key={String(wished)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
            <Heart className={`h-5 w-5 ${wished ? 'fill-[#c3121c] text-[#c3121c]' : ''}`} strokeWidth={1.8} />
          </motion.span>
        </button>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--muted)]">
        Demo store: your bag is saved in this browser only. There is no checkout and no payment is taken.
      </p>
    </div>
  )
}
