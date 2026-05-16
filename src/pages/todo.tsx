import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { asset } from '@/lib/paths'
import MainLayout from '@/layouts/MainLayout'
import { TodoItem, fetchData } from '@/lib/data'

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData<TodoItem[]>('/data/todos.json').then((data) => {
      setTodos(data || [])
      setLoading(false)
    })
  }, [])

  const doneCount = todos.filter((t) => t.done).length
  const progress = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-love-400 text-lg animate-pulse" style={{ fontFamily: "'Noto Serif SC', serif" }}>加载中...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 pt-8 page-section">
        <div className="text-center mb-8">
          <h1 className="section-title mb-2">
            <img src={asset('/icons/qingdan.svg')} alt="" className="inline-block w-8 h-8 md:w-10 md:h-10 align-middle" /> 记录清单
          </h1>
          <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>一起完成的小目标</p>
        </div>

        {todos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333', fontWeight: 700 }}>
                进度 {doneCount}/{todos.length}
              </span>
              <span className="text-sm font-bold gradient-text">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #2098ff, #10bbff)' }}
              />
            </div>
          </motion.div>
        )}

        {todos.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>还没有清单，去后台添加吧～</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {[...todos]
                .sort((a, b) => {
                  if (a.done === b.done) return a.id - b.id
                  return a.done ? 1 : -1
                })
                .map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="card flex items-center gap-3"
                    style={{ padding: '1.2rem 1.5rem' }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: todo.done ? '#4caf50' : 'transparent',
                        border: todo.done ? '2px solid #4caf50' : '2px solid #d0cece',
                      }}
                    >
                      {todo.done && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </div>
                    <span
                      className="flex-1 text-base md:text-lg"
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        textDecoration: 'none',
                        color: todo.done ? '#000' : '#d0cece',
                      }}
                    >
                      {todo.title}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
