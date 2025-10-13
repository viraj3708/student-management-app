const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Parse the URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Construct the file path
  const filePath = path.join(DIST_DIR, pathname);
  
  // Get the file extension
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, try to serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, content) => {
        if (err) {
          console.log(`500: ${err}`);
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
          return;
        }
        
        console.log(`200: ${indexPath} (fallback for ${pathname})`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
      return;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.log(`500: ${err}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
        return;
      }
      
      console.log(`200: ${filePath}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Student Management Application Server`);
  console.log(`====================================================`);
  console.log(`  Server running at:`);
  console.log(`  - Local:    http://localhost:${PORT}`);
  console.log(`  - Network:  http://10.217.230.239:${PORT}`);
  console.log(`====================================================`);
  console.log(`  Press Ctrl+C to stop the server`);
  console.log(`====================================================`);
});