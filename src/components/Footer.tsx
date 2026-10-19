import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUp, Check, Heart } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { easeOutExpo } from '../lib/motion'
import { Link } from '../lib/router'
import { socialIcons, socialLinks } from './SocialRail'
import { Swoosh } from './Swoosh'

const columns = [
  {
    heading: 'Shop',
    links: [
      { label: 'Men', href: '/men' },
      { label: 'Women', href: '/women' },
      { label: 'Kids', href: '/kids' },
      { label: 'Sale', href: '/sale' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    heading: 'Collections',
    links: [
      { label: 'University Red', href: '/men?color=red' },
      { label: 'Blackout', href: '/women?color=black' },
      { label: 'Studio White', href: '/men?color=white' },
      { label: 'All collections', href: '/collections' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Size guide', href: '/help#sizing' },
      { label: 'Shipping', href: '/help#shipping' },
      { label: 'Returns', href: '/help#returns' },
      { label: 'Contact', href: '/help#contact' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'The Air Max story', href: '/about' },
      { label: 'About this demo', href: '/about#demo' },
      { label: 'Your bag', href: '/bag' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  const id = useId()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState('error')
      return
    }
    setState('done')
    setEmail('')
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="font-display text-3xl font-black uppercase leading-none [font-stretch:75%] sm:text-4xl">
        Stay in the air
      </label>
      <p className="mt-3 text-[14px] text-[color:var(--muted)]">Drops, restocks and campaign stories. Sign-up preview only.</p>
      <div className={`mt-5 flex h-14 items-center rounded-full border pl-5 pr-1.5 transition ${state === 'error' ? 'border-[#ff6b6b]' : 'border-[color:var(--border)] focus-within:border-[color:var(--fg)]'}`}>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state !== 'idle') setState('idle')
          }}
          placeholder="Email address"
          aria-invalid={state === 'error'}
          aria-describedby={`${id}-msg`}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-[color:var(--muted)] focus:outline-none"
        />
        <button type="submit" aria-label="Sign up" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--fg)] text-[color:var(--btn-fg)] transition hover:scale-105 active:scale-95">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <div id={`${id}-msg`} className="mt-2 min-h-[20px] text-[13px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {state === 'error' && (
            <motion.p key="e" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#ff8a8a]">
              Enter a valid email address.
            </motion.p>
          )}
          {state === 'done' && (
            <motion.p key="d" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease: easeOutExpo }} className="flex items-center gap-1.5 text-[color:var(--fg)]">
              <Check className="h-4 w-4" /> Thanks. This is a demo, so no email was stored or sent.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="theme-dark relative overflow-hidden bg-[#0d0d0e] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-16 sm:px-6 lg:px-10 lg:pt-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <Newsletter />
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 lg:gap-x-16">
            {columns.map((c) => (
              <div key={c.heading}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{c.heading}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.href} className="text-[14px] transition-opacity hover:opacity-60">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div aria-hidden="true" className="pointer-events-none mt-16 select-none overflow-hidden lg:mt-24">
          <p className="whitespace-nowrap font-display text-[24vw] font-black uppercase leading-[0.75] tracking-[-0.02em] text-white/[0.06] [font-stretch:62%] lg:text-[19vw]">
            Air Max
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-6 border-t border-[color:var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[12px] text-[color:var(--muted)]">
            <Swoosh className="h-4 w-auto text-[color:var(--fg)]" />
            <span>© {new Date().getFullYear()} Air Max concept store. Frontend demo, not affiliated with Nike, Inc.</span>
          </div>
          <p className="group flex items-center gap-2 text-[13px] text-[color:var(--muted)]">
            Built with
            <Heart className="beat h-4 w-4 fill-[#e5242c] text-[#e5242c]" aria-label="love" />
            by <span className="font-semibold text-[color:var(--fg)]">Solomon Konisear</span>
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={l.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)] transition hover:-translate-y-0.5 hover:border-[color:var(--fg)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  {socialIcons[l.key]}
                </svg>
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
                document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true })
              }}
              className="group ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--fg)] pl-4 pr-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--btn-fg)]"
            >
              Back to top
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
