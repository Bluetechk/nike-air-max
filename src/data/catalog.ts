import { getColorway, type ColorId, type Colorway } from './products'

/**
 * Shared catalogue. Every page (home, collections, search, quick view, product detail, bag)
 * reads products from here so a change in one place shows up everywhere.
 *
 * All prices, sale prices, sizes and stock levels are SAMPLE DATA for this frontend demo.
 */

export type Category = 'men' | 'women' | 'kids'

export interface Variant {
  color: ColorId
  price: number
  /** Previous price. Only set when a sample markdown is configured; nothing else is shown as discounted. */
  compareAt?: number
  /** Sizes shown as sold out for this colourway. */
  soldOut: string[]
  /** Lower is newer. Drives the "Newest" sort. */
  release: number
  /** Order within "Featured". */
  featured: number
}

export interface Model {
  slug: string
  name: string
  category: Category
  /** e.g. "Men's Shoes" */
  label: string
  description: string
  details: string[]
  sizes: string[]
  variants: Variant[]
}

const menSizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13']
const womenSizes = ['W5', 'W5.5', 'W6', 'W6.5', 'W7', 'W7.5', 'W8', 'W8.5', 'W9', 'W9.5', 'W10', 'W11']
const kidsSizes = ['3.5Y', '4Y', '4.5Y', '5Y', '5.5Y', '6Y', '6.5Y', '7Y']

const sharedDetails = [
  'Leather and textile upper with mesh panels',
  'Visible Air cushioning window in the heel',
  'Foam midsole',
  'Rubber outsole with a waffle-inspired pattern',
]

export const models: Model[] = [
  {
    slug: 'air-max-men',
    name: 'Nike Air Max',
    category: 'men',
    label: "Men's Shoes",
    description:
      'A clean, layered upper sits on a midsole with a window into the Air unit at the heel. Three tonal colourways, one shape built for everyday wear.',
    details: sharedDetails,
    sizes: menSizes,
    variants: [
      { color: 'white', price: 130, soldOut: ['7', '13'], release: 3, featured: 1 },
      { color: 'black', price: 140, soldOut: ['12'], release: 2, featured: 2 },
      { color: 'red', price: 150, soldOut: [], release: 1, featured: 0 },
    ],
  },
  {
    slug: 'air-max-270-women',
    name: 'Nike Air Max 270',
    category: 'women',
    label: "Women's Shoes",
    description:
      'A sock-like knit upper on a foam midsole, with a tall Air unit at the heel that you can see from across the room. Three soft colourways for everyday wear.',
    details: ['Engineered knit upper with a pull tab at the heel', 'Tall visible Air unit in the heel', 'Foam midsole', 'Rubber outsole'],
    sizes: womenSizes,
    variants: [
      { color: 'pink', price: 160, soldOut: ['W5'], release: 1, featured: 0 },
      { color: 'lilac', price: 128, compareAt: 160, soldOut: ['W10', 'W11'], release: 3, featured: 2 },
      { color: 'sail', price: 160, soldOut: ['W5.5'], release: 2, featured: 1 },
    ],
  },
  {
    slug: 'air-max-97-big-kids',
    name: 'Nike Air Max 97',
    category: 'kids',
    label: "Big Kids' Shoes",
    description:
      'Rippling wave lines from heel to toe and an Air unit that runs the full length of the sole. Loud colours, big-kid sizes.',
    details: ['Layered synthetic upper with wave-line panels', 'Full-length visible Air unit', 'Foam midsole', 'Rubber outsole'],
    sizes: kidsSizes,
    variants: [
      { color: 'volt', price: 130, soldOut: [], release: 2, featured: 1 },
      { color: 'royal', price: 104, compareAt: 130, soldOut: ['7Y'], release: 3, featured: 2 },
      { color: 'sunset', price: 130, soldOut: ['3.5Y'], release: 1, featured: 0 },
    ],
  },
]

export const categoryLabel: Record<Category, string> = { men: 'Men', women: 'Women', kids: 'Kids' }

/** One sellable listing: a model in a single colourway. Product grids show one card per listing. */
export interface Listing {
  id: string
  model: Model
  variant: Variant
  colorway: Colorway
  href: string
}

export const listingHref = (slug: string, color: ColorId) => `/product/${slug}?color=${color}`

export const listings: Listing[] = models.flatMap((model) =>
  model.variants.map((variant) => ({
    id: `${model.slug}:${variant.color}`,
    model,
    variant,
    colorway: getColorway(variant.color),
    href: listingHref(model.slug, variant.color),
  })),
)

export const getModel = (slug: string) => models.find((m) => m.slug === slug)
export const getListing = (slug: string, color: ColorId) => listings.find((l) => l.model.slug === slug && l.variant.color === color)
export const onSale = (l: Listing) => l.variant.compareAt !== undefined && l.variant.compareAt > l.variant.price
export const percentOff = (l: Listing) =>
  l.variant.compareAt ? Math.round((1 - l.variant.price / l.variant.compareAt) * 100) : 0

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc'
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
]

export function sortListings(items: Listing[], sort: SortKey) {
  const out = [...items]
  const catOrder = (l: Listing) => ['men', 'women', 'kids'].indexOf(l.model.category)
  switch (sort) {
    case 'newest':
      return out.sort((a, b) => a.variant.release - b.variant.release || catOrder(a) - catOrder(b))
    case 'price-asc':
      return out.sort((a, b) => a.variant.price - b.variant.price)
    case 'price-desc':
      return out.sort((a, b) => b.variant.price - a.variant.price)
    default:
      return out.sort((a, b) => a.variant.featured - b.variant.featured || catOrder(a) - catOrder(b))
  }
}

/** Search across names, colourway names, colour ids and categories. Every term must match. */
export function searchListings(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return listings.filter((l) => {
    const hay = [
      l.model.name,
      l.model.label,
      l.model.category,
      categoryLabel[l.model.category],
      l.colorway.colorway,
      l.variant.color,
      onSale(l) ? 'sale' : '',
      l.model.category === 'kids' ? 'big kids children youth' : '',
    ]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t.replace(/['’]s$/, '')))
  })
}

/** Curated groups for the Collections page and navigation. */
export interface Collection {
  slug: string
  title: string
  kicker: string
  blurb: string
  image: { src: string; srcSet: string; alt: string }
  href: string
}

export const collections: Collection[] = [
  {
    slug: 'university-red',
    title: 'University Red',
    kicker: 'Collection 01',
    blurb: 'Crimson leather, a white swoosh and the Air window up front. The loudest pair in the line-up.',
    image: {
      src: '/campaign/street-1000.webp',
      srcSet: '/campaign/street-1000.webp 1000w, /campaign/street-2000.webp 2000w',
      alt: 'Red Air Max sneakers mid-stride on a wet city street at dusk',
    },
    href: '/men?color=red',
  },
  {
    slug: 'blackout',
    title: 'Blackout',
    kicker: 'Collection 02',
    blurb: 'Triple black from lace to outsole, with a smoked Air window. Low-key on purpose.',
    image: {
      src: '/campaign/blackout-800.webp',
      srcSet: '/campaign/blackout-800.webp 800w, /campaign/blackout-1400.webp 1400w',
      alt: 'Black Air Max on a dark concrete block lit by a single rim light',
    },
    href: '/men?color=black',
  },
  {
    slug: 'studio-white',
    title: 'Studio White',
    kicker: 'Collection 03',
    blurb: 'Tonal white leather and mesh. The shape at its purest, shown in daylight.',
    image: {
      src: '/campaign/studio-white-800.webp',
      srcSet: '/campaign/studio-white-800.webp 800w, /campaign/studio-white-1400.webp 1400w',
      alt: 'White Air Max on a plaster plinth in a bright studio',
    },
    href: '/men?color=white',
  },
]
