import { motion } from 'framer-motion'
import { easeOutExpo, timeline } from '../lib/motion'

export const socialIcons = {
  instagram: (
    <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.3 0 2.6 0 3.5.1 2.3.1 3.4 1.2 3.5 3.5.1.9.1 1.2.1 3.5v2.6c0 2.3 0 2.6-.1 3.5-.1 2.3-1.2 3.4-3.5 3.5-.9.1-1.2.1-3.5.1H9.4c-2.3 0-2.6 0-3.5-.1-2.3-.1-3.4-1.2-3.5-3.5C2.3 15.9 2.3 15.6 2.3 13.3v-2.6c0-2.3 0-2.6.1-3.5.1-2.3 1.2-3.4 3.5-3.5.9-.1 1.2-.1 3.5-.1H12Zm0-1.6H9.4C7 2 6.7 2 5.8 2.1 2.6 2.2.8 4 .7 7.2.6 8.1.6 8.4.6 10.8v2.4c0 2.4 0 2.7.1 3.6.1 3.2 1.9 5 5.1 5.1.9.1 1.2.1 3.6.1h2.4c2.4 0 2.7 0 3.6-.1 3.2-.1 5-1.9 5.1-5.1.1-.9.1-1.2.1-3.6v-2.4c0-2.4 0-2.7-.1-3.6-.1-3.2-1.9-5-5.1-5.1C15.3 2 15 2 12.6 2H12Z" />
  ),
  x: <path d="M17.8 3h3.1l-6.7 7.7L22 21h-6.2l-4.8-6.3L5.5 21H2.4l7.2-8.2L2 3h6.3l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />,
  facebook: (
    <path d="M13.5 21v-7.8h2.6l.4-3h-3V8.3c0-.9.3-1.5 1.5-1.5h1.6V4.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  ),
  youtube: (
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  ),
}

export const socialLinks = [
  { key: 'instagram', label: 'Nike on Instagram', href: 'https://www.instagram.com/nike/' },
  { key: 'x', label: 'Nike on X', href: 'https://x.com/Nike' },
  { key: 'facebook', label: 'Nike on Facebook', href: 'https://www.facebook.com/nike' },
  { key: 'youtube', label: 'Nike on YouTube', href: 'https://www.youtube.com/nike' },
] as const

export function SocialRail() {
  return (
    <motion.ul
      className="pointer-events-auto absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-8"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { delayChildren: timeline.social, staggerChildren: 0.07 } } }}
    >
      {socialLinks.map((l) => (
        <motion.li
          key={l.key}
          variants={{
            hidden: { opacity: 0, x: 12 },
            show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOutExpo } },
          }}
        >
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={l.label}
            className="group grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] text-[color:var(--fg)] opacity-60 transition duration-300 hover:-translate-y-0.5 hover:opacity-100 focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] fill-current" aria-hidden="true">
              {socialIcons[l.key]}
            </svg>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  )
}
