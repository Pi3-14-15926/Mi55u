/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

// GitHub Pages 静态导出模式 (EXPORT=true npm run build)
// 自定义域名时设置 BASE_PATH=''，项目页面默认为 /Mi55u
// 可在 GitHub Actions 变量中设置 BASE_PATH，或通过 workflow_dispatch 传入
if (process.env.EXPORT === 'true') {
  const bp = process.env.BASE_PATH ?? '/Mi55u'
  nextConfig.output = 'export'
  nextConfig.basePath = bp
  nextConfig.env = {
    NEXT_PUBLIC_BASE_PATH: bp,
  }
}

module.exports = nextConfig
