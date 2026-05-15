import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'

interface AdminLayoutProps {
  children: ReactNode
}

const navGroups = [
  {
    title: '网站内容',
    items: [
      { href: '/admin/upload', label: '上传文件', icon: '📤' },
      { href: '/admin/files', label: '文件管理', icon: '🗂️' },
      { href: '/admin/diary', label: '编辑日记', icon: '📝' },
      { href: '/admin/todos', label: '编辑清单', icon: '✅' },
    ],
  },
  {
    title: '系统设置',
    items: [
      { href: '/admin/info', label: '信息设置', icon: '📋' },
      { href: '/admin/settings', label: '网站设置', icon: '⚙️' },
      { href: '/admin/backup', label: '导入导出', icon: '💾' },
    ],
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/admin')
    } else {
      setChecked(true)
    }
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [router.pathname])

  if (!checked) return null

  const isActive = (href: string) => router.pathname === href

  return (
    <div className="min-h-screen grid-bg flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50
        w-60 glass border-r
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex flex-col flex-shrink-0
      `} style={{ borderColor: 'rgba(208,206,206,0.4)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(208,206,206,0.4)' }}>
          <Link href="/admin/dashboard" className="flex items-center gap-2 no-underline">
            <span className="font-bold text-lg" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>管理后台</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-medium px-3 mb-2 tracking-wider" style={{ color: '#959595' }}>{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all
                      ${isActive(item.href) ? 'bg-love-100/80 font-semibold' : 'hover:bg-love-50/80'}
                    `}
                    style={{ color: isActive(item.href) ? '#2098ff' : '#555' }}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontFamily: "'Noto Serif SC', serif" }}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(208,206,206,0.4)' }}>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm no-underline hover:bg-love-50/80 transition-all" style={{ color: '#959595' }}>
            <span>🏠</span>
            <span style={{ fontFamily: "'Noto Serif SC', serif" }}>返回首页</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 border-b glass" style={{ borderColor: 'rgba(208,206,206,0.4)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-xl p-1" style={{ color: '#555' }}>
            ☰
          </button>
          <Link href="/admin/dashboard" className="font-bold no-underline" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>管理后台</Link>
          <Link href="/" className="text-sm no-underline" style={{ color: '#959595' }}>首页</Link>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
