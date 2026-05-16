import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchData } from '@/lib/data'
import { defaultConfig } from '@/lib/defaultConfig'
import type { Config } from '@/lib/data'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/album', label: '相册' },
  { href: '/diary', label: '日记' },
  { href: '/todo', label: '清单' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<Config | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchData<Config>('/data/config.json').then(setConfig)
  }, [])

  const siteTitle = config?.siteTitle || defaultConfig.siteTitle || 'LoveSpace'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="max-w-5xl mx-auto mt-3 glass" style={{ borderRadius: '2rem', border: '1px solid rgba(208,206,206,0.3)' }}>
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 no-underline" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <span className="font-bold" style={{ fontSize: '1.5rem', color: '#333' }}>
              {siteTitle}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 no-underline transition-all duration-200"
                  style={{
                    color: isActive ? '#333' : '#777',
                    fontWeight: isActive ? 700 : 400,
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: '1rem',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-line"
                      className="absolute bottom-0 left-2 right-2 h-0.5"
                      style={{ background: '#2098ff', borderRadius: '1px' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/admin"
              className="ml-3 px-4 py-1.5 no-underline transition-all duration-200"
              style={{
                color: '#777',
                fontFamily: "'Noto Serif SC', serif",
                fontSize: '0.85rem',
                border: '1px solid rgba(208,206,206,0.5)',
                borderRadius: '2rem',
              }}
            >
              管理
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-love-50 transition-colors"
          >
            <div className="w-5 h-0.5 bg-love-600 mb-1 rounded" />
            <div className="w-5 h-0.5 bg-love-600 mb-1 rounded" />
            <div className="w-5 h-0.5 bg-love-600 rounded" />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 no-underline rounded-xl transition-colors"
                    style={{
                      color: router.pathname === item.href ? '#333' : '#777',
                      background: router.pathname === item.href ? '#f5f5f5' : 'transparent',
                      fontFamily: "'Noto Serif SC', serif",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 no-underline rounded-xl transition-colors"
                  style={{ color: '#777', fontFamily: "'Noto Serif SC', serif" }}
                >
                  管理
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
