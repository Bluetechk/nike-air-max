import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { collections, listings } from '../data/catalog'
import { colorways, products } from '../data/products'
import { useDialog, useScrollLock } from '../lib/hooks'
import { easeOutExpo, staggerContainer, staggerItem, timeline } from '../lib/motion'
import { isActive, Link, useRouter } from '../lib/router'
import { useShop } from '../state/shop'
import { Swoosh } from './Swoosh'

interface NavLink {
  label: string
  href: string
  menu?: { heading: string; links: { label: string; href: string }[] }[]
  colorBase?: string
}

export const navLinks: NavLink[] = [
  {
    label: 'Men',
    href: '/men',
    colorBase: '/men',
    menu: [
      {
        heading: 'Featured',
        links: [
          { label: 'All men’s Air Max', href: '/men' },
          { label: 'Newest first', href: '/men?sort=newest' },
          { label: 'Price: low to high', href: '/men?sort=price-asc' },
        ],
      },
    ],
  },
  {
    label: 'Women',
    href: '/women',
    colorBase: '/women',
    menu: [
      {
        heading: 'Featured',
        links: [
          { label: 'All women’s Air Max', href: '/women' },
          { label: 'Newest first', href: '/women?sort=newest' },
          { label: 'Price: low to high', href: '/women?sort=price-asc' },
          { label: 'Women’s sale', href: '/sale?category=women' },
        ],
      },
    ],
  },
  {
    label: 'Kids',
    href: '/kids',
    colorBase: '/kids',
    menu: [
      {
        heading: 'Featured',
        links: [
          { label: 'All big kids’ Air Max', href: '/kids' },
          { label: 'Newest first', href: '/kids?sort=newest' },
          { label: 'Size guide', href: '/help#sizing' },
          { label: 'Kids’ sale', href: '/sale?category=kids' },
        ],
      },
    ],
  },
  { label: 'Collections', href: '/collections' },
  {
    label: 'Sale',
    href: '/sale',
    menu: [
      {
        heading: 'Shop sale',
        links: [
          { label: 'All sale', href: '/sale' },
          { label: 'Women', href: '/sale?category=women' },
          { label: 'Kids', href: '/sale?category=kids' },
        ],
      },
    ],
  },
]

const iconBtn =
  'relative grid h-10 w-10 place-items-center rounded-full text-[color:var(--fg)] transition duration-300 hover:bg-[color:var(--card-active)] active:scale-95'

function Badge({ count }: { count: number }) {
  if (!count) return null
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
      className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--btn-bg)] px-1 text-[9px] font-semibold leading-none text-[color:var(--btn-fg)]"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  )
}

export function Nav() {
  const { location } = useRouter()
  const { bagCount, wishlist, setBagOpen, setSearchOpen } = useShop()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const drawerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Solid bar once the page moves; tuck away while scrolling down, return on any upward scroll.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (y < 200) setHidden(false)
    else if (y > prev + 6) setHidden(true)
    else if (y < prev - 6) setHidden(false)
  })

  useEffect(() => {
    setMenuOpen(false)
    setDropdown(null)
    setHidden(false)
  }, [location.pathname, location.search])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])
  useEffect(() => {
    if (!dropdown) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDropdown(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dropdown])

  useScrollLock(menuOpen)
  useDialog(drawerRef, menuOpen, () => setMenuOpen(false))

  const openSoon = (label: string) => {
    window.clearTimeout(closeTimer.current)
    setDropdown(label)
  }
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setDropdown(null), 140)
  }
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdown(null)
  }

  const solid = scrolled || !!dropdown

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden && !dropdown && !menuOpen ? '-translate-y-full' : ''}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b bg-[color:var(--panel)] backdrop-blur-xl transition-opacity duration-500 ${solid ? 'border-[color:var(--border)] opacity-100' : 'border-transparent opacity-0'}`}
      />
      <motion.nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10"
        initial="hidden"
        animate="show"
        variants={staggerContainer(timeline.nav, 0.06)}
      >
        <motion.div variants={staggerItem}>
          <Link to="/" aria-label="Nike Air Max home" className="block rounded-md text-[color:var(--fg)] transition-opacity hover:opacity-70">
            <Swoosh className="h-6 w-auto lg:h-7" />
          </Link>
        </motion.div>

        <ul className="hidden items-center gap-8 md:flex lg:gap-11">
          {navLinks.map((l) => {
            const active = isActive(location.pathname, l.href)
            const open = dropdown === l.label
            return (
              <motion.li
                key={l.label}
                variants={staggerItem}
                onMouseEnter={() => (l.menu ? openSoon(l.label) : setDropdown(null))}
                onMouseLeave={closeSoon}
                onFocus={() => (l.menu ? openSoon(l.label) : setDropdown(null))}
                onBlur={onBlur}
              >
                <Link
                  to={l.href}
                  aria-current={active ? 'page' : undefined}
                  aria-haspopup={l.menu ? 'true' : undefined}
                  aria-expanded={l.menu ? open : undefined}
                  className="group relative flex items-center gap-1 rounded py-2 text-[13px] font-medium tracking-wide text-[color:var(--fg)]"
                >
                  {l.label}
                  {l.menu && (
                    <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-300 ${open ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                  )}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  />
                  {active && <span className="sr-only">(current page)</span>}
                </Link>

                <AnimatePresence>
                  {open && l.menu && (
                    <motion.div
                      key="dd"
                      className="absolute inset-x-0 top-full border-b border-[color:var(--border)] bg-[color:var(--panel-solid)] text-[color:var(--fg)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]"
                      initial={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
                      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                      exit={{ opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0)' }}
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                    >
                      <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_1fr_1.2fr] gap-10 px-10 py-10">
                        {l.colorBase ? (
                          <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Shop by colour</p>
                            <ul className="mt-4 space-y-2">
                              {colorways.filter((c) => listings.some((x) => x.variant.color === c.id && `/${x.model.category}` === l.colorBase)).map((c) => (
                                <li key={c.id}>
                                  <Link to={`${l.colorBase}?color=${c.id}`} className="group/c flex items-center gap-3 rounded-xl py-1.5 text-[15px] font-medium">
                                    <span className="grid h-11 w-14 place-items-center rounded-lg" style={{ background: c.tile }}>
                                      <img src={c.thumb} alt="" className="w-[88%] -rotate-6 object-contain transition-transform duration-500 group-hover/c:-rotate-12 group-hover/c:scale-110" />
                                    </span>
                                    <span className="transition-transform duration-500 group-hover/c:translate-x-1">{c.colorway}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div />
                        )}
                        {l.menu.map((col) => (
                          <div key={col.heading}>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{col.heading}</p>
                            <ul className="mt-4 space-y-3">
                              {col.links.map((x) => (
                                <li key={x.href}>
                                  <Link to={x.href} className="text-[15px] font-medium transition-opacity hover:opacity-60">
                                    {x.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link to="/collections" className="group/f relative block overflow-hidden rounded-2xl">
                          <img
                            src={collections[0].image.src}
                            alt=""
                            className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/f:scale-105"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-4 left-4 flex items-center gap-2 font-display text-2xl font-black uppercase text-white [font-stretch:75%]">
                            Explore collections <ArrowUpRight className="h-5 w-5" />
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <motion.button variants={staggerItem} type="button" aria-label="Search products" onClick={() => setSearchOpen(true)} className={iconBtn}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </motion.button>
          <motion.div variants={staggerItem} className="hidden sm:block">
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} saved`}
              aria-current={location.pathname === '/wishlist' ? 'page' : undefined}
              className={iconBtn}
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <Badge count={wishlist.length} />
            </Link>
          </motion.div>
          <motion.div variants={staggerItem} className="hidden sm:block">
            <Link to="/account" aria-label="Account" aria-current={location.pathname === '/account' ? 'page' : undefined} className={iconBtn}>
              <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </Link>
          </motion.div>
          <motion.button
            variants={staggerItem}
            type="button"
            aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
            onClick={() => setBagOpen(true)}
            className={iconBtn}
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <Badge count={bagCount} />
          </motion.button>
          <motion.button
            variants={staggerItem}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={`${iconBtn} md:hidden`}
          >
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              ref={drawerRef}
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(380px,88vw)] flex-col overflow-y-auto bg-[color:var(--panel-solid)] p-6 text-[color:var(--fg)] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.55, ease: easeOutExpo }}
            >
              <div className="flex items-center justify-between">
                <Swoosh className="h-6 w-auto" />
                <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className={iconBtn} data-autofocus>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="mt-10 space-y-1">
                {[{ label: 'Home', href: '/' }, ...navLinks].map((l, i) => {
                  const active = isActive(location.pathname, l.href)
                  return (
                    <motion.li
                      key={l.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: easeOutExpo }}
                    >
                      <Link
                        to={l.href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center justify-between rounded-lg py-2.5 font-display text-[2rem] font-extrabold uppercase leading-none tracking-tight [font-stretch:80%] transition-opacity hover:opacity-60 ${active ? '' : 'opacity-80'}`}
                      >
                        {l.label}
                        {active && <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
              <motion.div
                className="mt-8 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                {products.map((c) => (
                  <Link key={c.id} to={`/men?color=${c.id}`} aria-label={`Shop ${c.colorway}`} className="grid h-16 flex-1 place-items-center rounded-xl" style={{ background: c.tile }}>
                    <img src={c.thumb} alt="" className="w-[80%] -rotate-6 object-contain" />
                  </Link>
                ))}
              </motion.div>
              <div className="mt-auto space-y-3 pt-10 text-[15px]">
                <Link to="/wishlist" className="flex items-center gap-3 text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                  <Heart className="h-4 w-4" /> Wishlist {wishlist.length ? `(${wishlist.length})` : ''}
                </Link>
                <Link to="/account" className="flex items-center gap-3 text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                  <User className="h-4 w-4" /> Account
                </Link>
                <Link to="/help" className="flex items-center gap-3 text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                  <ArrowUpRight className="h-4 w-4" /> Help
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
