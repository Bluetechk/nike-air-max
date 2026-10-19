import type { Theme } from '../data/products'

/**
 * The colour tokens live on <html> so the fixed header, drawers and pages all read the
 * same values. They are registered with @property, so every change eases instead of snapping.
 */
export function applyTheme(theme: Theme, thumb: string) {
  const root = document.documentElement.style
  const set: Record<string, string> = {
    '--fg': theme.fg,
    '--muted': theme.muted,
    '--border': theme.border,
    '--card': theme.card,
    '--card-active': theme.cardActive,
    '--btn-bg': theme.btnBg,
    '--btn-fg': theme.btnFg,
    '--watermark': theme.watermark,
    '--panel': theme.panel,
    '--panel-solid': theme.panelSolid,
    '--thumb': thumb,
  }
  Object.entries(set).forEach(([k, v]) => root.setProperty(k, v))
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.meta)
  document.body.style.backgroundColor = theme.bgTo
}

/** Neutral studio palette used by every page except the home hero. */
export const lightTheme: Theme = {
  bgFrom: '#f6f6f4',
  bgTo: '#f6f6f4',
  fg: '#111111',
  muted: '#5f5f5b',
  watermark: 'rgba(17,17,17,0.05)',
  card: 'rgba(255,255,255,0.6)',
  cardActive: 'rgba(17,17,17,0.06)',
  border: 'rgba(17,17,17,0.12)',
  btnBg: '#111111',
  btnFg: '#ffffff',
  glow: 'transparent',
  shadow: 'rgba(0,0,0,0.3)',
  panel: 'rgba(246,246,244,0.86)',
  panelSolid: '#f6f6f4',
  meta: '#f6f6f4',
}

export const applyLightTheme = () => applyTheme(lightTheme, 'rgba(17,17,17,0.04)')

/** Charcoal palette for pages that open on a dark banner, so the header stays legible. */
export const darkTheme: Theme = {
  ...lightTheme,
  bgFrom: '#0e0e0f',
  bgTo: '#0e0e0f',
  fg: '#f5f5f4',
  muted: '#a3a3a0',
  watermark: 'rgba(255,255,255,0.05)',
  card: 'rgba(255,255,255,0.05)',
  cardActive: 'rgba(255,255,255,0.1)',
  border: 'rgba(255,255,255,0.12)',
  btnBg: '#f5f5f4',
  btnFg: '#111111',
  panel: 'rgba(18,18,19,0.86)',
  panelSolid: '#161617',
  meta: '#0e0e0f',
}

export const applyDarkTheme = () => applyTheme(darkTheme, 'rgba(255,255,255,0.05)')
