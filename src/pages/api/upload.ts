import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
  },
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  try {
    const { filename, data } = req.body
    if (!filename || !data) return res.status(400).json({ error: 'missing filename or data' })

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

    const ext = path.extname(filename)
    const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, '_')
    const ts = Date.now()
    const safeName = `${ts}-${base}${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)

    const match = data.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) return res.status(400).json({ error: 'invalid data URL' })

    const buffer = Buffer.from(match[2], 'base64')
    fs.writeFileSync(filePath, buffer)

    const url = `/uploads/${safeName}`
    return res.status(200).json({ success: true, url })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return res.status(500).json({ error: msg })
  }
}
