import { useEffect, useState, type RefObject } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Desktop mouse: hover-capable with a precise pointer. Pointer effects only run here. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

let lockCount = 0
/** Lock page scroll while an overlay is open. Counted so stacked overlays don't unlock early. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lockCount++
    const root = document.documentElement
    const gap = window.innerWidth - root.clientWidth
    root.style.overflow = 'hidden'
    root.style.paddingRight = gap ? `${gap}px` : ''
    return () => {
      lockCount--
      if (lockCount === 0) {
        root.style.overflow = ''
        root.style.paddingRight = ''
      }
    }
  }, [active])
}

const focusable =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keep keyboard focus inside a dialog, close it on Escape and hand focus back to
 * whatever opened it.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const node = ref.current
    const first = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(focusable)
    requestAnimationFrame(() => first?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(focusable)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0]
      const z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (opener && document.contains(opener)) opener.focus()
    }
    // onClose is intentionally excluded: callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ref])
}
