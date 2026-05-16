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
