const { spawn } = require('node:child_process');
const { request } = require('node:http');
const path = require('node:path');
const localtunnel = require('localtunnel');

const port = 5175;
const host = '127.0.0.1';
const url = `http://${host}:${port}/`;
const waitTimeoutMs = 10000;
const pollIntervalMs = 250;

function isAlive() {
  return new Promise((resolve) => {
    const req = request({ hostname: host, port, path: '/', method: 'GET', timeout: 1000 }, (res) => {
      res.resume();
      resolve(true);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function waitForServer(timeoutMs) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = async () => {
      if (await isAlive()) {
        resolve(true);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(check, pollIntervalMs);
    };
    check();
  });
}

function startServer() {
  const node = process.execPath;
  const serverPath = path.resolve(__dirname, '..', 'web', 'dev-server.js');
  const child = spawn(node, [serverPath], {
    cwd: path.resolve(__dirname, '..'),
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

(async () => {
  if (!(await isAlive())) {
    console.log('Starting the local dev server...');
    startServer();

    const started = await waitForServer(waitTimeoutMs);
    if (!started) {
      console.error(`Unable to start the dev server within ${waitTimeoutMs / 1000} seconds.`);
      process.exit(1);
    }
  }

  console.log(`Local site is available at ${url}`);

  const subdomain = process.env.LT_SUBDOMAIN || process.env.TUNNEL_SUBDOMAIN;
  if (subdomain) {
    console.log(`Using fixed subdomain: ${subdomain}`);
  }

  const tunnelOptions = {
    port,
    subdomain,
  };

  const tunnel = await localtunnel(tunnelOptions);
  console.log(`Public URL: ${tunnel.url}`);
  console.log('Share this link with anyone who should access the site.');
  console.log('Press Ctrl+C to stop the tunnel.');

  tunnel.on('close', () => {
    console.log('Tunnel closed.');
  });

  process.on('SIGINT', async () => {
    await tunnel.close();
    process.exit(0);
  });
})();
