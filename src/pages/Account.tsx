import { Heart, LifeBuoy, ShoppingBag } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Link } from '../lib/router'
import { useShop } from '../state/shop'

export default function Account() {
  const { bagCount, wishlist } = useShop()
  const tiles = [
    { icon: ShoppingBag, label: 'Bag', meta: `${bagCount} ${bagCount === 1 ? 'item' : 'items'}`, href: '/bag' },
    { icon: Heart, label: 'Wishlist', meta: `${wishlist.length} saved`, href: '/wishlist' },
    { icon: LifeBuoy, label: 'Help', meta: 'Sizing, shipping, returns', href: '/help' },
  ]
  return (
    <div className="theme-light min-h-[80svh] bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1300px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <SectionHeading
          as="h1"
          kicker="Account"
          lines={['Your Air Max']}
          size="md"
          intro="Sign-in isn't part of this demo, so there's no account to create. Your bag and wishlist are kept in this browser and are not synced to other devices."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.label}>
              <Link to={t.href} className="group flex h-full flex-col justify-between gap-10 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.3)] transition hover:-translate-y-1">
                <t.icon className="h-6 w-6" strokeWidth={1.6} />
                <span>
                  <span className="block font-display text-3xl font-black uppercase [font-stretch:75%]">{t.label}</span>
                  <span className="text-[14px] text-[color:var(--muted)]">{t.meta}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
