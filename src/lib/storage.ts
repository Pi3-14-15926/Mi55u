const PREFIX = 'love_'
const API_BASE = '/api/data/'

const STATIC_MAP: Record<string, string> = {
  'photos.json': '/data/photos.json',
  'diary.json': '/data/diary.json',
  'todos.json': '/data/todos.json',
  'config.json': '/data/config.json',
}

async function serverAvailable(): Promise<boolean> {
  try {
    const res = await fetch(API_BASE + 'config.json', { method: 'HEAD', signal: AbortSignal.timeout(1000) })
    return res.ok
  } catch {
    return false
  }
}

export async function loadData<T>(filename: string): Promise<T | null> {
  // Try server first
  try {
    const res = await fetch(API_BASE + filename, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      try { if (data !== null) localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
      return data as T
    }
  } catch {}

  // Fallback: localStorage
  const cached = localStorage.getItem(PREFIX + filename)
  if (cached) {
    try {
      return JSON.parse(cached) as T
    } catch {
      localStorage.removeItem(PREFIX + filename)
    }
  }

  // Fallback: static JSON files
  const staticPath = STATIC_MAP[filename]
  if (staticPath) {
    try {
      const res = await fetch(staticPath)
      if (!res.ok) return null
      const data = await res.json() as T
      try { localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
      return data
    } catch {
      return null
    }
  }

  return null
}

export function saveData<T>(filename: string, data: T): void {
  // Try localStorage (ignore quota errors)
  try {
    localStorage.setItem(PREFIX + filename, JSON.stringify(data, null, 2))
  } catch {}

  // Try server (fire-and-forget)
  fetch(API_BASE + filename, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {})
}

export async function uploadFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  const res = await fetch('/api/upload/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, data: dataUrl }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error('上传失败')
  const result = await res.json()
  if (!result.url) throw new Error('上传返回无效地址')
  return result.url
}
