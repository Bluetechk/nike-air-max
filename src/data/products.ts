/** The three hero colourways of the original Air Max. */
export type ProductId = 'white' | 'black' | 'red'
/** Every colourway in the store, including the Air Max 270 and 97 pairs that only appear on the Women and Kids pages. */
export type ColorId = ProductId | 'pink' | 'lilac' | 'sail' | 'volt' | 'royal' | 'sunset'

export interface Theme {
  /** Base gradient stops for the hero environment. */
  bgFrom: string
  bgTo: string
  fg: string
  muted: string
  watermark: string
  card: string
  cardActive: string
  border: string
  btnBg: string
  btnFg: string
  /** Radial light behind the shoe. */
  glow: string
  /** Contact shadow under the shoe. */
  shadow: string
  /** Floating panels (search, menu). */
  panel: string
  panelSolid: string
  /** Browser UI colour (meta theme-color). */
  meta: string
}

export interface Colorway {
  id: ColorId
  name: string
  colorway: string
  swatch: string
  /** Placeholder retail price in USD. Edit freely. */
  price: number
  image: string
  imageSmall: string
  thumb: string
  alt: string
  /** Extra studio angles for galleries and card hovers (same render family as the hero image). */
  angles: { src: string; thumb: string; alt: string }[]
  /** Card and gallery tile tint for this colourway. */
  tile: string
  /** True when the tile is dark enough to need light text and highlights. */
  dark: boolean
}

/** A hero colourway: also carries the full environment theme the hero and colour lab switch to. */
export interface Product extends Colorway {
  id: ProductId
  theme: Theme
}

export const products: Product[] = [
  {
    id: 'white',
    name: 'Nike Air Max',
    colorway: 'Triple White',
    swatch: '#f4f4f2',
    price: 130,
    image: '/shoes/air-max-white.webp',
    imageSmall: '/shoes/air-max-white-900.webp',
    thumb: '/shoes/air-max-white-thumb.webp',
    alt: 'White Nike Air Max sneaker in three-quarter side view with visible Air unit',
    angles: [
      { src: '/shoes/air-max-white-rear.webp', thumb: '/shoes/air-max-white-rear-thumb.webp', alt: 'White Nike Air Max seen from the heel, showing the Air window' },
      { src: '/shoes/air-max-white-side.webp', thumb: '/shoes/air-max-white-side-thumb.webp', alt: 'White Nike Air Max in flat side profile' },
    ],
    tile: '#ebebe8',
    dark: false,
    theme: {
      bgFrom: '#efefed',
      bgTo: '#d6d6d3',
      fg: '#111111',
      muted: '#5b5b58',
      watermark: 'rgba(17,17,17,0.045)',
      card: 'rgba(255,255,255,0.45)',
      cardActive: 'rgba(255,255,255,0.92)',
      border: 'rgba(17,17,17,0.08)',
      btnBg: '#111111',
      btnFg: '#ffffff',
      glow: 'rgba(255,255,255,0.95)',
      shadow: 'rgba(0,0,0,0.38)',
      panel: 'rgba(250,250,248,0.86)',
      panelSolid: '#f4f4f2',
      meta: '#e6e6e3',
    },
  },
  {
    id: 'black',
    name: 'Nike Air Max',
    colorway: 'Triple Black',
    swatch: '#151515',
    price: 140,
    image: '/shoes/air-max-black.webp',
    imageSmall: '/shoes/air-max-black-900.webp',
    thumb: '/shoes/air-max-black-thumb.webp',
    alt: 'Black Nike Air Max sneaker in three-quarter side view with smoked Air unit',
    angles: [
      { src: '/shoes/air-max-black-rear.webp', thumb: '/shoes/air-max-black-rear-thumb.webp', alt: 'Black Nike Air Max seen from the heel, showing the smoked Air window' },
      { src: '/shoes/air-max-black-side.webp', thumb: '/shoes/air-max-black-side-thumb.webp', alt: 'Black Nike Air Max in flat side profile' },
    ],
    tile: '#232324',
    dark: true,
    theme: {
      bgFrom: '#2a2a2b',
      bgTo: '#0c0c0d',
      fg: '#f5f5f4',
      muted: '#a3a3a0',
      watermark: 'rgba(255,255,255,0.045)',
      card: 'rgba(255,255,255,0.04)',
      cardActive: 'rgba(255,255,255,0.12)',
      border: 'rgba(255,255,255,0.09)',
      btnBg: '#f5f5f4',
      btnFg: '#111111',
      glow: 'rgba(160,160,170,0.22)',
      shadow: 'rgba(0,0,0,0.85)',
      panel: 'rgba(30,30,32,0.88)',
      panelSolid: '#161617',
      meta: '#141415',
    },
  },
  {
    id: 'red',
    name: 'Nike Air Max',
    colorway: 'University Red',
    swatch: '#c3121c',
    price: 150,
    image: '/shoes/air-max-red.webp',
    imageSmall: '/shoes/air-max-red-900.webp',
    thumb: '/shoes/air-max-red-thumb.webp',
    alt: 'Red Nike Air Max sneaker with white swoosh in three-quarter side view',
    angles: [
      { src: '/shoes/air-max-red-rear.webp', thumb: '/shoes/air-max-red-rear-thumb.webp', alt: 'Red Nike Air Max seen from the heel, showing the Air window' },
      { src: '/shoes/air-max-red-side.webp', thumb: '/shoes/air-max-red-side-thumb.webp', alt: 'Red Nike Air Max in flat side profile' },
    ],
    tile: '#a5111a',
    dark: true,
    theme: {
      bgFrom: '#c0141d',
      bgTo: '#4a0306',
      fg: '#ffffff',
      muted: 'rgba(255,255,255,0.72)',
      watermark: 'rgba(255,255,255,0.08)',
      card: 'rgba(255,255,255,0.07)',
      cardActive: 'rgba(255,255,255,0.18)',
      border: 'rgba(255,255,255,0.16)',
      btnBg: '#ffffff',
      btnFg: '#a10f17',
      glow: 'rgba(255,92,72,0.55)',
      shadow: 'rgba(40,0,2,0.7)',
      panel: 'rgba(110,6,12,0.9)',
      panelSolid: '#760910',
      meta: '#8e0b12',
    },
  },
]


const shoe = (file: string) => ({
  image: `/shoes/${file}.webp`,
  imageSmall: `/shoes/${file}-900.webp`,
  thumb: `/shoes/${file}-thumb.webp`,
})

/** Colourways of the women's Air Max 270 and the big kids' Air Max 97. Names are descriptive labels for this demo. */
const moreColorways: Colorway[] = [
  {
    id: 'pink',
    name: 'Nike Air Max 270',
    colorway: 'Pink Foam',
    swatch: '#f1c6cc',
    price: 160,
    ...shoe('air-max-270-pink'),
    alt: 'Pink Nike Air Max 270 with knit upper, white midsole and a tall pink Air unit at the heel',
    angles: [],
    tile: '#f3e0e2',
    dark: false,
  },
  {
    id: 'lilac',
    name: 'Nike Air Max 270',
    colorway: 'Lilac Bloom',
    swatch: '#c9b6ec',
    price: 160,
    ...shoe('air-max-270-lilac'),
    alt: 'Lilac Nike Air Max 270 with a silver swoosh and a tall lilac Air unit at the heel',
    angles: [],
    tile: '#e6def3',
    dark: false,
  },
  {
    id: 'sail',
    name: 'Nike Air Max 270',
    colorway: 'Sail and Gum',
    swatch: '#e7dcc6',
    price: 160,
    ...shoe('air-max-270-sail'),
    alt: 'Off-white Nike Air Max 270 with tan suede overlays, a brown swoosh and a gum outsole',
    angles: [],
    tile: '#ede5d6',
    dark: false,
  },
  {
    id: 'volt',
    name: 'Nike Air Max 97',
    colorway: 'White and Volt',
    swatch: '#d4f53c',
    price: 130,
    ...shoe('air-max-97-volt'),
    alt: 'White Nike Air Max 97 with neon volt wave lines and a full-length volt Air unit',
    angles: [],
    tile: '#eef2dc',
    dark: false,
  },
  {
    id: 'royal',
    name: 'Nike Air Max 97',
    colorway: 'Game Royal',
    swatch: '#1f55e0',
    price: 130,
    ...shoe('air-max-97-royal'),
    alt: 'Royal blue Nike Air Max 97 with turquoise and white wave lines and a full-length Air unit',
    angles: [],
    tile: '#1d3f9a',
    dark: true,
  },
  {
    id: 'sunset',
    name: 'Nike Air Max 97',
    colorway: 'Sunset Orange',
    swatch: '#f7811c',
    price: 130,
    ...shoe('air-max-97-sunset'),
    alt: 'Orange and yellow Nike Air Max 97 with white wave lines, a black outsole and a full-length Air unit',
    angles: [],
    tile: '#f4d8b8',
    dark: false,
  },
]

export const colorways: Colorway[] = [...products, ...moreColorways]
export const getColorway = (id: ColorId): Colorway => colorways.find((p) => p.id === id) ?? products[0]

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
