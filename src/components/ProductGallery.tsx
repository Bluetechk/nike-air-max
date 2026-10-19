import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, type PointerEvent } from 'react'
import type { Colorway } from '../data/products'
import { useFinePointer } from '../lib/hooks'
import { easeOutExpo } from '../lib/motion'
import { tileBackground } from './ProductCard'

interface Props {
  colorway: Colorway
  /** Smaller layout for the quick-view modal. */
  compact?: boolean
}

/**
 * Product gallery: large stage, thumbnails, pointer zoom on desktop and swipe on touch.
 * The parent keys it by colourway, so switching colour starts again on the hero angle.
 */
export function ProductGallery({ colorway, compact = false }: Props) {
  const images = [
    { src: colorway.image, srcSet: `${colorway.imageSmall} 900w, ${colorway.image} 1600w`, thumb: colorway.thumb, alt: colorway.alt },
    ...colorway.angles.map((a) => ({ src: a.src, srcSet: undefined, thumb: a.thumb, alt: a.alt })),
  ]
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const canZoom = fine && !compact

  const go = (next: number) => {
    const target = (next + images.length) % images.length
    if (target === index) return
    setState([target, target > index ? 1 : -1])
    setZoom(null)
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!canZoom || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const img = images[index]
  const dark = colorway.dark

  return (
    <div className={`flex flex-col gap-3 ${compact ? '' : 'lg:flex-row-reverse'}`}>
      <div
        className={`relative overflow-hidden rounded-[26px] ${compact ? 'aspect-[5/4]' : 'aspect-square lg:flex-1'}`}
        style={{ background: tileBackground(colorway.tile, dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.75)') }}
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
        data-cursor={canZoom ? undefined : 'DRAG'}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={img.src}
            custom={dir}
            className="absolute inset-0 flex items-center justify-center p-[7%]"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: `${dir * 8}%` }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: `${dir * -8}%` }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
            drag={fine ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) go(index + 1)
              else if (info.offset.x > 50 || info.velocity.x > 400) go(index - 1)
            }}
          >
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes={compact ? '(min-width: 768px) 420px, 90vw' : '(min-width: 1024px) 50vw, 92vw'}
              alt={img.alt}
              draggable={false}
              decoding="async"
              className={`max-h-full w-full select-none object-contain drop-shadow-[0_28px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${canZoom ? 'cursor-zoom-in' : ''}`}
              style={
                zoom
                  ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%`, cursor: 'zoom-out' }
                  : { transform: 'scale(1)', transformOrigin: 'center' }
              }
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
        <div className={`absolute inset-x-3 bottom-3 flex items-center justify-between ${fine ? 'opacity-90' : ''}`}>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#111] shadow-sm transition hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className={`rounded-full px-3 py-1 text-[12px] font-semibold tabular-nums ${dark ? 'bg-black/30 text-white' : 'bg-white/80 text-[#111]'}`}>
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#111] shadow-sm transition hover:scale-105 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        )}
      </div>

      {images.length > 1 && (
      <ul className={`flex gap-2 ${compact ? '' : 'lg:w-[88px] lg:flex-col'}`} aria-label="Product images">
        {images.map((im, i) => (
          <li key={im.src} className={compact ? 'w-[72px]' : 'w-[72px] lg:w-full'}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}: ${im.alt}`}
              aria-current={i === index}
              className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border-2 transition duration-300 ${
                i === index ? 'border-[color:var(--fg)]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ background: colorway.tile }}
            >
              <img src={im.thumb} alt="" loading="lazy" className="w-[86%] object-contain" />
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  )
}
