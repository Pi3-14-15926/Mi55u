/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

// GitHub Pages 静态导出模式 (EXPORT=true npm run build)
if (process.env.EXPORT === 'true') {
  const fs = require('fs')
  const hasCustomDomain = fs.existsSync('./public/CNAME') || fs.existsSync('./CNAME')
  // 自定义域名 → 根路径 (/)，否则项目页面路径 (/Mi55u)
  const bp = process.env.BASE_PATH || (hasCustomDomain ? '' : '/Mi55u')
  nextConfig.output = 'export'
  nextConfig.basePath = bp
  nextConfig.env = {
    NEXT_PUBLIC_BASE_PATH: bp,
  }
}

module.exports = nextConfig
