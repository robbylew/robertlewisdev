import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import satori from 'satori'
import { logoSvg } from '../../src/logo.ts'
import { OG_IMAGE_SIZE, site } from '../../src/site.ts'

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
  description?: string
  /** Small uppercase label in the top-right corner (e.g. "Blog"). */
  label?: string
  /** Bottom-left text, usually the page URL without protocol. */
  url: string
  /** Bottom-right text, e.g. "Mar 4, 2025 · 20 min read". */
  meta?: string
}

const ACCENT = '#2dd4bf'
const ACCENT_2 = '#818cf8'

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
  if (title.length > 70)
    return 52
  if (title.length > 40)
    return 62
  return 76
}

function template({ title, description, label, url, meta }: OgImageInput): OgNode {
  // The site's logo mark, light variant for the dark card background.
  const badge: OgNode = {
    type: 'img',
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(logoSvg({ background: '#fafafa', foreground: '#0a0a0a', size: 60 })).toString('base64')}`,
      width: 60,
      height: 60,
    },
  }

  const header = h(
    'div',
    { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h(
      'div',
      { display: 'flex', alignItems: 'center' },
      badge,
      h('div', { display: 'flex', marginLeft: 20, fontSize: 28, fontWeight: 600, color: '#e5e5e5' }, site.name),
    ),
    label
      ? h('div', {
          display: 'flex',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ACCENT,
          border: '1.5px solid rgba(45, 212, 191, 0.45)',
          borderRadius: 999,
          padding: '8px 20px',
        }, label)
      : null,
  )

  const body = h(
    'div',
    { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 },
    h('div', {
      display: 'block',
      fontSize: titleFontSize(title),
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: '-0.035em',
      color: '#fafafa',
      lineClamp: 3,
    }, title),
    description
      ? h('div', {
          display: 'block',
          marginTop: 26,
          fontSize: 30,
          fontWeight: 400,
          lineHeight: 1.4,
          color: '#a3a3a3',
          lineClamp: title.length <= 24 ? 3 : 2,
        }, description)
      : null,
  )

  const footer = h(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 28,
      borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
      fontSize: 24,
      color: '#d4d4d4',
    },
    h('div', { display: 'flex', fontWeight: 600 }, url),
    meta ? h('div', { display: 'flex', color: '#a3a3a3' }, meta) : null,
  )

  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.20) 0%, rgba(10, 10, 10, 0) 45%), radial-gradient(circle at 0% 100%, rgba(129, 140, 248, 0.14) 0%, rgba(10, 10, 10, 0) 40%)',
      color: '#fafafa',
      fontFamily: 'Inter',
    },
    h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '64px 72px 56px' }, header, body, footer),
    h('div', { display: 'flex', height: 8, width: '100%', backgroundImage: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_2})` }),
  )
}

export async function renderOgImage(input: OgImageInput): Promise<Uint8Array> {
  const [fonts] = await Promise.all([loadFonts(), ensureWasm()])
  const node = template({
    ...input,
    title: stripPictographs(input.title),
    description: input.description ? stripPictographs(input.description) : undefined,
  })
  // Satori expects React-element-shaped objects; our minimal `h()` produces exactly that.
  const svg = await satori(node as unknown as Parameters<typeof satori>[0], {
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    fonts,
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_IMAGE_SIZE.width } }).render().asPng()
}
