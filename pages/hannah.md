---
title: Hannah the Australian Shepherd
display: Hannah Banana 🍌
description: Meet Hannah, my Australian Shepherd and favorite hiking buddy.
wrapperClass: text-center
art: random
---

<!-- @layout-full-width -->
<div class="mx-auto mb-8 max-w-3xl">
  <p class="mb-8 text-center text-lg color-muted slide-enter">Meet Hannah, my Australian Shepherd and favorite hiking buddy.</p>
  <ul class="gallery grid grid-cols-1 gap-4 sm:grid-cols-3">
    <li class="gallery-item slide-enter" style="--enter-stage: 1">
      <picture><source type="image/avif" srcset="/images/hannah/hannah-1-480.avif 480w, /images/hannah/hannah-1-640.avif 640w, /images/hannah/hannah-1.avif 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)"><img src="/images/hannah/hannah-1.webp" srcset="/images/hannah/hannah-1-480.webp 480w, /images/hannah/hannah-1-640.webp 640w, /images/hannah/hannah-1.webp 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)" width="768" height="1024" alt="Robert and Hannah, a tri-color Australian Shepherd, taking a selfie under autumn leaves" data-zoomable fetchpriority="high"></picture>
    </li>
    <li class="gallery-item slide-enter" style="--enter-stage: 2">
      <picture><source type="image/avif" srcset="/images/hannah/hannah-2-480.avif 480w, /images/hannah/hannah-2-640.avif 640w, /images/hannah/hannah-2.avif 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)"><img src="/images/hannah/hannah-2.webp" srcset="/images/hannah/hannah-2-480.webp 480w, /images/hannah/hannah-2-640.webp 640w, /images/hannah/hannah-2.webp 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)" width="768" height="1024" alt="Robert in a sun hat and Hannah taking a break under a pine tree on a mountain hike" loading="lazy" decoding="async" data-zoomable></picture>
    </li>
    <li class="gallery-item slide-enter" style="--enter-stage: 3">
      <picture><source type="image/avif" srcset="/images/hannah/hannah-3-480.avif 480w, /images/hannah/hannah-3-640.avif 640w, /images/hannah/hannah-3.avif 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)"><img src="/images/hannah/hannah-3.webp" srcset="/images/hannah/hannah-3-480.webp 480w, /images/hannah/hannah-3-640.webp 640w, /images/hannah/hannah-3.webp 768w" sizes="(min-width: 816px) 245px, (min-width: 640px) calc((100vw - 80px) / 3), calc(100vw - 48px)" width="768" height="1024" alt="Hannah smiling next to Robert on a sunny hillside hiking trail" loading="lazy" decoding="async" data-zoomable></picture>
    </li>
  </ul>
</div>

<style>
.gallery {
  list-style: none;
  margin: 0;
  padding: 0;
}

.gallery-item {
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
  transition: box-shadow 0.3s ease;
}

.gallery-item:hover {
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.18);
}

.gallery-item picture {
  display: block;
  width: 100%;
  height: 100%;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.04);
}
</style>
