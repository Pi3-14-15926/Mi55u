import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn, changePassword } from '@/lib/auth'

export default function AdminSecurity() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
  }, [router])

  return (
    <AdminLayout>
      <div className="page-section">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>🔒 安全设置</h1>

        <div className="card space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>当前密码</label>
            <input type="password" id="oldPwd" className="input-field" placeholder="输入当前密码" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>新密码</label>
            <input type="password" id="newPwd" className="input-field" placeholder="输入新密码（至少 4 位）" />
          </div>
          <button onClick={() => {
            const oldPwd = (document.getElementById('oldPwd') as HTMLInputElement).value
            const newPwd = (document.getElementById('newPwd') as HTMLInputElement).value
            if (!oldPwd || !newPwd) { toast.error('请填写完整'); return }
            if (newPwd.length < 4) { toast.error('密码至少 4 位'); return }
            if (changePassword(oldPwd, newPwd)) {
              toast.success('密码已修改')
              ;(document.getElementById('oldPwd') as HTMLInputElement).value = ''
              ;(document.getElementById('newPwd') as HTMLInputElement).value = ''
            } else {
              toast.error('当前密码错误')
            }
          }} className="btn text-sm">修改密码</button>
        </div>

        <div className="mt-6">
          <Link href="/admin/dashboard" className="btn-outline text-sm">返回</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
