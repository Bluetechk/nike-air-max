import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { formatPrice } from '../../data/products'
import { easeOutExpo } from '../../lib/motion'
import { useShop } from '../../state/shop'

/** Add-to-bag confirmation (top right) and general notices (bottom centre). */
export function Toasts() {
  const { confirmation, dismissConfirmation, setBagOpen, notice } = useShop()
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-[60] flex justify-end px-4 sm:px-6 lg:top-[88px] lg:px-10" role="status" aria-live="polite">
        <AnimatePresence>
          {confirmation && (
            <motion.div
              key={confirmation.id}
              className="theme-light pointer-events-auto w-full max-w-[360px] overflow-hidden rounded-3xl bg-[#f6f6f4] p-4 text-[#111] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[13px] font-semibold">
                  <motion.span
                    className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </motion.span>
                  Added to bag
                </p>
                <button type="button" onClick={dismissConfirmation} aria-label="Dismiss" className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <motion.span
                  className="grid h-[72px] w-[88px] shrink-0 place-items-center rounded-2xl"
                  style={{ background: confirmation.listing.colorway.tile }}
                  initial={{ rotate: -8, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                >
                  <img src={confirmation.listing.colorway.thumb} alt="" className="w-[88%] -rotate-6 object-contain" />
                </motion.span>
                <div className="min-w-0 text-[13px]">
                  <p className="font-semibold">{confirmation.listing.model.name}</p>
                  <p className="text-[color:var(--muted)]">
                    {confirmation.listing.colorway.colorway} · Size {confirmation.size}
                  </p>
                  <p className="font-medium tabular-nums">{formatPrice(confirmation.listing.variant.price)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  dismissConfirmation()
                  setBagOpen(true)
                }}
                className="mt-4 h-11 w-full rounded-full bg-[#111] text-[13px] font-semibold text-white transition hover:opacity-90"
              >
                View bag
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4" role="status" aria-live="polite">
        <AnimatePresence>
          {notice && (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="max-w-md rounded-full bg-[#111] px-5 py-3 text-center text-[13px] font-medium text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)]"
            >
              {notice.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
