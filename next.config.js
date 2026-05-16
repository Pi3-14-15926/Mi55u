/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

// GitHub Pages 静态导出模式 (EXPORT=true npm run build)
if (process.env.EXPORT === 'true') {
  nextConfig.output = 'export'
  nextConfig.basePath = '/Mi55u'
  nextConfig.env = {
    NEXT_PUBLIC_BASE_PATH: '/Mi55u',
  }
}

module.exports = nextConfig
