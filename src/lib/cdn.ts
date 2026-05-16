const CDN_CONFIG_KEY = 'love_cdn_config'

export function getCdnConfig(): { url?: string; enabled?: boolean } {
  try {
    const cached = localStorage.getItem(CDN_CONFIG_KEY)
    if (cached) return JSON.parse(cached)
  } catch {}
  return {}
}

export function saveCdnConfig(url: string, enabled: boolean) {
  try {
    localStorage.setItem(CDN_CONFIG_KEY, JSON.stringify({ url, enabled }))
  } catch {}
}

export function toCdnUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.startsWith('https://raw.githubusercontent.com/')) return rawUrl
  const { url, enabled } = getCdnConfig()
  if (enabled !== false && url) {
    const prefix = url.replace(/\/?$/, '/')
    return rawUrl.replace('https://raw.githubusercontent.com/', prefix)
  }
  return rawUrl
}

export function preloadImages(urls: string[]) {
  for (const rawUrl of urls) {
    const cdnUrl = toCdnUrl(rawUrl)
    if (cdnUrl) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = cdnUrl
      document.head.appendChild(link)
    }
  }
}
