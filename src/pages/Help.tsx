import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Link } from '../lib/router'

const sizes = [
  ['7', '6', '40', '25'],
  ['8', '7', '41', '26'],
  ['9', '8', '42.5', '27'],
  ['10', '9', '44', '28'],
  ['11', '10', '45', '29'],
  ['12', '11', '46', '30'],
  ['13', '12', '47.5', '31'],
]

const sections = [
  {
    id: 'shipping',
    title: 'Shipping',
    body: 'This concept store doesn’t ship anything. A live store would list delivery options, costs and timings here.',
  },
  {
    id: 'returns',
    title: 'Returns',
    body: 'No orders are placed in this demo, so there is nothing to return. A live store would explain its returns window and process here.',
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'There is no customer service team behind this demo. For the real thing, contact the brand through its official channels.',
  },
]

export default function Help() {
  return (
    <div className="theme-light min-h-[80svh] bg-[#f6f6f4] text-[color:var(--fg)]">
      <div className="mx-auto max-w-[1100px] px-4 pb-28 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <SectionHeading as="h1" kicker="Help" lines={['How can', 'we help?']} size="md" intro="Placeholder help content for this frontend demo." />

        <section id="sizing" className="mt-16 scroll-mt-28">
          <Reveal>
            <h2 className="font-display text-4xl font-black uppercase [font-stretch:72%]">Size guide</h2>
            <p className="mt-2 text-[15px] text-[color:var(--muted)]">Approximate men’s conversions for reference. Women’s sizes are shown with a W prefix and big kids’ sizes with a Y suffix.</p>
          </Reveal>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-white">
            <table className="w-full min-w-[420px] text-left text-[14px] tabular-nums">
              <caption className="sr-only">Approximate shoe size conversions</caption>
              <thead className="border-b border-[color:var(--border)] text-[12px] uppercase tracking-[0.12em] text-[color:var(--muted)]">
                <tr>
                  {['US', 'UK', 'EU', 'Foot length (cm)'].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map((r) => (
                  <tr key={r[0]} className="border-b border-[color:var(--border)] last:border-0">
                    {r.map((c, i) => (
                      <td key={i} className="px-5 py-3">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-14 scroll-mt-28 border-t border-[color:var(--border)] pt-10">
            <Reveal>
              <h2 className="font-display text-4xl font-black uppercase [font-stretch:72%]">{s.title}</h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[color:var(--muted)]">{s.body}</p>
            </Reveal>
          </section>
        ))}

        <p className="mt-14 text-[14px]">
          Looking for something specific?{' '}
          <Link to="/search" className="font-semibold underline underline-offset-4">
            Search the store
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
