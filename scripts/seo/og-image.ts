import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import satori from 'satori'
import { logoSvg } from '../../src/logo.ts'
import { OG_IMAGE_SIZE } from '../../src/site.ts'

const require = createRequire(import.meta.url)

type Child = OgNode | string | null | undefined | false
interface OgNode {
  type: string
  props: Record<string, unknown> & { style?: Record<string, unknown>, children?: Child | Child[] }
}

function h(type: string, style: Record<string, unknown>, ...children: Child[]): OgNode {
  const kids = children.filter(child => child !== null && child !== undefined && child !== false)
  return { type, props: { style, children: kids.length === 1 ? kids[0] : kids } }
}

export interface OgImageInput {
  title: string
  /** One short, quiet line under the title (e.g. a job title or a post date). */
  subtitle?: string
  /** Shown at the bottom, usually the page URL without protocol. */
  url: string
}

interface OgFont {
  name: string
  data: Buffer
  weight: 400 | 600 | 800
  style: 'normal'
}

let wasmReady: Promise<void> | undefined
let fontsReady: Promise<OgFont[]> | undefined

function ensureWasm(): Promise<void> {
  wasmReady ??= fs.readFile(require.resolve('@resvg/resvg-wasm/index_bg.wasm'))
    .then(wasm => initWasm(wasm))
    .catch((error: unknown) => {
      // The wasm module is process-global; Vite may load this module more than once.
      if (!String(error).includes('Already initialized'))
        throw error
    })
  return wasmReady
}

function loadFonts(): Promise<OgFont[]> {
  fontsReady ??= Promise.all(([400, 600, 800] as const).map(async weight => ({
    name: 'Inter',
    data: await fs.readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`)),
    weight,
    style: 'normal' as const,
  })))
  return fontsReady
}

/** Emoji and other pictographs are not in the embedded font, so drop them. */
function stripPictographs(text: string): string {
  return text.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim()
}

function titleFontSize(title: string): number {
  if (title.length > 60)
    return 60
  if (title.length > 32)
    return 72
  return 88
}

/** Deliberately minimal: logo, title, one quiet line and the URL. */
function template({ title, subtitle, url }: OgImageInput): OgNode {
  const logo: OgNode = {
    type: 'img',
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(logoSvg({ background: '#fafafa', foreground: '#0a0a0a', size: 56 })).toString('base64')}`,
      width: 56,
      height: 56,
    },
  }

  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px 88px',
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 85% 10%, rgba(45, 212, 191, 0.10) 0%, rgba(10, 10, 10, 0) 50%)',
      color: '#fafafa',
      fontFamily: 'Inter',
    },
    logo,
    h(
      'div',
      { display: 'flex', flexDirection: 'column' },
      h('div', {
        display: 'block',
        fontSize: titleFontSize(title),
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.04em',
        lineClamp: 2,
      }, title),
      subtitle
        ? h('div', { display: 'flex', marginTop: 24, fontSize: 32, fontWeight: 400, color: '#a3a3a3' }, subtitle)
        : null,
    ),
    h('div', { display: 'flex', fontSize: 26, fontWeight: 500, color: '#737373' }, url),
  )
}

export async function renderOgImage(input: OgImageInput): Promise<Uint8Array> {
  const [fonts] = await Promise.all([loadFonts(), ensureWasm()])
  const node = template({
    ...input,
    title: stripPictographs(input.title),
    subtitle: input.subtitle ? stripPictographs(input.subtitle) : undefined,
  })
  // Satori expects React-element-shaped objects; our minimal `h()` produces exactly that.
  const svg = await satori(node as unknown as Parameters<typeof satori>[0], {
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    fonts,
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_IMAGE_SIZE.width } }).render().asPng()
}
