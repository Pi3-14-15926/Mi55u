const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '..', 'server-data')
const dstDir = path.join(__dirname, '..', 'public', 'data')

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true })
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'))
for (const file of files) {
  const src = path.join(srcDir, file)
  const dst = path.join(dstDir, file)
  fs.copyFileSync(src, dst)
  console.log(`  ✔ 同步数据: ${file}`)
}

// 写入仓库信息（供客户端无 token 时通过 raw.githubusercontent.com 获取最新数据）
const repo = process.env.GITHUB_REPOSITORY || 'Pi3-14-15926/Mi55u'
const repoFile = path.join(__dirname, '..', 'src', 'lib', 'repo.ts')
fs.writeFileSync(repoFile, `// 由 sync-data.js 自动生成，构建时注入仓库信息
export const GITHUB_REPO = '${repo}'
`)
if (repo) console.log(`  ✔ 写入仓库信息: ${repo}`)
