import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { formatPrice, products } from '../data/products'
import { cardItem, easeOutExpo, staggerContainer, timeline } from '../lib/motion'

interface ProductSelectorProps {
  activeIndex: number
  onSelect: (index: number) => void
  onStep: (dir: 1 | -1) => void
  /** Only scroll the active card into view after the user has interacted. */
  userChanged: boolean
}

const arrowBtn =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--fg)] backdrop-blur-md transition duration-300 hover:bg-[color:var(--card-active)] hover:-translate-y-0.5 active:scale-95'

export function ProductSelector({ activeIndex, onSelect, onStep, userChanged }: ProductSelectorProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!userChanged) return
    const list = listRef.current
    const card = list?.children[activeIndex] as HTMLElement | undefined
    if (!list || !card || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: card.offsetLeft - list.offsetLeft - 16, behavior: 'smooth' })
  }, [activeIndex, userChanged])

  return (
    <motion.div
      className="flex items-center gap-2 sm:gap-3"
      initial="hidden"
      animate="show"
      variants={staggerContainer(timeline.cards, 0.09)}
      role="group"
      aria-label="Choose a colorway"
    >
      <motion.button
        variants={cardItem}
        type="button"
        aria-label="Previous colorway"
        onClick={() => onStep(-1)}
        className={`${arrowBtn} hidden sm:grid`}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
      </motion.button>

      <ul
        ref={listRef}
        className="no-scrollbar -mx-4 flex scroll-px-4 sm:scroll-px-0 min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-none sm:px-0 lg:overflow-visible"
      >
        {products.map((p, i) => {
          const active = i === activeIndex
          return (
            <motion.li key={p.id} variants={cardItem} className="snap-start">
              <button
                type="button"
                aria-pressed={active}
                aria-label={`${p.name}, ${p.colorway}, ${formatPrice(p.price)}`}
                onClick={() => onSelect(i)}
                className={`group relative flex w-[212px] items-center gap-3 overflow-hidden rounded-2xl border border-[color:var(--border)] p-2.5 pr-4 text-left backdrop-blur-md transition-[background-color,transform,box-shadow] duration-500 hover:-translate-y-1 sm:w-[232px] lg:w-[248px] ${
                  active ? 'bg-[color:var(--card-active)] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]' : 'bg-[color:var(--card)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-card-ring"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl border-[1.5px] border-[color:var(--fg)]"
                    transition={{ duration: 0.6, ease: easeOutExpo }}
                  />
                )}
                <span className="relative grid h-[58px] w-[84px] shrink-0 place-items-center rounded-xl bg-[color:var(--thumb)]">
                  <img
                    src={p.thumb}
                    alt=""
                    width={360}
                    height={246}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-[92%] -rotate-6 object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:scale-110"
                  />
                </span>
                <span className="relative min-w-0">
                  <span className="block truncate text-[13px] font-semibold leading-tight">{p.name}</span>
                  <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[11.5px] text-[color:var(--muted)]">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-[color:var(--border)]"
                      style={{ background: p.swatch }}
                    />
                    {p.colorway}
                  </span>
                  <span className="mt-1 block text-[12.5px] font-medium tabular-nums">{formatPrice(p.price)}</span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>

      <motion.button
        variants={cardItem}
        type="button"
        aria-label="Next colorway"
        onClick={() => onStep(1)}
        className={`${arrowBtn} hidden sm:grid`}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
      </motion.button>
    </motion.div>
  )
}
