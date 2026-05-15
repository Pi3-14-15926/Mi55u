const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'server-data');
const OUT_DIR = path.join(ROOT, 'out');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  function json(data, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  // API: GET /api/data/:filename — load data
  if (method === 'GET' && url.startsWith('/api/data/')) {
    const filename = url.slice('/api/data/'.length);
    if (!filename) return json({ error: 'missing filename' }, 400);
    const filePath = path.join(DATA_DIR, filename);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return json(JSON.parse(data));
      }
      // fallback to public/data/
      const publicPath = path.join(ROOT, 'public', 'data', filename);
      if (fs.existsSync(publicPath)) {
        const data = fs.readFileSync(publicPath, 'utf8');
        // seed to server-data for editing
        const parsed = JSON.parse(data);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
        return json(parsed);
      }
      json(null);
    } catch (e) { json({ error: e.message }, 500); }
    return;
  }

  // API: POST /api/data/:filename — save data
  if (method === 'POST' && url.startsWith('/api/data/')) {
    const filename = url.slice('/api/data/'.length);
    if (!filename) return json({ error: 'missing filename' }, 400);
    try {
      const body = await readBody(req);
      const filePath = path.join(DATA_DIR, filename);
      fs.writeFileSync(filePath, body, 'utf8');
      json({ success: true });
    } catch (e) { json({ error: e.message }, 500); }
    return;
  }

  // API: POST /api/upload — upload file (data URL)
  if (method === 'POST' && url === '/api/upload') {
    try {
      const body = JSON.parse(await readBody(req));
      const { filename, data } = body;
      if (!filename || !data) return json({ error: 'missing filename or data' }, 400);
      const filePath = path.join(DATA_DIR, 'uploads', filename);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // data is base64 data URL, store as-is
      fs.writeFileSync(filePath, data, 'utf8');
      json({ success: true, url: data });
    } catch (e) { json({ error: e.message }, 500); }
    return;
  }

  // Static files from out/
  let filePath = path.join(OUT_DIR, decodeURIComponent(url.split('?')[0]));
  if (filePath.endsWith(path.sep) || filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (!path.extname(filePath)) filePath += '.html';

  const ext = path.extname(filePath);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`LoveSpace Server running at http://localhost:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
