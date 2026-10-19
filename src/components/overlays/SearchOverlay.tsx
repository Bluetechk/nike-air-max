import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { searchListings } from '../../data/catalog'
import { useDialog, useScrollLock } from '../../lib/hooks'
import { easeOutExpo } from '../../lib/motion'
import { Link, useRouter } from '../../lib/router'
import { useShop } from '../../state/shop'
import { Price } from '../ui/Price'

const suggestions = ['Red', 'Triple Black', 'White', 'Women', 'Kids', 'Sale']

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop()
  const { navigate } = useRouter()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const close = () => setSearchOpen(false)
  useScrollLock(searchOpen)
  useDialog(ref, searchOpen, close)

  const results = searchListings(query)
  useEffect(() => setActive(0), [query])
  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      close()
      navigate(results[active].href)
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div key="search" className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="theme-light relative max-h-[100svh] overflow-y-auto bg-[#f6f6f4] text-[#111] shadow-2xl"
            initial={{ y: '-30%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-20%', opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
              <div className="flex items-center gap-3">
                <label className="flex h-14 flex-1 items-center gap-3 rounded-full bg-white px-5 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.08)] focus-within:shadow-[inset_0_0_0_2px_#111]">
                  <Search className="h-5 w-5 shrink-0 opacity-60" />
                  <span className="sr-only">Search Air Max products</span>
                  <input
                    ref={inputRef}
                    data-autofocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Search by name, colour or category"
                    role="combobox"
                    aria-expanded={results.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                    autoComplete="off"
                    className="h-full w-full bg-transparent text-[16px] placeholder:text-[#77776f] focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        inputRef.current?.focus()
                      }}
                      aria-label="Clear search"
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/5 transition hover:bg-black/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </label>
                <button type="button" onClick={close} className="h-14 rounded-full px-4 text-[14px] font-semibold hover:bg-black/5">
                  Cancel
                </button>
              </div>

              {!query.trim() ? (
                <div className="mt-8">
                  <p className="text-[13px] font-semibold text-[color:var(--muted)]">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setQuery(s)
                          inputRef.current?.focus()
                        }}
                        className="h-10 rounded-full border border-[color:var(--border)] px-4 text-[14px] font-medium transition hover:border-[#111]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <p className="text-[13px] text-[color:var(--muted)]" aria-live="polite">
                    {results.length
                      ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
                      : ''}
                  </p>
                  {results.length ? (
                    <ul id={listId} role="listbox" aria-label="Search results" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {results.map((l, i) => (
                        <li key={l.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                          <Link
                            to={l.href}
                            onClick={close}
                            tabIndex={-1}
                            onMouseEnter={() => setActive(i)}
                            className={`group flex items-center gap-4 rounded-2xl p-2 pr-4 transition ${i === active ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
                          >
                            <span className="grid h-20 w-24 shrink-0 place-items-center rounded-xl" style={{ background: l.colorway.tile }}>
                              <img src={l.colorway.thumb} alt="" className="w-[88%] -rotate-6 object-contain" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14px] font-semibold">{l.model.name}</span>
                              <span className="block text-[13px] text-[color:var(--muted)]">
                                {l.model.label} · {l.colorway.colorway}
                              </span>
                              <Price listing={l} className="mt-1 text-[13px]" />
                            </span>
                            <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="font-display text-3xl font-black uppercase [font-stretch:75%]">No matches</p>
                      <p className="mt-2 text-[14px] text-[color:var(--muted)]">
                        Nothing in the Air Max line-up matches “{query.trim()}”. Try a colour like red, black or white.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
