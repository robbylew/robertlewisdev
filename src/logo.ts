// "RL" monogram, shared by the header logo, favicons and social preview images.
// Glyphs are Inter ExtraBold outlines (no font needed), fitted to a 32×32 rounded square.

export const LOGO_SIZE = 32

/** Rounded square outline. */
export const LOGO_SQUARE = 'M8.5 0H23.5A8.5 8.5 0 0 1 32 8.5V23.5A8.5 8.5 0 0 1 23.5 32H8.5A8.5 8.5 0 0 1 0 23.5V8.5A8.5 8.5 0 0 1 8.5 0Z'

/** "RL" letter outlines. */
export const LOGO_GLYPHS = 'M9.59 22.11L6.7 22.11L6.7 9.89L11.69 9.89Q13.08 9.89 14.07 10.39Q15.08 10.9 15.61 11.8Q16.15 12.71 16.15 13.95L16.15 13.95Q16.15 15.21 15.6 16.1Q15.04 16.99 14.04 17.44L14.04 17.44Q14.04 17.44 14.02 17.44L14.02 17.44L16.57 22.11L13.4 22.11L11.17 17.91L9.59 17.91L9.59 22.11ZM9.59 12.24L9.59 15.61L11.08 15.61Q11.77 15.61 12.22 15.45Q12.68 15.26 12.91 14.89Q13.15 14.52 13.15 13.95L13.15 13.95Q13.15 13.38 12.91 13.01Q12.68 12.63 12.22 12.44Q11.75 12.24 11.08 12.24L11.08 12.24L9.59 12.24ZM25.3 22.11L17.31 22.11L17.31 9.89L20.2 9.89L20.2 19.74L25.3 19.74L25.3 22.11Z'

/** Square with the letters cut out — render with `fill-rule="evenodd"`. */
export const LOGO_KNOCKOUT = `${LOGO_SQUARE} ${LOGO_GLYPHS}`

interface LogoSvgOptions {
  background?: string
  foreground?: string
  size?: number
  /** Rounded corners; use `false` for full-bleed icons that the OS masks itself. */
  rounded?: boolean
  /** Scale of the letters around the center (for maskable icon safe zones). */
  glyphScale?: number
}

/** Standalone SVG of the mark with explicit colors (for favicons and image generation). */
export function logoSvg({ background = '#0a0a0a', foreground = '#fafafa', size = LOGO_SIZE, rounded = true, glyphScale = 1 }: LogoSvgOptions = {}): string {
  const square = rounded
    ? `<path fill="${background}" d="${LOGO_SQUARE}"/>`
    : `<rect width="32" height="32" fill="${background}"/>`
  const offset = 16 * (1 - glyphScale)
  const glyphs = glyphScale === 1
    ? `<path fill="${foreground}" d="${LOGO_GLYPHS}"/>`
    : `<path fill="${foreground}" transform="translate(${offset} ${offset}) scale(${glyphScale})" d="${LOGO_GLYPHS}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">${square}${glyphs}</svg>`
}
