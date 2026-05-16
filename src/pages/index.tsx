import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import WaveDivider from '@/components/WaveDivider'
import { Config, Photo, getTimeSince, fetchData, formatDate } from '@/lib/data'
import { defaultConfig } from '@/lib/defaultConfig'
import { asset } from '@/lib/paths'
import { toCdnUrl } from '@/lib/cdn'

export default function HomePage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [meetTime, setMeetTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [loveDays, setLoveDays] = useState(0)

  useEffect(() => {
    fetchData<Config>('/data/config.json').then(setConfig)
    fetchData<Photo[]>('/data/photos.json').then((data) => setPhotos(data || []))
  }, [])

  useEffect(() => {
    const activeConfig = config || (defaultConfig as Config)
    if (!activeConfig.meetDate) return
    const update = () => {
      setMeetTime(getTimeSince(activeConfig.meetDate))
      setLoveDays(getTimeSince(activeConfig.loveDate).days)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [config])

  const cfg = config || defaultConfig

  const showMeet = cfg.showMeetCount !== false
  const showLove = cfg.showLoveCount !== false
  const recentPhotos = photos.slice(-8).reverse()
  const desc = cfg.siteDescription || '记录我们的故事'

  const isCssValue = (v: string) =>
    v.startsWith('linear-gradient') || v.startsWith('radial-gradient') ||
    v.startsWith('#') || v.startsWith('rgb') || v.startsWith('url(')
  const heroBg = !cfg.homepageBg
    ? 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)'
    : isCssValue(cfg.homepageBg)
      ? cfg.homepageBg
      : `url(${cfg.homepageBg}) center/cover no-repeat`

  return (
    <MainLayout>
      <section className="relative overflow-hidden" style={{ minHeight: '70vh', background: heroBg }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-12">
          <div className="glass rounded-2xl px-8 md:px-12 py-6 md:py-8 flex items-center justify-center gap-6 md:gap-12" style={{ border: '1px solid rgba(208,206,206,0.3)' }}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-card flex items-center justify-center overflow-hidden" style={{ border: '3px solid rgba(208,206,206,0.3)' }}>
                {cfg.avatarUrlMale ? (
                  <img src={toCdnUrl(cfg.avatarUrlMale)} alt={cfg.maleName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-5xl">👨</span>
                )}
              </div>
              <span className="font-bold text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{cfg.maleName}</span>
            </div>
            <motion.div
              animate={{ scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl md:text-5xl"
            >
              <svg viewBox="0 0 32 29.6" style={{ width: '3rem', height: '3rem', fill: '#f16b4f' }}>
                <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
              </svg>
            </motion.div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-card flex items-center justify-center overflow-hidden" style={{ border: '3px solid rgba(208,206,206,0.3)' }}>
                {cfg.avatarUrlFemale ? (
                  <img src={toCdnUrl(cfg.avatarUrlFemale)} alt={cfg.femaleName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-5xl">👩</span>
                )}
              </div>
              <span className="font-bold text-xl md:text-2xl" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{cfg.femaleName}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="card page-section text-center" style={{ animationDelay: '0.1s' }}>
          <p className="mb-5" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '1.5rem', color: '#000' }}>
            {desc}
          </p>
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold gradient-text">{meetTime.days}</div>
              <div className="text-xs text-love-400 mt-1">天</div>
            </div>
            <div className="text-3xl md:text-5xl text-love-300" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>/</div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold gradient-text">{meetTime.hours}</div>
              <div className="text-xs text-love-400 mt-1">时</div>
            </div>
            <div className="text-3xl md:text-5xl text-love-300" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>/</div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold gradient-text">{meetTime.minutes}</div>
              <div className="text-xs text-love-400 mt-1">分</div>
            </div>
            <div className="text-3xl md:text-5xl text-love-300" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 }}>/</div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold gradient-text">{meetTime.seconds}</div>
              <div className="text-xs text-love-400 mt-1">秒</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-love-400" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {showMeet && <span>认识 {meetTime.days} 天</span>}
            {showMeet && showLove && <span style={{ color: '#d0cece' }}>|</span>}
            {showLove && <span>相恋 {loveDays} 天</span>}
          </div>
        </div>

        <Link href="/album" className="card no-underline block page-section" style={{ animationDelay: '0.2s', padding: '1.2rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <img src={asset('/icons/jinqi.svg')} alt="" className="w-8 h-8 md:w-10 md:h-10" />
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>时光记忆</h3>
          </div>
          {recentPhotos.length === 0 ? (
            <p className="text-love-400 text-center py-6" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              还没有照片，快去上传吧～
            </p>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {recentPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg overflow-hidden"
                  style={{ padding: '0.4rem', background: '#fafafa', border: '1px solid rgba(208,206,206,0.4)' }}
                >
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img
                      src={toCdnUrl(photo.url)}
                      alt={photo.text}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Link>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Link href="/diary" className="card no-underline block page-section" style={{ animationDelay: '0.4s' }}>
            <img src={asset('/icons/diandi.svg')} alt="" className="w-10 h-10 md:w-12 md:h-12 mb-3" />
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>点点滴滴</h3>
            <p className="text-love-400 text-sm mt-2">记录我们的日常</p>
          </Link>

          <Link href="/todo" className="card no-underline block page-section" style={{ animationDelay: '0.5s' }}>
            <img src={asset('/icons/qingdan.svg')} alt="" className="w-10 h-10 md:w-12 md:h-12 mb-3" />
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>记录清单</h3>
            <p className="text-love-400 text-sm mt-2">一起完成的小目标</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
