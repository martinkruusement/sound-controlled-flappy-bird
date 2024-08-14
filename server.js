import { serve } from 'bun';
import { readFileSync } from 'fs';
import { networkInterfaces } from 'os';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

const server = serve({
  port: 3000,
  hostname: '0.0.0.0', // Listen on all network interfaces
  tls: {
    cert,
    key,
  },
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    if (path === '/' || path === '') {
      path = '/index.html';
    }

    try {
      const file = Bun.file(`.${path}`);
      return new Response(file);
    } catch (error) {
      return new Response('Not Found', { status: 404 });
    }
  },
});

console.log(`Server running on:`);
console.log(`- Local: https://localhost:${server.port}`);
console.log(`- Network: https://${localIP}:${server.port}`);

// Open the default browser
Bun.spawn(['open', `https://localhost:${server.port}`]);