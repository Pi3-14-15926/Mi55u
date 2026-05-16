import { isGitHubMode, readFile, writeFile, uploadFileAsBase64, deleteFile_, getRawUrl } from './github'
import { asset } from './paths'
import { GITHUB_REPO } from './repo'

const _cb = () => '?t=' + Date.now()

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
  // 1. Try local API (dev/production server mode)
  try {
    const res = await fetch(API_BASE + filename + _cb(), { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      try { if (data !== null) localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
      return data as T
    }
  } catch {}

  // 2. GitHub API mode
  if (isGitHubMode()) {
    try {
      const result = await readFile('server-data/' + filename)
      if (result) {
        const data = JSON.parse(result.content) as T
        try { localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
        return data
      }
    } catch {}
  }

  // 3. Public GitHub raw URL（无需 token，对所有访客生效）
  if (GITHUB_REPO) {
    try {
      const [owner, repoName] = GITHUB_REPO.split('/')
      const url = `https://raw.githubusercontent.com/${owner}/${repoName}/main/server-data/${filename}${_cb()}`
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        const data = await res.json() as T
        try { localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
        return data
      }
    } catch {}
  }

  // 4. Fallback: static JSON files（带缓存破坏）
  const staticPath = STATIC_MAP[filename]
  if (staticPath) {
    try {
      const res = await fetch(asset(staticPath) + _cb())
      if (!res.ok) return null
      const data = await res.json() as T
      try { localStorage.setItem(PREFIX + filename, JSON.stringify(data)) } catch {}
      return data
    } catch {}
  }

  // 5. Fallback: localStorage（最后手段，避免旧缓存挡住网络请求）
  const cached = localStorage.getItem(PREFIX + filename)
  if (cached) {
    try {
      return JSON.parse(cached) as T
    } catch {
      localStorage.removeItem(PREFIX + filename)
    }
  }

  return null
}

export async function saveData<T>(filename: string, data: T): Promise<void> {
  try {
    localStorage.setItem(PREFIX + filename, JSON.stringify(data, null, 2))
  } catch {}

  const json = JSON.stringify(data)

  if (isGitHubMode()) {
    try {
      await writeFile('server-data/' + filename, json, `更新 ${filename}`)
    } catch (e) {
      console.warn('GitHub 保存失败:', e)
    }
  } else {
    fetch(API_BASE + filename, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    }).catch(() => {})
  }
}

export async function uploadFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  if (isGitHubMode()) {
    return uploadFileAsBase64(file.name, dataUrl)
  }

  const res = await fetch(asset('/api/upload/'), {
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

export async function deleteUploadedFile(url: string): Promise<void> {
  if (isGitHubMode()) {
    const rawBase = getRawUrl('')
    const repoPath = url.startsWith(rawBase) ? url.slice(rawBase.length) : url.replace(/^https?:\/\/[^/]+/, '')
    try {
      await deleteFile_(repoPath, `删除文件 ${repoPath.split('/').pop()}`)
    } catch (e) {
      console.warn('GitHub 删除失败:', e)
    }
    return
  }

  if (url.startsWith('/uploads/')) {
    fetch(asset('/api/delete-file/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    }).catch(() => {})
  }
}
