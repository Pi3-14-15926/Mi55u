import { useEffect, useState } from 'react'
import { fetchData } from '@/lib/data'
import { defaultConfig } from '@/lib/defaultConfig'
import type { Config } from '@/lib/data'

export default function Footer() {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    fetchData<Config>('/data/config.json').then(setConfig)
  }, [])

  const copyrightText = config?.copyrightText || defaultConfig.copyrightText || '💖 Made with Love 💖'
  const footerText = config?.footerText || defaultConfig.footerText || 'LoveSpace - 记录我们的故事'

  return (
    <footer className="text-center py-12 px-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-love-400 text-sm mb-2">{copyrightText}</p>
        <p className="text-love-400 text-xs">{footerText}</p>
      </div>
    </footer>
  )
}
