**[robertlewis.dev](https://robertlewis.dev)** — personal website of Robert Lewis, machine learning engineer.

Statically generated with Vue 3, Vite, vite-ssg and UnoCSS. Every page ships as pre-rendered HTML with its CSS inlined, per-page social preview images, structured data, a sitemap and RSS/Atom feeds.

## Getting started

Requires Node.js 22+ (see `.nvmrc`) and pnpm (pinned via `packageManager`, enable it once with `corepack enable pnpm`).

```bash
pnpm install
pnpm dev        # http://localhost:3333
pnpm build      # static site in dist/
pnpm preview    # serve dist/ locally
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Pre-renders every page, then generates `og/*.png`, `sitemap.xml`, `feed.xml` and `atom.xml` |
| `pnpm lint` / `pnpm lint:fix` | ESLint ([@antfu/eslint-config](https://github.com/antfu/eslint-config)) |
| `pnpm typecheck` | `vue-tsc` type checking |
| `pnpm img <files…>` | Convert images to WebP (`--max-width`, `--quality`, `--replace`) |
| `pnpm icons` | Regenerate favicons/app icons from the logo in `src/logo.ts` |

To preview exactly like production (headers, redirects, 404s), run `npx wrangler pages dev dist` after building.

## Content

Every Markdown file in `pages/` is a route (`pages/posts/shazam.md` → `/posts/shazam`). Vue components from `src/components/` can be used directly in Markdown.

```yaml
---
title: My new post # page <h1> and document title ("{title} · Robert Lewis")
description: One or two sentences # meta description + social previews (aim for 110–160 chars)
date: 2025-03-04 # posts only: publish date (shows in the blog list, feeds, sitemap)
updated: 2025-04-01 # optional: last meaningful update
tags: [audio, algorithms] # optional
duration: 20min # optional: overrides the computed reading time
draft: true # optional: hidden from lists and marked noindex
---
```

Other optional fields: `display` (visible H1 if different from `title`), `subtitle`, `seoTitle` (full `<title>` override), `image`/`imageAlt` (custom social image), `ogTitle`/`ogLabel` (generated card text), `noindex`, `art` (`plum`, `dots`, `random`, `none`), `tocAlwaysOn`. Put `[[toc]]` in a post for a table of contents and `<!-- @layout-full-width -->` to opt out of the reading-width layout.

- **Projects** live in `src/data/projects.ts` (`featured: true` shows them on the home page).
- **Resume** lives in `src/data/resume.ts` and mirrors `public/Robert_Lewis_Resume.pdf` — update both together.
- **Site-wide details** (name, socials, description, email) live in `src/site.ts`.

### Images

Put images in `public/images/` and convert them with `pnpm img public/images/photo.jpg --replace`. Markdown images automatically get their intrinsic `width`/`height` (no layout shift) plus lazy loading. Images are cached for 30 days, so give a replaced image a new file name.

## SEO and link previews

Generated automatically for every page from its frontmatter:

- `<title>`, meta description, canonical URL and robots directives
- Open Graph and Twitter/X cards with a 1200×630 preview image (`dist/og/*.png`, rendered at build time with Satori), which is what iMessage, Slack, LinkedIn and others show
- JSON-LD structured data: `Person` and `WebSite` everywhere, `ProfilePage` on the home page, `BlogPosting` and `BreadcrumbList` on posts
- `sitemap.xml`, `feed.xml` (RSS) and `atom.xml`; a real `404.html` so unknown URLs return HTTP 404

Validate with the [Rich Results Test](https://search.google.com/test/rich-results) and refresh link previews with the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

## Deployment

Hosted on Cloudflare Pages (project `robertlewisdev-v2`), deployed on every push to `main`; other branches get preview URLs.

- Build command `pnpm run build`, output directory `dist`, Node.js version from `.nvmrc`
- Response headers (security, caching) and redirects live in `public/_headers` and `public/_redirects`
- pnpm's supply-chain policies (release-age cooldown, trust checks) are configured in `pnpm-workspace.yaml`

Recommended one-time setup in the Cloudflare dashboard:

1. **Rules → Redirect Rules →** template *Redirect from WWW to root* (`www.robertlewis.dev` currently serves a duplicate copy; canonical tags mitigate it, a 301 fixes it).
2. **Caching → Configuration → Crawler Hints: On** (notifies Bing and others of changes via IndexNow).
3. **Speed → Optimization:** keep Rocket Loader off (it breaks module scripts).

Then verify the domain in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) and submit `https://robertlewis.dev/sitemap.xml`.

## License

<samp>Code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a>.</samp>
