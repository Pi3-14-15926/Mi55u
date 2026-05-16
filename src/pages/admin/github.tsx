import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { isLoggedIn } from '@/lib/auth'
import { getGitHubConfig, saveGitHubConfig, clearGitHubConfig, isGitHubMode } from '@/lib/github'

export default function AdminGitHub() {
  const router = useRouter()
  const [ghToken, setGhToken] = useState('')
  const [ghOwner, setGhOwner] = useState('')
  const [ghRepo, setGhRepo] = useState('')
  const [testResult, setTestResult] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/admin'); return }
    const gh = getGitHubConfig()
    if (gh) {
      setGhToken(gh.token)
      setGhOwner(gh.owner)
      setGhRepo(gh.repo)
      setActive(true)
    }
  }, [router])

  const saveConfig = () => {
    if (!ghToken || !ghOwner || !ghRepo) {
      toast.error('请填写完整的 GitHub 配置')
      return
    }
    saveGitHubConfig({ token: ghToken, owner: ghOwner, repo: ghRepo, branch: 'main' })
    setActive(true)
    toast.success('GitHub 配置已保存')
    setTestResult('')
  }

  const clearConfig = () => {
    clearGitHubConfig()
    setGhToken('')
    setGhOwner('')
    setGhRepo('')
    setActive(false)
    setTestResult('')
    toast.success('GitHub 配置已清除（将使用本地 API 模式）')
  }

  const testConnection = async () => {
    setTestResult('')
    if (!ghToken || !ghOwner || !ghRepo) {
      toast.error('请先填写 GitHub 配置')
      return
    }
    saveGitHubConfig({ token: ghToken, owner: ghOwner, repo: ghRepo, branch: 'main' })
    try {
      const { readFile } = await import('@/lib/github')
      const result = await readFile('README.md')
      if (result) {
        setTestResult('✅ 连接成功！已读取到 README.md')
        toast.success('GitHub API 连接正常')
      } else {
        setTestResult('⚠️ 连接成功，但未找到 README.md（这不影响使用）')
        toast.success('GitHub API 连接正常')
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '未知错误'
      setTestResult('❌ 连接失败：' + msg)
      toast.error('连接失败')
    }
  }

  return (
    <AdminLayout>
      <div className="page-section">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🔑</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>GitHub 仓库直写</h1>
          <p className="text-sm mt-1" style={{ color: '#959595' }}>
            配置后部署到 GitHub Pages 时，上传文件、保存日记和清单会通过 GitHub API 直接写入仓库
          </p>
        </div>

        {active && (
          <div className="text-center mb-4">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              ✅ 已启用
            </span>
          </div>
        )}

        <div className="card space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#959595' }}>Personal Access Token</label>
            <input type="password" value={ghToken} onChange={(e) => setGhToken(e.target.value)} placeholder="github_pat_xxxxxxxxxxxxxxxxx" className="input-field font-mono text-xs" />
            <p className="text-xs mt-1" style={{ color: '#959595' }}>
              需要 <code className="bg-gray-100 px-1 rounded">contents</code> 权限，在{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">GitHub Token 设置</a> 创建
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>仓库所有者</label>
              <input type="text" value={ghOwner} onChange={(e) => setGhOwner(e.target.value)} placeholder="username" className="input-field text-sm" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#959595' }}>仓库名称</label>
              <input type="text" value={ghRepo} onChange={(e) => setGhRepo(e.target.value)} placeholder="repo-name" className="input-field text-sm" />
            </div>
          </div>

          {testResult && (
            <div className="text-sm p-3 rounded" style={{
              background: testResult.startsWith('✅') || testResult.startsWith('⚠️') ? '#f0fdf4' : '#fef2f2',
              color: testResult.startsWith('✅') || testResult.startsWith('⚠️') ? '#16a34a' : '#dc2626',
            }}>
              {testResult}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={saveConfig} className="btn text-sm">保存配置</button>
            <button onClick={testConnection} className="btn-outline text-sm">测试连接</button>
            <button onClick={clearConfig} className="btn-outline text-sm" style={{ color: '#fa5c7c' }}>清除配置</button>
            <Link href="/admin/dashboard" className="btn-outline text-sm ml-auto">返回</Link>
          </div>
        </div>

        <div className="card mt-4" style={{ padding: '1.5rem' }}>
          <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>💡 工作原理</h3>
          <div className="text-xs space-y-2" style={{ color: '#959595', lineHeight: '1.6' }}>
            <p>1. 配置好 Token 后，你的所有操作（上传、编辑、删除）会通过 GitHub API 直接提交到仓库的 <code className="bg-gray-100 px-1 rounded">main</code> 分支</p>
            <p>2. 每次提交会自动触发 GitHub Actions 重新构建网站</p>
            <p>3. 约 1-2 分钟后，所有设备刷新即可看到最新内容</p>
            <p>4. 本地开发时不启用此功能（自动使用本地 API），互不干扰</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
