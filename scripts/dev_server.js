#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || '8080', 10);

const routeMap = {
  '/': 'Home.html',
  '/about': 'About.html',
  '/legal-framework': 'Legal_Framework.html',
  '/updates': 'The_Chronicle.html',
  '/connect': 'Connect.html',
  '/support': 'Support.html',
  '/privacy': 'Privacy.html',
  '/reports': 'Reports.html',
  '/grievance': 'Grievance.html',
};

const fileToSlug = Object.fromEntries(
  Object.entries(routeMap).map(([slug, file]) => [file, slug])
);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const [rawPath, query] = req.url.split('?');
  const qs = query ? '?' + query : '';
  const cleanPath = rawPath.replace(/\/+$/, '') || '/';

  const now = new Date().toUTCString();
  const log = (msg) => process.stderr.write(`${req.socket.remoteAddress} - [${now}] ${msg}\n`);

  // 301 redirect .html requests to clean URLs
  if (cleanPath.endsWith('.html')) {
    const filename = path.basename(cleanPath);
    if (fileToSlug[filename]) {
      const newSlug = fileToSlug[filename] + qs;
      log(`301 Redirecting: ${req.url} -> ${newSlug}`);
      res.writeHead(301, { Location: newSlug });
      res.end();
      return;
    }
  }

  // Serve clean URL slug -> HTML file
  if (routeMap[cleanPath]) {
    const targetFile = routeMap[cleanPath];
    process.stdout.write(`Serving Clean URL: ${req.url} via ${targetFile}\n`);
    try {
      const content = fs.readFileSync(targetFile);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
      return;
    } catch {
      // fall through to 404
    }
  }

  // Serve physical files (CSS, JS, images, etc.)
  // Guard against path traversal: ensure the resolved path stays within cwd
  const root = path.resolve(process.cwd());
  const filePath = path.resolve(root, '.' + cleanPath);
  if (filePath.startsWith(root + path.sep) || filePath === root) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return;
      } catch {
        // fall through to 404
      }
    }
  }

  // Fallback: serve 404.html
  process.stdout.write(`404 Not Found: ${req.url} -> Serving 404.html\n`);
  try {
    const content = fs.readFileSync('404.html');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Page Not Found');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use.`);
    console.error(`Try running with a different port: node dev_server.js 8085`);
    console.error(`Or kill the existing process using your OS process manager.`);
  } else {
    throw err;
  }
  process.exit(1);
});

// Change working directory to public/ if it exists
if (fs.existsSync('public')) {
  process.chdir('public');
}

server.listen(PORT, () => {
  const separator = '='.repeat(50);
  console.log('\n' + separator);
  console.log('NSCW Web Platform Dev Server (Clean URLs)');
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(separator);
  console.log('Configured Routes:');
  for (const [slug, file] of Object.entries(routeMap)) {
    console.log(`  ${slug.padEnd(18)} -> ${file}`);
  }
  console.log(separator + '\n');
});

process.on('SIGINT', () => {
  console.log('\nShutting down server.');
  server.close(() => process.exit(0));
});
