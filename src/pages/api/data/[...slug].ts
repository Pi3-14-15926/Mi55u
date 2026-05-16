import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
  },
}

const DATA_DIR = path.join(process.cwd(), 'server-data')
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'data')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  const filename = Array.isArray(slug) ? slug.join('/') : slug
  if (!filename) return res.status(400).json({ error: 'missing filename' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const safePath = path.join(DATA_DIR, filename)
  if (!safePath.startsWith(DATA_DIR)) return res.status(403).json({ error: 'invalid path' })

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(safePath)) {
        const data = fs.readFileSync(safePath, 'utf8')
        return res.status(200).json(JSON.parse(data))
      }
      const publicPath = path.join(PUBLIC_DIR, filename)
      if (fs.existsSync(publicPath)) {
        const data = fs.readFileSync(publicPath, 'utf8')
        const parsed = JSON.parse(data)
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(safePath, JSON.stringify(parsed, null, 2), 'utf8')
        return res.status(200).json(parsed)
      }
      return res.status(200).json(null)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      return res.status(500).json({ error: msg })
    }
  }

  if (req.method === 'POST') {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      fs.writeFileSync(safePath, body, 'utf8')
      return res.status(200).json({ success: true })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      return res.status(500).json({ error: msg })
    }
  }

  return res.status(405).json({ error: 'method not allowed' })
}
