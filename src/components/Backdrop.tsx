import { motion } from 'framer-motion'
import { products, type ProductId } from '../data/products'

const crossfade = { duration: 1.2, ease: [0.4, 0, 0.2, 1] as const }

/** Layered studio environments. Every colourway keeps its own layer so a switch is a true crossfade, never a flash. */
export function Backdrop({ active }: { active: ProductId }) {
  const isRed = active === 'red'
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {products.map((p) => (
        <motion.div
          key={p.id}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: p.id === active ? 1 : 0 }}
          transition={crossfade}
          style={{
            background: `radial-gradient(120% 95% at 68% 42%, ${p.theme.bgFrom} 0%, ${p.theme.bgTo} 100%)`,
          }}
        />
      ))}

      {/* Crimson studio: a hot core behind the product, a cooler falloff and a soft key light from the top left. */}
      <motion.div className="absolute inset-0" initial={false} animate={{ opacity: isRed ? 1 : 0 }} transition={crossfade}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 12% 0%, rgba(255,190,170,0.16) 0%, transparent 70%),' +
              'linear-gradient(180deg, transparent 55%, rgba(40,0,3,0.45) 100%)',
          }}
        />
        <motion.div
          className="absolute left-[66%] top-[46%] aspect-square w-[min(1100px,110vw)] rounded-full"
          style={{
            x: '-50%',
            y: '-50%',
            background: 'radial-gradient(closest-side, rgba(255,86,64,0.5) 0%, rgba(230,30,36,0.2) 50%, transparent 100%)',
          }}
          initial={false}
          animate={{ scale: isRed ? 1 : 0.6 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* Soft top light shared by the neutral studios. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: active === 'white' ? 1 : active === 'black' ? 0.35 : 0 }}
        transition={crossfade}
        style={{ background: 'radial-gradient(70% 55% at 60% 8%, rgba(255,255,255,0.55) 0%, transparent 70%)' }}
      />

      {/* Vignette keeps edges calm and focuses the eye on the product. */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(140% 110% at 60% 45%, transparent 55%, rgba(0,0,0,0.14) 100%)' }}
      />
    </motion.div>
  )
}
