import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

/**
 * A deliberately small History API router. The site has a handful of flat routes,
 * so a dependency would add weight without adding anything we need.
 */

export interface Location {
  pathname: string
  search: string
  hash: string
}

interface RouterValue {
  location: Location
  navigate: (to: string, opts?: { replace?: boolean; keepScroll?: boolean }) => void
  /** True when the last change came from the back/forward buttons. */
  isPop: boolean
}

const RouterContext = createContext<RouterValue | null>(null)

const read = (): Location => ({
  pathname: window.location.pathname.replace(/\/+$/, '') || '/',
  search: window.location.search,
  hash: window.location.hash,
})

const SCROLL_KEY = 'am-scroll'
const scrollPositions: Record<string, number> = (() => {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}')
  } catch {
    return {}
  }
})()
const historyKey = () => (window.history.state as { key?: string } | null)?.key ?? 'root'
const newKey = () => Math.random().toString(36).slice(2, 10)

export function saveScroll() {
  scrollPositions[historyKey()] = window.scrollY
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(scrollPositions))
  } catch {
    /* storage unavailable: restoration simply falls back to the top */
  }
}

/** Where the page should land after a route change: saved position on back/forward, the hash target, or the top. */
export function restoreScroll(location: Location, isPop: boolean) {
  if (isPop) {
    window.scrollTo(0, scrollPositions[historyKey()] ?? 0)
    return
  }
  if (location.hash) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el) {
      el.scrollIntoView()
      return
    }
  }
  window.scrollTo(0, 0)
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => ({ location: read(), isPop: false }))

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (!window.history.state?.key) window.history.replaceState({ key: 'root' }, '')
    const onPop = () => setState({ location: read(), isPop: true })
    window.addEventListener('popstate', onPop)
    // Remember where the user was before leaving or reloading.
    window.addEventListener('pagehide', saveScroll)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('pagehide', saveScroll)
    }
  }, [])

  const navigate = useCallback<RouterValue['navigate']>((to, opts = {}) => {
    const url = new URL(to, window.location.href)
    const same = url.pathname === window.location.pathname && url.search === window.location.search
    if (same && url.hash === window.location.hash && !opts.replace) {
      if (!url.hash) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (opts.replace) {
      window.history.replaceState({ key: historyKey() }, '', url)
    } else {
      saveScroll()
      window.history.pushState({ key: newKey() }, '', url)
    }
    const next = read()
    setState({ location: next, isPop: false })
    // In-page jumps and query edits don't swap the page, so handle their scroll here.
    if (same && url.hash && !opts.keepScroll) {
      requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }))
    }
  }, [])

  const value = useMemo(() => ({ ...state, navigate }), [state, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider')
  return ctx
}

export function useSearchParams() {
  const { location } = useRouter()
  return useMemo(() => new URLSearchParams(location.search), [location.search])
}

/** Match "/product/:slug" style patterns. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean)
  const s = pathname.split('/').filter(Boolean)
  if (p.length !== s.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i])
    else if (p[i] !== s[i]) return null
  }
  return params
}

export function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0]
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; replace?: boolean }

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== '_self') return
    e.preventDefault()
    navigate(to, { replace })
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
