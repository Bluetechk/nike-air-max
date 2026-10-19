import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '../../data/products'
import { Link } from '../../lib/router'
import { useShop, type BagEntry } from '../../state/shop'

/** Line items with quantity steppers. Used in the bag drawer and on the bag page. */
export function BagLines({ onNavigate, large = false }: { onNavigate?: () => void; large?: boolean }) {
  const { bag, setQty, removeFromBag } = useShop()
  return (
    <ul className="divide-y divide-[color:var(--border)]">
      {bag.map((line) => (
        <BagLineRow key={line.key} line={line} large={large} onNavigate={onNavigate} setQty={setQty} remove={removeFromBag} />
      ))}
    </ul>
  )
}

function BagLineRow({
  line,
  large,
  onNavigate,
  setQty,
  remove,
}: {
  line: BagEntry
  large: boolean
  onNavigate?: () => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
}) {
  const { listing, qty, size, key } = line
  const name = `${listing.model.name}, ${listing.colorway.colorway}, size ${size}`
  return (
    <li className="flex gap-4 py-5">
      <Link
        to={listing.href}
        onClick={onNavigate}
        className={`grid shrink-0 place-items-center rounded-2xl ${large ? 'h-32 w-32 sm:h-40 sm:w-40' : 'h-24 w-24'}`}
        style={{ background: listing.colorway.tile }}
        aria-label={`View ${listing.model.name} ${listing.colorway.colorway}`}
      >
        <img src={listing.colorway.thumb} alt="" className="w-[86%] -rotate-6 object-contain" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-tight">{listing.model.name}</p>
            <p className="mt-1 text-[13px] text-[color:var(--muted)]">
              {listing.model.label} · {listing.colorway.colorway}
            </p>
            <p className="text-[13px] text-[color:var(--muted)]">Size {size}</p>
          </div>
          <p className="text-[15px] font-semibold tabular-nums">{formatPrice(listing.variant.price * qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-[color:var(--border)]" role="group" aria-label={`Quantity for ${name}`}>
            <button
              type="button"
              onClick={() => setQty(key, qty - 1)}
              aria-label={qty === 1 ? `Remove ${name}` : `Decrease quantity of ${name}`}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[color:var(--card-active)]"
            >
              {qty === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
            <span className="w-7 text-center text-[14px] font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(key, qty + 1)}
              disabled={qty >= 10}
              aria-label={`Increase quantity of ${name}`}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[color:var(--card-active)] disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button type="button" onClick={() => remove(key)} className="text-[13px] font-medium text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--fg)] hover:underline">
            Remove<span className="sr-only"> {name}</span>
          </button>
        </div>
      </div>
    </li>
  )
}
