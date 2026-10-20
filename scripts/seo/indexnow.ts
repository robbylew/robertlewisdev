import { site } from '../../src/site.ts'

/**
 * IndexNow ownership key (public by design, served at `/{key}.txt`).
 * See https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY = 'ca67d12c0ae22e8076ff499efbdee0ae'

/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver, …) that URLs changed.
 * Bing also powers DuckDuckGo, Yahoo and ChatGPT search results.
 */
export async function submitToIndexNow(urls: string[]): Promise<number> {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: site.domain,
      key: INDEXNOW_KEY,
      keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
    signal: AbortSignal.timeout(10_000),
  })
  // 200 = accepted, 202 = accepted while the key is being verified.
  if (response.status !== 200 && response.status !== 202)
    throw new Error(`IndexNow responded ${response.status}: ${(await response.text()).slice(0, 200)}`)
  return response.status
}
