<script setup lang="ts">
import type { Fn } from '@vueuse/core'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const COLOR = '#88888828'
const MIN_BRANCH = 30
const BRANCH_LENGTH = 6
const FRAME_INTERVAL = 1000 / 40

const el = ref<HTMLCanvasElement>()
const size = reactive(useWindowSize())

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  return [x + r * Math.cos(theta), y + r * Math.sin(theta)]
}

onMounted(() => {
  const canvas = el.value!
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const { random } = Math
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = size.width
  const height = size.height
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.scale(dpr, dpr)
  ctx.lineWidth = 1
  ctx.strokeStyle = COLOR

  let steps: Fn[] = []
  let prevSteps: Fn[] = []

  const step = (x: number, y: number, rad: number, counter = { value: 0 }) => {
    const length = random() * BRANCH_LENGTH
    counter.value += 1

    const [nx, ny] = polar2cart(x, y, length, rad)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()

    // out of bounds
    if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100)
      return

    const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5
    const rad1 = rad + random() * r15
    const rad2 = rad - random() * r15
    if (random() < rate)
      steps.push(() => step(nx, ny, rad1, counter))
    if (random() < rate)
      steps.push(() => step(nx, ny, rad2, counter))
  }

  const randomMiddle = () => random() * 0.6 + 0.2
  steps = [
    () => step(randomMiddle() * width, -5, r90),
    () => step(randomMiddle() * width, height + 5, -r90),
    () => step(-5, randomMiddle() * height, 0),
    () => step(width + 5, randomMiddle() * height, r180),
  ]
  if (width < 500)
    steps = steps.slice(0, 2)

  // Reduced motion: grow the whole tree at once instead of animating it.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    while (steps.length) {
      prevSteps = steps
      steps = []
      prevSteps.forEach(fn => fn())
    }
    return
  }

  let lastTime = performance.now()
  const controls = useRafFn(() => {
    if (performance.now() - lastTime < FRAME_INTERVAL)
      return
    lastTime = performance.now()

    prevSteps = steps
    steps = []
    if (!prevSteps.length) {
      controls.pause()
      return
    }

    // Postpone half of the steps to the next frame for a more organic look.
    prevSteps.forEach((fn) => {
      if (random() < 0.5)
        steps.push(fn)
      else
        fn()
    })
  })
})
</script>

<template>
  <div class="plum-mask pointer-events-none fixed inset-0 z--1 print:hidden" aria-hidden="true">
    <canvas ref="el" />
  </div>
</template>

<style scoped>
.plum-mask {
  -webkit-mask-image: radial-gradient(circle, transparent, black);
  mask-image: radial-gradient(circle, transparent, black);
}
</style>
