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

  // API: POST /api/admin/bake-config — 将当前配置写入默认前端源码
  if (method === 'POST' && url === '/api/admin/bake-config') {
    try {
      const configPath = path.join(DATA_DIR, 'config.json');
      if (!fs.existsSync(configPath)) {
        return json({ error: 'config.json not found in server-data' }, 404);
      }
      const raw = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(raw);

      // 生成 TypeScript 源码
      function quote(v) {
        if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
        return String(v);
      }

      const fields = [
        'maleName', 'femaleName', 'meetDate', 'loveDate',
        'avatarUrlMale', 'avatarUrlFemale',
        'siteTitle', 'siteName', 'siteDescription', 'footerText',
        'showMeetCount', 'showLoveCount', 'homepageBg', 'siteIcon', 'copyrightText',
      ];

      const entries = fields.map(f => {
        const val = config[f];
        if (val === undefined || val === null) return '';
        return `  ${f}: ${quote(val)},`;
      }).filter(Boolean).join('\n');

      const ts = `// 此文件由管理后台"写入默认配置"功能自动生成，请勿手动修改
// 执行 npm run build 后，这些配置将编译到静态页面中，确保所有设备样式一致
import type { Config } from './data'

export const defaultConfig: Partial<Config> = {
${entries}
}
`;

      const targetPath = path.join(ROOT, 'src', 'lib', 'defaultConfig.ts');
      fs.writeFileSync(targetPath, ts, 'utf8');
      json({ success: true, message: '配置已写入 src/lib/defaultConfig.ts，重新构建后生效' });
    } catch (e) {
      json({ error: e.message }, 500);
    }
    return;
  }

  // API: POST /api/upload — upload file (save to public/uploads/)
  if (method === 'POST' && url === '/api/upload') {
    try {
      const body = JSON.parse(await readBody(req));
      const { filename, data } = body;
      if (!filename || !data) return json({ error: 'missing filename or data' }, 400);
      const ext = path.extname(filename);
      const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, '_');
      const safeName = Date.now() + '-' + base + ext;
      const uploadDir = path.join(ROOT, 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const match = data.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return json({ error: 'invalid data URL' }, 400);
      const buffer = Buffer.from(match[2], 'base64');
      fs.writeFileSync(path.join(uploadDir, safeName), buffer);
      json({ success: true, url: '/uploads/' + safeName });
    } catch (e) { json({ error: e.message }, 500); }
    return;
  }

  // API: POST /api/delete-file — 删除上传的文件
  if (method === 'POST' && url === '/api/delete-file') {
    try {
      const body = JSON.parse(await readBody(req));
      const { url: fileUrl } = body;
      if (!fileUrl || !fileUrl.startsWith('/uploads/')) return json({ error: 'invalid url' }, 400);
      const filename = path.basename(fileUrl);
      const filePath = path.join(ROOT, 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      json({ success: true });
    } catch (e) { json({ error: e.message }, 500); }
    return;
  }

  // Static files: try out/ first, then public/
  let filePath = path.join(OUT_DIR, decodeURIComponent(url.split('?')[0]));
  if (filePath.endsWith(path.sep) || filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (!path.extname(filePath)) filePath += '.html';

  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, 'public', decodeURIComponent(url.split('?')[0]));
  }

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
