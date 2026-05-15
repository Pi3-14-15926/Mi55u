import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import { Photo, fetchData, formatDate } from '@/lib/data'

export default function AlbumPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selected, setSelected] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData<Photo[]>('/data/photos.json').then((data) => {
      setPhotos(data || [])
      setLoading(false)
    })
  }, [])

  const grouped = photos.reduce<Record<string, Photo[]>>((acc, photo) => {
    if (!acc[photo.date]) acc[photo.date] = []
    acc[photo.date].push(photo)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

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
      <div className="max-w-5xl mx-auto px-4 pt-8 page-section">
        <div className="text-center mb-10">
          <h1 className="section-title mb-2">
            <img src="/icons/jinqi.svg" alt="" className="inline-block w-8 h-8 md:w-10 md:h-10 align-middle" /> 时光记忆
          </h1>
          <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>我们的美好瞬间</p>
        </div>

        {photos.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>还没有照片，去后台添加吧～</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '1.3rem', color: '#333' }}>
                <span>📅</span> {formatDate(date)}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grouped[date].map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="img_card overflow-hidden"
                    onClick={() => setSelected(photo)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden">
                      {photo.type === 'image' ? (
                        <img src={photo.url} alt={photo.text} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-love-100 flex items-center justify-center relative">
                          <video src={photo.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                              <span className="text-love-500 text-xl ml-0.5">▶</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-love-400 mt-2 text-center line-clamp-1">{photo.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card p-2">
                {selected.type === 'image' ? (
                  <img src={selected.url} alt={selected.text} className="w-full rounded-xl" />
                ) : (
                  <video src={selected.url} className="w-full rounded-xl" controls autoPlay />
                )}
                <div className="p-4">
                  <p className="font-bold" style={{ color: '#333', fontFamily: "'Noto Serif SC', serif" }}>{selected.text}</p>
                  <p className="text-xs text-love-400 mt-1">{formatDate(selected.date)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  )
}
