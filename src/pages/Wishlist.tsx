import { Heart } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Link } from '../lib/router'
import { useShop } from '../state/shop'

export default function Wishlist() {
  const { wishlist } = useShop()
  return (
    <div className="theme-light min-h-[80svh] bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <SectionHeading
          as="h1"
          kicker={`${wishlist.length} saved`}
          lines={['Wishlist']}
          size="md"
          intro="Saved in this browser only. Tap the heart on any pair to remove it."
        />
        {wishlist.length ? (
          <ul className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((l, i) => (
              <li key={l.id}>
                <ProductCard listing={l} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-start">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-black/5">
              <Heart className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-[17px]">Nothing saved yet.</p>
            <Link to="/collections" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#111] px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
              Browse collections
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
