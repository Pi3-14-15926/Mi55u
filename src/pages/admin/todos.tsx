import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { isLoggedIn } from '@/lib/auth'
import { loadData, saveData } from '@/lib/storage'
import type { TodoItem } from '@/lib/data'

export default function AdminTodos() {
  const router = useRouter()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    loadData<TodoItem[]>('todos.json').then((data) => setTodos(data || []))
  }, [router])

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1
    const updated = [...todos, { id: newId, title: newTitle.trim(), done: false }]
    saveData('todos.json', updated)
    setTodos(updated)
    setNewTitle('')
    toast.success('已添加')
  }

  const handleToggle = (id: number) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    saveData('todos.json', updated)
    setTodos(updated)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId === null) return
    const updated = todos.filter((t) => t.id !== deleteId)
    saveData('todos.json', updated)
    setTodos(updated)
    setDeleteId(null)
    toast.success('已删除')
  }

  const startEdit = (todo: TodoItem) => { setEditingId(todo.id); setEditTitle(todo.title) }

  const handleEditSave = (id: number) => {
    if (!editTitle.trim()) return
    const updated = todos.map((t) => (t.id === id ? { ...t, title: editTitle.trim() } : t))
    saveData('todos.json', updated)
    setTodos(updated)
    setEditingId(null)
    toast.success('已更新')
  }

  const sorted = [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id
    return a.done ? 1 : -1
  })

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">✅</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>编辑清单</h1>
        </div>

        <div className="card mb-4" style={{ padding: '1.5rem' }}>
          <div className="flex gap-2">
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="添加新目标..." className="input-field flex-1" onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
            <button onClick={handleAdd} disabled={!newTitle.trim()} className="btn disabled:opacity-50">+ 添加</button>
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((todo) => (
              <motion.div key={todo.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card" style={{ padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => handleToggle(todo.id)} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{
                  background: todo.done ? '#2098ff' : 'transparent',
                  border: todo.done ? '2px solid #2098ff' : '2px solid #d0cece',
                }}>
                  {todo.done && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {editingId === todo.id ? (
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input-field flex-1 text-base" onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(todo.id); if (e.key === 'Escape') setEditingId(null) }} autoFocus />
                ) : (
                  <span className="flex-1 text-base cursor-pointer" style={{ fontFamily: "'Noto Serif SC', serif", textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#d0cece' : '#555' }} onClick={() => startEdit(todo)}>{todo.title}</span>
                )}

                <div className="flex gap-1">
                  {editingId === todo.id ? (
                    <>
                      <button onClick={() => handleEditSave(todo.id)} className="px-2 py-1 text-xs rounded tag">保存</button>
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs rounded" style={{ background: '#f0f0f0', color: '#959595' }}>取消</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(todo)} className="px-2 py-1 text-xs rounded-full tag hover:bg-love-100 transition-colors">编辑</button>
                      <button onClick={() => handleDelete(todo.id)} className="px-2 py-1 text-xs rounded-full" style={{ background: '#fff0f0', color: '#fa5c7c' }}>删除</button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {todos.length === 0 && (
            <div className="card text-center py-12"><p style={{ color: '#959595', fontFamily: "'Noto Serif SC', serif" }}>还没有清单，添加一个吧～</p></div>
          )}
        </div>
      </motion.div>

      <ConfirmModal
        open={deleteId !== null}
        title="删除清单"
        message="确定删除这个目标吗？"
        confirmText="删除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
