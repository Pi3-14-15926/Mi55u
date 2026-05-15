import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { login, isLoggedIn } from '@/lib/auth'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin/dashboard')
  }, [router])

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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '2.5rem', width: '100%', maxWidth: '24rem' }}
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-4xl mb-3"
          >
            <svg viewBox="0 0 32 29.6" style={{ width: '2.5rem', height: '2.5rem', fill: '#f16b4f', margin: '0 auto' }}>
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>管理后台</h1>
          <p className="text-sm mt-1" style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>LoveSpace Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" className="input-field text-center" autoFocus />
          <button type="submit" disabled={loading || !password} className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? '验证中...' : '进入后台'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#959595' }}>默认密码: love2024</p>
      </motion.div>
    </div>
  )
}
