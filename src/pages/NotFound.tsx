import { Link } from '../lib/router'

export default function NotFound() {
  return (
    <div className="theme-light flex min-h-[80svh] flex-col items-center justify-center bg-[#f6f6f4] px-6 pt-24 text-center text-[color:var(--fg)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">404</p>
      <h1 className="mt-4 font-display text-[clamp(3.6rem,12vw,9rem)] font-black uppercase leading-[0.84] [font-stretch:64%]">Out of bounds</h1>
      <p className="mt-4 max-w-md text-[16px] text-[color:var(--muted)]">This page doesn’t exist. The shoes are still where you left them.</p>
      <Link to="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#111] px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
        Back home
      </Link>
    </div>
  )
}
