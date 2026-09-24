import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const { default: worker } = await import(pathToFileURL(resolve('dist/server/index.js')));
const db = new DatabaseSync(':memory:');
for (const filename of (await readdir('drizzle')).filter(f => f.endsWith('.sql')).sort()) db.exec(await readFile(`drizzle/${filename}`, 'utf8'));
const root = resolve('dist/client');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.txt': 'text/plain', '.png': 'image/png', '.ico': 'image/x-icon' };
const env = {
  CHATGPT_PLATFORM_API_KEY: process.env.CHATGPT_PLATFORM_API_KEY,
  DB: { prepare(sql) { return { bind(...args) { return { first: async () => db.prepare(sql).get(...args) ?? null, run: async () => db.prepare(sql).run(...args) }; } }; } },
  ASSETS: { async fetch(request) {
    try {
      let file = resolve(root, '.' + decodeURIComponent(new URL(request.url).pathname));
      if (file !== root && !file.startsWith(root + sep)) return new Response('Forbidden', {status:403});
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      return new Response(await readFile(file), { headers: { 'Content-Type': mime[extname(file)] || 'application/octet-stream' } });
    } catch { return new Response('Not found', {status:404}); }
  } },
};
const port = Number(process.env.PORT || 3104);
const server = createServer(async (req, res) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
    headers.set('CF-Connecting-IP', req.socket.remoteAddress || 'local');
    const chunks=[]; let size=0;
    for await (const chunk of req) { size += chunk.length; if (size > 24000) { res.writeHead(413).end(); return; } chunks.push(chunk); }
    const request = new Request(`http://127.0.0.1:${port}${req.url}`, { method:req.method, headers, ...(!['GET','HEAD'].includes(req.method) ? {body:Buffer.concat(chunks)} : {}) });
    const response = await worker.fetch(request, env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(500).end('Preview error'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT','SIGTERM']) process.once(signal, () => server.close(() => { db.close(); process.exit(0); }));
