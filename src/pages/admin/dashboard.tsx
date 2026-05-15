import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn, logout } from '@/lib/auth'
import { fetchData } from '@/lib/data'
import type { Config, Photo, DiaryEntry, TodoItem } from '@/lib/data'

export default function AdminDashboard() {
  const router = useRouter()
  const [config, setConfig] = useState<Config | null>(null)
  const [stats, setStats] = useState({ photos: 0, diary: 0, todos: 0, done: 0 })

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    loadStats()
  }, [router])

  const loadStats = async () => {
    const cfg = await fetchData<Config>('/data/config.json')
    setConfig(cfg)
    fetchData<Photo[]>('/data/photos.json').then((d) => setStats((s) => ({ ...s, photos: d?.length || 0 })))
    fetchData<DiaryEntry[]>('/data/diary.json').then((d) => setStats((s) => ({ ...s, diary: d?.length || 0 })))
    fetchData<TodoItem[]>('/data/todos.json').then((d) => {
      const items = d || []
      setStats((s) => ({ ...s, todos: items.length, done: items.filter((t) => t.done).length }))
    })
  }

  const handleLogout = () => {
    logout(); toast.success('已退出'); router.push('/admin')
  }

  return (
    <AdminLayout>
      <div className="page-section">
          <div className="flex items-center justify-between mb-8">
          <div>
            {config && <p className="text-2xl font-bold" style={{ color: '#333', fontFamily: "'Noto Serif SC', serif" }}>{config.siteTitle || `${config.maleName} & ${config.femaleName} 的小站`}</p>}
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">退出</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: '照片', value: stats.photos, icon: '/icons/jinqi.svg' },
            { label: '日记', value: stats.diary, icon: '/icons/diandi.svg' },
            { label: '清单', value: stats.todos, icon: '/icons/qingdan.svg' },
            { label: '已完成', value: stats.done, icon: '/icons/qingdan.svg' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card text-center" style={{ padding: '1.5rem' }}>
              <img src={stat.icon} alt="" className="w-10 h-10 mx-auto mb-1" />
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs" style={{ color: '#959595' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="card">
          <div className="flex items-center gap-4 mb-3">
            {config?.avatarUrlMale ? (
              <img src={config.avatarUrlMale} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid rgba(208,206,206,0.4)' }} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-love-100 flex items-center justify-center text-xl">👨</div>
            )}
            <div className="flex-1">
              <p className="font-bold" style={{ color: '#333' }}>{config?.maleName} & {config?.femaleName}</p>
              <p className="text-xs" style={{ color: '#959595' }}>认识 {config?.meetDate} · 相恋 {config?.loveDate}</p>
            </div>
            {config?.avatarUrlFemale ? (
              <img src={config.avatarUrlFemale} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid rgba(208,206,206,0.4)' }} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-love-100 flex items-center justify-center text-xl">👩</div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/" className="btn-outline text-sm">🏠 返回首页</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
