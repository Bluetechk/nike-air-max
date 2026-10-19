import { ImageReveal, LineReveal, Reveal } from '../components/ui/Reveal'
import { Link } from '../lib/router'

export default function About() {
  return (
    <div className="theme-dark bg-[#0e0e0f] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <Reveal as="p" className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          About
        </Reveal>
        <LineReveal as="h1" lines={['The Air', 'Max story']} className="font-display text-[clamp(4rem,13vw,11rem)] font-black uppercase leading-[0.82] [font-stretch:64%]" />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <ImageReveal
            src="/campaign/detail-1000.webp"
            srcSet="/campaign/detail-1000.webp 1000w, /campaign/detail-2000.webp 2000w"
            sizes="(min-width: 1024px) 58vw, 92vw"
            alt="Macro view of the visible Air window in a white Air Max heel"
            className="aspect-[16/10] rounded-[28px] lg:col-span-7"
          />
          <div className="space-y-6 text-[17px] leading-relaxed lg:col-span-4 lg:col-start-9">
            <Reveal as="p">
              Air Max is built around one idea: let people see the cushioning. A window in the midsole shows the Air unit at the heel, and the rest of the shoe is
              designed to frame it.
            </Reveal>
            <Reveal as="p" className="text-[color:var(--muted)]" delay={0.1}>
              This concept store tells that story through the original Air Max in three colourways, plus the Air Max 270 for women and the Air Max 97 for big kids.
            </Reveal>
          </div>
        </div>

        <section id="demo" className="mt-24 scroll-mt-28 rounded-[28px] border border-[color:var(--border)] p-6 lg:p-10">
          <h2 className="font-display text-4xl font-black uppercase [font-stretch:72%]">About this demo</h2>
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-[color:var(--muted)]">
            <li>It is a frontend concept, not a real store. Prices, sale prices, sizes and stock are sample data.</li>
            <li>The bag and wishlist are saved in your browser only. There is no checkout and no payment is processed.</li>
            <li>Product and campaign imagery was generated with Higgsfield for this concept.</li>
            <li>Not affiliated with or endorsed by Nike, Inc. Brand marks are used for this concept piece only.</li>
          </ul>
          <Link to="/collections" className="mt-8 inline-flex h-12 items-center rounded-full bg-[color:var(--fg)] px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-[color:var(--btn-fg)]">
            Explore collections
          </Link>
        </section>
      </div>
    </div>
  )
}
