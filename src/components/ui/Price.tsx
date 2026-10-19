import { onSale, percentOff, type Listing } from '../../data/catalog'
import { formatPrice } from '../../data/products'

/** Displayed price. A previous price only appears when the sample data configures one. */
export function Price({ listing, className = '', large = false }: { listing: Listing; className?: string; large?: boolean }) {
  const sale = onSale(listing)
  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 tabular-nums ${className}`}>
      <span className={`${large ? 'text-xl' : 'text-[15px]'} font-semibold`}>
        <span className="sr-only">{sale ? 'Sale price ' : 'Price '}</span>
        {formatPrice(listing.variant.price)}
      </span>
      {sale && (
        <>
          <s className={`${large ? 'text-base' : 'text-[13px]'} text-[color:var(--muted)]`}>
            <span className="sr-only">Previous price </span>
            {formatPrice(listing.variant.compareAt!)}
          </s>
          <span className={`${large ? 'text-sm' : 'text-[12px]'} font-semibold text-[#c3121c]`}>{percentOff(listing)}% off</span>
        </>
      )}
    </span>
  )
}
