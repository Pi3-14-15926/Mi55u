import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  try {
    const { url } = req.body
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'missing url' })

    if (!url.startsWith('/uploads/')) return res.status(400).json({ error: 'not a local file' })

    const filename = path.basename(url)
    const filePath = path.join(UPLOAD_DIR, filename)

    if (filePath.startsWith(UPLOAD_DIR) && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return res.status(200).json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return res.status(500).json({ error: msg })
  }
}
