import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion'
import { products, type Product } from '../data/products'
import { shoeVariants, timeline, type ShoeCustom } from '../lib/motion'

interface ShoeStageProps {
  product: Product
  custom: ShoeCustom
  mx: MotionValue<number>
  my: MotionValue<number>
}

export function ShoeStage({ product, custom, mx, my }: ShoeStageProps) {
  const x = useTransform(mx, (v) => v * 18)
  const y = useTransform(my, (v) => v * 12)
  const rotateY = useTransform(mx, (v) => v * 7)
  const rotateX = useTransform(my, (v) => v * -5)
  const shadowX = useTransform(mx, (v) => v * 10)

  // The first float cycle waits for the entrance to settle; later swaps start floating sooner.
  const floatDelay = custom.intro ? '2s' : '1s'

  return (
    <div className="relative h-full w-full [perspective:1400px]">
      {/* Per-colourway light behind the product, crossfaded. */}
      {products.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[78%] rounded-full"
          style={{ x: '-50%', y: '-50%', background: `radial-gradient(closest-side, ${p.theme.glow}, transparent)` }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: p.id === product.id ? 1 : 0, scale: p.id === product.id ? 1 : 0.85 }}
          transition={{
            opacity: { duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: custom.intro ? timeline.shoe : 0 },
            scale: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: custom.intro ? timeline.shoe : 0 },
          }}
        />
      ))}

      {/* Contact shadow: breathes in sync with the float so the shoe reads as suspended. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3%] left-[16%] h-[9%] w-[72%]"
        style={{ x: shadowX }}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: custom.intro ? timeline.shoe + 0.35 : 0 }}
      >
        <div
          className="shoe-shadow h-full w-full rounded-[50%] blur-xl transition-[background] duration-1000"
          style={{ background: `radial-gradient(closest-side, ${product.theme.shadow}, transparent)`, animationDelay: floatDelay }}
        />
      </motion.div>

      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ x, y, rotateX, rotateY }}>
        <AnimatePresence initial custom={custom}>
          <motion.div
            key={product.id}
            custom={custom}
            variants={shoeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <div className="shoe-float w-full" style={{ animationDelay: floatDelay }}>
              <img
                src={product.image}
                srcSet={`${product.imageSmall} 900w, ${product.image} 1600w`}
                sizes="(min-width: 1024px) 60vw, 92vw"
                width={1600}
                height={1095}
                alt={product.alt}
                draggable={false}
                decoding="async"
                fetchPriority={custom.intro ? 'high' : 'auto'}
                className="mx-auto block h-auto max-h-full w-full select-none object-contain"
                style={{ filter: `drop-shadow(0 28px 34px ${product.theme.shadow})` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
