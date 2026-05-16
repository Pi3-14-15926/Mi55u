import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn, changePassword } from '@/lib/auth'
import { fetchData } from '@/lib/data'
import { saveData } from '@/lib/storage'
import type { Config } from '@/lib/data'

export default function AdminSecurity() {
  const router = useRouter()
  const [cdnUrl, setCdnUrl] = useState('https://cdn.jsdelivr.net/gh/Pi3-14-15926/Mi55u@main/')
  const [cdnEnabled, setCdnEnabled] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    loadCdnConfig()
  }, [router])

  const loadCdnConfig = async () => {
    const config = await fetchData<Config>('/data/config.json')
    if (config) {
      if (config.cdnUrl) setCdnUrl(config.cdnUrl)
      if (config.cdnEnabled !== undefined) setCdnEnabled(config.cdnEnabled)
    }
  }

  const saveCdnConfig = () => {
    fetchData<Config>('/data/config.json').then((config: Config | null) => {
      saveData('config.json', { ...(config || {}), cdnUrl: cdnUrl.trim() || undefined, cdnEnabled })
      toast.success('CDN 配置已保存')
    })
  }

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

        <div className="card mt-6 space-y-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>🚀 图片 CDN 加速</h2>
          <p className="text-xs" style={{ color: '#959595' }}>
            配置 CDN 地址替换 <code className="px-1 rounded" style={{ background: '#f5f5f5', color: '#d63384' }}>raw.githubusercontent.com</code>，加速中国大陆图片加载。
            jsDelivr 格式：<code className="px-1 rounded" style={{ background: '#f5f5f5', color: '#d63384' }}>https://cdn.jsdelivr.net/gh/user/repo@main/</code>
          </p>
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>CDN 地址</label>
            <div className="flex gap-2 items-center">
              <input
                type="url"
                value={cdnUrl}
                onChange={(e) => setCdnUrl(e.target.value)}
                placeholder="https://cdn.jsdelivr.net/gh/user/repo@main/"
                className="input-field flex-1"
              />
              <button
                onClick={() => setCdnEnabled(!cdnEnabled)}
                className="w-10 h-6 rounded-full relative transition-colors flex-shrink-0"
                style={{ background: cdnEnabled ? '#2098ff' : '#d0cece' }}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm"
                  style={{ transform: cdnEnabled ? 'translateX(5px)' : 'translateX(1px)' }}
                />
              </button>
              <span className="text-xs whitespace-nowrap" style={{ color: '#959595' }}>{cdnEnabled ? '已开启' : '已关闭'}</span>
            </div>
          </div>
          {cdnUrl && (
            <div className="flex gap-2 items-center text-xs" style={{ color: '#959595' }}>
              <span>示例效果：</span>
              <code className="px-1 rounded truncate max-w-[300px]" style={{ background: '#f5f5f5' }}>
                {cdnUrl.replace(/\/?$/, '/')}user/repo/main/photo.jpg
              </code>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={saveCdnConfig} className="btn text-sm">保存 CDN 配置</button>
            {cdnUrl && (
              <button onClick={() => { setCdnUrl(''); saveCdnConfig() }} className="btn-outline text-sm">清除 CDN</button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link href="/admin/dashboard" className="btn-outline text-sm">返回</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
