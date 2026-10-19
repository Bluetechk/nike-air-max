import { CampaignPanel } from '../components/CampaignPanel'
import { CollectionBrowser } from '../components/CollectionBrowser'
import { SectionHeading } from '../components/ui/SectionHeading'
import { listings } from '../data/catalog'

const items = listings.filter((l) => l.model.category === 'men')

export default function Men() {
  return (
    <>
      <CampaignPanel
        tone="dark"
        kicker="Air Max · Men"
        title={['Men’s', 'Air Max']}
        intro="Three colourways of one layered silhouette, each with the Air window on show. Sizes 7 to 13."
        image={{
          src: '/campaign/blackout-800.webp',
          srcSet: '/campaign/blackout-800.webp 800w, /campaign/blackout-1400.webp 1400w',
          alt: 'Black Air Max on a dark concrete block under a single rim light',
          position: 'object-[50%_70%]',
        }}
      />
      <div className="theme-light bg-[#f6f6f4] pb-28 pt-16 text-[color:var(--fg)] lg:pt-24">
        <SectionHeading kicker="Shop men" lines={['The', 'collection']} size="md" className="mx-auto mb-10 max-w-[1600px] px-4 sm:px-6 lg:px-10" />
        <CollectionBrowser items={items} />
      </div>
    </>
  )
}
