import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { asset } from '@/lib/paths'
import MainLayout from '@/layouts/MainLayout'
import { DiaryEntry, fetchData, formatDate } from '@/lib/data'

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData<DiaryEntry[]>('/data/diary.json').then((data) => {
      setEntries(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-love-400 text-lg animate-pulse" style={{ fontFamily: "'Noto Serif SC', serif" }}>加载中...</div>
        </div>
      </MainLayout>
    )
  }

  const sorted = [...entries].sort((a, b) => b.id - a.id)

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 pt-8 page-section">
        <div className="text-center mb-10">
          <h1 className="section-title mb-2">
            <img src={asset('/icons/diandi.svg')} alt="" className="inline-block w-8 h-8 md:w-10 md:h-10 align-middle" /> 点点滴滴
          </h1>
          <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>写下我们的日常</p>
        </div>

        {sorted.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>还没有日记，去后台写一篇吧～</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #d0cece, transparent)' }} />

            {sorted.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-14 md:pl-16 pb-8"
              >
                <div className="absolute left-3 md:left-4 top-2 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: '#2098ff' }} />

                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>
                      {entry.title}
                    </h2>
                    <span className="text-xs text-love-400">{formatDate(entry.date)}</span>
                  </div>
                  <div className="leading-relaxed text-love-500" style={{ fontSize: '0.95rem' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {entry.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
