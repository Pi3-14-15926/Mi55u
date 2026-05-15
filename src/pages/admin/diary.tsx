import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { isLoggedIn } from '@/lib/auth'
import { loadData, saveData } from '@/lib/storage'
import type { DiaryEntry } from '@/lib/data'

export default function AdminDiary() {
  const router = useRouter()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editing, setEditing] = useState<DiaryEntry | null>(null)
  const [title, setTitle] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    loadData<DiaryEntry[]>('diary.json').then((data) => setEntries(data || []))
  }, [router])

  const resetEditor = () => {
    setEditing(null); setTitle(''); setContent('')
    setDate(new Date().toISOString().split('T')[0]); setPreview(false); setShowEditor(false)
  }

  const openNew = () => { resetEditor(); setShowEditor(true) }

  const openEdit = (entry: DiaryEntry) => {
    setEditing(entry); setTitle(entry.title); setContent(entry.content)
    setDate(entry.date); setPreview(false); setShowEditor(true)
  }

  const handleSave = async () => {
    if (!title.trim()) { toast.error('请输入标题'); return }
    if (!content.trim()) { toast.error('请输入内容'); return }
    setSaving(true)
    try {
      let updated: DiaryEntry[]
      if (editing) {
        updated = entries.map((e) => e.id === editing.id ? { ...e, title: title.trim(), content: content.trim(), date } : e)
      } else {
        const newId = entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1
        updated = [...entries, { id: newId, date, title: title.trim(), content: content.trim() }]
      }
      saveData('diary.json', updated)
      setEntries(updated)
      toast.success(editing ? '日记已更新' : '日记已添加')
      resetEditor()
    } catch { toast.error('保存失败') }
    finally { setSaving(false) }
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId === null) return
    const updated = entries.filter((e) => e.id !== deleteId)
    saveData('diary.json', updated)
    setEntries(updated)
    setDeleteId(null)
    toast.success('已删除')
  }

  const sorted = [...entries].sort((a, b) => b.id - a.id)

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl mb-1">📝</div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>编辑日记</h1>
          </div>
          <button onClick={openNew} className="btn text-sm">+ 写日记</button>
        </div>

        <AnimatePresence>
          {showEditor && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card mb-6 overflow-hidden">
              <h2 className="font-bold mb-4" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{editing ? '编辑日记' : '写日记'}</h2>
              <div className="space-y-3">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" className="input-field" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setPreview(false)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!preview ? 'tag' : 'text-love-400'}`}>编辑</button>
                  <button onClick={() => setPreview(true)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${preview ? 'tag' : 'text-love-400'}`}>预览</button>
                </div>
                {preview ? (
                  <div className="min-h-[200px] p-4 bg-love-50 rounded-xl prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="支持 Markdown 格式 ✨" className="input-field min-h-[200px] resize-y" />
                )}
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn text-sm disabled:opacity-50">{saving ? '保存中...' : '保存'}</button>
                  <button onClick={resetEditor} className="btn-outline text-sm">取消</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sorted.length === 0 ? (
          <div className="card text-center py-12"><p style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>还没有日记，写一篇吧～</p></div>
        ) : (
          <div className="space-y-3">
            {sorted.map((entry) => (
              <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '1.2rem 1.5rem' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: '#333', fontFamily: "'Noto Serif SC', serif" }}>{entry.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#959595' }}>{entry.date}</p>
                    <p className="text-sm mt-2 line-clamp-2" style={{ color: '#777' }}>{entry.content.replace(/[#*`]/g, '').slice(0, 100)}</p>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <button onClick={() => openEdit(entry)} className="px-3 py-1 text-xs rounded-full tag hover:bg-love-100 transition-colors">编辑</button>
                    <button onClick={() => handleDelete(entry.id)} className="px-3 py-1 text-xs rounded-full" style={{ background: '#fff0f0', color: '#fa5c7c' }}>删除</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <ConfirmModal
        open={deleteId !== null}
        title="删除日记"
        message="确定删除这篇日记吗？"
        confirmText="删除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
