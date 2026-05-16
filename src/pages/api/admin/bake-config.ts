import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'server-data')
const TARGET_FILE = path.join(process.cwd(), 'src', 'lib', 'defaultConfig.ts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  try {
    const configPath = path.join(DATA_DIR, 'config.json')
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: 'config.json not found in server-data, 请先在系统设置中保存配置' })
    }

    const raw = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(raw)

    const quote = (v: unknown): string => {
      if (typeof v === 'string') {
        return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"
      }
      return String(v)
    }

    const fields = [
      'maleName', 'femaleName', 'meetDate', 'loveDate',
      'avatarUrlMale', 'avatarUrlFemale',
      'siteTitle', 'siteName', 'siteDescription', 'footerText',
      'showMeetCount', 'showLoveCount', 'homepageBg', 'siteIcon', 'copyrightText',
    ]

    const entries = fields.map(f => {
      const val = (config as Record<string, unknown>)[f]
      if (val === undefined || val === null) return ''
      return `  ${f}: ${quote(val)},`
    }).filter(Boolean).join('\n')

    const ts = `// 此文件由管理后台"写入默认配置"功能自动生成，请勿手动修改
// 执行 npm run build 后，这些配置将编译到静态页面中，确保所有设备样式一致
import type { Config } from './data'

export const defaultConfig: Partial<Config> = {
${entries}
}
`

    fs.writeFileSync(TARGET_FILE, ts, 'utf8')
    return res.status(200).json({ success: true, message: '配置已写入 src/lib/defaultConfig.ts，重新构建后生效' })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return res.status(500).json({ error: msg })
  }
}
