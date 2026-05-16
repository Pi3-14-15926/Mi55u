import { asset } from './paths'
import { GITHUB_REPO } from './repo'

const _cb = () => '?t=' + Date.now()

export interface Config {
  maleName: string
  femaleName: string
  meetDate: string
  loveDate: string
  avatarUrlMale?: string
  avatarUrlFemale?: string
  siteTitle?: string
  siteName?: string
  siteDescription?: string
  footerText?: string
  showMeetCount?: boolean
  showLoveCount?: boolean
  homepageBg?: string
  siteIcon?: string
  copyrightText?: string
}

export interface Photo {
  id: number
  date: string
  type: 'image' | 'video'
  url: string
  text: string
}

export interface DiaryEntry {
  id: number
  date: string
  title: string
  content: string
}

export interface TodoItem {
  id: number
  title: string
  done: boolean
}

export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = date2 ? new Date(date2) : new Date()
  const diff = d2.getTime() - d1.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getTimeSince(date: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const start = new Date(date)
  const now = new Date()
  const diff = now.getTime() - start.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

export async function fetchData<T>(path: string): Promise<T | null> {
  const filename = path.replace('/data/', '')

  // Try server API first
  try {
    const res = await fetch('/api/data/' + filename + _cb(), { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      try { if (data !== null) localStorage.setItem('love_' + filename, JSON.stringify(data)) } catch {}
      return data as T
    }
  } catch {}

  // Fallback: localStorage
  const cached = localStorage.getItem('love_' + filename)
  if (cached) {
    try {
      return JSON.parse(cached) as T
    } catch {
      localStorage.removeItem('love_' + filename)
    }
  }

  // Fallback: public GitHub raw URL
  if (GITHUB_REPO) {
    try {
      const [owner, repoName] = GITHUB_REPO.split('/')
      const url = `https://raw.githubusercontent.com/${owner}/${repoName}/main/server-data/${filename}${_cb()}`
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        const data = await res.json() as T
        try { localStorage.setItem('love_' + filename, JSON.stringify(data)) } catch {}
        return data
      }
    } catch {}
  }

  // Fallback: static file
  try {
    const res = await fetch(asset(path) + _cb())
    if (!res.ok) return null
    const data = await res.json() as T
    try { localStorage.setItem('love_' + filename, JSON.stringify(data)) } catch {}
    return data
  } catch {
    return null
  }
}
