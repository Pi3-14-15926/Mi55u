import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { defaultConfig } from '@/lib/defaultConfig'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const cached = localStorage.getItem('love_config.json')
    if (!cached) return
    try {
      const config = JSON.parse(cached)
      if (config.siteTitle) document.title = config.siteTitle
      if (config.siteIcon) {
        let el = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        if (!el) {
          el = document.createElement('link')
          el.rel = 'icon'
          document.head.appendChild(el)
        }
        el.href = config.siteIcon
      }
    } catch {}
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            color: '#4A3740',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}
