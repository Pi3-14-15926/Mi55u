import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn } from '@/lib/auth'
import { loadData } from '@/lib/storage'
import type { Config, Photo, DiaryEntry, TodoItem } from '@/lib/data'

const PREFIX = 'love_'

interface BackupData {
  exportTime: string
  config: Config | null
  photos: Photo[]
  diary: DiaryEntry[]
  todos: TodoItem[]
}

export default function AdminBackup() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [baking, setBaking] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
  }, [router])

  const handleBakeConfig = async () => {
    setBaking(true)
    try {
      const res = await fetch('/api/admin/bake-config', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast.success('默认配置已写入！请执行 npm run build 构建项目')
      } else {
        toast.error(data.error || '写入失败')
      }
    } catch {
      toast.error('请求失败，请确保开发服务器已启动')
    }
    setBaking(false)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const [config, photos, diary, todos] = await Promise.all([
        loadData<Config>('config.json'),
        loadData<Photo[]>('photos.json'),
        loadData<DiaryEntry[]>('diary.json'),
        loadData<TodoItem[]>('todos.json'),
      ])

      const data: BackupData = {
        exportTime: new Date().toLocaleString(),
        config,
        photos: photos || [],
        diary: diary || [],
        todos: todos || [],
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lovespace-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('导出成功')
    } catch {
      toast.error('导出失败')
    }
    setExporting(false)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const data: BackupData = JSON.parse(text)

      if (!data.config) {
        toast.error('无效的备份文件')
        setImporting(false)
        return
      }

      if (data.config) localStorage.setItem(PREFIX + 'config.json', JSON.stringify(data.config))
      if (data.photos) localStorage.setItem(PREFIX + 'photos.json', JSON.stringify(data.photos))
      if (data.diary) localStorage.setItem(PREFIX + 'diary.json', JSON.stringify(data.diary))
      if (data.todos) localStorage.setItem(PREFIX + 'todos.json', JSON.stringify(data.todos))

      toast.success(`导入成功（共 ${(data.photos?.length || 0) + (data.diary?.length || 0) + (data.todos?.length || 0)} 条数据）`)
    } catch {
      toast.error('导入失败，请检查文件格式')
    }
    setImporting(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">💾</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>导入导出</h1>
          <p className="text-sm mt-1" style={{ color: '#959595' }}>备份和恢复所有数据</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center" style={{ padding: '2rem' }}>
            <div className="text-4xl mb-3">📤</div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>导出数据</h3>
            <p className="text-sm mb-4" style={{ color: '#959595' }}>将所有数据（配置、照片、日记、清单）导出为 JSON 文件</p>
            <button onClick={handleExport} disabled={exporting} className="btn text-sm disabled:opacity-50">
              {exporting ? '导出中...' : '导出全部数据'}
            </button>
          </div>

          <div className="card text-center" style={{ padding: '2rem' }}>
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>导入数据</h3>
            <p className="text-sm mb-4" style={{ color: '#959595' }}>从备份 JSON 文件恢复所有数据（将覆盖现有数据）</p>
            <button onClick={handleImport} disabled={importing} className="btn text-sm disabled:opacity-50" style={{ background: '#2098ff' }}>
              {importing ? '导入中...' : '选择文件导入'}
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="card text-center" style={{ padding: '2rem' }}>
            <div className="text-4xl mb-3">🧱</div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>写入默认配置</h3>
            <p className="text-sm mb-4" style={{ color: '#959595' }}>将系统设置写入前端源码，构建后所有设备样式一致</p>
            <button onClick={handleBakeConfig} disabled={baking} className="btn text-sm disabled:opacity-50" style={{ background: '#f16b4f' }}>
              {baking ? '写入中...' : '写入默认配置'}
            </button>
          </div>
        </div>

        <div className="card mt-4" style={{ padding: '1.5rem' }}>
          <p className="text-xs" style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>
            ⚠️ 导入数据会覆盖当前所有内容，包括配置、照片、日记和清单。建议先导出备份再导入。
          </p>
        </div>
      </motion.div>
    </AdminLayout>
  )
}
