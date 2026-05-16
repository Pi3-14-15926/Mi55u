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
