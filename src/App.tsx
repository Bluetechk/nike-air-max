import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { BagDrawer } from './components/overlays/BagDrawer'
import { QuickView } from './components/overlays/QuickView'
import { SearchOverlay } from './components/overlays/SearchOverlay'
import { Toasts } from './components/overlays/Toasts'
import { Cursor } from './components/ui/Cursor'
import { page } from './lib/motion'
import { matchPath, restoreScroll, RouterProvider, useRouter } from './lib/router'
import { applyDarkTheme, applyLightTheme } from './lib/theme'
import About from './pages/About'
import Account from './pages/Account'
import Bag from './pages/Bag'
import Collections from './pages/Collections'
import Help from './pages/Help'
import Home from './pages/Home'
import Kids from './pages/Kids'
import Men from './pages/Men'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Sale from './pages/Sale'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import Women from './pages/Women'
import { ShopProvider } from './state/shop'

const routes: { path: string; title: string; dark?: boolean; render: (params: Record<string, string>) => ReactNode }[] = [
  { path: '/', title: 'Nike Air Max — Feel the future', render: () => <Home /> },
  { path: '/men', dark: true, title: 'Men’s Air Max', render: () => <Men /> },
  { path: '/women', title: 'Women’s Air Max', render: () => <Women /> },
  { path: '/kids', title: 'Big Kids’ Air Max', render: () => <Kids /> },
  { path: '/collections', dark: true, title: 'Air Max Collections', render: () => <Collections /> },
  { path: '/sale', dark: true, title: 'Air Max Sale', render: () => <Sale /> },
  { path: '/product/:slug', title: '', render: (p) => <Product slug={p.slug} /> },
  { path: '/search', title: 'Search', render: () => <Search /> },
  { path: '/bag', title: 'Your bag', render: () => <Bag /> },
  { path: '/wishlist', title: 'Wishlist', render: () => <Wishlist /> },
  { path: '/account', title: 'Account', render: () => <Account /> },
  { path: '/help', title: 'Help', render: () => <Help /> },
  { path: '/about', dark: true, title: 'The Air Max story', render: () => <About /> },
]

function resolve(pathname: string) {
  for (const r of routes) {
    const params = matchPath(r.path, pathname)
    if (params) return { route: r, params }
  }
  return null
}

function Pages() {
  const { location, isPop } = useRouter()
  const match = resolve(location.pathname)

  useEffect(() => {
    // The home hero sets its own colourway theme; other pages pick a palette that suits their opening banner.
    if (location.pathname !== '/') {
      if (match?.route.dark) applyDarkTheme()
      else applyLightTheme()
    }
    if (match?.route.title) document.title = match.route.title
    else if (!match) document.title = 'Page not found'
  }, [location.pathname, match])

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => restoreScroll(location, isPop)}>
      <motion.main
        id="main"
        tabIndex={-1}
        key={location.pathname}
        variants={page}
        initial="initial"
        animate="enter"
        exit="exit"
        className="outline-none"
      >
        {match ? match.route.render(match.params) : <NotFound />}
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <ShopProvider>
        <MotionConfig reducedMotion="user">
          <a
            href="#main"
            className="sr-only rounded-full bg-[#111] px-5 py-3 text-[13px] font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100]"
          >
            Skip to content
          </a>
          <Nav />
          <Pages />
          <Footer />
          <BagDrawer />
          <SearchOverlay />
          <QuickView />
          <Toasts />
          <Cursor />
        </MotionConfig>
      </ShopProvider>
    </RouterProvider>
  )
}
