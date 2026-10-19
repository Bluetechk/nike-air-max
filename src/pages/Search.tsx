import { Search as SearchIcon, X } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { listings, searchListings } from '../data/catalog'
import { useRouter, useSearchParams } from '../lib/router'

export default function Search() {
  const params = useSearchParams()
  const { navigate } = useRouter()
  const q = params.get('q') ?? ''
  const results = q.trim() ? searchListings(q) : listings
  const set = (value: string) => navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search', { replace: true, keepScroll: true })

  return (
    <div className="theme-light min-h-[80svh] bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <SectionHeading as="h1" kicker="Search" lines={['Find a pair']} size="md" />
        <label className="mt-10 flex h-16 max-w-2xl items-center gap-3 rounded-full bg-white px-6 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.1)] focus-within:shadow-[inset_0_0_0_2px_#111]">
          <SearchIcon className="h-5 w-5 opacity-60" />
          <span className="sr-only">Search products</span>
          <input
            value={q}
            onChange={(e) => set(e.target.value)}
            placeholder="Try “red”, “women” or “sale”"
            className="h-full w-full bg-transparent text-[17px] focus:outline-none"
            autoComplete="off"
          />
          {q && (
            <button type="button" onClick={() => set('')} aria-label="Clear search" className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        <p className="mt-6 text-[14px] text-[color:var(--muted)]" aria-live="polite">
          {q.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q.trim()}”` : `All ${listings.length} styles`}
        </p>
        {results.length ? (
          <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l, i) => (
              <li key={l.id}>
                <ProductCard listing={l} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-md text-[16px]">No pairs match “{q.trim()}”. Try a colour such as red, black or white, or a category such as kids.</p>
        )}
      </div>
    </div>
  )
}
