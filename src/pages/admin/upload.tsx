import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn } from '@/lib/auth'
import { loadData, saveData, uploadFile } from '@/lib/storage'
import type { Photo } from '@/lib/data'

interface UploadFile {
  file: File
  preview: string
  date: string
  text: string
  progress: 'pending' | 'uploading' | 'done' | 'error'
  url?: string
}

export default function AdminUpload() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [defaultDate, setDefaultDate] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    setDefaultDate(new Date().toISOString().split('T')[0])
  }, [router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const newFiles: UploadFile[] = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      date: defaultDate,
      text: '',
      progress: 'pending',
    }))
    setFiles((prev) => [...prev, ...newFiles])
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const updateFile = (index: number, data: Partial<UploadFile>) => {
    setFiles((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...data }
      return updated
    })
  }

  const handleUploadAll = useCallback(async () => {
    const toUpload = files.filter((f) => f.progress === 'pending')
    if (toUpload.length === 0) { toast('没有待上传的文件'); return }

    setUploading(true)
    try {
      const existing = await loadData<Photo[]>('photos.json')
      const photos = existing || []

      const uploaded: Photo[] = []
      let nextId = photos.length > 0 ? Math.max(...photos.map((p) => p.id)) + 1 : 1

      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        if (f.progress !== 'pending') continue

        updateFile(i, { progress: 'uploading' })

        try {
          const url = await uploadFile(f.file)
          updateFile(i, { progress: 'done', url })

          uploaded.push({
            id: nextId++,
            date: f.date,
            type: f.file.type.startsWith('image') ? 'image' : 'video',
            url,
            text: f.text || '',
          })
        } catch {
          updateFile(i, { progress: 'error' })
        }
      }

      if (uploaded.length > 0) {
        try {
          saveData('photos.json', [...photos, ...uploaded])
        } catch (e) {
          console.warn('saveData failed (localStorage may be full), server data was saved:', e)
        }
        toast.success(`成功添加 ${uploaded.length} 个文件`)
      }
    } finally {
      setUploading(false)
    }
  }, [files])

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">📤</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>上传文件</h1>
          <p className="text-sm mt-1" style={{ color: '#959595' }}>添加图片和视频到相册</p>
        </div>

        <div className="card mb-4">
          <div className="flex items-center gap-3 mb-4">
            <input type="date" value={defaultDate} onChange={(e) => { setDefaultDate(e.target.value); setFiles((prev) => prev.map((f) => ({ ...f, date: e.target.value }))) }} className="input-field text-sm flex-1" />
          </div>
          <label className="btn inline-flex items-center gap-2 cursor-pointer">
            <span>选择文件</span>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
          </label>
          <p className="text-xs mt-2" style={{ color: '#959595' }}>支持图片和视频格式</p>
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {files.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative group rounded-xl overflow-hidden">
                    {f.file.type.startsWith('image') ? (
                      <img src={f.preview} alt="" className="w-full aspect-square object-cover" />
                    ) : (
                      <video src={f.preview} className="w-full aspect-square object-cover" muted />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <input type="text" value={f.text} onChange={(e) => updateFile(i, { text: e.target.value })} placeholder="添加描述..." className="text-xs px-2 py-1 rounded bg-white/80 text-gray-700 w-full mb-1" onClick={(e) => e.stopPropagation()} />
                      <input type="date" value={f.date} onChange={(e) => updateFile(i, { date: e.target.value })} className="text-xs px-2 py-1 rounded bg-white/80 text-gray-700 w-full mb-1" onClick={(e) => e.stopPropagation()} />
                    </div>
                    <button onClick={() => removeFile(i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">✕</button>
                    {f.progress === 'uploading' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
                    {f.progress === 'done' && <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-400 text-white text-xs flex items-center justify-center">✓</div>}
                    {f.progress === 'error' && <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center">!</div>}
                  </motion.div>
                ))}
              </div>
              <button onClick={handleUploadAll} disabled={uploading || files.every((f) => f.progress === 'done')} className="btn w-full mt-4 disabled:opacity-50">
                {uploading ? '处理中...' : `添加到相册 (${files.filter((f) => f.progress === 'pending').length} 个)`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  )
}
