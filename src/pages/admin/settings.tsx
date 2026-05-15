import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn } from '@/lib/auth'
import { saveData } from '@/lib/storage'
import { fetchData } from '@/lib/data'
import type { Config } from '@/lib/data'

export default function AdminSettings() {
  const router = useRouter()
  const [config, setConfig] = useState<Config | null>(null)
  const [form, setForm] = useState<Config>({
    maleName: '', femaleName: '', meetDate: '', loveDate: '',
    avatarUrlMale: '', avatarUrlFemale: '',
    siteTitle: '', siteName: '', siteDescription: '', footerText: '',
    showMeetCount: true, showLoveCount: true, homepageBg: '', siteIcon: '', copyrightText: '',
  })

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    fetchData<Config>('/data/config.json').then((cfg) => {
      if (cfg) {
        setConfig(cfg)
        setForm({
          ...cfg,
          showMeetCount: cfg.showMeetCount !== false,
          showLoveCount: cfg.showLoveCount !== false,
          homepageBg: cfg.homepageBg || '',
          siteIcon: cfg.siteIcon || '',
          copyrightText: cfg.copyrightText || '',
        })
      }
    })
  }, [router])

  const saveConfig = () => {
    saveData('config.json', form)
    setConfig(form)
    toast.success('配置已保存')
  }

  return (
    <AdminLayout>
      <div className="page-section">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>🌐 网站设置</h1>

        <div className="card space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>网站标题</label>
            <input type="text" value={form.siteTitle || ''} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} placeholder="LoveSpace" className="input-field" />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>网站名称</label>
            <input type="text" value={form.siteName || ''} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="LoveSpace" className="input-field" />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>卡片文案</label>
            <input type="text" value={form.siteDescription || ''} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} placeholder="记录我们的故事" className="input-field" />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>版权信息</label>
            <input type="text" value={form.copyrightText || ''} onChange={(e) => setForm({ ...form, copyrightText: e.target.value })} placeholder="💖 Made with Love 💖" className="input-field" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>副标题</label>
            <input type="text" value={form.footerText || ''} onChange={(e) => setForm({ ...form, footerText: e.target.value })} placeholder="LoveSpace - 记录我们的故事" className="input-field" />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>网站图标</label>
            <div className="flex gap-2 items-center">
              <input type="url" value={form.siteIcon || ''} onChange={(e) => setForm({ ...form, siteIcon: e.target.value })} placeholder="https://example.com/favicon.ico" className="input-field flex-1" />
              {form.siteIcon && <img src={form.siteIcon} alt="" className="w-8 h-8 rounded flex-shrink-0" />}
            </div>
            <p className="text-xs mt-1" style={{ color: '#959595' }}>浏览器标签页图标，支持 .ico / .png / .svg URL</p>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>主页背景</label>
            <input type="text" value={form.homepageBg || ''} onChange={(e) => setForm({ ...form, homepageBg: e.target.value })} placeholder="linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)" className="input-field" />
            <p className="text-xs mt-1" style={{ color: '#959595' }}>直接输入图片 URL 或 CSS 渐变值，留空使用默认</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={saveConfig} className="btn text-sm">保存配置</button>
          {config && (
            <button onClick={() => {
              setForm({
                ...config,
                showMeetCount: config.showMeetCount !== false,
                showLoveCount: config.showLoveCount !== false,
                homepageBg: config.homepageBg || '',
                siteIcon: config.siteIcon || '',
                copyrightText: config.copyrightText || '',
              })
              toast.success('已重置')
            }} className="btn-outline text-sm">重置</button>
          )}
          <Link href="/admin/dashboard" className="btn-outline text-sm">返回</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
