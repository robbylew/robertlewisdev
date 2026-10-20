<script setup lang="ts">
import { isDark } from '~/logics'

const el = ref<HTMLCanvasElement>()

const SCALE = 200
const LENGTH = 10
const SPACING = 15
const FPS = 30
const ALPHA_BUCKETS = 12
const TWO_PI = Math.PI * 2

/** Seeded 3D Perlin noise ("improved noise", Ken Perlin 2002), roughly in [-1, 1]. */
function createNoise(seed: number) {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++)
    p[i] = i
  let state = seed >>> 0 || 1
  const random = () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++)
    perm[i] = p[i & 255]

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (t: number, a: number, b: number) => a + t * (b - a)
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : (h === 12 || h === 14) ? x : z
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
  }

  return (x: number, y: number, z: number) => {
    const fx = Math.floor(x)
    const fy = Math.floor(y)
    const fz = Math.floor(z)
    const X = fx & 255
    const Y = fy & 255
    const Z = fz & 255
    x -= fx
    y -= fy
    z -= fz
    const u = fade(x)
    const v = fade(y)
    const w = fade(z)
    const A = perm[X] + Y
    const AA = perm[A] + Z
    const AB = perm[A + 1] + Z
    const B = perm[X + 1] + Y
    const BA = perm[B] + Z
    const BB = perm[B + 1] + Z
    return lerp(w, lerp(v, lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z)), lerp(u, grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1)), lerp(u, grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1))))
  }
}

onMounted(() => {
  const canvas = el.value!
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const noise = createNoise(Date.now())
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let width = 0
  let height = 0
  let points: { x: number, y: number, opacity: number }[] = []

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

    points = []
    for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
      for (let y = -SPACING / 2; y < height + SPACING; y += SPACING)
        points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
    }
  }

  function draw(time: number) {
    const t = time / 10000
    // Batch dots by opacity so each frame needs only a handful of fill calls.
    const paths = Array.from({ length: ALPHA_BUCKETS }, () => new Path2D())
    for (const { x, y, opacity } of points) {
      const sx = x / SCALE
      const sy = y / SCALE
      const angle = (noise(sx, sy, t) + 0.5 * noise(sx * 2, sy * 2, t * 2)) * TWO_PI
      const length = (noise(sx, sy, t * 2 + 31.7) * 0.5 + 1) * LENGTH
      const alpha = (Math.abs(Math.cos(angle)) * 0.8 + 0.2) * opacity
      const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(alpha * ALPHA_BUCKETS))
      paths[bucket].rect(x + Math.cos(angle) * length - 0.75, y + Math.sin(angle) * length - 0.75, 1.5, 1.5)
    }
    ctx!.clearRect(0, 0, width, height)
    ctx!.fillStyle = isDark.value ? '#4a4a4a' : '#bdbdbd'
    paths.forEach((path, bucket) => {
      ctx!.globalAlpha = (bucket + 0.5) / ALPHA_BUCKETS
      ctx!.fill(path)
    })
    ctx!.globalAlpha = 1
  }

  resize()
  useResizeObserver(canvas, () => {
    resize()
    if (reduceMotion)
      draw(performance.now())
  })
  watch(isDark, () => reduceMotion && draw(performance.now()))

  if (reduceMotion) {
    draw(performance.now())
    return
  }

  let last = 0
  useRafFn(({ timestamp }) => {
    if (timestamp - last < 1000 / FPS)
      return
    last = timestamp
    draw(timestamp)
  })
})
</script>

<template>
  <canvas
    ref="el"
    class="art-canvas pointer-events-none fixed inset-0 z--1 h-full w-full print:hidden"
    aria-hidden="true"
  />
</template>

<style scoped>
.art-canvas {
  animation: art-fade-in 1.2s ease both;
}

@keyframes art-fade-in {
  from {
    opacity: 0;
  }
}
</style>
