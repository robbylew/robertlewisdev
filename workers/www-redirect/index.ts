/**
 * Permanently redirects www.robertlewis.dev to robertlewis.dev, keeping the path and query.
 * Runs only on the `www.robertlewis.dev/*` route; the apex is served directly by Cloudflare Pages.
 *
 *   npx wrangler deploy --config workers/www-redirect/wrangler.jsonc
 */
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url)
    url.protocol = 'https:'
    url.hostname = 'robertlewis.dev'
    url.port = ''
    return Response.redirect(url.toString(), 301)
  },
}
