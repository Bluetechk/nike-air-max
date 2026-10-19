import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { listingHref } from '../../data/catalog'
import { getColorway, type ColorId } from '../../data/products'
import { useDialog, useScrollLock } from '../../lib/hooks'
import { easeOutExpo } from '../../lib/motion'
import { Link } from '../../lib/router'
import { useShop } from '../../state/shop'
import { ProductGallery } from '../ProductGallery'
import { PurchasePanel } from '../PurchasePanel'

export function QuickView() {
  const { quickView, openQuickView } = useShop()
  const ref = useRef<HTMLDivElement>(null)
  const [picked, setColor] = useState<ColorId>('white')
  const open = !!quickView
  // Until the effect below syncs, fall back to the listing's own colour so a model never renders with a colour it doesn't have.
  const color = quickView && !quickView.model.variants.some((v) => v.color === picked) ? quickView.variant.color : picked
  const close = () => openQuickView(null)

  useEffect(() => {
    if (quickView) setColor(quickView.variant.color)
  }, [quickView])

  useScrollLock(open)
  useDialog(ref, open, close)

  return (
    <AnimatePresence>
      {quickView && (
        <motion.div key="qv" className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${quickView.model.name} ${quickView.colorway.colorway}`}
            className="theme-light relative max-h-[92svh] w-full max-w-[980px] overflow-y-auto overscroll-contain rounded-t-[28px] bg-[#f6f6f4] p-5 text-[#111] shadow-2xl sm:rounded-[28px] sm:p-7"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm transition hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
              <ProductGallery key={color} colorway={getColorway(color)} compact />
              <div>
                <PurchasePanel model={quickView.model} color={color} onColorChange={setColor} compact />
                <Link
                  to={listingHref(quickView.model.slug, color)}
                  onClick={close}
                  className="group mt-5 inline-flex items-center gap-2 text-[14px] font-semibold"
                >
                  View full details
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
