export function toCdnUrl(url: string): string {
  if (!url || !url.startsWith('https://raw.githubusercontent.com/')) return url
  try {
    const cached = localStorage.getItem('love_config.json')
    if (cached) {
      const config = JSON.parse(cached)
      if (config.cdnEnabled !== false && config.cdnUrl) {
        const prefix = config.cdnUrl.replace(/\/?$/, '/')
        return url.replace('https://raw.githubusercontent.com/', prefix)
      }
    }
  } catch {}
  return url
}

export function preloadImages(urls: string[]) {
  for (const url of urls) {
    const cdnUrl = toCdnUrl(url)
    if (cdnUrl) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = cdnUrl
      document.head.appendChild(link)
    }
  }
}
