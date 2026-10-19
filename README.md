# Nike Air Max concept store

A multi-page, animated concept storefront for the Nike Air Max in three colourways (white, black, red).
React 19 + Vite + TypeScript, Tailwind CSS, Framer Motion and Lucide icons. No other runtime dependencies.

> **Frontend demo.** All prices, markdowns, sizes and stock levels are sample data. There is no checkout,
> no payment and no account system. The bag and wishlist are saved in your browser only.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build in dist/
npm run preview  # serve the production build
```

When you deploy it, your host must send unknown paths to `index.html`, because the routes are client-side. Netlify and Vercel need a rewrite rule for this. `vite preview` already does it.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero, "Built to move" story, featured line-up, colour lab, campaign, "Find your Air" CTA |
| `/men`, `/women`, `/kids` | Category pages with filters (colour, size, sale), sorting and quick view |
| `/collections` | Three curated collections |
| `/sale` | Only pairs with a previous price configured |
| `/product/:slug?color=` | Product detail: gallery (thumbnails, zoom, swipe), colour, size, add to bag, wishlist |
| `/search?q=` | Search results (the overlay opens from the search icon in the nav) |
| `/bag`, `/wishlist` | Saved in localStorage |
| `/account`, `/help`, `/about` | Demo account notice, size guide and help, about and disclaimers |

Filters and sort live in the URL (for example `/men?color=red&sort=price-desc`), so they survive reloads and back/forward.

## What's where

| Path | What it does |
| --- | --- |
| `src/App.tsx` | Route table, page titles, page transitions, global overlays |
| `src/lib/router.tsx` | Small History API router: `Link`, `useRouter`, `useSearchParams`, scroll restoration |
| `src/lib/motion.ts` | Easing, durations and shared variants (rise, stagger, mask reveal, page) |
| `src/lib/hooks.ts` | Media queries, scroll lock, dialog focus trap |
| `src/lib/theme.ts` | Applies colour tokens (CSS custom properties) per colourway and per route |
| `src/data/products.ts` | The three colourways: names, images, angles and theme colours |
| `src/data/catalog.ts` | **Shared product model**: models, variants, sample prices, sale prices, sizes, sold-out sizes, collections, sort and search |
| `src/state/shop.tsx` | Bag, wishlist, quick view, search and toast state |
| `src/components/ui/` | Reveal, LineReveal, ImageReveal, Parallax, Magnetic, Cursor, Price, SectionHeading |
| `src/components/overlays/` | Quick view, bag drawer, search overlay, toasts |
| `src/components/` | Nav (with mega dropdowns and mobile drawer), Footer, ProductCard, CollectionBrowser, ProductGallery, PurchasePanel, CampaignPanel, plus the original ShoeStage, Backdrop and ProductSelector |
| `src/pages/` | One file per route; `src/pages/home/` holds the homepage sections |
| `public/shoes/` | Transparent product renders (side, rear and three-quarter angles) |
| `public/campaign/` | Editorial campaign images |

## Changing the demo data

- **Prices**: edit `price` in `src/data/catalog.ts`.
- **Sale**: add `compareAt` (the previous price) to a variant. Only variants with a `compareAt` above `price` are shown as discounted or appear on `/sale`.
- **Sold-out sizes**: edit `soldOut` on a variant.

## Imagery

All shoe renders and campaign images were generated with Higgsfield (GPT Image 2.5). The original hero renders were used as references so the shoe shape stays consistent. Men's pages use the original Air Max in white, black and red; the Women page uses an Air Max 270 (Pink Foam, Lilac Bloom, Sail and Gum) and the Kids page an Air Max 97 (White and Volt, Game Royal, Sunset Orange). Colourway names are descriptive labels for this demo. Files are WebP in two sizes, with `srcset`.

## Motion and accessibility

- `prefers-reduced-motion` is honoured everywhere through `MotionConfig reducedMotion="user"` and explicit checks. Parallax, the custom cursor, magnetic buttons and ambient loops are switched off, and reveals become short fades.
- The custom cursor and magnetic effects only run on fine pointers (mouse).
- Dialogs (quick view, bag, search, mobile menu) trap focus, close on Escape and return focus.
- Nav dropdowns open on hover or keyboard focus, and active links carry `aria-current`.
- Colour and size pickers are radio groups. Adding to bag without a size shows an inline error.
- A skip link jumps to the main content.

The swoosh and product names are used for this concept piece only. Swap in licensed brand assets before any public launch.
