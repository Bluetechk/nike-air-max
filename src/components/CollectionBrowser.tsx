import { AnimatePresence, motion } from 'framer-motion'
import { Check, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { categoryLabel, onSale, sortListings, sortOptions, type Category, type Listing, type SortKey } from '../data/catalog'
import { colorways, type ColorId } from '../data/products'
import { easeOutExpo } from '../lib/motion'
import { useRouter, useSearchParams } from '../lib/router'
import { ProductCard } from './ProductCard'

interface Props {
  items: Listing[]
  /** Offer a category filter (used on Sale, where several categories mix). */
  categoryFilter?: boolean
  emptyHint?: string
}

const chip =
  'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[color:var(--border)]'
const chipOff = 'border-[color:var(--border)] hover:border-[color:var(--fg)]'
const chipOn = 'border-[color:var(--fg)] bg-[color:var(--fg)] text-[color:var(--btn-fg)]'

const listParam = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

/**
 * Filters, sorting and the responsive product grid shared by every collection page.
 * Filter state lives in the URL so it survives reloads, back/forward and shared links.
 */
export function CollectionBrowser({ items, categoryFilter = false, emptyHint }: Props) {
  const params = useSearchParams()
  const { navigate, location } = useRouter()
  const [panelOpen, setPanelOpen] = useState(false)

  const colors = listParam(params.get('color')).filter((c): c is ColorId => colorways.some((p) => p.id === c))
  const cats = listParam(params.get('category')).filter((c): c is Category => c in categoryLabel)
  const size = params.get('size') ?? ''
  const saleOnly = params.get('sale') === '1'
  const sort = (sortOptions.some((o) => o.value === params.get('sort')) ? params.get('sort') : 'featured') as SortKey

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(location.search)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    const qs = next.toString()
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`, { replace: true, keepScroll: true })
  }
  const toggleIn = (key: string, list: string[], value: string) =>
    update({ [key]: (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]).join(',') || null })

  const availableColors = colorways.filter((c) => items.some((l) => l.variant.color === c.id))
  const availableCats = (Object.keys(categoryLabel) as Category[]).filter((c) => items.some((l) => l.model.category === c))
  const allSizes = useMemo(() => [...new Set(items.flatMap((l) => l.model.sizes))], [items])
  // The toggle only helps when the list mixes full-price and sale pairs.
  const hasSale = items.some(onSale) && !items.every(onSale)

  const matches = (l: Listing, f: { colors: string[]; cats: string[]; size: string; saleOnly: boolean }) =>
    (!f.colors.length || f.colors.includes(l.variant.color)) &&
    (!f.cats.length || f.cats.includes(l.model.category)) &&
    (!f.size || (l.model.sizes.includes(f.size) && !l.variant.soldOut.includes(f.size))) &&
    (!f.saleOnly || onSale(l))
  const current = { colors, cats, size, saleOnly }
  const results = sortListings(
    items.filter((l) => matches(l, current)),
    sort,
  )
  /** How many pairs a chip would show if it were switched on with the other active filters. */
  const countWith = (patch: Partial<typeof current>) => items.filter((l) => matches(l, { ...current, ...patch })).length

  const activeCount = colors.length + cats.length + (size ? 1 : 0) + (saleOnly ? 1 : 0)
  const clear = () => update({ color: null, category: null, size: null, sale: null })

  const filters = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Colour</legend>
        {availableColors.map((c) => {
          const on = colors.includes(c.id)
          const n = on ? results.length : countWith({ colors: [...colors, c.id] })
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              disabled={!on && n === 0}
              onClick={() => toggleIn('color', colors, c.id)}
              className={`${chip} ${on ? chipOn : chipOff}`}
            >
              <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15" style={{ background: c.swatch }} />
              {c.colorway}
              {!on && <span className="text-[12px] opacity-50">{n}</span>}
            </button>
          )
        })}
      </fieldset>

      {categoryFilter && availableCats.length > 1 && (
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Category</legend>
          {availableCats.map((c) => {
            const on = cats.includes(c)
            const n = on ? results.length : countWith({ cats: [...cats, c] })
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                disabled={!on && n === 0}
                onClick={() => toggleIn('category', cats, c)}
                className={`${chip} ${on ? chipOn : chipOff}`}
              >
                {on && <Check className="h-3.5 w-3.5" />}
                {categoryLabel[c]}
                {!on && <span className="text-[12px] opacity-50">{n}</span>}
              </button>
            )
          })}
        </fieldset>
      )}

      <label className="relative inline-flex items-center">
        <span className="sr-only">Size in stock</span>
        <select
          value={size}
          onChange={(e) => update({ size: e.target.value || null })}
          className={`${chip} ${size ? chipOn : `${chipOff} bg-transparent`} cursor-pointer appearance-none pr-9`}
        >
          <option value="">Any size</option>
          {allSizes.map((s) => {
            const n = countWith({ size: s })
            return (
              <option key={s} value={s} disabled={n === 0 && s !== size}>
                Size {s}
                {n === 0 ? ' (none in stock)' : ''}
              </option>
            )
          })}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 text-[10px]">
          ▼
        </span>
      </label>

      {hasSale && (
        <button type="button" aria-pressed={saleOnly} onClick={() => update({ sale: saleOnly ? null : '1' })} className={`${chip} ${saleOnly ? chipOn : chipOff}`}>
          {saleOnly && <Check className="h-3.5 w-3.5" />}
          On sale
        </button>
      )}

      {activeCount > 0 && (
        <button type="button" onClick={clear} className="inline-flex h-10 items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline">
          <X className="h-3.5 w-3.5" /> Clear all
        </button>
      )}
    </div>
  )

  return (
    <section aria-label="Products" className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
        <p className="text-[13px] text-[color:var(--muted)]" aria-live="polite">
          {results.length} {results.length === 1 ? 'style' : 'styles'}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="filter-panel"
            className={`${chip} ${chipOff} lg:hidden`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter{activeCount ? ` (${activeCount})` : ''}
          </button>
          <label className="relative inline-flex items-center">
            <span className="mr-2 hidden text-[13px] text-[color:var(--muted)] sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
              className={`${chip} ${chipOff} cursor-pointer appearance-none bg-transparent pr-9`}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 text-[10px]">
              ▼
            </span>
          </label>
        </div>
      </div>

      <div id="filter-panel" className="hidden pt-5 lg:block">
        {filters}
      </div>
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            key="mobile-filters"
            className="overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          >
            <div className="pt-5">{filters}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {results.length > 0 ? (
        <motion.ul layout className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((l, i) => (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: easeOutExpo }}
              >
                <ProductCard listing={l} index={i} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mx-auto max-w-md py-24 text-center">
          <p className="font-display text-3xl font-black uppercase [font-stretch:75%]">Nothing matches</p>
          <p className="mt-3 text-[15px] text-[color:var(--muted)]">{emptyHint ?? 'Try another colour or size, or clear your filters.'}</p>
          <button type="button" onClick={clear} className="mt-6 h-11 rounded-full bg-[color:var(--fg)] px-6 text-[13px] font-semibold text-[color:var(--btn-fg)]">
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
