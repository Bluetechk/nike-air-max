import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getListing, type Listing } from '../data/catalog'
import type { ColorId } from '../data/products'

/**
 * Frontend-only bag and wishlist. State lives in this browser's localStorage;
 * nothing is sent anywhere, there is no checkout and no payment.
 */

export interface BagLine {
  slug: string
  color: ColorId
  size: string
  qty: number
}

export interface WishItem {
  slug: string
  color: ColorId
}

export interface BagEntry extends BagLine {
  key: string
  listing: Listing
}

export interface Confirmation {
  id: number
  listing: Listing
  size: string
}

interface ShopValue {
  bag: BagEntry[]
  bagCount: number
  subtotal: number
  addToBag: (slug: string, color: ColorId, size: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  removeFromBag: (key: string) => void
  wishlist: Listing[]
  isWished: (slug: string, color: ColorId) => boolean
  toggleWish: (slug: string, color: ColorId) => void
  bagOpen: boolean
  setBagOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  quickView: Listing | null
  openQuickView: (listing: Listing | null) => void
  confirmation: Confirmation | null
  dismissConfirmation: () => void
  notice: { id: number; message: string } | null
  notify: (message: string) => void
}

const ShopContext = createContext<ShopValue | null>(null)

const BAG_KEY = 'am-bag-v1'
const WISH_KEY = 'am-wishlist-v1'
const MAX_QTY = 10

const lineKey = (l: Pick<BagLine, 'slug' | 'color' | 'size'>) => `${l.slug}:${l.color}:${l.size}`

/** Read stored state defensively: anything malformed or no longer in the catalogue is dropped. */
function load<T>(key: string, valid: (item: unknown) => item is T): T[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(raw) ? raw.filter(valid) : []
  } catch {
    return []
  }
}

const isBagLine = (x: unknown): x is BagLine => {
  const l = x as BagLine
  return (
    !!l &&
    typeof l.slug === 'string' &&
    typeof l.size === 'string' &&
    Number.isInteger(l.qty) &&
    l.qty > 0 &&
    !!getListing(l.slug, l.color) &&
    !!getListing(l.slug, l.color)?.model.sizes.includes(l.size)
  )
}
const isWishItem = (x: unknown): x is WishItem => {
  const w = x as WishItem
  return !!w && typeof w.slug === 'string' && !!getListing(w.slug, w.color)
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode or full storage: state still works for this visit */
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>(() => load(BAG_KEY, isBagLine))
  const [wish, setWish] = useState<WishItem[]>(() => load(WISH_KEY, isWishItem))
  const [bagOpen, setBagOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickView, openQuickView] = useState<Listing | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(null)
  const confirmTimer = useRef<number | undefined>(undefined)
  const noticeTimer = useRef<number | undefined>(undefined)

  useEffect(() => save(BAG_KEY, lines), [lines])
  useEffect(() => save(WISH_KEY, wish), [wish])

  // Keep tabs in sync when the bag changes in another window.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === BAG_KEY) setLines(load(BAG_KEY, isBagLine))
      if (e.key === WISH_KEY) setWish(load(WISH_KEY, isWishItem))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(confirmTimer.current)
      window.clearTimeout(noticeTimer.current)
    },
    [],
  )

  const addToBag = useCallback((slug: string, color: ColorId, size: string, qty = 1) => {
    const listing = getListing(slug, color)
    if (!listing) return
    setLines((prev) => {
      const key = lineKey({ slug, color, size })
      const found = prev.find((l) => lineKey(l) === key)
      if (found) return prev.map((l) => (l === found ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      return [...prev, { slug, color, size, qty }]
    })
    window.clearTimeout(confirmTimer.current)
    setConfirmation({ id: Date.now(), listing, size })
    confirmTimer.current = window.setTimeout(() => setConfirmation(null), 4200)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => lineKey(l) !== key) : prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    )
  }, [])

  const removeFromBag = useCallback((key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), [])

  const toggleWish = useCallback((slug: string, color: ColorId) => {
    setWish((prev) =>
      prev.some((w) => w.slug === slug && w.color === color)
        ? prev.filter((w) => !(w.slug === slug && w.color === color))
        : [...prev, { slug, color }],
    )
  }, [])

  const notify = useCallback((message: string) => {
    window.clearTimeout(noticeTimer.current)
    setNotice({ id: Date.now(), message })
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3600)
  }, [])

  const value = useMemo<ShopValue>(() => {
    const bag = lines.map((l) => ({ ...l, key: lineKey(l), listing: getListing(l.slug, l.color)! }))
    return {
      bag,
      bagCount: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: bag.reduce((n, l) => n + l.qty * l.listing.variant.price, 0),
      addToBag,
      setQty,
      removeFromBag,
      wishlist: wish.map((w) => getListing(w.slug, w.color)!).filter(Boolean),
      isWished: (slug, color) => wish.some((w) => w.slug === slug && w.color === color),
      toggleWish,
      bagOpen,
      setBagOpen,
      searchOpen,
      setSearchOpen,
      quickView,
      openQuickView,
      confirmation,
      dismissConfirmation: () => setConfirmation(null),
      notice,
      notify,
    }
  }, [lines, wish, bagOpen, searchOpen, quickView, confirmation, notice, addToBag, setQty, removeFromBag, toggleWish, notify])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
