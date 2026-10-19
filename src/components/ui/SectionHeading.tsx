import type { ReactNode } from 'react'
import { LineReveal, Reveal } from './Reveal'

/** Kicker, oversized line-revealed headline and optional intro. Used on every page for a consistent rhythm. */
export function SectionHeading({
  kicker,
  lines,
  intro,
  as = 'h2',
  className = '',
  size = 'lg',
}: {
  kicker?: string
  lines: string[]
  intro?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
  size?: 'md' | 'lg' | 'xl'
}) {
  const sizes = {
    md: 'text-[clamp(2.6rem,7vw,5rem)]',
    lg: 'text-[clamp(3.2rem,10vw,8.5rem)]',
    xl: 'text-[clamp(4rem,15vw,13rem)]',
  }
  return (
    <header className={className}>
      {kicker && (
        <Reveal as="p" className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          {kicker}
        </Reveal>
      )}
      <LineReveal as={as} lines={lines} className={`font-display font-black uppercase leading-[0.84] tracking-[-0.01em] [font-stretch:70%] ${sizes[size]}`} />
      {intro && (
        <Reveal delay={0.2} className="mt-6 max-w-xl text-[16px] leading-relaxed text-[color:var(--muted)] lg:text-[17px]">
          {intro}
        </Reveal>
      )}
    </header>
  )
}
