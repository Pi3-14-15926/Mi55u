import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { login, isLoggedIn } from '@/lib/auth'
import { fetchData } from '@/lib/data'
import type { Config } from '@/lib/data'
import { defaultConfig } from '@/lib/defaultConfig'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteIcon, setSiteIcon] = useState('')
  const [siteTitle, setSiteTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin/dashboard')
  }, [router])

  useEffect(() => {
    fetchData<Config>('/data/config.json').then((cfg) => {
      const c = cfg || defaultConfig
      setSiteIcon(c.siteIcon || '')
      setSiteTitle(c.siteTitle || '')
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (login(password)) {
        toast.success('登录成功')
        router.push('/admin/dashboard')
      } else {
        toast.error('密码错误')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '2.5rem', width: '100%', maxWidth: '24rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)' }}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(208,206,206,0.4)' }}>
            {siteIcon ? (
              <img src={siteIcon} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', fill: '#fff' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{siteTitle || '管理后台'}</h1>
          <p className="text-sm mt-1" style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>欢迎您 请登录~</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#959595', fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: '0.05em' }}>密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" className="input-field" autoFocus />
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.75rem',
              background: !password ? '#e0e0e0' : '#000',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 700,
              cursor: !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.23s linear',
              boxShadow: !password ? 'none' : '0 2px 10px rgba(92,92,92,0.44)',
            }}
            onMouseEnter={(e) => { if (!loading && password) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { if (!loading && password) e.currentTarget.style.opacity = '1' }}
          >
            {loading ? '验证中...' : '登录'}
          </button>
        </form>

      </motion.div>
    </div>
  )
}
