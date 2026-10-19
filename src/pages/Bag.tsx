import { ShoppingBag } from 'lucide-react'
import { BagLines } from '../components/overlays/BagLines'
import { SectionHeading } from '../components/ui/SectionHeading'
import { formatPrice } from '../data/products'
import { Link } from '../lib/router'
import { useShop } from '../state/shop'

export default function Bag() {
  const { bag, bagCount, subtotal } = useShop()
  return (
    <div className="theme-light min-h-[80svh] bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1300px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <SectionHeading as="h1" kicker={`${bagCount} ${bagCount === 1 ? 'item' : 'items'}`} lines={['Your bag']} size="md" />
        {bag.length ? (
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <BagLines large />
            </div>
            <aside aria-label="Summary" className="lg:col-span-4">
              <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] lg:sticky lg:top-28">
                <h2 className="font-display text-3xl font-black uppercase [font-stretch:75%]">Summary</h2>
                <dl className="mt-6 space-y-3 text-[15px]">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-[color:var(--muted)]">
                    <dt>Shipping</dt>
                    <dd>Not calculated</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  disabled
                  aria-describedby="checkout-note"
                  className="mt-6 h-14 w-full cursor-not-allowed rounded-full bg-[#111]/40 text-[14px] font-semibold text-white"
                >
                  Checkout unavailable
                </button>
                <p id="checkout-note" className="mt-3 text-[13px] leading-relaxed text-[color:var(--muted)]">
                  This is a frontend shopping demo. There is no checkout, no order is placed and no payment is taken. Your bag is saved in this browser only.
                </p>
                <Link to="/collections" className="mt-5 block text-center text-[14px] font-semibold underline underline-offset-4">
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-start">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-black/5">
              <ShoppingBag className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-[17px]">Your bag is empty.</p>
            <Link to="/men" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#111] px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
              Shop Air Max
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
