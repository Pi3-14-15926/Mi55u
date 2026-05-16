const KEY_TOKEN = 'github_token'
const KEY_OWNER = 'github_owner'
const KEY_REPO = 'github_repo'
const KEY_BRANCH = 'github_branch'

export interface GitHubConfig {
  token: string
  owner: string
  repo: string
  branch: string
}

export function getGitHubConfig(): GitHubConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const token = localStorage.getItem(KEY_TOKEN)
    const owner = localStorage.getItem(KEY_OWNER)
    const repo = localStorage.getItem(KEY_REPO)
    const branch = localStorage.getItem(KEY_BRANCH) || 'main'
    if (token && owner && repo) return { token, owner, repo, branch }
  } catch {}
  return null
}

export function saveGitHubConfig(c: GitHubConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_TOKEN, c.token)
  localStorage.setItem(KEY_OWNER, c.owner)
  localStorage.setItem(KEY_REPO, c.repo)
  localStorage.setItem(KEY_BRANCH, c.branch)
}

export function clearGitHubConfig(): void {
  if (typeof window === 'undefined') return
  ;[KEY_TOKEN, KEY_OWNER, KEY_REPO, KEY_BRANCH].forEach(k => localStorage.removeItem(k))
}

export function isGitHubMode(): boolean {
  return getGitHubConfig() !== null
}

export function getRawUrl(path: string): string {
  const c = getGitHubConfig()
  if (!c) throw new Error('GitHub 未配置')
  return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.branch}/${path}`
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function base64ToUtf8(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ''))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function api(path: string, opts?: RequestInit): Promise<any> {
  const c = getGitHubConfig()
  if (!c) throw new Error('GitHub 未配置')
  const url = `https://api.github.com/repos/${c.owner}/${c.repo}/${path}`
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...opts?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API 错误: ${res.status}`)
  }
  return res.json()
}

export async function readFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const d = await api(`contents/${encodeURIComponent(path)}`)
    return { content: base64ToUtf8(d.content), sha: d.sha }
  } catch {
    return null
  }
}

export async function writeFile(path: string, content: string, msg?: string): Promise<void> {
  const c = getGitHubConfig()
  const existing = await readFile(path)
  const body: Record<string, unknown> = {
    message: msg || `更新 ${path}`,
    content: utf8ToBase64(content),
    branch: c!.branch,
  }
  if (existing) body.sha = existing.sha
  await api(`contents/${encodeURIComponent(path)}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteFile_(path: string, msg?: string): Promise<void> {
  const existing = await readFile(path)
  if (!existing) return
  const c = getGitHubConfig()
  await api(`contents/${encodeURIComponent(path)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message: msg || `删除 ${path}`, sha: existing.sha, branch: c!.branch }),
  })
}

export async function uploadFileAsBase64(filename: string, dataUrl: string): Promise<string> {
  const marker = ';base64,'
  const idx = dataUrl.indexOf(marker)
  if (idx === -1) throw new Error('无效的 data URL')
  const b64 = dataUrl.slice(idx + marker.length)
  const safe = Date.now() + '-' + filename.replace(/[^a-zA-Z0-9\u4e00-\u9fff._-]/g, '_')
  const repoPath = `public/uploads/${safe}`
  const c = getGitHubConfig()
  const existing = await readFile(repoPath)
  const body: Record<string, unknown> = {
    message: `上传 ${safe}`,
    content: b64.replace(/\n/g, ''),
    branch: c!.branch,
  }
  if (existing) body.sha = existing.sha
  await api(`contents/${encodeURIComponent(repoPath)}`, { method: 'PUT', body: JSON.stringify(body) })
  return getRawUrl(repoPath)
}
