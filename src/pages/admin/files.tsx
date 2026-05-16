import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { isLoggedIn } from '@/lib/auth'
import { loadData, saveData, deleteUploadedFile } from '@/lib/storage'
import type { Photo } from '@/lib/data'

function groupByDate(photos: Photo[]): Record<string, Record<string, Record<string, Photo[]>>> {
  const groups: Record<string, Record<string, Record<string, Photo[]>>> = {}
  for (const p of photos) {
    const [year, month, day] = p.date.split('-')
    if (!groups[year]) groups[year] = {}
    if (!groups[year][month]) groups[year][month] = {}
    if (!groups[year][month][day]) groups[year][month][day] = []
    groups[year][month][day].push(p)
  }
  return groups
}

export default function AdminFiles() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [batchDelete, setBatchDelete] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editText, setEditText] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    loadData<Photo[]>('photos.json').then((data) => setPhotos(data || []))
  }, [router])

  const savePhotos = (updated: Photo[]) => {
    saveData('photos.json', updated)
    setPhotos(updated)
  }

  const confirmDelete = () => {
    if (deleteId === null) return
    const photo = photos.find((p) => p.id === deleteId)
    if (photo) deleteUploadedFile(photo.url)
    const updated = photos.filter((p) => p.id !== deleteId)
    savePhotos(updated)
    setDeleteId(null)
    toast.success('已删除')
  }

  const handleDownload = (photo: Photo) => {
    const a = document.createElement('a')
    a.href = photo.url
    a.download = `${photo.text || 'photo'}_${photo.id}`
    a.click()
  }

  const startEdit = (photo: Photo) => {
    setEditingId(photo.id)
    setEditDate(photo.date)
    setEditText(photo.text)
  }

  const saveEdit = () => {
    if (editingId === null) return
    const updated = photos.map((p) =>
      p.id === editingId ? { ...p, date: editDate, text: editText } : p
    )
    savePhotos(updated)
    setEditingId(null)
    toast.success('已更新')
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(photos.map((p) => p.id)))
  }

  const deselectAll = () => {
    setSelectedIds(new Set())
  }

  const confirmBatchDelete = () => {
    const deleted = photos.filter((p) => selectedIds.has(p.id))
    deleted.forEach((p) => deleteUploadedFile(p.url))
    const updated = photos.filter((p) => !selectedIds.has(p.id))
    savePhotos(updated)
    setSelectedIds(new Set())
    setBatchDelete(false)
    toast.success(`已删除 ${selectedIds.size} 个文件`)
  }

  const groups = groupByDate(photos)
  const sortedYears = Object.keys(groups).sort((a, b) => Number(b) - Number(a))

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🗂️</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>文件管理</h1>
          <p className="text-sm mt-1" style={{ color: '#959595' }}>管理上传的照片和视频</p>
        </div>

        {photos.length === 0 ? (
          <div className="card text-center py-12">
            <p style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>还没有文件，去上传吧～</p>
          </div>
        ) : (
          <>
          <div className="card mb-4 flex items-center justify-between gap-2" style={{ padding: '0.6rem 1rem' }}>
            <div className="flex items-center gap-2">
              <button onClick={selectAll} className="text-xs px-2 py-1 rounded tag hover:bg-love-100 transition-colors">全选</button>
              <button onClick={deselectAll} className="text-xs px-2 py-1 rounded tag hover:bg-love-100 transition-colors">取消选择</button>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <span className="text-xs" style={{ color: '#959595' }}>已选 {selectedIds.size} 个</span>
              )}
              <button
                onClick={() => setBatchDelete(true)}
                disabled={selectedIds.size === 0}
                className="text-xs px-3 py-1.5 rounded disabled:opacity-40"
                style={{ background: selectedIds.size > 0 ? '#fff0f0' : '#f5f5f5', color: selectedIds.size > 0 ? '#fa5c7c' : '#ccc' }}
              >
                批量删除
              </button>
            </div>
          </div>
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{year} 年</h2>
                {Object.keys(groups[year]).sort((a, b) => Number(b) - Number(a)).map((month) => (
                  <div key={`${year}-${month}`} className="mb-4">
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#959595' }}>{Number(month)} 月</h3>
                    {Object.keys(groups[year][month]).sort((a, b) => Number(b) - Number(a)).map((day) => (
                      <div key={`${year}-${month}-${day}`} className="mb-4">
                        <p className="text-xs mb-2" style={{ color: '#d0cece' }}>{Number(day)} 日</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {groups[year][month][day].map((photo) => (
                            <motion.div
                              key={photo.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-xl overflow-hidden card relative"
                              style={{ padding: '0.75rem' }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedIds.has(photo.id)}
                                onChange={() => toggleSelect(photo.id)}
                                className="absolute top-3 left-3 w-4 h-4 z-10 accent-[#2098ff] cursor-pointer"
                              />
                              {editingId === photo.id ? (
                                <div className="space-y-2">
                                  <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="input-field text-xs" />
                                  <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="描述" className="input-field text-xs" />
                                  <div className="flex gap-1">
                                    <button onClick={saveEdit} className="btn text-xs flex-1" style={{ padding: '0.3rem 0.5rem' }}>保存</button>
                                    <button onClick={() => setEditingId(null)} className="btn-outline text-xs flex-1" style={{ padding: '0.3rem 0.5rem' }}>取消</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-love-50">
                                    {photo.type === 'image' ? (
                                      <img src={photo.url} alt={photo.text} className="w-full h-full object-cover" />
                                    ) : (
                                      <video src={photo.url} className="w-full h-full object-cover" muted />
                                    )}
                                  </div>
                                  <p className="text-xs text-center truncate mb-2" style={{ color: '#777', fontFamily: "'Noto Serif SC', serif" }}>{photo.text || '无描述'}</p>
                                  <div className="flex gap-1">
                                    <button onClick={() => handleDownload(photo)} className="flex-1 px-2 py-1 text-xs rounded tag hover:bg-love-100 transition-colors">下载</button>
                                    <button onClick={() => startEdit(photo)} className="flex-1 px-2 py-1 text-xs rounded tag hover:bg-love-100 transition-colors">编辑</button>
                                    <button onClick={() => setDeleteId(photo.id)} className="px-2 py-1 text-xs rounded" style={{ background: '#fff0f0', color: '#fa5c7c' }}>删除</button>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          </>
        )}
      </motion.div>

      <ConfirmModal
        open={deleteId !== null}
        title="删除文件"
        message="确定删除这个文件吗？"
        confirmText="删除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmModal
        open={batchDelete}
        title="批量删除"
        message={`确定删除选中的 ${selectedIds.size} 个文件吗？`}
        confirmText="删除"
        onConfirm={confirmBatchDelete}
        onCancel={() => setBatchDelete(false)}
      />
    </AdminLayout>
  )
}
