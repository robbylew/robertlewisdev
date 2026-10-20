/**
 * Regenerates every favicon/app icon in `public/` from the logo mark in `src/logo.ts`.
 *
 *   pnpm icons
 */
import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { logoSvg } from '../src/logo.ts'

const publicDir = fileURLToPath(new URL('../public/', import.meta.url))
const background = '#0a0a0a'
const foreground = '#fafafa'

async function png(svg: string, size: number): Promise<Buffer> {
  return sharp(Buffer.from(svg), { density: 72 * Math.max(1, size / 32) })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: size <= 64 })
    .toBuffer()
}

/** Minimal ICO container with embedded PNGs (supported by every modern browser). */
function ico(images: { size: number, data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16
    header.writeUInt8(size >= 256 ? 0 : size, entry)
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1)
    header.writeUInt8(0, entry + 2)
    header.writeUInt8(0, entry + 3)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map(image => image.data)])
}

const rounded = (size: number) => logoSvg({ background, foreground, size })
// Full-bleed squares: iOS and Android apply their own masks; keep the letters inside the safe zone.
const fullBleed = (size: number, glyphScale: number) => logoSvg({ background, foreground, size, rounded: false, glyphScale })

const outputs: [string, Buffer | string][] = [
  ['favicon.svg', `${rounded(32)}\n`],
  ['favicon-16x16.png', await png(rounded(16), 16)],
  ['favicon-32x32.png', await png(rounded(32), 32)],
  ['apple-touch-icon.png', await png(fullBleed(180, 0.9), 180)],
  ['android-chrome-192x192.png', await png(fullBleed(192, 0.85), 192)],
  ['android-chrome-512x512.png', await png(fullBleed(512, 0.85), 512)],
  ['favicon.ico', ico(await Promise.all([16, 32, 48].map(async size => ({ size, data: await png(rounded(size), size) }))))],
]

for (const [file, data] of outputs) {
  await fs.writeFile(path.join(publicDir, file), data)
  console.log(`${String(Buffer.byteLength(data)).padStart(7)} B  public/${file}`)
}
