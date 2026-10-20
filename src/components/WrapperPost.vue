<script setup lang="ts">
import type { PageFrontmatter } from '~/types'
import { useSeo } from '~/composables/seo'
import { formatDate, onIdle } from '~/logics'
import { getPosts } from '~/logics/posts'
import { absoluteUrl, site } from '~/site'

const props = defineProps<{ frontmatter: PageFrontmatter }>()

const router = useRouter()
const route = useRoute()
const content = ref<HTMLElement>()

useSeo(props.frontmatter, route.path)

const title = computed(() => props.frontmatter.display ?? props.frontmatter.title)
const isPost = computed(() => route.path.startsWith('/posts/') && Boolean(props.frontmatter.date))
const showUpdated = computed(() => props.frontmatter.updated && props.frontmatter.updated !== props.frontmatter.date)
const backLink = computed(() => route.path.startsWith('/posts/') ? '/blogs' : '/')

const adjacent = computed(() => {
  if (!isPost.value)
    return {}
  const posts = getPosts(router, props.frontmatter.type ?? 'blog')
  const index = posts.findIndex(post => post.path === route.path)
  return index === -1 ? {} : { newer: posts[index - 1], older: posts[index + 1] }
})

const shareLinks = computed(() => {
  const url = encodeURIComponent(absoluteUrl(route.path))
  const text = encodeURIComponent(String(props.frontmatter.title ?? site.name))
  return [
    { name: 'X', icon: 'i-ri-twitter-x-line', href: `https://x.com/intent/post?text=${text}&url=${url}&via=${site.twitter.slice(1)}` },
    { name: 'LinkedIn', icon: 'i-ri-linkedin-box-line', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { name: 'Bluesky', icon: 'i-ri-bluesky-line', href: `https://bsky.app/intent/compose?text=${text}%20${url}` },
  ]
})

const { copy: copyLink, copied: linkCopied } = useClipboard({ copiedDuring: 2000, legacy: true })

// Background art is decided after mount so the server and hydration renders match.
const ArtPlum = defineAsyncComponent(() => import('./ArtPlum.vue'))
const ArtDots = defineAsyncComponent(() => import('./ArtDots.vue'))
const art = ref<'plum' | 'dots'>()

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  const choice = props.frontmatter.art ?? 'random'
  // Decorative, so start it only once the page is idle to keep first paint and input snappy.
  if (choice !== 'none') {
    onIdle(() => {
      art.value = choice === 'random' ? (Math.random() > 0.5 ? 'plum' : 'dots') : choice
    })
  }

  const scrollToHash = () => {
    if (!location.hash)
      return false
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (!el)
      return false
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    return true
  }

  const copyCode = async (button: HTMLButtonElement) => {
    const code = button.parentElement?.querySelector('pre')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(code)
      button.dataset.copied = 'true'
      button.setAttribute('aria-label', 'Copied')
      setTimeout(() => {
        delete button.dataset.copied
        button.setAttribute('aria-label', 'Copy code to clipboard')
      }, 2000)
    }
    catch {}
  }

  // Markdown links are plain anchors; route same-site ones through the router.
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const button = target.closest<HTMLButtonElement>('button.copy-code')
    if (button) {
      copyCode(button)
      return
    }

    const link = target.closest('a')
    if (
      !link
      || event.defaultPrevented
      || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.target === '_blank'
      || link.hasAttribute('download')
      || link.rel.includes('external')
    ) {
      return
    }

    const url = new URL(link.href, location.href)
    // Let the browser handle other origins and static files (PDFs, feeds, images).
    if (url.origin !== location.origin || /\.\w+$/.test(url.pathname))
      return

    event.preventDefault()
    if (url.hash && url.pathname === location.pathname) {
      history.replaceState(history.state, '', url.hash)
      scrollToHash()
    }
    else {
      router.push({ path: url.pathname, hash: url.hash })
    }
  }

  useEventListener(window, 'hashchange', scrollToHash)
  useEventListener(content, 'click', handleClick)

  setTimeout(() => {
    if (!scrollToHash())
      setTimeout(scrollToHash, 1000)
  }, 1)
})
</script>

<template>
  <ArtPlum v-if="art === 'plum'" />
  <ArtDots v-else-if="art === 'dots'" />

  <div v-if="isPost" class="reading-progress" aria-hidden="true" />

  <header v-if="title" class="page-header prose m-auto mb-8" :class="[frontmatter.wrapperClass]">
    <h1 class="mb-0 slide-enter-50">
      {{ title }}
    </h1>
    <p v-if="frontmatter.subtitle" class="page-subtitle slide-enter">
      {{ frontmatter.subtitle }}
    </p>
    <p v-if="frontmatter.date" class="page-meta slide-enter">
      <time :datetime="frontmatter.date">{{ formatDate(frontmatter.date) }}</time>
      <template v-if="frontmatter.readingTime">
        <span aria-hidden="true">·</span>
        <span>{{ frontmatter.readingTime }}</span>
      </template>
      <template v-if="showUpdated">
        <span aria-hidden="true">·</span>
        <span>Updated <time :datetime="frontmatter.updated">{{ formatDate(frontmatter.updated!) }}</time></span>
      </template>
    </p>
    <ul v-if="frontmatter.tags?.length" class="page-tags slide-enter" aria-label="Tags">
      <li v-for="tag in frontmatter.tags" :key="tag" class="tag">
        #{{ tag }}
      </li>
    </ul>
    <p v-if="frontmatter.draft" class="draft-notice slide-enter">
      This is a draft post — the content may be incomplete. Please check back later.
    </p>
  </header>

  <article ref="content" :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]">
    <slot />
  </article>

  <footer v-if="route.path !== '/'" class="prose m-auto mb-6 mt-12 slide-enter animate-delay-500 print:hidden">
    <div v-if="isPost" class="share-row">
      <span class="text-sm color-muted">Share this post</span>
      <div class="flex items-center gap-1">
        <a
          v-for="link in shareLinks"
          :key="link.name"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-btn text-lg"
          :title="`Share on ${link.name}`"
        >
          <span :class="link.icon" aria-hidden="true" />
          <span class="sr-only">Share on {{ link.name }} (opens in a new tab)</span>
        </a>
        <button
          type="button"
          class="icon-btn text-lg"
          :title="linkCopied ? 'Link copied' : 'Copy link'"
          @click="copyLink(absoluteUrl(route.path))"
        >
          <span :class="linkCopied ? 'i-ri-check-line text-teal-500' : 'i-ri-link'" aria-hidden="true" />
          <span class="sr-only">{{ linkCopied ? 'Link copied' : 'Copy link' }}</span>
        </button>
      </div>
    </div>

    <nav v-if="adjacent.newer || adjacent.older" class="post-nav" aria-label="More posts">
      <RouterLink v-if="adjacent.older" :to="adjacent.older.path" class="post-nav-link">
        <span class="post-nav-label"><span class="i-ri-arrow-left-line" aria-hidden="true" /> Older</span>
        <span class="post-nav-title">{{ adjacent.older.title }}</span>
      </RouterLink>
      <RouterLink v-if="adjacent.newer" :to="adjacent.newer.path" class="post-nav-link text-right sm:col-start-2">
        <span class="post-nav-label justify-end">Newer <span class="i-ri-arrow-right-line" aria-hidden="true" /></span>
        <span class="post-nav-title">{{ adjacent.newer.title }}</span>
      </RouterLink>
    </nav>

    <p class="back-link">
      <span class="font-mono opacity-60" aria-hidden="true">&gt; </span>
      <RouterLink :to="backLink" class="font-mono">
        cd ..
      </RouterLink>
    </p>
  </footer>
</template>
