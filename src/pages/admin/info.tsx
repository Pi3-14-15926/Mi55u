import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn } from '@/lib/auth'
import { saveData } from '@/lib/storage'
import { fetchData } from '@/lib/data'
import { defaultConfig } from '@/lib/defaultConfig'
import { toCdnUrl } from '@/lib/cdn'
import type { Config } from '@/lib/data'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-10 h-6 rounded-full relative transition-colors flex-shrink-0"
      style={{ background: checked ? '#2098ff' : '#d0cece' }}
    >
      <div
        className="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm"
        style={{ transform: checked ? 'translateX(5px)' : 'translateX(1px)' }}
      />
    </button>
  )
}

export default function AdminInfo() {
  const router = useRouter()
  const [config, setConfig] = useState<Config | null>(null)
  const [form, setForm] = useState<Config>({
    maleName: defaultConfig.maleName || '', femaleName: defaultConfig.femaleName || '',
    meetDate: defaultConfig.meetDate || '', loveDate: defaultConfig.loveDate || '',
    avatarUrlMale: defaultConfig.avatarUrlMale || '', avatarUrlFemale: defaultConfig.avatarUrlFemale || '',
    siteTitle: defaultConfig.siteTitle || '', siteName: defaultConfig.siteName || '',
    siteDescription: defaultConfig.siteDescription || '', footerText: defaultConfig.footerText || '',
    showMeetCount: defaultConfig.showMeetCount !== false,
    showLoveCount: defaultConfig.showLoveCount !== false,
    homepageBg: defaultConfig.homepageBg || '',
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
        })
      }
    })
  }, [router])

  const saveConfig = () => {
    if (!form.maleName.trim() || !form.femaleName.trim()) {
      toast.error('请填写双方姓名'); return
    }
    if (!form.meetDate || !form.loveDate) {
      toast.error('请填写日期'); return
    }
    saveData('config.json', form)
    setConfig(form)
    toast.success('信息已保存')
  }

  return (
    <AdminLayout>
      <div className="page-section">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>📋 信息设置</h1>

        <div className="card space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>男方姓名</label>
              <input type="text" value={form.maleName} onChange={(e) => setForm({ ...form, maleName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>女方姓名</label>
              <input type="text" value={form.femaleName} onChange={(e) => setForm({ ...form, femaleName: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>认识日期</label>
              <input type="date" value={form.meetDate} onChange={(e) => setForm({ ...form, meetDate: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>相恋日期</label>
              <input type="date" value={form.loveDate} onChange={(e) => setForm({ ...form, loveDate: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>男方头像</label>
              <div className="flex gap-2 items-center">
                <input type="url" value={form.avatarUrlMale || ''} onChange={(e) => setForm({ ...form, avatarUrlMale: e.target.value })} placeholder="头像 URL" className="input-field flex-1" />
                {form.avatarUrlMale && <img src={toCdnUrl(form.avatarUrlMale)} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid rgba(208,206,206,0.4)' }} />}
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>女方头像</label>
              <div className="flex gap-2 items-center">
                <input type="url" value={form.avatarUrlFemale || ''} onChange={(e) => setForm({ ...form, avatarUrlFemale: e.target.value })} placeholder="头像 URL" className="input-field flex-1" />
                {form.avatarUrlFemale && <img src={toCdnUrl(form.avatarUrlFemale)} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid rgba(208,206,206,0.4)' }} />}
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(208,206,206,0.3)' }} />

          <div>
            <label className="text-xs mb-2 block" style={{ color: '#959595' }}>主页显示开关</label>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Toggle checked={form.showMeetCount !== false} onChange={(v) => setForm({ ...form, showMeetCount: v })} />
                <span className="text-sm" style={{ color: '#555' }}>显示认识时间</span>
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={form.showLoveCount !== false} onChange={(v) => setForm({ ...form, showLoveCount: v })} />
                <span className="text-sm" style={{ color: '#555' }}>显示相恋时间</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={saveConfig} className="btn text-sm">保存信息</button>
          {config && (
            <button onClick={() => {
              setForm({
                ...config,
                showMeetCount: config.showMeetCount !== false,
                showLoveCount: config.showLoveCount !== false,
                homepageBg: config.homepageBg || '',
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
