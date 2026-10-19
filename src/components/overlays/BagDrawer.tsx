import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { useRef } from 'react'
import { formatPrice } from '../../data/products'
import { useDialog, useScrollLock } from '../../lib/hooks'
import { easeOutExpo } from '../../lib/motion'
import { Link } from '../../lib/router'
import { useShop } from '../../state/shop'
import { BagLines } from './BagLines'

export function BagDrawer() {
  const { bagOpen, setBagOpen, bag, bagCount, subtotal } = useShop()
  const ref = useRef<HTMLDivElement>(null)
  const close = () => setBagOpen(false)
  useScrollLock(bagOpen)
  useDialog(ref, bagOpen, close)

  return (
    <AnimatePresence>
      {bagOpen && (
        <motion.div key="bag" className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { delay: 0.15 } }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="theme-light absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-[#f6f6f4] text-[#111] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <header className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
              <h2 className="font-display text-2xl font-black uppercase [font-stretch:75%]">
                Bag <span className="text-[color:var(--muted)]">({bagCount})</span>
              </h2>
              <button type="button" onClick={close} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5" data-autofocus>
                <X className="h-5 w-5" />
              </button>
            </header>

            {bag.length ? (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-6">
                  <BagLines onNavigate={close} />
                </div>
                <footer className="border-t border-[color:var(--border)] px-6 py-5">
                  <div className="flex items-center justify-between text-[15px]">
                    <span>Subtotal</span>
                    <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-[color:var(--muted)]">Sample prices. Shipping and tax aren't calculated in this demo.</p>
                  <Link
                    to="/bag"
                    onClick={close}
                    className="mt-4 flex h-14 items-center justify-center rounded-full bg-[#111] text-[14px] font-semibold text-white transition hover:opacity-90"
                  >
                    View bag
                  </Link>
                </footer>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-black/5">
                  <ShoppingBag className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <p className="mt-5 font-display text-3xl font-black uppercase [font-stretch:75%]">Your bag is empty</p>
                <p className="mt-2 text-[14px] text-[color:var(--muted)]">Pick a colourway and a size to add your first pair.</p>
                <Link to="/men" onClick={close} className="mt-6 inline-flex h-12 items-center rounded-full bg-[#111] px-6 text-[13px] font-semibold text-white">
                  Shop Air Max
                </Link>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
