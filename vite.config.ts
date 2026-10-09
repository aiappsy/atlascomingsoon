import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';
import { sendWelcomeEmailServer, sendVerificationCodeServer } from './src/server/emailServerHandler.ts';

const rootDir = typeof import.meta.dirname === 'string'
  ? import.meta.dirname
  : path.dirname(fileURLToPath(import.meta.url));

const emailMiddleware = async (req: any, res: any, next: any) => {
  if (req.url === '/api/send-welcome-email' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const result = await sendWelcomeEmailServer(payload);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      } catch (err: unknown) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : String(err)
        }));
      }
    });
    return;
  }

  if (req.url === '/api/send-verification-code' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const result = await sendVerificationCodeServer(payload);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      } catch (err: unknown) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : String(err)
        }));
      }
    });
    return;
  }

  next();
};

function emailApiPlugin(): Plugin {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use(emailMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(emailMiddleware);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
