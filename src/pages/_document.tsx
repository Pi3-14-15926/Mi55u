import { Html, Head, Main, NextScript } from 'next/document'
import { defaultConfig } from '@/lib/defaultConfig'

const siteTitle = defaultConfig.siteTitle || 'LoveSpace'
const siteDesc = defaultConfig.siteDescription || 'LoveSpace - 记录我们的故事'
const siteIcon = defaultConfig.siteIcon || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>"

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <link rel="icon" href={siteIcon} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
